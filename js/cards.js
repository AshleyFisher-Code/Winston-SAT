// Turns a saved spec into a card. A card is a list of steps; each step must be done
// right (with a redo after a miss) before the next step appears. That is the gate.
import { englishCard } from './english.js';
import { makeMath, MATH_SKILLS, parseNum } from './math.js';
import { TEACH, EN_SKILLS } from './content/rules.js';
import { fmt } from './util.js';

export const ALL_SKILLS = [...EN_SKILLS.map(s => ({ ...s, subject: 'en' })), ...MATH_SKILLS.map(s => ({ ...s, subject: 'math', goal: 'math' }))];
export const SKILL = Object.fromEntries(ALL_SKILLS.map(s => [s.id, s]));
export const DESMOS_URL = 'https://www.desmos.com/calculator';

function mathCard(sp) {
  const q = makeMath(sp.sub, sp.seed);
  const sk = SKILL[sp.sub];
  const card = { spec: sp, subject: 'math', skill: sp.sub, mode: sp.m, steps: [], stem: { kind: 'math', text: q.stem }, desmos: sp.m !== 'rule' };
  card.steps.push({ tag: 'ask', title: 'Ask first', instr: 'Write the ask on your paper (1–2 words). Then tap it.',
    fields: [{ label: 'The question asks for', choices: q.ask.opts, answer: q.ask.correct, long: true }],
    why: () => `The last line asks for ${q.ask.correct}.` });
  if (sp.m !== 'rule') card.steps.push({ tag: 'desmos', title: 'Then Desmos', instr: 'Type it into Desmos now, even if it looks easy. Then tap what you typed.',
    fields: [{ label: 'Type into Desmos', choices: q.eq.opts, answer: q.eq.correct, long: true, mono: true }],
    why: () => `Type ${q.eq.correct}` });
  if (sp.m === 'full') {
    const f = q.grid
      ? { label: 'Your answer', typed: true, answer: fmt(q.ans.correct), check: v => { const n = parseNum(v); return n != null && Math.abs(n - q.ans.correct) < 1e-6; }, ph: 'type a number' }
      : { label: 'Answer', choices: q.ans.opts.map(fmt), answer: fmt(q.ans.correct) };
    card.steps.push({ tag: 'answer', title: 'Answer', instr: null, askReminder: q.ask.correct, fields: [f], why: () => q.why });
  }
  card.chip = sp.m === 'rule' ? 'Ask first' : sp.m === 'decode' ? 'Ask + Desmos' : 'Full question';
  card.summary = `${sk.name}${sp.m === 'rule' ? ' · ask' : sp.m === 'decode' ? ' · ask + Desmos' : ''}`;
  return card;
}
function teachCard(sp) {
  const t = TEACH[sp.skill];
  return { spec: sp, teach: true, skill: sp.skill, subject: SKILL[sp.skill].subject, mode: 'teach', chip: 'Step by step', title: t.title, teachSteps: t.steps, steps: [], summary: 'Teaching: ' + SKILL[sp.skill].name };
}
export function cardFromSpec(sp) {
  if (sp.t === 'teach') return teachCard(sp);
  if (sp.s === 'en') return englishCard(sp);
  if (sp.s === 'm') return mathCard(sp);
  throw new Error('bad spec');
}
// Checks one step. Returns ok per field.
export function checkStep(step, vals) {
  return step.fields.map((f, i) => (f.typed ? f.check(vals[i]) : vals[i] === f.answer));
}
