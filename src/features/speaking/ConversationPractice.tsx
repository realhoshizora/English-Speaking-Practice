// Mode B (Guided Speaking) and Mode C (Free Role-play). Both use a ConversationProvider,
// so the page does not change when a real AI provider is configured.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { AnswerInput } from '../../components/AnswerInput';
import { Icon } from '../../components/Icon';
import { CountUp, LessonBar } from '../../components/LessonBar';
import { Celebrate } from '../../components/mascot/Celebrate';
import { MascotSays, type MascotMood } from '../../components/mascot/Mascot';
import { SpeakButton } from '../../components/SpeakButton';
import { useSound } from '../../hooks/useSound';
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
import type { RecognitionStatus } from '../../services/speech/SpeechRecognitionService';
import { PASS_SPEAKING } from '../../services/storage/progress';
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

const PRAISE = ['Chuẩn rồi!', 'Tuyệt vời!', 'Giỏi quá!', 'Hay lắm!', 'Đúng ý rồi!'];
const LISTENING: RecognitionStatus[] = ['requesting', 'listening', 'processing'];

export function ConversationPractice({ scenario, mode }: Props) {
  const { state, addRecord } = useProgress();
  const tts = useTts();
  const play = useSound();
  const [provider, setProvider] = useState<ConversationProvider | null>(null);
  const [providerNote, setProviderNote] = useState<string | null>(null);
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [run, setRun] = useState(0);
  const [partner, setPartner] = useState<PartnerMessage | null>(null);
  const [log, setLog] = useState<LogItem[]>([]);
  const [feedback, setFeedback] = useState<(TurnFeedback & { transcript: string }) | null>(null);
  const [mic, setMic] = useState<RecognitionStatus>('idle');
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
      setRun((r) => r + 1);
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
      play(fb.accepted ? 'correct' : 'retry');
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
  const progress = session.progress?.();
  const answers = log.filter((m) => m.who === 'learner').length;
  const mood: MascotMood = feedback ? (feedback.accepted ? 'happy' : 'confused') : LISTENING.includes(mic) ? 'listen' : 'idle';

  return (
    <section className="workspace" aria-label={mode === 'guided' ? 'Guided Speaking' : 'Free Role-play'}>
      {progress && <LessonBar key={run} value={summary ? 1 : progress.total ? progress.done / progress.total : 0} />}

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
          <MascotSays mood={mood} bump={answers} tone={feedback ? (feedback.accepted ? 'ok' : 'warn') : undefined}>
            {feedback ? (
              <span className="say">{feedback.accepted ? PRAISE[(answers - 1) % PRAISE.length] : 'Quạc chưa hiểu ý bạn.'}</span>
            ) : partner.task && showTask ? (
              <p className="task">
                <strong>Nhiệm vụ:</strong> {partner.task}
              </p>
            ) : (
              <p>Đến lượt bạn nói!</p>
            )}
          </MascotSays>

          <div className="actions">
            <SpeakButton text={partner.text} label="Nghe lại" />
            {partner.task && !showTask && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowTask(true)}>
                Hiện nhiệm vụ
              </button>
            )}
          </div>

          {!feedback?.accepted && <AnswerInput onAnswer={(t) => void onAnswer(t)} disabled={busy} onStatus={setMic} />}
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
                  <Icon name="bulb" />
                  <span>{tip}</span>
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
                <Icon name="bulb" /> Gợi ý
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
                <Icon name="retry" /> Thử lại
              </button>
            )}
            {feedback?.accepted ? (
              <>
                <button type="button" className="btn" onClick={() => setFeedback(null)}>
                  <Icon name="retry" /> Nói lại câu này
                </button>
                <button type="button" className="btn btn-primary" onClick={() => void next()} disabled={busy}>
                  Tiếp tục <Icon name="arrow-right" />
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
          {showHint && partner.hint && (
            <p className="hint">
              <Icon name="bulb" />
              <span>{partner.hint}</span>
            </p>
          )}
          {showExample && partner.example && (
            <p className="hint">
              <Icon name="chat" />
              <span>{partner.example}</span>
            </p>
          )}
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
  const win = saved && summary.score >= PASS_SPEAKING;
  return (
    <section className="card summary" aria-labelledby="conv-summary">
      <Celebrate win={win} />
      <h2 id="conv-summary">Tổng kết phiên luyện nói</h2>
      <p className="summary-say">
        {win ? 'Xong bài rồi! Quạc tự hào về bạn.' : 'Bạn đã cố gắng rồi! Luyện lại một lần nữa để nói trôi chảy hơn nhé.'}
      </p>
      <dl className="stats-inline">
        <div>
          <dt>Hoàn thành nhiệm vụ</dt>
          <dd>
            <CountUp value={Math.round(summary.score * 100)} suffix="%" />
          </dd>
        </div>
        <div>
          <dt>Trả lời phù hợp</dt>
          <dd>
            {summary.accepted}/{summary.turns}
          </dd>
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
      <p className="muted small">“Hoàn thành nhiệm vụ” là tỉ lệ lượt trả lời đúng yêu cầu, không phải điểm phát âm.</p>
      {summary.aiSummary && (
        <p className="notice notice-ai">
          <Icon name="sparkle" /> {summary.aiSummary}
        </p>
      )}
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
