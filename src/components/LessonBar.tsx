import { useRef, type CSSProperties } from 'react';

interface Props {
  /** 0..1 */
  value: number;
  label?: string;
}

/** Lesson progress bar. It never moves backwards, even if a branch makes the lesson a turn longer. */
export function LessonBar({ value, label }: Props) {
  const max = useRef(0);
  max.current = Math.min(1, Math.max(max.current, value));
  const pct = Math.round(max.current * 100);
  return (
    <div className="lesson-bar">
      <div className="lesson-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Tiến độ bài">
        <span style={{ width: `${pct}%` }} />
      </div>
      {label && <span className="lesson-count">{label}</span>}
    </div>
  );
}

/** A number that counts up when it appears (CSS only). The real value stays in the text for screen readers and tests. */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span className="count-up" aria-hidden="true" data-suffix={suffix} style={{ '--to': value } as CSSProperties} />
    </>
  );
}
