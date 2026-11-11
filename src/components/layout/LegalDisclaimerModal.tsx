import React from 'react';
import { ShieldCheck, AlertTriangle, EyeOff, Lock } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onAccept,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-[#181B26] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4">
        
        {/* Üst Başlık */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-stone-100 tracking-wide">
              Dosya Gizlilik & Kurgu Beyanı
            </h2>
            <p className="text-xs text-stone-400">
              Anonim Sorgu Odası Protokolü
            </p>
          </div>
        </div>

        {/* Maddeler */}
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
          <div className="flex items-start gap-2.5 bg-[#141722] p-3 rounded-xl border border-white/[0.06]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Bu platform tamamen anonim bir <strong>rol yapma (roleplay) ve doğaçlama kurgu oyunudur</strong>. Odada konuşulan tüm iddialar ve savunmalar hayal ürünüdür.
            </p>
          </div>

          <div className="flex items-start gap-2.5 bg-[#141722] p-3 rounded-xl border border-white/[0.06]">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Sıfır-Veri (Zero-Storage / KVKK):</strong> Sistem hiçbir mesajı, IP adresini veya kişisel veriyi kalıcı olarak kaydetmez. 180 saniye sonra tüm veriler RAM'den silinir.
            </p>
          </div>

          <div className="flex items-start gap-2.5 bg-[#141722] p-3 rounded-xl border border-white/[0.06]">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong>Anti-Doxxing Kalkanı:</strong> Gerçek kişi veya kurum ismi, telefon, @kullanıcıadı veya hedef gösterici ifadeler otomatik olarak engellenir ve sansürlenir.
            </p>
          </div>
        </div>

        {/* Onay Butonu */}
        <div className="pt-2">
          <button
            onClick={onAccept}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-black bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Kurgu Olduğunu Anladım, Odaya Gir</span>
          </button>
        </div>

      </div>
    </div>
  );
};
