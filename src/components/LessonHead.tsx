import type { ReactNode } from 'react';
import { scenarios } from '../data/scenarios';
import type { Scenario } from '../types';

/** Head of a scenario page: its number on the route, the title, and a meta line under the title. */
export function LessonHead({ scenario, meta, children }: { scenario: Scenario; meta: ReactNode; children?: ReactNode }) {
  const n = scenarios.findIndex((s) => s.id === scenario.id) + 1;
  return (
    <header className="page-head lesson-head">
      <span className="lesson-no">
        <span className="sr-only">Tình huống </span>
        {n}
      </span>
      <div className="lesson-titles">
        <h1>{scenario.title}</h1>
        <p className="lesson-meta">{meta}</p>
        {children}
      </div>
    </header>
  );
}
