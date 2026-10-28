import { Icon } from '../../components/Icon';
import { LessonHead } from '../../components/LessonHead';
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
        <Icon name="arrow-left" /> Luyện nói
      </a>
      <LessonHead scenario={scenario} meta={`${m.name} · ${m.vi}`}>
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
      </LessonHead>
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
      <ol className="panels" aria-label="Ba chế độ luyện nói, theo thứ tự nên học">
        {Object.entries(MODES).map(([id, m], i) => (
          <li key={id} className="card panel">
            <span className="panel-no" aria-hidden="true">
              {i + 1}
            </span>
            <h2>{m.name}</h2>
            <p className="muted">
              {m.vi}: {m.desc}
            </p>
          </li>
        ))}
      </ol>
      <ol className="route" aria-label="Tình huống">
        {scenarios.map((s, i) => (
          <li key={s.id} className="route-stop">
            <span className="route-no">{i + 1}</span>
            <div className="route-body">
              <h2 className="route-title">{s.title}</h2>
              <p className="route-sum">
                <b>{s.titleVi}</b> · {s.level}
              </p>
              <div className="actions">
                {Object.entries(MODES).map(([id, m]) => (
                  <a key={id} className="btn btn-sm" href={`#/speaking/${s.id}/${id}`}>
                    {m.name}
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
