import { useTts } from '../hooks/useTts';

interface Props {
  text: string;
  label?: string;
  className?: string;
}

/** Reads a text aloud with the browser voice. Click again to stop. */
export function SpeakButton({ text, label = 'Nghe', className = '' }: Props) {
  const t = useTts();
  if (!t.supported) {
    return (
      <button type="button" className={`btn btn-ghost btn-sm ${className}`} disabled title="Trình duyệt không hỗ trợ đọc văn bản">
        🔇 <span>{label}</span>
      </button>
    );
  }
  const on = t.active();
  return (
    <button
      type="button"
      className={`btn btn-ghost btn-sm ${on ? 'is-active' : ''} ${className}`}
      aria-label={on ? 'Dừng đọc' : `${label}: ${text}`}
      onClick={() => (on ? t.stop() : t.speak(text))}
    >
      <span aria-hidden="true">{on ? '⏹' : '🔊'}</span> <span>{on ? 'Dừng' : label}</span>
    </button>
  );
}
