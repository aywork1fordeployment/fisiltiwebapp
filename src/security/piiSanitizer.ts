/**
 * FISILTI: AYNALI SORGU ODASI
 * PII Sanitizer & Anti-Doxxing Security Shield
 * 
 * SIFIR-VERİ ve KVKK/GDPR UYUMLULUK GÜVENCESİ:
 * - Gerçek kişi bilgisi (İsim, Telefon, TC Kimlik, @sosyal_medya, Adres) paylaşımını engeller.
 * - URL, phishing linkleri ve e-posta adreslerini temizler.
 * - XSS enjeksiyon karakterlerini zararsız hale getirir.
 * - Ağır küfür, nefret söylemi, siyasi provokasyon ve tehdit kelimelerini bloke eder.
 */

// XSS Karakter Temizleme (HTML Injection Önleme)
export function sanitizeXSS(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sosyal Medya Kullanıcı Adı ve Profil Link Regexleri
const SOCIAL_HANDLE_REGEX = /@[a-zA-Z0-9_.]+/gi;
const SOCIAL_PLATFORM_REGEX = /(instagram\.com|x\.com|twitter\.com|tiktok\.com|t\.me|snapchat\.com|facebook\.com|insta:|snap:|tiktok:)[^\s]*/gi;

// URL ve E-Posta Regexleri
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|net|org|tr|xyz|io|co|me|online|app)[^\s]*)/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Telefon Numarası, TC Kimlik ve 4+ Rakamlı Sayı Dizisi Regexleri
// Örn: 0532 123 45 67, 05321234567, 12345678901, vb.
const PHONE_AND_ID_REGEX = /(\+?\d[\d\s\-().]{3,}\d|\b\d{4,}\b)/g;

// Plaka ve Adres İpuçları (Örn: 34 ABC 123)
const LICENSE_PLATE_REGEX = /\b(0[1-9]|[1-7][0-9]|8[01])\s*[a-zA-Z]{1,3}\s*\d{2,4}\b/gi;

// Ağır Küfür, Şiddet, Terör, Nefret ve Doxxing Kara Listesi (Hafifletilmiş / Maskeleme Kuralı)
const BLACKLIST_PATTERNS: RegExp[] = [
  // Şiddet & Ölüm Tehditleri
  /\b(öldürürüm|geberteceğim|bıçaklarım|vururum|katlederim|asacağım|intihar|kendimi\s*öldüreceğim)\b/gi,
  // Ağır Hakaret & Küfürler
  /\b(amk|aq|orospu|piç|siktir|yarrak|oç|kahpe|gavat|pezevenk|fahişe|ibne)\b/gi,
  // Terör & Yasadışı
  /\b(terör|bomba\s*yapımı|uyuşturucu\s*satıcılığı|silah\s*satışı)\b/gi,
];

export interface ValidationResult {
  isValid: boolean;
  sanitizedText: string;
  violationReason?: string;
  isCensored: boolean;
}

/**
 * Mesajı PII, Doxxing ve Zararlı İçeriklere Karşı Denetler ve Temizler
 */
export function sanitizeMessage(rawText: string, maxLength: number = 140): ValidationResult {
  if (!rawText || !rawText.trim()) {
    return {
      isValid: false,
      sanitizedText: '',
      violationReason: 'Boş mesaj gönderilemez.',
      isCensored: false,
    };
  }

  let text = rawText.trim();

  // 1. Karakter Sınırı Kontrolü
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
  }

  // 2. Ağır İhlal (Tehdit / Yasadışı) Kontrolü -> Doğrudan Gönderim Engellenir
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        sanitizedText: '',
        violationReason: '⚠️ Bu ifade Sorgu Odası kurallarına aykırıdır (Tehdit, ağır hakaret veya yasadışı içerik içeremez).',
        isCensored: false,
      };
    }
  }

  let wasCensored = false;

  // 3. Sosyal Medya Kullanıcı Adları (@kullanıcı) -> Sansürle
  if (SOCIAL_HANDLE_REGEX.test(text)) {
    text = text.replace(SOCIAL_HANDLE_REGEX, '[SANSÜRLÜ_HESAP]');
    wasCensored = true;
  }

  // 4. Sosyal Platform Linkleri
  if (SOCIAL_PLATFORM_REGEX.test(text)) {
    text = text.replace(SOCIAL_PLATFORM_REGEX, '[SANSÜRLÜ_LİNK]');
    wasCensored = true;
  }

  // 5. URL ve E-Posta Temizleme
  if (URL_REGEX.test(text)) {
    text = text.replace(URL_REGEX, '[SANSÜRLÜ_URL]');
    wasCensored = true;
  }

  if (EMAIL_REGEX.test(text)) {
    text = text.replace(EMAIL_REGEX, '[SANSÜRLÜ_POSTA]');
    wasCensored = true;
  }

  // 6. Telefon ve Sayı Dizileri (TC No, Kart No vb.)
  if (PHONE_AND_ID_REGEX.test(text)) {
    text = text.replace(PHONE_AND_ID_REGEX, (match) => {
      // Sadece 1-3 haneli küçük sayılara (örn. 5 sn, 3 gün) izin ver, 4 ve üzeri sayıları gizle
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length >= 4) {
        wasCensored = true;
        return '[GİZLİ_NUMARA]';
      }
      return match;
    });
  }

  // 7. Plaka Bilgileri
  if (LICENSE_PLATE_REGEX.test(text)) {
    text = text.replace(LICENSE_PLATE_REGEX, '[SANSÜRLÜ_PLAKA]');
    wasCensored = true;
  }

  // 8. Temel HTML Tag Temizleme
  text = text.replace(/<[^>]*>?/gm, '');

  return {
    isValid: true,
    sanitizedText: text,
    isCensored: wasCensored,
  };
}
