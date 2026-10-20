// Session summaries: stored compactly in progress, and turned into a copy-able text report.
import { SKILL } from './cards.js';
import { GOAL_LABEL, GOAL_TAGS, MODES, MODE_LABEL, isoFromDay } from './srs.js';

export function summarize(run, today) {
  const first = run.results.filter(r => !r.follow && !r.teach);
  const modes = {}, goals = {}, missedBy = {};
  first.forEach(r => { const m = modes[r.mode] || (modes[r.mode] = [0, 0]); m[1]++; if (r.ok) m[0]++; });
  run.results.filter(r => !r.teach).forEach(r => r.steps.forEach(([tag, ok]) => { const g = goals[tag] || (goals[tag] = [0, 0]); g[1]++; if (ok) g[0]++; }));
  run.results.filter(r => !r.ok && !r.teach && !r.lure).forEach(r => { missedBy[r.skill] = (missedBy[r.skill] || 0) + 1; });
  const fol = run.results.filter(r => r.follow && !r.teach);
  return {
    day: today, at: Date.now(), type: run.sess.type, title: run.sess.title,
    n: first.length, right: first.filter(r => r.ok).length,
    modes, goals, missedBy,
    lures: (() => { const l = first.filter(r => r.lure); return [l.filter(r => r.ok).length, l.length]; })(),
    follow: [fol.filter(r => r.ok).length, fol.length],
    teach: run.results.filter(r => r.teach).map(r => r.skill),
    misses: run.results.filter(r => !r.ok && !r.teach).slice(0, 30).map(r => ({ s: r.summary, a: r.correct, y: r.wrongFirst })),
  };
}
const pct = (a, b) => (b ? Math.round(100 * a / b) + '%' : '—');
const fmtDay = d => new Date(isoFromDay(d) + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export function reportText(s, name) {
  const L = [];
  L.push(`${name || 'Winston'} · SAT practice · ${fmtDay(s.day)} · ${s.title}`);
  L.push(`First try: ${s.right}/${s.n} (${pct(s.right, s.n)})`);
  L.push('By mode: ' + MODES.filter(m => s.modes[m]).map(m => `${MODE_LABEL[m]} ${s.modes[m][0]}/${s.modes[m][1]}`).join(' · '));
  L.push('Goal actions (first try):');
  GOAL_TAGS.filter(t => s.goals[t]).forEach(t => L.push(`  ${GOAL_LABEL[t]}: ${s.goals[t][0]}/${s.goals[t][1]} (${pct(...s.goals[t])})`));
  if (s.lures && s.lures[1]) L.push(`  "Neither" lures spotted: ${s.lures[0]}/${s.lures[1]}`);
  const mb = Object.entries(s.missedBy || {}).sort((a, b) => b[1] - a[1]);
  L.push('Missed skills: ' + (mb.length ? mb.map(([k, n]) => `${SKILL[k] ? SKILL[k].name : k}${n > 1 ? ` ×${n}` : ''}`).join('; ') : 'none'));
  if (s.follow && s.follow[1]) L.push(`Came back later in the session: ${s.follow[1]} · held ${s.follow[0]}/${s.follow[1]}`);
  if (s.teach && s.teach.length) L.push('Step-by-step teaching shown: ' + s.teach.map(k => SKILL[k].name).join('; '));
  if (s.misses && s.misses.length) { L.push('Misses:'); s.misses.forEach(m => L.push(`  - ${m.s}${m.y ? ` · first tapped: ${m.y}` : ''} · right: ${m.a}`)); }
  return L.join('\n');
}
