/**
 * KARAR! | ANONİM SORGU SALONU
 * Hafif Anti-Doxxing Güvenlik Filtresi (src/utils/securityFilter.ts)
 * 
 * Normal isimleri ve sohbet akışını kısıtlamaz.
 * Sadece kişisel verilerin ifşa edilmesini (doxxing) önlemek için:
 * 1. 7 veya daha fazla ardışık rakam (Telefon / TC No, boşluklu/noktalı/tireli) -> ***
 * 2. @kullanıcı_adı -> ***
 * 3. Web linkleri ve URL'ler -> ***
 * 4. HTML etiketleri ve tekil <, > karakterleri temizlenir.
 */

// 1. Telefon ve 7+ Basamaklı Rakam Dizileri (Boşluklu, noktalı, tireli örn: 0532 123 45 67, 0532-123-45-67)
const PHONE_AND_LONG_NUMBERS_REGEX = /(?:\+?\d[\s.-]*){7,}/g;

// 2. Sosyal Medya Kullanıcı Adları (@ahmet, @kullanici123)
const SOCIAL_HANDLE_REGEX = /@[a-zA-Z0-9_.]+/g;

// 3. Web Linkleri (http, https, www, .com, .net vb.)
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|net|org|tr|xyz|io|co|me|online|app)[^\s]*)/gi;

/**
 * Mesajı hafifçe maskeler (Telefon, @hesap ve Linkleri '***' yapar, HTML taglerini temizler)
 */
export function filterMessage(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // 1. HTML etiketlerini ve tekil <, > karakterlerini temizle (Entity karmaşası yok, React JSX uyumlu)
  sanitized = sanitized.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');

  // 2. Web linklerini maskele
  sanitized = sanitized.replace(URL_REGEX, '***');

  // 3. Sosyal medya kullanıcı adlarını maskele
  sanitized = sanitized.replace(SOCIAL_HANDLE_REGEX, '***');

  // 4. Telefon ve uzun sayıları maskele (boşluklu veya bitişik 7+ rakam)
  sanitized = sanitized.replace(PHONE_AND_LONG_NUMBERS_REGEX, '***');

  return sanitized.trim();
}
