// Optional: role-play with a language model running on the user's own computer through Ollama
// (https://ollama.com). Nothing is downloaded automatically; the user installs and starts it.
import type { Scenario } from '../../types';
import type {
  Availability,
  ConversationProvider,
  ConversationSession,
  PartnerMessage,
  SessionSummary,
  TurnFeedback,
} from './ConversationProvider';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MAX_HISTORY = 12; // only the latest messages are sent, to keep memory use low
const TIMEOUT_MS = 60_000;

type FetchFn = typeof fetch;

async function postJson(fetchFn: FetchFn, url: string, body: unknown, timeout = TIMEOUT_MS): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Ollama trả về lỗi ${res.status}.`);
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw new Error('Mô hình AI phản hồi quá lâu (timeout).');
    throw err instanceof Error ? err : new Error(String(err));
  } finally {
    clearTimeout(timer);
  }
}

export function systemPrompt(s: Scenario): string {
  return [
    `You are role-playing as "${s.partnerRole}" in the situation "${s.title}". The learner is "${s.learnerRole}".`,
    `The learner is an English student at CEFR level ${s.level}. Use short, simple sentences suitable for that level.`,
    'Stay in role and in this situation. Ask one short question at a time and let the learner speak more than you.',
    'Accept any reasonable answer. Never discuss unsafe or adult topics.',
    'Reply ONLY with JSON: {"reply": "<your next line in English, max 2 sentences>", "feedback": "<one short tip in Vietnamese about the learner\'s last answer>", "better": "<a more natural English version of the learner\'s answer, or empty>"}',
  ].join('\n');
}

class LocalAISession implements ConversationSession {
  private history: ChatMessage[] = [];
  private pending: string | null = null;
  private finished = false;
  private turns = 0;
  private current_: PartnerMessage;

  constructor(
    private scenario: Scenario,
    private url: string,
    private model: string,
    private fetchFn: FetchFn,
  ) {
    const opener = scenario.roleplay.nodes.find((n) => n.id === scenario.roleplay.start)?.partner ?? 'Hello!';
    this.history.push({ role: 'assistant', content: JSON.stringify({ reply: opener }) });
    this.current_ = { text: opener, final: false };
  }

  private async chat(extra: ChatMessage[]): Promise<string> {
    const messages = [{ role: 'system', content: systemPrompt(this.scenario) }, ...this.history.slice(-MAX_HISTORY), ...extra];
    const data = (await postJson(this.fetchFn, `${this.url}/api/chat`, {
      model: this.model,
      messages,
      stream: false,
      format: 'json',
    })) as { message?: { content?: string } };
    return data.message?.content ?? '';
  }

  current() {
    return this.current_;
  }

  async respond(text: string): Promise<TurnFeedback> {
    this.history.push({ role: 'user', content: text });
    this.turns++;
    const raw = await this.chat([]);
    let parsed: { reply?: string; feedback?: string; better?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw };
    }
    const reply = (parsed.reply ?? '').trim() || 'Sorry, could you say that again?';
    this.history.push({ role: 'assistant', content: JSON.stringify({ reply }) });
    this.pending = reply;
    return {
      accepted: true,
      message: parsed.feedback?.trim() || 'AI đã nhận câu trả lời của bạn.',
      better: parsed.better?.trim() || undefined,
      tips: [],
      source: 'ai',
    };
  }

  async advance() {
    if (this.pending) {
      this.current_ = { text: this.pending, final: false };
      this.pending = null;
    }
    return this.current_;
  }

  async skip() {
    return this.current_;
  }

  useHint() {}

  isFinished() {
    return this.finished;
  }

  async summary(): Promise<SessionSummary> {
    this.finished = true;
    let aiSummary: string | undefined;
    try {
      const raw = await this.chat([
        {
          role: 'user',
          content:
            'The role-play is over. Reply ONLY with JSON: {"reply": "<2-3 sentence summary in Vietnamese of what the learner did well and one thing to improve>"}',
        },
      ]);
      aiSummary = (JSON.parse(raw) as { reply?: string }).reply;
    } catch {
      aiSummary = undefined; // summary is optional; the session result is still saved
    }
    return { turns: this.turns, accepted: this.turns, skipped: 0, hintsUsed: 0, score: this.turns ? 1 : 0, review: [], aiSummary };
  }
}

export function createLocalAIProvider(url: string, model: string, fetchFn: FetchFn = fetch.bind(globalThis)): ConversationProvider {
  const base = url.replace(/\/+$/, '');
  return {
    kind: 'local-ai',
    label: `AI cục bộ (Ollama: ${model})`,
    generative: true,
    async checkAvailability(): Promise<Availability> {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
      try {
        const res = await fetchFn(`${base}/api/tags`, { signal: ctrl.signal });
        if (!res.ok) return { ok: false, message: `Ollama trả về lỗi ${res.status}.` };
        const data = (await res.json()) as { models?: { name: string }[] };
        const names = (data.models ?? []).map((m) => m.name);
        if (!names.some((n) => n === model || n.startsWith(`${model}:`))) {
          return {
            ok: false,
            message: `Ollama đang chạy nhưng chưa có mô hình "${model}". Có sẵn: ${names.join(', ') || 'không có'}.`,
          };
        }
        return { ok: true, message: `Đã kết nối Ollama, mô hình "${model}".` };
      } catch {
        return { ok: false, message: `Không kết nối được Ollama tại ${base}. Hãy kiểm tra Ollama đã chạy chưa.` };
      } finally {
        clearTimeout(timer);
      }
    },
    createSession: (scenario) => new LocalAISession(scenario, base, model, fetchFn),
  };
}
