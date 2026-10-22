// Provider-independent conversation contract. The speaking page only talks to this interface,
// so scripted rules, a local model or a remote backend can be swapped by configuration.
import type { Scenario } from '../../types';

export type ProviderKind = 'scripted' | 'local-ai' | 'remote-ai';

export interface PartnerMessage {
  text: string;
  task?: string; // Vietnamese: what the learner should do now
  hint?: string;
  example?: string;
  final: boolean; // true = conversation has ended, no answer expected
}

export interface TurnFeedback {
  accepted: boolean;
  message: string; // Vietnamese, short and friendly
  intentLabel?: string;
  better?: string; // a more natural way to say it
  tips: string[]; // grammar / wording tips
  example?: string;
  source: 'rules' | 'ai';
}

export interface SessionSummary {
  turns: number;
  accepted: number;
  skipped: number;
  hintsUsed: number;
  /** Task completion: share of turns answered appropriately (not a pronunciation score). */
  score: number;
  review: string[]; // model sentences worth practising again
  aiSummary?: string;
}

export interface ConversationSession {
  current(): PartnerMessage | null;
  respond(text: string): Promise<TurnFeedback>;
  /** Moves on after an accepted answer. Returns the next partner message. */
  advance(): Promise<PartnerMessage | null>;
  skip(): Promise<PartnerMessage | null>;
  useHint(): void;
  isFinished(): boolean;
  summary(): Promise<SessionSummary>;
}

export interface Availability {
  ok: boolean;
  message: string; // Vietnamese
}

export interface ConversationProvider {
  kind: ProviderKind;
  label: string;
  /** True only for providers that really generate new replies with a language model. */
  generative: boolean;
  checkAvailability(): Promise<Availability>;
  createSession(scenario: Scenario): ConversationSession;
}
