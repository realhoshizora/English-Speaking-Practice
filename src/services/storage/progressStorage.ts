// Versioned LocalStorage persistence. Corrupt or incompatible data never crashes the app:
// it is copied to a backup key and the app starts fresh.
import type { ActivityType, PracticeRecord, ProgressState, Settings, VocabProgress } from '../../types';

export const STORAGE_KEY = 'esc.progress';
export const BACKUP_KEY = 'esc.progress.corrupt-backup';

export const DEFAULT_SETTINGS: Settings = {
  rate: 0.9,
  voiceURI: null,
  recognitionLang: 'en-US',
  dailyGoal: 3,
  showTranslation: false,
  provider: 'scripted',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.2',
};

export function defaultState(): ProgressState {
  return { version: 1, records: [], vocab: {}, retry: {}, settings: { ...DEFAULT_SETTINGS } };
}

const TYPES: ActivityType[] = ['repeat', 'guided', 'roleplay', 'listening', 'vocab'];
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStr = (v: unknown): v is string => typeof v === 'string';

function cleanRecord(r: unknown): PracticeRecord | null {
  if (!isObj(r) || !isStr(r.id) || !isStr(r.date) || !TYPES.includes(r.type as ActivityType)) return null;
  if (r.score !== null && !isNum(r.score)) return null;
  return {
    id: r.id,
    type: r.type as ActivityType,
    scenarioId: isStr(r.scenarioId) ? r.scenarioId : null,
    date: r.date,
    score: r.score as number | null,
    detail: isStr(r.detail) ? r.detail : undefined,
  };
}

function cleanSettings(s: unknown): Settings {
  const out = { ...DEFAULT_SETTINGS };
  if (!isObj(s)) return out;
  if (isNum(s.rate) && s.rate >= 0.5 && s.rate <= 1.5) out.rate = s.rate;
  if (isStr(s.voiceURI)) out.voiceURI = s.voiceURI;
  if (isStr(s.recognitionLang)) out.recognitionLang = s.recognitionLang;
  if (isNum(s.dailyGoal) && s.dailyGoal >= 1 && s.dailyGoal <= 50) out.dailyGoal = Math.round(s.dailyGoal);
  if (typeof s.showTranslation === 'boolean') out.showTranslation = s.showTranslation;
  if (s.provider === 'scripted' || s.provider === 'local-ai') out.provider = s.provider;
  if (isStr(s.ollamaUrl)) out.ollamaUrl = s.ollamaUrl;
  if (isStr(s.ollamaModel)) out.ollamaModel = s.ollamaModel;
  return out;
}

/** Parses stored JSON. Returns null when the data is unusable (caller backs it up). */
export function parseState(raw: string): ProgressState | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObj(data) || data.version !== 1) return null;
  const state = defaultState();
  if (Array.isArray(data.records)) {
    state.records = data.records.map(cleanRecord).filter((r): r is PracticeRecord => r !== null);
  }
  if (isObj(data.vocab)) {
    for (const [id, v] of Object.entries(data.vocab)) {
      if (isObj(v) && isNum(v.correct) && isNum(v.wrong) && isStr(v.lastReviewed) && isStr(v.nextReview)) {
        state.vocab[id] = v as unknown as VocabProgress;
      }
    }
  }
  if (isObj(data.retry)) {
    for (const [text, v] of Object.entries(data.retry)) {
      if (isObj(v) && isStr(v.scenarioId) && isNum(v.score) && isStr(v.date)) {
        state.retry[text] = { scenarioId: v.scenarioId, score: v.score, date: v.date };
      }
    }
  }
  state.settings = cleanSettings(data.settings);
  return state;
}

export interface LoadResult {
  state: ProgressState;
  warning?: string; // Vietnamese message for the user
}

export function loadState(storage: Storage = window.localStorage): LoadResult {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: defaultState(), warning: 'Trình duyệt chặn bộ nhớ cục bộ. Tiến độ sẽ không được lưu.' };
  }
  if (raw === null) return { state: defaultState() };
  const state = parseState(raw);
  if (state) return { state };
  try {
    storage.setItem(BACKUP_KEY, raw);
  } catch {
    /* backup is best effort */
  }
  return {
    state: defaultState(),
    warning: 'Dữ liệu tiến độ cũ bị lỗi hoặc không tương thích nên đã được bắt đầu lại. Bản cũ được sao lưu trong trình duyệt.',
  };
}

export function saveState(state: ProgressState, storage: Storage = window.localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false; // quota exceeded or storage blocked
  }
}

export function clearState(storage: Storage = window.localStorage) {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}
