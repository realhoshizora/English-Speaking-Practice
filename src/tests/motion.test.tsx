import { act, render, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressProvider } from '../app/ProgressContext';
import { LessonBar } from '../components/LessonBar';
import { Mascot } from '../components/mascot/Mascot';
import { FRAMES, toSvg } from '../components/mascot/sprites';
import { useSound } from '../hooks/useSound';
import { playSound, SOUNDS } from '../services/sound/sfx';
import { SpeechRecognitionService } from '../services/speech/SpeechRecognitionService';
import { STORAGE_KEY } from '../services/storage/progressStorage';
import { FakeRecognition } from './fakes';

// Minimal Web Audio double: records the oscillators each effect schedules.
const oscillators: { freq: number }[] = [];
class FakeAudioContext {
  currentTime = 0;
  state = 'running';
  destination = {};
  resume = () => Promise.resolve();
  createOscillator() {
    const o = {
      type: '',
      frequency: { setValueAtTime: (f: number) => oscillators.push({ freq: f }) },
      connect: (n: unknown) => n,
      start: vi.fn(),
      stop: vi.fn(),
    };
    return o;
  }
  createGain() {
    return { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: (n: unknown) => n };
  }
}

afterEach(() => {
  oscillators.length = 0;
});

describe('sprites', () => {
  it('every frame is a full 32×32 grid using known colours', () => {
    for (const [name, rows] of Object.entries(FRAMES)) {
      expect(rows, name).toHaveLength(32);
      for (const r of rows) expect(r, name).toMatch(/^[.kYyLOoeWBbCPm]{32}$/);
    }
    expect(toSvg([FRAMES.idle])).toContain('viewBox="0 0 32 32"');
  });
});

describe('sound effects', () => {
  it('stay silent without Web Audio, then play one note per step', () => {
    expect(playSound('correct')).toBe(false);
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    expect(playSound('complete')).toBe(true);
    expect(oscillators.map((o) => o.freq)).toEqual(SOUNDS.complete.map(([f]) => f));
  });

  it('follow the setting and never play while the microphone is listening', () => {
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    const wrapper = ({ children }: { children: ReactNode }) => <ProgressProvider storage={localStorage}>{children}</ProgressProvider>;

    const on = renderHook(() => useSound(), { wrapper });
    act(() => on.result.current('correct'));
    expect(oscillators).toHaveLength(SOUNDS.correct.length);

    oscillators.length = 0;
    const mic = new SpeechRecognitionService(() => FakeRecognition);
    mic.start();
    act(() => on.result.current('correct'));
    expect(oscillators).toHaveLength(0);
    mic.abort();
    on.unmount();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records: [], settings: { soundEffects: false } }));
    const off = renderHook(() => useSound(), { wrapper });
    act(() => off.result.current('correct'));
    expect(oscillators).toHaveLength(0);
  });
});

describe('Mascot', () => {
  it('is decorative and shows the extras that belong to each mood', () => {
    const { container, rerender } = render(<Mascot mood="confused" />);
    const el = container.querySelector('.mascot')!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('mascot-confused');
    expect(container.querySelector('.mascot-question')).not.toBeNull();

    rerender(<Mascot mood="happy" />);
    expect(container.querySelectorAll('.mascot-spark')).toHaveLength(3);
    rerender(<Mascot mood="listen" />);
    expect(container.querySelector('.mascot-waves')).not.toBeNull();
  });
});

describe('LessonBar', () => {
  it('never moves backwards', () => {
    const { rerender, getByRole } = render(<LessonBar value={0.5} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    rerender(<LessonBar value={0.4} />); // a branch made the lesson longer
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    rerender(<LessonBar value={1} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
