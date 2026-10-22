import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as P from '../services/storage/progress';
import { clearState, defaultState, loadState, saveState } from '../services/storage/progressStorage';
import { enqueue, flush, SHEET_URL } from '../services/sync/teacherSync';
import type { PracticeRecord, ProgressState, Settings } from '../types';

interface ProgressContextValue {
  state: ProgressState;
  warning: string | null;
  dismissWarning(): void;
  addRecord(rec: Omit<PracticeRecord, 'id' | 'date'>): void;
  reviewVocab(id: string, correct: boolean): void;
  updateRetry(text: string, scenarioId: string, score: number): void;
  updateSettings(patch: Partial<Settings>): void;
  resetAll(): void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children, storage }: { children: ReactNode; storage?: Storage }) {
  const store = storage ?? window.localStorage;
  const initial = useRef(loadState(store));
  const [state, setState] = useState<ProgressState>(initial.current.state);
  const [warning, setWarning] = useState<string | null>(initial.current.warning ?? null);
  useEffect(() => {
    // Corrupt data was already copied to a backup key by loadState, so saving here is safe.
    if (!saveState(state, store)) setWarning('Không lưu được tiến độ (bộ nhớ trình duyệt đầy hoặc bị chặn).');
  }, [state, store]);

  // Queue each newly finished activity for the teacher's sheet, then try to send.
  const seen = useRef(initial.current.state.records.length);
  useEffect(() => {
    if (!SHEET_URL) return;
    const recs = state.records;
    if (recs.length > seen.current) enqueue(store, recs.slice(seen.current), P.computeStreak(recs, state.settings.dailyGoal).current);
    seen.current = recs.length;
    void flush(store, state.settings.studentName);
  }, [state.records, state.settings.studentName, state.settings.dailyGoal, store]);
  useEffect(() => {
    if (!SHEET_URL) return;
    const retry = () => void flush(store, state.settings.studentName);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [state.settings.studentName, store]);

  const addRecord = useCallback((rec: Omit<PracticeRecord, 'id' | 'date'>) => setState((s) => P.addRecord(s, rec)), []);
  const reviewVocab = useCallback((id: string, correct: boolean) => setState((s) => P.reviewVocab(s, id, correct)), []);
  const updateRetry = useCallback(
    (text: string, scenarioId: string, score: number) => setState((s) => P.updateRetry(s, text, scenarioId, score)),
    [],
  );
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    [],
  );
  const resetAll = useCallback(() => {
    clearState(store);
    setState(defaultState());
  }, [store]);

  const value = useMemo(
    () => ({
      state,
      warning,
      dismissWarning: () => setWarning(null),
      addRecord,
      reviewVocab,
      updateRetry,
      updateSettings,
      resetAll,
    }),
    [state, warning, addRecord, reviewVocab, updateRetry, updateSettings, resetAll],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
