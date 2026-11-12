/**
 * KARAR! | ANONİM SORGU SALONU
 * In-Memory Rate Limiter & Flood Shield
 * 
 * Veritabanı ve kalıcı depolama olmadan tamamen RAM içi (ephemeral)
 * spam ve flood koruması sağlar.
 */

class RateLimiter {
  private lastMessageTimestamp: number = 0;
  private readonly minMessageIntervalMs: number = 1000; // 1 saniyede en fazla 1 mesaj
  private messageHistory: number[] = [];
  private readonly maxMessagesPerWindow: number = 6;
  private readonly windowMs: number = 10000; // 10 saniyede en fazla 6 mesaj

  /**
   * Mesaj gönderiminin spam kurallarına uyup uymadığını kontrol eder
   */
  public canSendMessage(): { allowed: boolean; waitMs?: number; reason?: string } {
    const now = Date.now();

    // 1. Çok hızlı art arda basma kontrolü (minimum 1 sn)
    const timeSinceLast = now - this.lastMessageTimestamp;
    if (timeSinceLast < this.minMessageIntervalMs) {
      return {
        allowed: false,
        waitMs: this.minMessageIntervalMs - timeSinceLast,
        reason: 'Sorgu tutanağına bu kadar hızlı ifade veremezsin! Bir nefes al.',
      };
    }

    // 2. Kayan pencere (Sliding Window) flood kontrolü
    this.messageHistory = this.messageHistory.filter(ts => now - ts < this.windowMs);
    if (this.messageHistory.length >= this.maxMessagesPerWindow) {
      return {
        allowed: false,
        waitMs: this.windowMs - (now - this.messageHistory[0]),
        reason: 'Çok fazla mesaj gönderdin! Yargıçlar not alıyor, lütfen bekle.',
      };
    }

    // İzin verildi, kaydı güncelle
    this.lastMessageTimestamp = now;
    this.messageHistory.push(now);

    return { allowed: true };
  }

  /**
   * Reset / Temizle (Oda sıfırlandığında)
   */
  public reset(): void {
    this.lastMessageTimestamp = 0;
    this.messageHistory = [];
  }
}

export const rateLimiter = new RateLimiter();
