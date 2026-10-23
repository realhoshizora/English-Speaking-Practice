// Wraps one browser speech-recognition session at a time. UI subscribes to snapshots.
import { getRecognitionCtor, type RecognitionCtor, type RecognitionLike } from './SpeechCapabilityDetector';

export type RecognitionStatus =
  | 'idle'
  | 'requesting' // waiting for the browser to start (may show the mic permission prompt)
  | 'listening'
  | 'processing'
  | 'recognized'
  | 'no-speech'
  | 'denied'
  | 'unsupported'
  | 'network'
  | 'error';

export interface RecognitionSnapshot {
  status: RecognitionStatus;
  interim: string;
  transcript: string;
  error?: string;
}

const IDLE: RecognitionSnapshot = { status: 'idle', interim: '', transcript: '' };

// Sessions currently holding the microphone, app-wide (sound effects stay silent while any is open).
const active = new Set<SpeechRecognitionService>();
export const isRecognitionActive = () => active.size > 0;

const ERROR_STATUS: Record<string, RecognitionStatus> = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
  'no-speech': 'no-speech',
  network: 'network',
  aborted: 'idle',
};

export class SpeechRecognitionService {
  private rec: RecognitionLike | null = null;
  private snapshot: RecognitionSnapshot = IDLE;
  private listeners = new Set<() => void>();

  constructor(private getCtor: () => RecognitionCtor | null = getRecognitionCtor) {}

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.snapshot;

  isActive() {
    return this.rec !== null;
  }

  private set(next: Partial<RecognitionSnapshot>) {
    this.snapshot = { ...this.snapshot, ...next };
    this.listeners.forEach((fn) => fn());
  }

  /** Starts listening. Returns false if a session is already running or the API is missing. */
  start(lang = 'en-US'): boolean {
    if (this.rec) return false; // prevents overlapping sessions from double clicks
    const Ctor = this.getCtor();
    if (!Ctor) {
      this.set({ status: 'unsupported', interim: '', transcript: '', error: undefined });
      return false;
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = '';
    let interim = '';
    let failed = false;

    rec.onstart = () => this.set({ status: 'listening' });
    rec.onresult = (e) => {
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      this.set({ status: 'listening', interim, transcript: finalText.trim() });
    };
    rec.onspeechend = () => {
      if (this.snapshot.status === 'listening') this.set({ status: 'processing' });
    };
    rec.onerror = (e) => {
      failed = true;
      active.delete(this);
      this.set({ status: ERROR_STATUS[e.error] ?? 'error', error: e.error, interim: '' });
    };
    rec.onend = () => {
      this.rec = null;
      active.delete(this);
      if (failed) return;
      // Some browsers end without marking the last chunk final; keep what was heard.
      const text = (finalText || interim).trim();
      this.set(text ? { status: 'recognized', transcript: text, interim: '' } : { status: 'no-speech', interim: '' });
    };

    this.rec = rec;
    active.add(this);
    this.set({ status: 'requesting', interim: '', transcript: '', error: undefined });
    try {
      rec.start();
    } catch (err) {
      this.rec = null;
      active.delete(this);
      this.set({ status: 'error', error: String(err) });
      return false;
    }
    return true;
  }

  /** Stops listening and keeps whatever was recognised. */
  stop() {
    this.rec?.stop();
  }

  /** Cancels the session without a result and detaches handlers (used on unmount or reset). */
  abort() {
    const rec = this.rec;
    if (rec) {
      rec.onstart = rec.onresult = rec.onspeechend = rec.onerror = rec.onend = null;
      this.rec = null;
      active.delete(this);
      try {
        rec.abort();
      } catch {
        /* already stopped */
      }
    }
    this.set(IDLE);
  }
}
