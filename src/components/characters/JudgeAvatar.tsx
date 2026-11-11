import React from 'react';
import { JudgeState } from '../../types/game.types';

interface JudgeAvatarProps {
  variant: 'prosecutor' | 'detective';
  state: JudgeState;
  isSpeaking?: boolean;
  name?: string;
}

export const JudgeAvatar: React.FC<JudgeAvatarProps> = ({
  variant,
  state,
  isSpeaking = false,
  name,
}) => {
  const isProsecutor = variant === 'prosecutor';
  const roleTitle = isProsecutor ? 'Sert Savcı' : 'Baş Dedektif';
  const accentColor = isProsecutor ? '#ef4444' : '#f59e0b';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-1 transition-all duration-200 ${
        isSpeaking ? 'ring-2 ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.5)] bg-amber-500/10' : 'bg-black/30 border border-white/10'
      } ${
        state === 'slam' ? 'scale-110 -translate-y-1' : ''
      } ${state === 'point' ? 'translate-x-1' : ''} ${state === 'whisper' ? 'rotate-[-6deg]' : ''}`}>
        
        {/* Arkadaki Hız / Gerilim Çizgileri (Point ve Slam durumunda) */}
        {state === 'point' && (
          <svg className="absolute -inset-2 w-24 h-24 sm:w-28 sm:h-28 -z-10 pointer-events-none opacity-80" viewBox="0 0 100 100">
            <line x1="80" y1="50" x2="100" y2="45" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="80" y1="55" x2="100" y2="60" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
            <line x1="75" y1="40" x2="98" y2="35" stroke="#ef4444" strokeWidth="1.5" />
          </svg>
        )}

        {state === 'slam' && (
          <div className="absolute -inset-1 rounded-full bg-red-500/20 blur-sm animate-ping -z-10" />
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id={`suitGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isProsecutor ? "#1f1d2b" : "#2a241e"} />
              <stop offset="100%" stopColor={isProsecutor ? "#0f0e17" : "#171412"} />
            </linearGradient>
            <filter id={`glow-${variant}`}>
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gövde / Takım Elbise */}
          <path
            d="M 22 96 C 22 68 32 60 50 60 C 68 60 78 68 78 96 Z"
            fill={`url(#suitGrad-${variant})`}
            stroke="#374151"
            strokeWidth="1.5"
          />

          {/* Gömlek Yaka */}
          <path d="M 42 60 L 50 72 L 58 60 Z" fill="#e5e7eb" />

          {/* Kravat veya Fular */}
          {isProsecutor ? (
            // Savcı: Sivri Kırmızı Kravat
            <path d="M 47 68 L 53 68 L 52 88 L 50 92 L 48 88 Z" fill="#dc2626" />
          ) : (
            // Dedektif: Kehribar Rozet / Kravat İğnesi
            <>
              <path d="M 48 68 L 52 68 L 51 86 L 50 89 L 49 86 Z" fill="#9ca3af" />
              <circle cx="50" cy="74" r="2.5" fill="#f59e0b" filter={`url(#glow-${variant})`} />
            </>
          )}

          {/* Baş & Boyun */}
          <rect x="44" y="48" width="12" height="14" fill="#d1a684" rx="2" />

          {/* Çene ve Yüz Silüeti */}
          <path
            d="M 32 32 C 32 18 68 18 68 32 C 68 46 60 55 50 55 C 40 55 32 46 32 32 Z"
            fill="#d1a684"
          />

          {/* Baş Dedektif: Fötr Şapka */}
          {!isProsecutor && (
            <g>
              {/* Şapka Siperliği */}
              <ellipse cx="50" cy="24" rx="30" ry="7" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
              {/* Şapka Tepesi */}
              <path d="M 32 24 C 33 10 42 8 50 8 C 58 8 67 10 68 24 Z" fill="#292524" />
              {/* Şapka Şeridi */}
              <path d="M 32 23 C 38 21 62 21 68 23" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Sert Savcı: Keskin Saçlar */}
          {isProsecutor && (
            <path
              d="M 28 32 C 28 12 45 10 50 10 C 58 10 72 13 72 32 C 68 22 55 18 45 20 C 35 22 30 28 28 32 Z"
              fill="#111827"
            />
          )}

          {/* Gözler / Bakışlar */}
          {isProsecutor ? (
            // Savcı: Parlayan Beyaz Gözlük Camları
            <g>
              <rect x="36" y="32" width="11" height="6" rx="1.5" fill="#f8fafc" stroke="#dc2626" strokeWidth="1" filter={`url(#glow-${variant})`} />
              <rect x="53" y="32" width="11" height="6" rx="1.5" fill="#f8fafc" stroke="#dc2626" strokeWidth="1" filter={`url(#glow-${variant})`} />
              <line x1="47" y1="35" x2="53" y2="35" stroke="#dc2626" strokeWidth="1.5" />
            </g>
          ) : (
            // Dedektif: Şapka Gölgesinde Keskin Gözler
            <g>
              <ellipse cx="42" cy="34" rx="2.5" ry="1.5" fill="#f59e0b" filter={`url(#glow-${variant})`} />
              <ellipse cx="58" cy="34" rx="2.5" ry="1.5" fill="#f59e0b" filter={`url(#glow-${variant})`} />
              {/* Sert Kaşlar */}
              <line x1="38" y1="30" x2="46" y2="32" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
              <line x1="62" y1="30" x2="54" y2="32" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Ağız (State'e ve konuşmaya göre) */}
          {state === 'whisper' ? (
            // Fısıldama: Yan eğik kapalı dudak
            <ellipse cx="47" cy="46" rx="3" ry="1.5" fill="#78350f" />
          ) : state === 'slam' || state === 'point' ? (
            // Bağırış / Sert Sorgu
            <path d="M 44 44 Q 50 51 56 44 Z" fill="#450a0a" stroke="#dc2626" strokeWidth="0.8" />
          ) : isSpeaking ? (
            // Konuşurken açık
            <ellipse cx="50" cy="45" rx="3.5" ry="2.5" fill="#1f2937" className="animate-pulse" />
          ) : (
            // Sakin düz çizgi
            <line x1="45" y1="46" x2="55" y2="46" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Jestler ve Eller (State'e Göre) */}
          {state === 'slam' && (
            // Masaya vuran eller
            <g>
              <rect x="20" y="86" width="60" height="8" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
              {/* Yumruklar */}
              <circle cx="28" cy="86" r="6" fill="#d1a684" stroke="#991b1b" strokeWidth="1" />
              <circle cx="72" cy="86" r="6" fill="#d1a684" stroke="#991b1b" strokeWidth="1" />
              {/* Çarpma şok dalgaları */}
              <line x1="16" y1="80" x2="12" y2="74" stroke="#f87171" strokeWidth="2" />
              <line x1="84" y1="80" x2="88" y2="74" stroke="#f87171" strokeWidth="2" />
            </g>
          )}

          {state === 'point' && (
            // Suçlayıcı Parmak Uzatma (Ace Attorney Stili)
            <g>
              <path
                d="M 58 70 L 86 52 L 95 50 C 97 49 97 53 94 54 L 84 62 L 62 76 Z"
                fill="#d1a684"
                stroke="#991b1b"
                strokeWidth="1"
              />
              {/* Manşet */}
              <path d="M 58 68 L 65 77 L 58 82 Z" fill="#1f1d2b" />
            </g>
          )}

          {state === 'whisper' && (
            // Ağzın yanına götürülmüş el
            <g>
              <path
                d="M 60 48 C 64 42 66 40 68 44 C 70 48 68 56 62 58 Z"
                fill="#d1a684"
                stroke="#78350f"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>

        {/* Konuşuyor / Aksiyon Rozeti */}
        {isSpeaking && (
          <span className="absolute -top-1 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      <div className="mt-0.5 flex items-center gap-1">
        <span
          className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded border"
          style={{
            borderColor: accentColor,
            color: accentColor,
            backgroundColor: `${accentColor}15`,
          }}
        >
          {name || roleTitle}
        </span>
      </div>
    </div>
  );
};
