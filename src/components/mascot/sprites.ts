// Pixel art for Quạc, the app's mascot: a yellow duck wearing the app's blue headset.
// Each sprite is a grid of palette letters ('.' = transparent). Edit the letters to redraw.

export const PALETTE: Record<string, string> = {
  k: '#3b2412', // outline
  Y: '#ffcd3c', // body
  y: '#eaa513', // shade
  L: '#fff2a8', // highlight, belly
  O: '#ff9124', // beak, feet
  o: '#c8610c', // beak edge
  e: '#1b2333', // eyes
  W: '#ffffff',
  B: '#2457c5', // headset (Coach Blue)
  b: '#173b8f', // headset shade
  C: '#7aa2ff', // headset light
  P: '#ff9fb0', // blush
  m: '#8f2a1e', // open mouth
};

/** 32×32 frames. */
export const FRAMES = {
  idle: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYeeYYYYYYeeYYYYkCCBk..',
    '..kCBBkYYYeWeeYYYYeWeeYYYkCBBk..',
    '..kBBBkYYYeeeeYYYYeeeeYYYkBBBk..',
    '..kBBbkYYYYeeYYYYYYeeYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '...kkkYYYYYoOOOOOOOOoYYyyykkk...',
    '......kYYYYooooooooooYyyykb.....',
    '.......kYYYYoOOOOOOoCbyykb......',
    '........kYYYYooooooYbbbbb.......',
    '.........kYYYYyyyyyyyyk.........',
    '..........kYYyyyyyyYYk..........',
    '......kk.kYYYYYYYYYYYYk.kk......',
    '.....kYykYYYYYYYYYYYYYYkYyk.....',
    '.....kYykYYYYLLLLLLYYYYkYyk.....',
    '.....kyykYYYLLLLLLLLYYYkyyk.....',
    '......kykYYYLLLLLLLLYYykyk......',
    '.......kkYYYLLLLLLLLYyykk.......',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  blink: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYYYYYYYYYYYYYYYkCBBk..',
    '..kBBBkYYYeeeeYYYYeeeeYYYkBBBk..',
    '..kBBbkYYYYYYYYYYYYYYYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '...kkkYYYYYoOOOOOOOOoYYyyykkk...',
    '......kYYYYooooooooooYyyykb.....',
    '.......kYYYYoOOOOOOoCbyykb......',
    '........kYYYYooooooYbbbbb.......',
    '.........kYYYYyyyyyyyyk.........',
    '..........kYYyyyyyyYYk..........',
    '......kk.kYYYYYYYYYYYYk.kk......',
    '.....kYykYYYYYYYYYYYYYYkYyk.....',
    '.....kYykYYYYLLLLLLYYYYkYyk.....',
    '.....kyykYYYLLLLLLLLYYYkyyk.....',
    '......kykYYYLLLLLLLLYYykyk......',
    '.......kkYYYLLLLLLLLYyykk.......',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  happy: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYeeYYYYYYeeYYYYkCBBk..',
    '..kBBBkYYYeYYeYYYYeYYeYYYkBBBk..',
    '..kBBbkYYYYYYYYYYYYYYYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '...kkkYYYYYoOOOOOOOOoYYyyykkk...',
    '......kYYYYoommmmmmooYyyykb.....',
    '.......kYYYYommPPmmoCbyykb......',
    '....kk..kYYYoOOOOOOobbbbb.kk....',
    '...kYYk..kYYYooooooyyyk..kYYk...',
    '...kYYyk..kYYyyyyyyYYk..kYYyk...',
    '....kyyykkYYYYYYYYYYYYkkyyyk....',
    '.....kkkkYYYYYYYYYYYYYYkkkk.....',
    '........kYYYYLLLLLLYYYYk........',
    '........kYYYLLLLLLLLYYYk........',
    '........kYYYLLLLLLLLYYyk........',
    '........kYYYLLLLLLLLYyyk........',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  cheer: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYeeYYYYYYeeYYYYkCBBk..',
    '..kBBBkYYYeYYeYYYYeYYeYYYkBBBk..',
    '..kBBbkYYYYYYYYYYYYYYYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '.kkkkkYYYYYoOOOOOOOOoYYyyykkkkk.',
    'kYYk..kYYYYoommmmmmooYyyykb.kYYk',
    'kYYyk..kYYYYommPPmmoCbyykb.kyYYk',
    '.kYyyk..kYYYoOOOOOOobbbbb.kyyYk.',
    '..kyyyk..kYYYooooooyyyk..kyyyk..',
    '....kyyk..kYYyyyyyyYYk..kyyk....',
    '......kk.kYYYYYYYYYYYYk.kk......',
    '........kYYYYYYYYYYYYYYk........',
    '........kYYYYLLLLLLYYYYk........',
    '........kYYYLLLLLLLLYYYk........',
    '........kYYYLLLLLLLLYYyk........',
    '........kYYYLLLLLLLLYyyk........',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  confused: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYeeYYYYYYeeYYYYkCCBk..',
    '..kCBBkYYYeWeeYYYYeWWeYYYkCBBk..',
    '..kBBBkYYYeWWeYYYYeeWeYYYkBBBk..',
    '..kBBbkYYYYeeYYYYYYeeYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '.kYkkkYYYYYoOOOOOOOOoYYyyykkk...',
    '.kYYYYkYYYYooooooooooYyyykb.....',
    '..kyyyykYYYYoOOOOOOoCbyykb......',
    '...kyyykkYYYYooooooYbbbbb.......',
    '.....kkk.kYYYYyyyyyyyyk.........',
    '..........kYYyyyyyyYYk..........',
    '.........kYYYYYYYYYYYYk.kk......',
    '........kYYYYYYYYYYYYYYkYyk.....',
    '........kYYYYLLLLLLYYYYkYyk.....',
    '........kYYYLLLLLLLLYYYkyyk.....',
    '........kYYYLLLLLLLLYYykyk......',
    '........kYYYLLLLLLLLYyykk.......',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  listen: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYYYYYYYYYYYYYYYkCBBk..',
    '..kBBBkYYYeYYeYYYYeYYeYYYkBBBk..',
    '..kBBbkYYYYeeYYYYYYeeYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '...kkkYYYYYoOOOOOOOOoYYyyykkk...',
    '......kYYYYooooooooooYyyykbkk...',
    '.......kYYYYoOOOOOOoCbyykbkYYk..',
    '........kYYYYooooooYbbbbbkYYyk..',
    '.........kYYYYyyyyyyyyk.kYyyk...',
    '..........kYYyyyyyyYYk.kyyk.....',
    '......kk.kYYYYYYYYYYYYkkk.......',
    '.....kYykYYYYYYYYYYYYYYk........',
    '.....kYykYYYYLLLLLLYYYYk........',
    '.....kyykYYYLLLLLLLLYYYk........',
    '......kykYYYLLLLLLLLYYyk........',
    '.......kkYYYLLLLLLLLYyyk........',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  wave1: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYeeYYYYYYeeYYYYkCBBk..',
    '..kBBBkYYYeYYeYYYYeYYeYYYkBBBk..',
    '..kBBbkYYYYYYYYYYYYYYYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '.kkbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '.kYkkkYYYYYoOOOOOOOOoYYyyykkk...',
    '..kYyykYYYYoommmmmmooYyyykb.....',
    '...kyyykYYYYommPPmmoCbyykb......',
    '.....kykkYYYoOOOOOOobbbbb.......',
    '......kk.kYYYooooooyyyk.........',
    '..........kYYyyyyyyYYk..........',
    '.........kYYYYYYYYYYYYk.kk......',
    '........kYYYYYYYYYYYYYYkYyk.....',
    '........kYYYYLLLLLLYYYYkYyk.....',
    '........kYYYLLLLLLLLYYYkyyk.....',
    '........kYYYLLLLLLLLYYykyk......',
    '........kYYYLLLLLLLLYyykk.......',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
  wave2: [
    '................................',
    '.............kkkkkk.............',
    '...........kkBCCBBBkk...........',
    '.........kkBBYYYYYYBBkk.........',
    '........kBBYYYLLLLYYYBBk........',
    '.......kBYYLLLLLYYYYYYYBk.......',
    '......kBYYLLLLYYYYYYYYYYBk......',
    '...kkkBYYLLLYYYYYYYYYYYYYBkkk...',
    '..kCCBkYLLYYYYYYYYYYYYYYYkCCBk..',
    '..kCBBkYYYYeeYYYYYYeeYYYYkCBBk..',
    '..kBBBkYYYeYYeYYYYeYYeYYYkBBBk..',
    '..kBBbkYYYYYYYYYYYYYYYYYYkBBbk..',
    '..kBbbkPPYYYooooooooYYYPPkBbbk..',
    '..kbbbkYYYYoOOoOOoOOoYYYykbbbk..',
    '...kkkYYYYYoOOOOOOOOoYYyyykkk...',
    'kk....kYYYYoommmmmmooYyyykb.....',
    'kYYkk..kYYYYommPPmmoCbyykb......',
    'kYYYyk..kYYYoOOOOOOobbbbb.......',
    '.kyyyyk..kYYYooooooyyyk.........',
    '...kkkk...kYYyyyyyyYYk..........',
    '.........kYYYYYYYYYYYYk.kk......',
    '........kYYYYYYYYYYYYYYkYyk.....',
    '........kYYYYLLLLLLYYYYkYyk.....',
    '........kYYYLLLLLLLLYYYkyyk.....',
    '........kYYYLLLLLLLLYYykyk......',
    '........kYYYLLLLLLLLYyykk.......',
    '.........kYYLLLLLLLLyyk.........',
    '..........kYYYLLLLyyyk..........',
    '...........kkyyyyyykk...........',
    '..........kOOOkkkkOOOk..........',
    '.........kOOOOk..kOOOOk.........',
    '..........kkkk....kkkk..........',
  ],
} satisfies Record<string, string[]>;

export type FrameName = keyof typeof FRAMES;

export const QUESTION = [
  '..kkkkk..',
  '.kWWWWWk.',
  'kWWkkkWWk',
  '.kk..kWWk',
  '....kWWk.',
  '...kWWk..',
  '...kWk...',
  '...kkk...',
  '...kWk...',
  '...kkk...',
];

export const SPARKLE = ['..O..', '..Y..', 'OYWYO', '..Y..', '..O..'];

/** Two frames: the flame tip sways. */
export const FLAME = [
  ['....k....', '...kOk...', '...kOOk..', '..kOOOk..', '..kOYOOk.', '.kOOYYOk.', '.kOYYYOOk', 'kOOYLYYOk', 'kOYLLLYOk', '.kOYLYOk.', '..kkkkk..'],
  ['....k....', '...kOk...', '..kOOk...', '..kOOOk..', '.kOOYOk..', '.kOYYOOk.', 'kOOYYYOk.', 'kOYYLYOOk', 'kOYLLLYOk', '.kOYLYOk.', '..kkkkk..'],
];

/** Draws frames side by side as one SVG sprite sheet (one rect per same-colour run). */
export function toSvg(frames: string[][]): string {
  const w = frames[0][0].length;
  const h = frames[0].length;
  let rects = '';
  frames.forEach((rows, f) =>
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; ) {
        const c = row[x];
        let n = 1;
        while (row[x + n] === c) n++;
        if (c !== '.') rects += `<rect x="${f * w + x}" y="${y}" width="${n}" height="1" fill="${PALETTE[c]}"/>`;
        x += n;
      }
    }),
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w * frames.length} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
}

const cache = new Map<string, string>();

/** CSS url() for a sprite sheet, built once and cached. */
export function sheetUrl(key: string, frames: string[][]): string {
  let url = cache.get(key);
  if (!url) {
    url = `url("data:image/svg+xml,${encodeURIComponent(toSvg(frames))}")`;
    cache.set(key, url);
  }
  return url;
}
