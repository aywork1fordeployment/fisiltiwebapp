import React, { useState, useEffect, useRef } from 'react';
import {
  PlayerRole,
  ChatMessage,
  GamePhase,
  VerdictType,
  AuthorityActionCooldowns,
} from './types/game.types';
import { NoirHeader } from './components/layout/NoirHeader';
import { LegalDisclaimerModal } from './components/layout/LegalDisclaimerModal';
import { LandingHero } from './components/lobby/LandingHero';
import { ConfessionBuilder } from './components/lobby/ConfessionBuilder';
import { SuspectPovCourtroom } from './components/courtroom/SuspectPovCourtroom';
import { JudgePovCourtroom } from './components/courtroom/JudgePovCourtroom';
import { CourtroomBottomSheet } from './components/courtroom/CourtroomBottomSheet';
import { WhisperDrawer } from './components/interrogation/WhisperDrawer';
import { VerdictVotingModal } from './components/verdict/VerdictVotingModal';
import { CaseFileReceipt } from './components/verdict/CaseFileReceipt';
import {
  wsClient,
  serverRoleToPlayerRole,
  serverMsgToChatMessage,
  ServerRoom,
} from './services/roomSync';
import { filterMessage } from './utils/securityFilter';
import { soundEngine } from './engine/soundEngine';

export const App: React.FC = () => {
  // 1. Ekran Aşamaları (lobby -> waiting -> interrogation -> verdict -> receipt)
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [showConfessionBuilder, setShowConfessionBuilder] = useState<boolean>(false);

  // 2. Oda & Oyuncu Bilgileri
  const [roomCode, setRoomCode] = useState<string>('463');
  const [userRole, setUserRole] = useState<PlayerRole>('supheli');
  const [confession, setConfession] = useState<string>('');
  const [confessionCategory, setConfessionCategory] = useState<string>('İş & Para');

  // 3. Zaman & Mesajlar
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 4. Canlı WebSocket Eşleşme Kuyruk Sayaçları
  const [queueCounts, setQueueCounts] = useState<{ suspects: number; judges: number }>({
    suspects: 0,
    judges: 0,
  });
  const [waitingRole, setWaitingRole] = useState<'suspect' | 'judge'>('judge');

  // 5. Kürsü Fısıltıları
  const [isWhisperDrawerOpen, setIsWhisperDrawerOpen] = useState<boolean>(false);
  const [unreadWhispers, setUnreadWhispers] = useState<number>(0);

  // 6. Otorite Cezaları
  const [isSilenced, setIsSilenced] = useState<boolean>(false);
  const [silencedSeconds, setSilencedSeconds] = useState<number>(0);
  const [isYesNoClamp, setIsYesNoClamp] = useState<boolean>(false);
  const [isTimerClamp, setIsTimerClamp] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // 7. Hakim Buton Cooldowns
  const [cooldowns, setCooldowns] = useState<AuthorityActionCooldowns>({
    slam: 0,
    yesNo: 0,
    timer: 0,
    spotlight: 0,
  });

  // 8. Canlı Animasyon Durumları (Lip-sync & Katip Daktilo)
  const [activeSpeaker, setActiveSpeaker] = useState<PlayerRole | null>(null);
  const [speakingRole, setSpeakingRole] = useState<PlayerRole | null>(null);
  const [isKatipTyping, setIsKatipTyping] = useState<boolean>(false);
  const [prosecutorState, setProsecutorState] = useState<'idle' | 'slam' | 'point' | 'whisper'>('idle');
  const [isWhispering, setIsWhispering] = useState<boolean>(false);

  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  // 9. Nihai Hüküm
  const [finalVerdict, setFinalVerdict] = useState<VerdictType | null>(null);
  const [verdictReason, setVerdictReason] = useState<string>('');

  const typingClearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speakingClearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevWhisperCountRef = useRef<number>(0);

  // 10. WebSocket Bağlantısı ve Olay Dinleyicileri
  useEffect(() => {
    try {
      const accepted = sessionStorage.getItem('fisilti_legal_accepted');
      if (!accepted) {
        setShowLegalModal(true);
      }
    } catch {
      // ignore
    }

    // Canlı Kuyruk Durumu
    wsClient.onQueueStatus((data) => {
      setQueueCounts({
        suspects: data.suspects,
        judges: data.judges,
      });
    });

    // 3 Cihaza Eşzamanlı Gelen Eşleşme Emri
    wsClient.onMatchFound((data) => {
      const mappedRole = serverRoleToPlayerRole(data.role);
      setUserRole(mappedRole);
      setRoomCode(data.room.roomId);
      setConfession(data.room.confession);
      setConfessionCategory(data.room.category || 'İş & Para');
      setTimeLeft(data.room.timeLeft);

      const mainMsgs = (data.room.messages || []).map((m) => serverMsgToChatMessage(m, 'main'));
      const whisperMsgs = (data.room.whispers || []).map((w) => serverMsgToChatMessage(w, 'whisper'));
      setMessages([...mainMsgs, ...whisperMsgs]);

      setFinalVerdict(null);
      setVerdictReason('');
      setShowConfessionBuilder(false);
      setIsWhisperDrawerOpen(false);
      setUnreadWhispers(0);
      prevWhisperCountRef.current = 0;
      setIsSilenced(false);
      setIsYesNoClamp(false);
      setIsTimerClamp(false);
      setPhase('interrogation');
      soundEngine.playTypewriter();
    });

    // Canlı Yazma Bildirimi (Katip & Lip-sync)
    wsClient.onUserTyping((data) => {
      if (data.isTyping) {
        setIsKatipTyping(true);
        setSpeakingRole(data.role as PlayerRole);
        soundEngine.playTypewriter();
        if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
        typingClearTimerRef.current = setTimeout(() => {
          setIsKatipTyping(false);
          setSpeakingRole(null);
        }, 2500);
      } else {
        setIsKatipTyping(false);
        setSpeakingRole(null);
      }
    });

    // Oda Güncellemesi
    wsClient.onRoomUpdate((room: ServerRoom) => {
      if (room.role) {
        setUserRole(serverRoleToPlayerRole(room.role));
      }
      setTimeLeft(room.timeLeft);
      setIsWhispering(room.isWhispering);

      const mainMsgs = (room.messages || []).map((m) => serverMsgToChatMessage(m, 'main'));
      const whisperMsgs = (room.whispers || []).map((w) => serverMsgToChatMessage(w, 'whisper'));
      const combined = [...mainMsgs, ...whisperMsgs];

      setMessages((prevMsgs) => {
        const prevMain = prevMsgs.filter((m) => m.channel === 'main');

        // Yeni ana mesaj geldiğinde konuşma ve daktilo animasyonunu 3.5 sn tetikle
        if (mainMsgs.length > prevMain.length) {
          const latestMsg = mainMsgs[mainMsgs.length - 1];
          if (latestMsg && latestMsg.senderRole !== 'system' && latestMsg.senderRole !== 'katip') {
            const sender = latestMsg.senderRole as PlayerRole;
            setActiveSpeaker(sender);
            setSpeakingRole(sender);
            setIsKatipTyping(true);
            soundEngine.playTypewriter();

            if (speakingClearTimerRef.current) clearTimeout(speakingClearTimerRef.current);
            speakingClearTimerRef.current = setTimeout(() => {
              setActiveSpeaker(null);
              setSpeakingRole(null);
              setIsKatipTyping(false);
            }, 3500);
          }
        }

        // Yeni fısıltı kontrolü (whisperCount veya whisperMsgs uzunluğuna göre)
        const currentWhisperCount = room.whisperCount ?? whisperMsgs.length;
        if (currentWhisperCount > prevWhisperCountRef.current) {
          prevWhisperCountRef.current = currentWhisperCount;
          soundEngine.playWhisperTick();
          if (userRole === 'supheli' || userRole === 'suspect') {
            setStatusText('👁️ Hakimler şu an kürsüde senin hakkında fısıldaşıyor...');
            setTimeout(() => setStatusText(null), 3500);
          } else if (!isWhisperDrawerOpen) {
            setUnreadWhispers((u) => u + 1);
          }
        }

        return combined;
      });

      // Aktif Otorite Cezası
      if (room.activePenalty && room.activePenalty.expiresAt > Date.now()) {
        const rem = Math.max(0, Math.ceil((room.activePenalty.expiresAt - Date.now()) / 1000));
        if (room.activePenalty.type === 'mute') {
          setIsSilenced(rem > 0);
          setSilencedSeconds(rem);
          setIsYesNoClamp(false);
          setIsTimerClamp(false);
          setProsecutorState('slam');
          soundEngine.playGavelSlam();
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 200);
          setTimeout(() => setProsecutorState('idle'), 2500);
        } else if (room.activePenalty.type === 'eh') {
          setIsYesNoClamp(true);
          setIsSilenced(false);
          setIsTimerClamp(false);
          soundEngine.playChainLock();
          setProsecutorState('point');
          setTimeout(() => setProsecutorState('idle'), 2500);
        } else if (room.activePenalty.type === 'timer5') {
          setIsTimerClamp(rem > 0);
          setTimerSeconds(rem);
          setIsSilenced(false);
          setIsYesNoClamp(false);
          soundEngine.playCountdownBeep(1.5);
        }
      } else {
        setIsSilenced(false);
        setSilencedSeconds(0);
        setIsYesNoClamp(false);
        setIsTimerClamp(false);
        setTimerSeconds(0);
        setProsecutorState('idle');
      }

      // Duruşma Sona Erdiğinde
      if (room.status === 'ended') {
        const verdictStamp = (room.verdict?.stamp as VerdictType) || 'KATIKSIZ TOKSİK';
        const reasonText = room.verdict?.reason || '180 saniyelik duruşma süresi sona erdi.';
        setFinalVerdict(verdictStamp);
        setVerdictReason(reasonText);
        setPhase('receipt');
        soundEngine.playStampSlam();
      }
    });
  }, [userRole, isWhisperDrawerOpen]);

  // Cooldown & Saniye Azaltma
  useEffect(() => {
    if (phase !== 'interrogation') return;
    const interval = setInterval(() => {
      setCooldowns((prev) => ({
        slam: Math.max(0, prev.slam - 1),
        yesNo: Math.max(0, prev.yesNo - 1),
        timer: Math.max(0, prev.timer - 1),
        spotlight: Math.max(0, prev.spotlight - 1),
      }));
      setSilencedSeconds((s) => Math.max(0, s - 1));
      setTimerSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleAcceptLegal = () => {
    try {
      sessionStorage.setItem('fisilti_legal_accepted', 'true');
    } catch {
      // ignore
    }
    setShowLegalModal(false);
  };

  /**
   * Kuyruğa Giriş (JOIN_QUEUE)
   */
  const handleStartQueue = (roleType: 'suspect' | 'judge', userConf?: string, cat?: string) => {
    setWaitingRole(roleType);
    setUserRole(roleType === 'suspect' ? 'supheli' : 'sert_hakim');
    setPhase('waiting');

    const activeConf = userConf || 'İş yerinde terfi almak için arkadaşımın projesini kendim yaptım dedim.';
    const activeCat = cat || 'İş & Para';

    if (roleType === 'suspect') {
      wsClient.joinQueue('supheli', activeConf, activeCat);
    } else {
      wsClient.joinQueue('hakim');
    }
  };

  const handleCancelQueue = () => {
    wsClient.leaveQueue();
    setPhase('lobby');
  };

  const handleForceStart1v1 = () => {
    wsClient.forceStart1v1();
  };

  const handleResetStorage = () => {
    wsClient.leaveQueue();
    setPhase('lobby');
    setShowConfessionBuilder(false);
    setQueueCounts({ suspects: 0, judges: 0 });
    setFinalVerdict(null);
    setVerdictReason('');
  };

  const handleSelectJudgeRole = () => {
    handleStartQueue('judge');
  };

  const handleConfirmSuspectConfession = (chosenConfession: string, category: string) => {
    handleStartQueue('suspect', chosenConfession, category);
  };

  // Mesaj Gönderme
  const handleSendMessage = (text: string) => {
    const clean = filterMessage(text);
    if (!clean) return;
    wsClient.sendChatMessage(clean);
  };

  const handleSendWhisper = (text: string) => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    const clean = filterMessage(text);
    if (!clean) return;
    wsClient.sendWhisperMessage(clean);
  };

  const handleUserTyping = (isTyping: boolean) => {
    wsClient.sendTypingStatus(isTyping);
  };

  // Otorite Aksiyonları (SADECE HAKİMLER!)
  const handleSlam = () => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    setCooldowns((prev) => ({ ...prev, slam: 25 }));
    const judgeLabel = userRole === 'yumusak_hakim' ? '2. HAKİM' : '1. HAKİM';
    wsClient.applyPenalty('mute', 7, `🔨 [${judgeLabel} TOKMAĞI VURDU! Şüpheli 7 saniye susturuldu.]`);
  };

  const handleYesNo = () => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    setCooldowns((prev) => ({ ...prev, yesNo: 20 }));
    const judgeLabel = userRole === 'yumusak_hakim' ? '2. HAKİM' : '1. HAKİM';
    wsClient.applyPenalty('eh', 15, `⚖️ [${judgeLabel} TEK KELİME KISKACI UYGULADI! Şüpheli sadece Evet veya Hayır diyebilir.]`);
  };

  const handleTimer = () => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    setCooldowns((prev) => ({ ...prev, timer: 15 }));
    const judgeLabel = userRole === 'yumusak_hakim' ? '2. HAKİM' : '1. HAKİM';
    wsClient.applyPenalty('timer5', 5, `⏱️ [${judgeLabel} 5 SANİYE BASKISI UYGULADI! Şüpheli hemen cevap vermelidir.]`);
  };

  const handleEarlyVerdict = () => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    setPhase('verdict');
  };

  const handleDecideVerdict = (verdict: VerdictType, reason: string) => {
    if (userRole === 'supheli' || userRole === 'suspect') return;
    wsClient.submitVerdict(verdict, reason);
  };

  const handleRestart = () => {
    wsClient.leaveQueue();
    setPhase('lobby');
    setMessages([]);
    setFinalVerdict(null);
    setVerdictReason('');
    setShowConfessionBuilder(false);
    setIsWhisperDrawerOpen(false);
    setUnreadWhispers(0);
  };

  const isSuspect = userRole === 'supheli' || userRole === 'suspect';

  return (
    <div className="w-full h-[100dvh] bg-[#0A0706] flex items-center justify-center overflow-hidden font-sans">
      {/* 1. Hukuki Beyan Modalı */}
      <LegalDisclaimerModal isOpen={showLegalModal} onAccept={handleAcceptLegal} />

      {/* 2. MERKEZİ MAHKEME SALONU KABİNİ (sample.jpg Kurgusu) */}
      <div
        className={`max-w-3xl mx-auto w-full h-[100dvh] flex flex-col bg-[#0E0B09] border-x border-amber-900/20 shadow-2xl relative overflow-hidden ${
          screenShake ? 'animate-screen-shake' : ''
        }`}
      >
        {/* LOBİ VE BEKLEME ('waiting') AŞAMALARI */}
        {(phase === 'lobby' || phase === 'waiting') && (
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-3">
            {showConfessionBuilder && phase === 'lobby' ? (
              <ConfessionBuilder
                onConfirm={handleConfirmSuspectConfession}
                onBack={() => setShowConfessionBuilder(false)}
              />
            ) : (
              <LandingHero
                onSelectRole={handleSelectJudgeRole}
                onOpenConfessionBuilder={() => setShowConfessionBuilder(true)}
                isWaitingInQueue={phase === 'waiting'}
                waitingRole={waitingRole}
                queueCounts={queueCounts}
                onCancelQueue={handleCancelQueue}
                onForceStart1v1={handleForceStart1v1}
                onResetStorage={handleResetStorage}
              />
            )}
          </div>
        )}

        {/* CANLI ASİMETRİK MAHKEME SALONU DURUŞMASI */}
        {(phase === 'interrogation' || phase === 'verdict') && (
          <div className="relative flex-1 flex flex-col h-full overflow-hidden">
            {/* Üst HUD Barı */}
            <NoirHeader
              roomCode={roomCode}
              timeLeft={timeLeft}
              userRole={userRole}
              unreadWhispersCount={unreadWhispers}
              onOpenWhisperDrawer={() => {
                setIsWhisperDrawerOpen(true);
                setUnreadWhispers(0);
              }}
            />

            {/* ASİMETRİK KAMERA AÇISI (POV) SAHNESİ */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              {isSuspect ? (
                /* ŞÜPHELİ EKRANI: Yüksek Maun Kürsü, 1. & 2. Hakim, Katip (sample.jpg Sol) */
                <SuspectPovCourtroom
                  activeSpeaker={activeSpeaker}
                  speakingRole={speakingRole}
                  isWhispering={isWhispering}
                  isKatipTyping={isKatipTyping}
                  prosecutorState={prosecutorState}
                  statusText={statusText}
                  isSilenced={isSilenced}
                  silencedSeconds={silencedSeconds}
                  isYesNoClamp={isYesNoClamp}
                  isTimerClamp={isTimerClamp}
                  timerSeconds={timerSeconds}
                />
              ) : (
                /* HAKİMLER EKRANI: Spot Işığı, Sanık Kürsüsü, Mikrofon, Şüpheli (sample.jpg Sağ) */
                <JudgePovCourtroom
                  activeSpeaker={activeSpeaker}
                  speakingRole={speakingRole}
                  isSilenced={isSilenced}
                  isYesNoClamp={isYesNoClamp}
                  isTimerClamp={isTimerClamp}
                  timerSeconds={timerSeconds}
                  confession={confession}
                />
              )}
            </div>

            {/* SÜRÜKLENEBİLİR CAM MAHKEME TUTANAĞI ÇEKMECESİ (BOTTOM SHEET) */}
            <CourtroomBottomSheet
              userRole={userRole}
              messages={messages}
              confession={confession}
              isKatipTyping={isKatipTyping}
              cooldowns={cooldowns}
              onSendMessage={handleSendMessage}
              onSlam={handleSlam}
              onYesNo={handleYesNo}
              onTimer={handleTimer}
              onVerdict={handleEarlyVerdict}
              isSilenced={isSilenced}
              silencedSeconds={silencedSeconds}
              isYesNoClamp={isYesNoClamp}
              isTimerClamp={isTimerClamp}
              timerSeconds={timerSeconds}
              onTyping={handleUserTyping}
            />

            {/* Aynanın Arkası / Kürsü Fısıltıları Çekmecesi */}
            <WhisperDrawer
              isOpen={isWhisperDrawerOpen}
              onClose={() => setIsWhisperDrawerOpen(false)}
              messages={messages}
              userRole={userRole}
              isRevealed={phase === 'verdict'}
              onSendWhisper={handleSendWhisper}
            />

            {/* Hüküm Oylama Modalı */}
            <VerdictVotingModal
              isOpen={phase === 'verdict'}
              userRole={userRole}
              onDecideVerdict={handleDecideVerdict}
              onClose={() => setPhase('interrogation')}
            />
          </div>
        )}

        {/* DAVA DOSYASI (RECEIPT) AŞAMASI */}
        {phase === 'receipt' && finalVerdict && (
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex items-center justify-center">
            <CaseFileReceipt
              roomCode={roomCode}
              confession={confession}
              category={confessionCategory}
              verdict={finalVerdict}
              verdictReason={verdictReason}
              messages={messages}
              userRole={userRole}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
