// Wraps one browser speech-recognition session at a time. UI subscribes to snapshots.
// Listening only ends when the learner presses "Nói xong". Browsers end sessions on their own
// (after silence or their own time limit); we start listening again and keep the words.
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

/** Safety cap so a forgotten microphone does not stay open forever. */
export const MAX_LISTEN_MS = 3 * 60 * 1000;
// A browser session that ends this fast with nothing heard is a failure, not a pause: give up after a few.
const QUICK_END_MS = 1000;
const MAX_QUICK_ENDS = 3;

const IDLE: RecognitionSnapshot = { status: 'idle', interim: '', transcript: '' };

// Sessions currently holding the microphone, app-wide (sound effects stay silent while any is open).
const active = new Set<SpeechRecognitionService>();
export const isRecognitionActive = () => active.size > 0;

const ERROR_STATUS: Record<string, RecognitionStatus> = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
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
  private capTimer: ReturnType<typeof setTimeout> | undefined;
  private stopping = false;

  constructor(
    private getCtor: () => RecognitionCtor | null = getRecognitionCtor,
    private maxMs = MAX_LISTEN_MS,
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

  private release() {
    clearTimeout(this.capTimer);
    this.rec = null;
    active.delete(this);
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
    let committed = ''; // words from earlier browser sessions of this same answer
    let final = '';
    let interim = '';
    let failed = false;
    let heard = false;
    let startedAt = 0;
    let quickEnds = 0;
    this.stopping = false;

    const begin = () => {
      startedAt = Date.now();
      heard = false;
      rec.start();
    };

    rec.onstart = () => {
      if (this.snapshot.status !== 'requesting') return; // a silent restart: nothing changes for the learner
      this.set({ status: 'listening' });
      this.capTimer = setTimeout(() => this.stop(), this.maxMs);
    };
    rec.onresult = (e) => {
      heard = true;
      ({ final, interim } = collect(e));
      this.set({ status: this.stopping ? 'processing' : 'listening', interim, transcript: appendSegment(committed, final) });
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech') return; // silence is fine: keep listening until "Nói xong"
      failed = true;
      this.release();
      this.set({ status: ERROR_STATUS[e.error] ?? 'error', error: e.error, interim: '' });
    };
    rec.onend = () => {
      if (failed) return;
      // Some browsers end without marking the last piece final; keep what was heard.
      committed = appendSegment(committed, appendSegment(final, interim));
      final = interim = '';
      quickEnds = !heard && Date.now() - startedAt < QUICK_END_MS ? quickEnds + 1 : 0;
      if (!this.stopping && quickEnds < MAX_QUICK_ENDS) {
        try {
          begin(); // the browser stopped on its own: listen again
          return;
        } catch {
          /* cannot restart: finish with what we have */
        }
      }
      this.release();
      this.set(committed ? { status: 'recognized', transcript: committed, interim: '' } : { status: 'no-speech', interim: '' });
    };

    this.rec = rec;
    active.add(this);
    this.set({ status: 'requesting', interim: '', transcript: '', error: undefined });
    try {
      begin();
    } catch (err) {
      this.release();
      this.set({ status: 'error', error: String(err) });
      return false;
    }
    return true;
  }

  /** "Nói xong": stops listening and keeps whatever was recognised. */
  stop() {
    const rec = this.rec;
    if (!rec) return;
    this.stopping = true;
    clearTimeout(this.capTimer);
    if (this.snapshot.status === 'listening') this.set({ status: 'processing' });
    rec.stop();
  }

  /** Cancels the session without a result and detaches handlers (used on unmount or reset). */
  abort() {
    const rec = this.rec;
    if (rec) {
      rec.onstart = rec.onresult = rec.onspeechend = rec.onerror = rec.onend = null;
      this.stopping = true;
      this.release();
      try {
        rec.abort();
      } catch {
        /* already stopped */
      }
    }
    this.set(IDLE);
  }
}
