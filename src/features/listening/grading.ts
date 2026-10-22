import type { Scenario } from '../../types';
import { normalize, shuffle } from '../../utils/text';

export const ORDER_COUNT = 4; // first lines of the dialogue used in the ordering task

export interface ListeningAnswers {
  choices: Record<number, number | undefined>; // question index → option index
  fills: Record<number, string>;
  order: number[]; // dialogue line indexes in the learner's order
}

/** Initial (shuffled) order for the "put the lines in order" task. Never already solved. */
export function initialOrder(seed: number): number[] {
  const ids = Array.from({ length: ORDER_COUNT }, (_, i) => i);
  const s = shuffle(ids, seed);
  return s.every((v, i) => v === i) ? [...s.slice(1), s[0]] : s;
}

export interface Grade {
  perQuestion: boolean[];
  orderCorrect: boolean;
  correct: number;
  total: number;
  score: number; // 0..1
}

export function gradeListening(s: Scenario, a: ListeningAnswers): Grade {
  const perQuestion = s.listening.questions.map((q, i) => {
    if (q.type === 'mcq') return a.choices[i] === q.answer;
    const given = normalize(a.fills[i] ?? '');
    return [q.answer, ...(q.accept ?? [])].some((x) => normalize(x) === given);
  });
  const orderCorrect = a.order.length === ORDER_COUNT && a.order.every((v, i) => v === i);
  const correct = perQuestion.filter(Boolean).length + (orderCorrect ? 1 : 0);
  const total = perQuestion.length + 1;
  return { perQuestion, orderCorrect, correct, total, score: correct / total };
}
