export type PlayerRole = 'supheli' | 'sert_hakim' | 'yumusak_hakim' | 'suspect' | 'prosecutor' | 'detective';

export type JudgeState = 'idle' | 'slam' | 'point' | 'whisper';
export type SuspectState = 'idle' | 'sweat' | 'silenced' | 'shocked';

export type ChannelType = 'main' | 'whisper';

export type VerdictType = 
  | 'KATIKSIZ TOKSİK'
  | 'USTA MANİPÜLATÖR'
  | 'MASUM / HAKLI'
  | 'KAOS ELÇİSİ'
  | 'KENDİ KUYUSUNA DÜŞEN';

export interface VerdictOption {
  type: VerdictType;
  emoji: string;
  subtitle: string;
  badgeColor: string;
}

export interface ChatMessage {
  id: string;
  senderRole: PlayerRole | 'system' | 'katip';
  senderName: string;
  content: string;
  timestamp: number;
  channel: ChannelType;
  isSpotlight?: boolean;
  systemType?: 'slam' | 'clamp' | 'hesitation' | 'spotlight' | 'verdict' | 'info';
}

export type GamePhase = 'lobby' | 'waiting' | 'interrogation' | 'verdict' | 'receipt';

export interface RoomState {
  roomCode: string;
  phase: GamePhase;
  userRole: PlayerRole;
  confession: string;
  confessionCategory: string;
  timeLeft: number; // 180 seconds countdown
  isSilenced: boolean;
  silencedSecondsLeft: number;
  isYesNoClamp: boolean;
  yesNoSecondsLeft: number;
  isTimerClamp: boolean;
  timerSecondsLeft: number;
  spotlightMessageId: string | null;
  lampWild: boolean;
  screenShake: boolean;
  finalVerdict: VerdictType | null;
  verdictReason: string;
  prosecutorState: JudgeState;
  detectiveState: JudgeState;
  suspectState: SuspectState;
  prosecutorActive: boolean;
  detectiveActive: boolean;
  suspectActive: boolean;
}

export interface ConfessionPreset {
  id: string;
  category: 'İlişkiler' | 'Arkadaşlık' | 'İş & Para' | 'Radikal Fikir' | 'Sosyal Medya';
  text: string;
}

export interface AuthorityActionCooldowns {
  slam: number;
  yesNo: number;
  timer: number;
  spotlight: number;
}
