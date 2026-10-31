// Builds practice sessions as lists of small saved "specs".
// Rules from the plan: same skill at least 5 questions apart; a missed skill comes back
// later in the session (5–8 cards on) with a fresh question; two misses on one skill in a
// session → a step-by-step teaching card; missed skills carry into the next days.
import { ALL_SKILLS, SKILL } from './cards.js';
import { itemsFor, EN_ITEMS } from './english.js';
import { skillAcc, acc } from './srs.js';
import { newSeed, shuffle, pickOne } from './util.js';

export const MIN_GAP = 6; // positions between two cards of the same skill (5 other cards in between)
export const DEFAULT_MIX = { rule: 30, decode: 35, full: 35 };
export const SESSION_TYPES = {
  daily: { title: "Today's practice", n: 24, subjects: ['en', 'math'], modes: null, counts: true, desc: 'English + math, all three modes mixed · about 25 min' },
  en: { title: 'English', n: 20, subjects: ['en'], modes: null, counts: true, desc: 'Grammar + hard reading & writing questions, all three modes' },
  math: { title: 'Math', n: 20, subjects: ['math'], modes: null, counts: true, desc: 'Ask first + Desmos, all three modes' },
  reps: { title: 'Quick reps', n: 30, subjects: ['en', 'math'], modes: ['rule', 'decode'], counts: true, desc: 'First moves only, no full solving · high volume' },
  full: { title: 'Full questions', n: 16, subjects: ['en', 'math'], modes: ['full'], counts: true, desc: 'Every question start to finish, gates on' },
};

function modeWeights(S, skill, mix, allowed) {
  const s = S.skills[skill] || {};
  let w = { ...(mix || DEFAULT_MIX) };
  const dec = acc(s.decode, 6), n = (s.decode || []).length;
  if (n >= 6 && dec >= 0.85) { w.decode *= 0.6; w.full *= 1.6; w.rule *= 0.7; }
  else if (dec != null && dec < 0.6) { w.decode *= 1.5; w.full *= 0.6; }
  if (allowed) for (const m of Object.keys(w)) if (!allowed.includes(m)) w[m] = 0;
  return w;
}
const wpick = w => { const tot = Object.values(w).reduce((a, b) => a + b, 0); let x = Math.random() * tot; for (const [k, v] of Object.entries(w)) { x -= v; if (x <= 0 && v > 0) return k; } return Object.keys(w).find(k => w[k] > 0); };

// Least-recently-seen English item for a skill (avoiding ones already used this session).
function pickItem(S, skill, used) {
  const list = itemsFor(skill).filter(x => !used.has(x.id));
  const pool = list.length ? list : itemsFor(skill);
  const sorted = pool.slice().sort((a, b) => (S.items[a.id] ?? -1e9) - (S.items[b.id] ?? -1e9));
  return pickOne(sorted.slice(0, Math.max(2, Math.ceil(sorted.length / 3))));
}
// One spec for a skill in a mode.
export function specFor(S, skill, mode, used = new Set()) {
  const sk = SKILL[skill];
  if (sk.subject === 'math') return { s: 'm', sub: skill, m: mode, seed: newSeed() };
  if (mode === 'rule') {
    const v = sk.goal === 'reading' ? (Math.random() < 0.3 ? 'rule' : 'trap') : Math.random() < 0.4 ? 'rule' : 'trig';
    const it = pickItem(S, skill, used); used.add(it.id);
    return { s: 'en', id: it.id, m: 'rule', v, seed: newSeed() };
  }
  const it = pickItem(S, skill, used); used.add(it.id);
  return { s: 'en', id: it.id, m: mode, seed: newSeed() };
}
const lureSpec = (S, used) => { const it = pickItem(S, 'bd-adv', used); used.add(it.id); return { s: 'en', id: it.id, m: 'rule', v: 'lure', seed: newSeed() }; };
export const skillOfSpec = sp => (sp.t === 'teach' ? 'teach:' + sp.skill : sp.v === 'lure' ? 'lure' : sp.s === 'm' ? sp.sub : EN_ITEMS[sp.id].skill);

// How many cards each skill gets. Owed (recently missed) skills first, then weakest / least recent.
function allocate(S, skills, n, today) {
  const cap = Math.max(1, Math.ceil(n / MIN_GAP));
  const score = id => { const s = S.skills[id], a = skillAcc(S, id); let x = a == null ? 0.4 : a; if (s && s.owed) x -= 1; const age = s && s.last != null ? today - s.last : 30; return x - Math.min(age, 30) * 0.01 + Math.random() * 0.15; };
  const order = skills.slice().sort((a, b) => score(a) - score(b));
  const count = Object.fromEntries(skills.map(s => [s, 0]));
  let left = n, i = 0;
  while (left > 0) { const id = order[i % order.length]; if (count[id] < cap) { count[id]++; left--; } i++; if (i > n * order.length * 2) break; }
  return count;
}
// Order cards so the same skill is at least MIN_GAP apart (best effort when impossible).
export function arrange(specs) {
  const left = shuffle(specs), out = [], lastAt = {};
  while (left.length) {
    const pos = out.length;
    const remainBy = {}; left.forEach(sp => { const k = skillOfSpec(sp); remainBy[k] = (remainBy[k] || 0) + 1; });
    let best = -1, bestKey = -Infinity;
    left.forEach((sp, i) => {
      const k = skillOfSpec(sp), gap = lastAt[k] == null ? 99 : pos - lastAt[k];
      const key = (gap >= MIN_GAP ? 1000 : gap * 10) + remainBy[k];
      if (key > bestKey) { bestKey = key; best = i; }
    });
    const sp = left.splice(best, 1)[0]; lastAt[skillOfSpec(sp)] = pos; out.push(sp);
  }
  return out;
}
export function buildSession(type, S, settings, today) {
  const T = SESSION_TYPES[type];
  const n = T.n;
  const skills = ALL_SKILLS.filter(s => T.subjects.includes(s.subject)).map(s => s.id);
  // split between subjects
  const per = {};
  if (T.subjects.length === 2) { const en = Math.round(n * ((settings && settings.enShare) ?? 50) / 100); per.en = en; per.math = n - en; } else per[T.subjects[0]] = n;
  const used = new Set(), specs = [];
  // English splits into grammar (default 75%) and the other Reading & Writing sections (25%, hard items only).
  const groups = [];
  for (const subj of T.subjects) {
    const subSkills = skills.filter(id => SKILL[id].subject === subj);
    if (subj !== 'en') { groups.push([subSkills, per[subj]]); continue; }
    const gShare = ((settings && settings.grammarShare) ?? 75) / 100;
    const rw = subSkills.filter(id => SKILL[id].goal === 'reading'), gr = subSkills.filter(id => SKILL[id].goal !== 'reading');
    let nr = Math.round(per.en * (1 - gShare)); if (gShare < 1 && per.en >= 4 && nr < 1) nr = 1;
    groups.push([gr, per.en - nr], [rw, nr]);
  }
  for (const [subSkills, m] of groups) {
    if (!m || !subSkills.length) continue;
    const counts = allocate(S, subSkills, m, today);
    for (const [id, c] of Object.entries(counts)) for (let k = 0; k < c; k++) {
      const mode = wpick(modeWeights(S, id, settings && settings.mix, T.modes));
      specs.push(specFor(S, id, mode, used));
    }
  }
  if (T.subjects.includes('en') && (!T.modes || T.modes.includes('rule'))) {
    const trig = specs.filter(sp => sp.s === 'en' && sp.m === 'rule' && sp.v === 'trig').length;
    const lures = Math.max(1, Math.round(trig / 3));
    for (let k = 0; k < lures; k++) specs.push(lureSpec(S, used));
  }
  return { type, title: T.title, counts: T.counts, specs: arrange(specs) };
}

// A missed card comes back later with a fresh question. Rule-card misses come back as decode.
export function followUp(sp, S) {
  if (sp.v === 'lure') return { ...lureSpec(S, new Set([sp.id])), follow: true };
  const skill = skillOfSpec(sp);
  const mode = sp.s === 'en' && sp.m === 'rule' && sp.v === 'rule' ? 'decode' : sp.m;
  const f = specFor(S, skill, mode, new Set(sp.id ? [sp.id] : []));
  return { ...f, follow: true };
}
// Where to put a follow-up: 6–8 cards ahead, nudged so no same-skill card sits within 5 of it.
export function followPos(deck, idx, skill) {
  const near = p => deck.some((d, j) => Math.abs(j - p) < MIN_GAP - 1 && skillOfSpec(d) === skill);
  for (let p = idx + 6; p <= Math.min(deck.length, idx + 12); p++) if (!near(p)) return p;
  return Math.min(deck.length, idx + 6 + Math.floor(Math.random() * 3));
}
