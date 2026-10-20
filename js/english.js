// Builds English cards (Boundaries and Subject-verb) from the sentence banks.
import { BOUNDARY } from './content/boundaries.js';
import { SV } from './content/subjectverb.js';
import { RULES, BD_SIDES, BD_DECODE_WHY, BD_ANSWER_WHY, EN_SKILLS } from './content/rules.js';
import { rng, shuffleR, hash, pickR } from './util.js';

export const EN_ITEMS = {};
BOUNDARY.forEach(b => { EN_ITEMS[b.id] = { ...b, kind: 'bd', skill: 'bd-' + b.t }; });
SV.forEach(v => { EN_ITEMS[v.id] = { ...v, kind: 'sv', skill: 'sv-' + v.t }; });
export const itemsFor = skill => Object.values(EN_ITEMS).filter(x => x.skill === skill);

const MARK = { comma: ', ', semi: '; ', period: '. ', colon: ': ', none: ' ', dash: '—' };
const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
const lastWord = s => s.trim().split(/\s+/).pop();
const firstWord = s => s.trim().split(/\s+/)[0];

// The four answer choices for a boundary item: [{mark, text, ok}]
export function bdChoices(b, seed) {
  const r = rng(seed ^ hash(b.id));
  let right, wrong;
  switch (b.t) {
    case 'ss': right = pickR(r, ['period', 'semi']); wrong = ['comma', 'none', 'colon']; break;
    case 'adv': right = 'semi'; wrong = ['comma', 'none', 'colon']; break;
    case 'dep': case 'mod': right = 'comma'; wrong = ['semi', 'period', 'colon']; break;
    case 'none': right = 'none'; wrong = ['comma', 'semi', 'colon']; break;
    case 'colon': right = 'colon'; wrong = ['semi', 'none', 'period']; break;
    case 'pair': right = b.open === ',' ? 'comma' : 'dash'; wrong = [b.open === ',' ? 'dash' : 'comma', 'semi', 'none']; break;
    default: throw new Error('unknown boundary type ' + b.t);
  }
  const lw = lastWord(b.L);
  const make = m => {
    const word = m === 'period' && !b.cap ? capFirst(b.w) : b.w;
    const tail = b.t === 'adv' ? `${word}, ${firstWord(b.R)}` : word;
    return { mark: m, text: lw + MARK[m] + tail, full: b.L + MARK[m] + (b.t === 'adv' ? word + ',' : word) + b.R, ok: m === right };
  };
  return shuffleR(r, [right, ...wrong]).map(make);
}
// Lure: same punctuation, different transition words. The trigger answer is "Neither".
const ADVS = ['however', 'therefore', 'instead', 'for example', 'meanwhile', 'as a result', 'nevertheless', 'in addition'];
export function lureChoices(b, seed) {
  const r = rng(seed ^ hash(b.id + 'lure'));
  const words = shuffleR(r, ADVS.filter(a => a !== b.w)).slice(0, 3).concat([b.w]);
  return shuffleR(r, words).map(a => ({ text: `${lastWord(b.L)}; ${a}, ${firstWord(b.R)}`, ok: null }));
}
export function svChoices(v, seed) {
  const r = rng(seed ^ hash(v.id));
  const f = v.v;
  const list = v.num === 'sg' ? [[f.s, true], [f.p, false], ['have ' + f.pp, false], ['are ' + f.ing, false]] : [[f.p, true], [f.s, false], ['has ' + f.pp, false], ['is ' + f.ing, false]];
  return shuffleR(r, list).map(([text, ok]) => ({ text, ok }));
}

export const GOALS = ['Split the boundary', 'Find the real subject', 'Neither'];
const SV_SPOT = { prep: 'is inside a phrase', clause: 'is inside a who/that clause', appos: 'is inside the side note', invert: 'is in the opening phrase, not the subject', compound: 'is inside a phrase', oneof: 'is inside the "of" phrase' };

// spec: { s:'en', id, m:'rule'|'decode'|'full', v?:'trig'|'lure'|'rule', seed }
export function englishCard(sp) {
  const it = EN_ITEMS[sp.id];
  if (!it) throw new Error('missing item ' + sp.id);
  const sk = EN_SKILLS.find(s => s.id === it.skill);
  const seed = sp.seed || 1;
  const card = { spec: sp, subject: 'en', skill: it.skill, mode: sp.m, itemId: it.id, steps: [] };

  if (sp.m === 'rule' && sp.v === 'rule') { // the rule only, no sentence
    const R = RULES[it.skill], r = rng(seed ^ hash(it.skill + 'rule'));
    card.chip = 'Rule'; card.instr = 'Just the rule.';
    card.stem = { kind: 'rule', text: R.q };
    card.steps.push({ tag: 'rule', fields: [{ label: 'Rule', choices: shuffleR(r, [R.a, ...R.w]), answer: R.a, long: true }], why: () => sk.goal === 'boundary' ? BD_ANSWER_WHY[it.skill] : R.a + '.' });
    card.summary = `Rule: ${sk.name}`;
    return card;
  }

  let choices, sentence;
  if (it.kind === 'bd') {
    choices = sp.v === 'lure' ? lureChoices(it, seed) : bdChoices(it, seed);
    sentence = { before: it.L, after: it.R };
  } else {
    choices = svChoices(it, seed);
    sentence = { before: it.pre + (it.pre.endsWith('—') ? '' : ' '), after: ' ' + it.post };
  }
  card.stem = { kind: 'sentence', ...sentence, choices: choices.map(c => c.text) };

  if (sp.m === 'rule') { // trigger: which goal applies? (decided by looking at the choices)
    const ans = sp.v === 'lure' ? 'Neither' : it.kind === 'bd' ? 'Split the boundary' : 'Find the real subject';
    card.chip = 'Which goal?'; card.instr = 'Look at the four choices. Which goal applies? Don\'t answer the question.';
    card.steps.push({ tag: 'trigger', fields: [{ label: 'Goal', choices: GOALS, answer: ans }],
      why: () => ans === 'Neither' ? 'The choices differ in words, not punctuation or verb forms. Neither goal applies.' : ans === 'Split the boundary' ? 'The choices differ only in punctuation → split the boundary.' : 'The choices are different forms of one verb → find the real subject.' });
    card.summary = `Which goal: ${sp.v === 'lure' ? 'transition words (neither)' : sk.name}`;
    card.lure = sp.v === 'lure';
    return card;
  }

  // decode step (decode mode = only this; full mode = this first, then the answer unlocks)
  if (it.kind === 'bd') {
    const [ls, rs] = BD_SIDES[it.skill];
    const fields = [{ label: 'Left side', choices: ['Sentence', 'Fragment'], answer: ls }, { label: 'Right side', choices: ['Sentence', 'Fragment'], answer: rs }];
    if (it.t === 'pair') fields.push({ label: 'The side note opened with', choices: ['a comma', 'a dash'], answer: it.open === ',' ? 'a comma' : 'a dash' });
    card.steps.push({ tag: 'boundary', title: 'Split the boundary', instr: 'Can each side stand alone as a sentence?', fields, why: () => BD_DECODE_WHY[it.skill] });
    card.split = true;
  } else {
    const r = rng(seed ^ hash(it.id + 'subj'));
    card.steps.push({ tag: 'subject', title: 'Find the real subject', instr: 'Tap the real subject of the blank verb.', fields: [
      { label: 'Real subject', choices: shuffleR(r, [it.subj, it.trap, it.other]), answer: it.subj },
      { label: 'Singular or plural?', choices: ['singular', 'plural'], answer: it.num === 'sg' ? 'singular' : 'plural' }],
      why: () => `The real subject is "${it.subj}" (${it.num === 'sg' ? 'singular' : 'plural'}). "${it.trap}" ${SV_SPOT[it.t]}.` });
  }
  if (sp.m === 'decode') { card.chip = 'Decode'; card.instr = null; card.summary = `Decode: ${sk.name} (${it.id})`; return card; }

  const right = choices.find(c => c.ok);
  card.steps.push({ tag: 'answer', title: 'Now answer', instr: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    fields: [{ label: 'Answer', choices: choices.map(c => c.text), answer: right.text, long: true }],
    why: () => it.kind === 'bd' ? BD_ANSWER_WHY[it.skill] : `"${it.subj}" is ${it.num === 'sg' ? 'singular' : 'plural'}, so the verb is "${right.text}".` });
  card.chip = 'Full question'; card.summary = `${sk.name} (${it.id})`;
  card.correctText = right.text;
  return card;
}
