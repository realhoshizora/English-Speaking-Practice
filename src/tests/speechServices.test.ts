import { describe, expect, it, vi } from 'vitest';
import { createLocalAIProvider } from '../services/conversation/LocalAIConversationProvider';
import { getScenario } from '../data/scenarios';
import { SpeechRecognitionService } from '../services/speech/SpeechRecognitionService';
import { FakeRecognition } from './fakes';

const make = () => {
  FakeRecognition.instances = [];
  return new SpeechRecognitionService(() => FakeRecognition);
};

describe('SpeechRecognitionService', () => {
  it('goes requesting → listening → recognized with the final transcript', () => {
    const svc = make();
    const states: string[] = [];
    svc.subscribe(() => states.push(svc.getSnapshot().status));
    expect(svc.start('en-GB')).toBe(true);
    expect(FakeRecognition.last.lang).toBe('en-GB');
    FakeRecognition.last.say('Hello there');
    expect(svc.getSnapshot()).toMatchObject({ status: 'recognized', transcript: 'Hello there' });
    expect(states).toEqual(['requesting', 'listening', 'listening', 'processing', 'recognized']);
    expect(svc.isActive()).toBe(false);
  });

  it('prevents overlapping sessions', () => {
    const svc = make();
    svc.start();
    expect(svc.start()).toBe(false);
    expect(FakeRecognition.instances).toHaveLength(1);
  });

  it('maps errors to clear states', () => {
    const cases: [string, string][] = [
      ['not-allowed', 'denied'],
      ['no-speech', 'no-speech'],
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

  it('reports no-speech when the session ends silently', () => {
    const svc = make();
    svc.start();
    FakeRecognition.last.onstart?.();
    FakeRecognition.last.onend?.();
    expect(svc.getSnapshot().status).toBe('no-speech');
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
