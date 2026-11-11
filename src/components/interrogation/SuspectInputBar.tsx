import React, { useState, useEffect } from 'react';
import { Send, Lock, AlertTriangle, Check, X } from 'lucide-react';

interface SuspectInputBarProps {
  onSendMessage: (text: string) => void;
  isSilenced: boolean;
  silencedSeconds: number;
  isYesNoClamp: boolean;
  isTimerClamp: boolean;
  timerSeconds: number;
  placeholder?: string;
}

export const SuspectInputBar: React.FC<SuspectInputBarProps> = ({
  onSendMessage,
  isSilenced,
  silencedSeconds,
  isYesNoClamp,
  isTimerClamp,
  timerSeconds,
  placeholder = 'İfadeni tutanağa geçir... (Max 140 karakter)',
}) => {
  const [inputText, setInputText] = useState('');

  // Masaya vurulduğunda yazılmakta olan metin silinir
  useEffect(() => {
    if (isSilenced) {
      setInputText('');
    }
  }, [isSilenced]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSilenced) return;
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleYesNoClick = (choice: 'EVET' | 'HAYIR') => {
    onSendMessage(choice);
  };

  // 1. EVET / HAYIR KISKACI MODU
  if (isYesNoClamp) {
    return (
      <div className="w-full bg-[#151822] border-t border-amber-500/40 p-3 flex flex-col gap-2 select-none animate-bounce">
        <div className="text-xs font-semibold text-amber-400 text-center flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Kıvırmak yok! Tek bir kelimeyle cevap ver:</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleYesNoClick('EVET')}
            className="flex-1 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-base tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>EVET</span>
          </button>

          <button
            onClick={() => handleYesNoClick('HAYIR')}
            className="flex-1 min-h-[48px] bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-base tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <X className="w-5 h-5 stroke-[3]" />
            <span>HAYIR</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. SUSTURULMUŞ / KİLİTLİ MOD
  if (isSilenced) {
    return (
      <div className="w-full bg-rose-950/60 border-t border-rose-600/60 p-3 flex items-center justify-center gap-2 select-none text-rose-200 text-xs font-semibold animate-pulse">
        <Lock className="w-4 h-4 text-rose-400" />
        <span>
          🚨 SAVCI MASAYA VURDU! SUSTURULDUNUZ ({silencedSeconds}s)
        </span>
      </div>
    );
  }

  // 3. NORMAL VE 5 SANİYE SÜRE KISKACI MODU
  return (
    <div
      className={`w-full bg-[#151822] border-t border-white/[0.07] p-2.5 sm:p-3 flex flex-col gap-1.5 transition-all ${
        isTimerClamp ? 'ring-2 ring-rose-500 bg-rose-950/20' : ''
      }`}
    >
      {/* 5 Saniye Kıskacı Sayacı Uyarısı */}
      {isTimerClamp && (
        <div className="flex items-center justify-between text-xs font-semibold text-rose-400 px-1 animate-pulse">
          <span className="flex items-center gap-1.5">
            <span>⏱️</span>
            <span>Tereddüt Testi! 5 saniyede cevap ver:</span>
          </span>
          <span className="text-xs bg-rose-950 border border-rose-500 px-2 py-0.5 rounded-md font-bold">
            {timerSeconds}s
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={140}
            placeholder={placeholder}
            className={`w-full bg-[#1A1E2B] border rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition-colors font-sans ${
              isTimerClamp
                ? 'border-rose-500 focus:border-rose-400 bg-rose-950/20'
                : 'border-white/10 focus:border-amber-400/60'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-500 pointer-events-none font-medium">
            {inputText.length}/140
          </span>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="min-h-[42px] px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:hover:bg-amber-400 text-black font-semibold text-xs sm:text-sm flex items-center justify-center transition-all active:scale-95 shadow-sm"
          title="İfadeyi Gönder"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
