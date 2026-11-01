// Licensed question banks (e.g. Marks Education math). These are NOT in the public code: the
// parent uploads them once and they live in Firestore (sat_content), readable only by the two accounts.
import { fmt, rng, shuffleR, hash } from './util.js';
import { parseNum } from './math.js';

export const BANK_SKILLS = [
  { id: 'alg-lin', area: 'Algebra', name: 'Linear equations (one variable)' },
  { id: 'alg-func', area: 'Algebra', name: 'Linear functions and graphs' },
  { id: 'alg-sys', area: 'Algebra', name: 'Systems of linear equations' },
  { id: 'alg-ineq', area: 'Algebra', name: 'Linear inequalities' },
  { id: 'adv-quad', area: 'Advanced Math', name: 'Quadratics' },
  { id: 'adv-exp', area: 'Advanced Math', name: 'Exponential functions' },
  { id: 'adv-func', area: 'Advanced Math', name: 'Functions and nonlinear models' },
  { id: 'adv-poly', area: 'Advanced Math', name: 'Polynomials, rational and radical expressions' },
  { id: 'psd-pct', area: 'Problem Solving & Data', name: 'Percentages' },
  { id: 'psd-ratio', area: 'Problem Solving & Data', name: 'Ratios, rates and units' },
  { id: 'psd-stats', area: 'Problem Solving & Data', name: 'Statistics' },
  { id: 'psd-prob', area: 'Problem Solving & Data', name: 'Probability and two-way tables' },
  { id: 'psd-data', area: 'Problem Solving & Data', name: 'Graphs, tables and models' },
  { id: 'geo-area', area: 'Geometry & Trig', name: 'Area, volume, lines and angles' },
  { id: 'geo-tri', area: 'Geometry & Trig', name: 'Triangles' },
  { id: 'geo-circ', area: 'Geometry & Trig', name: 'Circles' },
  { id: 'geo-trig', area: 'Geometry & Trig', name: 'Trigonometry' },
];
const TAGS = new Set(BANK_SKILLS.map(s => s.id));

// All loaded bank items by id, and by skill.
export const BANK = {};
export let bankBySkill = {};
export function setBank(items) {
  for (const k of Object.keys(BANK)) delete BANK[k];
  bankBySkill = {};
  (items || []).forEach(it => { if (usable(it)) { BANK[it.id] = it; (bankBySkill[it.sk] = bankBySkill[it.sk] || []).push(it); } });
}
export const bankSize = () => Object.keys(BANK).length;
export const usable = it => it && TAGS.has(it.sk) && it.figOk !== false && it.keyOk !== false && it.stem && it.ask && it.ans != null;

// Checks an uploaded bank before it is saved. Returns { ok, items, problems[] }.
export function validateBank(data) {
  const items = Array.isArray(data) ? data : data && Array.isArray(data.items) ? data.items : null;
  if (!items) return { ok: false, items: [], problems: ['The file is not a question list.'] };
  const problems = [], ids = new Set();
  items.forEach((it, n) => {
    const where = it && it.id ? it.id : `item ${n + 1}`;
    if (!it || !it.id || ids.has(it.id)) problems.push(`${where}: missing or duplicate id`); else ids.add(it.id);
    if (!TAGS.has(it.sk)) problems.push(`${where}: unknown skill "${it.sk}"`);
    if (it.choices != null && (!Array.isArray(it.choices) || it.choices.length !== 4)) problems.push(`${where}: needs 4 choices`);
    if (it.choices != null && !/^[ABCD]$/.test(it.ans)) problems.push(`${where}: answer must be A-D`);
    if (it.choices == null && !(Array.isArray(it.ans) && it.ans.length && it.ans.some(a => parseNum(a) != null))) problems.push(`${where}: grid-in answer missing`);
    const okStep = s => s && Array.isArray(s.o) && s.o.length === 4 && new Set(s.o).size === 4 && s.a >= 0 && s.a < 4;
    if (!okStep(it.ask)) problems.push(`${where}: "ask" step is malformed`);
    if (it.eq != null && !okStep(it.eq)) problems.push(`${where}: Desmos step is malformed`);
  });
  return { ok: problems.length === 0, items, problems };
}

// Grid-in check: accept any listed form, or any number equal to one of them.
export function gridCheck(it, v) {
  const s = String(v || '').trim().replace(/\s+/g, '');
  if (!s) return false;
  if (it.ans.some(a => String(a).replace(/\s+/g, '') === s)) return true;
  const n = parseNum(s); if (n == null) return false;
  return it.ans.some(a => { const m = parseNum(a); return m != null && Math.abs(m - n) < 1e-4; });
}

// Step options are shuffled per showing (the source files often list the right one first).
const mix = (o, key, seed) => shuffleR(rng(hash(key) ^ (seed || 1)), o);
// Card for a bank item. Modes: rule = Ask first only; decode = Ask + Desmos; full = steps then the answer.
export function bankCard(sp) {
  const it = BANK[sp.id];
  if (!it) throw new Error('bank item not loaded ' + sp.id);
  const sk = BANK_SKILLS.find(s => s.id === it.sk);
  const card = { spec: sp, subject: 'math', skill: it.sk, mode: sp.m, itemId: it.id, steps: [], stem: { kind: 'math', text: it.stem, fig: it.fig || null }, desmos: sp.m !== 'rule', src: it.src };
  card.steps.push({ tag: 'ask', title: 'Ask first', instr: 'Write the ask on your paper (1–2 words). Then tap it.',
    fields: [{ label: 'The question asks for', choices: mix(it.ask.o, it.id + 'ask', sp.seed), answer: it.ask.o[it.ask.a], long: true }], why: () => `The question asks for ${it.ask.o[it.ask.a]}.` });
  if (sp.m !== 'rule' && it.eq) card.steps.push({ tag: 'desmos', title: 'Then Desmos', instr: 'Type it into Desmos now, even if it looks easy. Then tap what you typed.',
    fields: [{ label: 'Type into Desmos', choices: mix(it.eq.o, it.id + 'eq', sp.seed), answer: it.eq.o[it.eq.a], long: true, mono: true }], why: () => it.why || '' });
  if (sp.m === 'full') {
    const L = 'ABCD';
    const f = it.choices
      ? { label: 'Answer', choices: it.choices, answer: it.choices[L.indexOf(it.ans)], long: it.choices.some(c => String(c).length > 12) }
      : { label: 'Your answer', typed: true, answer: String(it.ans[0]), check: v => gridCheck(it, v), ph: 'type your answer' };
    card.steps.push({ tag: 'answer', title: 'Answer', instr: null, askReminder: it.ask.o[it.ask.a], fields: [f], why: () => it.why || '' });
  }
  card.chip = sp.m === 'rule' ? 'Ask first' : sp.m === 'decode' ? (it.eq ? 'Ask + Desmos' : 'Ask first') : 'Full question';
  card.summary = `${sk.name} (${it.src || it.id})`;
  return card;
}
export { fmt };
