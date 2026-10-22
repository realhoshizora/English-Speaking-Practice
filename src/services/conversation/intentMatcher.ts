// Rule-based answer checking: key phrases per intent, declared in scenario data.
// This is keyword matching, not real language understanding.
import type { ResponseOption } from '../../types';
import { containsPhrase, normalize } from '../../utils/text';

/** Returns the first response option whose key phrases appear in the answer. Order in data = priority. */
export function matchResponse(options: ResponseOption[], answer: string): ResponseOption | null {
  if (!normalize(answer)) return null;
  return options.find((o) => o.anyOf.some((p) => p === '*' || containsPhrase(answer, p))) ?? null;
}

// Common A1–B1 mistakes (often by Vietnamese learners). Checked on the normalised answer,
// where "I am" is already collapsed to "i'm", "I have" to "i've", "where is" to "where's".
const TIPS: [RegExp, string][] = [
  [/\bi want\b/, '“I want…” hơi thẳng. Dùng “I\'d like…” sẽ lịch sự hơn.'],
  [/\bgive me\b/, 'Thay “Give me…” bằng “Can I have…, please?” để lịch sự hơn.'],
  [/\bi'm agree\b/, 'Nói “I agree”, không cần “am”.'],
  [/\b(i|you|we|they) (like|love|enjoy|hate) (play|read|watch|swim|cook|listen|draw|sing|dance|go|ride|run)\b/, 'Sau “like / love / enjoy” thường dùng V-ing: “I like playing…”.'],
  [/\bvery like\b/, 'Nói “I really like…” thay vì “very like”.'],
  [/\b(he|she|it) don't\b/, 'Với he / she / it dùng “doesn\'t”: “She doesn\'t…”.'],
  [/\bi've \w+ years old\b/, 'Nói tuổi bằng “be”: “I\'m 13 years old.”'],
  [/\bhow much it cost\b/, 'Câu hỏi đúng: “How much does it cost?”'],
  [/\bwhere's the \w+ is\b/, 'Bỏ “is” thứ hai: “Where is the …?”'],
];

export function languageTips(answer: string): string[] {
  const n = normalize(answer);
  return TIPS.filter(([re]) => re.test(n)).map(([, tip]) => tip);
}
