import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { LessonBar } from '../../components/LessonBar';
import { Celebrate } from '../../components/mascot/Celebrate';
import { MascotSays } from '../../components/mascot/Mascot';
import { SpeakButton } from '../../components/SpeakButton';
import { useSound } from '../../hooks/useSound';
import { scenarios } from '../../data/scenarios';
import { vocabulary, type VocabEntry } from '../../data/vocabulary';
import { isDifficult, isDue, isLearned } from '../../services/storage/progress';
import { normalize, shuffle } from '../../utils/text';

const TABS = {
  list: 'Danh sách từ',
  flash: 'Flashcards',
  match: 'Match',
  fill: 'Fill in the blank',
  complete: 'Complete the sentence',
  difficult: 'Từ khó',
} as const;
type Tab = keyof typeof TABS;

export function VocabularyPage() {
  const { state } = useProgress();
  const [tab, setTab] = useState<Tab>('list');
  const [scenarioId, setScenarioId] = useState('all');
  const words = vocabulary.filter((w) => scenarioId === 'all' || w.scenarioId === scenarioId);
  const difficult = vocabulary.filter((w) => isDifficult(state.vocab[w.id]));

  return (
    <div className="page">
      <header className="page-head">
        <h1>Vocabulary</h1>
        <p>
          {vocabulary.length} từ và cụm từ từ các tình huống. Đã học: {vocabulary.filter((w) => isLearned(state.vocab[w.id])).length}. Tiến độ
          được lưu trên thiết bị này.
        </p>
      </header>
      <div className="filters">
        <label>
          Tình huống:{' '}
          <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
            <option value="all">Tất cả</option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tabs" role="tablist" aria-label="Hoạt động từ vựng">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>
            {TABS[t]}
            {t === 'difficult' && difficult.length > 0 ? ` (${difficult.length})` : ''}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={TABS[tab]}>
        {tab === 'list' && <WordList words={words} />}
        {tab === 'flash' && <Flashcards key={scenarioId} words={words} />}
        {tab === 'match' && <MatchGame key={scenarioId} words={words} />}
        {tab === 'fill' && <TypeQuiz key={scenarioId} words={words} />}
        {tab === 'complete' && <CompleteSentence key={scenarioId} words={words} />}
        {tab === 'difficult' &&
          (difficult.length ? (
            <Flashcards words={difficult} />
          ) : (
            <p className="card empty">Chưa có từ khó. Từ bạn trả lời sai nhiều sẽ xuất hiện ở đây để ôn lại.</p>
          ))}
      </div>
    </div>
  );
}

/** Words due for review come first, then the rest. */
function usePool(words: VocabEntry[], size: number, round: number) {
  const { state } = useProgress();
  return useMemo(() => {
    const due = words.filter((w) => isDue(state.vocab[w.id]));
    const rest = words.filter((w) => !isDue(state.vocab[w.id]));
    const seen = new Set<string>();
    // Same word can appear in two scenarios; keep one so matching games stay unambiguous.
    const unique = [...shuffle(due, round + 1), ...shuffle(rest, round + 7)].filter((w) => {
      const keys = [w.word.toLowerCase(), w.meaning.toLowerCase()];
      if (keys.some((k) => seen.has(k))) return false;
      keys.forEach((k) => seen.add(k));
      return true;
    });
    return unique.slice(0, size);
    // Pool is fixed for a round: progress changes during the round must not reshuffle it.
  }, [words, size, round]);
}

function useRound(label: string) {
  const { addRecord } = useProgress();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const answer = (ok: boolean) => setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
  const finish = (correct: number, total: number) => {
    if (total > 0) addRecord({ type: 'vocab', scenarioId: null, score: correct / total, detail: label });
  };
  const next = () => {
    setRound((r) => r + 1);
    setScore({ correct: 0, total: 0 });
  };
  return { round, score, answer, finish, next };
}

function RoundDone({ correct, total, onNext }: { correct: number; total: number; onNext(): void }) {
  const win = total > 0 && correct / total >= 0.6;
  return (
    <div className={`card result-banner ${win ? 'is-ok' : 'is-warn'}`} role="status">
      <Celebrate win={win} size={96} />
      <div>
        <h2>
          Hoàn thành vòng: {correct}/{total} đúng
        </h2>
        <p>{win ? 'Nhớ từ giỏi quá!' : 'Những từ chưa nhớ sẽ được ôn lại ở vòng sau.'} Kết quả đã được lưu.</p>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Vòng mới
        </button>
      </div>
    </div>
  );
}

function Empty() {
  return <p className="card empty">Không có từ nào để luyện.</p>;
}

function WordList({ words }: { words: VocabEntry[] }) {
  const { state } = useProgress();
  return (
    <ul className="vocab-table card">
      {words.map((w) => {
        const p = state.vocab[w.id];
        const label = isLearned(p) ? 'Đã học' : isDifficult(p) ? 'Cần ôn lại' : p ? 'Đang học' : 'Chưa học';
        return (
          <li key={w.id}>
            <div>
              <strong>{w.word}</strong> – {w.meaning} <span className="pill">{w.level}</span>
              <p className="muted small">
                {w.example} · <em>{w.scenarioTitle}</em>
              </p>
            </div>
            <span className={`pill ${isLearned(p) ? 'pill-ok' : isDifficult(p) ? 'pill-warn' : ''}`}>{label}</span>
            <SpeakButton text={w.word} />
          </li>
        );
      })}
    </ul>
  );
}

function Flashcards({ words }: { words: VocabEntry[] }) {
  const { reviewVocab } = useProgress();
  const play = useSound();
  const r = useRound('Flashcards');
  const pool = usePool(words, 8, r.round);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!pool.length) return <Empty />;
  if (i >= pool.length)
    return (
      <RoundDone
        correct={r.score.correct}
        total={r.score.total}
        onNext={() => {
          r.next();
          setI(0);
        }}
      />
    );
  const w = pool[i];
  const rate = (ok: boolean) => {
    reviewVocab(w.id, ok);
    r.answer(ok);
    if (ok) play('correct');
    if (i === pool.length - 1) r.finish(r.score.correct + (ok ? 1 : 0), r.score.total + 1);
    setFlipped(false);
    setI(i + 1);
  };
  return (
    <>
      <LessonBar key={r.round} value={i / pool.length} label={`Thẻ ${i + 1}/${pool.length}`} />
      <div key={w.id} className="card flashcard">
        <p className="flash-word">{w.word}</p>
        <SpeakButton text={w.word} />
        {flipped ? (
          <div className="flash-back">
            <p className="flash-meaning">{w.meaning}</p>
            <p className="muted">
              {w.example} <SpeakButton text={w.example} label="Nghe câu" />
            </p>
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={() => rate(true)}>
                ✓ Đã nhớ
              </button>
              <button type="button" className="btn" onClick={() => rate(false)}>
                ✗ Cần ôn lại
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setFlipped(true);
              play('pop');
            }}
          >
            Lật thẻ – xem nghĩa
          </button>
        )}
      </div>
    </>
  );
}

function MatchGame({ words }: { words: VocabEntry[] }) {
  const { reviewVocab } = useProgress();
  const play = useSound();
  const r = useRound('Match');
  const pool = usePool(words, 4, r.round);
  const meanings = useMemo(() => shuffle(pool, r.round + 3), [pool, r.round]);
  const [picked, setPicked] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [miss, setMiss] = useState<{ word: string; meaning: string; n: number } | null>(null);
  useEffect(() => {
    if (!miss) return;
    const t = setTimeout(() => setMiss(null), 450); // red shake, then back to normal
    return () => clearTimeout(t);
  }, [miss]);
  if (pool.length < 2) return <Empty />;
  const done = matched.length === pool.length;

  const choose = (meaningId: string) => {
    if (!picked) return;
    const ok = picked === meaningId;
    const firstTry = !wrong.includes(picked);
    if (ok) {
      reviewVocab(picked, firstTry);
      const m = [...matched, picked];
      setMatched(m);
      setMsg('Đúng rồi!');
      play('correct');
      if (m.length === pool.length) r.finish(pool.length - wrong.length, pool.length);
    } else {
      if (firstTry) setWrong([...wrong, picked]);
      setMsg('Chưa đúng, thử lại nhé.');
      setMiss((x) => ({ word: picked, meaning: meaningId, n: (x?.n ?? 0) + 1 }));
      play('retry');
    }
    setPicked(null);
  };

  return (
    <div className="card">
      <MascotSays
        mood={msg === 'Đúng rồi!' ? 'happy' : msg ? 'confused' : 'idle'}
        bump={matched.length * 10 + (miss?.n ?? 0)}
        tone={msg ? (msg === 'Đúng rồi!' ? 'ok' : 'warn') : undefined}
        live
      >
        {msg ? (
          <span className="say">{msg}</span>
        ) : (
          <p>Chọn một từ tiếng Anh, sau đó chọn nghĩa tiếng Việt tương ứng.</p>
        )}
      </MascotSays>
      <div className="match">
        <div role="group" aria-label="Từ tiếng Anh">
          {pool.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`match-item ${picked === w.id ? 'is-active' : ''} ${matched.includes(w.id) ? 'is-done' : ''} ${miss?.word === w.id ? 'is-wrong' : ''}`}
              aria-pressed={picked === w.id}
              disabled={matched.includes(w.id)}
              onClick={() => setPicked(w.id)}
            >
              {w.word}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Nghĩa tiếng Việt">
          {meanings.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`match-item ${matched.includes(w.id) ? 'is-done' : ''} ${miss?.meaning === w.id ? 'is-wrong' : ''}`}
              disabled={matched.includes(w.id) || !picked}
              onClick={() => choose(w.id)}
            >
              {w.meaning}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <RoundDone
          correct={pool.length - wrong.length}
          total={pool.length}
          onNext={() => {
            r.next();
            setMatched([]);
            setWrong([]);
            setMsg('');
          }}
        />
      )}
    </div>
  );
}

function TypeQuiz({ words }: { words: VocabEntry[] }) {
  const { reviewVocab } = useProgress();
  const play = useSound();
  const r = useRound('Fill in the blank');
  const pool = usePool(words, 5, r.round);
  const [i, setI] = useState(0);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  if (!pool.length) return <Empty />;
  if (i >= pool.length)
    return (
      <RoundDone
        correct={r.score.correct}
        total={r.score.total}
        onNext={() => {
          r.next();
          setI(0);
        }}
      />
    );
  const w = pool[i];
  const check = () => {
    const ok = normalize(value) === normalize(w.word);
    setResult(ok);
    play(ok ? 'correct' : 'retry');
    reviewVocab(w.id, ok);
    r.answer(ok);
    if (i === pool.length - 1) r.finish(r.score.correct + (ok ? 1 : 0), r.score.total + 1);
  };
  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        if (result === null) {
          if (value.trim()) check();
        } else {
          setI(i + 1);
          setValue('');
          setResult(null);
        }
      }}
    >
      <LessonBar key={r.round} value={(i + (result === null ? 0 : 1)) / pool.length} label={`Câu ${i + 1}/${pool.length}`} />
      <label className={`fill ${result === false ? 'shake' : ''}`}>
        <span>
          Viết từ tiếng Anh có nghĩa: <strong>{w.meaning}</strong>
        </span>
        <input value={value} onChange={(e) => setValue(e.target.value)} disabled={result !== null} autoComplete="off" />
      </label>
      {result !== null && (
        <p className={`status ${result ? 'status-ok' : 'status-warn'}`} role="status">
          {result ? '✓ Chính xác!' : `✗ Đáp án: ${w.word}`} – {w.example} <SpeakButton text={w.word} />
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={result === null && !value.trim()}>
        {result === null ? 'Kiểm tra' : 'Tiếp theo'}
      </button>
    </form>
  );
}

function blankOut(w: VocabEntry): string | null {
  const idx = w.example.toLowerCase().indexOf(w.word.toLowerCase());
  return idx < 0 ? null : `${w.example.slice(0, idx)}_____${w.example.slice(idx + w.word.length)}`;
}

function CompleteSentence({ words }: { words: VocabEntry[] }) {
  const { reviewVocab } = useProgress();
  const play = useSound();
  const usable = useMemo(() => words.filter((w) => blankOut(w) !== null), [words]);
  const r = useRound('Complete the sentence');
  const pool = usePool(usable, 5, r.round);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const w = pool[i];
  const options = useMemo(() => {
    if (!w) return [];
    const others = shuffle(
      [...new Map(vocabulary.filter((v) => v.word !== w.word).map((v) => [v.word, v])).values()],
      i + r.round + 11,
    ).slice(0, 3);
    return shuffle([w, ...others], i + 5);
  }, [w, i, r.round]);
  if (usable.length < 1) return <Empty />;
  if (i >= pool.length)
    return (
      <RoundDone
        correct={r.score.correct}
        total={r.score.total}
        onNext={() => {
          r.next();
          setI(0);
        }}
      />
    );
  const pick = (id: string) => {
    const ok = id === w.id;
    setChosen(id);
    play(ok ? 'correct' : 'retry');
    reviewVocab(w.id, ok);
    r.answer(ok);
    if (i === pool.length - 1) r.finish(r.score.correct + (ok ? 1 : 0), r.score.total + 1);
  };
  return (
    <div className="card">
      <LessonBar key={r.round} value={(i + (chosen ? 1 : 0)) / pool.length} label={`Câu ${i + 1}/${pool.length}`} />
      <p className="flash-meaning">{blankOut(w)}</p>
      <div className="options" role="group" aria-label="Chọn từ đúng">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`match-item ${chosen && o.id === w.id ? 'is-done' : ''} ${chosen === o.id && o.id !== w.id ? 'is-wrong' : ''}`}
            disabled={chosen !== null}
            onClick={() => pick(o.id)}
          >
            {o.word}
          </button>
        ))}
      </div>
      {chosen && (
        <>
          <p className={`status ${chosen === w.id ? 'status-ok' : 'status-warn'}`} role="status">
            {chosen === w.id ? '✓ Chính xác!' : `✗ Đáp án đúng: ${w.word} (${w.meaning})`}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setChosen(null);
              setI(i + 1);
            }}
          >
            Tiếp theo
          </button>
        </>
      )}
    </div>
  );
}
