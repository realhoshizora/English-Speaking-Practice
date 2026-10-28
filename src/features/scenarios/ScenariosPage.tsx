import { useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { DialogueViewer } from '../../components/DialogueViewer';
import { Icon } from '../../components/Icon';
import { LessonHead } from '../../components/LessonHead';
import { SpeakButton } from '../../components/SpeakButton';
import { getScenario, scenarios } from '../../data/scenarios';
import { isScenarioComplete, PASS_LISTENING, PASS_SPEAKING } from '../../services/storage/progress';
import type { Level, Scenario } from '../../types';

export function ScenariosPage({ scenarioId }: { scenarioId?: string }) {
  const s = getScenario(scenarioId);
  return s ? <ScenarioDetail scenario={s} /> : <ScenarioLibrary />;
}

function ScenarioLibrary() {
  const { state } = useProgress();
  const [level, setLevel] = useState<Level | 'all'>('all');
  const list = scenarios.filter((s) => level === 'all' || s.level === level);
  return (
    <div className="page">
      <header className="page-head">
        <h1>Real-Life Scenarios</h1>
        <p>{scenarios.length} tình huống giao tiếp thực tế. Mỗi tình huống có từ vựng, mẫu câu, hội thoại, bài nghe và luyện nói.</p>
      </header>
      <div className="filters" role="group" aria-label="Lọc theo trình độ">
        {(['all', 'A1', 'A2', 'B1'] as const).map((l) => (
          <button key={l} type="button" className={`chip ${level === l ? 'is-active' : ''}`} aria-pressed={level === l} onClick={() => setLevel(l)}>
            {l === 'all' ? 'Tất cả' : l}
          </button>
        ))}
      </div>
      <ol className="route">
        {list.map((s) => {
          const done = isScenarioComplete(state.records, s.id);
          return (
            <li key={s.id} className={`route-stop${done ? ' is-done' : ''}`}>
              <span className="route-no">{scenarios.indexOf(s) + 1}</span>
              <div className="route-body">
                <h2 className="route-title">
                  <a href={`#/scenarios/${s.id}`}>{s.title}</a>
                </h2>
                <p className="route-sum">
                  <b>{s.titleVi}.</b> {s.description}
                </p>
              </div>
              <span className="route-meta">
                <span className="pill">{s.level}</span>
                {done && (
                  <span className="pill pill-ok">
                    <Icon name="check" /> Đã hoàn thành
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ScenarioDetail({ scenario: s }: { scenario: Scenario }) {
  const { state } = useProgress();
  const done = isScenarioComplete(state.records, s.id);
  return (
    <div className="page">
      <a className="back" href="#/scenarios">
        <Icon name="arrow-left" /> Tất cả tình huống
      </a>
      <LessonHead
        scenario={s}
        meta={
          <>
            <span className="pill">{s.level}</span> {s.titleVi}
          </>
        }
      >
        <p>{s.description}</p>
        <div className="actions">
          <a className="btn btn-primary" href={`#/speaking/${s.id}/guided`}>
            <Icon name="mic" /> Luyện nói
          </a>
          <a className="btn" href={`#/speaking/${s.id}/repeat`}>
            <Icon name="repeat" /> Nghe và nhắc lại
          </a>
          <a className="btn" href={`#/listening/${s.id}`}>
            <Icon name="headphones" /> Bài nghe
          </a>
        </div>
      </LessonHead>

      <div className="two-col">
        <section className="card">
          <h2>Mục tiêu học tập</h2>
          <ul>
            {s.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <dl className="roles">
            <div>
              <dt>Vai của bạn</dt>
              <dd>{s.learnerRole}</dd>
            </div>
            <div>
              <dt>Nhân vật đối thoại</dt>
              <dd>{s.partnerRole}</dd>
            </div>
          </dl>
        </section>
        <section className="card">
          <h2>Nhiệm vụ giao tiếp</h2>
          <ul>
            {s.tasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h3>Tiêu chí hoàn thành</h3>
          <ul className="checklist">
            <li>Hoàn thành Guided Speaking hoặc Role-play với ít nhất {PASS_SPEAKING * 100}% lượt trả lời phù hợp.</li>
            <li>Đạt ít nhất {PASS_LISTENING * 100}% ở bài nghe.</li>
          </ul>
          <p className={done ? 'status status-ok' : 'muted'}>
            {done ? (
              <>
                <Icon name="check" />
                Bạn đã hoàn thành tình huống này.
              </>
            ) : (
              'Chưa hoàn thành.'
            )}
          </p>
        </section>
      </div>

      <section className="card">
        <h2>Từ vựng chính</h2>
        <ul className="vocab-table">
          {s.vocabulary.map((v) => (
            <li key={v.word}>
              <div>
                <strong>{v.word}</strong> – {v.meaning}
                <p className="muted small">{v.example}</p>
              </div>
              <SpeakButton text={`${v.word}. ${v.example}`} />
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Mẫu câu hữu ích</h2>
        <ul className="vocab-table">
          {s.phrases.map((p) => (
            <li key={p.en}>
              <div>
                <strong>{p.en}</strong>
                <p className="muted small">{p.vi}</p>
              </div>
              <SpeakButton text={p.en} />
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Hội thoại mẫu</h2>
        <DialogueViewer scenario={s} />
      </section>
    </div>
  );
}
