import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PlayerRole } from '../../types/game.types';
import { Eye, Lock, Send, X, ShieldAlert } from 'lucide-react';

interface WhisperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  userRole: PlayerRole;
  isRevealed?: boolean;
  onSendWhisper?: (text: string) => void;
}

const QUICK_TACTICS = [
  'Yalan söylüyor, sıkıştır!',
  'Şimdi susturma basıyorum!',
  'İyi hakim oyna, itiraf etsin',
  'Evet/Hayır kıskacına al',
  'Detaylardan yakalayalım!',
];

export const WhisperDrawer: React.FC<WhisperDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  userRole,
  isRevealed = false,
  onSendWhisper,
}) => {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const whisperMessages = messages.filter((m) => m.channel === 'whisper');
  const isSuspect = userRole === 'supheli' || userRole === 'suspect';
  const isLockedForSuspect = isSuspect && !isRevealed;

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [whisperMessages.length, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !onSendWhisper) return;
    onSendWhisper(inputText.trim());
    setInputText('');
  };

  const handleTacticClick = (tactic: string) => {
    if (onSendWhisper) {
      onSendWhisper(tactic);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Karartma Katmanı (Backdrop) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[3px] z-40 transition-opacity animate-fade-in"
      />

      {/* 2. Sağdan Kayarak Açılan Çekmece (Slide-Over Drawer) */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] h-[100dvh] bg-[#14100E]/95 backdrop-blur-xl border-l border-amber-500/25 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-out select-none">
        
        {/* Üst Başlık Barı */}
        <div className="p-4 border-b border-amber-500/20 bg-[#1C1512] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                <span>Kürsü Fısıltıları</span>
                <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full border border-rose-500/30">
                  {whisperMessages.length} Fısıltı
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/60">
                {isSuspect ? 'Hakimlerin Gizli Konuşması' : 'Gizli Taktik Kanalı (Şüpheli Göremez)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik Bölgesi */}
        {isLockedForSuspect ? (
          /* Şüpheli İçin Kilitli Önizleme */
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="relative z-10 bg-[#1E1612] border border-amber-500/20 p-5 rounded-2xl shadow-xl max-w-xs flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">
                Kürsü Fısıltısı Kilitli!
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                Hakimler şu anda kürsüde senin hakkında gizlice toplam <strong className="text-rose-400 font-bold">{whisperMessages.length} taktik</strong> fısıldaştı.
              </p>
              <div className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1.5 rounded-lg">
                🔓 Duruşma bittiğinde tüm fısıltılar sana ifşa edilecek!
              </div>
            </div>
          </div>
        ) : (
          /* Hakimler veya Duruşma Bittiğinde Açık Mesaj Akışı */
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 select-text">
            {whisperMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShieldAlert className="w-8 h-8 mb-2 opacity-40 text-rose-400" />
                <p className="text-xs font-semibold text-stone-300">Henüz fısıltı yok.</p>
                <p className="text-[11px] text-amber-200/50 mt-1">
                  Hakimler gizli taktikleri ve şüpheyi buradan konuşur. Şüpheli burayı göremez.
                </p>
              </div>
            ) : (
              whisperMessages.map((msg) => {
                const isSert = msg.senderRole === 'sert_hakim' || msg.senderRole === 'prosecutor';
                return (
                  <div
                    key={msg.id}
                    className="bg-[#1C1512] border border-amber-500/15 p-3 rounded-xl flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isSert ? 'text-rose-400' : 'text-amber-400'}>
                        {isSert ? '👨‍⚖️ 1. Hakim' : '👨‍⚖️ 2. Hakim'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        {new Date(msg.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[13px] text-stone-200 leading-snug">
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        )}

        {/* Hızlı Taktik Çipleri ve Mesaj Gönderme (Sadece Hakimler İçin) */}
        {!isLockedForSuspect && (
          <div className="p-3 border-t border-amber-500/20 bg-[#17110E] flex flex-col gap-2">
            {/* Hızlı Taktik Butonları */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {QUICK_TACTICS.map((tactic) => (
                <button
                  key={tactic}
                  onClick={() => handleTacticClick(tactic)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/25 text-amber-200 transition-colors active:scale-95 shrink-0"
                >
                  + {tactic}
                </button>
              ))}
            </div>

            {/* Input Çubuğu */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={100}
                placeholder="Diğer hakime gizli taktik yaz..."
                className="flex-1 h-10 px-3 rounded-xl bg-[#0D0A08] border border-amber-500/20 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/60 transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`h-10 px-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                  !inputText.trim()
                    ? 'bg-stone-800/40 text-stone-600 cursor-not-allowed'
                    : 'bg-rose-700 hover:bg-rose-600 active:scale-95 text-white shadow-md'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
