import { describe, expect, it } from 'vitest';
import { gradeListening, initialOrder } from '../features/listening/grading';
import { getScenario } from '../data/scenarios';
import {
  addRecord,
  computeStats,
  isDifficult,
  isLearned,
  isScenarioComplete,
  reviewVocab,
  updateRetry,
} from '../services/storage/progress';
import { BACKUP_KEY, STORAGE_KEY, defaultState, loadState, saveState } from '../services/storage/progressStorage';

describe('progress storage', () => {
  it('saves and restores progress', () => {
    let s = addRecord(defaultState(), { type: 'listening', scenarioId: 'ordering-coffee', score: 0.8 });
    s = { ...s, settings: { ...s.settings, rate: 1.1 } };
    expect(saveState(s, localStorage)).toBe(true);
    const loaded = loadState(localStorage);
    expect(loaded.warning).toBeUndefined();
    expect(loaded.state.records).toHaveLength(1);
    expect(loaded.state.settings.rate).toBe(1.1);
  });

  it('starts fresh and backs up corrupt JSON instead of crashing', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    const loaded = loadState(localStorage);
    expect(loaded.state).toEqual(defaultState());
    expect(loaded.warning).toBeTruthy();
    expect(localStorage.getItem(BACKUP_KEY)).toBe('{not json');
  });

  it('rejects an unknown version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, records: [] }));
    expect(loadState(localStorage).warning).toBeTruthy();
  });

  it('drops invalid entries and bad settings but keeps valid ones', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        records: [
          { id: 'a', type: 'guided', scenarioId: 'x', date: '2026-01-01T00:00:00Z', score: 0.5 },
          { id: 'b', type: 'hacking', date: 'x', score: 1 },
          'garbage',
        ],
        vocab: { ok: { correct: 1, wrong: 0, lastReviewed: 'a', nextReview: 'b' }, bad: { correct: 'x' } },
        settings: { rate: 99, dailyGoal: 5, provider: 'evil' },
      }),
    );
    const { state, warning } = loadState(localStorage);
    expect(warning).toBeUndefined();
    expect(state.records.map((r) => r.id)).toEqual(['a']);
    expect(Object.keys(state.vocab)).toEqual(['ok']);
    expect(state.settings.rate).toBe(0.9);
    expect(state.settings.dailyGoal).toBe(5);
    expect(state.settings.provider).toBe('scripted');
  });

  it('survives blocked storage', () => {
    const blocked = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
    } as unknown as Storage;
    expect(loadState(blocked).warning).toContain('chặn');
    expect(saveState(defaultState(), blocked)).toBe(false);
  });
});

describe('progress helpers', () => {
  const now = new Date('2026-10-21T10:00:00Z');

  it('schedules vocab reviews from right and wrong answers', () => {
    let s = reviewVocab(defaultState(), 'w', true, now);
    s = reviewVocab(s, 'w', true, now);
    expect(isLearned(s.vocab.w)).toBe(true);
    expect(new Date(s.vocab.w.nextReview).getTime()).toBeGreaterThan(now.getTime());
    s = reviewVocab(s, 'w', false, now);
    s = reviewVocab(s, 'w', false, now);
    expect(isDifficult(s.vocab.w)).toBe(true);
    expect(s.vocab.w.nextReview).toBe(now.toISOString()); // wrong → due again now
  });

  it('marks a scenario complete only after speaking and listening are passed', () => {
    let s = addRecord(defaultState(), { type: 'guided', scenarioId: 'c', score: 0.8 }, now);
    expect(isScenarioComplete(s.records, 'c')).toBe(false);
    s = addRecord(s, { type: 'listening', scenarioId: 'c', score: 0.4 }, now);
    expect(isScenarioComplete(s.records, 'c')).toBe(false);
    s = addRecord(s, { type: 'listening', scenarioId: 'c', score: 0.6 }, now);
    expect(isScenarioComplete(s.records, 'c')).toBe(true);
    const stats = computeStats(s, ['c', 'd'], now);
    expect(stats).toMatchObject({ completedScenarios: ['c'], speakingSessions: 1, listeningDone: 2, todayActivities: 3 });
  });

  it('keeps low-scoring sentences in the retry list and removes them when improved', () => {
    let s = updateRetry(defaultState(), 'Hello', 'x', 0.5, now);
    expect(s.retry.Hello.score).toBe(0.5);
    s = updateRetry(s, 'Hello', 'x', 0.95, now);
    expect(s.retry.Hello).toBeUndefined();
  });
});

describe('listening grading', () => {
  const s = getScenario('ordering-coffee')!;
  it('scores choices, fills (with accepted variants) and ordering', () => {
    const g = gradeListening(s, { choices: { 0: 1, 1: 0 }, fills: { 2: ' Medium ', 3: '4' }, order: [0, 1, 2, 3] });
    expect(g.perQuestion).toEqual([true, false, true, true]);
    expect(g.orderCorrect).toBe(true);
    expect(g.correct).toBe(4);
    expect(g.total).toBe(5);
    expect(g.score).toBeCloseTo(0.8);
  });
  it('never starts the ordering task already solved', () => {
    for (let seed = 0; seed < 30; seed++) expect(initialOrder(seed)).not.toEqual([0, 1, 2, 3]);
  });
});
