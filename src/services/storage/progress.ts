// Pure progress helpers: every number on the dashboard is computed from stored records.
import type { PracticeRecord, ProgressState, VocabProgress } from '../../types';

export const PASS_SPEAKING = 0.6; // share of role-play turns answered appropriately
export const PASS_LISTENING = 0.6; // listening quiz score
export const RETRY_THRESHOLD = 0.8; // Listen and Repeat match below this → "practise again"

const DAY = 24 * 60 * 60 * 1000;
const INTERVALS = [1, 2, 4, 7, 14]; // days until next review, by level of success

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addRecord(state: ProgressState, rec: Omit<PracticeRecord, 'id' | 'date'>, now = new Date()): ProgressState {
  const full: PracticeRecord = { ...rec, id: newId(), date: now.toISOString() };
  return { ...state, records: [...state.records, full] };
}

/** Simple review scheduling: wrong → due now; right → wait longer each time. */
export function reviewVocab(state: ProgressState, id: string, correct: boolean, now = new Date()): ProgressState {
  const prev: VocabProgress = state.vocab[id] ?? { correct: 0, wrong: 0, lastReviewed: '', nextReview: '' };
  const next = { ...prev, correct: prev.correct + (correct ? 1 : 0), wrong: prev.wrong + (correct ? 0 : 1) };
  const box = Math.max(0, next.correct - next.wrong);
  const wait = correct ? INTERVALS[Math.min(box, INTERVALS.length - 1)] * DAY : 0;
  next.lastReviewed = now.toISOString();
  next.nextReview = new Date(now.getTime() + wait).toISOString();
  return { ...state, vocab: { ...state.vocab, [id]: next } };
}

export const isLearned = (v?: VocabProgress) => !!v && v.correct >= 2 && v.correct > v.wrong;
export const isDifficult = (v?: VocabProgress) => !!v && v.wrong > 0 && v.wrong >= v.correct;
export const isDue = (v: VocabProgress | undefined, now = new Date()) => !v || new Date(v.nextReview) <= now;

export function updateRetry(state: ProgressState, text: string, scenarioId: string, score: number, now = new Date()): ProgressState {
  const retry = { ...state.retry };
  if (score >= RETRY_THRESHOLD) delete retry[text];
  else retry[text] = { scenarioId, score, date: now.toISOString() };
  return { ...state, retry };
}

const passed = (r: PracticeRecord, min: number) => r.score !== null && r.score >= min;

export function isScenarioComplete(records: PracticeRecord[], scenarioId: string): boolean {
  const mine = records.filter((r) => r.scenarioId === scenarioId);
  const spoke = mine.some((r) => (r.type === 'guided' || r.type === 'roleplay') && passed(r, PASS_SPEAKING));
  const listened = mine.some((r) => r.type === 'listening' && passed(r, PASS_LISTENING));
  return spoke && listened;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export interface Stats {
  completedScenarios: string[];
  speakingSessions: number;
  listeningDone: number;
  vocabLearned: number;
  todayActivities: number;
  totalActivities: number;
}

export function computeStats(state: ProgressState, scenarioIds: string[], now = new Date()): Stats {
  const r = state.records;
  return {
    completedScenarios: scenarioIds.filter((id) => isScenarioComplete(r, id)),
    speakingSessions: r.filter((x) => x.type === 'repeat' || x.type === 'guided' || x.type === 'roleplay').length,
    listeningDone: r.filter((x) => x.type === 'listening').length,
    vocabLearned: Object.values(state.vocab).filter(isLearned).length,
    todayActivities: r.filter((x) => sameDay(new Date(x.date), now)).length,
    totalActivities: r.length,
  };
}
