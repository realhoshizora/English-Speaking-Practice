// Core content and progress types. Scenarios are plain data so new ones can be added without code changes.

export type Level = 'A1' | 'A2' | 'B1';

export interface VocabItem {
  word: string;
  meaning: string; // Vietnamese meaning
  example: string;
}

export interface DialogueLine {
  speaker: 'partner' | 'learner';
  text: string;
  vi: string; // Vietnamese translation
}

/** One accepted way of answering a role-play turn. */
export interface ResponseOption {
  intent: string;
  label: string; // Vietnamese description of the intent, shown in feedback
  /** Key phrases (any one is enough). '*' accepts any non-empty answer. */
  anyOf: string[];
  next: string | null; // next node id; null ends the conversation
  ack?: string; // short partner reaction before the next line
  better?: string; // a more natural way to say it
}

export interface RoleplayNode {
  id: string;
  partner: string; // what the partner character says
  task: string; // Vietnamese: what the learner should do
  hint: string; // Vietnamese hint
  example: string; // a model answer
  responses: ResponseOption[];
}

export interface McqQuestion {
  type: 'mcq';
  question: string;
  options: string[];
  answer: number;
  explanation: string; // Vietnamese
}

export interface FillQuestion {
  type: 'fill';
  sentence: string; // contains "___"
  answer: string;
  accept?: string[];
  explanation: string; // Vietnamese
}

export type ListeningQuestion = McqQuestion | FillQuestion;

export interface Scenario {
  id: string;
  title: string;
  titleVi: string;
  description: string; // Vietnamese
  level: Level;
  goals: string[]; // Vietnamese
  learnerRole: string;
  partnerRole: string;
  vocabulary: VocabItem[];
  phrases: { en: string; vi: string }[];
  dialogue: DialogueLine[];
  tasks: string[]; // communication tasks (English, short)
  listening: { intro: string; questions: ListeningQuestion[] };
  roleplay: { start: string; nodes: RoleplayNode[] };
}

// ---------- Progress ----------

export type ActivityType = 'repeat' | 'guided' | 'roleplay' | 'listening' | 'vocab';

export interface PracticeRecord {
  id: string;
  type: ActivityType;
  scenarioId: string | null;
  date: string; // ISO
  /** 0..1. Meaning depends on type: transcript match, task completion, or quiz score. null = self-practice, not measured. */
  score: number | null;
  detail?: string;
}

export interface VocabProgress {
  correct: number;
  wrong: number;
  lastReviewed: string; // ISO
  nextReview: string; // ISO
}

export interface Settings {
  rate: number;
  voiceURI: string | null;
  recognitionLang: string;
  dailyGoal: number;
  showTranslation: boolean;
  provider: 'scripted' | 'local-ai';
  ollamaUrl: string;
  ollamaModel: string;
}

export interface ProgressState {
  version: 1;
  records: PracticeRecord[];
  vocab: Record<string, VocabProgress>;
  /** Sentences the learner should practise again (Listen and Repeat match below threshold). */
  retry: Record<string, { scenarioId: string; score: number; date: string }>;
  settings: Settings;
}
