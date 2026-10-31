import { RW_SKILLS, RW_RULES, RW_TEACH } from './rw_rules.js';
// English skills, rule cards, one-line corrections, and the step-by-step teaching cards
// (shown after two misses on the same skill in one session). All examples are original.

export const EN_SKILLS = [
  { id: 'bd-ss', goal: 'boundary', name: 'Sentence | Sentence', short: 'Two sentences (; or .)' },
  { id: 'bd-adv', goal: 'boundary', name: 'Sentence | however, + sentence', short: '; however,' },
  { id: 'bd-dep', goal: 'boundary', name: 'Intro fragment | Sentence', short: 'Intro + comma' },
  { id: 'bd-mod', goal: 'boundary', name: 'Sentence | -ing / which fragment', short: 'Trailing phrase + comma' },
  { id: 'bd-none', goal: 'boundary', name: 'Long subject | its verb (no punctuation)', short: 'No punctuation' },
  { id: 'bd-colon', goal: 'boundary', name: 'Sentence | list or explanation (colon)', short: 'Colon' },
  { id: 'bd-pair', goal: 'boundary', name: 'Close the side note with the same mark', short: 'Matching pair' },
  { id: 'sv-prep', goal: 'subject', name: 'Subject + "of the…" phrase + verb', short: 'Phrase in the middle' },
  { id: 'sv-clause', goal: 'subject', name: 'Subject + who/that clause + verb', short: 'Clause in the middle' },
  { id: 'sv-appos', goal: 'subject', name: 'Subject + side note + verb', short: 'Side note in the middle' },
  { id: 'sv-invert', goal: 'subject', name: 'Verb before the subject', short: 'Subject after the verb' },
  { id: 'sv-compound', goal: 'subject', name: 'X and Y = plural', short: 'X and Y' },
  { id: 'sv-oneof', goal: 'subject', name: 'One of / Each of / The number of = singular', short: 'One of / Each of' },
];

// Decode answers for each boundary type: can the left / right side stand alone?
export const BD_SIDES = {
  'bd-ss': ['Sentence', 'Sentence'], 'bd-adv': ['Sentence', 'Sentence'], 'bd-dep': ['Fragment', 'Sentence'], 'bd-mod': ['Sentence', 'Fragment'],
  'bd-none': ['Fragment', 'Fragment'], 'bd-colon': ['Sentence', 'Fragment'], 'bd-pair': ['Fragment', 'Fragment'],
};
export const BD_DECODE_WHY = {
  'bd-ss': 'Both sides can stand alone as sentences.',
  'bd-adv': 'Both sides can stand alone. "However, the team…" is still a full sentence.',
  'bd-dep': 'The left side is an intro (it starts with a word like although/because, or it is a phrase with no subject + verb), so it can\'t stand alone. The right side can.',
  'bd-mod': 'The left side is a full sentence. The right side starts with -ing, which, or who, so it can\'t stand alone.',
  'bd-none': 'The left side is only a subject (no main verb yet). The right side starts with the verb and has no subject. Neither can stand alone.',
  'bd-colon': 'The left side is a full sentence. The right side is a list or a noun phrase with no verb, so it can\'t stand alone.',
  'bd-pair': 'The left side is a subject plus a side note, with no main verb. The right side is the verb part. Neither can stand alone.',
};
export const BD_ANSWER_WHY = {
  'bd-ss': 'Sentence | Sentence → period or semicolon. A comma alone is a comma splice; nothing is a run-on; a colon needs an explanation or list.',
  'bd-adv': 'Sentence | however, + sentence → semicolon before the transition word, comma after it. A comma before "however" is a comma splice.',
  'bd-dep': 'Intro fragment | Sentence → comma. A semicolon or period would leave the intro stranded as a fragment.',
  'bd-mod': 'Sentence | -ing / which / who phrase → comma. A semicolon or period would turn the phrase into a fragment.',
  'bd-none': 'Never put punctuation between a subject and its verb, no matter how long the subject is.',
  'bd-colon': 'Sentence | list or explanation that is not a sentence → colon. A semicolon needs a full sentence on both sides.',
  'bd-pair': 'A side note closes with the same mark that opened it: comma with comma, dash with dash.',
};

// "Just the rule" cards: no sentence, only the rule.
export const RULES = {
  'bd-ss': { q: 'Sentence | Sentence. What can go in the blank?', a: 'A period or a semicolon', w: ['A comma by itself', 'Nothing', 'A colon, every time'] },
  'bd-adv': { q: 'Sentence | however, + sentence. What goes right before "however"?', a: 'A semicolon (or a period)', w: ['A comma', 'Nothing', 'A colon'] },
  'bd-dep': { q: 'Intro fragment (Although…, When…, Built in…) | Sentence. What goes in the blank?', a: 'A comma', w: ['A semicolon', 'A period', 'A colon'] },
  'bd-mod': { q: 'Sentence | trailing -ing / which / who phrase. What goes in the blank?', a: 'A comma', w: ['A semicolon', 'A period', 'A colon'] },
  'bd-none': { q: 'A long subject, then its verb. What goes between them?', a: 'Nothing. Never split a subject from its verb.', w: ['A comma, because the subject is long', 'A semicolon', 'A colon'] },
  'bd-colon': { q: 'Sentence | a list or explanation that is NOT a sentence. What goes in the blank?', a: 'A colon', w: ['A semicolon', 'Nothing', 'A period'] },
  'bd-pair': { q: 'A side note opened with a dash. How must it close?', a: 'With a dash', w: ['With a comma', 'With a semicolon', 'With nothing'] },
  'sv-prep': { q: 'A phrase like "of the maps" sits between the subject and the verb. The verb matches…', a: 'The subject before the phrase', w: ['The noun right before the verb', 'The noun inside the phrase', 'Whichever sounds better'] },
  'sv-clause': { q: 'A who / that / which clause sits between the subject and the verb. The verb matches…', a: 'The subject before the clause', w: ['The last noun in the clause', 'The noun right before the verb', 'Whichever sounds better'] },
  'sv-appos': { q: 'A side note set off by commas or dashes sits between the subject and the verb. The verb matches…', a: 'The subject before the side note', w: ['The noun inside the side note', 'The noun right before the verb', 'Whichever sounds better'] },
  'sv-invert': { q: 'The sentence starts with "Among the…" or "At the center of…" and the verb comes BEFORE the subject. The verb matches…', a: 'The subject that comes after the verb', w: ['The noun right before the verb', 'The first noun in the sentence', 'Whichever sounds better'] },
  'sv-compound': { q: 'The subject is "X and Y" (two things joined by and). The verb is…', a: 'Plural', w: ['Singular', 'Whatever matches Y', 'Whatever matches the nearest noun'] },
  'sv-oneof': { q: 'The subject starts "One of the…", "Each of the…", or "The number of…". The verb is…', a: 'Singular', w: ['Plural, to match the noun after "of"', 'Whatever matches the nearest noun', 'Either one'] },
};

// Step-by-step teaching cards. No skipped lines.
export const TEACH = {
  'bd-ss': { title: 'Two sentences in a row', steps: [
    'Find the blank.',
    'Cover everything after the blank. Read the left side alone: "The lake froze in early December." It can stand alone. Mark it S.',
    'Cover everything before the blank. Read the right side alone: "Skaters arrived the next morning." It can stand alone. Mark it S.',
    'S | S. Only two things can join two sentences without a joining word: a period or a semicolon.',
    'Cross out the comma choice (comma splice) and the no-punctuation choice (run-on).',
    'Cross out the colon too: the right side doesn\'t explain or list anything from the left side.',
    'Pick the period or the semicolon, whichever is offered.'] },
  'bd-adv': { title: 'however / therefore / for example', steps: [
    'Find the blank. Notice a transition word right after it (however, therefore, instead, for example…).',
    'Read the left side alone: "The bakery raised its prices." Mark it S.',
    'Read the right side alone, transition word included: "However, sales kept climbing." Still a full sentence. Mark it S.',
    'S | S. "However" is not a joining word like "and" or "but", so a comma can\'t join these.',
    'The pattern is: sentence ; however, sentence.',
    'Pick the choice with a semicolon (or period) BEFORE the transition word and a comma AFTER it.'] },
  'bd-dep': { title: 'Intro piece, then the sentence', steps: [
    'Find the blank.',
    'Read the left side alone: "When the storm passed." It starts with "When", so it can\'t stand alone. Mark it F.',
    'Read the right side alone: "the ferries began running again." It can stand alone. Mark it S.',
    'F | S. An intro piece joins its sentence with a comma.',
    'Cross out the semicolon and the period: each would leave "When the storm passed" stranded as a fragment.',
    'Cross out the colon: a colon needs a full sentence before it.',
    'Pick the comma.'] },
  'bd-mod': { title: 'Sentence, then an -ing / which phrase', steps: [
    'Find the blank.',
    'Read the left side alone: "The crew repainted the bridge in May." Mark it S.',
    'Read the right side alone: "finishing two weeks early." It starts with an -ing word and has no subject. Mark it F.',
    'S | F where the F describes the sentence. Join them with a comma.',
    'Cross out the semicolon and the period: each would make "finishing two weeks early" a fragment.',
    'Cross out the colon: the phrase is a description, not a list or explanation.',
    'Pick the comma.'] },
  'bd-none': { title: 'Don\'t split the subject from its verb', steps: [
    'Find the blank.',
    'Read the left side alone: "The students who built the solar car last spring." Who did what? There is no main verb. Mark it F.',
    'Read the right side alone: "won the regional competition." Who won? There is no subject. Mark it F.',
    'The left side is the subject; the right side starts with its verb ("won").',
    'Nothing ever goes between a subject and its verb, even a very long subject.',
    'Pick the choice with no punctuation.'] },
  'bd-colon': { title: 'Sentence, then a list or explanation', steps: [
    'Find the blank.',
    'Read the left side alone: "The trail guide recommends two items." Mark it S.',
    'Read the right side alone: "sturdy boots and a rain jacket." No verb. Mark it F.',
    'The right side is the list the left side promised ("two items").',
    'Sentence | list or explanation → colon.',
    'Cross out the semicolon (needs a sentence on both sides), the period (leaves a fragment), and no punctuation (run-together).',
    'Pick the colon.'] },
  'bd-pair': { title: 'Close the side note with the same mark', steps: [
    'Find the blank.',
    'Look to the LEFT of the blank for where a side note started: a comma or a dash right after the subject.',
    'Example: "The mayor—a former teacher from Ohio ___ opened the new library."',
    'The side note "a former teacher from Ohio" opened with a dash.',
    'A side note closes with the same mark that opened it: dash … dash, or comma … comma.',
    'Cross out the other mark, the semicolon, and no punctuation.',
    'Pick the matching mark.'] },
  'sv-prep': { title: 'A phrase is hiding the subject', steps: [
    'Find the verb blank.',
    'Example: "The box of old letters ___ in the attic."',
    'Find the first noun: "box". Then a phrase starts with "of": "of old letters".',
    'Cover the phrase: "The box ___ in the attic."',
    '"box" is the real subject. It is singular.',
    'The verb must be singular: "sits", not "sit". Ignore "letters", even though it is right next to the blank.'] },
  'sv-clause': { title: 'A who / that clause is hiding the subject', steps: [
    'Find the verb blank.',
    'Example: "The coach who trained the swimmers ___ every morning at six."',
    'The subject comes first: "coach". Then a clause starts with "who".',
    'Cover the clause: "The coach ___ every morning at six."',
    '"coach" is singular.',
    'Pick the singular verb: "arrives", not "arrive". "Swimmers" is inside the clause, so it doesn\'t count.'] },
  'sv-appos': { title: 'A side note is hiding the subject', steps: [
    'Find the verb blank.',
    'Example: "The band, a group of five musicians from Austin, ___ on tour."',
    'Find the commas (or dashes). Everything between them is a side note.',
    'Cover the side note: "The band ___ on tour."',
    '"band" is singular.',
    'Pick the singular verb: "is". "Musicians" is in the side note, so it doesn\'t count.'] },
  'sv-invert': { title: 'The subject comes after the verb', steps: [
    'Find the verb blank.',
    'Example: "Beside the old fountain ___ two stone benches."',
    'The words before the blank are a location phrase: "Beside the old fountain". The subject is NOT in it.',
    'Look AFTER the blank for what the sentence is about: "two stone benches".',
    'Flip it: "Two stone benches ___ beside the old fountain."',
    '"benches" is plural. Pick the plural verb: "stand", not "stands". "fountain" is next to the blank, but it is not the subject.'] },
  'sv-compound': { title: 'X and Y = plural', steps: [
    'Find the verb blank.',
    'Example: "The pitcher and the catcher from the visiting team ___ ready."',
    'Find the subject: "pitcher and catcher". Two things joined by "and".',
    'Two things = they. So the verb is plural.',
    '"team" is next to the blank, but it is inside a phrase ("from the visiting team").',
    'Pick the plural verb: "are", not "is".'] },
  'sv-oneof': { title: 'One of / Each of / The number of', steps: [
    'Find the verb blank.',
    'Example: "One of the paintings in the gallery ___ damaged."',
    'The subject is the FIRST word: "One". "of the paintings" is a phrase.',
    'Cover the phrase: "One ___ damaged."',
    '"One" is singular. "Each" and "The number" are singular too.',
    'Pick the singular verb: "was" or "is", not "were" or "are".'] },

  'm-expr': { title: 'They asked for an expression, not x', steps: [
    'Read the last line first. Example: "If 7x − 4 = 31, what is the value of 3x?"',
    'Write the ask on your paper: "3x".',
    'Type the equation into Desmos exactly as written: 7x-4=31.',
    'Desmos shows x = 5.',
    'Look at your ask word: "3x", not "x".',
    'Compute it: 3 × 5 = 15. The answer is 15. (5 is a trap answer.)'] },
  'm-linword': { title: 'Fee + rate word problems', steps: [
    'Read the last line first. Example: "…a $30 fee plus $12 per hour. The bill was $90. How many hours?"',
    'Write the ask: "hours".',
    'The fee is paid once. The rate is paid once per hour, so it goes with x.',
    'Translate: 30 + 12x = 90.',
    'Type 30+12x=90 into Desmos. It shows x = 5.',
    'Look at your ask word: hours. x is the hours, so the answer is 5.'] },
  'm-system': { title: 'Systems: read what they want', steps: [
    'Read the last line first. Example: "What is the value of x + y?"',
    'Write the ask: "x + y".',
    'Type the first equation into Desmos on line 1.',
    'Type the second equation on line 2.',
    'Click the point where the lines cross. Example: (4, −1).',
    'Look at your ask word: "x + y". Compute 4 + (−1) = 3. The answer is 3, not 4 and not −1.'] },
  'm-percent': { title: 'Percents: which number do they want?', steps: [
    'Read the last line first. Example: "A $90 item is 30% off. What is the sale price?"',
    'Write the ask: "sale price".',
    '30% off leaves 100% − 30% = 70% of the price.',
    'Type y=90(1-0.3) into Desmos. It shows 63.',
    'Look at your ask word: sale price. The answer is 63.',
    'Trap: 90 × 0.3 = 27 is the discount, not the sale price.'] },
  'm-func': { title: 'f(x): input or output?', steps: [
    'Read the last line first.',
    'If it says "what is f(6)?", the ask is an OUTPUT: put 6 in for x.',
    'If it says "f(t) = 20, what is t?", the ask is an INPUT: set the function equal to 20 and solve.',
    'Write the ask: "f(6)" or "t".',
    'Output: type f(x)=3x+2 on line 1, then f(6) on line 2. Desmos shows 20.',
    'Input: type 3x+2=20. Desmos shows x = 6. Check your ask word before you answer.'] },
  'm-quad': { title: 'Quadratics: which solution?', steps: [
    'Read the last line first: positive solution? sum? difference?',
    'Write the ask, for example "positive solution".',
    'Type the equation as y = …: for x² − 2x − 15 = 0, type y=x^2-2x-15.',
    'Click where the graph crosses the x-axis: x = −3 and x = 5.',
    'Look at your ask word. Positive solution → 5.',
    'If the ask were "sum": −3 + 5 = 2. If it were "larger minus smaller": 5 − (−3) = 8.'] },
  'm-exp': { title: 'Doubling and tripling', steps: [
    'Read the last line first. Example: "starts at 60, doubles every 4 hours. How many after 12 hours?"',
    'Write the ask: "number after 12 hours".',
    'Count the doublings: 12 ÷ 4 = 3.',
    'Type y=60(2)^(x/4) into Desmos, then find the y-value at x = 12.',
    'Desmos shows 480 (60 → 120 → 240 → 480).',
    'Trap: 60 × 2 × 3 = 360 treats doubling like adding. Doubling multiplies.'] },
  'm-ratio': { title: 'Ratios: set up the proportion', steps: [
    'Read the last line first. Example: "4 cups of rice for every 6 cups of water. How much water for 10 cups of rice?"',
    'Write the ask: "cups of water".',
    'Keep the same order on both sides: rice/water = rice/water.',
    'Type 4/6=10/x into Desmos.',
    'Desmos shows x = 15.',
    'Look at your ask word: water. The answer is 15.'] },
};

// The other Reading & Writing sections (hard items only).
EN_SKILLS.push(...RW_SKILLS);
Object.assign(RULES, RW_RULES);
Object.assign(TEACH, RW_TEACH);
