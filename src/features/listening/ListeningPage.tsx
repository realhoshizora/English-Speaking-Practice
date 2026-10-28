import { useProgress } from '../../app/ProgressContext';
import { Icon } from '../../components/Icon';
import { LessonHead } from '../../components/LessonHead';
import { getScenario, scenarios } from '../../data/scenarios';
import { PASS_LISTENING } from '../../services/storage/progress';
import { ListeningQuiz } from './ListeningQuiz';

export function ListeningPage({ scenarioId }: { scenarioId?: string }) {
  const { state } = useProgress();
  const scenario = getScenario(scenarioId);

  if (scenario) {
    return (
      <div className="page">
        <a className="back" href="#/listening">
          <Icon name="arrow-left" /> Luyện nghe
        </a>
        <LessonHead scenario={scenario} meta={`Listening Practice · ${scenario.level}`} />
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
      <ol className="route" aria-label="Tình huống">
        {scenarios.map((s, i) => {
          const b = best(s.id);
          return (
            <li key={s.id} className={`route-stop${b !== null && b >= PASS_LISTENING ? ' is-done' : ''}`}>
              <span className="route-no">{i + 1}</span>
              <div className="route-body">
                <h2 className="route-title">{s.title}</h2>
                <p className="route-sum">{s.listening.intro}</p>
                {b !== null && (
                  <p className="route-sum">
                    <b>Điểm cao nhất: {Math.round(b * 100)}%</b>
                  </p>
                )}
                <div className="actions">
                  <a className="btn btn-sm" href={`#/listening/${s.id}`}>
                    <Icon name="headphones" /> {b === null ? 'Bắt đầu' : 'Làm lại'}
                  </a>
                </div>
              </div>
              <span className="route-meta">
                <span className="pill">{s.level}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
