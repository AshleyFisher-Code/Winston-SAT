// Progress state, skill stats, streaks and days off. Pure functions (no screen code).
const DAY = 86400000;
// A "day" runs 3am to 3am local time, so late-night practice counts for that day.
export function dayNum(d = new Date()) {
  const t = new Date(d.getTime() - 3 * 3600000);
  return Math.floor(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / DAY);
}
export const dayFromISO = iso => { const [y, m, d] = iso.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / DAY); };
export const isoFromDay = n => new Date(n * DAY).toISOString().slice(0, 10);

export const MODES = ['rule', 'decode', 'full'];
export const MODE_LABEL = { rule: 'Rule', decode: 'Decode', full: 'Full question' };
export const MODE_SHORT = { rule: 'Rule', decode: 'Decode', full: 'Full' };
export const GOAL_TAGS = ['trigger', 'rule', 'boundary', 'subject', 'read', 'trap', 'ask', 'desmos', 'answer'];
export const GOAL_LABEL = { trigger: 'Pick the right goal (R&W)', rule: 'Rule recall', boundary: 'Split the boundary', subject: 'Find the real subject', read: 'Reading first move', trap: 'Spot the trap', ask: 'Ask first', desmos: 'Desmos equation', answer: 'Final answer' };

export function blankState() {
  return { v: 1, skills: {}, goals: {}, items: {}, streak: { count: 0, best: 0, last: null, rest: 0 }, practiceDays: 0, sessions: [] };
}
const push20 = (arr, x) => { arr.push(x); if (arr.length > 20) arr.shift(); };
export function skillRec(S, id) { return S.skills[id] || (S.skills[id] = { rule: [], decode: [], full: [], n: 0, last: null, owed: 0, missDay: null }); }

// One finished card. ok = every step right on the first try. Lures only count toward the goal stats.
// stepOk[i] is true / false, or null when he skipped that step. procMiss = right answer but a step before it was wrong:
// no repeat in this session, but the skill is put first in a later session.
export function recordCard(S, card, ok, stepOk, today, procMiss = false) {
  stepOk.forEach((o, i) => { if (o == null) return; const tag = card.steps[i].tag; push20(S.goals[tag] || (S.goals[tag] = []), o ? 1 : 0); });
  if (card.itemId) S.items[card.itemId] = today;
  if (card.lure || card.teach) return;
  const s = skillRec(S, card.skill);
  push20(s[card.mode], ok ? 1 : 0); s.n++;
  if (!ok) { s.owed = 2; s.missDay = today; }
  else if (procMiss) { s.owed = Math.max(s.owed || 0, 1); s.missDay = today; }
  else if (s.owed && s.missDay !== today) s.owed--;
  s.last = today;
}
export const acc = (h, n = 10) => { if (!h || !h.length) return null; const x = h.slice(-n); return x.reduce((a, b) => a + b, 0) / x.length; };
export function skillAcc(S, id) {
  const s = S.skills[id]; if (!s) return null;
  const all = [...s.rule.slice(-6), ...s.decode.slice(-6), ...s.full.slice(-6)];
  return all.length ? all.reduce((a, b) => a + b, 0) / all.length : null;
}
export function skillStatus(S, id) {
  const s = S.skills[id], a = skillAcc(S, id);
  if (a == null) return { label: 'Not started', level: 'none', acc: null };
  if (s.n < 5) return { label: 'Warming up', level: 'mid', acc: a };
  if (a >= 0.85) return { label: 'Strong', level: 'good', acc: a };
  if (a >= 0.7) return { label: 'Almost', level: 'mid', acc: a };
  return { label: 'Needs work', level: 'bad', acc: a };
}

/* ---------- days off ---------- */
function nthWeekday(y, m, wd, n) { const d = new Date(Date.UTC(y, m, 1)); const first = (wd - d.getUTCDay() + 7) % 7; return 1 + first + (n - 1) * 7; }
function lastWeekday(y, m, wd) { const last = new Date(Date.UTC(y, m + 1, 0)); return last.getUTCDate() - ((last.getUTCDay() - wd + 7) % 7); }
export function federalHolidays(y) {
  const iso = (m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return {
    [iso(0, 1)]: 'New Year\'s Day', [iso(0, nthWeekday(y, 0, 1, 3))]: 'Martin Luther King Jr. Day', [iso(1, nthWeekday(y, 1, 1, 3))]: 'Presidents\' Day',
    [iso(4, lastWeekday(y, 4, 1))]: 'Memorial Day', [iso(5, 19)]: 'Juneteenth', [iso(6, 4)]: 'Independence Day', [iso(8, nthWeekday(y, 8, 1, 1))]: 'Labor Day',
    [iso(9, nthWeekday(y, 9, 1, 2))]: 'Columbus Day', [iso(10, 11)]: 'Veterans Day', [iso(10, nthWeekday(y, 10, 4, 4))]: 'Thanksgiving', [iso(11, 25)]: 'Christmas',
  };
}
export function dayOff(day, settings) {
  const iso = isoFromDay(day), y = Number(iso.slice(0, 4));
  const fed = federalHolidays(y)[iso]; if (fed) return fed;
  const fam = (settings && Array.isArray(settings.offDays)) ? settings.offDays : [];
  if (fam.includes(iso)) return 'Day off';
  if (settings && settings.testDate === iso) return 'Test day';
  return null;
}
const missedBetween = (last, today, settings) => { let n = 0; for (let d = last + 1; d < today; d++) if (!dayOff(d, settings)) n++; return n; };

/* ---------- streak (rest day earned every 7 days, max 2) ---------- */
export function streakView(st, today, settings) {
  const s = st.streak; if (s.last == null) return { count: 0, done: false, atRisk: false, rest: s.rest };
  if (s.last === today) return { count: s.count, done: true, atRisk: false, rest: s.rest };
  const off = dayOff(today, settings), gap = missedBetween(s.last, today, settings);
  if (off && gap <= s.rest) return { count: s.count, done: false, atRisk: false, rest: s.rest, off };
  if (gap === 0) return { count: s.count, done: false, atRisk: true, rest: s.rest };
  if (gap <= s.rest) return { count: s.count, done: false, atRisk: true, rest: s.rest, restNeeded: gap };
  return { count: 0, done: false, atRisk: false, rest: 0, broken: s.count };
}
export function completeDay(st, today, settings) {
  const s = st.streak, out = { usedRest: 0, earnedRest: false };
  if (s.last === today) { out.count = s.count; return out; }
  if (s.last == null) s.count = 1;
  else { const gap = missedBetween(s.last, today, settings); if (gap <= 0) s.count += 1; else if (gap <= s.rest) { s.rest -= gap; out.usedRest = gap; s.count += 1; } else { s.count = 1; s.rest = 0; } }
  s.last = today; s.best = Math.max(s.best, s.count);
  if (s.count % 7 === 0 && s.rest < 2) { s.rest += 1; out.earnedRest = true; }
  st.practiceDays = (st.practiceDays || 0) + 1; out.count = s.count; return out;
}
