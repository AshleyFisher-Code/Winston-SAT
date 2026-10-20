// Math question generators. Each takes a seed and returns the same question every time.
// A question has three layers, matching the three practice modes:
//   ask  — what the question asks for (his Oct 3 goal "Ask first")
//   eq   — what to type into Desmos (goal "Then Desmos")
//   ans  — the final answer, with the wrong-quantity trap among the choices
import { rng, ri, pickR, shuffleR, fmt, money } from './util.js';

/* ---------- formatting ---------- */
// Linear term for display: 4x + 7, −x − 3
export function lin(a, b, v = 'x') {
  const head = a === 1 ? v : a === -1 ? '−' + v : fmt(a) + v;
  if (!b) return head;
  return `${head} ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))}`;
}
// Same thing, the way you type it into Desmos: 4x+7, -x-3
export function dlin(a, b, v = 'x') {
  const head = a === 1 ? v : a === -1 ? '-' + v : String(a) + v;
  if (!b) return head;
  return `${head}${b < 0 ? '-' : '+'}${Math.abs(b)}`;
}
const dterm = (a, v, first) => (a === 0 ? '' : (a < 0 ? '-' : first ? '' : '+') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + v);
const term = (a, v, first) => (a === 0 ? '' : (a < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ') + (Math.abs(a) === 1 ? '' : fmt(Math.abs(a))) + v);
const dnum = n => String(Math.round(n * 1e6) / 1e6);

// Three distinct wrong options that differ from the right one (compared by key).
function three(right, pool, key = x => String(x)) {
  const seen = new Set([key(right)]), out = [];
  for (const p of pool) { if (p == null || (typeof p === 'number' && !Number.isFinite(p))) continue; const k = key(p); if (seen.has(k)) continue; seen.add(k); out.push(p); if (out.length === 3) break; }
  if (out.length < 3) throw new Error('not enough distinct options');
  return out;
}
const nkey = n => String(Math.round(n * 1000) / 1000);
const rnd = v => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);
function layer(r, correct, wrongPool, key) {
  correct = rnd(correct); wrongPool = wrongPool.map(rnd);
  const wrong = three(correct, wrongPool, key);
  return { correct, opts: shuffleR(r, [correct, ...wrong]) };
}

export const MATH_SKILLS = [
  { id: 'm-expr', name: 'Solve for an expression (kx, not x)', short: 'Expression, not x' },
  { id: 'm-linword', name: 'Linear word problems (fee + rate)', short: 'Fee + rate' },
  { id: 'm-system', name: 'Systems of two equations', short: 'Systems' },
  { id: 'm-percent', name: 'Percent increase, decrease, and part of a whole', short: 'Percents' },
  { id: 'm-func', name: 'Functions: input vs. output', short: 'f(x) input/output' },
  { id: 'm-quad', name: 'Quadratics: which solution they want', short: 'Quadratics' },
  { id: 'm-exp', name: 'Exponential growth', short: 'Exponential growth' },
  { id: 'm-ratio', name: 'Ratios and proportions', short: 'Ratios' },
];

/* ---------- generators ---------- */
const G = {};

G['m-expr'] = r => {
  const a = ri(r, 2, 9), x = ri(r, 2, 12), b = ri(r, 3, 30) * (r() < 0.35 ? -1 : 1);
  const k = pickR(r, [2, 3, 4, 5, 6].filter(n => n !== a));
  const c = a * x + b;
  return {
    stem: `If ${lin(a, b)} = ${fmt(c)}, what is the value of ${k}x?`,
    ask: layer(r, `the value of ${k}x`, ['the value of x', `the value of ${a}x`, `the value of ${lin(a, b)}`]),
    eq: layer(r, `${dlin(a, b)}=${c}`, [`${dlin(a, -b)}=${c}`, `${a}(x${b < 0 ? '-' : '+'}${Math.abs(b)})=${c}`, `${dlin(k, b)}=${c}`, `${dlin(a, b)}=${-c}`]),
    ans: layer(r, k * x, [x, a * x, c, k * x + b, x + k], nkey),
    why: `Desmos gives x = ${fmt(x)}. The question asks for ${k}x: ${k} × ${fmt(x)} = ${fmt(k * x)}.`,
  };
};

const FEES = [
  { intro: (F, R) => `A plumber charges a flat fee of ${money(F)} plus ${money(R)} for each hour of work.`, unit: 'hour', units: 'hours', worked: 'did the plumber work', costFor: n => `for a job that takes ${n} hours`, rate: 'cost per hour', fee: 'flat fee' },
  { intro: (F, R) => `A climbing gym charges a one-time sign-up fee of ${money(F)} plus ${money(R)} per month of membership.`, unit: 'month', units: 'months', worked: 'has the member paid for', costFor: n => `for ${n} months of membership, including the sign-up fee`, rate: 'cost per month', fee: 'sign-up fee' },
  { intro: (F, R) => `A print shop charges a setup fee of ${money(F)} plus ${money(R)} for each poster printed.`, unit: 'poster', units: 'posters', worked: 'were printed', costFor: n => `for printing ${n} posters`, rate: 'cost per poster', fee: 'setup fee' },
  { intro: (F, R) => `A caterer charges a delivery fee of ${money(F)} plus ${money(R)} per guest.`, unit: 'guest', units: 'guests', worked: 'attended', costFor: n => `for an event with ${n} guests`, rate: 'cost per guest', fee: 'delivery fee' },
  { intro: (F, R) => `A boat rental company charges ${money(F)} to reserve a boat plus ${money(R)} for each hour the boat is used.`, unit: 'hour', units: 'hours', worked: 'was the boat used', costFor: n => `to reserve a boat and use it for ${n} hours`, rate: 'cost per hour', fee: 'reservation charge' },
];
G['m-linword'] = r => {
  const ctx = pickR(r, FEES), R = ri(r, 6, 45), m = ri(r, 2, 8), F = R * m;
  if (r() < 0.5) {
    const x = ri(r, 3, 14), T = F + R * x;
    return {
      stem: `${ctx.intro(F, R)} A customer's total bill was ${money(T)}. How many ${ctx.units} ${ctx.worked}?`,
      ask: layer(r, `the number of ${ctx.units}`, ['the total bill', `the ${ctx.rate}`, `the ${ctx.fee}`]),
      eq: layer(r, `${F}+${R}x=${T}`, [`${R}+${F}x=${T}`, `${R}x=${T}`, `${F}x+${R}x=${T}`]),
      ans: layer(r, x, [x + m, x + 2 * m, R * x], nkey),
      why: `${fmt(F)} + ${fmt(R)}x = ${fmt(T)} gives x = ${fmt(x)} ${x === 1 ? ctx.unit : ctx.units}.`,
    };
  }
  const n = ri(r, 3, 15), T = F + R * n;
  return {
    stem: `${ctx.intro(F, R)} What is the total cost, in dollars, ${ctx.costFor(n)}?`,
    ask: layer(r, 'the total cost', [`the number of ${ctx.units}`, `the ${ctx.rate}`, `the ${ctx.fee}`]),
    eq: layer(r, `y=${F}+${R}x`, [`y=${R}+${F}x`, `y=${R}x`, `y=(${F}+${R})x`]),
    ans: layer(r, T, [R * n, R + F * n, (F + R) * n], nkey),
    why: `Total = ${fmt(F)} + ${fmt(R)}(${n}) = ${fmt(T)}. The fee is paid once; the rate is paid ${n} times.`,
  };
};

G['m-system'] = r => {
  let x, y, a1, b1, a2, b2, tries = 0;
  do {
    x = ri(r, -6, 9); y = ri(r, -6, 9);
    a1 = ri(r, 1, 5); b1 = ri(r, 1, 5) * (r() < 0.4 ? -1 : 1);
    a2 = ri(r, 1, 5) * (r() < 0.3 ? -1 : 1); b2 = ri(r, 1, 5) * (r() < 0.5 ? -1 : 1);
    tries++;
  } while ((x === 0 || y === 0 || x === y || x === -y || a1 * b2 - a2 * b1 === 0 || (a1 === a2 && b1 === b2) || a1 === b1) && tries < 200);
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
  const show = (a, b, c) => `${term(a, 'x', true)}${term(b, 'y', false)} = ${fmt(c)}`;
  const type = (a, b, c) => `${dterm(a, 'x', true)}${dterm(b, 'y', false)}=${c}`;
  const target = pickR(r, ['x', 'y', 'x + y']);
  const val = { x, y, 'x + y': x + y }[target];
  const askAll = { x: 'the value of x', y: 'the value of y', 'x + y': 'the value of x + y' };
  return {
    stem: `${show(a1, b1, c1)}\n${show(a2, b2, c2)}\nIf (x, y) is the solution to the system of equations above, what is the value of ${target}?`,
    ask: layer(r, askAll[target], Object.values(askAll).filter(s => s !== askAll[target]).concat(['the value of xy'])),
    eq: layer(r, `${type(a1, b1, c1)} and ${type(a2, b2, c2)}`, [
      `${type(a1, -b1, c1)} and ${type(a2, b2, c2)}`,
      `${type(a1, b1, c1)} and ${type(a2, b2, -c2)}`,
      `${type(b1, a1, c1)} and ${type(a2, b2, c2)}`,
      `${type(a1, b1, -c1)} and ${type(a2, b2, c2)}`]),
    ans: layer(r, val, [target === 'x' ? y : x, target === 'x + y' ? y : x + y, x - y, x * y, -val], nkey),
    why: `The lines cross at (${fmt(x)}, ${fmt(y)}). The question asks for ${target}${target === 'x + y' ? `: ${fmt(x)} + ${fmt(y)} = ${fmt(x + y)}` : ` = ${fmt(val)}`}.`,
  };
};

G['m-percent'] = r => {
  const v = ri(r, 0, 3);
  if (v <= 1) { // discount: sale price, or the dollar amount of the discount
    const rate = pickR(r, [10, 15, 20, 25, 30, 35, 40]), P = pickR(r, [40, 60, 80, 120, 140, 160, 180, 220, 240, 260, 280, 320, 360, 380]);
    const item = pickR(r, ['jacket', 'pair of headphones', 'bicycle helmet', 'desk lamp', 'backpack', 'tennis racket']);
    const d = rate / 100, sale = P * (1 - d), off = P * d;
    const stem = `A store sells a ${item} for ${money(P)}. During a sale, the price is reduced by ${rate}%.`;
    if (v === 0) return {
      stem: `${stem} What is the sale price, in dollars?`,
      ask: layer(r, 'the sale price', ['the amount of the discount', 'the original price', 'the percent off']),
      eq: layer(r, `y=${P}(1-${dnum(d)})`, [`y=${P}(${dnum(d)})`, `y=${P}(1+${dnum(d)})`, `y=${P}-${rate}`]),
      ans: layer(r, sale, [off, P * (1 + d), P - rate, P - rate / 10], nkey),
      why: `${rate}% off leaves ${100 - rate}% of the price: ${fmt(P)} × ${dnum(1 - d)} = ${fmt(sale)}.`,
    };
    return {
      stem: `${stem} By how many dollars is the price reduced?`,
      ask: layer(r, 'the amount of the discount', ['the sale price', 'the original price', 'the percent off']),
      eq: layer(r, `y=${P}(${dnum(d)})`, [`y=${P}(1-${dnum(d)})`, `y=${P}/${dnum(d)}`, `y=${P}-${rate}`]),
      ans: layer(r, off, [sale, rate, P - rate, off * 2], nkey),
      why: `The discount is ${rate}% of ${fmt(P)}: ${fmt(P)} × ${dnum(d)} = ${fmt(off)}. (${fmt(sale)} is the sale price, not the discount.)`,
    };
  }
  if (v === 2) { // increase
    const rate = pickR(r, [4, 5, 8, 10, 12, 15, 20, 25]), N = ri(r, 12, 96) * 100, d = rate / 100;
    const place = pickR(r, ['town', 'county', 'school district', 'island']);
    const up = N * (1 + d), inc = N * d;
    return {
      stem: `In 2020, the population of a ${place} was ${fmt(N)}. By 2025, the population had increased by ${rate}%. What was the population in 2025?`,
      ask: layer(r, 'the population in 2025', ['the increase in population', 'the population in 2020', 'the percent increase']),
      eq: layer(r, `y=${N}(1+${dnum(d)})`, [`y=${N}(${dnum(d)})`, `y=${N}(1-${dnum(d)})`, `y=${N}+${rate}`]),
      ans: layer(r, up, [inc, N * (1 - d), N + rate], nkey),
      why: `Up ${rate}% means ${100 + rate}% of the start: ${fmt(N)} × ${dnum(1 + d)} = ${fmt(up)}.`,
    };
  }
  // part of a whole: W is p% of what number?
  const p = pickR(r, [15, 20, 25, 35, 40, 60, 75, 80]), X = ri(r, 2, 30) * 20, W = X * p / 100, d = p / 100;
  return {
    stem: `${fmt(W)} is ${p}% of what number?`,
    ask: layer(r, `the number that ${fmt(W)} is ${p}% of`, [`${p}% of ${fmt(W)}`, 'the percent', 'the part']),
    eq: layer(r, `${dnum(d)}x=${W}`, [`x=${dnum(d)}(${W})`, `${W}x=${p}`, `x=${W}+${dnum(d)}`]),
    ans: layer(r, X, [W * d, W + p, W * (1 + d), W / (1 - d)], nkey),
    why: `${dnum(d)}x = ${fmt(W)}, so x = ${fmt(W)} ÷ ${dnum(d)} = ${fmt(X)}.`,
  };
};

G['m-func'] = r => {
  let a = ri(r, 2, 7) * (r() < 0.3 ? -1 : 1), b = ri(r, 1, 15) * (r() < 0.4 ? -1 : 1);
  const fdef = `f(x) = ${lin(a, b)}`;
  if (r() < 0.5) {
    const k = ri(r, 2, 9) * (r() < 0.25 ? -1 : 1), out = a * k + b;
    return {
      stem: `The function f is defined by ${fdef}. What is the value of f(${fmt(k)})?`,
      ask: layer(r, `the output f(${fmt(k)})`, [`the input x where f(x) = ${fmt(k)}`, 'the slope of f', 'the value of f(0)']),
      eq: layer(r, `f(x)=${dlin(a, b)}, then f(${k})`, [`${dlin(a, b)}=${k}`, `f(x)=${a}(x${b < 0 ? '-' : '+'}${Math.abs(b)}), then f(${k})`, `f(x)=${dlin(b, a)}, then f(${k})`]),
      ans: layer(r, out, [a * k, a * (k + b), k + b, b * k + a], nkey),
      why: `Put ${fmt(k)} in for x: ${fmt(a)}(${fmt(k)}) ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))} = ${fmt(out)}.`,
    };
  }
  const t = ri(r, 2, 12) * (r() < 0.2 ? -1 : 1), V = a * t + b;
  return {
    stem: `The function f is defined by ${fdef}. If f(t) = ${fmt(V)}, what is the value of t?`,
    ask: layer(r, 'the input t', ['the output f(t)', `the value of f(${fmt(V)})`, 'the slope of f']),
    eq: layer(r, `${dlin(a, b)}=${V}`, [`f(x)=${dlin(a, b)}, then f(${V})`, `${dlin(b, a)}=${V}`, `${dlin(a, -b)}=${V}`]),
    ans: layer(r, t, [a * V + b, V, V - b, -t], nkey),
    why: `f(t) = ${fmt(V)} means ${lin(a, b, 't')} = ${fmt(V)}, so t = ${fmt(t)}. f(${fmt(V)}) is a different question.`,
  };
};

G['m-quad'] = r => {
  let p, q; do { p = ri(r, 1, 9); q = -ri(r, 1, 9); } while (p === -q);
  const b = -(p + q), c = p * q;
  const show = `x² ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : fmt(Math.abs(b))}x ${c < 0 ? '−' : '+'} ${fmt(Math.abs(c))} = 0`;
  const typ = (B, C) => `y=x^2${B < 0 ? '-' : '+'}${Math.abs(B) === 1 ? '' : Math.abs(B)}x${C < 0 ? '-' : '+'}${Math.abs(C)}`;
  const v = ri(r, 0, 2);
  const eq = layer(r, typ(b, c), [typ(-b, c), typ(b, -c), typ(c, b), typ(-b, -c)]);
  if (v === 0) return {
    stem: `What is the positive solution to the equation ${show}?`,
    ask: layer(r, 'the positive solution', ['the negative solution', 'the sum of the solutions', 'the product of the solutions']),
    eq, ans: layer(r, p, [q, -q, b, c, p + q], nkey),
    why: `The graph crosses the x-axis at x = ${fmt(q)} and x = ${fmt(p)}. The positive one is ${fmt(p)}.`,
  };
  if (v === 1) return {
    stem: `What is the sum of the solutions to the equation ${show}?`,
    ask: layer(r, 'the sum of the solutions', ['the positive solution', 'the negative solution', 'the product of the solutions']),
    eq, ans: layer(r, p + q, [b, c, p, p - q], nkey),
    why: `The solutions are ${fmt(q)} and ${fmt(p)}. Their sum is ${fmt(q)} + ${fmt(p)} = ${fmt(p + q)}.`,
  };
  return {
    stem: `The equation ${show} has two solutions. What is the larger solution minus the smaller solution?`,
    ask: layer(r, 'the larger solution minus the smaller solution', ['the sum of the solutions', 'the positive solution', 'the product of the solutions']),
    eq, ans: layer(r, p - q, [p + q, q - p, p, c], nkey),
    why: `The solutions are ${fmt(q)} and ${fmt(p)}. Larger minus smaller: ${fmt(p)} − (${fmt(q)}) = ${fmt(p - q)}.`,
  };
};

G['m-exp'] = r => {
  const N = pickR(r, [50, 80, 100, 120, 150, 200, 250, 300, 400, 500]), f = r() < 0.75 ? 2 : 3, h = ri(r, 2, 6), k = ri(r, 2, f === 2 ? 4 : 3), t = k * h;
  const word = f === 2 ? 'doubles' : 'triples';
  const thing = pickR(r, [['A lab culture begins with', 'cells', 'cells'], ['A colony of yeast starts at', 'cells', 'cells'], ['A video has', 'views on the day it is posted', 'views']]);
  const val = N * f ** k;
  return {
    stem: `${thing[0]} ${fmt(N)} ${thing[1]}. The number of ${thing[2]} ${word} every ${h} ${thing[2] === 'views' ? 'days' : 'hours'}. How many ${thing[2]} will there be after ${t} ${thing[2] === 'views' ? 'days' : 'hours'}?`,
    ask: layer(r, `the number of ${thing[2]} after ${t} ${thing[2] === 'views' ? 'days' : 'hours'}`, [`the number of times it ${f === 2 ? 'doubles' : 'triples'}`, `the starting number of ${thing[2]}`, `the number of ${thing[2] === 'views' ? 'days' : 'hours'}`]),
    eq: layer(r, `y=${N}(${f})^(x/${h})`, [`y=${N}(${f})^(${h}x)`, `y=${f}(${N})^(x/${h})`, `y=${N}+${f}(x/${h})`]),
    ans: layer(r, val, [N * f * k, N * f ** (k + 1), N * f ** (k - 1), N + f * k], nkey),
    why: `${t} ÷ ${h} = ${k} times it ${word}: ${fmt(N)} × ${f}^${k} = ${fmt(val)}.`,
  };
};

const RATIOS = [
  { s: (a, b) => `A paint color is made by mixing ${a} cups of blue paint for every ${b} cups of yellow paint.`, q: c => `How many cups of yellow paint are needed to mix with ${c} cups of blue paint?`, A: 'cups of blue', B: 'cups of yellow' },
  { s: (a, b) => `A recipe uses ${a} cups of flour for every ${b} cups of oats.`, q: c => `How many cups of oats are needed for ${c} cups of flour?`, A: 'cups of flour', B: 'cups of oats' },
  { s: (a, b) => `On a map, ${a} centimeters represent ${b} kilometers.`, q: c => `How many kilometers do ${c} centimeters on the map represent?`, A: 'centimeters', B: 'kilometers' },
  { s: (a, b) => `A field trip requires ${a} students for every ${b} adult chaperones.`, q: c => `How many chaperones are needed for ${c} students?`, A: 'students', B: 'chaperones' },
];
G['m-ratio'] = r => {
  const ctx = pickR(r, RATIOS);
  let a, b; do { a = ri(r, 2, 9); b = ri(r, 2, 9); } while (a === b);
  const m = ri(r, 2, 8), c = a * m, ans = b * m;
  return {
    stem: `${ctx.s(a, b)} ${ctx.q(c)}`,
    ask: layer(r, `the number of ${ctx.B}`, [`the number of ${ctx.A}`, `the total of ${ctx.A} and ${ctx.B}`, 'the ratio']),
    eq: layer(r, `${a}/${b}=${c}/x`, [`${a}/${b}=x/${c}`, `${a}x=${b}+${c}`, `x=${c}+${b}-${a}`]),
    ans: layer(r, ans, [c + b - a, c + ans, b * c], nkey),
    why: `${c} is ${m} times ${a}, so multiply ${b} by ${m} too: ${fmt(ans)}.`,
  };
};

export function makeMath(sub, seed) {
  let s = seed;
  for (let i = 0; i < 25; i++, s = (s * 48271) % 2147483647 || 7) {
    try { const q = G[sub](rng(s)); q.sub = sub; q.seed = seed; q.grid = (seed % 4 === 0); return q; } catch (e) { if (!/distinct/.test(e.message)) throw e; }
  }
  throw new Error('generator failed ' + sub + ' ' + seed);
}
export const MATH_GEN = G;

// Typed (grid-in) answers: 12, 12.0, -3, −3, 3/4, .75
export function parseNum(s) {
  const t = String(s || '').trim().replace(/[−–]/g, '-').replace(/[,$\s]/g, '');
  if (!t) return null;
  if (/^-?\d+\/\d+$/.test(t)) { const [n, d] = t.split('/').map(Number); return d ? n / d : null; }
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
  return null;
}
