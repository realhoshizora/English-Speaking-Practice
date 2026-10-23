// Short 8-bit sound effects synthesised with the Web Audio API: no audio files to download.
type Note = readonly [freq: number, at: number, dur: number]; // Hz, seconds, seconds

export const SOUNDS = {
  correct: [[784, 0, 0.09], [1175, 0.08, 0.2]], // G5 → D6, a bright "ting"
  retry: [[392, 0, 0.1], [311, 0.09, 0.18]], // soft step down, not a buzzer
  complete: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.34]], // C major arpeggio
  pop: [[1047, 0, 0.05]],
} satisfies Record<string, readonly Note[]>;

export type SoundName = keyof typeof SOUNDS;

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null; // audio blocked or unavailable: effects are optional
  }
}

/** Plays one effect. Returns false when the browser has no Web Audio. */
export function playSound(name: SoundName, volume = 0.05): boolean {
  const a = audio();
  if (!a) return false;
  const t0 = a.currentTime + 0.02;
  for (const [freq, at, dur] of SOUNDS[name]) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t0 + at);
    // quick attack and exponential release so notes never click
    gain.gain.setValueAtTime(0.0001, t0 + at);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
    osc.connect(gain).connect(a.destination);
    osc.start(t0 + at);
    osc.stop(t0 + at + dur + 0.03);
  }
  return true;
}
