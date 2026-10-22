// Browser text-to-speech (speechSynthesis). One shared queue for the whole app.

export type TtsStatus = 'idle' | 'speaking' | 'paused';

export interface TtsSnapshot {
  status: TtsStatus;
  key: string | null; // who started the current playback
  index: number; // which text in the queue is being read
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string | null;
}

const IDLE: TtsSnapshot = { status: 'idle', key: null, index: -1 };

export class SpeechSynthesisService {
  private snapshot: TtsSnapshot = IDLE;
  private listeners = new Set<() => void>();
  private token = 0;

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.snapshot;

  private set(next: TtsSnapshot) {
    this.snapshot = next;
    this.listeners.forEach((fn) => fn());
  }

  /** English voices on this device. May be empty until 'voiceschanged' fires. */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
  }

  onVoicesChanged(fn: () => void): () => void {
    if (!this.isSupported()) return () => {};
    window.speechSynthesis.addEventListener('voiceschanged', fn);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', fn);
  }

  /** Reads one or more texts in order. Cancels anything already playing. Returns false if unsupported. */
  speak(texts: string | string[], key: string, opts: SpeakOptions = {}): boolean {
    if (!this.isSupported()) return false;
    const list = (Array.isArray(texts) ? texts : [texts]).filter((t) => t.trim());
    if (!list.length) return false;
    const synth = window.speechSynthesis;
    const token = ++this.token;
    this.cancelAll();
    const voices = this.getEnglishVoices();
    const voice =
      voices.find((v) => v.voiceURI === opts.voiceURI) ?? voices.find((v) => v.lang === 'en-US') ?? voices[0];

    list.forEach((text, index) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice?.lang ?? 'en-US';
      if (voice) u.voice = voice;
      u.rate = opts.rate ?? 0.9;
      u.onstart = () => {
        if (token === this.token) this.set({ status: 'speaking', key, index });
      };
      u.onend = () => {
        if (token === this.token && index === list.length - 1) this.set(IDLE);
      };
      u.onerror = () => {
        if (token === this.token) this.set(IDLE);
      };
      synth.speak(u);
    });
    this.set({ status: 'speaking', key, index: 0 });
    return true;
  }

  pause() {
    if (!this.isSupported() || this.snapshot.status !== 'speaking') return;
    window.speechSynthesis.pause();
    this.set({ ...this.snapshot, status: 'paused' });
  }

  resume() {
    if (!this.isSupported() || this.snapshot.status !== 'paused') return;
    window.speechSynthesis.resume();
    this.set({ ...this.snapshot, status: 'speaking' });
  }

  stop() {
    if (!this.isSupported()) return;
    this.token++;
    this.cancelAll();
    this.set(IDLE);
  }

  // Chrome keeps the engine paused after cancel(), which silences every later utterance.
  private cancelAll() {
    const synth = window.speechSynthesis;
    if (synth.paused) synth.resume();
    synth.cancel();
  }
}

export const tts = new SpeechSynthesisService();
