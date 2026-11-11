import React from 'react';
import { PlayerRole } from '../../types/game.types';

interface SuspectPovCourtroomProps {
  activeSpeaker: PlayerRole | null;
  speakingRole: PlayerRole | null;
  isWhispering: boolean;
  isKatipTyping: boolean;
  prosecutorState?: 'idle' | 'slam' | 'point' | 'whisper';
  statusText?: string | null;
}

export const SuspectPovCourtroom: React.FC<SuspectPovCourtroomProps> = ({
  activeSpeaker,
  speakingRole,
  isWhispering,
  isKatipTyping,
  prosecutorState = 'idle',
  statusText,
}) => {
  const isSertHakimTalking = speakingRole === 'sert_hakim' || activeSpeaker === 'sert_hakim';
  const isYumusakHakimTalking = speakingRole === 'yumusak_hakim' || activeSpeaker === 'yumusak_hakim';
  const isSlamming = prosecutorState === 'slam';

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#0E0B09] flex flex-col items-center justify-start overflow-hidden select-none">
      
      {/* 1. Üst Ambiyans & Maun Arka Plan Gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18110D] via-[#120D0A] to-[#0A0706] pointer-events-none" />

      {/* Arka Plan Mahkeme Ahşap Duvar Panelleri */}
      <div className="absolute inset-0 opacity-25 pointer-events-none flex justify-center">
        <div className="w-full max-w-2xl h-full border-x border-amber-900/30 flex justify-around">
          <div className="w-1/4 h-3/4 border-r border-amber-900/20" />
          <div className="w-1/4 h-3/4 border-r border-amber-900/20" />
          <div className="w-1/4 h-3/4 border-r border-amber-900/20" />
        </div>
      </div>

      {/* Duvar Ortasında Bronz Adalet Mührü Silüeti */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full border border-amber-600/15 flex items-center justify-center pointer-events-none opacity-30 shadow-[0_0_50px_rgba(180,83,9,0.08)]">
        <div className="w-36 h-36 rounded-full border border-dashed border-amber-600/20 flex items-center justify-center text-[10px] tracking-widest text-amber-500/30 font-bold uppercase rotate-12">
          ADALET MÜLKÜN TEMELİDİR
        </div>
      </div>

      {/* 2. Kürsü Üstü Sıcak Sahne Aydınlatması */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[540px] h-[340px] pointer-events-none opacity-35"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* 3. Fısıltı Gerilim Uyarısı (Hakimler kafa kafaya verince parlar) */}
      {(isWhispering || statusText) && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-pulse">
          <div className="bg-gradient-to-r from-rose-950/90 via-amber-950/90 to-rose-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-rose-500/50 text-xs font-semibold text-rose-200 flex items-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.35)]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{statusText || '👁️ Hakimler şu an kürsüde senin hakkında fısıldaşıyor...'}</span>
          </div>
        </div>
      )}

      {/* 4. ANA MAHKEME KÜRSÜSÜ VE HAKİMLER SAHNESİ (Detaylı Noir Vektör İllüstrasyon) */}
      <div className="relative z-10 w-full max-w-[620px] h-[400px] mt-2 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 600 420"
          className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ahşap Maun Gradyanları */}
            <linearGradient id="mahoganyDais" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A2616" />
              <stop offset="45%" stopColor="#351B10" />
              <stop offset="100%" stopColor="#1E0E08" />
            </linearGradient>

            <linearGradient id="mahoganyTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#693720" />
              <stop offset="50%" stopColor="#8C4E2E" />
              <stop offset="100%" stopColor="#552B18" />
            </linearGradient>

            <linearGradient id="judgeChairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#351B12" />
              <stop offset="50%" stopColor="#25120A" />
              <stop offset="100%" stopColor="#150905" />
            </linearGradient>

            {/* Kırmızı-Kehribar Parlayan Gözlük Filtresi (1. Hakim) */}
            <filter id="redGlassesGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* A. SOL HAKİM: 1. HAKİM (GÖĞÜS/BEL HİZASINA KADAR NET GÖRÜNÜR) */}
          {/* ============================================================== */}
          <g className={`transition-transform duration-500 origin-[185px_120px] ${
            isWhispering ? 'rotate-[4deg] translate-x-2' : ''
          }`}>
            {/* Yüksek Deri Koltuk Arkalığı */}
            <path
              d="M130 35 C130 15 155 5 185 5 C215 5 240 15 240 35 L240 170 L130 170 Z"
              fill="url(#judgeChairGrad)"
              stroke="#5D301C"
              strokeWidth="2.5"
            />
            <circle cx="185" cy="12" r="7" fill="#8C4E2E" stroke="#4A2616" strokeWidth="1.5" />
            <path d="M150 18 Q185 10 220 18" stroke="#B45309" strokeWidth="1.5" fill="none" />

            {/* 1. HAKİM FİGÜRÜ (GÖVDE SABİT - ASLA ZIPLAMAZ!) */}
            <g>
              {/* Siyah Cübbe Gövdesi ve Omuzlar */}
              <path
                d="M135 115 C135 85 158 75 185 75 C212 75 235 85 235 115 L240 175 L130 175 Z"
                fill="#161416"
                stroke="#09080A"
                strokeWidth="1.8"
              />
              {/* Cübbe Pileleri & Saten Yaka Detayları */}
              <path d="M160 85 L155 175" stroke="#2B282C" strokeWidth="1.8" />
              <path d="M210 85 L215 175" stroke="#2B282C" strokeWidth="1.8" />

              {/* Beyaz Hakim Gömlek Yakası */}
              <path d="M178 75 L185 86 L192 75 Z" fill="#F8FAFC" />
              {/* İpek Kırmızı Kravat */}
              <path d="M182 86 L185 125 L188 86 Z" fill="#DC2626" />
              <path d="M184 92 L186 122" stroke="#EF4444" strokeWidth="0.8" />

              {/* Boyun */}
              <rect x="180" y="60" width="10" height="18" fill="#D99B7D" />

              {/* Yüz (Keskin Hatlar, Belirgin Çene) */}
              <path
                d="M171 42 C171 28 178 22 185 22 C192 22 199 28 199 42 C199 56 193 63 185 63 C177 63 171 56 171 42 Z"
                fill="#E8B598"
                stroke="#5D301C"
                strokeWidth="1.2"
              />

              {/* Sert Siyah Saç (Şakaklarda Gri Detaylar) */}
              <path
                d="M168 36 C168 20 176 14 185 14 C194 14 202 20 202 36 C198 28 194 26 185 26 C176 26 172 28 168 36 Z"
                fill="#1C1819"
              />
              <path d="M170 33 Q173 28 178 27" stroke="#94A3B8" strokeWidth="0.8" fill="none" />
              <path d="M200 33 Q197 28 192 27" stroke="#94A3B8" strokeWidth="0.8" fill="none" />

              {/* Çatık Kaşlar */}
              <line x1="175" y1="36" x2="182" y2="39" stroke="#110E0F" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="195" y1="36" x2="188" y2="39" stroke="#110E0F" strokeWidth="2.2" strokeLinecap="round" />

              {/* KIRMIZI-KEHRİBAR YANSIMALI GÖZLÜKLER */}
              <g filter="url(#redGlassesGlow)">
                {/* Sol Cam */}
                <rect x="174" y="38" width="9" height="6" rx="1.5" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
                {/* Sağ Cam */}
                <rect x="187" y="38" width="9" height="6" rx="1.5" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
                {/* Köprü */}
                <line x1="183" y1="41" x2="187" y2="41" stroke="#F87171" strokeWidth="1.2" />
                {/* Parlayan Beyaz Işık Yansımaları */}
                <circle cx="178" cy="40.5" r="1.5" fill="#FFFFFF" />
                <circle cx="191" cy="40.5" r="1.5" fill="#FFFFFF" />
              </g>

              {/* Burun */}
              <path d="M185 41 L183 49 L186 49" stroke="#9A593D" strokeWidth="1" fill="none" />

              {/* Ağız (Sadece Ağız Oynar - Gövde Zıplamaz!) */}
              <g transform="translate(185, 54)">
                {isSertHakimTalking ? (
                  <ellipse cx="0" cy="0" rx="3.5" ry="2.2" fill="#5A1A1A" className="animate-mouth-speak" />
                ) : (
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="#683424" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </g>

              {/* Sol El Kürsüde (Evraklar Üzerinde) */}
              <rect x="155" y="158" width="24" height="16" rx="2" fill="#F8FAFC" transform="rotate(-4 167 166)" stroke="#CBD5E1" strokeWidth="0.8" />
              <ellipse cx="168" cy="162" rx="7" ry="4" fill="#E8B598" stroke="#8C4E2E" strokeWidth="1" />

              {/* SAĞ EL VE TOKMAK (GAVEL) — Sadece Tokmak Hareket Eder! */}
              <g className={isSlamming ? 'animate-gavel-strike' : ''} style={{ transformOrigin: '215px 165px' }}>
                {/* Tokmak Kaidesi / Ses Bloğu (Sound Block - Kürsü Üstünde) */}
                <ellipse cx="225" cy="173" rx="12" ry="5" fill="#3D1D0F" stroke="#78350F" strokeWidth="1.2" />
                {/* Tokmak Sapı */}
                <path d="M210 166 L226 156 L228 158 L212 168 Z" fill="#8C4E2E" />
                {/* Tokmak Ahşap Başlığı & Pirinç Halka */}
                <rect x="222" y="148" width="9" height="15" rx="2" fill="#5D301C" stroke="#2B140B" strokeWidth="1.2" transform="rotate(-15 226 155)" />
                <line x1="222" y1="155" x2="231" y2="155" stroke="#F59E0B" strokeWidth="1.2" transform="rotate(-15 226 155)" />
                {/* Tokmağı Tutan Sağ El */}
                <ellipse cx="212" cy="166" rx="6" ry="4" fill="#E8B598" stroke="#8C4E2E" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* B. SAĞ HAKİM: 2. HAKİM (KIR SAÇLI, BİLGELİK DOLU İFADE)        */}
          {/* ============================================================== */}
          <g className={`transition-transform duration-500 origin-[395px_120px] ${
            isWhispering ? 'rotate-[-4deg] -translate-x-2' : ''
          }`}>
            {/* Yüksek Deri Koltuk Arkalığı */}
            <path
              d="M340 35 C340 15 365 5 395 5 C425 5 450 15 450 35 L450 170 L340 170 Z"
              fill="url(#judgeChairGrad)"
              stroke="#5D301C"
              strokeWidth="2.5"
            />
            <circle cx="395" cy="12" r="7" fill="#8C4E2E" stroke="#4A2616" strokeWidth="1.5" />
            <path d="M360 18 Q395 10 430 18" stroke="#B45309" strokeWidth="1.5" fill="none" />

            {/* 2. HAKİM FİGÜRÜ (GÖVDE SABİT) */}
            <g>
              {/* Siyah Cübbe Gövdesi ve Omuzlar */}
              <path
                d="M345 115 C345 85 368 75 395 75 C422 75 445 85 445 115 L450 175 L340 175 Z"
                fill="#18171C"
                stroke="#09080A"
                strokeWidth="1.8"
              />
              <path d="M370 85 L365 175" stroke="#2B282C" strokeWidth="1.8" />
              <path d="M420 85 L425 175" stroke="#2B282C" strokeWidth="1.8" />

              {/* Beyaz Hakim Gömlek Yakası */}
              <path d="M388 75 L395 86 L402 75 Z" fill="#F8FAFC" />
              {/* Koyu Mavi/Gri Kravat */}
              <path d="M392 86 L395 125 L398 86 Z" fill="#2563EB" />
              <path d="M394 92 L396 122" stroke="#60A5FA" strokeWidth="0.8" />

              {/* Boyun */}
              <rect x="390" y="60" width="10" height="18" fill="#E2B193" />

              {/* Yüz (Dignified, bilge ifade) */}
              <path
                d="M381 42 C381 28 388 22 395 22 C402 22 409 28 409 42 C409 56 403 63 395 63 C387 63 381 56 381 42 Z"
                fill="#E8B598"
                stroke="#5D301C"
                strokeWidth="1.2"
              />

              {/* Kır / Gri Saç (Zarif Dalgalı) */}
              <path
                d="M378 36 C378 18 386 13 395 13 C404 13 412 18 412 36 C408 26 403 24 395 24 C387 24 382 26 378 36 Z"
                fill="#94A3B8"
                stroke="#64748B"
                strokeWidth="0.8"
              />
              {/* Şakaklar ve Saç Dokusu */}
              <path d="M379 32 Q384 25 391 25" stroke="#CBD5E1" strokeWidth="0.8" fill="none" />
              <path d="M411 32 Q406 25 399 25" stroke="#CBD5E1" strokeWidth="0.8" fill="none" />

              {/* Bıyık & Sakal (Detaylı Kır Bıyık) */}
              <path d="M388 52 Q395 50 402 52 Q395 56 388 52 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="0.6" />

              {/* Sakin Kaşlar & Badem Gözler */}
              <line x1="385" y1="36" x2="391" y2="37" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="405" y1="36" x2="399" y2="37" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse cx="388" cy="41" rx="2" ry="1.4" fill="#1E293B" />
              <ellipse cx="402" cy="41" rx="2" ry="1.4" fill="#1E293B" />
              <circle cx="389" cy="40.5" r="0.6" fill="#FFFFFF" />
              <circle cx="403" cy="40.5" r="0.6" fill="#FFFFFF" />

              {/* Burun */}
              <path d="M395 40 L393 47 L397 47" stroke="#9A593D" strokeWidth="1" fill="none" />

              {/* Ağız (Sadece Ağız Oynar) */}
              <g transform="translate(395, 55)">
                {isYumusakHakimTalking ? (
                  <ellipse cx="0" cy="0" rx="3.2" ry="2" fill="#5A1A1A" className="animate-mouth-speak" />
                ) : (
                  <path d="M-3 0 Q0 2 3 0" stroke="#683424" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                )}
              </g>

              {/* Kürsü Üstünde Sakince Birleştirilmiş İki El */}
              <ellipse cx="395" cy="166" rx="14" ry="7" fill="#E8B598" stroke="#8C4E2E" strokeWidth="1.2" />
              <line x1="392" y1="163" x2="392" y2="169" stroke="#78350F" strokeWidth="0.8" />
              <line x1="398" y1="163" x2="398" y2="169" stroke="#78350F" strokeWidth="0.8" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* C. ANA MAUN HAKİM KÜRSÜSÜ (ÖN BARİYER)                        */}
          {/* ============================================================== */}
          <path
            d="M50 160 L550 160 L525 285 L75 285 Z"
            fill="url(#mahoganyDais)"
            stroke="#1C0D07"
            strokeWidth="3"
          />
          {/* Üst Kalıp Pervazı */}
          <rect x="40" y="152" width="520" height="12" rx="3" fill="url(#mahoganyTrim)" stroke="#3E2012" strokeWidth="1.5" />
          <line x1="40" y1="155" x2="560" y2="155" stroke="#B45309" strokeWidth="1" opacity="0.6" />

          {/* Kürsü Dikey Sütunları & İşlemeli Panelleri */}
          <g opacity="0.85">
            {/* Sol Panel */}
            <rect x="85" y="176" width="95" height="95" rx="3" fill="#2A140B" stroke="#5D301C" strokeWidth="2" />
            <rect x="93" y="184" width="79" height="79" rx="2" fill="#200E07" stroke="#422011" strokeWidth="1.2" />

            {/* Orta Panel (Adalet Arması Oyma) */}
            <rect x="235" y="176" width="130" height="95" rx="3" fill="#2A140B" stroke="#5D301C" strokeWidth="2" />
            <rect x="245" y="184" width="110" height="79" rx="2" fill="#200E07" stroke="#422011" strokeWidth="1.2" />
            <circle cx="300" cy="223" r="20" stroke="#78350F" strokeWidth="1.5" fill="none" opacity="0.5" />

            {/* Sağ Panel */}
            <rect x="420" y="176" width="95" height="95" rx="3" fill="#2A140B" stroke="#5D301C" strokeWidth="2" />
            <rect x="428" y="184" width="79" height="79" rx="2" fill="#200E07" stroke="#422011" strokeWidth="1.2" />
          </g>

          {/* ============================================================== */}
          {/* D. KATİP MASASI VE DAKTİLO (KÜRSÜNÜN ÖNÜNDE SABİT - ZIPLAMAZ!) */}
          {/* ============================================================== */}
          <g transform="translate(180, 215)">
            {/* Katip Masası (100% SABİT) */}
            <rect x="45" y="60" width="150" height="85" rx="3" fill="#32170D" stroke="#1F0D06" strokeWidth="2" />
            <rect x="40" y="55" width="160" height="9" rx="2" fill="url(#mahoganyTrim)" stroke="#4A2514" strokeWidth="1.2" />

            {/* KATİP KARAKTERİ (Detaylı Yüz ve Kıyafet) */}
            {/* Sandalye */}
            <rect x="90" y="15" width="60" height="50" rx="4" fill="#1C100B" stroke="#3D2012" strokeWidth="1.5" />
            {/* Koyu Şık Ceket ve Omuzlar */}
            <path d="M85 65 C85 40 100 30 120 30 C140 30 155 40 155 65 L160 110 L80 110 Z" fill="#26282E" stroke="#15171C" strokeWidth="1.5" />
            {/* Beyaz Gömlek Yakası */}
            <path d="M114 30 L120 44 L126 30 Z" fill="#F8FAFC" />

            {/* Boyun */}
            <rect x="116" y="22" width="8" height="12" fill="#E8B598" />
            {/* Yüz Hatları */}
            <ellipse cx="120" cy="18" rx="10" ry="12" fill="#E8B598" stroke="#532B1B" strokeWidth="0.8" />
            {/* Topuz Saç (Zarif Kahverengi) */}
            <path d="M110 16 C110 5 115 2 120 2 C125 2 130 5 130 16 C127 10 125 9 120 9 C115 9 113 10 110 16 Z" fill="#3E2012" />
            <circle cx="120" cy="2" r="5.5" fill="#351B0E" />

            {/* Zarif Katip Gözlüğü & Kaşlar */}
            <line x1="114" y1="14" x2="118" y2="15" stroke="#2B160C" strokeWidth="1" strokeLinecap="round" />
            <line x1="126" y1="14" x2="122" y2="15" stroke="#2B160C" strokeWidth="1" strokeLinecap="round" />
            {/* İnce Tel Gözlük */}
            <ellipse cx="116" cy="18" rx="3.5" ry="2.5" fill="none" stroke="#D97706" strokeWidth="0.8" />
            <ellipse cx="124" cy="18" rx="3.5" ry="2.5" fill="none" stroke="#D97706" strokeWidth="0.8" />
            <line x1="119.5" y1="18" x2="120.5" y2="18" stroke="#D97706" strokeWidth="0.8" />

            {/* DAKTİLO (100% SABİT - ASLA ZIPLAMAZ!) */}
            <g transform="translate(95, 48)">
              {/* Daktilo Gövdesi */}
              <rect x="0" y="16" width="50" height="22" rx="3" fill="#2D3748" stroke="#1A202C" strokeWidth="1.5" />
              {/* Tuşlar */}
              <rect x="4" y="24" width="42" height="11" rx="1.5" fill="#1A202C" />
              <g fill="#CBD5E1" opacity="0.8">
                <circle cx="8" cy="27" r="1.1" />
                <circle cx="14" cy="27" r="1.1" />
                <circle cx="20" cy="27" r="1.1" />
                <circle cx="26" cy="27" r="1.1" />
                <circle cx="32" cy="27" r="1.1" />
                <circle cx="38" cy="27" r="1.1" />
                <circle cx="11" cy="31" r="1.1" />
                <circle cx="17" cy="31" r="1.1" />
                <circle cx="23" cy="31" r="1.1" />
                <circle cx="29" cy="31" r="1.1" />
                <circle cx="35" cy="31" r="1.1" />
              </g>

              {/* Kağıt Silindiri ve Tutanak Kağıdı (SABİT - ZIPLAMAZ!) */}
              <rect x="-4" y="10" width="58" height="6" rx="2" fill="#0F172A" />
              <rect x="10" y="-3" width="30" height="15" rx="1" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              <line x1="14" y1="1" x2="36" y2="1" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="14" y1="5" x2="32" y2="5" stroke="#94A3B8" strokeWidth="0.8" />

              {/* SADECE KATİBİN ELLERİ (YAZARKEN TİTREŞİM ANİMASYONU) */}
              <g className={isKatipTyping ? 'animate-typewriter-hands' : ''}>
                <ellipse cx="14" cy="27" rx="4.5" ry="3" fill="#E8B598" stroke="#5C2D1B" strokeWidth="0.8" />
                <ellipse cx="36" cy="27" rx="4.5" ry="3" fill="#E8B598" stroke="#5C2D1B" strokeWidth="0.8" />
              </g>
            </g>

            {/* KATİP İSİM ROZETİ (MASANIN TAM ÖN ORTASINDA SABİTLENMİŞTİR) */}
            <g transform="translate(120, 85)">
              <rect
                x="-36"
                y="-10"
                width="72"
                height="20"
                rx="5"
                fill={isKatipTyping ? "#451A03" : "#1A0E08"}
                stroke={isKatipTyping ? "#F59E0B" : "#78350F"}
                strokeWidth="1.5"
                className="transition-colors"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill={isKatipTyping ? "#FDE68A" : "#D4AF37"}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="1"
              >
                {isKatipTyping ? "⌨️ KATİP" : "KATİP"}
              </text>
            </g>
          </g>
        </svg>

        {/* ============================================================== */}
        {/* E. HUD ETİKETLERİ (1. HAKİM VE 2. HAKİM İÇİN)                 */}
        {/* ============================================================== */}
        {/* 1. HAKİM HUD Etiketi (Sol Üst) */}
        <div className="absolute top-4 left-6 sm:left-14 flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all ${
            isSertHakimTalking
              ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-black/60 border-rose-500/30 text-rose-300/90'
          }`}>
            <span className="font-extrabold text-[11px] tracking-wider uppercase">1. HAKİM</span>
            <span className={`w-2 h-2 rounded-full ${
              isSertHakimTalking ? 'bg-rose-500 animate-ping' : 'bg-rose-600'
            }`} />
          </div>
        </div>

        {/* 2. HAKİM HUD Etiketi (Sağ Üst) */}
        <div className="absolute top-4 right-6 sm:right-14 flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all ${
            isYumusakHakimTalking
              ? 'bg-amber-950/90 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
              : 'bg-black/60 border-amber-500/30 text-amber-300/90'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isYumusakHakimTalking ? 'bg-amber-400 animate-ping' : 'bg-amber-500'
            }`} />
            <span className="font-extrabold text-[11px] tracking-wider uppercase">2. HAKİM</span>
          </div>
        </div>

      </div>

      {/* Alt Karartma Gradyanı */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0A0706] via-[#0E0B09]/80 to-transparent pointer-events-none" />

    </div>
  );
};
