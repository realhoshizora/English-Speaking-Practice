import { useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { Mascot } from '../../components/mascot/Mascot';
import { scenarios } from '../../data/scenarios';
import { detectSpeechCapabilities } from '../../services/speech/SpeechCapabilityDetector';
import { isScenarioComplete, PASS_SPEAKING } from '../../services/storage/progress';
import type { PracticeRecord, Scenario } from '../../types';
import { DailyGoal } from '../progress/ProgressPage';

const SPEAKING = ['repeat', 'guided', 'roleplay'];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Resume the scenario the learner touched last; otherwise the first unfinished one. */
export function pickScenario(records: PracticeRecord[]): Scenario | undefined {
  const open = (id: string | null) => !!id && !isScenarioComplete(records, id);
  const last = [...records].reverse().find((r) => open(r.scenarioId));
  return scenarios.find((s) => s.id === last?.scenarioId) ?? scenarios.find((s) => open(s.id));
}

/** The next step that moves this scenario toward "complete" (speaking pass + listening pass). */
function nextStep(records: PracticeRecord[], s: Scenario) {
  const mine = records.filter((r) => r.scenarioId === s.id);
  if (!mine.some((r) => SPEAKING.includes(r.type)))
    return { href: `#/speaking/${s.id}/repeat`, label: 'Bắt đầu luyện nói', hint: 'Bắt đầu bằng Nghe và nhắc lại – bước dễ nhất.' };
  if (!mine.some((r) => (r.type === 'guided' || r.type === 'roleplay') && r.score !== null && r.score >= PASS_SPEAKING))
    return { href: `#/speaking/${s.id}/guided`, label: 'Luyện hội thoại', hint: 'Tiếp theo: trả lời từng lượt, có gợi ý và câu mẫu.' };
  return { href: `#/listening/${s.id}`, label: 'Làm bài nghe', hint: 'Còn bài nghe nữa là xong tình huống này.' };
}

/** First visit on this browser: Quạc asks the learner's name before anything else. */
function AskName() {
  const { updateSettings } = useProgress();
  const [name, setName] = useState('');
  return (
    <div className="page">
      <header className="home-hero">
        <form
          className="ask-name"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) updateSettings({ studentName: name.trim().slice(0, 60) });
          }}
        >
          <h1>
            Bạn <mark className="hl">tên là gì?</mark>
          </h1>
          <label className="lead" htmlFor="ask-name">
            Quạc sẽ gọi bạn bằng tên này mỗi lần bạn vào học.
          </label>
          <div className="text-answer">
            <input id="ask-name" value={name} maxLength={60} placeholder="Ví dụ: Lan Anh" autoComplete="given-name" autoFocus onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              Bắt đầu
            </button>
          </div>
        </form>
        <div className="hero-quac">
          <p className="say-bubble">Chào bạn, mình là Quạc!</p>
          <Mascot mood="wave" size={128} />
        </div>
      </header>
    </div>
  );
}

export function Dashboard() {
  const { state } = useProgress();
  const name = state.settings.studentName;
  if (!name) return <AskName />;
  const caps = detectSpeechCapabilities();
  const isNew = state.records.length === 0;
  const scenario = pickScenario(state.records);
  const step = scenario && nextStep(state.records, scenario);
  const spokeThisWeek = state.records.filter((r) => SPEAKING.includes(r.type) && Date.now() - new Date(r.date).getTime() < WEEK_MS).length;
  const retryCount = Object.keys(state.retry).length;
  const ai = state.settings.provider !== 'scripted';

  const issues: { text: string; link?: [string, string] }[] = [];
  if (!caps.secureContext) issues.push({ text: 'Micro chỉ hoạt động khi trang mở bằng https hoặc localhost.' });
  if (!caps.recognition) issues.push({ text: 'Trình duyệt này không nhận diện được giọng nói. Bạn vẫn luyện được bằng cách gõ câu trả lời, hoặc mở bằng Chrome/Edge.' });
  else if (!caps.mediaDevices) issues.push({ text: 'Không tìm thấy micro trên thiết bị này.', link: ['#/settings', 'Kiểm tra micro'] });
  if (!caps.synthesis) issues.push({ text: 'Trình duyệt này không đọc được câu mẫu thành tiếng.', link: ['#/settings', 'Chọn giọng đọc'] });

  return (
    <div className="page">
      <header className="home-hero">
        <div>
          <h1>
            {isNew ? (
              <>
                Mình bắt đầu <mark className="hl">luyện nói</mark> nhé?
              </>
            ) : (
              <>
                Hôm nay mình <mark className="hl">luyện gì?</mark>
              </>
            )}
          </h1>
          <p className="lead">Ứng dụng không ghi âm giọng của bạn. Nói sai cũng không sao, cứ thử lại bao nhiêu lần cũng được.</p>
        </div>
        <div className="hero-quac">
          <p className="say-bubble">{isNew ? `Chào ${name}, mình là Quạc!` : `Chào ${name}!`}</p>
          <Mascot mood="bow" size={128} />
        </div>
      </header>

      {issues.length > 0 && (
        <div className="notice notice-warn" role="status">
          <ul className="notice-list">
            {issues.map((i) => (
              <li key={i.text}>
                {i.text} {i.link && <a href={i.link[0]}>{i.link[1]}</a>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {scenario && step ? (
        <section className="card today" aria-labelledby="today-title">
          <div className="today-meta">
            <span className="pill" title="Trình độ theo khung CEFR: A1 là mới bắt đầu, B1 là trung cấp">
              Trình độ {scenario.level}
            </span>
            <a className={`pill ${ai ? 'pill-ai' : 'pill-quiet'}`} href="#/settings">
              {ai ? 'AI cục bộ đang bật' : 'Hội thoại mẫu · không phải AI'}
            </a>
          </div>
          <h2 id="today-title" className="today-title" lang="en">
            {scenario.title}
          </h2>
          <p className="today-vi">{scenario.titleVi}</p>
          <p className="today-story">{scenario.description}</p>
          <div className="actions">
            <a className="btn btn-primary btn-lg" href={step.href}>
              {step.label}
            </a>
            <a className="btn btn-ghost" href={`#/scenarios/${scenario.id}`}>
              Xem từ vựng và hội thoại mẫu
            </a>
          </div>
          <p className="muted small">{step.hint}</p>
          <div className="today-goal">
            <DailyGoal />
            <p className="muted small">Mỗi bài nói, bài nghe hoặc lượt ôn từ vựng tính là 1 hoạt động.</p>
          </div>
        </section>
      ) : (
        <section className="card today">
          <h2 className="today-title">Bạn đã hoàn thành cả {scenarios.length} tình huống!</h2>
          <p className="today-story">Giữ phong độ bằng cách luyện lại những câu còn khó, hoặc thử nhập vai không có gợi ý.</p>
          <div className="actions">
            <a className="btn btn-primary btn-lg" href={retryCount > 0 ? '#/progress' : '#/speaking'}>
              {retryCount > 0 ? `Luyện lại ${retryCount} câu khó` : 'Thử nhập vai'}
            </a>
          </div>
          <div className="today-goal">
            <DailyGoal />
          </div>
        </section>
      )}

      {isNew ? (
        <section aria-labelledby="how-title">
          <h2 id="how-title" className="section-title">
            Một buổi luyện diễn ra thế nào
          </h2>
          <ol className="steps">
            <li>
              <strong>Nghe mẫu</strong>
              <span className="muted">Bấm nghe câu tiếng Anh, chậm bao nhiêu cũng được.</span>
            </li>
            <li>
              <strong>Nói to</strong>
              <span className="muted">Bấm micro rồi nói lại. Không tiện nói thì gõ câu trả lời.</span>
            </li>
            <li>
              <strong>Xem máy nghe được gì</strong>
              <span className="muted">Từ nào máy nghe rõ hiện màu xanh. Đây không phải điểm phát âm.</span>
            </li>
          </ol>
          <p className="muted small">Một tình huống hoàn thành khi bạn đạt phần hội thoại và bài nghe của nó.</p>
        </section>
      ) : (
        <p className="week-line">
          {spokeThisWeek > 0
            ? `Tuần này bạn đã luyện nói ${spokeThisWeek} lần. Giỏi lắm!`
            : 'Tuần này bạn chưa luyện nói. Một bài ngắn hôm nay là đủ.'}{' '}
          <a href="#/progress">Xem tiến độ</a>
        </p>
      )}

      <nav className="more" aria-label="Luyện thêm">
        <h2 className="section-title">Luyện thêm</h2>
        <ul>
          <li>
            <a className="btn btn-ghost" href="#/listening">Luyện nghe</a>
          </li>
          <li>
            <a className="btn btn-ghost" href="#/vocabulary">Ôn từ vựng</a>
          </li>
          <li>
            <a className="btn btn-ghost" href="#/scenarios">Tất cả {scenarios.length} tình huống</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
