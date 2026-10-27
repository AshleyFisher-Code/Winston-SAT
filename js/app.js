import { auth, db, doc, setDoc, onSnapshot, onAuthStateChanged, signInWithEmailAndPassword, signOut } from './firebase.js';
import { STUDENT_UID, PARENT_UID, APP_VERSION } from './config.js';
import { cardFromSpec, checkStep, SKILL, ALL_SKILLS, DESMOS_URL } from './cards.js';
import { buildSession, followUp, followPos, skillOfSpec, SESSION_TYPES, DEFAULT_MIX } from './session.js';
import { dayNum, isoFromDay, dayFromISO, blankState, recordCard, streakView, completeDay, acc, skillStatus, GOAL_TAGS, GOAL_LABEL, MODES, MODE_LABEL, MODE_SHORT } from './srs.js';
import { summarize, reportText } from './report.js';

/* ---------- tiny DOM helper ---------- */
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) { if (k == null || k === false) continue; e.append(k.nodeType ? k : document.createTextNode(String(k))); }
  return e;
};
const app = document.getElementById('app');
const show = (...nodes) => { app.replaceChildren(...nodes.flat().filter(n => n != null && n !== false)); window.scrollTo(0, 0); };
const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const pct = x => (x == null ? '—' : Math.round(x * 100) + '%');
const LETTERS = 'ABCD';

/* ---------- connection banner ---------- */
const net = document.getElementById('net');
const setNet = () => { net.hidden = navigator.onLine; };
window.addEventListener('online', setNet); window.addEventListener('offline', setNet); setNet();

/* ---------- data ---------- */
let user = null, role = null, S = null, settings = {}, unsubs = [], run = null, loadedOnce = false;
const studentDoc = () => doc(db, 'sat_students', STUDENT_UID);
const settingsDoc = () => doc(db, 'sat_settings', 'app');
let saveTimer = null;
// Every change stamps updatedAt right away; the write follows shortly, or immediately on finish / when the app is hidden.
function save(now = false) { S.updatedAt = Date.now(); clearTimeout(saveTimer); if (now) return flush(); saveTimer = setTimeout(flush, 500); }
function flush() {
  clearTimeout(saveTimer); saveTimer = null;
  if (!S || !user) return;
  setDoc(studentDoc(), JSON.parse(JSON.stringify(S))).catch(e => { console.error(e); showSaveError(e); });
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer) flush(); });
window.addEventListener('pagehide', () => { if (saveTimer) flush(); });
function showSaveError(e) {
  if (document.getElementById('saveerr')) return;
  app.prepend(h('p', { class: 'err', id: 'saveerr' }, 'Progress isn\'t saving: ', e && e.code === 'permission-denied' ? 'the database rules are blocking it. Ask Mom to check the Firestore rules.' : 'it will retry when you\'re back online.'));
}
const runKey = () => 'sat-run-' + (user && user.uid);
const saveRun = () => { try { if (run) localStorage.setItem(runKey(), JSON.stringify(run)); else localStorage.removeItem(runKey()); } catch (e) {} };
const loadRun = () => { try { return JSON.parse(localStorage.getItem(runKey()) || 'null'); } catch (e) { return null; } };

onAuthStateChanged(auth, u => {
  unsubs.forEach(f => f()); unsubs = []; user = u; S = null; loadedOnce = false; run = null;
  if (!u) { role = null; return renderLogin(); }
  role = u.uid === PARENT_UID ? 'parent' : u.uid === STUDENT_UID ? 'student' : 'other';
  if (role === 'other') return show(h('section', { class: 'card' }, h('h2', { text: 'This account isn\'t set up for SAT Practice.' }), h('p', { class: 'small muted', text: `v${APP_VERSION} · signed in as …${u.uid.slice(0, 4)}` }), h('button', { class: 'ghost', onclick: () => signOut(auth) }, 'Sign out')));
  unsubs.push(onSnapshot(settingsDoc(), snap => { settings = snap.exists() ? snap.data() : {}; if (loadedOnce && !run) route(); }, e => console.error(e)));
  unsubs.push(onSnapshot(studentDoc(), snap => {
    if (run) return; // don't disturb a question in progress
    const incoming = snap.exists() ? snap.data() : null;
    if (S && incoming && (incoming.updatedAt || 0) < (S.updatedAt || 0)) return; // an older copy; ours is newer
    if (S && saveTimer) return;
    S = incoming ? Object.assign(blankState(), incoming) : blankState();
    if (!loadedOnce) { loadedOnce = true; route(); } else if (!run) route();
  }, e => { console.error(e); show(h('section', { class: 'card' }, h('h2', { text: 'Can\'t load progress' }), h('p', { class: 'muted', text: e.code === 'permission-denied' ? 'The database rules are blocking this account. Check that the Firestore rules were published.' : 'Check the connection and reload.' }), h('p', { class: 'small muted', text: `v${APP_VERSION} · signed in as …${u.uid.slice(0, 4)} · looking for …${STUDENT_UID.slice(0, 4)}` }), h('button', { class: 'ghost', onclick: () => signOut(auth) }, 'Sign out'))); }));
});

/* ---------- routing ---------- */
let page = 'home', preview = false;
function go(p) { if (p === 'preview') { preview = true; p = 'home'; } if (p === 'parent') { preview = false; p = 'home'; } page = p; route(); }
function route() {
  if (!S) return;
  if (role === 'parent' && !preview) return renderParent();
  if (run) return renderRun();
  renderHome();
}

/* ---------- login ---------- */
function renderLogin() {
  const email = h('input', { type: 'email', id: 'email', autocomplete: 'username', autocapitalize: 'off', placeholder: 'Email' });
  const pw = h('input', { type: 'password', id: 'pw', autocomplete: 'current-password', placeholder: 'Password' });
  const err = h('p', { class: 'err', hidden: true });
  const btn = h('button', { class: 'main', type: 'submit' }, 'Sign in');
  show(h('form', { class: 'card', onsubmit: async e => {
    e.preventDefault(); btn.disabled = true; err.hidden = true;
    try { await signInWithEmailAndPassword(auth, email.value.trim(), pw.value); }
    catch (x) { err.hidden = false; err.textContent = x.code === 'auth/network-request-failed' ? 'No connection. Sign in once with signal; after that it works offline.' : 'That email or password didn\'t work.'; btn.disabled = false; }
  } }, h('div', { class: 'eyebrow', text: 'SAT Practice' }), h('h1', { text: 'Sign in' }), h('label', { class: 'f' }, 'Email', email), h('label', { class: 'f' }, 'Password', pw), err, btn));
}

/* ---------- student home ---------- */
const today = () => dayNum();
function countdown() {
  if (!settings.testDate) return null;
  const d = dayFromISO(settings.testDate) - today();
  if (d < 0) return null;
  return h('section', { class: 'card' }, h('div', { class: 'spread' }, h('div', {}, h('div', { class: 'eyebrow', text: 'SAT' }), h('div', { text: fmtDate(settings.testDate) })),
    h('div', { class: 'count' }, h('big', { text: d === 0 ? 'Today' : d }), d === 0 ? null : h('span', { class: 'muted', text: d === 1 ? 'day' : 'days' }))),
    d <= 1 ? h('p', { class: 'small muted', text: 'Light warm-up only. Nothing new before the test.' }) : null);
}
function streakCard() {
  const v = streakView(S, today(), settings);
  return h('section', { class: 'card' }, h('div', { class: 'streak' },
    h('div', { class: 'flame' }, h('big', { text: v.count }), h('small', { text: v.count === 1 ? 'day' : 'days' })),
    h('div', {}, h('b', { text: 'Streak' }), ' ', h('span', { class: 'rest', title: 'Rest days saved' }, h('i', { class: v.rest >= 1 ? 'on' : '' }), h('i', { class: v.rest >= 2 ? 'on' : '' }))),
    h('div', { class: 'small muted', text: v.done ? 'Done today ✓' : v.off ? `${v.off}: your streak is safe today.` : v.restNeeded ? 'Practice today: a rest day covers the missed day.' : v.atRisk ? 'Practice today to keep it going.' : v.broken ? `Streak reset (was ${v.broken}). Start a new one today.` : 'Finish a session to start a streak.' })));
}
function renderHome() {
  const v = streakView(S, today(), settings), saved = loadRun();
  const name = settings.name || 'Winston';
  const T = SESSION_TYPES;
  show(
    h('div', { class: 'top' }, h('h1', { text: `Hi${name ? ', ' + name : ''}` }), role === 'parent' ? h('button', { class: 'back', onclick: () => go('parent') }, 'Parent view') : null),
    preview ? h('p', { class: 'chip gold', text: 'Preview of Winston\'s home · anything you answer counts as his' }) : null,
    countdown(),
    saved && saved.uid === user.uid ? h('button', { class: 'btn hero', onclick: () => { run = saved; renderRun(); } }, h('b', { text: 'Resume ' + saved.sess.title }), h('span', { text: `Question ${saved.idx + 1} of ${saved.deck.length}` })) : null,
    h('button', { class: 'btn ' + (v.done ? 'done' : 'hero'), onclick: () => start('daily') }, h('b', { text: v.done ? "Today's practice done ✓" : "Start today's practice" }), h('span', { text: v.done ? 'Want more? Run another round.' : T.daily.desc })),
    h('div', { class: 'grid2' },
      ['en', 'math', 'reps', 'full'].map(k => h('button', { class: 'btn', onclick: () => start(k) }, h('b', { text: T[k].title }), h('span', { text: T[k].desc })))),
    streakCard(),
    h('section', { class: 'card' }, h('h2', { text: 'Every question' }), h('ul', { class: 'list' },
      h('li', {}, h('span', { class: 'pill ok', text: 'Math' }), h('div', { text: 'Ask first: write what it asks for on your paper. Then type it into Desmos, even if it looks easy.' })),
      h('li', {}, h('span', { class: 'pill ok', text: 'Punct.' }), h('div', { text: 'Choices differ only in punctuation? Split the boundary: can each side stand alone?' })),
      h('li', {}, h('span', { class: 'pill ok', text: 'Verbs' }), h('div', { text: 'Choices are forms of one verb? Find the real subject first, not the nearest noun.' })))),
    h('div', { class: 'row', style: 'justify-content:center' }, role === 'parent' ? null : h('button', { class: 'linkbtn', onclick: () => signOut(auth) }, 'Sign out'), h('span', { class: 'small muted', text: 'v' + APP_VERSION })));
}

/* ---------- running a session ---------- */
function start(type) {
  const sess = buildSession(type, S, settings, today());
  run = { uid: user.uid, sess: { type, title: sess.title, counts: sess.counts }, deck: sess.specs, idx: 0, results: [], follows: {}, misses: {}, taught: {} };
  saveRun(); renderRun();
}
let cs = null; // the card on screen: { card, step, firsts, wrongFirst, tries, sel, phase }
if (new URLSearchParams(location.search).has('debug')) window.__sat = { cs: () => cs, state: () => S, run: () => run };
function renderRun() {
  if (run.idx >= run.deck.length) return finishRun();
  const sp = run.deck[run.idx];
  if (!cs || cs.spec !== sp) { const card = cardFromSpec(sp); cs = { spec: sp, card, step: 0, firsts: [], wrongFirst: null, tries: 0, sel: [], phase: 'answer', fb: null }; }
  draw();
}
function confirmQuit() {
  show(h('section', { class: 'card' }, h('h2', { text: 'Stop for now?' }), h('p', { class: 'muted', text: 'Answers so far are saved. You can resume from the home screen.' }),
    h('div', { class: 'actions' }, h('button', { class: 'main', onclick: () => { run = null; cs = null; go('home'); } }, 'Stop for now'), h('button', { class: 'ghost', onclick: () => draw() }, 'Keep going'))));
}
function stemView(card) {
  const st = card.stem;
  if (st.kind === 'math') return h('p', { class: 'mathstem', text: st.text });
  if (st.kind === 'rule') return h('p', { class: 'rulestem', text: st.text });
  const cur = card.steps[cs.step];
  const split = card.split && (cs.phase === 'done' || (cur && cur.tag !== 'trigger'));
  return h('div', {},
    h('p', { class: 'sentence' }, split ? h('span', { class: 'side l', text: st.before }) : st.before, h('span', { class: 'blank', 'aria-label': 'blank' }), split ? h('span', { class: 'side r', text: st.after }) : st.after),
    split ? h('div', { class: 'legend', style: 'margin-top:6px' }, h('span', {}, h('i', { class: 'sw l' }), 'Left side'), h('span', {}, h('i', { class: 'sw r' }), 'Right side')) : null);
}
function lockedChoices(card) {
  const st = card.stem; if (st.kind !== 'sentence') return null;
  const ansIdx = card.steps.findIndex(s => s.tag === 'answer');
  if (ansIdx >= 0 && (cs.step >= ansIdx || cs.phase === 'done')) return null; // shown as buttons in the answer step
  return h('div', { class: 'locked' }, h('div', { class: 'eyebrow', text: 'Choices' }), h('ol', {}, st.choices.map(c => h('li', { text: c }))),
    ansIdx >= 0 ? h('div', { class: 'note', text: cs.mustSteps ? '🔒 Unlocks after step 1.' : '🔒 Unlocks after step 1, or tap "Skip to answer."' }) : null);
}
function doneStepLine(card, i) {
  const st = card.steps[i];
  if (cs.firsts[i] === null) return h('div', { class: 'done-step skip' }, h('span', { class: 'tick', text: '→' }), h('div', {}, h('b', { text: (st.title || 'Step') + ': ' }), 'skipped'));
  const vals = st.fields.map(f => f.answer);
  return h('div', { class: 'done-step' + (cs.firsts[i] ? '' : ' redo') }, h('span', { class: 'tick', text: cs.firsts[i] ? '✓' : '↺' }),
    h('div', {}, h('b', { text: (st.title || 'Step') + ': ' }), st.fields.map((f, j) => `${f.label}: ${vals[j]}`).join(' · ')));
}
function draw() {
  const card = cs.card, sp = cs.spec;
  const ahead = run.deck.slice(run.idx + 1).filter(d => d.follow).length;
  const top = h('div', { class: 'prog' }, h('div', { class: 'spread small muted' }, h('span', { text: `${run.idx + 1} of ${run.deck.length}${ahead ? ` · ${ahead} coming back` : ''}` }), h('button', { class: 'linkbtn', onclick: confirmQuit }, 'Exit')),
    h('div', { class: 'bar' }, h('i', { style: `width:${Math.round(100 * run.idx / run.deck.length)}%` })));
  if (card.teach) return drawTeach(top);
  const subj = card.subject === 'math' ? 'Math' : 'Reading & Writing';
  const head = h('div', { class: 'row' }, h('span', { class: 'chip' + (sp.follow ? ' back' : ''), text: sp.follow ? 'Coming back · new question' : card.chip }), h('span', { class: 'chip subj', text: subj }));
  const parts = [head, card.instr ? h('p', { class: 'instr', text: card.instr }) : null, stemView(card), lockedChoices(card)];
  if (card.desmos) parts.push(h('a', { class: 'ghost sm desmos', href: DESMOS_URL, target: '_blank', rel: 'noopener' }, 'Open Desmos ↗'));
  const multi = card.steps.length > 1;
  for (let i = 0; i < cs.step; i++) parts.push(doneStepLine(card, i));
  const btn = h('button', { class: 'main', id: 'go' });
  if (cs.phase !== 'done' && cs.step < card.steps.length) {
    const st = card.steps[cs.step];
    const inputs = [];
    const stepEl = h('div', { class: multi ? 'step' : 'step', style: multi ? '' : 'border-top:0;padding-top:0' },
      multi ? h('h3', {}, h('span', { class: 'n', text: cs.step + 1 }), st.title) : null,
      st.instr ? h('p', { class: 'instr', text: st.instr }) : null,
      st.askReminder ? h('div', { class: 'askrem' }, 'Your ask: ', h('b', { text: st.askReminder }), '. Look at it before you answer.') : null,
      h('div', { class: 'fields' }, st.fields.map((f, i) => { const el = fieldView(st, f, i); inputs.push(el); return h('div', { class: 'f' }, f.label, el); })));
    parts.push(stepEl);
    if (cs.banner && cs.step === 0 && !cs.fb) parts.push(cs.banner);
    if (cs.fb) parts.push(cs.fb);
    btn.textContent = cs.phase === 'reveal' ? 'Continue' : 'Check';
    btn.onclick = () => (cs.phase === 'reveal' ? advance() : check(st));
    cs.inputs = inputs;
  } else {
    if (cs.fb) parts.push(cs.fb);
    btn.textContent = 'Next'; btn.onclick = nextCard;
  }
  // Full questions: he may skip the steps and answer directly. Right → move on. Wrong → the steps unlock and he works them.
  const ansIdx = card.steps.findIndex(s => s.tag === 'answer');
  const canSkip = card.mode === 'full' && ansIdx > 0 && cs.step < ansIdx && cs.phase === 'answer' && !cs.mustSteps && cs.firsts[cs.step] == null;
  const skipBtn = canSkip ? h('button', { class: 'ghost', onclick: () => skipToAnswer(ansIdx) }, 'Skip to answer') : null;
  show(top, h('section', { class: 'card' }, parts, h('div', { class: 'actions' }, btn, skipBtn)));
  if (cs.phase === 'done') setTimeout(() => btn.focus(), 0);
  else { const t = app.querySelector('input[type=text]:not([readonly])'); if (t) setTimeout(() => t.focus(), 30); }
}
function fieldView(st, f, i) {
  if (f.typed) {
    const inp = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: f.ph || '', value: cs.sel[i] || '' });
    inp.addEventListener('input', () => { cs.sel[i] = inp.value; });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('go').click(); } });
    if (cs.mark && cs.mark[i]) inp.classList.add(cs.mark[i]);
    return inp;
  }
  return h('div', { class: 'choices' + (f.long ? ' long' : ''), role: 'group' }, f.choices.map((c, k) => {
    const cls = ['opt']; if (f.mono) cls.push('mono');
    if (cs.sel[i] === c) cls.push(cs.mark && cs.mark[i] ? cs.mark[i] : 'sel');
    const b = h('button', { type: 'button', class: cls.join(' '), onclick: () => { if (cs.phase === 'reveal') return; cs.sel[i] = c; if (cs.mark) cs.mark[i] = null; draw(); } },
      f.long && st.tag === 'answer' ? h('span', { class: 'L', text: LETTERS[k] + ')' }) : null, h('span', { text: c }));
    if (cs.phase === 'reveal') b.disabled = true;
    return b;
  }));
}
let lastCheck = 0;
function check(st) {
  if (Date.now() - lastCheck < 250) return;
  if (st.fields.some((f, i) => !String(cs.sel[i] ?? '').trim())) { cs.fb = h('p', { class: 'small muted', text: st.fields.length > 1 ? 'Answer every part first.' : 'Pick an answer first.' }); return draw(); }
  lastCheck = Date.now();
  const ok = checkStep(st, cs.sel);
  const first = cs.firsts[cs.step] == null;
  if (first) { cs.firsts[cs.step] = ok.every(Boolean); if (!ok.every(Boolean) && st.tag === 'answer') cs.wrongFirst = cs.sel.join(' / '); if (!ok.every(Boolean) && !cs.firstMissTag) cs.firstMissTag = st.tag; }
  if (ok.every(Boolean)) {
    cs.mark = null; cs.fb = null;
    if (!first) cs.fb = null;
    return advance();
  }
  if (cs.skipped && st.tag === 'answer' && !cs.mustSteps) {
    cs.mustSteps = true; cs.wrongAfterSkip = true; cs.step = 0; cs.sel = []; cs.mark = null; cs.tries = 0;
    for (let i = 0; i < cs.card.steps.length - 1; i++) cs.firsts[i] = undefined;
    cs.fb = null; cs.banner = h('div', { class: 'fb bad' }, h('h3', { text: 'Not this one.' }), h('p', { text: 'Work it step by step, then answer again.' }));
    return draw();
  }
  cs.tries++;
  cs.mark = ok.map(o => (o ? 'ok' : 'bad'));
  if (cs.tries >= 3) { // stop, show the answer, move on (it is already queued to come back)
    st.fields.forEach((f, i) => { if (!ok[i]) { cs.sel[i] = f.answer; cs.mark[i] = 'shown'; } });
    cs.phase = 'reveal';
    cs.fb = h('div', { class: 'fb shown' }, h('h3', { text: 'Here\'s the answer' }), st.fields.map((f, i) => h('p', { class: 'ans' }, `${f.label}: `, f.answer)), h('p', { text: st.why() }), h('p', { class: 'small muted', text: 'This one comes back later in a new question.' }));
    return draw();
  }
  cs.fb = h('div', { class: 'fb bad' }, h('h3', { text: 'Nope, actually:' }),
    st.fields.map((f, i) => (ok[i] ? null : h('p', { class: 'ans' }, `${f.label}: ${f.answer}`))), h('p', { text: st.why() }),
    h('p', { class: 'small muted', text: st.fields.some((f, i) => !ok[i] && f.typed) ? 'Type the right answer to keep going.' : 'Tap the right answer to keep going.' }));
  st.fields.forEach((f, i) => { if (!ok[i]) { if (f.typed) cs.sel[i] = ''; } });
  draw();
}
function skipToAnswer(ansIdx) {
  for (let i = cs.step; i < ansIdx; i++) cs.firsts[i] = null;
  cs.skipped = true; cs.step = ansIdx; cs.sel = []; cs.mark = null; cs.tries = 0; cs.fb = null; draw();
}
function advance() {
  const card = cs.card;
  cs.step++; cs.sel = []; cs.mark = null; cs.tries = 0;
  if (cs.phase === 'reveal') cs.phase = 'answer';
  if (cs.step >= card.steps.length) { cs.phase = 'done'; finishCard(); }
  else { cs.fb = null; draw(); }
}
function finishCard() {
  const card = cs.card, sp = cs.spec, t = today();
  const ansIdx = card.steps.findIndex(s => s.tag === 'answer');
  const full = card.mode === 'full' && ansIdx > 0;
  // Full questions are judged by the answer. A missed step with a right answer doesn't repeat today; it carries to a later session.
  const ok = full ? cs.firsts[ansIdx] === true : cs.firsts.every(Boolean);
  const procMiss = full && ok && cs.firsts.slice(0, ansIdx).some(x => x === false);
  const missedStep = procMiss ? card.steps[cs.firsts.findIndex(x => x === false)] : null;
  recordCard(S, card, ok, cs.firsts.map(x => (x === undefined ? null : x)), t, procMiss);
  run.results.push({ skill: card.skill, mode: card.mode, ok, procMiss, skipped: !!cs.skipped, follow: !!sp.follow, lure: !!card.lure, summary: card.summary,
    correct: (() => { const i = cs.firsts.findIndex(x => x === false); const st = card.steps[i >= 0 ? i : card.steps.length - 1]; return (i >= 0 && card.steps.length > 1 ? (st.title || st.tag) + ' → ' : '') + st.fields.map(f => f.answer).join(' / '); })(), wrongFirst: cs.wrongFirst, steps: card.steps.map((s, i) => [s.tag, cs.firsts[i] == null ? null : !!cs.firsts[i]]) });
  if (!ok) {
    const skill = skillOfSpec(sp);
    const nF = run.follows[skill] || 0;
    if (nF < 2) { run.follows[skill] = nF + 1; const f = followUp(sp, S); run.deck.splice(followPos(run.deck, run.idx, skill), 0, f); }
    if (!card.lure) {
      run.misses[card.skill] = (run.misses[card.skill] || 0) + 1;
      if (run.misses[card.skill] >= 2 && !run.taught[card.skill]) { run.taught[card.skill] = true; run.deck.splice(run.idx + 1, 0, { t: 'teach', skill: card.skill }); }
    }
  }
  save(); saveRun();
  cs.fb = procMiss ? h('div', { class: 'fb ok' }, h('h3', { text: 'Right answer ✓' }), h('p', { class: 'small muted', text: `${missedStep.title} will come up again in another session.` }))
    : ok ? h('div', { class: 'fb ok' }, h('h3', { text: cs.skipped ? 'Correct ✓ (skipped the steps)' : 'Correct' })) : (cs.fb && cs.fb.classList.contains('shown') ? cs.fb : h('div', { class: 'fb bad' }, h('h3', { text: 'Fixed it ✓' }), h('p', { class: 'small muted', text: 'This skill comes back later in a new question.' })));
  draw();
}
function drawTeach(top) {
  const card = cs.card;
  show(top, h('section', { class: 'card teach' }, h('span', { class: 'chip back', text: 'Step by step' }), h('h2', { text: card.title }),
    h('p', { class: 'small muted', text: 'Two misses on this one. Read each step, then keep going.' }),
    h('ol', {}, card.teachSteps.map(s => h('li', { text: s }))),
    h('div', { class: 'actions' }, h('button', { class: 'main', onclick: () => { run.results.push({ teach: true, skill: card.skill, steps: [] }); saveRun(); nextCard(); } }, 'Got it'))));
}
function nextCard() { run.idx++; cs = null; saveRun(); renderRun(); }

async function copyText(txt, btn) {
  try { await navigator.clipboard.writeText(txt); btn.textContent = 'Copied ✓'; }
  catch (e) { const ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = txt; document.body.append(ta); ta.select(); try { document.execCommand('copy'); btn.textContent = 'Copied ✓'; } catch (x) { btn.textContent = 'Select the text above to copy'; } ta.remove(); }
  setTimeout(() => { btn.textContent = 'Copy report'; }, 2500);
}
function finishRun() {
  const r = run, t = today(); run = null; cs = null; saveRun();
  const sum = summarize(r, t);
  S.sessions = (S.sessions || []).concat([sum]).slice(-80);
  let streakNote = null;
  if (r.sess.counts && sum.n >= 10) { const before = S.streak.last === t; const out = completeDay(S, t, settings); if (!before && out.earnedRest) streakNote = 'You earned a rest day (7 days in a row).'; }
  save(true);
  const txt = reportText(sum, settings.name);
  const cbtn = h('button', { class: 'ghost', onclick: e => copyText(txt, e.currentTarget) }, 'Copy report');
  const missed = r.results.filter(x => !x.ok && !x.follow && !x.teach);
  show(h('section', { class: 'card' }, h('span', { class: 'chip', text: `${r.sess.title} done` }),
    h('div', {}, h('p', { class: 'eyebrow', text: 'First try' }), h('p', { class: 'big', text: `${sum.right} / ${sum.n}` })),
    h('div', { class: 'statgrid' }, MODES.filter(m => sum.modes[m]).map(m => h('div', { class: 'stat' }, h('b', { text: `${sum.modes[m][0]}/${sum.modes[m][1]}` }), h('span', { text: MODE_SHORT[m] })))),
    streakNote ? h('p', { class: 'small', text: streakNote }) : null,
    missed.length ? h('div', {}, h('h2', { text: 'Missed the first time' }), h('ul', { class: 'list' }, missed.map(x => h('li', {}, h('span', { class: 'pill bad', text: 'Missed' }), h('div', {}, h('div', { text: x.summary }), h('div', { class: 'small muted' }, 'Right: ', h('b', { text: x.correct }))))))) : h('p', { text: 'No misses.' }),
    h('details', {}, h('summary', { class: 'small muted', text: 'Report for Mom' }), h('pre', { class: 'report', text: txt })),
    h('div', { class: 'actions' }, h('button', { class: 'main', onclick: () => go('home') }, 'Home'), cbtn)));
}

/* ---------- parent ---------- */
const accCls = a => (a == null ? 'n' : a >= 0.85 ? 'g' : a >= 0.7 ? 'm' : 'b');
function renderParent() {
  const t = today(), v = streakView(S, t, settings);
  const sessions = (S.sessions || []).slice().reverse();
  const days = new Set((S.sessions || []).map(s => s.day));
  const last = sessions[0];
  const skillRow = id => { const s = S.skills[id] || {}; const cells = MODES.map(m => { const a = acc(s[m], 10), n = (s[m] || []).length; return h('td', { class: accCls(a), title: n ? `last ${Math.min(n, 10)}` : '' }, n ? pct(a) : '—'); });
    return h('tr', {}, h('td', {}, SKILL[id].name, s.owed ? h('span', { class: 'pill mid', style: 'margin-left:6px', text: 'carry over' }) : null), ...cells); };
  const skillTable = subj => h('div', { class: 'tw' }, h('table', { class: 'sk' }, h('tr', {}, h('th', { text: subj === 'en' ? 'Reading & Writing' : 'Math' }), MODES.map(m => h('th', { text: MODE_SHORT[m] }))),
    ALL_SKILLS.filter(s => s.subject === subj).map(s => skillRow(s.id))));
  show(
    h('div', { class: 'top' }, h('h1', { text: 'Parent view' }), h('button', { class: 'linkbtn', onclick: () => signOut(auth) }, 'Sign out')),
    h('section', { class: 'card' },
      h('div', { class: 'spread' }, h('h2', { text: v.done ? 'Practiced today ✓' : 'Not practiced yet today' }), h('span', { class: 'pill ' + (v.done ? 'good' : 'mid'), text: `${v.count}-day streak` })),
      h('p', { class: 'small muted', text: last ? `Last session ${fmtDate(isoFromDay(last.day))}: ${last.title}, ${last.right}/${last.n} first try.` : 'No sessions yet.' }),
      h('div', {}, h('div', { class: 'eyebrow', text: 'Last 21 days' }), h('div', { class: 'days', style: 'margin-top:6px' }, Array.from({ length: 21 }, (_, i) => t - 20 + i).map(d => h('i', { class: days.has(d) ? 'on' : '', title: isoFromDay(d) }))))),
    h('section', { class: 'card' }, h('h2', { text: 'Goal actions' }), h('p', { class: 'small muted', text: 'First-try accuracy on each action, last 20 times.' }),
      h('ul', { class: 'list' }, GOAL_TAGS.map(tag => { const hst = S.goals[tag] || [], a = acc(hst, 20); return h('li', {}, h('span', { class: 'pill ' + ({ g: 'good', m: 'mid', b: 'bad', n: 'none' })[accCls(a)], text: hst.length ? pct(a) : '—' }), h('div', {}, GOAL_LABEL[tag], h('span', { class: 'small muted', text: hst.length ? ` · ${hst.length} tries` : '' }))); }))),
    h('section', { class: 'card' }, h('h2', { text: 'Skills by mode' }), h('p', { class: 'small muted', text: 'First-try accuracy, last 10 per mode. "Carry over" = missed recently; it is put first in his next sessions.' }), skillTable('en'), skillTable('math')),
    h('section', { class: 'card' }, h('h2', { text: 'Sessions' }), sessions.length ? h('ul', { class: 'list' }, sessions.slice(0, 15).map(s => {
      const txt = reportText(s, settings.name); const b = h('button', { class: 'ghost sm', onclick: e => copyText(txt, e.currentTarget) }, 'Copy report');
      return h('li', {}, h('span', { class: 'pill ' + (s.n && s.right / s.n >= 0.85 ? 'good' : s.n && s.right / s.n >= 0.7 ? 'mid' : 'bad'), text: `${s.right}/${s.n}` }), h('div', {}, h('div', { text: `${fmtDate(isoFromDay(s.day))} · ${s.title}` }), h('details', {}, h('summary', { class: 'small muted', text: 'Show report' }), h('pre', { class: 'report', text: txt }))), b);
    })) : h('p', { class: 'small muted', text: 'Reports show up here after each session.' })),
    settingsCard(),
    h('section', { class: 'card' }, h('h2', { text: 'Backup' }), h('p', { class: 'small muted', text: 'Saves a copy of all progress to this device.' }), h('button', { class: 'ghost', onclick: download }, 'Download progress')),
    h('button', { class: 'btn', onclick: () => go('preview') }, h('b', { text: 'See Winston\'s home screen' }), h('span', { text: 'Anything you practice here counts as his.' })),
    h('p', { class: 'small muted center', text: 'v' + APP_VERSION }));
}
function settingsCard() {
  const s = JSON.parse(JSON.stringify(settings || {}));
  const mix = { ...DEFAULT_MIX, ...(s.mix || {}) };
  s.offDays = s.offDays || [];
  const name = h('input', { type: 'text', value: s.name || '', placeholder: 'Winston' });
  const test = h('input', { type: 'date', value: s.testDate || '' });
  const mixIn = Object.fromEntries(MODES.map(m => [m, h('input', { type: 'number', min: 0, max: 100, step: 5, value: mix[m] })]));
  const share = h('input', { type: 'number', min: 0, max: 100, step: 5, value: s.enShare ?? 50 });
  const off = h('input', { type: 'date' });
  const msg = h('p', { class: 'small muted', hidden: true });
  const persist = async () => {
    s.name = name.value.trim(); s.testDate = test.value || null;
    s.mix = Object.fromEntries(MODES.map(m => [m, Math.max(0, Number(mixIn[m].value) || 0)]));
    if (!Object.values(s.mix).some(x => x > 0)) s.mix = { ...DEFAULT_MIX };
    s.enShare = Math.min(100, Math.max(0, Number(share.value) || 0));
    try { await setDoc(settingsDoc(), s); settings = s; msg.hidden = false; msg.textContent = 'Saved.'; } catch (e) { msg.hidden = false; msg.textContent = 'Couldn\'t save: ' + (e.code || e.message); }
  };
  return h('section', { class: 'card' }, h('h2', { text: 'Settings' }),
    h('label', { class: 'f' }, 'His name (shown on his home screen)', name),
    h('label', { class: 'f' }, 'Next SAT date (countdown + streak-safe day)', test),
    h('div', {}, h('div', { class: 'eyebrow', text: 'Mode mix (relative weights)' }), h('p', { class: 'small muted', text: 'Starting point for each skill. A skill shifts toward full questions on its own once his decoding is solid (85%+), and back toward decoding when it slips.' }),
      h('div', { class: 'mixrow' }, MODES.map(m => h('label', { class: 'f' }, MODE_LABEL[m], mixIn[m])))),
    h('label', { class: 'f' }, 'English share in mixed sessions (%)', share),
    h('div', {}, h('div', { class: 'eyebrow', text: 'Days off (streak-safe)' }), h('p', { class: 'small muted', text: 'Federal holidays are built in.' }),
      s.offDays.length ? h('ul', { class: 'list' }, s.offDays.slice().sort().map(d => h('li', {}, h('div', { text: fmtDate(d) }), h('button', { class: 'linkbtn', onclick: () => { s.offDays = s.offDays.filter(x => x !== d); settings = s; setDoc(settingsDoc(), s).then(route); } }, 'Remove')))) : null,
      h('div', { class: 'row', style: 'margin-top:8px' }, off, h('button', { class: 'ghost sm', onclick: () => { if (!off.value) return; s.offDays = [...new Set([...s.offDays, off.value])]; settings = s; setDoc(settingsDoc(), s).then(route); } }, 'Add day off'))),
    h('div', { class: 'actions' }, h('button', { class: 'main', onclick: persist }, 'Save settings')), msg);
}
function download() {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings, progress: S }, null, 1)], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `sat-progress-${isoFromDay(today())}.json` }); document.body.append(a); a.click(); a.remove();
}
