// Mode A: Listen and Repeat. Compares the speech-to-text transcript with the model sentence.
// This measures how closely the transcript matches, NOT pronunciation quality.
import { Fragment, useMemo, useState, type CSSProperties } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { AnswerInput } from '../../components/AnswerInput';
import { Icon } from '../../components/Icon';
import { LessonBar } from '../../components/LessonBar';
import { Celebrate } from '../../components/mascot/Celebrate';
import { MascotSays, type MascotMood } from '../../components/mascot/Mascot';
import { SpeakButton } from '../../components/SpeakButton';
import { useSound } from '../../hooks/useSound';
import { getRecognitionCtor } from '../../services/speech/SpeechCapabilityDetector';
import type { RecognitionStatus } from '../../services/speech/SpeechRecognitionService';
import type { Scenario } from '../../types';
import { compareTranscript, type Comparison } from '../../utils/text';

interface Attempt {
  transcript: string;
  via: 'speech' | 'text';
  result: Comparison;
}

interface SentenceResult {
  best: number | null; // best match ratio; null = self-practised only
  attempts: number;
}

export function repeatSentences(s: Scenario): string[] {
  const all = [...s.phrases.map((p) => p.en), ...s.dialogue.filter((l) => l.speaker === 'learner').map((l) => l.text)];
  return [...new Set(all)];
}

/** Quạc's one-line reaction; the full explanation stays in the result card. */
function headline(r: Comparison): string {
  if (r.exact) return 'Khớp hoàn toàn!';
  if (r.matchRatio >= 0.9) return 'Gần như hoàn hảo!';
  if (r.matchRatio >= 0.6) return 'Gần đúng rồi!';
  return 'Nghe lại rồi thử lần nữa nhé!';
}

function moodFor(r: Comparison): MascotMood {
  return r.matchRatio >= 0.9 ? 'happy' : r.matchRatio >= 0.6 ? 'idle' : 'confused';
}

function verdict(r: Comparison): string {
  if (r.exact) return 'Rất tốt! Transcript khớp hoàn toàn với câu mẫu.';
  if (r.matchRatio >= 0.9) return 'Rất tốt! Gần như khớp hoàn toàn.';
  if (r.matchRatio >= 0.6) return 'Gần đúng rồi. Chú ý những từ được đánh dấu, nghe lại và thử lần nữa.';
  return 'Hãy nghe lại câu mẫu, nói chậm và rõ từng từ, rồi thử lại.';
}

export function RepeatPractice({ scenario }: { scenario: Scenario }) {
  const { addRecord, updateRetry } = useProgress();
  const play = useSound();
  const [mic, setMic] = useState<RecognitionStatus>('idle');
  const [tries, setTries] = useState(0);
  const sentences = useMemo(() => repeatSentences(scenario), [scenario]);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [results, setResults] = useState<Record<number, SentenceResult>>({});
  const [hideText, setHideText] = useState(false);
  const [finished, setFinished] = useState(false);
  const canRecognize = getRecognitionCtor() !== null;
  const target = sentences[index];

  const onAnswer = (transcript: string, via: 'speech' | 'text') => {
    const result = compareTranscript(target, transcript);
    setAttempt({ transcript, via, result });
    setTries((t) => t + 1);
    play(result.matchRatio >= 0.9 ? 'correct' : result.matchRatio >= 0.6 ? 'pop' : 'retry');
    setResults((r) => {
      const prev = r[index];
      const best = Math.max(prev?.best ?? 0, result.matchRatio);
      return { ...r, [index]: { best, attempts: (prev?.attempts ?? 0) + 1 } };
    });
  };

  const markSelfPractised = () =>
    setResults((r) => ({ ...r, [index]: { best: r[index]?.best ?? null, attempts: (r[index]?.attempts ?? 0) + 1 } }));

  const go = (i: number) => {
    setIndex(i);
    setAttempt(null);
  };

  const finish = () => {
    const done = Object.entries(results);
    if (done.length) {
      const measured = done.map(([, r]) => r.best).filter((b): b is number => b !== null);
      addRecord({
        type: 'repeat',
        scenarioId: scenario.id,
        score: measured.length ? measured.reduce((a, b) => a + b, 0) / measured.length : null,
        detail: `${done.length}/${sentences.length} câu${measured.length ? '' : ' (tự luyện)'}`,
      });
      done.forEach(([i, r]) => {
        if (r.best !== null) updateRetry(sentences[Number(i)], scenario.id, r.best);
      });
    }
    setFinished(true);
  };

  if (finished) {
    const done = Object.entries(results);
    const measured = done.map(([, r]) => r.best).filter((b): b is number => b !== null);
    const avg = measured.length ? measured.reduce((a, b) => a + b, 0) / measured.length : 1;
    return (
      <section className="card summary" aria-labelledby="repeat-summary">
        {done.length > 0 && <Celebrate win={avg >= 0.6} />}
        <h2 id="repeat-summary">Tổng kết Listen and Repeat</h2>
        {done.length === 0 ? (
          <p>Bạn chưa luyện câu nào nên phiên này không được lưu.</p>
        ) : (
          <>
            <p>Bạn đã luyện {done.length}/{sentences.length} câu. Kết quả đã được lưu.</p>
            <ul className="result-list">
              {done.map(([i, r]) => (
                <li key={i}>
                  <span>{sentences[Number(i)]}</span>
                  <span className="muted small">{r.best === null ? 'Tự luyện' : `Khớp ${Math.round(r.best * 100)}%`}</span>
                </li>
              ))}
            </ul>
            <p className="muted">Câu dưới 80% được thêm vào danh sách “Cần luyện lại” ở trang Tiến độ.</p>
          </>
        )}
        <div className="actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setResults({});
              setFinished(false);
              go(0);
            }}
          >
            Luyện lại từ đầu
          </button>
          <a className="btn" href="#/speaking">
            Chọn bài khác
          </a>
        </div>
      </section>
    );
  }

  const r = attempt?.result;
  return (
    <section className="workspace" aria-label="Listen and Repeat">
      <LessonBar value={Object.keys(results).length / sentences.length} label={`Câu ${index + 1}/${sentences.length}`} />
      <div className="card target-card">
        <p className={`target ${hideText ? 'is-hidden' : ''}`} aria-hidden={hideText}>
          {hideText ? '• • • • •' : target}
        </p>
        <div className="actions">
          <SpeakButton text={target} label="Nghe câu mẫu" />
          <label className="toggle">
            <input type="checkbox" checked={hideText} onChange={(e) => setHideText(e.target.checked)} /> Ẩn chữ (chỉ nghe)
          </label>
        </div>
      </div>

      <div className="card">
        <MascotSays
          mood={r ? moodFor(r) : ['requesting', 'listening', 'processing'].includes(mic) ? 'listen' : 'idle'}
          bump={tries}
          tone={r ? (r.matchRatio >= 0.9 ? 'ok' : 'warn') : undefined}
        >
          {r ? (
            <span className="say">{headline(r)}</span>
          ) : canRecognize ? (
            <p>Nghe câu mẫu, rồi bấm micro và nói lại.</p>
          ) : (
            <p>Nghe câu mẫu, đọc to, rồi đánh dấu là đã luyện.</p>
          )}
        </MascotSays>
        <AnswerInput onAnswer={onAnswer} onStatus={setMic} />
        {!canRecognize && (
          <button type="button" className="btn" onClick={markSelfPractised}>
            <Icon name="check" /> Tôi đã tự đọc câu này {results[index] ? `(${results[index].attempts} lần)` : ''}
          </button>
        )}
      </div>

      {attempt && r && (
        <div className={`card feedback ${r.matchRatio >= 0.9 ? 'is-ok' : 'is-warn'}`} role="region" aria-label="Kết quả so sánh">
          <p>
            <strong>{attempt.via === 'speech' ? 'Máy nghe được:' : 'Bạn đã gõ:'}</strong> “{attempt.transcript}”
          </p>
          <p className="diff" aria-label="So sánh từng từ">
            {r.words.map((w, i) => (
              <Fragment key={`${tries}-${i}`}>
                <span className={`word word-${w.status}`} style={{ '--i': i } as CSSProperties}>
                  {w.display}
                  {w.status === 'missing' && <span className="sr-only"> (thiếu hoặc khác)</span>}
                </span>{' '}
              </Fragment>
            ))}
          </p>
          {r.extra.length > 0 && <p className="muted">Từ thêm / khác: {r.extra.join(', ')}</p>}
          <p className={`status ${r.matchRatio >= 0.9 ? 'status-ok' : 'status-warn'}`}>{verdict(r)}</p>
          <p className="muted small">
            Mức khớp transcript: {Math.round(r.matchRatio * 100)}%. Chữ hoa và dấu câu không được tính. Đây là mức khớp
            giữa câu mẫu và những gì máy nghe được, không phải điểm phát âm, trọng âm hay ngữ điệu.
          </p>
        </div>
      )}

      <div className="actions sticky-actions">
        {attempt && (
          <button type="button" className="btn" onClick={() => setAttempt(null)}>
            <Icon name="retry" /> Thử lại
          </button>
        )}
        <button type="button" className="btn" disabled={index === 0} onClick={() => go(index - 1)}>
          <Icon name="arrow-left" /> Câu trước
        </button>
        {index < sentences.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => go(index + 1)}>
            Câu tiếp theo <Icon name="arrow-right" />
          </button>
        ) : null}
        <button type="button" className="btn btn-danger-ghost" onClick={finish}>
          Kết thúc phiên
        </button>
      </div>
    </section>
  );
}
