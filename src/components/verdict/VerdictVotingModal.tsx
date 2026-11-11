import React, { useState } from 'react';
import { VerdictType, PlayerRole } from '../../types/game.types';
import { Gavel, AlertCircle } from 'lucide-react';

interface VerdictVotingModalProps {
  isOpen: boolean;
  userRole: PlayerRole;
  onDecideVerdict: (verdict: VerdictType, reason: string) => void;
}

interface VerdictOption {
  type: VerdictType;
  emoji: string;
  desc: string;
  color: string;
}

const VERDICT_OPTIONS: VerdictOption[] = [
  {
    type: 'KATIKSIZ TOKSİK',
    emoji: '🚩',
    desc: 'Toplum içine çıkamaz, tam bir zehir kaynağı.',
    color: 'border-rose-500/50 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20',
  },
  {
    type: 'USTA MANİPÜLATÖR',
    emoji: '🎭',
    desc: 'Suçlu ama zeytinyağı gibi üste çıkmayı bildi.',
    color: 'border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20',
  },
  {
    type: 'MASUM / HAKLI',
    emoji: '😇',
    desc: 'Şartlar onu buna itmiş, vicdanen beraat!',
    color: 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20',
  },
  {
    type: 'KAOS ELÇİSİ',
    emoji: '🔥',
    desc: 'Dünyayı yakıp kenardan izlemekten zevk alıyor.',
    color: 'border-amber-500/50 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20',
  },
  {
    type: 'KENDİ KUYUSUNA DÜŞEN',
    emoji: '🤡',
    desc: 'Savunayım derken kendini ele verdi, rezil oldu.',
    color: 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20',
  },
];

const DEFAULT_REASONS: Record<VerdictType, string> = {
  'KATIKSIZ TOKSİK': 'Savunmasında hiçbir samimiyet bulunamadı, manipülasyonları tutanağa tescillendi.',
  'USTA MANİPÜLATÖR': 'Her sorudan tereyağından kıl çeker gibi sıyrıldı, profesyonel bir vaka.',
  'MASUM / HAKLI': 'Vicdan mahkemesinde suçsuz bulundu; yerinde kim olsa aynı şeyi yapardı.',
  'KAOS ELÇİSİ': 'Tüm savunması boyunca ortamı ateşe vermekten başka bir şey yapmadı.',
  'KENDİ KUYUSUNA DÜŞEN': 'Ağzından kaçırdığı tek bir kelimeyle tüm suçunu itiraf etmiş oldu.',
};

export const VerdictVotingModal: React.FC<VerdictVotingModalProps> = ({
  isOpen,
  userRole,
  onDecideVerdict,
}) => {
  const [selectedVerdict, setSelectedVerdict] = useState<VerdictType>('KATIKSIZ TOKSİK');
  const [customReason, setCustomReason] = useState(DEFAULT_REASONS['KATIKSIZ TOKSİK']);

  if (!isOpen) return null;

  const isSuspect = userRole === 'suspect' || userRole === 'supheli';

  const handleSelectVerdict = (type: VerdictType) => {
    setSelectedVerdict(type);
    setCustomReason(DEFAULT_REASONS[type]);
  };

  const handleConfirm = () => {
    onDecideVerdict(selectedVerdict, customReason.trim() || DEFAULT_REASONS[selectedVerdict]);
  };

  // Şüpheli İçin Bekleme Ekranı
  if (isSuspect) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
        <div className="w-full max-w-sm bg-[#181B26] border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-3xl animate-bounce">
            ⚖️
          </div>
          <h2 className="font-bold text-lg text-stone-100">
            Hüküm Veriliyor...
          </h2>
          <p className="text-xs text-stone-400 font-normal leading-relaxed">
            180 saniyelik çapraz sorgu sona erdi. Yargıçlar şu anda aynanın arkasında gizli oylama yapıyor ve dosyana nihai damgayı basıyor!
          </p>
          <div className="w-full bg-[#141722] h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Yargıç İçin Damga Basma Ekranı
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-md bg-[#181B26] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
        
        {/* Üst Başlık */}
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-stone-100">
              Nihai Hüküm ve Damga
            </h2>
            <p className="text-xs text-stone-400">
              Şüphelinin dava dosyasına basılacak kararı seç
            </p>
          </div>
        </div>

        {/* 5 Hüküm Seçeneği */}
        <div className="flex flex-col gap-2">
          {VERDICT_OPTIONS.map((opt) => {
            const isSelected = selectedVerdict === opt.type;
            return (
              <div
                key={opt.type}
                onClick={() => handleSelectVerdict(opt.type)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                  opt.color
                } ${isSelected ? 'ring-2 ring-white/60 scale-[1.01] shadow-md' : 'opacity-75'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <h4 className="font-bold text-xs tracking-wide">
                      {opt.type}
                    </h4>
                    <p className="text-[11px] opacity-80 leading-tight">
                      {opt.desc}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-md">
                    SEÇİLDİ
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Gerekçeli Karar Cümlesi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Gerekçeli Karar (Dosyaya Yazılacak):</span>
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            maxLength={100}
            className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-400 font-sans"
          />
        </div>

        {/* Damgayı Bas Butonu */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Gavel className="w-4 h-4" />
          <span>Damgayı Bas ve Dosyayı Kapat!</span>
        </button>

      </div>
    </div>
  );
};
