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
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isJudge = userRole === 'sert_hakim' || userRole === 'yumusak_hakim' || userRole === 'prosecutor' || userRole === 'detective';

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

  // Susturulduğunda inputu temizle
  useEffect(() => {
    if (isSilenced) {
      setInputText('');
    }
  }, [isSilenced]);

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
    if (isSilenced || !inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (onTyping) onTyping(false);
  };

  const handleYesNoSubmit = (choice: 'EVET' | 'HAYIR') => {
    onSendMessage(`[${choice}]`);
  };

  const cycleHeightMode = () => {
    if (heightMode === 'standard') setHeightMode('expanded');
    else if (heightMode === 'expanded') setHeightMode('compact');
    else setHeightMode('standard');
  };

  const heightClasses = {
    compact: 'h-[160px]',
    standard: 'h-[300px] sm:h-[320px]',
    expanded: 'h-[75dvh]',
  };

  return (
    <div
      className={`absolute bottom-0 inset-x-0 w-full ${heightClasses[heightMode]} bg-[#14110F]/90 backdrop-blur-xl border-t border-amber-500/25 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-300 ease-out z-20`}
    >
      {/* 1. ÜST TUTAMAÇ ÇUBUĞU (DRAG HANDLE) */}
      <div
        onClick={cycleHeightMode}
        className="w-full pt-2 pb-1.5 flex flex-col items-center justify-center cursor-pointer group select-none shrink-0"
        title="Boyutu değiştirmek için tıkla (Küçük / Orta / Büyük)"
      >
        <div className="w-14 h-1.5 bg-amber-100/25 group-hover:bg-amber-100/50 rounded-full transition-all group-active:scale-95 shadow-sm" />
        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-200/50 group-hover:text-amber-200/80 mt-0.5 tracking-wider uppercase">
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

      {/* 2. TÜM MODLARDA HER ZAMAN SABİT (PINNED) İTİRAF DOSYASI ŞERİDİ */}
      {confession && (
        <div className="px-3 sm:px-4 py-1.5 shrink-0 border-b border-amber-500/20 bg-[#1A130E]/95 flex items-center justify-between gap-2 shadow-sm select-text">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
              <Paperclip className="w-3 h-3 -rotate-45" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase shrink-0">
                📂 GİZLİ İTİRAF:
              </span>
              <span className="text-[12px] sm:text-[13px] text-amber-100/90 font-medium italic truncate">
                "{confession}"
              </span>
            </div>
          </div>
          <span className="shrink-0 text-[9px] font-bold text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded bg-rose-950/40 uppercase">
            GİZLİ
          </span>
        </div>
      )}

      {/* 3. SİNEMATİK MAHKEME TUTANAĞI AKIŞI (DİYALOG LİSTESİ - MAVİ BALONCUKLAR YOK!) */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2.5 text-sm select-text no-scrollbar">
        {transcriptMessages.map((msg) => {
          // İsim ve Renk Belirleme
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
            <div key={msg.id} className="py-1 text-[15px] leading-snug">
              <span className={`font-bold tracking-wide mr-2 inline-block align-baseline ${labelColor}`}>
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
          <div className="py-1 text-[15px] leading-snug text-amber-200/80 italic animate-pulse">
            <span className="font-bold tracking-wide text-amber-400/90 mr-2 inline-block align-baseline">
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

      {/* 4. ALT KONTROLLER VE BUTONLAR */}
      <div className="shrink-0 bg-[#0F0D0B] border-t border-amber-900/30 flex flex-col p-2.5 gap-2">
        
        {/* ============================================================== */}
        {/* A. 4 OTORİTE BUTONU (SADECE HAKİMLER EKRANINDA GÖRÜNÜR!)       */}
        {/* Koyu Obsidyen, Bordo, Bronz ve Kehribar Lüks Mahkeme Paleti   */}
        {/* ============================================================== */}
        {isJudge && (
          <div className="grid grid-cols-4 gap-2 select-none">
            {/* 1. 🔨 [7s] SUSTUR (Koyu Bordo - Obsidyen) */}
            <button
              onClick={onSlam}
              disabled={cooldowns.slam > 0}
              className={`min-h-[48px] px-1.5 py-1 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                cooldowns.slam > 0
                  ? 'bg-[#181112]/60 border-rose-900/20 text-stone-600 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#2A1215] to-[#1A0B0D] hover:from-[#3D181C] border-rose-500/40 hover:border-rose-400 text-rose-100 shadow-inner'
              }`}
              title="Masaya vur ve şüphelinin klavyesini 7 saniye kilitle"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>🔨</span>
                <span className="text-rose-400/90 text-[10px] font-mono">[7s]</span>
                <span className="tracking-wide">SUSTUR</span>
              </div>
              <span className="text-[9px] text-rose-300/70 font-medium">
                {cooldowns.slam > 0 ? `Bekle: ${cooldowns.slam}s` : 'Klavye Kilidi'}
              </span>
            </button>

            {/* 2. ⚖️ [15s] EVET / HAYIR (Koyu Bronz - Kehribar / ÇİĞ YEŞİL YOK!) */}
            <button
              onClick={onYesNo}
              disabled={cooldowns.yesNo > 0}
              className={`min-h-[48px] px-1.5 py-1 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                cooldowns.yesNo > 0
                  ? 'bg-[#18140E]/60 border-amber-900/20 text-stone-600 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#261E14] to-[#17120C] hover:from-[#362A1B] border-amber-500/40 hover:border-amber-400 text-amber-100 shadow-inner'
              }`}
              title="Şüphelinin klavyesini kapatıp tek kelimelik EVET/HAYIR butonları ver"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>⚖️</span>
                <span className="text-amber-400/90 text-[10px] font-mono">[15s]</span>
                <span className="tracking-wide">EVET / HAYIR</span>
              </div>
              <span className="text-[9px] text-amber-300/70 font-medium">
                {cooldowns.yesNo > 0 ? `Bekle: ${cooldowns.yesNo}s` : 'Tek Kelime'}
              </span>
            </button>

            {/* 3. ⏱️ 5 SN BASKI (Koyu Bakır - Arduvaz / ÇİĞ MAVİ/MOR YOK!) */}
            <button
              onClick={onTimer}
              disabled={cooldowns.timer > 0}
              className={`min-h-[48px] px-1.5 py-1 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                cooldowns.timer > 0
                  ? 'bg-[#161210]/60 border-orange-900/20 text-stone-600 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#241A16] to-[#140E0C] hover:from-[#33241E] border-orange-400/35 hover:border-orange-300 text-orange-100 shadow-inner'
              }`}
              title="5 saniye içinde cevap veremezse gözlerini kaçırdı sayılır"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>⏱️</span>
                <span className="tracking-wide">5 SN BASKI</span>
              </div>
              <span className="text-[9px] text-orange-300/70 font-medium">
                {cooldowns.timer > 0 ? `Bekle: ${cooldowns.timer}s` : 'Tereddüt'}
              </span>
            </button>

            {/* 4. 🚨 HÜKÜM VER (Parlak Altın - Maun Vurgu) */}
            <button
              onClick={onVerdict}
              className="min-h-[48px] px-1.5 py-1 rounded-xl border border-amber-400/70 hover:border-amber-300 bg-gradient-to-b from-amber-500/25 via-amber-700/20 to-[#1F160E] hover:from-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center transition-all active:scale-95"
              title="Sorguyu tamamla, gerekçeli kararı yaz ve nihai damgayı bas"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>🚨</span>
                <span className="tracking-wide">HÜKÜM VER</span>
              </div>
              <span className="text-[9px] text-amber-300/80 font-medium">
                Damgala
              </span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* B. ŞÜPHELİ EVET / HAYIR KISKACI MODU                           */}
        {/* ============================================================== */}
        {!isJudge && isYesNoClamp ? (
          <div className="w-full flex flex-col gap-1.5 select-none animate-bounce">
            <div className="text-xs font-semibold text-amber-400 text-center flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Tek kelimeyle cevap ver:</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleYesNoSubmit('EVET')}
                className="flex-1 min-h-[46px] bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 border border-emerald-500/50 active:scale-95 text-white font-extrabold text-sm tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>EVET</span>
              </button>
              <button
                onClick={() => handleYesNoSubmit('HAYIR')}
                className="flex-1 min-h-[46px] bg-gradient-to-b from-rose-800 to-rose-950 hover:from-rose-700 border border-rose-500/50 active:scale-95 text-white font-extrabold text-sm tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>HAYIR</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* C. STANDART MESAJ YAZMA GİRİŞ ÇUBUĞU                           */
          /* ============================================================== */
          <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                disabled={isSilenced}
                maxLength={140}
                placeholder={
                  isSilenced
                    ? `🔒 1. Hakim masaya vurdu! Klavyen kilitli (${silencedSeconds}s)`
                    : isJudge
                    ? 'Çapraz sorgu sorusu sor... (0/140)'
                    : 'Savunmanı tutanağa geçir... (0/140)'
                }
                className={`w-full h-11 px-3.5 pr-14 rounded-xl border text-sm transition-all focus:outline-none ${
                  isSilenced
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300 placeholder-rose-400/60 cursor-not-allowed'
                    : 'bg-[#0D0B0A]/90 border-amber-200/15 focus:border-amber-400/60 text-[#F5F2EB] placeholder-amber-100/30 shadow-inner'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-amber-200/30 pointer-events-none">
                {inputText.length}/140
              </span>
            </div>

            <button
              type="submit"
              disabled={isSilenced || !inputText.trim()}
              className={`h-11 px-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                isSilenced || !inputText.trim()
                  ? 'bg-stone-800/60 border border-white/5 text-stone-600 cursor-not-allowed'
                  : 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-300 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
