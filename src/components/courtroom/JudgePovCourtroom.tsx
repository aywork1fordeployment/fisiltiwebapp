import React from 'react';
import { PlayerRole } from '../../types/game.types';

interface JudgePovCourtroomProps {
  activeSpeaker: PlayerRole | null;
  speakingRole: PlayerRole | null;
  isSilenced: boolean;
  isYesNoClamp?: boolean;
  isTimerClamp?: boolean;
  timerSeconds?: number;
  confession?: string;
}

export const JudgePovCourtroom: React.FC<JudgePovCourtroomProps> = ({
  activeSpeaker,
  speakingRole,
  isSilenced,
  isYesNoClamp,
  isTimerClamp,
  timerSeconds,
}) => {
  const isSuspectTalking = speakingRole === 'supheli' || activeSpeaker === 'supheli';

  return (
    <div className="relative w-full h-full min-h-0 bg-[#0C0908] flex flex-col items-center justify-start overflow-hidden select-none">
      
      {/* 1. Üst Ambiyans & Zemin Ahşap Parke Perspektifi */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140E0A] via-[#0D0907] to-[#080605] pointer-events-none" />

      {/* Zemin Parke Çizgileri & Mahkeme Korkulukları (Isometric Courtroom Well) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="none">
          {/* Ahşap Zemin Parke Çizgileri */}
          <line x1="100" y1="50" x2="0" y2="600" stroke="#78350F" strokeWidth="1" />
          <line x1="250" y1="50" x2="150" y2="600" stroke="#78350F" strokeWidth="1" />
          <line x1="400" y1="50" x2="400" y2="600" stroke="#78350F" strokeWidth="1" />
          <line x1="550" y1="50" x2="650" y2="600" stroke="#78350F" strokeWidth="1" />
          <line x1="700" y1="50" x2="800" y2="600" stroke="#78350F" strokeWidth="1" />

          {/* Sol Mahkeme Bariyeri / Korkuluk */}
          <path d="M50 120 L220 180 L220 320 L50 240 Z" fill="#2E1810" stroke="#5D301C" strokeWidth="2" opacity="0.6" />
          <line x1="100" y1="140" x2="100" y2="260" stroke="#4A2616" strokeWidth="4" />
          <line x1="160" y1="160" x2="160" y2="290" stroke="#4A2616" strokeWidth="4" />

          {/* Sağ Mahkeme Bariyeri */}
          <path d="M750 120 L580 180 L580 320 L750 240 Z" fill="#2E1810" stroke="#5D301C" strokeWidth="2" opacity="0.4" />
        </svg>
      </div>

      {/* 2. TEPE SPOT IŞIĞI (VOLUMETRIC SPOTLIGHT - sample.jpg Sağ Taraf) */}
      {/* Normalde sıcak kehribar; Susturulduğunda koyu kırmızı tona döner */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[380px] pointer-events-none transition-all duration-700 ${
          isSilenced ? 'opacity-50' : 'opacity-40'
        }`}
        style={{
          clipPath: 'polygon(44% 0%, 56% 0%, 94% 100%, 6% 100%)',
          background: isSilenced
            ? 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.7) 0%, rgba(185, 28, 28, 0.25) 55%, transparent 85%)'
            : 'radial-gradient(ellipse at top, rgba(251, 191, 36, 0.8) 0%, rgba(217, 119, 6, 0.3) 55%, transparent 85%)',
          filter: 'blur(3px)',
        }}
      />

      {/* Zemindeki Dairesel Spot Işık Havuzu (Oval) */}
      <div
        className={`absolute top-[170px] left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] h-[190px] rounded-[50%] pointer-events-none transition-all duration-700 ${
          isSilenced
            ? 'bg-rose-600/20 shadow-[0_0_80px_35px_rgba(225,29,72,0.35)]'
            : 'bg-amber-400/25 shadow-[0_0_90px_40px_rgba(245,158,11,0.25)]'
        }`}
        style={{ transform: 'translateX(-50%) rotateX(65deg)' }}
      />

      {/* 3. MERKEZİ SANIK KÜRSÜSÜ VE ŞÜPHELİ (SVG Sanatı - sample.jpg Birebir) */}
      <div className="relative z-10 w-full max-w-[480px] h-[270px] sm:h-[370px] mt-1 sm:mt-4 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 500 420"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="podiumFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#552C18" />
              <stop offset="50%" stopColor="#3C1E10" />
              <stop offset="100%" stopColor="#251209" />
            </linearGradient>

            <linearGradient id="podiumTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#783D21" />
              <stop offset="50%" stopColor="#96522E" />
              <stop offset="100%" stopColor="#633119" />
            </linearGradient>

            <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D3748" />
              <stop offset="60%" stopColor="#1A202C" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <filter id="spotlightGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* A. ŞÜPHELİ (KAPÜŞONLU GENÇ - SANIK KÜRSÜSÜ ARKASINDA AYAKTA)  */}
          {/* ============================================================== */}
          <g transform="translate(195, 75)">
            {/* Gövde ve Kapüşonlu Sweatshirt (Koyu Antrasit) */}
            <path
              d="M20 100 C20 70 38 60 55 60 C72 60 90 70 90 100 L95 190 L15 190 Z"
              fill="url(#hoodieGrad)"
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Kapüşon Dış Hatları */}
            <path
              d="M32 58 C32 25 42 12 55 12 C68 12 78 25 78 58 C78 78 68 85 55 85 C42 85 32 78 32 58 Z"
              fill="#1A202C"
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Kapüşon İçi Derin Gölge */}
            <ellipse cx="55" cy="50" rx="19" ry="24" fill="#0B0D13" />

            {/* Şüphelinin Yüzü (Gölge Altında Mahzun/Gergin) */}
            <path
              d="M40 45 C40 32 46 28 55 28 C64 28 70 32 70 45 C70 56 64 63 55 63 C46 63 40 56 40 45 Z"
              fill="#E2B193"
            />
            {/* Yüzün Üst Kısmına Düşen Kapüşon Gölgesi */}
            <path d="M40 38 C45 32 65 32 70 38 L70 30 L40 30 Z" fill="#0B0D13" opacity="0.6" />

            {/* Gözler ve Kaşlar (Aşağı / Kürsüye Bakıyor) */}
            <line x1="44" y1="41" x2="50" y2="43" stroke="#2D1810" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="66" y1="41" x2="60" y2="43" stroke="#2D1810" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="47" cy="45" r="1.5" fill="#1A202C" />
            <circle cx="63" cy="45" r="1.5" fill="#1A202C" />

            {/* Ağız (Ağız Oynama Animasyonu) */}
            <g transform="translate(55, 55)">
              {isSuspectTalking ? (
                <ellipse cx="0" cy="0" rx="3.5" ry="2.2" fill="#4A1818" className="animate-mouth-speak" />
              ) : (
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#4A2619" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </g>

            {/* Kapüşon İpleri */}
            <line x1="46" y1="68" x2="44" y2="92" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="64" y1="68" x2="66" y2="92" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />

            {/* Kürsü Kenarına Tutunan Eller */}
            <ellipse cx="25" cy="155" rx="7" ry="5" fill="#E2B193" stroke="#5D301C" strokeWidth="1" />
            <ellipse cx="85" cy="155" rx="7" ry="5" fill="#E2B193" stroke="#5D301C" strokeWidth="1" />
          </g>

          {/* ============================================================== */}
          {/* B. AHŞAP SANIK KÜRSÜSÜ (PODIUM / WITNESS STAND)              */}
          {/* ============================================================== */}
          <g transform="translate(170, 200)">
            {/* Kürsü Masif Gövdesi */}
            <path
              d="M15 40 L145 40 L135 180 L25 180 Z"
              fill="url(#podiumFront)"
              stroke="#1C0D07"
              strokeWidth="2.5"
            />
            {/* Üst Eğimli Ahşap Pervaz */}
            <polygon points="5,40 155,40 145,28 15,28" fill="url(#podiumTrim)" stroke="#3E2012" strokeWidth="1.5" />
            {/* Ön Oyma Panel */}
            <rect x="35" y="55" width="90" height="105" rx="2" fill="#251209" stroke="#5D301C" strokeWidth="1.8" />
            <rect x="42" y="62" width="76" height="91" rx="1.5" fill="#1C0D07" stroke="#3D1D0F" strokeWidth="1" />

            {/* Taban Kaidesi */}
            <rect x="18" y="175" width="124" height="12" rx="2" fill="url(#podiumTrim)" stroke="#2E1810" strokeWidth="1.5" />

            {/* ============================================================== */}
            {/* C. KLASİK METAL GOOSENECK MİKROFON                           */}
            {/* ============================================================== */}
            <g transform="translate(80, 26)">
              {/* Mikrofon Kaidesi */}
              <ellipse cx="0" cy="0" rx="8" ry="3" fill="#334155" stroke="#0F172A" strokeWidth="1" />
              {/* Kavisli Metal Boyun (Gooseneck) */}
              <path d="M0 0 Q-10 -25 5 -42" stroke="#94A3B8" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M0 0 Q-10 -25 5 -42" stroke="#CBD5E1" strokeWidth="1" fill="none" strokeLinecap="round" />

              {/* Vintage Metal Mikrofon Başlığı */}
              <g transform="translate(6, -45) rotate(12)">
                <rect x="-6" y="-12" width="12" height="16" rx="4" fill="#64748B" stroke="#1E293B" strokeWidth="1.2" />
                {/* Izgara Çizgileri */}
                <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#1E293B" strokeWidth="1" />
                <line x1="-4" y1="-5" x2="4" y2="-5" stroke="#1E293B" strokeWidth="1" />
                <line x1="-4" y1="-2" x2="4" y2="-2" stroke="#1E293B" strokeWidth="1" />

                {/* Konuşurken Mikrofondan Çıkan Akustik Ses Dalgaları */}
                {isSuspectTalking && (
                  <g className="animate-ping" opacity="0.7">
                    <circle cx="0" cy="-6" r="10" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
                    <circle cx="0" cy="-6" r="16" stroke="#F59E0B" strokeWidth="0.8" fill="none" />
                  </g>
                )}

                {/* Susturulduğunda Kırmızı Çarpı / Kilit İkonu */}
                {isSilenced && (
                  <g>
                    <circle cx="0" cy="-4" r="8" fill="#991B1B" stroke="#DC2626" strokeWidth="1.5" />
                    <line x1="-4" y1="-8" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="4" y1="-8" x2="-4" y2="0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                  </g>
                )}
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* D. TAKTİKSEL ODAK ÇERÇEVESİ (SVG İçinde Şüpheli Başına Sabit)  */}
          {/* ============================================================== */}
          <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="square" fill="none">
            {/* Sol Üst Köşe */}
            <path d="M 212 96 L 212 82 L 226 82" />
            {/* Sağ Üst Köşe */}
            <path d="M 274 82 L 288 82 L 288 96" />
            {/* Sol Alt Köşe */}
            <path d="M 212 148 L 212 162 L 226 162" />
            {/* Sağ Alt Köşe */}
            <path d="M 274 162 L 288 162 L 288 148" />
          </g>
        </svg>

        {/* [ • ŞÜPHELİ ] HUD Rozeti (Reticle'ın Sağında, Yüzü Asla Kapatmaz) */}
        <div className="absolute top-[48px] sm:top-[68px] left-[calc(50%+36px)] sm:left-[calc(50%+46px)] pointer-events-none">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold tracking-widest uppercase shadow-lg backdrop-blur-md whitespace-nowrap transition-all duration-300 ${
            isSuspectTalking
              ? 'bg-amber-950/90 border border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
              : 'bg-black/75 border border-amber-400/40 text-amber-200/90'
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              isSuspectTalking ? 'bg-amber-400 animate-ping' : 'bg-amber-500'
            }`} />
            <span>ŞÜPHELİ</span>
          </div>
        </div>

        {/* Susturuldu / Kıskaç / Tereddüt Sayaç Bildirimi */}
        {isSilenced && (
          <div className="absolute bottom-6 sm:bottom-14 left-1/2 -translate-x-1/2 bg-rose-950/90 border border-rose-500 text-rose-200 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-bounce">
            <span>🔒 Şüpheli Susturuldu (Klavye Kilitli)</span>
          </div>
        )}

        {isYesNoClamp && (
          <div className="absolute bottom-6 sm:bottom-14 left-1/2 -translate-x-1/2 bg-amber-950/90 border border-amber-500 text-amber-200 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-bounce">
            <span>⚖️ Tek Kelime Kıskacı (Evet / Hayır)</span>
          </div>
        )}

        {isTimerClamp && timerSeconds !== undefined && timerSeconds > 0 && (
          <div className="absolute bottom-6 sm:bottom-14 left-1/2 -translate-x-1/2 bg-orange-950/90 border border-orange-500 text-orange-200 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse">
            <span>⏱️ 5 Sn Tereddüt Baskısı: {timerSeconds}s</span>
          </div>
        )}

      </div>

      {/* Alt Karartma Gradyanı (Sohbet Çekmecesine Yumuşak Geçiş) */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#080605] via-[#0C0908]/80 to-transparent pointer-events-none" />

    </div>
  );
};
