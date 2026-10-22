import { getScenario, scenarios } from '../../data/scenarios';
import { ConversationPractice } from './ConversationPractice';
import { RepeatPractice } from './RepeatPractice';

export const MODES = {
  repeat: { name: 'Listen and Repeat', vi: 'Nghe và nhắc lại', desc: 'Nghe câu mẫu, nói lại, xem máy nghe được những từ nào.' },
  guided: { name: 'Guided Speaking', vi: 'Hội thoại có hướng dẫn', desc: 'Trả lời từng lượt, có nhiệm vụ, gợi ý và câu mẫu.' },
  roleplay: { name: 'Free Role-play', vi: 'Nhập vai', desc: 'Tự nhập vai, nhiệm vụ và gợi ý được ẩn, hội thoại có nhiều nhánh.' },
} as const;

export type ModeId = keyof typeof MODES;

export function SpeakingPage({ scenarioId, mode }: { scenarioId?: string; mode?: string }) {
  const scenario = getScenario(scenarioId);
  if (!scenario || !mode || !(mode in MODES)) return <SpeakingHome />;
  const m = MODES[mode as ModeId];

  return (
    <div className="page">
      <a className="back" href="#/speaking">
        ← Luyện nói
      </a>
      <header className="page-head">
        <p className="eyebrow">
          {m.name} · {m.vi}
        </p>
        <h1>{scenario.title}</h1>
        <dl className="roles">
          <div>
            <dt>Mục tiêu</dt>
            <dd>{mode === 'repeat' ? 'Nghe và nói lại chính xác các câu mẫu.' : scenario.goals.join(' · ')}</dd>
          </div>
          <div>
            <dt>Vai của bạn</dt>
            <dd>{scenario.learnerRole}</dd>
          </div>
          <div>
            <dt>Nhân vật</dt>
            <dd>{scenario.partnerRole}</dd>
          </div>
        </dl>
      </header>
      {mode === 'repeat' ? (
        <RepeatPractice key={scenario.id} scenario={scenario} />
      ) : (
        <ConversationPractice key={`${scenario.id}-${mode}`} scenario={scenario} mode={mode as 'guided' | 'roleplay'} />
      )}
    </div>
  );
}

function SpeakingHome() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Speaking Practice</h1>
        <p>Chọn một tình huống và một chế độ luyện nói. Nên bắt đầu với “Nghe và nhắc lại”, sau đó “Hội thoại có hướng dẫn”.</p>
      </header>
      <div className="mode-legend">
        {Object.entries(MODES).map(([id, m]) => (
          <div key={id} className="card mode-card">
            <h2>{m.name}</h2>
            <p className="muted">
              {m.vi}: {m.desc}
            </p>
          </div>
        ))}
      </div>
      <ul className="grid">
        {scenarios.map((s) => (
          <li key={s.id} className="card scenario-card">
            <span className="pill">{s.level}</span>
            <h2>{s.title}</h2>
            <p className="muted">{s.titleVi}</p>
            <div className="actions">
              {Object.entries(MODES).map(([id, m]) => (
                <a key={id} className={`btn btn-sm ${id === 'guided' ? 'btn-primary' : ''}`} href={`#/speaking/${s.id}/${id}`}>
                  {m.name}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
