import { useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { DialogueViewer } from '../../components/DialogueViewer';
import { Celebrate } from '../../components/mascot/Celebrate';
import { SpeakButton } from '../../components/SpeakButton';
import type { Scenario } from '../../types';
import { gradeListening, initialOrder, ORDER_COUNT, type Grade } from './grading';

export function ListeningQuiz({ scenario }: { scenario: Scenario }) {
  const { addRecord } = useProgress();
  const [choices, setChoices] = useState<Record<number, number | undefined>>({});
  const [fills, setFills] = useState<Record<number, string>>({});
  const [order, setOrder] = useState(() => initialOrder(scenario.id.length));
  const [grade, setGrade] = useState<Grade | null>(null);
  const qs = scenario.listening.questions;
  const answeredAll = qs.every((q, i) => (q.type === 'mcq' ? choices[i] !== undefined : (fills[i] ?? '').trim() !== ''));

  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[pos], next[to]] = [next[to], next[pos]];
    setOrder(next);
  };

  const submit = () => {
    const g = gradeListening(scenario, { choices, fills, order });
    setGrade(g);
    addRecord({ type: 'listening', scenarioId: scenario.id, score: g.score, detail: `${g.correct}/${g.total} câu đúng` });
    window.scrollTo?.(0, 0);
  };

  const reset = () => {
    setChoices({});
    setFills({});
    setOrder(initialOrder(scenario.id.length + 1));
    setGrade(null);
  };

  const mark = (ok: boolean) => (
    <span className={`mark ${ok ? 'mark-ok' : 'mark-bad'}`}>{ok ? '✓ Đúng' : '✗ Chưa đúng'}</span>
  );

  return (
    <div className="listening">
      {grade && (
        <div className={`card result-banner ${grade.score >= 0.6 ? 'is-ok' : 'is-warn'}`} role="status">
          <Celebrate win={grade.score >= 0.6} size={96} />
          <div>
            <h2>
              Kết quả: {grade.correct}/{grade.total} câu đúng ({Math.round(grade.score * 100)}%)
            </h2>
            <p>{grade.score >= 0.6 ? 'Làm tốt lắm! Kết quả đã được lưu.' : 'Hãy nghe lại và thử thêm lần nữa nhé. Kết quả đã được lưu.'}</p>
            <button type="button" className="btn btn-primary" onClick={reset}>
              Làm lại
            </button>
          </div>
        </div>
      )}

      <section className="card" aria-labelledby="l-intro">
        <h2 id="l-intro">1. Bối cảnh</h2>
        <p>{scenario.listening.intro}</p>
        <h3>Từ vựng chuẩn bị</h3>
        <ul className="vocab-mini">
          {scenario.vocabulary.slice(0, 6).map((v) => (
            <li key={v.word}>
              <strong>{v.word}</strong> – {v.meaning} <SpeakButton text={v.word} label="Nghe" />
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="l-listen">
        <h2 id="l-listen">2. Nghe hội thoại</h2>
        <p className="muted">{grade ? 'Transcript đã được hiện sau khi bạn nộp bài.' : 'Transcript sẽ hiện sau khi bạn nộp bài. Bạn có thể nghe lại từng câu.'}</p>
        <DialogueViewer scenario={scenario} hideText={!grade} />
      </section>

      <section className="card" aria-labelledby="l-questions">
        <h2 id="l-questions">3. Trả lời câu hỏi</h2>
        <ol className="questions">
          {qs.map((q, i) => (
            <li key={i} className="question">
              {q.type === 'mcq' ? (
                <fieldset disabled={!!grade}>
                  <legend>{q.question}</legend>
                  {q.options.map((o, j) => (
                    <label key={j} className="option">
                      <input type="radio" name={`q${i}`} checked={choices[i] === j} onChange={() => setChoices({ ...choices, [i]: j })} /> {o}
                    </label>
                  ))}
                </fieldset>
              ) : (
                <label className="fill">
                  <span>Điền từ còn thiếu: {q.sentence}</span>
                  <input
                    value={fills[i] ?? ''}
                    onChange={(e) => setFills({ ...fills, [i]: e.target.value })}
                    disabled={!!grade}
                    autoComplete="off"
                  />
                </label>
              )}
              {grade && (
                <p className="explain">
                  {mark(grade.perQuestion[i])}{' '}
                  {q.type === 'fill' && !grade.perQuestion[i] && (
                    <>
                      Đáp án: <strong>{q.answer}</strong>.{' '}
                    </>
                  )}
                  {q.type === 'mcq' && !grade.perQuestion[i] && (
                    <>
                      Đáp án: <strong>{q.options[q.answer]}</strong>.{' '}
                    </>
                  )}
                  {q.explanation}
                </p>
              )}
            </li>
          ))}
          <li className="question">
            <p>
              <strong>Sắp xếp {ORDER_COUNT} lượt hội thoại đầu tiên theo đúng thứ tự:</strong>
            </p>
            <ol className="order-list">
              {order.map((lineIdx, pos) => (
                <li key={lineIdx}>
                  <span>{scenario.dialogue[lineIdx].text}</span>
                  <span className="order-btns">
                    <button type="button" className="btn btn-sm" aria-label="Chuyển lên" disabled={!!grade || pos === 0} onClick={() => move(pos, -1)}>
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      aria-label="Chuyển xuống"
                      disabled={!!grade || pos === order.length - 1}
                      onClick={() => move(pos, 1)}
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ol>
            {grade && (
              <p className="explain">
                {mark(grade.orderCorrect)} Thứ tự đúng là thứ tự trong transcript ở trên.
              </p>
            )}
          </li>
        </ol>
        {!grade && (
          <>
            {!answeredAll && <p className="muted">Trả lời tất cả câu hỏi để nộp bài.</p>}
            <button type="button" className="btn btn-primary" disabled={!answeredAll} onClick={submit}>
              Nộp bài
            </button>
          </>
        )}
      </section>
    </div>
  );
}
