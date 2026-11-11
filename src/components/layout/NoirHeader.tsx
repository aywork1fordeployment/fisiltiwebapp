import React, { useState } from 'react';
import { Volume2, VolumeX, Clock, Video } from 'lucide-react';
import { PlayerRole } from '../../types/game.types';
import { soundEngine } from '../../engine/soundEngine';

interface NoirHeaderProps {
  roomCode: string;
  timeLeft: number;
  userRole: PlayerRole;
  unreadWhispersCount: number;
  onOpenWhisperDrawer: () => void;
}

export const NoirHeader: React.FC<NoirHeaderProps> = ({
  roomCode,
  timeLeft,
  userRole,
  unreadWhispersCount,
  onOpenWhisperDrawer,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeft <= 30;
  const isJudge =
    userRole === 'sert_hakim' ||
    userRole === 'yumusak_hakim' ||
    userRole === 'prosecutor' ||
    userRole === 'detective';

  const isSuspect = userRole === 'supheli' || userRole === 'suspect';

  return (
    <header className="w-full h-12 bg-[#120E0C]/90 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-4 flex items-center justify-between z-30 select-none shadow-md shrink-0">
      
      {/* Sol: Oda Kodu & POV Kamera Rozeti */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-amber-100/90 bg-black/60 border border-amber-200/15 px-2.5 py-1 rounded-lg shadow-inner">
          #{roomCode}
        </span>

        {/* POV Kamera Modu */}
        <div className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
          isSuspect
            ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          <Video className="w-3 h-3" />
          <span>{isSuspect ? 'SANIK KÜRSÜSÜ (POV)' : 'HAKİM KÜRSÜSÜ (POV)'}</span>
        </div>
      </div>

      {/* Orta: 180sn Canlı Süre Sayacı */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1.5 px-3 py-0.5 rounded-xl border transition-all ${
            isUrgent
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              : 'bg-black/70 border-amber-500/25 text-amber-50'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`} />
          <span className="font-extrabold text-sm sm:text-base tracking-wider font-mono">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Sağ: Diğer Hakimle Fısıldaş Butonu (Hakimler) / Anonim Sorgu Salonu (Şüpheli) & Ses */}
      <div className="flex items-center gap-2">
        {/* 🕵️‍♂️ DİĞER HAKİMLE FISILDAŞ (SADECE HAKİMLERDE GÖRÜNÜR!) */}
        {isJudge ? (
          <button
            onClick={onOpenWhisperDrawer}
            className={`relative flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-md border ${
              unreadWhispersCount > 0
                ? 'bg-gradient-to-r from-rose-900 to-purple-900 hover:from-rose-800 hover:to-purple-800 text-rose-100 border-rose-400 ring-2 ring-rose-500/40 animate-pulse'
                : 'bg-gradient-to-r from-rose-950/70 to-purple-950/70 hover:from-rose-900/80 hover:to-purple-900/80 text-rose-200 border-rose-500/35'
            }`}
            title="Hakimler arası gizli aynanın arkası taktik kanalı"
          >
            <span className="text-sm">🕵️‍♂️</span>
            <span className="hidden sm:inline">Diğer Hakimle Fısıldaş</span>
            <span className="sm:hidden">Fısıldaş</span>

            {/* Okunmamış Fısıltı Rozeti */}
            {unreadWhispersCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                {unreadWhispersCount}
              </span>
            )}
          </button>
        ) : (
          /* Şüpheli İçin Sağ Üst İbare */
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-amber-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>ANONİM SORGU SALONU</span>
          </div>
        )}

        {/* Ses Açma / Kapama */}
        <button
          onClick={handleToggleSound}
          className={`p-1.5 rounded-lg border transition-colors ${
            isMuted
              ? 'text-stone-500 border-white/5 bg-black/40 hover:text-stone-300'
              : 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
          }`}
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

    </header>
  );
};
