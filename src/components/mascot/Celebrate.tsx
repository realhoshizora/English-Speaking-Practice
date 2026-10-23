import { useEffect, useState, type CSSProperties } from 'react';
import { useSound } from '../../hooks/useSound';
import { useTts } from '../../hooks/useTts';
import { Mascot } from './Mascot';

// Mascot palette only: green, amber, red and violet keep their meaning elsewhere in the app.
const COLORS = ['#ffcd3c', '#ff9124', '#2457c5', '#7aa2ff', '#ff9fb0', '#fff2a8'];
const PIECES = 28;

/** One burst of pixel confetti; removes itself when done. */
function Confetti() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 1800);
    return () => clearTimeout(t);
  }, []);
  if (!on) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: PIECES }, (_, i) => {
        const angle = (i / PIECES) * Math.PI * 2;
        const dist = 70 + ((i * 37) % 70);
        return (
          <i
            key={i}
            style={
              {
                '--x': `${Math.round(Math.cos(angle) * dist)}px`,
                '--y': `${Math.round(Math.sin(angle) * dist * 0.6 - 50)}px`,
                '--r': `${(i * 67) % 360}deg`,
                '--d': `${(i % 6) * 30}ms`,
                background: COLORS[i % COLORS.length],
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

interface Props {
  /** Full celebration (cheer + confetti + fanfare) or a friendly wave. */
  win: boolean;
  size?: number;
}

/** End-of-lesson moment. The fanfare waits for the voice to finish so they never overlap. */
export function Celebrate({ win, size = 128 }: Props) {
  const play = useSound();
  const { status } = useTts();
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (played || status !== 'idle') return;
    setPlayed(true);
    play(win ? 'complete' : 'pop');
  }, [played, status, win, play]);

  return (
    <div className="celebrate">
      {win && <Confetti />}
      <Mascot mood={win ? 'cheer' : 'wave'} size={size} />
    </div>
  );
}
