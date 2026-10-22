import { describe, expect, it, vi } from 'vitest';
import { enqueue, flush, readQueue } from '../services/sync/teacherSync';
import type { PracticeRecord } from '../types';

const rec = (id: string): PracticeRecord => ({ id, type: 'guided', scenarioId: 'ordering-coffee', date: '2026-10-22T08:00:00.000Z', score: 0.75, detail: '3/4 lượt' });
const URL = 'https://script.example/exec';

describe('teacher sheet sync', () => {
  it('queues readable rows once per record', () => {
    enqueue(localStorage, [rec('a')]);
    enqueue(localStorage, [rec('a'), rec('b')]);
    const q = readQueue(localStorage);
    expect(q.map((r) => r.id)).toEqual(['a', 'b']);
    expect(q[0]).toMatchObject({ type: 'Hội thoại có hướng dẫn', scenario: 'Ordering Coffee', score: 75 });
  });

  it('sends nothing until the student has a name', async () => {
    enqueue(localStorage, [rec('a')]);
    const send = vi.fn();
    expect(await flush(localStorage, '  ', URL, send)).toBe(0);
    expect(send).not.toHaveBeenCalled();
  });

  it('sends rows with the name and removes them from the queue', async () => {
    enqueue(localStorage, [rec('a'), rec('b')]);
    const send = vi.fn().mockResolvedValue(new Response());
    expect(await flush(localStorage, 'Lan', URL, send)).toBe(2);
    expect(JSON.parse(send.mock.calls[0][1].body)).toMatchObject({ id: 'a', student: 'Lan' });
    expect(readQueue(localStorage)).toEqual([]);
  });

  it('keeps unsent rows when the network fails', async () => {
    enqueue(localStorage, [rec('a'), rec('b')]);
    const send = vi.fn().mockResolvedValueOnce(new Response()).mockRejectedValueOnce(new TypeError('offline'));
    expect(await flush(localStorage, 'Lan', URL, send)).toBe(1);
    expect(readQueue(localStorage).map((r) => r.id)).toEqual(['b']);
  });
});
