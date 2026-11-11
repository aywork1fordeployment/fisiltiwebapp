import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types/game.types';
import { AlertCircle, Paperclip } from 'lucide-react';

interface MainChatStreamProps {
  messages: ChatMessage[];
  confession?: string;
}

export const MainChatStream: React.FC<MainChatStreamProps> = ({ messages, confession }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sadece ana kanal mesajlarını filtrele (Giriş itiraf mesajı hariç tutulabilir çünkü üstte sabit klasör var)
  const mainMessages = messages.filter(
    m => m.channel === 'main' && !m.content.includes('İTİRAF / İDDİA DOSYASI:') && !m.content.includes('GİZLİ İTİRAF DOSYASI:')
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mainMessages.length]);

  return (
    <div className="flex-1 w-full overflow-y-auto p-3 sm:p-4 flex flex-col gap-3.5 text-sm select-text">
      
      {/* 1. Üstte Sabitlenen 'GİZLİ SORGU KLASÖRÜ' (İtiraf Kartı) */}
      {confession && (
        <div className="relative w-full bg-gradient-to-r from-[#1c1712] via-[#201a14] to-[#1a1510] border border-amber-500/40 rounded-2xl p-4 shadow-xl flex items-start gap-3 select-none overflow-hidden">
          
          {/* Sol: Dosya Ataş İkonu */}
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 mt-0.5 shadow-inner">
            <Paperclip className="w-5 h-5 -rotate-45" />
          </div>

          <div className="flex-1 min-w-0 pr-16 sm:pr-24">
            <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
              <span>📂 GİZLİ İTİRAF DOSYASI</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400 font-normal">ŞÜPHELİ İFADESİ</span>
            </span>
            <p className="text-[14px] sm:text-[15px] text-amber-100 font-medium leading-relaxed mt-1 italic">
              "{confession}"
            </p>
          </div>

          {/* Sağ Üst: Eğik Kırmızı [GİZLİ DOSYA] Damgası */}
          <div className="absolute right-3 top-3 border-2 border-rose-500 text-rose-400 px-2 py-0.5 rounded font-black text-[10px] tracking-widest uppercase rotate-[-8deg] shadow-md bg-rose-950/40 pointer-events-none">
            GİZLİ DOSYA
          </div>
        </div>
      )}

      {/* Mesaj Yokken */}
      {mainMessages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500 text-xs font-medium">
          <p className="animate-pulse">Sorgu tutanağı hazırlandı. Yargıçların veya şüphelinin ilk sözü bekleniyor...</p>
        </div>
      )}

      {/* Mesaj Akışı */}
      {mainMessages.map((msg) => {
        // Sistem Olayları (Ortalanmış Kompakt Hap Rozetler)
        if (msg.senderRole === 'system') {
          const isSlam = msg.systemType === 'slam';
          const isClamp = msg.systemType === 'clamp';
          const isHesitation = msg.systemType === 'hesitation';
          const isSpotlight = msg.systemType === 'spotlight';

          return (
            <div
              key={msg.id}
              className={`mx-auto px-4 py-1.5 rounded-full text-xs font-semibold text-center border my-1 transition-all ${
                isSlam
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-md animate-screen-shake'
                  : isClamp
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-md'
                  : isHesitation
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-200 animate-pulse'
                  : isSpotlight
                  ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200'
                  : 'bg-white/5 border-white/10 text-stone-300'
              }`}
            >
              <div className="inline-flex items-center gap-1.5">
                {isSlam && <span>🔨</span>}
                {isClamp && <span>⚖️</span>}
                {isHesitation && <span>💦</span>}
                {isSpotlight && <span>🔦</span>}
                <span>{msg.content}</span>
              </div>
            </div>
          );
        }

        const isSuspect = msg.senderRole === 'suspect';
        const isProsecutor = msg.senderRole === 'prosecutor';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[82%] ${
              isSuspect ? 'self-end flex-row-reverse' : 'self-start flex-row'
            }`}
          >
            {/* Rolün Mini Avatarı */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-md mt-1 ${
              isSuspect
                ? 'bg-slate-800 border border-cyan-400/50 text-cyan-300'
                : isProsecutor
                ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
            }`}>
              {isSuspect ? '🥷' : isProsecutor ? '👨‍⚖️' : '🕵️‍♂️'}
            </div>

            {/* Mesaj İçeriği */}
            <div className={`flex flex-col ${isSuspect ? 'items-end' : 'items-start'}`}>
              
              {/* Gönderen İsmi ve Zaman */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className={`text-xs font-bold ${
                  isSuspect ? 'text-cyan-300' : isProsecutor ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-stone-500 font-normal">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Cam Panel Sohbet Baloncuğu */}
              <div
                className={`p-3.5 rounded-2xl shadow-lg backdrop-blur-md text-[15px] font-medium leading-relaxed break-words relative border-t border-white/10 ${
                  isSuspect
                    ? 'bg-slate-800/75 border-r-4 border-cyan-400 text-stone-100 rounded-tr-sm'
                    : isProsecutor
                    ? 'bg-rose-950/40 border-l-4 border-rose-500 text-stone-100 rounded-tl-sm'
                    : 'bg-amber-950/40 border-l-4 border-amber-500 text-stone-100 rounded-tl-sm'
                } ${
                  msg.isSpotlight
                    ? 'ring-2 ring-rose-500 bg-rose-950/50 shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                    : ''
                }`}
              >
                <p className="font-normal text-stone-100">{msg.content}</p>

                {/* Çelişkili İfade Rozeti (Spotlight) */}
                {msg.isSpotlight && (
                  <div className="mt-2 pt-1.5 border-t border-rose-500/30 flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>⚠️ ÇELİŞKİLİ İFADE TESPİT EDİLDİ</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
};
