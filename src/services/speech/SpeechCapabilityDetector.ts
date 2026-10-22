// Feature detection for browser speech APIs. Never assume support: check every time.

// Minimal typing for the Web Speech recognition API (not in TypeScript's DOM lib everywhere).
export interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onspeechend: (() => void) | null;
  onerror: ((e: { error: string; message?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface RecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

export type RecognitionCtor = new () => RecognitionLike;

export function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface SpeechCapabilities {
  recognition: boolean;
  synthesis: boolean;
  secureContext: boolean; // microphone needs https or localhost
  mediaDevices: boolean;
}

export function detectSpeechCapabilities(): SpeechCapabilities {
  return {
    recognition: getRecognitionCtor() !== null,
    synthesis: typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    secureContext: typeof window !== 'undefined' && window.isSecureContext === true,
    mediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
  };
}
