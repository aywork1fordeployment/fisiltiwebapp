import React from 'react';
import { JudgeAvatar } from './JudgeAvatar';
import { SuspectAvatar } from './SuspectAvatar';
import { JudgeState, SuspectState, PlayerRole } from '../../types/game.types';

interface CharacterStageProps {
  prosecutorState: JudgeState;
  detectiveState: JudgeState;
  suspectState: SuspectState;
  activeSpeaker?: PlayerRole | null;
  lampWild?: boolean;
  statusText?: string;
  isSilenced?: boolean;
  spotlightOn?: boolean;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
  prosecutorState,
  detectiveState,
  suspectState,
  activeSpeaker,
  lampWild = false,
  statusText,
  isSilenced = false,
  spotlightOn = true,
}) => {
  return (
    <div
      className="relative w-full h-[115px] bg-[#121520] border-b border-white/[0.08] px-4 py-2 flex items-center justify-between select-none overflow-hidden"
      style={{
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
      }}
    >
      
      {/* 1. Tavandan Sallanan Tepe Lambası & Gerçekçi Sarı Işık Konisi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div className={`origin-top flex flex-col items-center ${
          lampWild ? 'animate-pendulum-wild' : 'animate-pendulum'
        }`}>
          {/* İnce kablo */}
          <div className="w-[1.5px] h-3 bg-stone-400" />
          {/* Lamba abajuru */}
          <div className="w-8 h-3.5 bg-stone-600 rounded-t-full border border-stone-400 relative flex justify-center shadow-lg">
            {/* Parlayan akkor ampul */}
            <div className="absolute -bottom-1 w-3.5 h-2 bg-yellow-200 rounded-full shadow-[0_0_15px_5px_rgba(250,204,21,0.7)]" />
          </div>
          {/* Gerçekçi Işık Konisi (clip-path + radial-gradient) */}
          <div
            className="w-56 h-36 opacity-35"
            style={{
              clipPath: 'polygon(46% 0%, 54% 0%, 95% 100%, 5% 100%)',
              background: 'radial-gradient(ellipse at top, rgba(250, 204, 21, 0.5) 0%, rgba(250, 204, 21, 0) 78%)',
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>

      {/* 2. Sol Taraf: Yargıçlar Masası (Sert Savcı & Baş Dedektif) */}
      <div className="flex items-center gap-2.5 z-10">
        <JudgeAvatar
          variant="prosecutor"
          state={prosecutorState}
          isSpeaking={activeSpeaker === 'prosecutor'}
        />
        <JudgeAvatar
          variant="detective"
          state={detectiveState}
          isSpeaking={activeSpeaker === 'detective'}
        />
      </div>

      {/* 3. Ortada Gerilim Bandı: Yargıçlar Fısıldaştığında Yanıp Sönen Uyarı */}
      {statusText && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-purple-950/95 via-rose-950/95 to-purple-950/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-rose-500/60 text-xs font-semibold text-rose-200 flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)] whitespace-nowrap max-w-[280px] sm:max-w-md truncate">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="truncate">{statusText}</span>
          </div>
        </div>
      )}

      {/* 4. Sağ Taraf: Şüpheli Koltuğu (Karşı Karşıya Yüzleşme) */}
      <div className="relative z-10 flex items-center">
        <SuspectAvatar
          state={suspectState}
          isSpeaking={activeSpeaker === 'suspect'}
          isSpotlight={spotlightOn}
        />

        {/* Susturulduğunda Kırmızı Kilit Rozeti */}
        {isSilenced && (
          <div className="absolute -bottom-1 right-0 text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500 px-2 py-0.5 rounded-md shadow-lg animate-pulse">
            🔒 Susturuldu
          </div>
        )}
      </div>

      {/* 5. Alt Masa Silüeti (Derinlik Katmanı) */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#090b10] via-[#12151f]/80 to-transparent border-t border-white/[0.06] pointer-events-none" />

    </div>
  );
};
