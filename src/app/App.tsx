import { useEffect } from 'react';
import { Icon } from '../components/Icon';
import { scenarios } from '../data/scenarios';
import { Dashboard, pickScenario } from '../features/dashboard/Dashboard';
import { ListeningPage } from '../features/listening/ListeningPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { ScenariosPage } from '../features/scenarios/ScenariosPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { SpeakingPage } from '../features/speaking/SpeakingPage';
import { VocabularyPage } from '../features/vocabulary/VocabularyPage';
import { useHashRoute } from '../hooks/useHashRoute';
import { isScenarioComplete } from '../services/storage/progress';
import { useProgress } from './ProgressContext';

const NAV = [
  { path: '', label: 'Home' },
  { path: 'speaking', label: 'Speaking' },
  { path: 'listening', label: 'Listening' },
  { path: 'scenarios', label: 'Scenarios' },
  { path: 'vocabulary', label: 'Vocabulary' },
  { path: 'progress', label: 'My Progress' },
  { path: 'settings', label: 'Settings' },
];

/** Pages that belong to one scenario; its stop on the route is "you are here". */
const SCENARIO_PAGES = ['scenarios', 'speaking', 'listening'];

function Page({ parts }: { parts: string[] }) {
  const [section, a, b] = parts;
  switch (section) {
    case undefined:
      return <Dashboard />;
    case 'speaking':
      return <SpeakingPage scenarioId={a} mode={b} />;
    case 'listening':
      return <ListeningPage scenarioId={a} />;
    case 'scenarios':
      return <ScenariosPage scenarioId={a} />;
    case 'vocabulary':
      return <VocabularyPage />;
    case 'progress':
      return <ProgressPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return (
        <div className="page">
          <h1>Không tìm thấy trang</h1>
          <a href="#/">Về trang chủ</a>
        </div>
      );
  }
}

/** The ten scenarios as a numbered route beside the page (desktop only). One stop is always yellow:
 *  the scenario on screen, or else the one Home sends the learner to next. */
function Route({ section, id }: { section?: string; id?: string }) {
  const { state } = useProgress();
  const done = scenarios.filter((s) => isScenarioComplete(state.records, s.id)).length;
  const inScenario = SCENARIO_PAGES.includes(section ?? '') && scenarios.some((s) => s.id === id);
  const next = inScenario ? undefined : pickScenario(state.records)?.id;
  return (
    <nav className="rail" aria-label="Lộ trình học">
      <p className="rail-title">
        Lộ trình học
        <span className="rail-count">
          {done}/{scenarios.length}
        </span>
      </p>
      <ol>
        {scenarios.map((s, i) => {
          const complete = isScenarioComplete(state.records, s.id);
          const here = inScenario && id === s.id;
          return (
            <li key={s.id}>
              <a
                className={`stop${complete ? ' is-done' : ''}${s.id === next ? ' is-next' : ''}`}
                href={`#/scenarios/${s.id}`}
                aria-current={here ? (section === 'scenarios' ? 'page' : 'location') : undefined}
              >
                <span className="stop-no">{i + 1}</span>
                <span>
                  <span lang="en">{s.title}</span>
                  <span className="stop-vi">{s.titleVi}</span>
                  {complete && <span className="sr-only"> (đã hoàn thành)</span>}
                  {s.id === next && <span className="sr-only"> (học tiếp)</span>}
                </span>
                {complete ? <Icon name="check" /> : <span />}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function App() {
  const parts = useHashRoute();
  const { warning, dismissWarning } = useProgress();
  const current = parts[0] ?? '';

  useEffect(() => {
    // On narrow screens the nav row scrolls sideways: keep the current page in sight.
    document.querySelector('.topbar nav [aria-current="page"]')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [current]);

  return (
    <div className="app">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Bỏ qua điều hướng
      </a>
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-logo">
            <img src="/favicon.svg" alt="" width="34" height="34" />
          </span>
          <span className="brand-text">
            <span className="brand-name">English Speaking Coach</span>
            <span className="brand-sub">Luyện nói tiếng Anh giao tiếp theo tình huống · A1–B1</span>
          </span>
        </a>
        <nav aria-label="Điều hướng chính">
          <ul>
            {NAV.map((n) => (
              <li key={n.path}>
                <a href={`#/${n.path}`} aria-current={current === n.path ? 'page' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="shell">
        <Route section={parts[0]} id={parts[1]} />
        <div className="stage">
          {warning && (
            <div className="notice notice-warn banner" role="alert">
              {warning}{' '}
              <button type="button" className="btn btn-sm" onClick={dismissWarning}>
                Đã hiểu
              </button>
            </div>
          )}
          <main id="main" tabIndex={-1}>
            <Page parts={parts} />
          </main>
          <footer className="footer">
            <p>Dữ liệu học tập được lưu cục bộ trên trình duyệt này. Ứng dụng không ghi âm giọng nói của bạn.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
