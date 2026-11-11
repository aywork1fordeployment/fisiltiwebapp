# ⚖️ FISILTI: ASİMETRİK POV MAHKEME SALONU (COURTROOM EDITION)
**Tam Kapsamlı Görsel, Mimari ve Çoklu Cihaz (WebSocket) Geliştirme Kılavuzu**

> **🚨 ANTIGRAVITY (AI AGENT) İÇİN BİRİNCİL TALİMAT — ÖNCE BUNU OKU:**
> Proje kök dizininde (`C:\All Projects\fisiltiwebapp\sample.jpg`) bulunan **`sample.jpg`** dosyasını incele. Bu görsel projenin yeni **Asimetrik Mahkeme Salonu (POV)** tasarım referansıdır.
>
> **KRİTİK KURAL 1 (Çalışan WebSocket Sistemini Koru):** Mevcut `server.js` (`ws://localhost:4000`) üzerinde çalışan 3 ayrı pencere/cihaz (`1 Şüpheli + 2 Hakim`) gerçek zamanlı FIFO eşleşme sistemini **KESİNLİKLE BOZMA!** Sadece rol isimlerini (`supheli`, `sert_hakim`, `yumusak_hakim`) ve konuşma/yazma (`TYPING_STATUS`) sinyallerini bu yeni mahkeme sahnesine uyarla.
>
> **KRİTİK KURAL 2 (`sample.jpg` Üzerindeki Düzeltmeler):**
> 1. `sample.jpg` içindeki **Sol Ekran Şüphelinin Gözünden (Şüpheli POV)**, **Sağ Ekran ise Hakimlerin Gözünden (Hakim POV)** görünümüdür.
> 2. `sample.jpg`'nin en altında görünen yeşil/mavi/mor buton renklerini **KULLANMA!** O renkler çok uyumsuz duruyor. Onların yerine Bölüm 5'te tanımlanan **"Koyu Maun, Bronz ve Kehribar (Dark Courtroom Luxury)"** buton paletini uygula.
> 3. Alttaki 4 otorite butonunu (`Sustur`, `Evet/Hayır`, `5 Sn Baskı`, `Hüküm Ver`) **SADECE HAKİMLER (`sert_hakim` ve `yumusak_hakim`)** görebilir. Şüpheli ekranında bu 4 buton gizlenir, sadece savunma yazma kutusu görünür.

---

## 1. ASİMETRİK KAMERA AÇILARI (POV SAHNE MİMARİSİ)

Oyuncu odaya girdiğinde hangi roldeyse, mahkeme salonunu **o koltuğun gerçek kamera açısından (POV)** görür. Sahne ekranın tamamını (`100dvh`) kaplar; üst bar ve alttaki sürüklenebilir sohbet çekmecesi (`Bottom Sheet`) sahnenin üzerinde yüzer (`absolute / fixed`).

### 1.1. ŞÜPHELİ EKRANI (Şüpheli POV — `sample.jpg` Sol Taraf)
Kullanıcı **`supheli`** rolündeyse kamera aşağıdan yukarıya (sanık kürsüsünden hakim kürsüsüne) bakar:
* **Yüksek Maun Hakim Kürsüsü (Üst-Orta):**
  * **Sol Koltuk — `SERT HAKİM`:** Siyah hakim cübbeli, kırmızı kravatlı, çatık kaşlı, gözlüğü kırmızı parlayan otoriter hakim. Yanında `[ SERT HAKİM • ]` HUD etiketi yer alır.
  * **Sağ Koltuk — `YUMUŞAK HAKİM`:** Siyah hakim cübbeli, kır saçlı, sakin ve analitik bakışlı kıdemli hakim. Yanında `[ • YUMUŞAK HAKİM ]` HUD etiketi yer alır.
* **Katip Masası (Kürsünün Hemen Altı / Önü):**
  * Ahşap kürsünün alt kademesinde, kendi küçük masasında oturan **`KATİP`** karakteri ve önünde mekanik bir **daktilo** bulunur. Yanında `[ KATİP ]` etiketi vardır.
* **Fısıltı Animasyonu (Kürsüde Kafa Kafaya Verme):**
  * Hakimler gizli kanalda ("Diğer Hakimle Konuş") birbirine yazarken, Şüpheli ekranındaki `Sert Hakim` ve `Yumuşak Hakim` figürleri birbirine doğru hafifçe eğilir ve üstte *"👁️ Hakimler şu an kürsüde senin hakkında fısıldaşıyor..."* uyarısı parlar.

### 1.2. HAKİM EKRANI (Hakim POV — `sample.jpg` Sağ Taraf)
Kullanıcı **`sert_hakim`** veya **`yumusak_hakim`** rolündeyse kamera yüksek kürsüden aşağıya (mahkeme salonunun ortasına) bakar:
* **Spot Işığı ve Sanık Kürsüsü:**
  * Karanlık ahşap mahkeme salonunun tam ortasına yukarıdan sıcak kehribar rengi konik bir **Spot Işığı (`volumetric spotlight`)** vurur.
  * Spot ışığının altında ahşap bir **Sanık Kürsüsü (Podium)**, kürsünün üzerinde klasik metal bir **Mikrofon** ve kürsünün arkasında **ayakta duran kapüşonlu `ŞÜPHELİ`** yer alır.
  * Şüphelinin başının etrafında ince, fütüristik/taktiksel bir odak çerçevesi (`[ ]`) ve yanında **`• ŞÜPHELİ`** etiketi bulunur.
  * Şüpheli susturulduğunda (`Sustur` cezası aktifken) kürsüdeki mikrofonun üzerinde kırmızı bir kilit/çarpı efekti belirmeli ve spot ışığı kırmızımsı bir tona dönmelidir.

---

## 2. CANLI AĞIZ OYNAMA (LIP-SYNC) VE KATİP DAKTİLO ANİMASYONU

Sahnenin "yaşıyor" hissi vermesi için WebSocket üzerinden gerçek zamanlı animasyon tetikleyicileri çalışacaktır:

1. **Konuşma (Ağız Oynama) Animasyonu (`isTalking`):**
   * Şüpheli mesaj yazdığında veya gönderdiği andan itibaren **3.5 saniye boyunca**, Hakimlerin ekranındaki ayakta duran Şüphelinin ağzı açılıp kapanır (`talking` SVG/Sprite döngüsü) ve kürsüdeki mikrofonun etrafında ses dalgası halkaları çıkar.
   * `Sert Hakim` veya `Yumuşak Hakim` mesaj gönderdiğinde ise Şüphelinin ekranındaki ilgili hakimin ağzı 3.5 saniye boyunca oynar ve elini kürsüye/evraka doğru hareket ettirir.
2. **Katip Daktilo Animasyonu (`isTyping`):**
   * Odadaki 3 kişiden **herhangi biri klavyede yazı yazarken (`TYPING_STATUS`)** veya yeni mesaj gönderdiğinde, kürsünün altındaki **Katip** karakterinin elleri daktilo üzerinde hızla hareket eder, daktilonun kağıt silindiri titrer ve sohbet akışının en altında geçici olarak:
     `KATİP: (Daktilo sesleri)...`
     satırı belirmeye başlar.

---

## 3. SÜRÜKLENEBİLİR / BOYUTLANDIRILABİLİR SOHBET ÇEKMECESİ (COLLAPSIBLE BOTTOM SHEET)

Sohbet alanı artık ekranı kapatan hantal kutulardan oluşmaz. `sample.jpg`'de görüldüğü gibi ekranın alt kısmında yer alan, üst orta kısmında yatay tutamaç çizgisi (`drag handle`) bulunan **yarı saydam füme/kehribar cam bir çekmecedir (`Resizable Bottom Sheet`)**.

### 3.1. 3 Kademeli Boyutlandırma (Uzaltıp Kısaltabilme)
Kullanıcı çekmecenin üstündeki tutamaç çubuğunu (`w-14 h-1.5 bg-amber-100/20 hover:bg-amber-100/40 rounded-full mx-auto my-2 cursor-ns-resize`) yukarı/aşağı sürükleyerek veya üzerine tıklayarak yüksekliği 3 mod arasında değiştirebilir:
1. **Küçültülmüş Sahne Modu (`h-[150px]`):** Mahkeme salonunu ve karakterleri tam görmek isteyenler için. Sadece son yazılan 1-2 satır diyalog ve mesaj yazma kutusu görünür.
2. **Standart Duruşma Modu (`h-[290px]` - Varsayılan):** `sample.jpg`'deki görünüm. Hem mahkeme sahnesi (Hakimler, Katip, Şüpheli) net görünür hem de son 4-5 satır mahkeme tutanağı okunur.
3. **Tam Tutanak Modu (`h-[70dvh]`):** Yukarı çekildiğinde tüm geçmiş konuşmalar ve en üstte sabitlenmiş olan **"📌 İTİRAF & SAVUNMA DOSYASI"** kartı rahatça okunur.

### 3.2. Modern "Mahkeme Tutanağı" Sohbet Tasarımı (Mavi Baloncuklar Yasak!)
* Eski tasarımdaki mavi çerçeveli sıradan sohbet balonları **TAMAMEN KALDIRILMIŞTIR!**
* Mesajlar `sample.jpg`'deki gibi **temiz, soluklaşarak yukarı akan sinematik diyalog satırları** şeklinde listelenir:
  * Üst kısımda yumuşak bir kararma gradyanı (`mask-image: linear-gradient(to bottom, transparent, black 25%)`) bulunur.
  * **Şüpheli Satırı:** `ŞÜPHELİ:` (`text-amber-400 font-bold tracking-wide`) + yanında temiz kırık beyaz metin (`text-[#F3EFEA] font-medium text-[15px]`).
  * **Sert Hakim Satırı:** `SERT HAKİM:` (`text-rose-400 font-bold tracking-wide`) + yanında metin.
  * **Yumuşak Hakim Satırı:** `YUMUŞAK HAKİM:` (`text-orange-300 font-bold tracking-wide`) + yanında metin.
  * **Katip / Sistem Satırı:** `KATİP:` (`text-amber-200/70 italic text-sm`) — Örn: `KATİP: (Sert Hakim masaya vurdu, şüpheli 10 saniye susturuldu...)`

---

## 4. RENK PALETİ VE BUTON REVİZYONU (DARK COURTROOM LUXURY)

`sample.jpg`'nin altındaki yeşil ve mavi buton renkleri mahkeme ciddiyetini bozduğu için **KULLANILMAYACAKTIR**. Tüm arayüz sıcak maun, koyu obsidyen, eskitme bronz ve kehribar ışığı üzerine kurulacaktır.

### 4.1. Genel Renk Paleti
* **Sahne Karanlığı & Gölgeler:** `#0B0908` (Derin Maun Siyahı)
* **Ahşap & Kürsü Tonları:** `#3E2415`, `#5C3620`, `#27160C`
* **Çekmece (Bottom Sheet) Cam Yüzeyi:** `bg-[#14110F]/88 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-20px_50px_rgba(0,0,0,0.85)]`
* **Input Kutusu:** `bg-[#0D0B0A]/90 border border-amber-200/15 focus:border-amber-400/50 text-[#F5F2EB] placeholder-amber-100/30 rounded-xl`

### 4.2. Yenilenmiş Hakim Otorite Butonları (Sadece Hakimlerde Görünür!)
Alttaki 4 buton çiğ yeşil/mavi renkler yerine **Koyu Obsidyen zemin üzerinde zarif metalik/kehribar/bordo çerçeveli** lüks ve ağırbaşlı mahkeme butonları olacaktır (`grid grid-cols-4 gap-2.5 px-4 py-2`):

1. **`🔨 [10s] SUSTUR` (Alt yazı: `Klavye Kilidi`)**
   * **Stil:** Koyu Bordo-Obsidyen (`bg-gradient-to-b from-[#2A1215] to-[#1A0B0D] hover:from-[#3D181C] border border-rose-500/35 text-rose-100 shadow-inner`)
   * **Vurgu:** `[10s]` kısmı `text-rose-400/80`, `SUSTUR` kısmı `text-rose-200 font-bold`.
2. **`⚖️ [15s] EVET / HAYIR` (Alt yazı: `Tek Kelime Kıskacı`)**
   * **Stil:** Koyu Bronz-Kehribar (`bg-gradient-to-b from-[#261E14] to-[#17120C] hover:from-[#362A1B] border border-amber-500/35 text-amber-100`)
   * **Vurgu:** Çiğ yeşil KESİNLİKLE YOK! Sıcak altın/bronz (`text-amber-300 font-bold`).
3. **`⏱️ 5 SN BASKI` (Alt yazı: `Tereddüt Sayacı`)**
   * **Stil:** Koyu Bakır-Arduvaz (`bg-gradient-to-b from-[#241A16] to-[#140E0C] hover:from-[#33241E] border border-orange-400/30 text-orange-100`)
   * **Vurgu:** Çiğ mavi/mor KESİNLİKLE YOK! Sıcak bakır/turuncu (`text-orange-300 font-bold`).
4. **`🚨 HÜKÜM VER` (Alt yazı: `Sorguyu Bitir & Damgala`)**
   * **Stil:** Parlak Altın/Maun Vurgu Butonu (`bg-gradient-to-b from-amber-500/25 via-amber-700/20 to-[#1F160E] hover:from-amber-500/40 border border-amber-400/60 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]`)

---

## 5. ÜST BAR (HUD) VE HAKİMLER ARASI GİZLİ FISILTI ÇEKMECESİ

Üst bar (`h-12 px-4`) sahnenin üst kısmında şeffaf/füme olarak yer alır:
* **Sol Kısım:**
  * Oda Kodu rozeti: `#463` (`bg-black/60 border border-amber-200/15 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-100/80`)
  * Kamera/POV Rozeti: Şüpheli ise `[ 🎥 SANIK KÜRSÜSÜ (POV) ]`, Hakim ise `[ 🎥 HAKİM KÜRSÜSÜ (POV) ]`
  * İtiraf Dosyası Butonu: `[ 📁 İtiraf Dosyası ]` (Tıklandığında Şüphelinin itiraf metnini sahnenin üstünde şık bir dosya kartı olarak açar/kapatır).
* **Orta Kısım:**
  * Dijital Geri Sayım Sayacı: `🕒 02:32` (`bg-black/70 border border-amber-500/25 px-4 py-1 rounded-xl font-extrabold text-lg tracking-wider text-amber-50`)
* **Sağ Kısım:**
  * **Hakimler İçin:** **`[ 🕵️‍♂️ Diğer Hakimle Fısıldaş ]`** butonu (`bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2`). Okunmamış fısıltı varsa üzerinde kırmızı bildirim sayacı parlar. Tıklandığında sağdan gizli fısıltı çekmecesi (`WhisperDrawer`) açılır.
  * **Şüpheli İçin:** Sağ üstte `🚨 T.C. ANONİM SORGU ODASI #463` ibaresi ve ses açma/kapama (`🔊`) ikonu yer alır.

---

## 6. TİPOGRAFİ (`Outfit` Yerel Font) VE SİBER GÜVENLİK / KVKK ZIRHI

1. **Ticari Ücretsiz Yerel `Outfit` Fontu:**
   * `@fontsource/outfit` (`400`, `500`, `600`, `700`, `800`) yerel olarak import edilmeye devam edecektir. Tüm metinler, butonlar ve mahkeme tutanakları `'Outfit', sans-serif` kullanır.
2. **Çalışan WebSocket Sunucusu (`server.js` - Port 4000):**
   * `server.js` içindeki `savci` ve `dedektif` rollerini `sert_hakim` ve `yumusak_hakim` olarak güncelle (veya geriye dönük uyumlu tut).
   * İstemciden `TYPING_START` / `TYPING_STOP` mesajları geldiğinde odadaki diğer istemcilere ilet ki **Katip daktilo animasyonu** ve **Ağız oynama (`isTalking`)** 3 ekranda aynı anda çalışsın.
3. **Sıfır Veri & Hafif Anti-Doxxing Koruması:**
   * Veritabanı ve IP kaydı yoktur; her şey `server.js` RAM'inde uçucu olarak tutulur.
   * Sohbet kutusunda sadece telefon numaraları (7+ ardışık rakam), `@kullanıcıadı` hesapları ve web linkleri (`http`, `.com`) otomatik olarak `***` ile maskelenir.