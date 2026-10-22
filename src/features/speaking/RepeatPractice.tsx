// Mode A: Listen and Repeat. Compares the speech-to-text transcript with the model sentence.
// This measures how closely the transcript matches, NOT pronunciation quality.
import { useMemo, useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { AnswerInput } from '../../components/AnswerInput';
import { SpeakButton } from '../../components/SpeakButton';
import { getRecognitionCtor } from '../../services/speech/SpeechCapabilityDetector';
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

function verdict(r: Comparison): string {
  if (r.exact) return 'Rất tốt! Transcript khớp hoàn toàn với câu mẫu.';
  if (r.matchRatio >= 0.9) return 'Rất tốt! Gần như khớp hoàn toàn.';
  if (r.matchRatio >= 0.6) return 'Gần đúng rồi. Chú ý những từ được đánh dấu, nghe lại và thử lần nữa.';
  return 'Hãy nghe lại câu mẫu, nói chậm và rõ từng từ, rồi thử lại.';
}

export function RepeatPractice({ scenario }: { scenario: Scenario }) {
  const { addRecord, updateRetry } = useProgress();
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
    return (
      <section className="card" aria-labelledby="repeat-summary">
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
                  <span className="pill">{r.best === null ? 'Tự luyện' : `Khớp ${Math.round(r.best * 100)}%`}</span>
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
      <div className="card target-card">
        <p className="eyebrow">
          Câu {index + 1}/{sentences.length}
        </p>
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
        <AnswerInput onAnswer={onAnswer} />
        {!canRecognize && (
          <button type="button" className="btn" onClick={markSelfPractised}>
            ✓ Tôi đã tự đọc câu này {results[index] ? `(${results[index].attempts} lần)` : ''}
          </button>
        )}
      </div>

      {attempt && r && (
        <div className="card feedback" role="region" aria-label="Kết quả so sánh">
          <p>
            <strong>{attempt.via === 'speech' ? 'Máy nghe được:' : 'Bạn đã gõ:'}</strong> “{attempt.transcript}”
          </p>
          <p className="diff" aria-label="So sánh từng từ">
            {r.words.map((w, i) => (
              <span key={i} className={`word word-${w.status}`}>
                {w.display}
                {w.status === 'missing' && <span className="sr-only"> (thiếu hoặc khác)</span>}{' '}
              </span>
            ))}
          </p>
          {r.extra.length > 0 && <p className="muted">Từ thêm / khác: {r.extra.join(', ')}</p>}
          <p className={`status ${r.matchRatio >= 0.9 ? 'status-ok' : 'status-warn'}`}>
            {verdict(r)} <span className="pill">Mức khớp transcript: {Math.round(r.matchRatio * 100)}%</span>
          </p>
          <p className="muted small">
            Chữ hoa và dấu câu không được tính. Đây là mức khớp giữa câu mẫu và những gì máy nghe được, không phải điểm
            phát âm, trọng âm hay ngữ điệu.
          </p>
        </div>
      )}

      <div className="actions sticky-actions">
        {attempt && (
          <button type="button" className="btn" onClick={() => setAttempt(null)}>
            ↺ Thử lại
          </button>
        )}
        <button type="button" className="btn" disabled={index === 0} onClick={() => go(index - 1)}>
          ← Câu trước
        </button>
        {index < sentences.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => go(index + 1)}>
            Câu tiếp theo →
          </button>
        ) : null}
        <button type="button" className="btn btn-danger-ghost" onClick={finish}>
          Kết thúc phiên
        </button>
      </div>
    </section>
  );
}
