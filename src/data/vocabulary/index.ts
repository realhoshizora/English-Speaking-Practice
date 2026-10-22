// Vocabulary is collected from the scenarios, so each word keeps the situation it belongs to.
import type { Level, VocabItem } from '../../types';
import { scenarios } from '../scenarios';

export interface VocabEntry extends VocabItem {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  level: Level;
}

export const vocabulary: VocabEntry[] = scenarios.flatMap((s) =>
  s.vocabulary.map((v) => ({ ...v, id: `${s.id}:${v.word}`, scenarioId: s.id, scenarioTitle: s.title, level: s.level })),
);
