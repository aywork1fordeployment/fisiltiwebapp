import React, { useRef, useState, useEffect } from 'react';
import { ChatMessage, VerdictType, PlayerRole } from '../../types/game.types';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Share2, RotateCcw, ShieldCheck, Flame, Scale, Check, Eye } from 'lucide-react';

interface CaseFileReceiptProps {
  roomCode: string;
  confession: string;
  category?: string;
  verdict: VerdictType;
  verdictReason: string;
  messages: ChatMessage[];
  userRole: PlayerRole;
  onRestart: () => void;
}

export const CaseFileReceipt: React.FC<CaseFileReceiptProps> = ({
  roomCode,
  confession,
  category,
  verdict,
  verdictReason,
  messages,
  onRestart,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sayfa açıldığında konfeti patlat
  useEffect(() => {
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f59e0b', '#dc2626', '#fbbf24'],
    });
  }, []);

  // En çarpıcı ana sorgu mesajları (ilk 4 tanesi)
  const mainHighlights = messages
    .filter(
      (m) =>
        m.channel === 'main' &&
        m.senderRole !== 'system' &&
        m.senderRole !== 'katip' &&
        !m.content.includes('İTİRAF / İDDİA DOSYASI') &&
        !m.content.includes('GİZLİ İTİRAF DOSYASI')
    )
    .slice(-4);

  // En çarpıcı gizli fısıltılar (sağ sütun için)
  const whisperHighlights = messages
    .filter(m => m.channel === 'whisper')
    .slice(-4);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090A0F',
      });
      const link = document.createElement('a');
      link.download = `karar-dava-dosyasi-${roomCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Görsel indirme hatası:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://karar.vercel.app';
  const currentHost =
    typeof window !== 'undefined' && window.location.host
      ? window.location.host
      : 'karar.vercel.app';

  const handleShareTwitter = () => {
    const tweetText = `🕵️‍♂️ KARAR! | Anonim Sorgu Salonu'nda çapraz sorguya çekildim!
Hüküm: [${verdict}] ⚖️
"Kürsüde hakkımda konuştukları gizli fısıltıları gördüm..."

Sen olsan ne karar verirdin? Odaya gir:
${currentOrigin}`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank');
  };

  const handleCopyShare = () => {
    const text = `🕵️‍♂️ KARAR! | ANONİM SORGU SALONU | #${roomCode} Dava Dosyası: ${verdict}!\n${currentOrigin}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center gap-3.5 p-3 select-none overflow-y-auto">
      
      {/* Üst İfşa Rozeti & Başlık */}
      <div className="text-center flex flex-col items-center gap-1">
        <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-3 py-0.5 rounded-full">
          🔓 Kürsü Arkası Açıldı | Tüm Sırlar İfşa Oldu!
        </span>
        <h2 className="font-extrabold text-xl text-stone-100 tracking-tight">
          Sorgu Tutanağı ve Dava Dosyası
        </h2>
      </div>

      {/* 480px X (TWITTER) İÇİN ÇİFT SÜTUNLU DAVA DOSYASI KARTI */}
      <div
        ref={cardRef}
        className="w-full bg-[#11131A] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 text-stone-100 relative overflow-hidden"
      >
        {/* Arka Plan Gizli Filigranı */}
        <div className="absolute right-2 bottom-6 text-8xl font-black text-white/[0.02] pointer-events-none select-none">
          GİZLİ
        </div>

        {/* 1. ÜST DOSYA BAŞLIĞI */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
              Anonim Sorgu Odası Protokolü
            </span>
            <span className="font-extrabold text-base tracking-wide text-stone-100">
              GİZLİ TUTANAK #{roomCode}
            </span>
          </div>
          <div className="text-right text-[10px] text-stone-400">
            <div>{new Date().toLocaleDateString('tr-TR')}</div>
            <div className="text-emerald-400 flex items-center gap-1 justify-end font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Sıfır-Veri</span>
            </div>
          </div>
        </div>

        {/* 2. ŞÜPHELİNİN İTİRAFI (ALTIN SARISI DOSYA ŞERİDİ) */}
        <div className="bg-amber-500/10 border-l-4 border-amber-400 p-2.5 rounded-r-xl">
          <div className="text-[10px] font-bold text-amber-400 flex items-center justify-between gap-1 mb-0.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>ŞÜPHELİNİN SAVUNDUĞU İTİRAF:</span>
            </span>
            {category && (
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                {category}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-[13px] text-amber-100 font-medium italic leading-relaxed">
            "{confession}"
          </p>
        </div>

        {/* 3. ÇİFT SÜTUNLU KARŞILAŞTIRMA (VİRAL KANCA!) */}
        <div className="grid grid-cols-2 gap-2 text-xs border border-white/10 rounded-xl p-2.5 bg-[#141722]/80">
          
          {/* SOL SÜTUN: RESMİ SORGU TUTANAĞI */}
          <div className="flex flex-col gap-2 border-r border-white/10 pr-2">
            <div className="text-[10px] font-bold text-stone-400 border-b border-white/10 pb-1 flex items-center gap-1">
              <Scale className="w-3 h-3 text-rose-400" />
              <span>🎙️ SORGUDA SÖYLENEN</span>
            </div>
            {mainHighlights.length === 0 ? (
              <p className="text-[10px] text-stone-600 italic">Kayıt yok.</p>
            ) : (
              mainHighlights.map((m, idx) => {
                const isSusp = m.senderRole === 'supheli' || m.senderRole === 'suspect';
                const isFirstJudge = m.senderRole === 'sert_hakim' || m.senderRole === 'prosecutor';
                return (
                  <div key={idx} className="leading-snug">
                    <span className={`text-[10px] font-semibold ${
                      isSusp ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {isSusp ? 'Şüpheli: ' : isFirstJudge ? '1. Hakim: ' : '2. Hakim: '}
                    </span>
                    <span className="text-[11px] text-stone-300">{m.content}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* SAĞ SÜTUN: AYNANIN ARKASI (GİZLİ FISILTILAR) */}
          <div className="flex flex-col gap-2 pl-1">
            <div className="text-[10px] font-bold text-rose-400 border-b border-white/10 pb-1 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>👁️ AYNANIN ARKASI İFŞASI</span>
            </div>
            {whisperHighlights.length === 0 ? (
              <p className="text-[10px] text-stone-600 italic">Fısıltı kaydedilmedi.</p>
            ) : (
              whisperHighlights.map((m, idx) => (
                <div key={idx} className="leading-snug bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/15">
                  <span className="text-[10px] font-semibold text-rose-300">
                    {m.senderName}:{' '}
                  </span>
                  <span className="text-[11px] text-rose-200 italic">{m.content}</span>
                </div>
              ))
            )}
          </div>

        </div>

        {/* 4. ALT HÜKÜM BÖLGESİ & PARLAK KIRMIZI DAMGA */}
        <div className="relative pt-2 pb-1 border-t border-white/10 flex flex-col items-center text-center gap-2">
          
          {/* DEVASE KIRMIZI DAMGA */}
          <div className="my-1 border-4 border-rose-600 text-rose-500 px-4 py-1.5 rounded-xl font-black text-lg sm:text-xl tracking-wide uppercase rotate-[-6deg] shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-stamp-slam select-none">
            [ HÜKÜM: {verdict} ]
          </div>

          {/* Gerekçeli Karar */}
          <p className="text-xs text-stone-300 max-w-xs font-medium">
            ⚖️ <span className="text-amber-400 font-bold">GEREKÇE:</span> "{verdictReason}"
          </p>

          {/* En Alttaki Viral Call-To-Action */}
          <div className="w-full pt-2 border-t border-dashed border-white/10 flex items-center justify-between text-[10px] text-stone-500">
            <span>🕵️‍♂️ Sen olsan ne karar verirdin?</span>
            <span className="text-amber-400 font-bold">⚖️ KARAR! | {currentHost}</span>
          </div>

          {/* Kurgusal Oyun İbaresi */}
          <div className="w-full pt-1 text-[9px] text-stone-500/80 text-center">
            Kurgusal polisiye rol yapma (RP) oyunudur • Verileriniz kaydedilmez, konuşmalar tamamen anonimdir.
          </div>

        </div>

      </div>

      {/* AKSİYON BUTONLARI */}
      <div className="w-full flex items-center gap-2 pt-1">
        
        {/* PNG İNDİR BUTONU */}
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Üretiliyor...' : 'PNG İndir'}</span>
        </button>

        {/* X (TWITTER) PAYLAŞ BUTONU */}
        <button
          onClick={handleShareTwitter}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#181B26] hover:bg-[#222736] border border-white/10 text-stone-100 font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>X'te Paylaş</span>
        </button>

        {/* LİNKİ KOPYALA BUTONU */}
        <button
          onClick={handleCopyShare}
          className="p-2.5 rounded-xl bg-[#181B26] hover:bg-[#222736] border border-white/10 text-stone-300 transition-colors"
          title="Linki Kopyala"
        >
          <Check className="w-4 h-4 text-emerald-400" />
        </button>

        {/* YENİ SORGU BUTONU */}
        <button
          onClick={onRestart}
          className="p-2.5 rounded-xl bg-[#181B26] hover:bg-[#222736] border border-white/10 text-stone-300 transition-colors"
          title="Yeni Sorguya Gir"
        >
          <RotateCcw className="w-4 h-4 text-stone-400" />
        </button>

      </div>

      {/* Paylaşım Kopyalama Bildirimi */}
      {copiedLink && (
        <div className="text-xs text-emerald-400 flex items-center gap-1 animate-pulse font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>Dava linki panoya kopyalandı!</span>
        </div>
      )}

    </div>
  );
};
