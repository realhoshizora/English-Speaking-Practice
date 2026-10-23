import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useProgress } from '../app/ProgressContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { RecognitionStatus } from '../services/speech/SpeechRecognitionService';
import { MicButton, isBusy, statusMessage } from './MicButton';

// Remembered for the whole visit, so learners who type don't have to reopen the box every turn.
let preferText = false;

interface Props {
  onAnswer(text: string, via: 'speech' | 'text'): void;
  disabled?: boolean;
  /** Lets the page react to the microphone (the mascot listens while it is on). */
  onStatus?(status: RecognitionStatus): void;
}

/** Microphone answer with a typed fallback. Never pretends to recognise speech when the API is missing. */
export function AnswerInput({ onAnswer, disabled, onStatus }: Props) {
  const { state } = useProgress();
  const rec = useSpeechRecognition((t) => onAnswer(t, 'speech'));
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(() => !rec.supported || preferText);
  const micFailed = ['denied', 'network', 'error'].includes(rec.snap.status);
  const textVisible = showText || micFailed;
  useEffect(() => {
    if (micFailed) preferText = true; // the next turn opens with the text box already shown
  }, [micFailed]);
  const status = rec.snap.status;
  const statusCb = useRef(onStatus);
  statusCb.current = onStatus;
  useEffect(() => {
    statusCb.current?.(status);
  }, [status]);
  useEffect(() => () => statusCb.current?.('idle'), []);
  const msg = statusMessage(rec.snap);
  const live = rec.snap.interim || rec.snap.transcript;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    rec.reset();
    onAnswer(text.trim(), 'text');
    setText('');
  };

  return (
    <div className="answer-input">
      {rec.supported ? (
        <div className="mic-area">
          <MicButton
            status={rec.snap.status}
            disabled={disabled}
            onStart={() => rec.start(state.settings.recognitionLang)}
            onStop={rec.stop}
          />
          <div className="mic-status">
            <p className={`status status-${msg.tone}`} role="status" aria-live="polite">
              {msg.text}
            </p>
            {live && isBusy(rec.snap.status) && (
              <p className="interim">
                <span className="sr-only">Đang nghe được: </span>“{live}”
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="notice notice-warn" role="status">
          Trình duyệt này không hỗ trợ nhận diện giọng nói. Hãy nghe câu mẫu, <strong>tự nói to</strong>, rồi gõ câu trả lời
          bên dưới. Đây là chế độ tự luyện, ứng dụng không nghe được giọng của bạn.
        </p>
      )}

      {rec.supported && !micFailed && (
        <button
          type="button"
          className="btn-link"
          aria-expanded={showText}
          onClick={() => {
            preferText = !showText;
            setShowText(preferText);
          }}
        >
          ⌨️ {showText ? 'Ẩn ô gõ chữ' : 'Gõ câu trả lời thay vì nói'}
        </button>
      )}
      {textVisible && (
        <form className="text-answer" onSubmit={submit}>
          <label htmlFor="typed-answer" className="sr-only">
            Câu trả lời bằng tiếng Anh
          </label>
          <input
            id="typed-answer"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your answer in English…"
            autoComplete="off"
            disabled={disabled}
          />
          <button type="submit" className="btn btn-primary" disabled={disabled || !text.trim()}>
            Gửi
          </button>
        </form>
      )}
    </div>
  );
}
