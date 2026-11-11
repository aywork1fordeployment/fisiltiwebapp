/**
 * FISILTI: ASİMETRİK POV MAHKEME SALONU
 * Gerçek Zamanlı In-Memory WebSocket İstemcisi
 * 
 * Sıfır LocalStorage, Sıfır SessionStorage, Sıfır BroadcastChannel!
 * Tüm cihazlar ve sekmeler doğrudan ws://localhost:4000 sunucusuna bağlanır.
 */

import { PlayerRole, ChatMessage } from '../types/game.types';

export interface ServerMessage {
  id: string;
  sender: 'supheli' | 'suspect' | 'sert_hakim' | 'yumusak_hakim' | 'savci' | 'dedektif' | 'system' | 'katip' | string;
  text: string;
  time: string;
}

export interface ServerPenalty {
  type: 'mute' | 'eh' | 'timer5';
  by: 'sert_hakim' | 'yumusak_hakim' | 'savci' | 'dedektif';
  expiresAt: number;
}

export interface ServerVerdict {
  stamp: string;
  reason: string;
  by?: string;
}

export interface ServerRoom {
  roomId: string;
  confession: string;
  category?: string;
  timeLeft: number;
  status: 'active' | 'ended';
  verdict: ServerVerdict | null;
  messages: ServerMessage[];
  whispers: ServerMessage[];
  whisperCount?: number;
  isWhispering: boolean;
  activePenalty: ServerPenalty | null;
}

export interface QueueStatusPayload {
  type: 'QUEUE_STATUS';
  suspects: number;
  judges: number;
  totalSuspects: number;
  totalJudges: number;
}

export function serverRoleToPlayerRole(
  role: 'supheli' | 'sert_hakim' | 'yumusak_hakim' | 'savci' | 'dedektif' | string
): PlayerRole {
  if (role === 'supheli' || role === 'suspect') return 'supheli';
  if (role === 'sert_hakim' || role === 'savci') return 'sert_hakim';
  return 'yumusak_hakim';
}

export function serverMsgToChatMessage(
  msg: ServerMessage,
  channel: 'main' | 'whisper' = 'main'
): ChatMessage {
  const senderRole: PlayerRole | 'system' | 'katip' =
    msg.sender === 'system' || msg.sender === 'katip'
      ? 'katip'
      : msg.sender === 'supheli' || msg.sender === 'suspect'
      ? 'supheli'
      : msg.sender === 'sert_hakim' || msg.sender === 'savci'
      ? 'sert_hakim'
      : 'yumusak_hakim';

  const senderName =
    msg.sender === 'system' || msg.sender === 'katip'
      ? 'KATİP'
      : msg.sender === 'supheli' || msg.sender === 'suspect'
      ? 'ŞÜPHELİ'
      : msg.sender === 'sert_hakim' || msg.sender === 'savci'
      ? '1. HAKİM'
      : '2. HAKİM';

  let systemType: 'slam' | 'clamp' | 'hesitation' | 'spotlight' | 'verdict' | 'info' = 'info';
  if (msg.sender === 'system' || msg.sender === 'katip') {
    if (msg.text.includes('SUSTURULDU') || msg.text.includes('MASAYA VURDU')) systemType = 'slam';
    else if (msg.text.includes('KISKACI') || msg.text.includes('Evet veya Hayır')) systemType = 'clamp';
    else if (msg.text.includes('5 SANİYE') || msg.text.includes('tereddüt')) systemType = 'hesitation';
    else if (msg.text.includes('HÜKÜM') || msg.text.includes('AÇILDI') || msg.text.includes('TAMAMLANDI')) systemType = 'verdict';
  }

  return {
    id: msg.id,
    senderRole,
    senderName,
    content: msg.text,
    timestamp: Date.now(),
    channel,
    systemType,
  };
}

class FsWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pendingJoinPayload: any = null;

  private onQueueStatusCallback: ((data: QueueStatusPayload) => void) | null = null;
  private onMatchFoundCallback: ((data: { role: string; room: ServerRoom }) => void) | null = null;
  private onRoomUpdateCallback: ((room: ServerRoom) => void) | null = null;
  private onUserTypingCallback: ((data: { role: string; isTyping: boolean }) => void) | null = null;

  constructor() {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const envUrl =
      typeof process !== 'undefined' && process.env.REACT_APP_WS_URL
        ? process.env.REACT_APP_WS_URL.trim().replace(/\/+$/, '').replace(/^https:\/\//i, 'wss://').replace(/^http:\/\//i, 'ws://')
        : '';

    this.url =
      envUrl ||
      (isLocal
        ? `ws://${window.location.hostname}:4000`
        : 'wss://fisilticourtwebservice.onrender.com');

    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ Fısıltı Mahkeme Salonu WebSocket Sunucusuna Bağlandı:', this.url);
        if (this.pendingJoinPayload && this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify(this.pendingJoinPayload));
          } catch {
            // ignore
          }
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'QUEUE_STATUS') {
            this.onQueueStatusCallback?.(data as QueueStatusPayload);
          } else if (data.type === 'MATCH_FOUND') {
            this.pendingJoinPayload = null;
            this.onMatchFoundCallback?.(data);
          } else if (data.type === 'ROOM_UPDATE' && data.room) {
            this.onRoomUpdateCallback?.(data.room);
          } else if (data.type === 'USER_TYPING') {
            this.onUserTypingCallback?.(data);
          }
        } catch {
          // ignore
        }
      };

      this.ws.onclose = () => {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          this.connect();
        }, 1500);
      };

      this.ws.onerror = () => {
        // Handled silently
      };
    } catch {
      // Handled silently
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch {
        // ignore
      }
    } else {
      this.connect();
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      }, 500);
    }
  }

  public joinQueue(role: 'supheli' | 'yargic' | 'hakim', confession?: string, category?: string) {
    const payload = {
      type: 'JOIN_QUEUE',
      role,
      confession,
      category,
    };
    this.pendingJoinPayload = payload;
    this.send(payload);
  }

  public leaveQueue() {
    this.pendingJoinPayload = null;
    this.send({ type: 'LEAVE_QUEUE' });
  }

  public sendTypingStatus(isTyping: boolean) {
    this.send({ type: 'TYPING_STATUS', isTyping });
  }

  public sendChatMessage(text: string) {
    this.send({ type: 'CHAT_MESSAGE', text });
  }

  public sendWhisperMessage(text: string) {
    this.send({ type: 'WHISPER_MESSAGE', text });
  }

  public sendWhisperTyping(isTyping: boolean) {
    this.send({ type: 'WHISPER_TYPING', isTyping });
  }

  public applyPenalty(penaltyType: 'mute' | 'eh' | 'timer5', duration: number, systemText: string) {
    this.send({
      type: 'APPLY_PENALTY',
      penaltyType,
      duration,
      systemText,
    });
  }

  public submitVerdict(stamp: string, reason: string) {
    this.send({
      type: 'SUBMIT_VERDICT',
      stamp,
      reason,
    });
  }

  public onQueueStatus(cb: (data: QueueStatusPayload) => void) {
    this.onQueueStatusCallback = cb;
  }

  public onMatchFound(cb: (data: { role: string; room: ServerRoom }) => void) {
    this.onMatchFoundCallback = cb;
  }

  public onRoomUpdate(cb: (room: ServerRoom) => void) {
    this.onRoomUpdateCallback = cb;
  }

  public onUserTyping(cb: (data: { role: string; isTyping: boolean }) => void) {
    this.onUserTypingCallback = cb;
  }
}

export const wsClient = new FsWebSocketClient();
