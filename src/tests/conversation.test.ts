import { describe, expect, it } from 'vitest';
import { getScenario, scenarios } from '../data/scenarios';
import { languageTips, matchResponse } from '../services/conversation/intentMatcher';
import { ScriptedConversationSession } from '../services/conversation/ScriptedConversationProvider';

const coffee = getScenario('ordering-coffee')!;
const node = (id: string) => coffee.roleplay.nodes.find((n) => n.id === id)!;

describe('matchResponse (intent matching)', () => {
  it('accepts different reasonable ways to order a drink', () => {
    for (const answer of ["I'd like a coffee", 'Can I have a tea?', 'A glass of water, please', 'I would like an orange juice']) {
      expect(matchResponse(node('order').responses, answer)?.next).toBe('size');
    }
  });
  it('returns null when no intent matches', () => {
    expect(matchResponse(node('size').responses, 'I like dogs')).toBeNull();
    expect(matchResponse(node('size').responses, '   ')).toBeNull();
  });
  it('picks the branch by intent', () => {
    expect(matchResponse(node('else').responses, "No, that's all")?.intent).toBe('no_more');
    expect(matchResponse(node('else').responses, 'Yes, can I have a muffin?')?.intent).toBe('add_food');
  });
});

describe('languageTips', () => {
  it('suggests polite forms and V-ing after like', () => {
    expect(languageTips('I want a latte').join()).toContain("I'd like");
    expect(languageTips('I like play football').join()).toContain('V-ing');
    expect(languageTips('I am agree').join()).toContain('I agree');
    expect(languageTips("I'd like a latte, please")).toEqual([]);
  });
});

describe('ScriptedConversationSession', () => {
  it('walks the main path, branches and finishes with a summary', async () => {
    const s = new ScriptedConversationSession(coffee);
    expect(s.current()?.text).toContain('What can I get');

    let fb = await s.respond('I like dogs');
    expect(fb.accepted).toBe(false);
    expect(fb.message).toContain('Thử lại');
    fb = await s.respond("I'd like a latte, please");
    expect(fb.accepted).toBe(true);
    expect((await s.advance())?.text).toContain('What size');

    await s.respond('A large one');
    await s.advance();
    await s.respond('To go, please');
    await s.advance();
    // Branch: ordering food goes to the "food" node
    await s.respond('Yes, a muffin please');
    expect((await s.advance())?.text).toContain('chocolate muffins and blueberry muffins');
    await s.respond('The chocolate one');
    await s.advance();
    await s.respond('Can I pay by card?');
    const end = await s.advance();
    expect(end?.final).toBe(true);
    expect(end?.text).toContain('tap your card');
    expect(s.isFinished()).toBe(true);

    const sum = await s.summary();
    expect(sum.turns).toBe(6);
    expect(sum.accepted).toBe(6);
    expect(sum.score).toBe(1);
    expect(sum.review).toEqual(["I'd like a latte, please."]); // needed two attempts
  });

  it('skip follows the main path and counts as not accepted', async () => {
    const s = new ScriptedConversationSession(coffee);
    s.useHint();
    const next = await s.skip();
    expect(next?.text).toContain('What size');
    const sum = await s.summary();
    expect(sum).toMatchObject({ turns: 2, accepted: 0, skipped: 1, hintsUsed: 1 });
  });

  it('only suggests a full sentence when the answer is shorter than the model answer', async () => {
    const s = new ScriptedConversationSession(coffee);
    expect((await s.respond('Latte')).tips.join()).toContain('câu đầy đủ');
    for (const a of ['A medium', 'To go', 'No']) {
      await s.advance();
      await s.respond(a);
    }
    await s.advance(); // "That's four dollars" — model answer is "Here you are."
    expect((await s.respond('Here you are')).tips).toEqual([]);
  });

  it('does not advance before an answer is accepted', async () => {
    const s = new ScriptedConversationSession(coffee);
    expect((await s.advance())?.text).toContain('What can I get');
  });
});

describe('scenario data', () => {
  it('has at least 10 complete scenarios', () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(10);
    for (const s of scenarios) {
      expect(s.vocabulary.length, s.id).toBeGreaterThanOrEqual(6);
      expect(s.phrases.length, s.id).toBeGreaterThanOrEqual(4);
      expect(s.dialogue.length, s.id).toBeGreaterThanOrEqual(8);
      expect(s.tasks.length, s.id).toBeGreaterThanOrEqual(3);
      expect(s.listening.questions.length, s.id).toBeGreaterThanOrEqual(4);
      expect(s.roleplay.nodes.length, s.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('has valid role-play graphs where each model answer is accepted', () => {
    for (const s of scenarios) {
      const ids = new Set(s.roleplay.nodes.map((n) => n.id));
      expect(ids.has(s.roleplay.start), s.id).toBe(true);
      for (const n of s.roleplay.nodes) {
        expect(n.responses.length, `${s.id}/${n.id}`).toBeGreaterThan(0);
        for (const r of n.responses) if (r.next) expect(ids.has(r.next), `${s.id}/${n.id} → ${r.next}`).toBe(true);
        expect(matchResponse(n.responses, n.example), `${s.id}/${n.id} example`).not.toBeNull();
      }
    }
  });

  it('has valid listening questions', () => {
    for (const s of scenarios) {
      for (const q of s.listening.questions) {
        if (q.type === 'mcq') expect(q.options[q.answer], s.id).toBeDefined();
        else expect(q.sentence, s.id).toContain('___');
      }
    }
  });
});
