import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { FLAME, FRAMES, QUESTION, SPARKLE, sheetUrl, type FrameName } from './sprites';

export type MascotMood = 'idle' | 'happy' | 'cheer' | 'confused' | 'listen' | 'wave' | 'bow';

// Frames per mood; two-frame moods alternate (blink, wave) through CSS.
const SHEETS: Record<MascotMood, FrameName[]> = {
  idle: ['idle', 'blink'],
  happy: ['happy'],
  cheer: ['cheer'],
  confused: ['confused'],
  listen: ['listen'],
  wave: ['wave1', 'wave2'],
  bow: ['happy'],
};

const sheet = (mood: MascotMood) => sheetUrl(mood, SHEETS[mood].map((f) => FRAMES[f]));

/** Looping animations pause while the mascot is scrolled out of view. */
function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

interface MascotProps {
  mood?: MascotMood;
  /** Pixel size; multiples of 32 keep the pixels square. */
  size?: number;
  /** Change it to replay the reaction (e.g. two right answers in a row). */
  bump?: number | string;
}

/** Quạc, the pixel duck. Decorative: the text next to it always carries the meaning. */
export function Mascot({ mood = 'idle', size = 96, bump = 0 }: MascotProps) {
  // "wave" and "bow" play a few times, then Quạc settles back to idle
  const [shown, setShown] = useState(mood);
  useEffect(() => setShown(mood), [mood, bump]);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <div
      ref={ref}
      className={`mascot mascot-${shown}${onScreen ? '' : ' is-paused'}`}
      style={{ '--size': `${size}px`, '--frames': SHEETS[shown].length } as CSSProperties}
      aria-hidden="true"
      onAnimationEnd={(e) => (e.animationName === 'mascot-wave' || e.animationName === 'mascot-bow') && setShown('idle')}
    >
      <span key={`${shown}-${bump}`} className="mascot-body" style={{ backgroundImage: sheet(shown) }} />
      {shown === 'confused' && <span className="mascot-question" style={{ backgroundImage: sheetUrl('question', [QUESTION]) }} />}
      {(shown === 'happy' || shown === 'cheer') &&
        [1, 2, 3].map((i) => (
          <span key={`${bump}-${i}`} className={`mascot-spark spark-${i}`} style={{ backgroundImage: sheetUrl('sparkle', [SPARKLE]) }} />
        ))}
      {shown === 'listen' && (
        <span className="mascot-waves">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}

interface SaysProps extends MascotProps {
  children: ReactNode;
  tone?: 'ok' | 'warn';
  /** Announce what Quạc says to screen readers (use where nothing else announces the result). */
  live?: boolean;
}

/** Quạc with a speech bubble, like a coach standing next to the exercise. */
export function MascotSays({ children, tone, live, ...mascot }: SaysProps) {
  return (
    <div className="coach" role={live ? 'status' : undefined}>
      <Mascot size={72} {...mascot} />
      <div key={`${mascot.mood}-${mascot.bump}`} className={`coach-bubble${tone ? ` is-${tone}` : ''}`}>
        {children}
      </div>
    </div>
  );
}

/** Small pixel flame for the daily streak. */
export function Flame() {
  return <span className="flame" aria-hidden="true" style={{ backgroundImage: sheetUrl('flame', FLAME) }} />;
}
