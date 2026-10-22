// Sends finished activities to the teacher's Google Sheet (Apps Script web app).
// Rows wait in a LocalStorage queue until they are sent, so offline work is not lost.
import { getScenario } from '../../data/scenarios';
import type { ActivityType, PracticeRecord } from '../../types';

/** Set at build time (Render env var). Empty → the feature is off and nothing is sent. */
export const SHEET_URL: string = import.meta.env.VITE_TEACHER_SHEET_URL ?? '';
export const QUEUE_KEY = 'esc.sync-queue';

const TYPE_NAME: Record<ActivityType, string> = {
  repeat: 'Nghe và nhắc lại',
  guided: 'Hội thoại có hướng dẫn',
  roleplay: 'Nhập vai',
  listening: 'Bài nghe',
  vocab: 'Từ vựng',
};

export interface SyncRow {
  id: string;
  date: string;
  type: string;
  scenario: string;
  score: number | '';
  detail: string;
  /** Days-in-a-row streak right after this activity. */
  streak: number;
}

export function toRow(r: PracticeRecord, streak = 0): SyncRow {
  return {
    id: r.id,
    date: r.date,
    type: TYPE_NAME[r.type],
    scenario: (r.scenarioId && getScenario(r.scenarioId)?.title) || '',
    score: r.score === null ? '' : Math.round(r.score * 100),
    detail: r.detail ?? '',
    streak,
  };
}

export function readQueue(storage: Storage): SyncRow[] {
  try {
    const q = JSON.parse(storage.getItem(QUEUE_KEY) ?? '[]');
    return Array.isArray(q) ? q : [];
  } catch {
    return [];
  }
}

function writeQueue(storage: Storage, q: SyncRow[]) {
  try {
    storage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    // Storage full or blocked: the record is still in local progress, only the teacher copy is skipped.
  }
}

export function enqueue(storage: Storage, records: PracticeRecord[], streak = 0) {
  const q = readQueue(storage);
  const known = new Set(q.map((r) => r.id));
  writeQueue(storage, [...q, ...records.filter((r) => !known.has(r.id)).map((r) => toRow(r, streak))]);
}

let flushing = false;

/** Sends queued rows oldest-first; stops at the first network failure and keeps the rest. Returns rows sent. */
export async function flush(storage: Storage, student: string, url = SHEET_URL, send: typeof fetch = fetch): Promise<number> {
  if (!url || !student.trim() || flushing) return 0;
  flushing = true;
  let sent = 0;
  try {
    for (const row of readQueue(storage)) {
      // text/plain + no-cors: Apps Script has no CORS headers, so the reply is unreadable; a resolved fetch means it arrived.
      await send(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ...row, student: student.trim() }) });
      writeQueue(storage, readQueue(storage).filter((r) => r.id !== row.id));
      sent++;
    }
  } catch {
    // Offline or blocked: try again later.
  } finally {
    flushing = false;
  }
  return sent;
}
