// Text normalisation and transcript comparison. Pure functions, no browser APIs.

export interface Token {
  key: string; // normalised form used for comparing
  display: string; // original text shown to the learner
}

const NUMBERS: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
  '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven',
  '12': 'twelve', '15': 'fifteen', '20': 'twenty', '30': 'thirty',
};

// Two-word forms that mean the same as a contraction. Both sides are collapsed, so "I am" matches "I'm".
const CONTRACTIONS: Record<string, string> = {
  'i am': "i'm", 'i would': "i'd", 'i will': "i'll", 'i have': "i've",
  'you are': "you're", 'we are': "we're", 'they are': "they're",
  'it is': "it's", 'that is': "that's", 'what is': "what's", 'where is': "where's",
  'there is': "there's", 'he is': "he's", 'she is': "she's", 'let us': "let's",
  'do not': "don't", 'does not': "doesn't", 'is not': "isn't", 'are not': "aren't",
  'can not': "can't", 'will not': "won't", 'did not': "didn't",
};

function normalizeWord(word: string): string {
  const w = word
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/[^a-z0-9']/g, '')
    .replace(/^'+|'+$/g, '');
  if (w === 'cannot') return "can't";
  return NUMBERS[w] ?? w;
}

export function tokenize(text: string): Token[] {
  const raw = text
    .split(/[\s\-–—/]+/)
    .map((display) => ({ display, key: normalizeWord(display) }))
    .filter((t) => t.key !== '');
  const out: Token[] = [];
  for (let i = 0; i < raw.length; i++) {
    const pair = i + 1 < raw.length ? CONTRACTIONS[`${raw[i].key} ${raw[i + 1].key}`] : undefined;
    if (pair) {
      out.push({ key: pair, display: `${raw[i].display} ${raw[i + 1].display}` });
      i++;
    } else {
      out.push(raw[i]);
    }
  }
  return out;
}

/** Lowercase, no punctuation, contractions collapsed. Used for comparing and phrase matching. */
export function normalize(text: string): string {
  return tokenize(text)
    .map((t) => t.key)
    .join(' ');
}

/** True if `phrase` appears in `text` as whole words (both normalised). */
export function containsPhrase(text: string, phrase: string): boolean {
  const t = normalize(text);
  const p = normalize(phrase);
  if (!p) return false;
  return ` ${t} `.includes(` ${p} `);
}

export interface WordResult {
  display: string;
  status: 'match' | 'missing';
}

export interface Comparison {
  words: WordResult[]; // target words, marked matched or missing
  extra: string[]; // spoken words not in the target
  matchRatio: number; // matched target words / target words
  exact: boolean; // same words after normalisation (punctuation/case ignored)
}

/** Word-level comparison of a target sentence with a transcript, using longest common subsequence. */
export function compareTranscript(target: string, spoken: string): Comparison {
  const a = tokenize(target);
  const b = tokenize(spoken);
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i].key === b[j].key ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const words: WordResult[] = [];
  const extra: string[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i].key === b[j].key) {
      words.push({ display: a[i].display, status: 'match' });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      words.push({ display: a[i].display, status: 'missing' });
      i++;
    } else {
      extra.push(b[j].display);
      j++;
    }
  }
  for (; i < a.length; i++) words.push({ display: a[i].display, status: 'missing' });
  for (; j < b.length; j++) extra.push(b[j].display);
  const matched = words.filter((w) => w.status === 'match').length;
  return {
    words,
    extra,
    matchRatio: a.length ? matched / a.length : 0,
    exact: a.length > 0 && matched === a.length && extra.length === 0,
  };
}

export function wordCount(text: string): number {
  return tokenize(text).length;
}

/** Deterministic shuffle so tests and re-renders are stable. */
export function shuffle<T>(items: T[], seed = 1): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
