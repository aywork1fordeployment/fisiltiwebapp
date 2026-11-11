import React, { useState } from 'react';
import { ConfessionPreset } from '../../types/game.types';
import { sanitizeMessage } from '../../security/piiSanitizer';
import { Dices, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const CONFESSION_PRESETS: ConfessionPreset[] = [
  // 1. İlişkiler
  { id: 'rel_1', category: 'İlişkiler', text: 'Sevgilimin en yakın arkadaşıyla geçmişte flört ettiğimizi ondan 2 yıldır saklıyorum.' },
  { id: 'rel_2', category: 'İlişkiler', text: 'Evlilik teklifi aldım ama sadece ortam bozulmasın diye evet dedim, ayrılmayı düşünüyorum.' },
  { id: 'rel_3', category: 'İlişkiler', text: 'Eski sevgilimin yeni sevgilisini sahte hesaptan stalk\'layıp kusurlarını buldukça rahatlıyorum.' },
  { id: 'rel_4', category: 'İlişkiler', text: 'Sevgilim uyurken parmak iziyle telefonunu açıp tüm WhatsApp mesajlarını okudum.' },
  { id: 'rel_5', category: 'İlişkiler', text: 'Beni seven birini sadece canım sıkıldığında ilgi görmek için cepte tutuyorum.' },

  // 2. Arkadaşlık
  { id: 'fr_1', category: 'Arkadaşlık', text: 'En yakın arkadaşımın yeni ilişkisini gizlice sabote ettim çünkü o kişiyi hiç gözüm tutmadı.' },
  { id: 'fr_2', category: 'Arkadaşlık', text: 'Arkadaş grubumun benden habersiz plan yaptığını anlayınca hepsini sessize alıp aralarını bozdum.' },
  { id: 'fr_3', category: 'Arkadaşlık', text: 'Yakın arkadaşımın bana emanet ettiği büyük sırrı başka bir ortamda dedikodu mezesi yaptım.' },
  { id: 'fr_4', category: 'Arkadaşlık', text: 'Arkadaşımın başarısını tebrik ettim ama içten içe onun benden öne geçmesine çok bilendim.' },
  { id: 'fr_5', category: 'Arkadaşlık', text: 'Buluşmaya gitmemek için ailemde hastalık var yalanı uydurup evde dizi izledim.' },

  // 3. İş & Para
  { id: 'biz_1', category: 'İş & Para', text: 'Ortak hesabımızdan harcadığım parayı sistem hatası oldu diyerek ortağıma ödettim.' },
  { id: 'biz_2', category: 'İş & Para', text: 'İş yerinde terfi almak için çalışma arkadaşımın yaptığı projeyi yöneticime ben yaptım dedim.' },
  { id: 'biz_3', category: 'İş & Para', text: 'CV\'me bilmediğim 3 yazılım dilini ve sahte referansları yazarak işe girdim.' },
  { id: 'biz_4', category: 'İş & Para', text: 'Restoranda hesabı ortak öderken kendi içtiğim pahalı kokteyli genele kilitledim.' },
  { id: 'biz_5', category: 'İş & Para', text: 'Şirketin pahalı ekipmanını yanlışlıkla bozdum ve stajyerin üzerine attım.' },

  // 4. Radikal Fikir
  { id: 'rad_1', category: 'Radikal Fikir', text: 'İlişkide telefon karıştırmak en doğal haktır, gizlilik diyen kesin bir şey saklıyordur.' },
  { id: 'rad_2', category: 'Radikal Fikir', text: 'Sadakat doğaya aykırıdır; insanlar sadece yakalanmaktan korktuğu için tek eşli kalır.' },
  { id: 'rad_3', category: 'Radikal Fikir', text: 'Borç aldığın kişi çok zenginse ve hatırlatmıyorsa o parayı geri ödemek zorunda değilsin.' },
  { id: 'rad_4', category: 'Radikal Fikir', text: 'Yalan söylemek bir zeka belirtisidir; dürüstlük çoğu zaman tembelliktir.' },
  { id: 'rad_5', category: 'Radikal Fikir', text: 'Toplumdaki insanların %90\'ı vasattır, onların fikirlerine saygı duymak anlamsızdır.' },

  // 5. Sosyal Medya
  { id: 'soc_1', category: 'Sosyal Medya', text: 'Sahte hesaptan kendi arkadaş grubumu birbirine düşürüp kenardan zevkle izliyorum.' },
  { id: 'soc_2', category: 'Sosyal Medya', text: 'Gittiğim lüks mekanda başkalarının sipariş ettiği pahalı masayı çekip kendi hikayeme attım.' },
  { id: 'soc_3', category: 'Sosyal Medya', text: 'Beni takipten çıkan herkesi fake hesapla listeleyip intikam planı yapıyorum.' },
  { id: 'soc_4', category: 'Sosyal Medya', text: 'Twitter\'da etkileşim almak için gerçekte hiç inanmadığım uç fikirleri savunuyorum.' },
  { id: 'soc_5', category: 'Sosyal Medya', text: 'Kendi fotoğrafımı paylaşırken yanımdaki arkadaşımın yüzünü bilerek çirkin bıraktım.' },
];

const CATEGORIES = ['İlişkiler', 'Arkadaşlık', 'İş & Para', 'Radikal Fikir', 'Sosyal Medya'] as const;

interface ConfessionBuilderProps {
  onConfirm: (confession: string, category: string) => void;
  onBack: () => void;
}

export const ConfessionBuilder: React.FC<ConfessionBuilderProps> = ({
  onConfirm,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('İlişkiler');
  const [customText, setCustomText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(CONFESSION_PRESETS[0].id);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const filteredPresets = CONFESSION_PRESETS.filter(p => p.category === selectedCategory);

  const handleRandomPick = () => {
    const randomIdx = Math.floor(Math.random() * CONFESSION_PRESETS.length);
    const item = CONFESSION_PRESETS[randomIdx];
    setSelectedCategory(item.category);
    setSelectedPresetId(item.id);
    setActiveTab('preset');
  };

  const handleStart = () => {
    if (activeTab === 'preset') {
      const preset = CONFESSION_PRESETS.find(p => p.id === selectedPresetId);
      if (preset) {
        onConfirm(preset.text, preset.category);
      }
    } else {
      const result = sanitizeMessage(customText, 140);
      if (result.isValid && result.sanitizedText.length > 5) {
        onConfirm(result.sanitizedText, selectedCategory);
      }
    }
  };

  const validation = activeTab === 'custom' ? sanitizeMessage(customText, 140) : null;
  const isCustomValid = Boolean(activeTab === 'custom' && validation?.isValid && customText.trim().length >= 10);
  const isPresetValid = Boolean(activeTab === 'preset' && selectedPresetId);
  const canSubmit = activeTab === 'preset' ? isPresetValid : isCustomValid;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#181B26] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-stone-100 select-none">
      
      {/* Üst Başlık & Kategori Seçimi */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-amber-400 flex items-center gap-2">
            <span>📂</span>
            <span>İtiraf & Savunma Dosyası Seç</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Sorgulanacağın konuyu seç veya kendi cümleni yaz (Max 140 karakter)
          </p>
        </div>

        <button
          onClick={handleRandomPick}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-200 bg-[#222736] hover:bg-[#2a3042] border border-white/10 px-2.5 py-1.5 rounded-xl transition-colors active:scale-95 shrink-0"
          title="Rastgele İtiraf Seç"
        >
          <Dices className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Rastgele</span>
        </button>
      </div>

      {/* Kategori Butonları */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 font-semibold'
                : 'bg-[#141722] border-white/10 text-stone-400 hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sekmeler: Hazır Kartlar vs Kendin Yaz */}
      <div className="flex border-b border-white/10 text-xs">
        <button
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-2 text-center border-b-2 font-semibold transition-colors ${
            activeTab === 'preset'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          Hazır Kışkırtıcı Kartlar ({filteredPresets.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 text-center border-b-2 font-semibold transition-colors ${
            activeTab === 'custom'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          Kendin Yaz (140 Karakter)
        </button>
      </div>

      {/* İçerik Alanı */}
      {activeTab === 'preset' ? (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredPresets.map(preset => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-xl border text-xs sm:text-[13px] cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400/60 text-amber-100 shadow-sm'
                    : 'bg-[#141722] border-white/[0.06] text-stone-300 hover:border-white/20'
                }`}
              >
                <p className="leading-relaxed">"{preset.text}"</p>
                {isSelected ? (
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={140}
              placeholder="Örn: Arkadaşımın sevgilisine sahte hesaptan mesaj atıp sadakatini denedim..."
              rows={4}
              className="w-full bg-[#141722] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 resize-none font-sans"
            />
            <span className="absolute bottom-2 right-2.5 text-[11px] text-stone-500 font-medium">
              {customText.length}/140
            </span>
          </div>

          {/* Canlı Anti-Doxxing İkazı */}
          <div className="text-[11px] text-stone-400 flex items-start gap-1.5 bg-[#141722] p-2.5 rounded-xl border border-white/10">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>⚠️ Gerçek isim, kurum, telefon veya @kullanıcıadı yazmak sistem tarafından otomatik engellenir ve sansürlenir.</span>
          </div>

          {validation && !validation.isValid && customText.trim().length > 0 && (
            <p className="text-xs text-rose-400 font-medium">
              {validation.violationReason}
            </p>
          )}
        </div>
      )}

      {/* Aksiyon Butonları */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          onClick={onBack}
          className="py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-400 bg-[#141722] hover:bg-[#1E2230] border border-white/10 transition-colors"
        >
          Vazgeç
        </button>

        <button
          onClick={handleStart}
          disabled={!canSubmit}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
            canSubmit
              ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-sm active:scale-[0.98]'
              : 'bg-[#141722] text-stone-600 cursor-not-allowed border border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Şüpheli Koltuğuna Otur (Odaya Gir)</span>
        </button>
      </div>

    </div>
  );
};
