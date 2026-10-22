import { useProgress } from '../../app/ProgressContext';
import { ResetDataButton } from '../../components/ResetDataButton';
import { SpeakButton } from '../../components/SpeakButton';
import { getScenario, scenarioIds, scenarios } from '../../data/scenarios';
import { vocabulary } from '../../data/vocabulary';
import { computeStats } from '../../services/storage/progress';
import type { ActivityType, PracticeRecord } from '../../types';

export const TYPE_LABEL: Record<ActivityType, { name: string; score: string }> = {
  repeat: { name: 'Listen and Repeat', score: 'Khớp transcript' },
  guided: { name: 'Guided Speaking', score: 'Hoàn thành nhiệm vụ' },
  roleplay: { name: 'Role-play', score: 'Hoàn thành nhiệm vụ' },
  listening: { name: 'Bài nghe', score: 'Điểm bài nghe' },
  vocab: { name: 'Từ vựng', score: 'Điểm ôn tập' },
};

export function scoreText(r: PracticeRecord) {
  return r.score === null ? 'Tự luyện (không chấm)' : `${TYPE_LABEL[r.type].score}: ${Math.round(r.score * 100)}%`;
}

export function DailyGoal() {
  const { state } = useProgress();
  const s = computeStats(state, scenarioIds);
  const goal = state.settings.dailyGoal;
  const pct = Math.min(100, Math.round((s.todayActivities / goal) * 100));
  return (
    <div className="goal">
      <p>
        <strong>Mục tiêu hôm nay:</strong> {Math.min(s.todayActivities, goal)}/{goal} hoạt động
        {s.todayActivities >= goal && (
          <>
            {' '}
            <span aria-hidden="true">🎉</span> Hoàn thành!
          </>
        )}
      </p>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(s.todayActivities, goal)} aria-label="Mục tiêu hôm nay">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatCards() {
  const { state } = useProgress();
  const s = computeStats(state, scenarioIds);
  const items = [
    { label: 'Tình huống hoàn thành', value: `${s.completedScenarios.length}/${scenarios.length}` },
    { label: 'Phiên luyện nói', value: s.speakingSessions },
    { label: 'Bài nghe đã làm', value: s.listeningDone },
    { label: 'Từ vựng đã học', value: `${s.vocabLearned}/${vocabulary.length}` },
  ];
  return (
    <dl className="stats">
      {items.map((i) => (
        <div key={i.label} className="card stat">
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProgressPage() {
  const { state } = useProgress();
  const s = computeStats(state, scenarioIds);
  const history = [...state.records].reverse().slice(0, 30);
  const retry = Object.entries(state.retry);

  return (
    <div className="page">
      <header className="page-head">
        <h1>My Progress</h1>
        <p>Mọi số liệu được tính từ các hoạt động bạn đã thực sự hoàn thành trên thiết bị này.</p>
      </header>
      <section className="card">
        <DailyGoal />
      </section>
      <StatCards />

      <section className="card">
        <h2>Tình huống</h2>
        <ul className="result-list">
          {scenarios.map((sc) => (
            <li key={sc.id}>
              <a href={`#/scenarios/${sc.id}`}>{sc.title}</a>
              <span className={`pill ${s.completedScenarios.includes(sc.id) ? 'pill-ok' : ''}`}>
                {s.completedScenarios.includes(sc.id) ? '✓ Hoàn thành' : 'Chưa hoàn thành'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Câu cần luyện lại</h2>
        {retry.length === 0 ? (
          <p className="empty">Chưa có câu nào. Các câu bạn nói khớp dưới 80% trong “Listen and Repeat” sẽ xuất hiện ở đây.</p>
        ) : (
          <ul className="result-list">
            {retry.map(([text, r]) => (
              <li key={text}>
                <span>{text}</span>
                <span className="pill pill-warn">Khớp {Math.round(r.score * 100)}%</span>
                <SpeakButton text={text} />
                <a className="btn btn-sm" href={`#/speaking/${r.scenarioId}/repeat`}>
                  Luyện
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Lịch sử luyện tập</h2>
        {history.length === 0 ? (
          <p className="empty">
            Chưa có hoạt động nào. <a href="#/speaking">Bắt đầu luyện nói</a> hoặc <a href="#/listening">làm một bài nghe</a>.
          </p>
        ) : (
          <table className="history">
            <thead>
              <tr>
                <th scope="col">Thời gian</th>
                <th scope="col">Hoạt động</th>
                <th scope="col">Tình huống</th>
                <th scope="col">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleString('vi-VN')}</td>
                  <td>{TYPE_LABEL[r.type].name}</td>
                  <td>{getScenario(r.scenarioId ?? undefined)?.title ?? '—'}</td>
                  <td>
                    {scoreText(r)}
                    {r.detail && <span className="muted small"> · {r.detail}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Dữ liệu</h2>
        <p className="muted">Dữ liệu được lưu trong trình duyệt (LocalStorage) của thiết bị này và sẽ mất nếu bạn xóa dữ liệu trình duyệt.</p>
        <ResetDataButton />
      </section>
    </div>
  );
}
