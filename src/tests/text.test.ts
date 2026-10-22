import { describe, expect, it } from 'vitest';
import { compareTranscript, containsPhrase, normalize } from '../utils/text';

describe('normalize', () => {
  it('ignores case, punctuation and extra spaces', () => {
    expect(normalize('  Hello,   WORLD!! ')).toBe('hello world');
  });
  it('treats curly apostrophes and contractions the same', () => {
    expect(normalize('I’d like a latte.')).toBe(normalize("I would like a latte"));
    expect(normalize('I am from Hanoi')).toBe("i'm from hanoi");
  });
  it('maps small digits to words', () => {
    expect(normalize('A table for 3')).toBe('a table for three');
  });
});

describe('containsPhrase', () => {
  it('matches whole words only', () => {
    expect(containsPhrase("I'd like a hot chocolate", 'hot chocolate')).toBe(true);
    expect(containsPhrase('I like teaching', 'tea')).toBe(false);
  });
});

describe('compareTranscript', () => {
  it('is exact when only punctuation and case differ', () => {
    const r = compareTranscript("No, that's all. Thank you.", "no that's all thank you");
    expect(r.exact).toBe(true);
    expect(r.matchRatio).toBe(1);
  });
  it('marks missing words and extra words', () => {
    const r = compareTranscript('I would like a latte please', 'I would like latte coffee');
    expect(r.words.filter((w) => w.status === 'missing').map((w) => w.display)).toEqual(['a', 'please']);
    expect(r.extra).toEqual(['coffee']);
    expect(r.exact).toBe(false);
  });
  it('keeps the original wording for display when contractions are collapsed', () => {
    const r = compareTranscript('I am thirteen years old.', "I'm thirteen years old");
    expect(r.words[0]).toEqual({ display: 'I am', status: 'match' });
    expect(r.exact).toBe(true);
  });
  it('returns 0 for empty speech', () => {
    expect(compareTranscript('Hello there', '').matchRatio).toBe(0);
  });
});
