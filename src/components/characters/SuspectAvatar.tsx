import React from 'react';
import { SuspectState } from '../../types/game.types';

interface SuspectAvatarProps {
  state: SuspectState;
  isSpeaking?: boolean;
  name?: string;
  isSpotlight?: boolean;
}

export const SuspectAvatar: React.FC<SuspectAvatarProps> = ({
  state,
  isSpeaking = false,
  name = 'Şüpheli',
  isSpotlight = true,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-1 transition-all duration-200 ${
        isSpeaking ? 'ring-2 ring-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.5)] bg-cyan-500/10' : state === 'silenced' ? 'ring-2 ring-rose-500 shadow-[0_0_16px_rgba(225,29,72,0.6)] bg-rose-950/30' : 'bg-black/30 border border-white/10'
      } ${
        state === 'sweat' ? 'animate-bounce' : ''
      } ${state === 'shocked' ? 'scale-105' : ''}`}>
        
        {/* Tepeden Vuran Spot Işığı Parıltısı */}
        {isSpotlight && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-400/20 blur-md rounded-full pointer-events-none -z-10" />
        )}

        {/* 5 Saniye Kıskacı Ter Damlaları (sweat) */}
        {state === 'sweat' && (
          <div className="absolute -top-1 -right-1 flex flex-col gap-1 pointer-events-none">
            <span className="w-2 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-90" />
            <span className="w-1.5 h-2 bg-blue-400 rounded-full animate-pulse self-end opacity-75" />
          </div>
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="spotSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Kapüşonlu Sweatshirt Gövdesi */}
          <path
            d="M 22 96 C 22 68 34 62 50 62 C 66 62 78 68 78 96 Z"
            fill="url(#hoodGrad)"
            stroke="#4b5563"
            strokeWidth="1.5"
          />

          {/* Kapüşon Dış Hatları */}
          <path
            d="M 26 48 C 26 18 36 12 50 12 C 64 12 74 18 74 48 C 74 65 65 68 50 68 C 35 68 26 65 26 48 Z"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="1.5"
          />

          {/* Kapüşonun İçi / Gölge */}
          <ellipse cx="50" cy="42" rx="20" ry="24" fill="#0b0f19" />

          {/* Yüz Silüeti (Spot Işığı Vurmuş) */}
          <ellipse cx="50" cy="44" rx="15" ry="18" fill="url(#spotSkin)" opacity="0.9" />

          {/* Gözler (Duruma Göre) */}
          {state === 'shocked' ? (
            // Şok olmuş / Paniklemiş dev gözler
            <g>
              <ellipse cx="44" cy="40" rx="5" ry="5.5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
              <ellipse cx="56" cy="40" rx="5" ry="5.5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
              <circle cx="44" cy="40" r="1.5" fill="#000000" />
              <circle cx="56" cy="40" r="1.5" fill="#000000" />
            </g>
          ) : state === 'sweat' ? (
            // Endişeli, yana kaymış gözler
            <g>
              <ellipse cx="45" cy="42" rx="3.5" ry="2" fill="#111827" />
              <ellipse cx="55" cy="42" rx="3.5" ry="2" fill="#111827" />
              {/* Çatık endişeli kaşlar */}
              <line x1="41" y1="38" x2="48" y2="40" stroke="#78350f" strokeWidth="1.5" />
              <line x1="59" y1="38" x2="52" y2="40" stroke="#78350f" strokeWidth="1.5" />
            </g>
          ) : (
            // Sakin, biraz kısık gözler
            <g>
              <ellipse cx="45" cy="42" rx="3" ry="1.5" fill="#1e293b" />
              <ellipse cx="55" cy="42" rx="3" ry="1.5" fill="#1e293b" />
              <line x1="42" y1="39" x2="48" y2="40" stroke="#475569" strokeWidth="1.2" />
              <line x1="58" y1="39" x2="52" y2="40" stroke="#475569" strokeWidth="1.2" />
            </g>
          )}

          {/* Ağız & Susturma Bandı */}
          {state === 'silenced' ? (
            // Ağızda Kırmızı SUSTURULDU Bandı (Kritik Gereksinim)
            <g>
              <rect
                x="33"
                y="48"
                width="34"
                height="10"
                rx="2"
                transform="rotate(-5 50 53)"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="1.2"
              />
              <text
                x="50"
                y="55"
                transform="rotate(-5 50 53)"
                fontSize="6"
                fontWeight="900"
                fontFamily="monospace"
                fill="#ffffff"
                textAnchor="middle"
              >
                SUSTURULDU
              </text>
            </g>
          ) : state === 'shocked' ? (
            // O şeklinde açık ağız
            <ellipse cx="50" cy="54" rx="4" ry="5" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
          ) : state === 'sweat' ? (
            // Titrek dalgalı ağız
            <path d="M 44 54 Q 47 52 50 54 Q 53 56 56 54" stroke="#78350f" strokeWidth="1.5" fill="none" />
          ) : isSpeaking ? (
            // Konuşurken açık
            <ellipse cx="50" cy="53" rx="3" ry="2" fill="#1e293b" className="animate-pulse" />
          ) : (
            // Düz sakin ağız
            <line x1="46" y1="53" x2="54" y2="53" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          )}

          {/* Susturulduğunda Çapraz Metal Zincirler */}
          {state === 'silenced' && (
            <g stroke="#9ca3af" strokeWidth="2.5" strokeDasharray="3 3">
              <line x1="18" y1="92" x2="82" y2="68" />
              <line x1="18" y1="68" x2="82" y2="92" />
              {/* Asma Kilit */}
              <rect x="45" y="75" width="10" height="9" rx="1.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
              <path d="M 47 75 L 47 71 C 47 68 53 68 53 71 L 53 75" fill="none" stroke="#eab308" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Konuşuyor İndikatörü */}
        {isSpeaking && state !== 'silenced' && (
          <span className="absolute -top-1 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        )}
      </div>

      <div className="mt-0.5 flex items-center gap-1">
        <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10">
          {name}
        </span>
      </div>
    </div>
  );
};
