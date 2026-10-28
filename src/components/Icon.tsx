/** Drawn stroke icons (one family, ink colour from the text). Always decorative: the label carries the meaning. */
const PATHS = {
  mic: 'M12 3.5a3 3 0 0 0-3 3v5.5a3 3 0 0 0 6 0V6.5a3 3 0 0 0-3-3ZM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7',
  headphones: 'M4.5 15.5v-3a7.5 7.5 0 0 1 15 0v3M4.5 15a2 2 0 0 1 2-2h1v7h-1a2 2 0 0 1-2-2ZM19.5 15a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2Z',
  repeat: 'M17 3l3 3-3 3M4 11.5V10a4 4 0 0 1 4-4h12M7 21l-3-3 3-3M20 12.5V14a4 4 0 0 1-4 4H4',
  speaker: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4ZM15.5 9.2a4 4 0 0 1 0 5.6M18.2 6.5a7.8 7.8 0 0 1 0 11',
  mute: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4ZM16 9.5l5 5M21 9.5l-5 5',
  stop: 'M7.5 7.5h9v9h-9Z',
  play: 'M8 5.5v13l10.5-6.5Z',
  pause: 'M9 6v12M15 6v12',
  keyboard: 'M3.5 6.5h17v11h-17ZM7.5 10h.01M10.5 10h.01M13.5 10h.01M16.5 10h.01M8 14h8',
  bulb: 'M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.5 1.1-2.1A6 6 0 0 0 12 3Z',
  chat: 'M4.5 5.5h15v10h-9l-4.5 4v-4h-1.5Z',
  sparkle: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9ZM18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z',
  check: 'M4.5 12.5l4.6 4.6L19.5 6.8',
  cross: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  retry: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4v4.5H9',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
