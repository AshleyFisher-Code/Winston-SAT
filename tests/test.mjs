// Answer-key test run. Must pass before every publish:  node tests/test.mjs
import { BOUNDARY } from '../js/content/boundaries.js';
import { SV } from '../js/content/subjectverb.js';
import { RULES, TEACH, EN_SKILLS, BD_SIDES } from '../js/content/rules.js';
import { EN_ITEMS, bdChoices, svChoices, lureChoices, englishCard, trapChoices } from '../js/english.js';
import { TRAP_LABEL, TRAP_NEAR, RW_SKILLS } from '../js/content/rw_rules.js';
import { makeMath, MATH_SKILLS, parseNum } from '../js/math.js';
import { cardFromSpec, checkStep, ALL_SKILLS } from '../js/cards.js';
import { buildSession, skillOfSpec, followUp, followPos, MIN_GAP, SESSION_TYPES } from '../js/session.js';
import { blankState, recordCard, completeDay, streakView } from '../js/srs.js';
import { summarize, reportText } from '../js/report.js';

let n = 0; const fails = [];
const assert = (c, msg) => { n++; if (!c) { fails.push(msg); } };
const near = (a, b) => Math.abs(a - b) < 1e-6;

/* ---------- English banks: structure ---------- */
const PUNCT_END = /[.!?]$/;
for (const b of BOUNDARY) {
  assert(!/[,;:.—\-]$/.test(b.L), `${b.id} L ends with punctuation`);
  assert(/^ /.test(b.R) && PUNCT_END.test(b.R), `${b.id} R format`);
  assert(/^[A-Z]/.test(b.L), `${b.id} L capital`);
  assert(['ss', 'adv', 'dep', 'mod', 'none', 'colon', 'pair'].includes(b.t), `${b.id} type`);
  if (b.t === 'pair') assert((b.open === ',' && b.L.includes(',')) || (b.open === '—' && b.L.includes('—')), `${b.id} pair opener in L`);
  if (!b.cap && b.t !== 'adv') assert(b.w === b.w.toLowerCase() || /^[a-z]/.test(b.w), `${b.id} w lowercase`);
}
for (const v of SV) {
  const txt = v.pre + ' ' + v.post;
  for (const k of ['subj', 'trap', 'other']) assert(txt.includes(v[k]), `${v.id} ${k} "${v[k]}" not in sentence`);
  assert(new Set([v.subj, v.trap, v.other]).size === 3, `${v.id} subj/trap/other repeat`);
  assert(v.pre.trim().endsWith(v.trap) || v.pre.trim().replace(/[—,]$/, '').endsWith(v.trap), `${v.id} trap is not the word right before the blank`);
  assert(['sg', 'pl'].includes(v.num), `${v.id} num`);
  for (const k of ['s', 'p', 'pp', 'ing']) assert(v.v[k], `${v.id} verb form ${k}`);
}
assert(new Set(Object.keys(EN_ITEMS)).size === BOUNDARY.length + SV.length, 'duplicate English ids');
for (const s of EN_SKILLS) { assert(RULES[s.id], 'rule card for ' + s.id); assert(TEACH[s.id], 'teaching card for ' + s.id); }
for (const s of MATH_SKILLS) assert(TEACH[s.id], 'teaching card for ' + s.id);

/* ---------- English: every item, many seeds, every mode ---------- */
const RIGHT_MARK = { ss: ['period', 'semi'], adv: ['semi'], dep: ['comma'], mod: ['comma'], none: ['none'], colon: ['colon'] };
for (const b of BOUNDARY) for (let seed = 1; seed <= 40; seed++) {
  const ch = bdChoices(b, seed);
  assert(ch.length === 4 && new Set(ch.map(c => c.text)).size === 4, `${b.id} choices not 4 distinct`);
  const ok = ch.filter(c => c.ok);
  assert(ok.length === 1, `${b.id} seed ${seed}: ${ok.length} correct choices`);
  const want = b.t === 'pair' ? [b.open === ',' ? 'comma' : 'dash'] : RIGHT_MARK[b.t];
  assert(want.includes(ok[0].mark), `${b.id} correct mark ${ok[0].mark}`);
  assert(!ch.some(c => c.mark === 'period' && c.ok === false && /\. [a-z]/.test(c.text) && !b.cap), `${b.id} period without capital`);
  if (b.t === 'ss') assert(!ch.some(c => (c.mark === 'period' || c.mark === 'semi') && !c.ok), `${b.id} two S|S-valid marks offered`);
  if (b.t === 'adv') { const l = lureChoices(b, seed); assert(new Set(l.map(c => c.text)).size === 4, `${b.id} lure choices`); }
}
for (const v of SV) for (let seed = 1; seed <= 20; seed++) {
  const ch = svChoices(v, seed);
  assert(new Set(ch.map(c => c.text)).size === 4 && ch.filter(c => c.ok).length === 1, `${v.id} choices`);
  assert(ch.find(c => c.ok).text === (v.num === 'sg' ? v.v.s : v.v.p), `${v.id} correct verb`);
}
const variants = [['rule', 'rule'], ['rule', 'trig'], ['decode'], ['full']];
for (const it of Object.values(EN_ITEMS)) for (const [m, vv] of variants) for (const seed of [3, 77, 1234]) {
  const c = englishCard({ s: 'en', id: it.id, m, v: vv, seed });
  testCard(c, `${it.id} ${m}${vv ? '/' + vv : ''}`);
  if (m === 'decode' && it.kind === 'bd') { const [l, r] = BD_SIDES[it.skill]; assert(c.steps[0].fields[0].answer === l && c.steps[0].fields[1].answer === r, `${it.id} decode sides`); }
  if (m === 'full') assert(c.steps[c.steps.length - 1].tag === 'answer' && c.steps[0].tag !== 'answer', `${it.id} full gate order`);
}
for (const b of BOUNDARY.filter(x => x.t === 'adv')) { const c = englishCard({ s: 'en', id: b.id, m: 'rule', v: 'lure', seed: 9 }); testCard(c, b.id + ' lure'); assert(c.steps[0].fields[0].answer === 'Neither' && c.lure, `${b.id} lure answer`); }

// Every step: the key passes; every single wrong choice fails; answers are among the choices.
function testCard(c, label) {
  assert(c.steps.length >= 1, label + ' no steps');
  for (const st of c.steps) {
    const right = st.fields.map(f => f.answer);
    assert(checkStep(st, right).every(Boolean), `${label} ${st.tag}: key rejected`);
    st.fields.forEach((f, i) => {
      if (f.typed) return;
      assert(f.choices.includes(f.answer), `${label} ${st.tag}: answer not among choices`);
      assert(new Set(f.choices).size === f.choices.length, `${label} ${st.tag}: duplicate choices`);
      for (const w of f.choices) if (w !== f.answer) { const v = right.slice(); v[i] = w; assert(!checkStep(st, v)[i], `${label} ${st.tag}: wrong choice "${w}" accepted`); }
    });
    assert(typeof st.why() === 'string' && st.why().length > 5, `${label} why text`);
  }
}

/* ---------- Reading & Writing (other sections) ---------- */
const RW = Object.values(EN_ITEMS).filter(x => x.kind === 'rw');
const posCount = [0, 0, 0, 0];
for (const it of RW) {
  const L = it.id;
  assert(RW_SKILLS.some(s => s.id === it.skill), `${L} unknown type ${it.t}`);
  assert(it.o.length === 4 && new Set(it.o).size === 4, `${L} options`);
  assert(Number.isInteger(it.a) && it.a >= 0 && it.a < 4, `${L} key`); posCount[it.a]++;
  assert(it.tr.length === 4 && it.tr.filter(x => x == null).length === 1 && it.tr[it.a] == null, `${L} trap codes`);
  it.tr.forEach((c, i) => { if (i !== it.a) assert(TRAP_LABEL[c], `${L} unknown trap ${c}`); });
  assert(it.e.length === 4 && it.e.every(x => typeof x === 'string' && x.length > 10), `${L} explanations`);
  assert(it.d && it.d.o.length >= 3 && it.d.o.length <= 4 && new Set(it.d.o).size === it.d.o.length && it.d.a >= 0 && it.d.a < it.d.o.length && it.d.why, `${L} decode`);
  assert(typeof it.p === 'string' && it.p.length > 60 && typeof it.q === 'string', `${L} passage`);
  assert(!/[\u2018\u2019\u201c\u201d]/.test(JSON.stringify(it)), `${L} smart quotes`);
  if (it.t === 'quant') assert(it.tbl && it.tbl.cols.length && it.tbl.rows.every(r => r.length === it.tbl.cols.length), `${L} table shape`);
  if (/underlined/.test(it.q)) assert(/\[\[[\s\S]+?\]\]/.test(it.p), `${L} underline missing`);
  if (['trans', 'infer'].includes(it.t)) assert(/_{4,}/.test(it.p), `${L} blank missing`);
  for (const [m, v] of [['decode'], ['full'], ['rule', 'trap'], ['rule', 'rule']]) for (const seed of [5, 91, 4040]) testCard(englishCard({ s: 'en', id: it.id, m, v, seed }), `${L} ${m}${v ? '/' + v : ''}`);
  for (let seed = 1; seed <= 30; seed++) {
    const c = englishCard({ s: 'en', id: it.id, m: 'rule', v: 'trap', seed });
    const st = c.steps[0], right = st.fields[0].answer;
    const code = Object.keys(TRAP_LABEL).find(k => TRAP_LABEL[k] === right);
    assert(c.stem.flag && it.o.indexOf(c.stem.flag.text) !== it.a && it.tr[it.o.indexOf(c.stem.flag.text)] === code, `${L} trap card points at the right option`);
    st.fields[0].choices.forEach(lbl => { const k = Object.keys(TRAP_LABEL).find(x => TRAP_LABEL[x] === lbl); if (k !== code) assert(!(TRAP_NEAR[code] || []).includes(k) && !(TRAP_NEAR[k] || []).includes(code), `${L} near-trap offered: ${code} vs ${k}`); });
  }
  const full = englishCard({ s: 'en', id: it.id, m: 'full', seed: 3 });
  const ans = full.steps[1];
  it.o.forEach((o, i) => { const w = ans.whyFor([o]); assert(Array.isArray(w) && w.length === (i === it.a ? 1 : 2), `${L} whyFor`); });
}
assert(RW.length >= 100, 'reading bank size ' + RW.length);
assert(Math.min(...posCount) >= RW.length / 4 - 10, 'answer positions lopsided ' + posCount);
console.log('R&W items:', RW.length, 'answer positions A-D:', posCount.join('/'));

/* ---------- Math: independent re-computation from the question text ---------- */
const num = s => Number(String(s).replace(/[−]/g, '-').replace(/[$,]/g, ''));
const toJS = s => s.replace(/\^/g, '**').replace(/(\d)\s*([xy(])/g, '$1*$2').replace(/\)\s*\(/g, ')*(').replace(/\)(\d|x)/g, ')*$1');
const evalAt = (expr, x, y) => Function('x', 'y', 'return ' + toJS(expr))(x, y);
const sidesOk = (eq, x, y) => { const [l, r] = eq.split('='); return near(evalAt(l, x, y), evalAt(r, x, y)); };
function verifyMath(q) {
  const S = q.stem, A = q.ans.correct, E = q.eq.correct;
  switch (q.sub) {
    case 'm-expr': { const m = S.match(/^If (\d+)x ([+−]) (\d+) = (−?[\d,]+), what is the value of (\d+)x\?$/); assert(m, 'expr parse ' + S); if (!m) return;
      const a = +m[1], b = (m[2] === '−' ? -1 : 1) * +m[3], c = num(m[4]), k = +m[5], x = (c - b) / a;
      assert(near(A, k * x), 'expr answer ' + S); assert(sidesOk(E, x), 'expr eq ' + E); q.eq.opts.filter(o => o !== E).forEach(o => assert(!sidesOk(o, x), 'expr wrong eq true ' + o)); return; }
    case 'm-linword': { const money = [...S.matchAll(/\$([\d,]+)/g)].map(m => num(m[1])); const [F, R] = money;
      if (/total bill/.test(S)) { const T = money[2], x = (T - F) / R; assert(near(A, x) && Number.isInteger(x), 'linword units ' + S); assert(sidesOk(E, x), 'linword eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!sidesOk(o, x), 'linword wrong eq ' + o)); }
      else { const nn = num(S.match(/(\d+) (hours|months|posters|guests)/g).pop().split(' ')[0]); assert(near(A, F + R * nn), 'linword total ' + S); assert(near(evalAt(E.split('=')[1], nn), A), 'linword eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!near(evalAt(o.split('=')[1], nn), A), 'linword wrong eq ' + o)); }
      return; }
    case 'm-system': { const lines = S.split('\n'); const parse = l => { const m = l.replace(/−/g, '-').replace(/\s/g, '').match(/^(-?\d*)x([+-]\d*)y=(-?\d+)$/); const co = s => (s === '' || s === '+' ? 1 : s === '-' ? -1 : Number(s)); return [co(m[1]), co(m[2]), Number(m[3])]; };
      const [a1, b1, c1] = parse(lines[0]), [a2, b2, c2] = parse(lines[1]); const d = a1 * b2 - a2 * b1; const x = (c1 * b2 - c2 * b1) / d, y = (a1 * c2 - a2 * c1) / d;
      const t = S.match(/value of (x \+ y|x|y)\?/)[1]; assert(near(A, { x, y, 'x + y': x + y }[t]), 'system answer ' + S);
      const ok = o => o.split(' and ').every(e => sidesOk(e, x, y)); assert(ok(E), 'system eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!ok(o), 'system wrong eq ' + o)); return; }
    case 'm-percent': {
      if (/sale price/.test(S) || /By how many dollars/.test(S)) { const P = num(S.match(/\$([\d,]+)/)[1]), r = num(S.match(/(\d+)%/)[1]) / 100; const want = /sale price/.test(S) ? P * (1 - r) : P * r; assert(near(A, want), 'percent ' + S); assert(near(evalAt(E.split('=')[1]), A), 'percent eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!near(evalAt(o.split('=')[1]), A), 'percent wrong eq ' + o)); }
      else if (/population/.test(S)) { const N = num(S.match(/was ([\d,]+)/)[1]), r = num(S.match(/(\d+)%/)[1]) / 100; assert(near(A, N * (1 + r)), 'pop ' + S); assert(near(evalAt(E.split('=')[1]), A), 'pop eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!near(evalAt(o.split('=')[1]), A), 'pop wrong eq ' + o)); }
      else { const m = S.match(/^([\d,.]+) is (\d+)% of what number\?$/); const W = num(m[1]), p = num(m[2]) / 100; assert(near(A, W / p), 'part ' + S); assert(sidesOk(E, A), 'part eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!sidesOk(o, A), 'part wrong eq ' + o)); }
      return; }
    case 'm-func': { const m = S.match(/f\(x\) = (−?\d+)x ([+−]) (\d+)/); const a = num(m[1]), b = (m[2] === '−' ? -1 : 1) * num(m[3]);
      if (/value of f\(/.test(S)) { const k = num(S.match(/value of f\((−?\d+)\)/)[1]); assert(near(A, a * k + b), 'f(k) ' + S); const fx = E.match(/f\(x\)=(.*), then/)[1]; assert(near(evalAt(fx, k), A), 'f eq'); }
      else { const V = num(S.match(/f\(t\) = (−?[\d,]+)/)[1]); assert(near(A, (V - b) / a) && Number.isInteger(A), 't ' + S); assert(sidesOk(E, A), 'f(t) eq'); q.eq.opts.filter(o => o !== E && !o.includes('then')).forEach(o => assert(!sidesOk(o, A), 'f(t) wrong eq ' + o)); }
      return; }
    case 'm-quad': { const m = S.replace(/−/g, '-').match(/x² ([+-]) (\d*)x ([+-]) (\d+) = 0/); const b = (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : +m[2]), c = (m[3] === '-' ? -1 : 1) * +m[4];
      const disc = Math.sqrt(b * b - 4 * c), r1 = (-b + disc) / 2, r2 = (-b - disc) / 2;
      const want = /positive solution/.test(S) ? Math.max(r1, r2) : /sum/.test(S) ? r1 + r2 : Math.abs(r1 - r2); assert(near(A, want), 'quad ' + S);
      const zero = e => near(evalAt(e.split('=')[1], r1), 0) && near(evalAt(e.split('=')[1], r2), 0); assert(zero(E), 'quad eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!zero(o), 'quad wrong eq ' + o)); return; }
    case 'm-exp': { const N = num(S.match(/(?:with|at|has) ([\d,]+)/)[1]), f = /doubles/.test(S) ? 2 : 3, hh = num(S.match(/every (\d+)/)[1]), t = num(S.match(/after (\d+)/)[1]);
      assert(near(A, N * f ** (t / hh)), 'exp ' + S); assert(near(evalAt(E.split('=')[1], t), A), 'exp eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!near(evalAt(o.split('=')[1], t), A), 'exp wrong eq ' + o)); return; }
    case 'm-ratio': { const ns = [...S.matchAll(/(\d+) (cups|centimeters|kilometers|students|adult)/g)].map(m => +m[1]); const [a, b, c] = ns; assert(near(A, b * c / a), 'ratio ' + S); assert(sidesOk(E, A), 'ratio eq'); q.eq.opts.filter(o => o !== E).forEach(o => assert(!sidesOk(o, A), 'ratio wrong eq ' + o)); return; }
  }
}
for (const s of MATH_SKILLS) for (let seed = 1; seed <= 3000; seed++) {
  const q = makeMath(s.id, seed);
  for (const L of ['ask', 'eq', 'ans']) { assert(q[L].opts.length === 4 && new Set(q[L].opts.map(String)).size === 4 && q[L].opts.includes(q[L].correct), `${s.id} ${seed} ${L} options`); }
  assert(Number.isFinite(q.ans.correct), `${s.id} ${seed} answer not a number`);
  assert(new Set(q.ans.opts.map(x => Math.round(x * 1000))).size === 4, `${s.id} ${seed} answers collide after rounding`);
  verifyMath(q);
  if (seed <= 300) for (const m of ['rule', 'decode', 'full']) testCard(cardFromSpec({ s: 'm', sub: s.id, seed, m }), `${s.id} ${seed} ${m}`);
}
// stability: same seed, same question
for (const s of MATH_SKILLS) assert(JSON.stringify(makeMath(s.id, 4242)) === JSON.stringify(makeMath(s.id, 4242)), s.id + ' not stable');
// typed answers
[['12', 12], ['12.0', 12], ['-3', -3], ['−3', -3], ['3/4', 0.75], ['.75', 0.75], ['1,200', 1200], ['$45', 45], ['abc', null], ['', null]].forEach(([s, v]) => assert(parseNum(s) === v, 'parseNum ' + s));

/* ---------- sessions ---------- */
const S = blankState();
for (let k = 0; k < 150; k++) for (const type of Object.keys(SESSION_TYPES)) {
  const sess = buildSession(type, S, { enShare: [50, 30, 70][k % 3] }, 20000);
  const last = {}; let gap = 99;
  sess.specs.forEach((sp, i) => { const key = skillOfSpec(sp); if (last[key] != null) gap = Math.min(gap, i - last[key]); last[key] = i; cardFromSpec(sp); });
  assert(gap >= MIN_GAP, `${type} same-skill gap ${gap}`);
  if (type === 'en') { const rw = sess.specs.filter(sp => sp.s === 'en' && sp.v !== 'lure' && EN_ITEMS[sp.id].kind === 'rw').length, en = sess.specs.filter(sp => sp.v !== 'lure').length; assert(Math.abs(rw / en - 0.25) <= 0.06, `en session reading share ${rw}/${en}`); }
  const T = SESSION_TYPES[type];
  if (T.modes) assert(sess.specs.every(sp => T.modes.includes(sp.m)), `${type} wrong modes`);
  assert(sess.specs.every(sp => T.subjects.includes(sp.s === 'm' ? 'math' : 'en')), `${type} wrong subject`);
  // simulate: every card wrong first try → follow-ups land at least 5 cards later
  if (k < 20) { const deck = sess.specs.slice(); for (let i = 0; i < Math.min(deck.length, 10); i++) { const f = followUp(deck[i], S); const p = followPos(deck, i, skillOfSpec(deck[i])); assert(p >= i + 6, 'follow-up too soon'); deck.splice(p, 0, f); cardFromSpec(f); } }
}
// recording + carry-over
{
  const st = blankState(); const c = cardFromSpec({ s: 'm', sub: 'm-expr', seed: 5, m: 'full' });
  recordCard(st, c, false, [true, false, true], 100); assert(st.skills['m-expr'].owed === 2, 'owed after miss');
  recordCard(st, c, true, [true, true, true], 100); assert(st.skills['m-expr'].owed === 2, 'same-day right does not clear owed');
  recordCard(st, c, true, [true, true, true], 101); recordCard(st, c, true, [true, true, true], 102); assert(st.skills['m-expr'].owed === 0, 'owed clears after 2 later days');
  assert(st.goals.desmos.length === 4, 'goal stats');
  // right answer, missed step: carries to a later session; skipped steps don't count in goal stats
  const st2 = blankState();
  recordCard(st2, c, true, [true, false, true], 200, true); assert(st2.skills['m-expr'].owed === 1 && st2.skills['m-expr'].full.slice(-1)[0] === 1, 'procMiss → owed 1, counted right');
  recordCard(st2, c, true, [null, null, true], 201); assert(st2.goals.ask.length === 1 && st2.goals.answer.length === 2, 'skipped steps not counted');
  assert(st2.skills['m-expr'].owed === 0, 'owed clears next day');
  const sess = buildSession('math', st, {}, 103); // not owed anymore; fine
  completeDay(st, 100, {}); completeDay(st, 101, {}); assert(st.streak.count === 2 && streakView(st, 101, {}).done, 'streak');
  const run = { sess: { type: 'math', title: 'Math' }, results: [{ skill: 'm-expr', mode: 'full', ok: false, follow: false, summary: 'x', correct: '12', wrongFirst: '4', steps: [['ask', true], ['desmos', false], ['answer', true]] }, { teach: true, skill: 'm-expr', steps: [] }] };
  const sum = summarize(run, 100); const txt = reportText(sum, 'Winston');
  assert(/First try: 0\/1/.test(txt) && /Desmos equation: 0\/1/.test(txt) && /Step-by-step teaching shown/.test(txt), 'report text\n' + txt);
}

console.log(`${n} checks, ${fails.length} failures`);
if (fails.length) { console.log([...new Set(fails)].slice(0, 60).join('\n')); process.exit(1); }
