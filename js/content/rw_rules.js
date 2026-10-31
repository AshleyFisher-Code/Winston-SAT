// Reading & Writing sections other than grammar: skills, rule cards, trap names, and
// step-by-step teaching cards. All examples are original.

export const RW_SKILLS = [
  { id: 'rw-wic', goal: 'reading', area: 'Craft & Structure', name: 'Words in context', short: 'Words in context' },
  { id: 'rw-purpose', goal: 'reading', area: 'Craft & Structure', name: 'Text structure and purpose', short: 'Purpose / structure' },
  { id: 'rw-cross', goal: 'reading', area: 'Craft & Structure', name: 'Cross-text connections', short: 'Cross-text' },
  { id: 'rw-main', goal: 'reading', area: 'Information & Ideas', name: 'Central ideas and details', short: 'Main idea' },
  { id: 'rw-evid', goal: 'reading', area: 'Information & Ideas', name: 'Command of evidence: textual', short: 'Textual evidence' },
  { id: 'rw-quant', goal: 'reading', area: 'Information & Ideas', name: 'Command of evidence: quantitative', short: 'Tables & data' },
  { id: 'rw-infer', goal: 'reading', area: 'Information & Ideas', name: 'Inferences', short: 'Inferences' },
  { id: 'rw-trans', goal: 'reading', area: 'Expression of Ideas', name: 'Transitions', short: 'Transitions' },
  { id: 'rw-synth', goal: 'reading', area: 'Expression of Ideas', name: 'Rhetorical synthesis', short: 'Notes → goal' },
];

export const TRAP_LABEL = {
  extreme: 'Too extreme',
  opposite: 'Opposite of the text',
  offscope: 'Off topic',
  truenot: 'True, but doesn\'t answer the question',
  half: 'Half right, half wrong',
  recycled: 'Recycled words, wrong meaning',
  unsupported: 'Never actually stated',
  wrongrel: 'Wrong relationship',
  goalmiss: 'Accurate, but misses the goal',
  common: 'Common meaning, not this context',
  tone: 'Right idea, wrong strength',
  datamis: 'Misreads the data',
  dataout: 'True of the data, but not the claim',
};
// Trap names close enough in meaning that one option could fit both. Never offered side by side.
export const TRAP_NEAR = {
  extreme: ['unsupported', 'half', 'offscope', 'tone'],
  opposite: ['recycled', 'datamis', 'wrongrel', 'unsupported'],
  offscope: ['truenot', 'unsupported', 'extreme', 'goalmiss', 'dataout', 'recycled'],
  truenot: ['offscope', 'goalmiss', 'dataout', 'half'],
  half: ['extreme', 'unsupported', 'truenot', 'goalmiss'],
  recycled: ['unsupported', 'opposite', 'offscope', 'common'],
  unsupported: ['extreme', 'half', 'recycled', 'offscope', 'opposite'],
  wrongrel: ['opposite'],
  goalmiss: ['truenot', 'half', 'offscope', 'dataout'],
  common: ['tone', 'recycled'],
  tone: ['common', 'extreme'],
  datamis: ['opposite', 'dataout'],
  dataout: ['truenot', 'offscope', 'datamis'],
};
// Trap names that make sense for each question type (distractors are drawn from these first).
export const TRAPS_FOR = {
  'rw-wic': ['common', 'tone', 'opposite', 'recycled', 'offscope'],
  'rw-purpose': ['extreme', 'opposite', 'truenot', 'half', 'recycled', 'unsupported'],
  'rw-cross': ['extreme', 'opposite', 'half', 'offscope', 'unsupported', 'truenot'],
  'rw-main': ['extreme', 'truenot', 'half', 'recycled', 'unsupported', 'offscope'],
  'rw-evid': ['opposite', 'truenot', 'offscope', 'half', 'extreme', 'unsupported'],
  'rw-quant': ['datamis', 'dataout', 'opposite', 'extreme', 'unsupported'],
  'rw-infer': ['extreme', 'opposite', 'unsupported', 'recycled', 'half', 'offscope'],
  'rw-trans': ['wrongrel', 'opposite'],
  'rw-synth': ['goalmiss', 'half', 'offscope', 'truenot'],
};

export const RW_RULES = {
  'rw-wic': { q: 'Words in context: what do you do before looking at the four words?', a: 'Predict my own word for the blank from the clues in the text', w: ['Pick the hardest-sounding word', 'Pick the word I\'ve seen most often', 'Read the choices first, then the text'] },
  'rw-purpose': { q: 'Function of an underlined sentence: what decides the answer?', a: 'What the sentence DOES for the rest of the text (introduce, contrast, give an example…)', w: ['What the sentence is about', 'Which choice repeats words from the sentence', 'Whether the sentence is true'] },
  'rw-cross': { q: 'How would Text 2\'s author respond to Text 1? First step:', a: 'Find Text 1\'s claim, then find what Text 2 says about that exact claim', w: ['Assume the two authors disagree', 'Pick the choice with the strongest wording', 'Summarize Text 2 by itself'] },
  'rw-main': { q: 'Main idea: which choice is usually the trap?', a: 'A detail that\'s true but isn\'t the whole point', w: ['The choice that covers the whole text', 'The choice with hedged words like "may"', 'The choice that matches the last sentence'] },
  'rw-evid': { q: 'Support / weaken a claim: what must the right finding do?', a: 'Match the exact claim: same group, same direction, same scope', w: ['Be about the same general topic', 'Be the most surprising result', 'Mention the researcher by name'] },
  'rw-quant': { q: 'Table question: what do you read first?', a: 'The exact claim in the text, then only the rows and columns it needs', w: ['The largest number in the table', 'Every row of the table', 'The choice with the most numbers'] },
  'rw-infer': { q: 'Inference: the right answer is…', a: 'The one that MUST be true from the text, even if it sounds modest', w: ['The most interesting conclusion', 'The strongest conclusion', 'Whatever the researchers probably hoped'] },
  'rw-trans': { q: 'Transitions: what do you decide before reading the choices?', a: 'The relationship between the two sentences (contrast, cause, example…)', w: ['Which word sounds most formal', 'Which word was used earlier in the text', 'Whether the sentence is long or short'] },
  'rw-synth': { q: 'Rhetorical synthesis: what decides the answer?', a: 'The goal in the question, not the notes', w: ['Which choice uses the most notes', 'Which choice is most detailed', 'Which choice is most accurate to the notes'] },
};

export const RW_TEACH = {
  'rw-wic': { title: 'Words in context', steps: [
    'Cover the four choices.',
    'Find the clues around the blank: a contrast word (but, although), a cause (because, so), or a restatement after a colon or dash.',
    'Say your own plain word for the blank, like "careful" or "temporary".',
    'Now uncover the choices. Find the one that means your word.',
    'Check the strength: "skeptical" is not the same as "hostile". Too strong is wrong.',
    'Check it isn\'t just the word\'s everyday meaning. On the SAT, "grave" can mean serious, not a burial place.'] },
  'rw-purpose': { title: 'Purpose and structure', steps: [
    'Ignore the choices for now.',
    'Ask: what is this sentence DOING, not what is it about?',
    'Common jobs: introduces a view, gives an example, presents a contrast, explains a cause, answers a question the text raised.',
    'Name the job in 3–5 words, for example "gives an exception to the rule".',
    'Pick the choice that names that job.',
    'Cross out choices that are true facts from the text but describe a different job.'] },
  'rw-cross': { title: 'Cross-text connections', steps: [
    'Read Text 1. Write its main claim in a few words.',
    'Read Text 2. Find the sentence that touches Text 1\'s claim.',
    'Decide: does Text 2 agree, disagree, add a condition, or explain why?',
    'Most hard questions are "partly agrees but adds a limit". Look for words like only, unless, also, but.',
    'Pick the choice that matches that exact relationship.',
    'Cross out choices that are too strong ("completely wrong") when Text 2 only qualifies Text 1.'] },
  'rw-main': { title: 'Main idea', steps: [
    'Read the whole text before the choices.',
    'Find the sentence that everything else supports. It is often after "however" or near the end.',
    'Say the point in one sentence of your own.',
    'Pick the choice that matches it. It may use completely different words.',
    'Cross out details that are true but only part of the text.',
    'Cross out choices stronger than the text: "proves", "always", "all".'] },
  'rw-evid': { title: 'Support or weaken a claim', steps: [
    'Find the exact claim. Underline who, what, and which direction.',
    'Example: "Bees visit blue flowers MORE than yellow flowers BECAUSE of color, not scent."',
    'Write what the evidence must show: blue gets more visits even when scent is the same.',
    'Check each choice: same group? same direction? does it test the "because"?',
    'Cross out choices on the right topic that don\'t test the claim.',
    'To WEAKEN, look for the result that would happen if the claim were false.'] },
  'rw-quant': { title: 'Tables and data', steps: [
    'Read the text\'s claim first, not the table.',
    'Circle the exact words: which group, which year, more or less.',
    'Find only those rows and columns.',
    'Check each choice\'s numbers against the table.',
    'A choice can be 100% accurate about the table and still be wrong: it has to support THIS claim.',
    'Cross out choices that compare the wrong groups or the wrong years.'] },
  'rw-infer': { title: 'Inferences', steps: [
    'Read the text and list what it has established.',
    'Look at the last sentence before the blank: it usually sets up a "therefore".',
    'Ask: what MUST follow from those facts?',
    'Pick the most modest choice that has to be true.',
    'Cross out choices that go further than the text ("will", "always", "proves").',
    'Cross out choices that are true in real life but not shown by this text.'] },
  'rw-trans': { title: 'Transitions', steps: [
    'Cover the choices.',
    'Read the sentence before the blank and the sentence after it.',
    'Name the relationship: contrast, cause → effect, example, addition, similarity, time, or restatement.',
    'Check further back too: sometimes the link is to the sentence two back.',
    'Pick the transition that matches. "However" = contrast, "Therefore" = result, "For example" = example.',
    'Careful: "Still" pushes back after a concession; "Indeed" strengthens the same point.'] },
  'rw-synth': { title: 'Rhetorical synthesis', steps: [
    'Skip the notes at first. Read the question.',
    'Underline the goal: emphasize a difference? introduce to a new audience? state the aim?',
    'Go to the choices and check each one against the goal only.',
    'A difference needs both things and a contrast word (while, whereas, unlike).',
    'A new audience needs the thing explained, not just named.',
    'All four choices are usually accurate. Accuracy is not enough: pick the one that does the goal.'] },
};
