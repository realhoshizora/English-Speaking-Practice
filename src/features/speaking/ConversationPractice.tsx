// Mode B (Guided Speaking) and Mode C (Free Role-play). Both use a ConversationProvider,
// so the page does not change when a real AI provider is configured.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { AnswerInput } from '../../components/AnswerInput';
import { SpeakButton } from '../../components/SpeakButton';
import { useTts } from '../../hooks/useTts';
import {
  getProvider,
  scriptedProvider,
  type ConversationProvider,
  type ConversationSession,
  type PartnerMessage,
  type SessionSummary,
  type TurnFeedback,
} from '../../services/conversation';
import type { Scenario } from '../../types';

type Mode = 'guided' | 'roleplay';

interface LogItem {
  who: 'partner' | 'learner';
  text: string;
}

interface Props {
  scenario: Scenario;
  mode: Mode;
}

export function ConversationPractice({ scenario, mode }: Props) {
  const { state, addRecord } = useProgress();
  const tts = useTts();
  const [provider, setProvider] = useState<ConversationProvider | null>(null);
  const [providerNote, setProviderNote] = useState<string | null>(null);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [partner, setPartner] = useState<PartnerMessage | null>(null);
  const [log, setLog] = useState<LogItem[]>([]);
  const [feedback, setFeedback] = useState<(TurnFeedback & { transcript: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTask, setShowTask] = useState(mode === 'guided');
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const answered = useRef(false);
  const saved = useRef(false);
  const logEnd = useRef<HTMLLIElement>(null);
  const speakRef = useRef(tts.speak);
  speakRef.current = tts.speak;

  // Pick the configured provider; fall back to scripted when it is unavailable.
  useEffect(() => {
    let cancelled = false;
    const wanted = getProvider(state.settings);
    if (wanted.kind === 'scripted') {
      setProvider(wanted);
      return;
    }
    wanted.checkAvailability().then((a) => {
      if (cancelled) return;
      if (a.ok) setProvider(wanted);
      else {
        setProviderNote(`${a.message} Đã chuyển sang hội thoại theo kịch bản.`);
        setProvider(scriptedProvider);
      }
    });
    return () => {
      cancelled = true;
    };
    // Only on first mount: changing provider mid-conversation would lose the session.
  }, []);

  const showPartner = useCallback((msg: PartnerMessage | null) => {
    setPartner(msg);
    setFeedback(null);
    setShowHint(false);
    setShowExample(false);
    if (msg?.text) {
      setLog((l) => [...l, { who: 'partner', text: msg.text }]);
      speakRef.current(msg.text, 'partner');
    }
  }, []);

  const start = useCallback(
    (p: ConversationProvider) => {
      const s = p.createSession(scenario);
      answered.current = false;
      saved.current = false;
      setSession(s);
      setLog([]);
      setSummary(null);
      setError(null);
      showPartner(s.current());
    },
    [scenario, showPartner],
  );

  useEffect(() => {
    if (provider) start(provider);
  }, [provider, start]);

  useEffect(() => {
    logEnd.current?.scrollIntoView?.({ block: 'nearest' });
  }, [log]);

  const finish = useCallback(async () => {
    if (!session) return;
    setBusy(true);
    const s = await session.summary();
    setBusy(false);
    setSummary(s);
    if (answered.current && !saved.current) {
      saved.current = true;
      addRecord({ type: mode, scenarioId: scenario.id, score: s.score, detail: `${s.accepted}/${s.turns} lượt` });
    }
  }, [session, addRecord, mode, scenario.id]);

  const onAnswer = async (text: string) => {
    if (!session || busy) return;
    answered.current = true;
    setLog((l) => [...l, { who: 'learner', text }]);
    setBusy(true);
    setError(null);
    try {
      const fb = await session.respond(text);
      setFeedback({ ...fb, transcript: text });
    } catch (e) {
      setError(`AI không phản hồi: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const next = async (skip = false) => {
    if (!session) return;
    setBusy(true);
    const msg = skip ? await session.skip() : await session.advance();
    setBusy(false);
    showPartner(msg);
  };

  useEffect(() => {
    if (partner?.final && !summary) void finish();
  }, [partner, summary, finish]);

  if (!provider || !session) {
    return (
      <p className="card" role="status">
        Đang chuẩn bị cuộc hội thoại…
      </p>
    );
  }

  const ended = partner?.final || summary !== null;

  return (
    <section className="workspace" aria-label={mode === 'guided' ? 'Guided Speaking' : 'Free Role-play'}>
      <p className={`notice ${provider.generative ? 'notice-ai' : 'notice-info'}`}>
        {provider.generative
          ? `Đang dùng ${provider.label}. Câu trả lời do mô hình AI tạo ra và có thể chưa chính xác.`
          : mode === 'roleplay'
            ? 'Guided scripted role-play: nhân vật trả lời theo kịch bản và luật đã lập trình sẵn, không phải AI tạo sinh.'
            : 'Chế độ kịch bản: câu trả lời được kiểm tra bằng từ khóa và ý định (intent) đã khai báo, không phải AI.'}
      </p>
      {providerNote && <p className="notice notice-warn">{providerNote}</p>}

      <ol className="chat" aria-label="Nội dung hội thoại" aria-live="polite">
        {log.map((m, i) => (
          <li key={i} className={`bubble bubble-${m.who}`}>
            <span className="speaker">{m.who === 'partner' ? scenario.partnerRole : `Bạn (${scenario.learnerRole})`}</span>
            <span>{m.text}</span>
          </li>
        ))}
        <li ref={logEnd} aria-hidden="true" />
      </ol>

      {error && (
        <div className="notice notice-error" role="alert">
          {error}{' '}
          <button type="button" className="btn btn-sm" onClick={() => setProvider(scriptedProvider)}>
            Chuyển sang chế độ kịch bản
          </button>
        </div>
      )}

      {!ended && partner && (
        <div className="card turn-card">
          <div className="actions">
            <SpeakButton text={partner.text} label="Nghe lại" />
            {partner.task &&
              (showTask ? (
                <p className="task">
                  <strong>Nhiệm vụ:</strong> {partner.task}
                </p>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowTask(true)}>
                  Hiện nhiệm vụ
                </button>
              ))}
          </div>

          {!feedback?.accepted && <AnswerInput onAnswer={(t) => void onAnswer(t)} disabled={busy} />}
          {busy && <p role="status">Đang xử lý…</p>}

          {feedback && (
            <div className={`feedback ${feedback.accepted ? 'is-ok' : 'is-warn'}`} role="region" aria-label="Phản hồi">
              <p>
                <strong>Bạn nói:</strong> “{feedback.transcript}”
              </p>
              <p className={`status ${feedback.accepted ? 'status-ok' : 'status-warn'}`}>{feedback.message}</p>
              {feedback.better && (
                <p>
                  <strong>Cách nói tự nhiên hơn:</strong> {feedback.better}
                </p>
              )}
              {feedback.tips.map((tip) => (
                <p key={tip} className="tip">
                  💡 {tip}
                </p>
              ))}
              {feedback.example && (
                <p className="example">
                  <strong>Câu mẫu:</strong> {feedback.example} <SpeakButton text={feedback.example} label="Nghe" />
                </p>
              )}
              <p className="muted small">
                {feedback.source === 'ai' ? 'Phản hồi do AI tạo.' : 'Phản hồi dựa trên luật và dữ liệu bài học.'}
              </p>
            </div>
          )}

          <div className="actions">
            {partner.hint && !feedback?.accepted && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowHint(true);
                  session.useHint();
                }}
              >
                💡 Gợi ý
              </button>
            )}
            {partner.example && !feedback?.accepted && (
              <>
                <SpeakButton text={partner.example} label="Hear example" />
                <button type="button" className="btn" onClick={() => setShowExample((v) => !v)} aria-expanded={showExample}>
                  {showExample ? 'Ẩn câu mẫu' : 'Hiện câu mẫu'}
                </button>
              </>
            )}
            {feedback && !feedback.accepted && (
              <button type="button" className="btn" onClick={() => setFeedback(null)}>
                ↺ Thử lại
              </button>
            )}
            {feedback?.accepted ? (
              <>
                <button type="button" className="btn" onClick={() => setFeedback(null)}>
                  ↺ Nói lại câu này
                </button>
                <button type="button" className="btn btn-primary" onClick={() => void next()} disabled={busy}>
                  Tiếp tục →
                </button>
              </>
            ) : (
              provider.kind === 'scripted' && (
                <button type="button" className="btn btn-ghost" onClick={() => void next(true)} disabled={busy}>
                  Bỏ qua lượt này
                </button>
              )
            )}
          </div>
          {showHint && partner.hint && <p className="hint">💡 {partner.hint}</p>}
          {showExample && partner.example && <p className="hint">🗨️ {partner.example}</p>}
        </div>
      )}

      {summary ? (
        <SummaryCard summary={summary} saved={answered.current} onRestart={() => start(provider)} />
      ) : (
        <div className="actions">
          <button type="button" className="btn btn-danger-ghost" onClick={() => void finish()} disabled={busy}>
            Kết thúc phiên
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => start(provider)}>
            Bắt đầu lại
          </button>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ summary, saved, onRestart }: { summary: SessionSummary; saved: boolean; onRestart(): void }) {
  return (
    <section className="card summary" aria-labelledby="conv-summary">
      <h2 id="conv-summary">Tổng kết phiên luyện nói</h2>
      <dl className="stats-inline">
        <div>
          <dt>Lượt hội thoại</dt>
          <dd>{summary.turns}</dd>
        </div>
        <div>
          <dt>Trả lời phù hợp</dt>
          <dd>{summary.accepted}</dd>
        </div>
        <div>
          <dt>Bỏ qua</dt>
          <dd>{summary.skipped}</dd>
        </div>
        <div>
          <dt>Dùng gợi ý</dt>
          <dd>{summary.hintsUsed}</dd>
        </div>
      </dl>
      <p>
        <strong>Điểm hoàn thành nhiệm vụ: {Math.round(summary.score * 100)}%</strong>{' '}
        <span className="muted small">(tỉ lệ lượt trả lời đúng yêu cầu, không phải điểm phát âm)</span>
      </p>
      {summary.aiSummary && <p className="notice notice-ai">🤖 {summary.aiSummary}</p>}
      {summary.review.length > 0 && (
        <>
          <h3>Câu nên luyện lại</h3>
          <ul className="result-list">
            {summary.review.map((r) => (
              <li key={r}>
                <span>{r}</span> <SpeakButton text={r} />
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="muted">{saved ? 'Kết quả đã được lưu vào tiến độ.' : 'Bạn chưa trả lời lượt nào nên phiên này không được lưu.'}</p>
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Luyện lại
        </button>
        <a className="btn" href="#/speaking">
          Chọn bài khác
        </a>
      </div>
    </section>
  );
}
