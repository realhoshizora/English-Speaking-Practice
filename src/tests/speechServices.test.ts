import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLocalAIProvider } from '../services/conversation/LocalAIConversationProvider';
import { getScenario } from '../data/scenarios';
import { SpeechRecognitionService, appendSegment, isRecognitionActive } from '../services/speech/SpeechRecognitionService';
import { FakeRecognition } from './fakes';

const make = () => {
  FakeRecognition.instances = [];
  return new SpeechRecognitionService(() => FakeRecognition);
};

describe('SpeechRecognitionService', () => {
  it('goes requesting → listening → recognized when the learner presses "Nói xong"', () => {
    const svc = make();
    const states: string[] = [];
    svc.subscribe(() => states.push(svc.getSnapshot().status));
    expect(svc.start('en-GB')).toBe(true);
    expect(FakeRecognition.last.lang).toBe('en-GB');
    expect(FakeRecognition.last.continuous).toBe(true);
    FakeRecognition.last.say('Hello there');
    svc.stop();
    expect(svc.getSnapshot()).toMatchObject({ status: 'recognized', transcript: 'Hello there' });
    expect(states).toEqual(['requesting', 'listening', 'listening', 'processing', 'recognized']);
    expect(svc.isActive()).toBe(false);
  });

  it('prevents overlapping sessions', () => {
    const svc = make();
    svc.start();
    expect(svc.start()).toBe(false);
    expect(FakeRecognition.instances).toHaveLength(1);
    svc.abort();
  });

  it('knows app-wide when a microphone session is open (sound effects stay silent then)', () => {
    const svc = make();
    expect(isRecognitionActive()).toBe(false);
    svc.start();
    expect(isRecognitionActive()).toBe(true);
    FakeRecognition.last.say('hello');
    expect(isRecognitionActive()).toBe(true); // still listening
    svc.stop();
    expect(isRecognitionActive()).toBe(false);
    svc.start();
    FakeRecognition.last.fail('not-allowed');
    expect(isRecognitionActive()).toBe(false);
    svc.start();
    svc.abort();
    expect(isRecognitionActive()).toBe(false);
  });

  it('maps errors to clear states', () => {
    const cases: [string, string][] = [
      ['not-allowed', 'denied'],
      ['network', 'network'],
      ['audio-capture', 'error'],
    ];
    for (const [err, status] of cases) {
      const svc = make();
      svc.start();
      FakeRecognition.last.fail(err);
      expect(svc.getSnapshot().status).toBe(status);
      expect(svc.isActive()).toBe(false);
    }
  });

  it('reports no-speech when the learner presses "Nói xong" without saying anything', () => {
    const svc = make();
    svc.start();
    FakeRecognition.last.onstart?.();
    svc.stop();
    expect(svc.getSnapshot().status).toBe('no-speech');
  });

  describe('only "Nói xong" ends listening', () => {
    // Results accumulate in one browser session, like Chrome's continuous mode.
    const heard = (rec: FakeRecognition, pieces: [string, boolean][]) =>
      rec.onresult?.({ resultIndex: 0, results: pieces.map(([t, isFinal]) => ({ isFinal, 0: { transcript: t } })) });
    const start = (maxMs?: number) => {
      FakeRecognition.instances = [];
      const svc = new SpeechRecognitionService(() => FakeRecognition, maxMs);
      svc.start();
      const rec = FakeRecognition.last;
      rec.onstart?.();
      return { svc, rec };
    };
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('never stops on silence, however long the learner thinks', () => {
      const { svc, rec } = start();
      vi.advanceTimersByTime(30000); // thinking before the first word
      heard(rec, [['I would like', true]]);
      vi.advanceTimersByTime(60000); // long pause mid-sentence
      expect(svc.getSnapshot()).toMatchObject({ status: 'listening', transcript: 'I would like' });
      heard(rec, [['I would like', true], [' a latte', false]]);
      expect(svc.getSnapshot().interim).toBe('a latte');
      svc.stop();
      expect(svc.getSnapshot()).toMatchObject({ status: 'recognized', transcript: 'I would like a latte' });
    });

    it('listens again when the browser ends on its own, keeping the words', () => {
      const { svc, rec } = start();
      heard(rec, [['I would like', true]]);
      vi.advanceTimersByTime(5000);
      rec.onerror?.({ error: 'no-speech' }); // the browser's own silence timeout is not an error for us
      rec.onend?.();
      expect(rec.starts).toBe(2);
      expect(svc.getSnapshot()).toMatchObject({ status: 'listening', transcript: 'I would like' });
      heard(rec, [[' a latte please', true]]); // the new browser session starts its own result list
      svc.stop();
      expect(svc.getSnapshot()).toMatchObject({ status: 'recognized', transcript: 'I would like a latte please' });
    });

    it('gives up if the browser keeps ending instantly without hearing anything', () => {
      const { svc, rec } = start();
      for (let i = 0; i < 3; i++) rec.onend?.();
      expect(rec.starts).toBe(3);
      expect(svc.getSnapshot().status).toBe('no-speech');
      expect(svc.isActive()).toBe(false);
    });

    it('closes a forgotten microphone after the safety cap', () => {
      const { svc, rec } = start(180000);
      heard(rec, [['hello', true]]);
      vi.advanceTimersByTime(179999);
      expect(svc.getSnapshot().status).toBe('listening');
      vi.advanceTimersByTime(1);
      expect(svc.getSnapshot()).toMatchObject({ status: 'recognized', transcript: 'hello' });
    });
  });

  it('joins recognised pieces and drops the repeats some Android phones send', () => {
    expect(appendSegment('I would like', ' a latte')).toBe('I would like a latte');
    expect(appendSegment('hello', 'hello how are you')).toBe('hello how are you');
    expect(appendSegment('a medium please', 'please')).toBe('a medium please');
    expect(appendSegment('', '  yes ')).toBe('yes');
  });

  it('reports unsupported without the API', () => {
    const svc = new SpeechRecognitionService(() => null);
    expect(svc.start()).toBe(false);
    expect(svc.getSnapshot().status).toBe('unsupported');
  });

  it('abort detaches handlers and resets', () => {
    const svc = make();
    svc.start();
    const rec = FakeRecognition.last;
    svc.abort();
    expect(rec.aborted).toBe(true);
    expect(rec.onresult).toBeNull();
    expect(svc.getSnapshot().status).toBe('idle');
  });
});

describe('LocalAIConversationProvider (Ollama, mocked fetch)', () => {
  const scenario = getScenario('ordering-coffee')!;
  const json = (body: unknown, ok = true) => Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) } as Response);

  it('is unavailable when the server is not running', async () => {
    const p = createLocalAIProvider('http://localhost:11434', 'llama3.2', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));
    const a = await p.checkAvailability();
    expect(a.ok).toBe(false);
    expect(a.message).toContain('Không kết nối được');
  });

  it('is unavailable when the model is not installed', async () => {
    const p = createLocalAIProvider('http://localhost:11434', 'llama3.2', vi.fn(() => json({ models: [{ name: 'mistral:latest' }] })));
    expect((await p.checkAvailability()).message).toContain('chưa có mô hình');
  });

  it('is available with the model and sends limited history', async () => {
    const fetchFn = vi.fn((url: string) =>
      url.endsWith('/api/tags')
        ? json({ models: [{ name: 'llama3.2:latest' }] })
        : json({ message: { content: JSON.stringify({ reply: 'Sure! What size?', feedback: 'Tốt!', better: '' }) } }),
    );
    const p = createLocalAIProvider('http://localhost:11434/', 'llama3.2', fetchFn as unknown as typeof fetch);
    expect((await p.checkAvailability()).ok).toBe(true);
    const s = p.createSession(scenario);
    for (let i = 0; i < 10; i++) {
      const fb = await s.respond('A latte, please');
      expect(fb.source).toBe('ai');
    }
    expect((await s.advance())?.text).toBe('Sure! What size?');
    const lastBody = JSON.parse((fetchFn.mock.calls.at(-1) as unknown as [string, RequestInit])[1].body as string);
    expect(lastBody.messages.length).toBeLessThanOrEqual(13); // system + 12 history
    expect(lastBody.messages[0].role).toBe('system');
  });

  it('surfaces server errors so the page can fall back', async () => {
    const p = createLocalAIProvider('http://localhost:11434', 'm', vi.fn(() => json({}, false)));
    await expect(p.createSession(scenario).respond('hi')).rejects.toThrow('500');
  });
});
