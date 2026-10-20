# SAT Practice (Winston)

Phone-first SAT practice: Reading & Writing conventions (boundaries, subject-verb) and Module-1 math, in three modes mixed in every session (rule only, decode, full question with gates), with a parent view and copy-able reports.

- `js/content/` — English sentence banks (original items) and rule / teaching text.
- `js/math.js` — seeded math generators (ask, Desmos equation, answer).
- `js/session.js` — session building, spacing (same skill ≥5 apart), follow-ups.
- `tests/test.mjs` — answer-key and spacing checks: `node tests/test.mjs` must pass before every publish.
- Release: bump the version in `js/config.js`, `index.html` (?v=) and `sw.js`.
