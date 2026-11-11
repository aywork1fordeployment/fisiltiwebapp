import React, { useState } from 'react';
import { PlayerRole } from '../../types/game.types';
import { Shield, Scale, Flame, Users, ArrowRight, Loader2, XCircle, RotateCcw } from 'lucide-react';

interface LandingHeroProps {
  onSelectRole: (role: PlayerRole, roomCode?: string) => void;
  onOpenConfessionBuilder: () => void;
  isWaitingInQueue?: boolean;
  waitingRole?: 'suspect' | 'judge';
  queueCounts?: { suspects: number; judges: number };
  onCancelQueue?: () => void;
  onResetStorage?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectRole,
  onOpenConfessionBuilder,
  isWaitingInQueue = false,
  waitingRole = 'judge',
  queueCounts = { suspects: 0, judges: 0 },
  onCancelQueue,
  onResetStorage,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [showRoomInput, setShowRoomInput] = useState(false);

  const handleJoinByCode = (role: PlayerRole) => {
    const code = roomCodeInput.trim().toUpperCase() || Math.floor(100 + Math.random() * 900).toString();
    onSelectRole(role, code);
  };

  const suspectCount = queueCounts.suspects;
  const judgeCount = queueCounts.judges;

  let statusMessage = '';
  if (suspectCount === 0 && judgeCount < 2) {
    statusMessage = `1 Şüpheli ve ${2 - judgeCount} Hakim bekleniyor...`;
  } else if (suspectCount === 0) {
    statusMessage = '1 Şüpheli bekleniyor...';
  } else if (judgeCount === 0) {
    statusMessage = '2 Hakim bekleniyor...';
  } else if (judgeCount === 1) {
    statusMessage = 'Son 1 Hakim bekleniyor...';
  } else {
    statusMessage = 'Duruşma Başlatılıyor...';
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 text-center select-none gap-5">
      
      {/* 1. Üst Rozet & Hafızayı Sıfırla Butonu */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wide">
          <Shield className="w-3.5 h-3.5" />
          <span>Sıfır Kayıt & Sıfır-Veri | 180 Saniye</span>
        </div>

        {onResetStorage && (
          <button
            onClick={onResetStorage}
            title="Önceki test kayıtlarını ve kuyruğu sıfırla"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-300 text-[11px] font-medium transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" />
            <span>🔄 Hafızayı Sıfırla</span>
          </button>
        )}
      </div>

      {/* Başlık */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-extrabold text-3xl sm:text-5xl text-stone-100 tracking-tight leading-none">
          ⚖️ FISILTI
        </h1>
        <h2 className="font-bold text-lg sm:text-2xl text-amber-400 tracking-wider">
          Asimetrik Mahkeme Salonu
        </h2>

        <p className="text-xs sm:text-sm text-stone-400 max-w-sm mt-0.5 leading-relaxed">
          Kayıt yok, bot yok. 1 Şüpheli ve 2 Hakim (1. Hakim & 2. Hakim) canlı yüzleşir!
        </p>
      </div>

      {/* CANLI BEKLEME ODASI (1 Şüpheli + 2 Hakim FIFO Kuyruğu) */}
      {isWaitingInQueue ? (
        <div className="w-full bg-[#18120F] border border-amber-500/40 rounded-2xl p-6 flex flex-col items-center gap-3.5 shadow-2xl animate-pulse">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>

          <div>
            <h3 className="font-bold text-base text-stone-100">
              Mahkeme Heyeti Toplanıyor...
            </h3>
            <p className="text-xs font-semibold text-amber-400 mt-1">
              {waitingRole === 'suspect' ? 'Sanık Kürsüsüne Geçtin' : 'Hakim Kürsüsüne Katıldın'}
            </p>
          </div>

          {/* Canlı Sayaç Rozeti */}
          <div className="w-full bg-[#120E0C] border border-amber-900/30 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-stone-200">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4" />
                <span>Şüpheli ({suspectCount}/1)</span>
              </span>
              <span className="text-stone-600">•</span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <Scale className="w-4 h-4" />
                <span>Hakimler ({judgeCount}/2)</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 font-medium">
              — {statusMessage}
            </p>
          </div>

          <p className="text-[11px] text-stone-500 leading-snug">
            💡 <em>İpucu: Test etmek için hemen yan sekmelerde yeni pencereler açıp kalan koltukları doldurabilirsiniz!</em>
          </p>

          {onCancelQueue && (
            <button
              onClick={onCancelQueue}
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200 bg-[#14100E] hover:bg-[#1E1714] border border-white/10 px-4 py-2 rounded-xl transition-colors active:scale-95"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Sıradan Ayrıl</span>
            </button>
          )}
        </div>
      ) : (
        /* LOBİ ROL SEÇİMİ */
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* ŞÜPHELİ KARTI */}
          <div
            onClick={onOpenConfessionBuilder}
            className="group relative bg-[#181310] hover:bg-[#201814] border border-amber-500/30 hover:border-amber-400/60 p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              1. ROL (1 Kişi)
            </span>
            <h3 className="font-bold text-base text-stone-100">
              Şüpheli Olarak Gir
            </h3>
            <p className="text-xs text-stone-400 leading-snug">
              Tartışmalı itirafını seç ve 2 hakimin karşısında sanık kürsüsünde kendini 3 dakika savun!
            </p>
            <div className="mt-1 w-full py-2 px-3 rounded-xl bg-amber-400 text-black font-semibold text-xs tracking-wider group-hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <span>Sanık Kürsüsüne Otur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* HAKİM KARTI */}
          <div
            onClick={() => onSelectRole('sert_hakim')}
            className="group relative bg-[#181310] hover:bg-[#201814] border border-rose-500/30 hover:border-rose-400/60 p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-rose-400 tracking-wider uppercase">
              2. ROL (2 Kişi)
            </span>
            <h3 className="font-bold text-base text-stone-100">
              Hakim Kürsüsüne Geç
            </h3>
            <p className="text-xs text-stone-400 leading-snug">
              Kürsüde gizlice fısıldaş, masaya vur, sustur ve nihai mahkeme hükmünü bas!
            </p>
            <div className="mt-1 w-full py-2 px-3 rounded-xl bg-rose-700 text-white font-semibold text-xs tracking-wider group-hover:bg-rose-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <span>Kürsüye Otur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      )}

      {/* 3. Arkadaşla Oyna / Oda Kodu ile Katıl */}
      <div className="w-full bg-[#15100E]/80 border border-white/[0.07] rounded-2xl p-3 flex flex-col gap-2">
        <button
          onClick={() => setShowRoomInput(!showRoomInput)}
          className="text-xs font-medium text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-stone-400" />
          <span>Arkadaşlarınla oynamak için oda kodun mu var? Tıkla</span>
        </button>

        {showRoomInput && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              placeholder="Oda Kodu (örn: 463)"
              className="flex-1 h-9 px-3 rounded-xl bg-[#0D0A08] border border-amber-500/20 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/50"
            />
            <button
              onClick={() => handleJoinByCode('sert_hakim')}
              className="h-9 px-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-colors"
            >
              Hakim Olarak Gir
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
