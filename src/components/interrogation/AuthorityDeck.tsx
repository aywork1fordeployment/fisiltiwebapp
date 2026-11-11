import React from 'react';
import { AuthorityActionCooldowns } from '../../types/game.types';

interface AuthorityDeckProps {
  cooldowns: AuthorityActionCooldowns;
  onSlam: () => void;
  onYesNo: () => void;
  onTimer: () => void;
  onVerdict: () => void;
}

export const AuthorityDeck: React.FC<AuthorityDeckProps> = ({
  cooldowns,
  onSlam,
  onYesNo,
  onTimer,
  onVerdict,
}) => {
  return (
    <div className="w-full bg-[#141722] border-t border-white/[0.08] px-3 py-2 flex items-center justify-between gap-2 select-none overflow-x-auto no-scrollbar shadow-inner">
      
      {/* 1. 🔨 SUSTUR (Kırmızı Tema) */}
      <button
        onClick={onSlam}
        disabled={cooldowns.slam > 0}
        className={`flex-1 min-h-[46px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
          cooldowns.slam > 0
            ? 'bg-[#181B26]/50 border-white/5 text-stone-600 cursor-not-allowed'
            : 'bg-rose-950/30 hover:bg-rose-900/50 border-rose-500/30 hover:border-rose-400 text-rose-200 shadow-sm'
        }`}
        title="Masaya vur ve şüphelinin klavyesini 10 saniye kilitle"
      >
        <div className="flex items-center gap-1 font-bold text-xs">
          <span>🔨</span>
          <span>SUSTUR</span>
        </div>
        <span className="text-[10px] text-rose-300/80 font-medium">
          {cooldowns.slam > 0 ? `Bekle: ${cooldowns.slam}s` : '10sn Klavye Kilidi'}
        </span>
      </button>

      {/* 2. ⚖️ EVET / HAYIR (Turuncu Tema) */}
      <button
        onClick={onYesNo}
        disabled={cooldowns.yesNo > 0}
        className={`flex-1 min-h-[46px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
          cooldowns.yesNo > 0
            ? 'bg-[#181B26]/50 border-white/5 text-stone-600 cursor-not-allowed'
            : 'bg-amber-950/30 hover:bg-amber-900/50 border-amber-500/30 hover:border-amber-400 text-amber-200 shadow-sm'
        }`}
        title="Şüphelinin metin klavyesini kapatıp tek kelimelik EVET/HAYIR butonları ver"
      >
        <div className="flex items-center gap-1 font-bold text-xs">
          <span>⚖️</span>
          <span>EVET / HAYIR</span>
        </div>
        <span className="text-[10px] text-amber-300/80 font-medium">
          {cooldowns.yesNo > 0 ? `Bekle: ${cooldowns.yesNo}s` : '15sn Tek Kelime Kıskacı'}
        </span>
      </button>

      {/* 3. ⏱️ 5SN BASKISI (Mavi / Indigo Tema) */}
      <button
        onClick={onTimer}
        disabled={cooldowns.timer > 0}
        className={`flex-1 min-h-[46px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
          cooldowns.timer > 0
            ? 'bg-[#181B26]/50 border-white/5 text-stone-600 cursor-not-allowed'
            : 'bg-indigo-950/30 hover:bg-indigo-900/50 border-indigo-500/30 hover:border-indigo-400 text-indigo-200 shadow-sm'
        }`}
        title="5 saniye içinde cevap veremezse gözlerini kaçırdı damgası vurulur"
      >
        <div className="flex items-center gap-1 font-bold text-xs">
          <span>⏱️</span>
          <span>5SN BASKISI</span>
        </div>
        <span className="text-[10px] text-indigo-300/80 font-medium">
          {cooldowns.timer > 0 ? `Bekle: ${cooldowns.timer}s` : 'Cevaplamazsa Tereddüt Say'}
        </span>
      </button>

      {/* 4. 🚨 HÜKÜM VER (Altın / Sarı Tema) */}
      <button
        onClick={onVerdict}
        className="flex-1 min-h-[46px] px-2 py-1.5 rounded-xl border border-yellow-500/40 hover:border-yellow-400 bg-yellow-950/30 hover:bg-yellow-900/50 text-yellow-200 shadow-sm flex flex-col items-center justify-center transition-all active:scale-95"
        title="Sorguyu tamamla, gerekçeli kararı yaz ve nihai damgayı bas"
      >
        <div className="flex items-center gap-1 font-bold text-xs">
          <span>🚨</span>
          <span>HÜKÜM VER</span>
        </div>
        <span className="text-[10px] text-yellow-300/80 font-medium">
          Sorguyu Bitir & Damgala
        </span>
      </button>

    </div>
  );
};
