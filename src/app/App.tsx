import { Dashboard } from '../features/dashboard/Dashboard';
import { ListeningPage } from '../features/listening/ListeningPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { ScenariosPage } from '../features/scenarios/ScenariosPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { SpeakingPage } from '../features/speaking/SpeakingPage';
import { VocabularyPage } from '../features/vocabulary/VocabularyPage';
import { useHashRoute } from '../hooks/useHashRoute';
import { useProgress } from './ProgressContext';

const NAV = [
  { path: '', label: 'Home', icon: '🏠' },
  { path: 'speaking', label: 'Speaking', icon: '🎤' },
  { path: 'listening', label: 'Listening', icon: '🎧' },
  { path: 'scenarios', label: 'Scenarios', icon: '🗺️' },
  { path: 'vocabulary', label: 'Vocabulary', icon: '📚' },
  { path: 'progress', label: 'My Progress', icon: '📈' },
  { path: 'settings', label: 'Settings', icon: '⚙️' },
];

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

export function App() {
  const parts = useHashRoute();
  const { warning, dismissWarning } = useProgress();
  const current = parts[0] ?? '';
  return (
    <div className="app">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Bỏ qua điều hướng
      </a>
      <header className="topbar">
        <a className="brand" href="#/">
          <img src="/favicon.svg" alt="" width="28" height="28" /> English Speaking Coach
        </a>
        <nav aria-label="Điều hướng chính">
          <ul>
            {NAV.map((n) => (
              <li key={n.path}>
                <a href={`#/${n.path}`} aria-current={current === n.path ? 'page' : undefined}>
                  <span aria-hidden="true">{n.icon}</span> {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
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
  );
}
