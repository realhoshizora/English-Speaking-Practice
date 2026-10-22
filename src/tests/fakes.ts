// Test doubles for browser speech APIs. No real microphone, network or AI is used in tests.
import type { RecognitionLike, RecognitionResultEvent } from '../services/speech/SpeechCapabilityDetector';

export class FakeRecognition implements RecognitionLike {
  static instances: FakeRecognition[] = [];
  lang = '';
  interimResults = false;
  continuous = false;
  maxAlternatives = 1;
  onstart: (() => void) | null = null;
  onresult: ((e: RecognitionResultEvent) => void) | null = null;
  onspeechend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  started = false;
  aborted = false;

  constructor() {
    FakeRecognition.instances.push(this);
  }
  start() {
    this.started = true;
  }
  stop() {
    this.onend?.();
  }
  abort() {
    this.aborted = true;
  }

  // --- helpers to drive the fake from tests ---
  say(text: string, isFinal = true) {
    this.onstart?.();
    this.onresult?.({ resultIndex: 0, results: [{ isFinal, 0: { transcript: text } }] });
    this.onspeechend?.();
    this.onend?.();
  }
  fail(error: string) {
    this.onerror?.({ error });
    this.onend?.();
  }

  static install() {
    FakeRecognition.instances = [];
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = FakeRecognition;
  }
  static get last() {
    return FakeRecognition.instances[FakeRecognition.instances.length - 1];
  }
}
