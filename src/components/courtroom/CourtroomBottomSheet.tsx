import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PlayerRole, AuthorityActionCooldowns } from '../../types/game.types';
import { Send, AlertTriangle, Check, X, Paperclip, ChevronUp, ChevronDown } from 'lucide-react';

interface CourtroomBottomSheetProps {
  userRole: PlayerRole;
  messages: ChatMessage[];
  confession?: string;
  isKatipTyping: boolean;
  cooldowns: AuthorityActionCooldowns;
  onSendMessage: (text: string) => void;
  onSlam: () => void;
  onYesNo: () => void;
  onTimer: () => void;
  onVerdict: () => void;
  isSilenced: boolean;
  silencedSeconds: number;
  isYesNoClamp: boolean;
  isTimerClamp: boolean;
  timerSeconds: number;
  onTyping?: (isTyping: boolean) => void;
}

export type SheetHeightMode = 'compact' | 'standard' | 'expanded';

export const CourtroomBottomSheet: React.FC<CourtroomBottomSheetProps> = ({
  userRole,
  messages,
  confession,
  isKatipTyping,
  cooldowns,
  onSendMessage,
  onSlam,
  onYesNo,
  onTimer,
  onVerdict,
  isSilenced,
  silencedSeconds,
  isYesNoClamp,
  isTimerClamp,
  timerSeconds,
  onTyping,
}) => {
  const [heightMode, setHeightMode] = useState<SheetHeightMode>('standard');
  const [isConfessionOpen, setIsConfessionOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isJudge = userRole === 'sert_hakim' || userRole === 'yumusak_hakim' || userRole === 'prosecutor' || userRole === 'detective';
  const isSuspectSilenced = !isJudge && isSilenced;

  const JUDGE_QUICK_QUESTIONS = [
    { label: '❓ Neden yalan söyledin?', text: 'Neden yalan söyledin? Gözlerimin içine bakarak doğruyu söyle!' },
    { label: '🔍 Kanıtın var mı?', text: 'Bu anlattıklarını doğrulayacak tek bir somut kanıtın var mı?' },
    { label: '⚡ Çelişiyorsun!', text: 'Az önce söylediğinle şu anki ifaden tamamen birbiriyle çelişiyor!' },
    { label: '⚖️ Son şansın!', text: 'Mahkeme heyetini kandıramazsın, gerçeği itiraf etmen için bu son şansın!' },
  ];

  const SUSPECT_QUICK_DEFENSES = [
    { label: '✋ İtirazım Var!', text: '✋ İtiraz ediyorum! Sorularınız tamamen önyargılı, savunmamı dinlemiyorsunuz!' },
    { label: '😇 Masumum!', text: '😇 Yemin ederim kötü bir niyetim yoktu, şartlar beni buna mecbur bıraktı!' },
    { label: '🔍 Kanıt Nerede?', text: '🔍 Neye dayanarak beni suçluyorsunuz? Elinizde somut bir kanıt var mı?' },
    { label: '🙏 İnsaf Edin!', text: '🙏 Hatamı kabul ediyorum ama yerimde kim olsa aynı şeyi yapardı, insaf edin!' },
  ];

  // Sadece ana tutanak mesajlarını filtrele (fısıltılar ve üstte sabitlenen itiraf hariç)
  const transcriptMessages = messages.filter(
    (m) =>
      m.channel === 'main' &&
      !m.content.includes('İTİRAF / İDDİA DOSYASI:') &&
      !m.content.includes('GİZLİ İTİRAF DOSYASI:')
  );

  // Otomatik aşağı kaydırma
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptMessages.length, isKatipTyping]);

  // Sadece şüpheli susturulduğunda inputu temizle (Hakimlerin klavyesi asla kilitlenmez!)
  useEffect(() => {
    if (isSuspectSilenced) {
      setInputText('');
    }
  }, [isSuspectSilenced]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSuspectSilenced || !inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (onTyping) onTyping(false);
  };

  const handleYesNoSubmit = (choice: 'EVET' | 'HAYIR') => {
    onSendMessage(choice);
  };

  const handleQuickAction = (text: string) => {
    if (isSuspectSilenced || isInputFocused) return;
    onSendMessage(text);
  };

  const handleAuthorityClick = (action: () => void) => {
    // Klavyede yazı yazarken elin kazara tokmağa/butonlara çarpmasını engeller
    if (isInputFocused) return;
    action();
  };

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      setIsInputFocused(false);
    }, 180);
  };

  const cycleHeightMode = () => {
    if (heightMode === 'standard') {
      setHeightMode('expanded');
      setIsConfessionOpen(true);
    } else if (heightMode === 'expanded') {
      setHeightMode('compact');
      setIsConfessionOpen(false);
    } else {
      setHeightMode('standard');
    }
  };

  const showFullConfession = isConfessionOpen || heightMode === 'expanded';

  const heightClasses = {
    compact: 'h-[190px]',
    standard: 'h-[370px] sm:h-[390px]',
    expanded: 'h-[80dvh]',
  };

  return (
    <div
      className={`absolute bottom-0 inset-x-0 w-full ${heightClasses[heightMode]} bg-[#14110F]/95 backdrop-blur-xl border-t border-amber-500/25 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-300 ease-out z-20`}
    >
      {/* 1. ÜST TUTAMAÇ ÇUBUĞU (DRAG HANDLE) */}
      <div
        onClick={cycleHeightMode}
        className="w-full pt-2 pb-1.5 flex flex-col items-center justify-center cursor-pointer group select-none shrink-0"
        title="Boyutu değiştirmek için tıkla (Küçük / Orta / Büyük)"
      >
        <div className="w-12 h-1.5 bg-amber-100/25 group-hover:bg-amber-100/50 rounded-full transition-all group-active:scale-95 shadow-sm" />
        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-200/60 group-hover:text-amber-200/90 mt-0.5 tracking-wider uppercase">
          {heightMode === 'compact' && (
            <>
              <span>Mahkeme Tutanağını Genişlet</span>
              <ChevronUp className="w-3 h-3" />
            </>
          )}
          {heightMode === 'standard' && (
            <>
              <span>Tam Tutanak & İtiraf Dosyası</span>
              <ChevronUp className="w-3 h-3" />
            </>
          )}
          {heightMode === 'expanded' && (
            <>
              <span>Sahne Görünümüne Küçült</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </div>
      </div>

      {/* 2. TÜM MODLARDA SABİT & TIKLANINCA GENİŞLEYEN İTİRAF DOSYASI KARTI */}
      {confession && (
        <div
          onClick={() => setIsConfessionOpen((prev) => !prev)}
          className="px-3 sm:px-4 py-2 shrink-0 border-b border-amber-500/25 bg-[#1A130E] hover:bg-[#221912] cursor-pointer transition-colors shadow-sm select-text"
          title="İtirafın tamamını açmak/kapatmak için dokun"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <div className="w-5 h-5 mt-0.5 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
                <Paperclip className="w-3 h-3 -rotate-45" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase mr-1.5">
                  📂 GİZLİ İTİRAF:
                </span>
                <span
                  className={`text-[12.5px] sm:text-[13.5px] text-amber-50/95 font-medium italic leading-snug ${
                    showFullConfession
                      ? 'whitespace-normal break-words block mt-1'
                      : 'line-clamp-1 sm:line-clamp-1 inline'
                  }`}
                >
                  "{confession}"
                </span>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 text-[9px] font-bold text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded bg-amber-950/60 uppercase flex items-center gap-0.5 mt-0.5"
            >
              <span>{showFullConfession ? 'KÜÇÜLT' : 'OKU'}</span>
              {showFullConfession ? (
                <ChevronUp className="w-2.5 h-2.5" />
              ) : (
                <ChevronDown className="w-2.5 h-2.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. SİNEMATİK MAHKEME TUTANAĞI AKIŞI (DİYALOG LİSTESİ) */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-2 flex flex-col gap-2 text-sm select-text no-scrollbar">
        {transcriptMessages.map((msg) => {
          let speakerLabel = 'KATİP:';
          let labelColor = 'text-amber-200/70 italic';
          let textColor = 'text-amber-100/90 italic';

          if (msg.senderRole === 'supheli' || msg.senderRole === 'suspect') {
            speakerLabel = 'ŞÜPHELİ:';
            labelColor = 'text-amber-400 font-bold';
            textColor = 'text-zinc-100 font-normal';
          } else if (msg.senderRole === 'sert_hakim' || msg.senderRole === 'prosecutor') {
            speakerLabel = '1. HAKİM:';
            labelColor = 'text-rose-400 font-bold';
            textColor = 'text-zinc-100 font-normal';
          } else if (msg.senderRole === 'yumusak_hakim' || msg.senderRole === 'detective') {
            speakerLabel = '2. HAKİM:';
            labelColor = 'text-orange-300 font-bold';
            textColor = 'text-zinc-100 font-normal';
          }

          const isSystem = msg.senderRole === 'system' || msg.senderRole === 'katip';

          return (
            <div key={msg.id} className="py-0.5 text-[14px] sm:text-[15px] leading-snug break-words">
              <span className={`font-bold tracking-wide mr-1.5 inline-block align-baseline ${labelColor}`}>
                {speakerLabel}
              </span>
              <span className={`align-baseline ${isSystem ? 'text-amber-200/90 italic' : textColor}`}>
                {msg.content}
              </span>
            </div>
          );
        })}

        {/* KATİP DAKTİLO SESLERİ (CANLI YAZMA EFEKTİ) */}
        {isKatipTyping && (
          <div className="py-0.5 text-[14px] sm:text-[15px] leading-snug text-amber-200/80 italic animate-pulse">
            <span className="font-bold tracking-wide text-amber-400/90 mr-1.5 inline-block align-baseline">
              KATİP:
            </span>
            <span className="font-normal align-baseline">
              (Daktilo sesleri)...
            </span>
            <span className="w-1.5 h-3 bg-amber-400 animate-ping inline-block ml-1 align-middle" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 4. ALT KONTROLLER VE BUTONLAR (YUKARI ALINMIŞ FERAH UX & KAZARA DOKUNMA KORUMASI) */}
      <div className="shrink-0 bg-[#0F0D0B] border-t border-amber-900/35 flex flex-col px-2.5 sm:px-3.5 pt-2.5 pb-3.5 sm:pb-4 gap-3">
        
        {/* ============================================================== */}
        {/* A. SADECE HAKİMLER: 4 OTORİTE BUTONU + HIZLI SORGU ÇİPLERİ     */}
        {/* ============================================================== */}
        {isJudge && (
          <div
            className={`flex flex-col gap-2.5 pb-2.5 border-b border-amber-500/15 transition-opacity duration-200 ${
              isInputFocused ? 'opacity-45' : 'opacity-100'
            }`}
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 select-none">
              {/* 1. 🔨 [7s] SUSTUR */}
              <button
                type="button"
                onClick={() => handleAuthorityClick(onSlam)}
                disabled={cooldowns.slam > 0}
                className={`h-[62px] sm:h-[66px] px-1.5 py-2 rounded-xl border flex flex-col items-center justify-between overflow-hidden transition-all active:scale-95 ${
                  cooldowns.slam > 0
                    ? 'bg-[#181112]/60 border-rose-900/20 text-stone-600 cursor-not-allowed'
                    : 'bg-gradient-to-b from-[#2A1215] to-[#1A0B0D] hover:from-[#3D181C] border-rose-500/45 hover:border-rose-400 text-rose-100 shadow-inner'
                }`}
                title="Masaya vur ve şüphelinin klavyesini 7 saniye kilitle"
              >
                <div className="flex items-center justify-center gap-1 leading-none">
                  <span className="text-xs sm:text-sm">🔨</span>
                  <span className="text-rose-400 text-[9.5px] sm:text-[10px] font-mono font-bold">[7s]</span>
                </div>
                <span className="text-[11px] sm:text-[13px] font-extrabold tracking-tight whitespace-nowrap leading-none">
                  SUSTUR
                </span>
                <span className="text-[9px] sm:text-[10px] text-rose-300/80 font-medium whitespace-nowrap leading-none">
                  {cooldowns.slam > 0 ? `Bekle: ${cooldowns.slam}s` : 'Klavye Kilidi'}
                </span>
              </button>

              {/* 2. ⚖️ [15s] EVET / HAYIR */}
              <button
                type="button"
                onClick={() => handleAuthorityClick(onYesNo)}
                disabled={cooldowns.yesNo > 0}
                className={`h-[62px] sm:h-[66px] px-1.5 py-2 rounded-xl border flex flex-col items-center justify-between overflow-hidden transition-all active:scale-95 ${
                  cooldowns.yesNo > 0
                    ? 'bg-[#18140E]/60 border-amber-900/20 text-stone-600 cursor-not-allowed'
                    : 'bg-gradient-to-b from-[#261E14] to-[#17120C] hover:from-[#362A1B] border-amber-500/45 hover:border-amber-400 text-amber-100 shadow-inner'
                }`}
                title="Şüphelinin klavyesini kapatıp tek kelimelik EVET/HAYIR butonları ver"
              >
                <div className="flex items-center justify-center gap-1 leading-none">
                  <span className="text-xs sm:text-sm">⚖️</span>
                  <span className="text-amber-400 text-[9.5px] sm:text-[10px] font-mono font-bold">[15s]</span>
                </div>
                <span className="text-[10.5px] sm:text-[12.5px] font-extrabold tracking-tighter whitespace-nowrap leading-none">
                  EVET / HAYIR
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-300/80 font-medium whitespace-nowrap leading-none">
                  {cooldowns.yesNo > 0 ? `Bekle: ${cooldowns.yesNo}s` : 'Tek Kelime'}
                </span>
              </button>

              {/* 3. ⏱️ 5 SN BASKI */}
              <button
                type="button"
                onClick={() => handleAuthorityClick(onTimer)}
                disabled={cooldowns.timer > 0}
                className={`h-[62px] sm:h-[66px] px-1.5 py-2 rounded-xl border flex flex-col items-center justify-between overflow-hidden transition-all active:scale-95 ${
                  cooldowns.timer > 0
                    ? 'bg-[#161210]/60 border-orange-900/20 text-stone-600 cursor-not-allowed'
                    : 'bg-gradient-to-b from-[#241A16] to-[#140E0C] hover:from-[#33241E] border-orange-400/40 hover:border-orange-300 text-orange-100 shadow-inner'
                }`}
                title="5 saniye içinde cevap veremezse gözlerini kaçırdı sayılır"
              >
                <div className="flex items-center justify-center gap-1 leading-none">
                  <span className="text-xs sm:text-sm">⏱️</span>
                  <span className="text-orange-400 text-[9.5px] sm:text-[10px] font-mono font-bold">[5s]</span>
                </div>
                <span className="text-[11px] sm:text-[13px] font-extrabold tracking-tight whitespace-nowrap leading-none">
                  5 SN BASKI
                </span>
                <span className="text-[9px] sm:text-[10px] text-orange-300/80 font-medium whitespace-nowrap leading-none">
                  {cooldowns.timer > 0 ? `Bekle: ${cooldowns.timer}s` : 'Tereddüt'}
                </span>
              </button>

              {/* 4. 🚨 HÜKÜM VER (SADECE HAKİMLER!) */}
              <button
                type="button"
                onClick={() => handleAuthorityClick(onVerdict)}
                className="h-[62px] sm:h-[66px] px-1.5 py-2 rounded-xl border border-amber-400/70 hover:border-amber-300 bg-gradient-to-b from-amber-500/25 via-amber-700/20 to-[#1F160E] hover:from-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex flex-col items-center justify-between overflow-hidden transition-all active:scale-95"
                title="Sorguyu tamamla, gerekçeli kararı yaz ve nihai damgayı bas"
              >
                <div className="flex items-center justify-center gap-1 leading-none">
                  <span className="text-xs sm:text-sm">🚨</span>
                  <span className="text-amber-300 text-[9.5px] sm:text-[10px] font-mono font-bold">KARAR</span>
                </div>
                <span className="text-[11px] sm:text-[13px] font-extrabold tracking-tight whitespace-nowrap leading-none">
                  HÜKÜM VER
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-300/85 font-medium whitespace-nowrap leading-none">
                  Damgala
                </span>
              </button>
            </div>

            {/* Hakimlere Özel Hızlı Çapraz Sorgu Çipleri */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar select-none pt-0.5">
              {JUDGE_QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickAction(q.text)}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/55 border border-rose-500/30 text-rose-200 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all active:scale-95"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* B. SADECE ŞÜPHELİ: SAVUNMA HAMLELERİ VEYA CEZA KISKAÇLARI      */}
        {/* ============================================================== */}
        {!isJudge && (
          <div
            className={`flex flex-col gap-2 pb-2 border-b border-amber-500/15 transition-opacity duration-200 ${
              isInputFocused ? 'opacity-45' : 'opacity-100'
            }`}
          >
            {/* 5 Saniye Tereddüt Baskısı Geri Sayım Uyarısı */}
            {isTimerClamp && timerSeconds > 0 && (
              <div className="w-full bg-orange-950/80 border border-orange-500/70 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-extrabold text-orange-200 animate-pulse">
                <span>⏱️ TEREDDÜT BASKISI! Hemen cevap ver:</span>
                <span className="bg-orange-600 text-white px-2.5 py-0.5 rounded-md font-mono">
                  {timerSeconds}s
                </span>
              </div>
            )}

            {/* Şüpheliye Özel Hızlı Savunma Hamlesi Butonları (Kıskaç yokken görünür) */}
            {!isYesNoClamp && (
              <div className="grid grid-cols-4 gap-2 select-none">
                {SUSPECT_QUICK_DEFENSES.map((def) => (
                  <button
                    key={def.label}
                    type="button"
                    disabled={isSuspectSilenced}
                    onClick={() => handleQuickAction(def.text)}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] sm:text-xs font-bold whitespace-nowrap truncate transition-all active:scale-95 ${
                      isSuspectSilenced
                        ? 'bg-stone-900/50 border-white/5 text-stone-600 cursor-not-allowed'
                        : 'bg-amber-950/40 hover:bg-amber-900/55 border-amber-500/35 text-amber-200 shadow-sm'
                    }`}
                    title={def.text}
                  >
                    {def.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* C. ŞÜPHELİ EVET / HAYIR KISKACI MODU VEYA MESAJ GİRİŞ ÇUBUĞU  */}
        {/* ============================================================== */}
        {!isJudge && isYesNoClamp ? (
          <div className="w-full bg-[#1C140D] border border-amber-500/50 rounded-xl p-3 flex flex-col gap-2.5 select-none shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <div className="text-xs font-extrabold text-amber-300 text-center flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>HAKİM TEK KELİME KISKACI UYGULADI! Seçimini yap:</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleYesNoSubmit('EVET')}
                className="flex-1 min-h-[48px] bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 border border-emerald-400/60 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>EVET</span>
              </button>
              <button
                type="button"
                onClick={() => handleYesNoSubmit('HAYIR')}
                className="flex-1 min-h-[48px] bg-gradient-to-b from-rose-700 to-rose-900 hover:from-rose-600 border border-rose-400/60 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>HAYIR</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex items-center gap-2.5 pt-0.5">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={isSuspectSilenced}
                maxLength={140}
                placeholder={
                  isSuspectSilenced
                    ? `🔒 Hakim tokmağı vurdu! Klavyen kilitli (${silencedSeconds}s)`
                    : isJudge
                    ? 'Hakim olarak çapraz sorgu sorusu sor...'
                    : 'Şüpheli olarak savunmanı tutanağa geçir...'
                }
                className={`w-full h-11 sm:h-12 pl-3.5 pr-12 rounded-xl border text-[13.5px] sm:text-sm transition-all focus:outline-none ${
                  isSuspectSilenced
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300 placeholder-rose-400/60 cursor-not-allowed'
                    : isJudge
                    ? 'bg-[#0D0B0A]/95 border-rose-500/30 focus:border-rose-400 text-[#F5F2EB] placeholder-rose-200/40 shadow-inner'
                    : 'bg-[#0D0B0A]/95 border-amber-400/30 focus:border-amber-400 text-[#F5F2EB] placeholder-amber-100/40 shadow-inner'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] font-mono text-amber-200/40 pointer-events-none">
                {inputText.length}/140
              </span>
            </div>

            <button
              type="submit"
              disabled={isSuspectSilenced || !inputText.trim()}
              className={`h-11 sm:h-12 px-4 sm:px-5 rounded-xl font-bold flex items-center justify-center shrink-0 transition-all ${
                isSuspectSilenced || !inputText.trim()
                  ? 'bg-stone-800/60 border border-white/5 text-stone-600 cursor-not-allowed'
                  : isJudge
                  ? 'bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 border border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95'
                  : 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-300 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95'
              }`}
            >
              <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
