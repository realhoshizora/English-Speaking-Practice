// Wraps one browser speech-recognition session at a time. UI subscribes to snapshots.
// The session listens continuously: it ends when the learner presses "Nói xong", stays silent for a
// while, or hits the time cap. Browsers' own one-sentence mode cut off learners who pause to think.
import { getRecognitionCtor, type RecognitionCtor, type RecognitionLike, type RecognitionResultEvent } from './SpeechCapabilityDetector';

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

export interface ListenTiming {
  /** Stop after this long without new words, once the learner has started speaking. */
  silenceMs: number;
  /** Give up if nothing at all is heard for this long (thinking time before the first word). */
  startMs: number;
  /** Hard cap for one answer. */
  maxMs: number;
}

export const DEFAULT_TIMING: ListenTiming = { silenceMs: 5000, startMs: 10000, maxMs: 45000 };

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

/** Joins recognised pieces. Chrome on Android repeats the whole sentence so far in each new piece; keep it once. */
export function appendSegment(acc: string, seg: string): string {
  const a = acc.trim();
  const s = seg.trim();
  if (!s) return a;
  if (!a) return s;
  if (s.toLowerCase().startsWith(a.toLowerCase())) return s;
  if (a.toLowerCase().endsWith(s.toLowerCase())) return a;
  return `${a} ${s}`;
}

function collect(e: RecognitionResultEvent) {
  let final = '';
  let interim = '';
  for (let i = 0; i < e.results.length; i++) {
    const r = e.results[i];
    if (r.isFinal) final = appendSegment(final, r[0].transcript);
    else interim = `${interim} ${r[0].transcript}`.trim();
  }
  return { final, interim };
}

export class SpeechRecognitionService {
  private rec: RecognitionLike | null = null;
  private snapshot: RecognitionSnapshot = IDLE;
  private listeners = new Set<() => void>();
  private quietTimer: ReturnType<typeof setTimeout> | undefined;
  private capTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private getCtor: () => RecognitionCtor | null = getRecognitionCtor,
    private timing: ListenTiming = DEFAULT_TIMING,
  ) {}

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

  private clearTimers() {
    clearTimeout(this.quietTimer);
    clearTimeout(this.capTimer);
  }

  /** (Re)starts the "no new words" countdown. */
  private waitQuiet(ms: number) {
    clearTimeout(this.quietTimer);
    this.quietTimer = setTimeout(() => this.stop(), ms);
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
    rec.continuous = true;
    rec.maxAlternatives = 1;
    let final = '';
    let interim = '';
    let failed = false;

    rec.onstart = () => {
      this.set({ status: 'listening' });
      this.waitQuiet(this.timing.startMs);
      this.capTimer = setTimeout(() => this.stop(), this.timing.maxMs);
    };
    rec.onresult = (e) => {
      ({ final, interim } = collect(e));
      const stopping = this.snapshot.status === 'processing';
      this.set({ status: stopping ? 'processing' : 'listening', interim, transcript: final });
      if (!stopping) this.waitQuiet(this.timing.silenceMs);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' && (final || interim)) return; // went quiet after speaking: onend keeps the words
      failed = true;
      this.clearTimers();
      active.delete(this);
      this.set({ status: ERROR_STATUS[e.error] ?? 'error', error: e.error, interim: '' });
    };
    rec.onend = () => {
      this.clearTimers();
      this.rec = null;
      active.delete(this);
      if (failed) return;
      // Some browsers end without marking the last piece final; keep what was heard.
      const text = appendSegment(final, interim);
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

  /** Stops listening and keeps whatever was recognised ("Nói xong", silence or time cap). */
  stop() {
    const rec = this.rec;
    if (!rec) return;
    this.clearTimers();
    if (this.snapshot.status === 'listening') this.set({ status: 'processing' });
    rec.stop();
  }

  /** Cancels the session without a result and detaches handlers (used on unmount or reset). */
  abort() {
    this.clearTimers();
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
