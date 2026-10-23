// Scripted role-play: a small state machine over the scenario's roleplay nodes.
// Works offline, needs no API key. Feedback comes from declared intents and rules only.
import type { ResponseOption, RoleplayNode, Scenario } from '../../types';
import { wordCount } from '../../utils/text';
import type {
  ConversationProvider,
  ConversationSession,
  PartnerMessage,
  SessionSummary,
  TurnFeedback,
} from './ConversationProvider';
import { languageTips, matchResponse } from './intentMatcher';

interface TurnStat {
  attempts: number;
  accepted: boolean;
  skipped: boolean;
  hint: boolean;
  example: string;
}

export class ScriptedConversationSession implements ConversationSession {
  private nodes: Map<string, RoleplayNode>;
  private node: RoleplayNode | null;
  private ack: string | undefined;
  private pending: ResponseOption | null = null;
  private finished = false;
  private closing: string | null = null;
  private stats: TurnStat[] = [];

  constructor(scenario: Scenario) {
    this.nodes = new Map(scenario.roleplay.nodes.map((n) => [n.id, n]));
    this.node = this.nodes.get(scenario.roleplay.start) ?? null;
    if (this.node) this.newTurn(this.node);
  }

  private newTurn(node: RoleplayNode) {
    this.stats.push({ attempts: 0, accepted: false, skipped: false, hint: false, example: node.example });
  }

  private get turn() {
    return this.stats[this.stats.length - 1];
  }

  current(): PartnerMessage | null {
    if (this.finished) return { text: this.closing ?? '', final: true };
    if (!this.node) return null;
    const n = this.node;
    return {
      text: this.ack ? `${this.ack} ${n.partner}` : n.partner,
      task: n.task,
      hint: n.hint,
      example: n.example,
      final: false,
    };
  }

  async respond(text: string): Promise<TurnFeedback> {
    const node = this.node;
    if (!node || this.finished) {
      return { accepted: false, message: 'Cuộc hội thoại đã kết thúc.', tips: [], source: 'rules' };
    }
    this.turn.attempts++;
    const option = matchResponse(node.responses, text);
    const tips = languageTips(text);
    if (!option) {
      const first = this.turn.attempts === 1;
      return {
        accepted: false,
        message: first
          ? `Mình chưa nhận ra ý trả lời. Thử lại nhé! Nhiệm vụ: ${node.task}`
          : `Gợi ý: ${node.hint} Bạn có thể nghe câu ví dụ, thử lại hoặc bỏ qua.`,
        tips,
        example: first ? undefined : node.example,
        source: 'rules',
      };
    }
    this.pending = option;
    this.turn.accepted = true;
    // Compare with the model answer's own length, so a short model answer ("Here you are") never triggers it.
    if (wordCount(text) < Math.min(3, wordCount(node.example)) && option.anyOf[0] !== '*') {
      tips.push(`Câu ngắn vẫn hiểu được, nhưng hãy thử nói câu đầy đủ: “${node.example}”`);
    }
    return {
      accepted: true,
      message: `Tốt lắm! Câu trả lời phù hợp: ${option.label}.`,
      intentLabel: option.label,
      better: option.better,
      tips,
      example: node.example,
      source: 'rules',
    };
  }

  private moveTo(option: ResponseOption): PartnerMessage | null {
    this.pending = null;
    this.ack = option.ack;
    const next = option.next ? this.nodes.get(option.next) : undefined;
    if (!next) {
      this.finished = true;
      this.node = null;
      this.closing = option.ack ?? 'Great job! That is the end of our conversation.';
      return this.current();
    }
    this.node = next;
    this.newTurn(next);
    return this.current();
  }

  async advance(): Promise<PartnerMessage | null> {
    return this.pending ? this.moveTo(this.pending) : this.current();
  }

  async skip(): Promise<PartnerMessage | null> {
    if (!this.node || this.finished) return this.current();
    this.turn.skipped = true;
    this.turn.accepted = false;
    return this.moveTo(this.node.responses[0]); // main path
  }

  /** Done = answered turns; total adds the main path still ahead (branches can make it longer). */
  progress() {
    const done = this.finished ? this.stats.length : this.stats.length - 1 + (this.pending ? 1 : 0);
    let node = this.finished ? undefined : this.pending ? (this.pending.next ? this.nodes.get(this.pending.next) : undefined) : (this.node ?? undefined);
    const seen = new Set<string>();
    while (node && !seen.has(node.id)) {
      seen.add(node.id);
      const next = node.responses[0]?.next;
      node = next ? this.nodes.get(next) : undefined;
    }
    return { done, total: done + seen.size };
  }

  useHint() {
    if (this.turn) this.turn.hint = true;
  }

  isFinished() {
    return this.finished;
  }

  async summary(): Promise<SessionSummary> {
    const turns = this.stats.length;
    const accepted = this.stats.filter((t) => t.accepted).length;
    return {
      turns,
      accepted,
      skipped: this.stats.filter((t) => t.skipped).length,
      hintsUsed: this.stats.filter((t) => t.hint).length,
      score: turns ? accepted / turns : 0,
      review: this.stats.filter((t) => t.skipped || t.attempts > 1).map((t) => t.example),
    };
  }
}

export const scriptedProvider: ConversationProvider = {
  kind: 'scripted',
  label: 'Hội thoại theo kịch bản (scripted)',
  generative: false,
  checkAvailability: async () => ({ ok: true, message: 'Luôn sẵn sàng, không cần Internet hay API key.' }),
  createSession: (scenario) => new ScriptedConversationSession(scenario),
};
