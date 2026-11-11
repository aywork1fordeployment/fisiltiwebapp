# 🕵️‍♂️ FISILTI: AYNALI SORGU ODASI — UI/UX REVİZYON VE MASTER MİMARİ KILAVUZU

> **🚨 ANTIGRAVITY (AI AGENT) İÇİN BİRİNCİL REVİZYON TALİMATI (ÖNCE BUNU OKU VE UYGULA):**
> Mevcut arayüzde ciddi görsel karmaşa, renk uyumsuzluğu, okunaksız daktilo fontu ve masaüstünde `100vw` tam ekran yayılma (sağ-sol kopukluğu) problemi vardır. Projeyi aşağıdaki **7 Katı Tasarım ve Mimari Kurala** göre baştan sona yeniden düzenle (Refactor et):
>
> 1. **FONT DEĞİŞİKLİĞİ (`Outfit` — %100 Yerel / Self-Hosted & Commercial Free):**
>    * Daktilo/Monospace fontları **TAMAMEN KALDIR!**
>    * Ticari kullanımı tamamen ücretsiz (SIL Open Font License) olan **Outfit** fontunu dış sunucuya (Google Fonts CDN'e) bağlanmadan, doğrudan kendi sunucumuzdan (`self-hosted`) sunmak için terminale `npm install @fontsource/outfit` komutunu çalıştır (veya `.woff2` dosyalarını `public/fonts/outfit/` içine indir).
>    * `src/index.tsx` içine `@fontsource/outfit/400.css`, `500.css`, `600.css`, `700.css`, `800.css` dosyalarını import et ve `body` ile Tailwind `font-sans` ailesini `'Outfit', sans-serif` olarak ayarla.
> 2. **MERKEZİ UYGULAMA KABUĞU (`Max-Width App Shell` — Dağınıklığı Bitir):**
>    * Ekranı `100vw` boyunca sağa sola yapıştırma! Karakterlerin biri ekranın en solunda, diğeri 1500px uzakta en sağda duruyor; ortası bomboş kalıyor.
>    * Tüm sorgu odasını masaüstünde ve mobilde odaklanmış, modern bir **"Merkezi Sorgu Kabini"** (`max-w-3xl mx-auto w-full h-[100dvh] flex flex-col bg-[#11131A] border-x border-white/[0.06] shadow-2xl relative overflow-hidden`) içine al.
> 3. **YARGIÇ GİZLİ EKRANI ("AYNANIN ARKASI") İKONA TIKLANINCA AÇILSIN (`Slide-Over Drawer`):**
>    * Ekranı ikiye bölüp sağ tarafa kalıcı "Aynanın Arkası" paneli koymayı **İPTAL ET!** Ana ekranda sadece **Ana Sorgu Sohbeti** tam genişlikte, ferah ve okunaklı akacak.
>    * Sağ üst bara (veya sağ alt yüzen aksiyon butonuna) belirgin bir **`[ 🕵️‍♂️ Aynanın Arkası ]`** ikonu/butonu koy. Üzerinde okunmamış gizli mesaj sayısı (`🔴 2`) rozeti (badge) bulunsun ve yeni mesaj geldiğinde hafifçe parlasın (`animate-pulse`).
>    * Yargıç bu ikona tıkladığında, sağdan sola doğru kayarak açılan (`backdrop-blur-xl bg-[#161923]/95 border-l border-white/10`) şık bir **Çekmece (Drawer / Popover Panel)** açılsın. İşi bitince `[ ✕ ]` veya dışarı tıklayarak kapatsın.
>    * Şüpheli bu ikona tıklarsa: *"🔒 Aynanın arkasındaki gizli yargıç konuşmalarını sadece 180 saniyelik sorgu bittiğinde görebilirsin!"* yazan kilitli bir önizleme görsün.
> 4. **RENK UYUMU VE MODERN KARANLIK TEMA (`No More Rainbow Borders`):**
>    * Mevcut tasarımdaki her mesajın etrafında bulunan sarı, mor, kırmızı, mavi ince neon çerçeveleri (`border-yellow-500`, `border-purple-500` vb.) ve zifiri `#000000` siyah arka planı **KALDIR!**
>    * **Yeni Renk Sistemi (3 Renk Kuralı):**
>      * **Zeminler:** Dış arka plan `#090A0F`, Ana Kabin `#11131A`, Kart/Mesaj Yüzeyleri `#181B26`, Hover/Input Yüzeyi `#1E2230`.
>      * **Vurgu 1 (Kehribar / Spotlight - `#F59E0B`):** Sadece İtiraf Dosyası kartı, Şüpheli rozeti ve Tepe Lambası ışığı için.
>      * **Vurgu 2 (K구-Kırmızı / Otorite - `#E11D48`):** Sadece Yargıç rozeti, Susturma/Kıskaç aksiyonu ve Nihai Damga için.
>      * **Nötr Metinler & Çerçeveler:** Ana metinler `#F3F4F6` (Kırık Beyaz), ikincil metinler `#9CA3AF` (Gri), tüm çerçeveler ise sadece `border-white/[0.07]` (çok zarif yarı saydam beyaz).
> 5. **MODERN MESAJ BALONCUKLARI (Chat UI Düzeni):**
>    * Mesajları ekran boyunca uzanan içi boş çerçeveli kutular yapma!
>    * WhatsApp / Discord / Linear tarzı modern sohbet baloncukları kullan:
>      * **Yargıç Mesajları:** Sola hizalı (`self-start max-w-[82%]`), `#1A1E2C` dolgulu, sol kenarında `3px` kırmızı/kehribar dikey çizgi (`border-l-2 border-rose-500`), üstünde küçük ve şık karakter avatarı + ismi (`font-semibold text-xs text-rose-400`).
>      * **Şüpheli Mesajları:** Sağa hizalı (`self-end max-w-[82%]`), `#232738` dolgulu, yuvarlatılmış köşeli (`rounded-2xl rounded-tr-sm`), temiz ve okunaklı.
>      * **Sistem Bildirimleri (Masaya Vurma / Susturma):** Ortalanmış, tam genişlikte olmayan kompakt hap (`pill`) rozetler (`mx-auto px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium`).
> 6. **KOMPAKT KARAKTER SAHNESİ (`Interrogation Stage`):**
>    * Üstteki devasa boşluğu kaldır. `h-[110px]` yüksekliğinde kompakt bir sahne yap.
>    * Ortada sorgu masası hissi veren yatay bir ışık huzmesi, sol tarafta omuz omuza duran **Sert Savcı & Baş Dedektif**, hemen karşısında (sağda) **Şüpheli** yer alsın. Aralarındaki mesafe uzak olmasın, birbirlerine bakıyor (karşı karşıya) hissi versin.
> 7. **OTORİTE BUTONLARI (Alt Kompakt Araç Çubuğu):**
>    * Ekranın altındaki devasa, yayvan 4 kutuyu kaldır. Input kutusunun hemen üstünde tek satırlık, şık ikonlu hap butonlar (`rounded-xl bg-[#181B26] hover:bg-[#222636] border border-white/10 px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all`) olarak diz.

---

## 1. TİPOGRAFİ VE YEREL FONT KURULUMU (`Outfit` - Self-Hosted)

Kullanıcıların IP adreslerinin Google sunucularına sızmaması (KVKK tam uyumu) ve ticari kullanımının %100 ücretsiz olması için **Outfit** fontu (`SIL Open Font License 1.1`) proje içinden sunulacaktır.

### 1.1. Kurulum Adımları
1. Paket kurulumu:
   ```bash
   npm install @fontsource/outfit
   ```
2. `src/index.tsx` (veya `src/index.css`) en üstüne eklenecek importlar:
   ```tsx
   import '@fontsource/outfit/400.css';
   import '@fontsource/outfit/500.css';
   import '@fontsource/outfit/600.css';
   import '@fontsource/outfit/700.css';
   import '@fontsource/outfit/800.css';
   ```
3. `src/index.css` içinde global font tanımı:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     body {
       font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
       background-color: #090A0F;
       color: #F3F4F6;
       -webkit-font-smoothing: antialiased;
       -moz-osx-font-smoothing: grayscale;
       overflow: hidden;
       user-select: none;
     }
   }
   ```
4. **Font Ağırlık Hiyerarşisi:**
   * **Oda Başlığı, Süre Sayacı ve Damgalar:** `font-extrabold` (`800`) — `tracking-tight`
   * **Karakter İsimleri, Butonlar ve Rozetler:** `font-semibold` (`600`)
   * **Sohbet Mesajları ve İtiraf Metni:** `font-normal` (`400`) veya `font-medium` (`500`) — `text-[15px] leading-relaxed` (Okunabilirlik en üst düzeyde olmalı).

---

## 2. RENK PALETİ VE GÖRSEL HİYERARŞİ (DESIGN TOKENS)

Karmaşayı önlemek için **Renk Bütçesi** uygulanacaktır. Gökkuşağı gibi her kutuya farklı renk vermek **YASAKTIR**.

| Kullanım Alanı | Hex Kodu | Tailwind Karşılığı | Açıklama |
| :--- | :--- | :--- | :--- |
| **Dış Arka Plan (Masaüstü)** | `#090A0F` | `bg-[#090A0F]` | Merkezdeki sorgu kabinini öne çıkaran derin karanlık |
| **Ana Sorgu Kabini** | `#11131A` | `bg-[#11131A]` | `max-w-3xl mx-auto` ana uygulama yüzeyi |
| **Üst Sahne & Alt Bar** | `#151822` | `bg-[#151822]` | Header, Karakter Sahnesi ve Input alanı |
| **Yargıç Mesaj Balonu** | `#1A1E2B` | `bg-[#1A1E2B]` | Sol hizalı, temiz koyu arduvaz yüzey |
| **Şüpheli Mesaj Balonu** | `#242938` | `bg-[#242938]` | Sağ hizalı, bir ton açık kontrast yüzey |
| **İtiraf Dosyası Kartı** | `#F59E0B` (%10) | `bg-amber-500/10 border-amber-500/30` | Sohbetin en üstünde sabitlenen sarı dosya kartı |
| **Otorite / Ceza Vurgusu** | `#E11D48` | `text-rose-500` / `bg-rose-500/15` | Masaya vurma, Susturma ve Yargıç rozet rengi |
| **Aynanın Arkası (Drawer)** | `#131520` | `bg-[#131520]/95 backdrop-blur-xl` | İkona tıklanınca sağdan açılan gizli panel |
| **İnce Çizgiler (Borders)** | `Beyaz %7` | `border-white/[0.07]` | Tüm ayırıcı çizgiler (Renkli çerçeve kullanılmaz!) |

---

## 3. EKRAN YERLEŞİMİ VE "AYNANIN ARKASI" ÇEKMECE (DRAWER) MİMARİSİ

Ekran artık ikiye bölünmez! Hem masaüstünde hem mobilde **Tek Odaklı Merkez Kabin (`max-w-3xl`)** kullanılır.

```
+-----------------------------------------------------------------------+
| [#463]           ⏱️ 02:32 (Süre)          [🕵️‍♂️ Aynanın Arkası 🔴2] [🔊] | <-- Header (56px)
+-----------------------------------------------------------------------+
|   (👨‍⚖️ Sert Savcı)  (🕵️‍♂️ Baş Dedektif)    💡     (🥷 Şüpheli)          | <-- Kompakt Sahne (100px)
+-----------------------------------------------------------------------+
| 📌 İTİRAF DOSYASI (Sabitlenmiş Şık Amber Kart):                       |
| "İş yerinde terfi almak için arkadaşımın projesini kendim yaptım..."  |
+-----------------------------------------------------------------------+
|                                                                       |
|  👨‍⚖️ Sert Savcı                                                      |
|  +---------------------------------------------------+                |
|  | Peki arkadaşın bunu öğrendiğinde yüzüne nasıl     |                |
|  | baktın? Hiç mi vicdanın sızlamadı?                |                |
|  +---------------------------------------------------+                |
|                                                                       |
|                         🔥 Şüpheli                                    |
|                +---------------------------------------------------+  |
|                | Ben olmasam başkası yapacaktı, sistemin açığını   |  |
|                | ben yaratmadım!                                   |  |
|                +---------------------------------------------------+  |
|                                                                       |
|          ( 🔨 Sert Savcı masaya vurdu! Şüpheli 10sn susturuldu )       |
|                                                                       |
+-----------------------------------------------------------------------+
| [🔨 Sustur]   [⛓️ Evet/Hayır]   [⏱️ 5 Sn Kıskaç]   [🔦 Çelişki Yak]  | <-- Kompakt Bar (44px)
+-----------------------------------------------------------------------+
| [ Çapraz sorgu sorusu yaz...                                  ] [Gönder]| <-- Input Bar (60px)
+-----------------------------------------------------------------------+
```

### 3.1. "Aynanın Arkası" İkonu ve Açılır Çekmece (`WhisperDrawer.tsx`)
1. **Tetikleyici Buton (Header Sağ Üst):**
   * Üst barda her zaman görünür bir buton yer alır:
     * İkon: `Eye` veya ` VenetianMask` / `MessageSquareLock` (`lucide-react`).
     * Metin: `Aynanın Arkası`
     * Bildirim Rozeti: Yargıçlardan biri gizli mesaj yazdığında butonun üzerinde kırmızı `2` rozeti (`bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full animate-bounce`) belirir.
2. **Tıklanınca Açılan Panel (`Slide-Over Drawer`):**
   * Butona tıklandığında ekranın sağ kenarından (`w-full sm:w-[380px] h-full z-50`) yumuşak bir geçişle (`transition-transform duration-300 ease-out`) gizli panel açılır.
   * Panel açıkken arka plandaki ana sohbet hafifçe kararır (`bg-black/40 backdrop-blur-[2px]`), dışarıya veya sağ üstteki `[ ✕ Kapat ]` butonuna tıklandığında anında kapanır.
   * **Panel İçi Özellikler (Yargıçlar İçin):**
     * Başlık: `🕵️‍♂️ Aynanın Arkası (Gizli Yargıç Kanalı)` + Alt açıklama: *"Burada yazılanları Şüpheli şu an göremez. 180. saniyede ifşa olur!"*
     * Gizli mesaj akışı.
     * Hızlı Taktik Çipleri (2x2 kompakt grid veya yatay kaydırma):
       * `+ Yalan söylüyor, sıkıştır!`
       * `+ Şimdi susturuyorum!`
       * `+ İyi polis oyna`
       * `+ Evet/Hayır kıskacına al`
     * Gizli mesaj yazma inputu.
   * **Şüpheli Tıkladığında Ne Olur?**
     * Şüpheli de bu ikona tıklayabilir! Tıkladığında açılan çekmecede mesajlar **bulanık (`blur-md select-none`)** görünür ve ortasında kilit ikonuyla şu yazar:
       * *"🔒 Yargıçlar şu an arkanda toplam **X gizli mesaj** konuştu. Aynanın arkası sorgu bittiğinde açılacak!"* (Bu mekanik şüphelinin merakını ve gerilimini 10 kat artırır).

---

## 4. HUKUKİ ZIRH, KVKK MUAFİYETİ VE SİBER GÜVENLİK

Projede **Sıfır Veri & Sıfır IP Tutma (Zero-Storage & Zero-PII)** mimarisi aynen korunmaktadır:

1. **Veritabanı ve Log Yoktur:** Hiçbir mesaj, IP adresi veya çerez kaydedilmez.
2. **Google Fonts IP Sızıntısı Kapatıldı:** `Outfit` fontu yerel olarak (`@fontsource/outfit`) paketlendiği için kullanıcının tarayıcısı Google sunucularına dahi istek atmaz.
3. **Anti-Doxxing & PII Sanitizer (`src/security/piiSanitizer.ts`):**
   * `@kullanıcıadı`, telefon numaraları (4+ ardışık rakam), TC kimlik, plaka, e-posta, URL/linkler ve ağır küfür/tehdit ifadeleri Regex ile anında engellenir.
   * `dangerouslySetInnerHTML` kullanımı kesinlikle yasaktır.
4. **Güvenli `vercel.json` (Tamamen Yerel Kaynaklı CSP):**
   Fontlar da artık yerel olduğu için `vercel.json` içindeki `Content-Security-Policy` dış bağlantılara tamamen kapatılarak maksimum siber güvenlik sağlanır:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self' wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}
```

---

## 5. VİRAL "DAVA DOSYASI" GÖRSEL ÇIKTISI (`CaseFileReceipt.tsx`)

Sorgu sonunda üretilen paylaşılabilir PNG görseli de **Outfit** fontuyla, çok temiz ve yüksek kontrastlı bir "Modern Dosya Özeti" kartı olarak tasarlanacaktır:

* **Boyut:** `480px` genişliğinde, mobil ekranlarda ve X (Twitter) akışında kesilmeden tam görünen dikey kart.
* **Üst Kısım:** Koyu Lacivert/Arduvaz (`#11131A`) zemin üzerinde altın sarısı **"İTİRAF DOSYASI #463"** kutusu.
* **Orta Kısım (Yan Yana İfşa Tablosu):**
  * **Sol Sütun (`🎙️ SORGUDA SÖYLENEN`):** Sorgudaki en kritik 4 diyalog.
  * **Sağ Sütun (`🕵️‍♂️ AYNANIN ARKASI İFŞASI`):** Yargıçların o sırada içeride birbirine yazdığı gizli fısıltılar.
* **Alt Kısım:** Eğik açıyla basılmış parlak kırmızı **`[ HÜKÜM: KATIKSIZ TOKSİK ]`** damgası ve tek cümlelik gerekçeli karar.