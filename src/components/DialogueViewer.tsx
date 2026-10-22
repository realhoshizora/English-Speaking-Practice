import { useState } from 'react';
import { useProgress } from '../app/ProgressContext';
import { useTts } from '../hooks/useTts';
import type { Scenario } from '../types';

interface Props {
  scenario: Scenario;
  hideText?: boolean; // listening mode: play lines without showing the transcript
}

/** Whole dialogue with play all / pause / resume / stop, plus per-line replay. */
export function DialogueViewer({ scenario, hideText = false }: Props) {
  const { state } = useProgress();
  const t = useTts();
  const [showVi, setShowVi] = useState(state.settings.showTranslation);
  const lines = scenario.dialogue;
  const playingAll = t.active('all');

  const speaker = (s: 'partner' | 'learner') => (s === 'partner' ? scenario.partnerRole : scenario.learnerRole);

  return (
    <div className="dialogue">
      <div className="toolbar" role="group" aria-label="Điều khiển phát hội thoại">
        {!t.supported && <p className="notice notice-warn">Trình duyệt không hỗ trợ đọc văn bản. Bạn vẫn có thể đọc hội thoại.</p>}
        {t.supported && !playingAll && (
          <button type="button" className="btn btn-primary" onClick={() => t.speak(lines.map((l) => l.text), 'all')}>
            ▶ Phát cả hội thoại
          </button>
        )}
        {playingAll && t.status === 'speaking' && (
          <button type="button" className="btn" onClick={t.pause}>
            ⏸ Tạm dừng
          </button>
        )}
        {playingAll && t.status === 'paused' && (
          <button type="button" className="btn" onClick={t.resume}>
            ▶ Tiếp tục
          </button>
        )}
        {playingAll && (
          <button type="button" className="btn" onClick={t.stop}>
            ⏹ Dừng
          </button>
        )}
        {!hideText && (
          <label className="toggle">
            <input type="checkbox" checked={showVi} onChange={(e) => setShowVi(e.target.checked)} /> Hiện bản dịch
          </label>
        )}
      </div>
      <ol className="lines">
        {lines.map((l, i) => {
          const current = playingAll && t.index === i;
          return (
            <li key={i} className={`line line-${l.speaker} ${current ? 'is-current' : ''}`} aria-current={current || undefined}>
              <span className="speaker">{hideText ? `Câu ${i + 1}` : speaker(l.speaker)}</span>
              {!hideText && <p className="en">{l.text}</p>}
              {!hideText && showVi && <p className="vi">{l.vi}</p>}
              {t.supported && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={`Nghe câu ${i + 1}`}
                  onClick={() => t.speak(l.text, 'all-line')}
                >
                  🔊
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
