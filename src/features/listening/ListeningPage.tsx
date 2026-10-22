import { useProgress } from '../../app/ProgressContext';
import { getScenario, scenarios } from '../../data/scenarios';
import { ListeningQuiz } from './ListeningQuiz';

export function ListeningPage({ scenarioId }: { scenarioId?: string }) {
  const { state } = useProgress();
  const scenario = getScenario(scenarioId);

  if (scenario) {
    return (
      <div className="page">
        <a className="back" href="#/listening">
          ← Luyện nghe
        </a>
        <header className="page-head">
          <p className="eyebrow">Listening Practice · {scenario.level}</p>
          <h1>{scenario.title}</h1>
        </header>
        <ListeningQuiz key={scenario.id} scenario={scenario} />
      </div>
    );
  }

  const best = (id: string) => {
    const scores = state.records.filter((r) => r.type === 'listening' && r.scenarioId === id).map((r) => r.score ?? 0);
    return scores.length ? Math.max(...scores) : null;
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>Listening Practice</h1>
        <p>Nghe hội thoại bằng giọng đọc của trình duyệt, trả lời câu hỏi, rồi xem transcript và giải thích.</p>
      </header>
      <ul className="grid">
        {scenarios.map((s) => {
          const b = best(s.id);
          return (
            <li key={s.id} className="card scenario-card">
              <span className="pill">{s.level}</span>
              <h2>{s.title}</h2>
              <p className="muted">{s.listening.intro}</p>
              {b !== null && <p className="small">Điểm cao nhất: {Math.round(b * 100)}%</p>}
              <a className="btn btn-primary btn-sm" href={`#/listening/${s.id}`}>
                {b === null ? 'Bắt đầu' : 'Làm lại'}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
