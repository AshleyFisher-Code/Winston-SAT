// Small shared helpers. Everything random goes through a seeded generator, so a saved
// card (its seed) always rebuilds into exactly the same question.
export function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const pickR = (r, arr) => arr[Math.floor(r() * arr.length)];
export const shuffleR = (r, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const newSeed = () => (Math.floor(Math.random() * 2147483646) + 1);
export const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];
// String hash, for seeding from an item id.
export const hash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h || 1; };
// Display numbers the way the SAT prints them: true minus sign, no trailing zeros.
export function fmt(n) {
  if (!Number.isFinite(n)) return String(n);
  const r = Math.round(n * 1000) / 1000;
  const [i, d] = String(Math.abs(r)).split('.');
  const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+$)/g, ',') : i;
  return (r < 0 ? '−' : '') + ii + (d ? '.' + d : '');
}
export const money = n => '$' + fmt(n);
