/* ==========================================================================
   Forward Framework Personality Assessment — item bank
   --------------------------------------------------------------------------
   Three response formats:
     1. likert   — 5-point agreement, normative, 48 scored + 6 candour items
     2. tetrad   — forced-choice MOST / LEAST blocks, ipsative (DISC / PI style)
     3. reasoning— multiple choice with a correct answer (Caliper-style)

   Every likert item carries a facet id and a key (+1 normal, -1 reverse).
   Facet ids are the only contract the scoring engine depends on.
   ========================================================================== */

export const FACETS = {
  curiosity:      { label: 'Curiosity',             blurb: 'Appetite for new information and better methods.' },
  adaptability:   { label: 'Adaptability',          blurb: 'Comfort with shifting priorities and ambiguity.' },
  structure:      { label: 'Structure & Detail',    blurb: 'Systems, follow-through, accuracy of output.' },
  drive:          { label: 'Achievement Drive',     blurb: 'Self-set standards and appetite for visible progress.' },
  assertiveness:  { label: 'Assertiveness',         blurb: 'Willingness to take a position and hold it.' },
  sociability:    { label: 'Sociability',           blurb: 'Energy drawn from contact with other people.' },
  cooperation:    { label: 'Cooperation',           blurb: 'Deference to the team over personal position.' },
  empathy:        { label: 'Empathy',               blurb: 'Reading and adjusting to how others are landing.' },
  composure:      { label: 'Composure',             blurb: 'Steadiness under pressure and confrontation.' },
  resilience:     { label: 'Resilience',            blurb: 'Recovery speed after setbacks and criticism.' },
  urgency:        { label: 'Urgency',               blurb: 'Preferred tempo of decisions and action.' },
  persuasion:     { label: 'Persuasion',            blurb: 'Comfort influencing and negotiating.' },
  service:        { label: 'Service Orientation',   blurb: 'Pull toward solving other people’s problems.' },
  accountability: { label: 'Accountability',        blurb: 'Ownership of outcomes, good and bad.' },
  learning:       { label: 'Learning Approach',     blurb: 'Deliberate, ongoing investment in skill.' },
  prudence:       { label: 'Prudence',              blurb: 'Rule adherence and downside awareness.' }
};

/* --- Normative anchors ---------------------------------------------------
   Illustrative means / SDs on the 1-5 raw scale, used to convert a facet
   average into a percentile band. These are stand-ins for a real normed
   sample; replace them once you have 150+ in-role respondents.
   ------------------------------------------------------------------------ */
export const NORMS = {
  curiosity:      { m: 3.85, sd: 0.78 }, adaptability:   { m: 3.62, sd: 0.84 },
  structure:      { m: 3.70, sd: 0.88 }, drive:          { m: 3.88, sd: 0.79 },
  assertiveness:  { m: 3.45, sd: 0.92 }, sociability:    { m: 3.40, sd: 1.02 },
  cooperation:    { m: 3.80, sd: 0.76 }, empathy:        { m: 3.75, sd: 0.82 },
  composure:      { m: 3.55, sd: 0.86 }, resilience:     { m: 3.58, sd: 0.88 },
  urgency:        { m: 3.50, sd: 0.86 }, persuasion:     { m: 3.42, sd: 0.94 },
  service:        { m: 3.82, sd: 0.78 }, accountability: { m: 3.90, sd: 0.74 },
  learning:       { m: 3.78, sd: 0.82 }, prudence:       { m: 3.60, sd: 0.82 }
};

export const LIKERT_SCALE = [
  { value: 1, label: 'Strongly disagree', short: 'SD' },
  { value: 2, label: 'Disagree',          short: 'D'  },
  { value: 3, label: 'Neutral',           short: 'N'  },
  { value: 4, label: 'Agree',             short: 'A'  },
  { value: 5, label: 'Strongly agree',    short: 'SA' }
];

/* --- Part 1: normative statements (48 scored) ---------------------------- */
export const LIKERT_ITEMS = [
  { id: 'q01', facet: 'curiosity',      key:  1, text: 'I look for better ways to do routine work, even when the current way is fine.' },
  { id: 'q02', facet: 'curiosity',      key:  1, text: 'I enjoy digging into subjects that sit outside my job description.' },
  { id: 'q03', facet: 'curiosity',      key: -1, text: 'I would rather stay with methods I already know than experiment with new ones.' },

  { id: 'q04', facet: 'adaptability',   key:  1, text: 'When priorities shift mid-week, I adjust quickly without losing momentum.' },
  { id: 'q05', facet: 'adaptability',   key:  1, text: 'Loosely defined projects energise me more than tightly specified ones.' },
  { id: 'q06', facet: 'adaptability',   key: -1, text: 'Frequent changes of direction wear me down.' },

  { id: 'q07', facet: 'structure',      key:  1, text: 'I keep a system for tracking my commitments, and I actually follow it.' },
  { id: 'q08', facet: 'structure',      key:  1, text: 'I check the details twice before anything leaves my desk.' },
  { id: 'q09', facet: 'structure',      key: -1, text: 'My files and workspace are usually disorganised.' },

  { id: 'q10', facet: 'drive',          key:  1, text: 'I set targets for myself that go beyond what has been asked of me.' },
  { id: 'q11', facet: 'drive',          key:  1, text: 'I feel restless when a week passes without visible progress.' },
  { id: 'q12', facet: 'drive',          key: -1, text: 'Meeting expectations satisfies me; exceeding them is not the point.' },

  { id: 'q13', facet: 'assertiveness',  key:  1, text: 'In group discussions I am usually among the first to state a position.' },
  { id: 'q14', facet: 'assertiveness',  key:  1, text: 'I am comfortable telling a senior colleague that their plan has a flaw.' },
  { id: 'q15', facet: 'assertiveness',  key: -1, text: 'I hold back my view until I know where everyone else stands.' },

  { id: 'q16', facet: 'sociability',    key:  1, text: 'Meeting new people at industry events comes easily to me.' },
  { id: 'q17', facet: 'sociability',    key:  1, text: 'I would rather work a room than work quietly at my desk.' },
  { id: 'q18', facet: 'sociability',    key: -1, text: 'A day of back-to-back conversations leaves me drained.' },

  { id: 'q19', facet: 'cooperation',    key:  1, text: 'I go out of my way to make a teammate’s work easier.' },
  { id: 'q20', facet: 'cooperation',    key:  1, text: 'I will give up credit if it gets the team a better outcome.' },
  { id: 'q21', facet: 'cooperation',    key: -1, text: 'I would rather win the argument than keep the peace.' },

  { id: 'q22', facet: 'empathy',        key:  1, text: 'I notice when someone on the team is struggling before they say so.' },
  { id: 'q23', facet: 'empathy',        key:  1, text: 'I adapt how I deliver news to how the person is likely to hear it.' },
  { id: 'q24', facet: 'empathy',        key: -1, text: 'I find it hard to understand why people take work matters personally.' },

  { id: 'q25', facet: 'composure',      key:  1, text: 'I stay level-headed when a client is angry with me.' },
  { id: 'q26', facet: 'composure',      key:  1, text: 'Pressure sharpens my thinking rather than clouding it.' },
  { id: 'q27', facet: 'composure',      key: -1, text: 'I replay difficult conversations in my head long after they end.' },

  { id: 'q28', facet: 'resilience',     key:  1, text: 'A lost deal motivates me more than it discourages me.' },
  { id: 'q29', facet: 'resilience',     key:  1, text: 'I am back to full output within a day of being criticised.' },
  { id: 'q30', facet: 'resilience',     key: -1, text: 'A setback early in the week drags on my output for the rest of it.' },

  { id: 'q31', facet: 'urgency',        key:  1, text: 'I would rather move on 80% of the information than wait for all of it.' },
  { id: 'q32', facet: 'urgency',        key:  1, text: 'I get impatient when a decision sits unmade.' },
  { id: 'q33', facet: 'urgency',        key: -1, text: 'I prefer a steady, predictable pace to a fast, shifting one.' },

  { id: 'q34', facet: 'persuasion',     key:  1, text: 'I can usually bring someone around to my point of view.' },
  { id: 'q35', facet: 'persuasion',     key:  1, text: 'I enjoy negotiating terms.' },
  { id: 'q36', facet: 'persuasion',     key: -1, text: 'Selling an idea to a sceptical audience is uncomfortable for me.' },

  { id: 'q37', facet: 'service',        key:  1, text: 'I follow up with clients before they have to chase me.' },
  { id: 'q38', facet: 'service',        key:  1, text: 'Solving someone else’s problem is its own reward for me.' },
  { id: 'q39', facet: 'service',        key: -1, text: 'Handling other people’s requests feels like a distraction from my real work.' },

  { id: 'q40', facet: 'accountability', key:  1, text: 'When something goes wrong on my watch, I say so before anyone asks.' },
  { id: 'q41', facet: 'accountability', key:  1, text: 'I would rather own a mistake plainly than explain the circumstances around it.' },
  { id: 'q42', facet: 'accountability', key: -1, text: 'When results fall short it is usually down to factors outside my control.' },

  { id: 'q43', facet: 'learning',       key:  1, text: 'I actively keep up with developments in my field on my own time.' },
  { id: 'q44', facet: 'learning',       key:  1, text: 'I ask for feedback on my work even when none is offered.' },
  { id: 'q45', facet: 'learning',       key: -1, text: 'Formal study and training feel like a chore to me.' },

  { id: 'q46', facet: 'prudence',       key:  1, text: 'I follow the established process even when a shortcut would be faster.' },
  { id: 'q47', facet: 'prudence',       key:  1, text: 'I think through the downside before committing to anything significant.' },
  { id: 'q48', facet: 'prudence',       key: -1, text: 'Rules that slow the work down are there to be bent.' }
];

/* --- Candour scale (not a personality score) -----------------------------
   Denying near-universal minor failings. High agreement suggests the profile
   was answered as the person wishes to be seen rather than as they are.
   ------------------------------------------------------------------------ */
export const CANDOUR_ITEMS = [
  { id: 'c1', facet: 'candour', key: 1, text: 'I have never been irritated by a colleague.' },
  { id: 'c2', facet: 'candour', key: 1, text: 'I have never told even a small untruth to avoid an awkward conversation.' },
  { id: 'c3', facet: 'candour', key: 1, text: 'I have never put off a task because I found it unpleasant.' },
  { id: 'c4', facet: 'candour', key: 1, text: 'I have never spoken about a colleague in a way I would not repeat to them.' },
  { id: 'c5', facet: 'candour', key: 1, text: 'I have never lost my temper, even slightly.' },
  { id: 'c6', facet: 'candour', key: 1, text: 'Every commitment I have ever made at work, I have kept.' }
];

/* --- Part 2: forced-choice tetrads (DISC / PI style) ---------------------- */
export const TETRADS = [
  { id: 't01', options: [
    { text: 'Direct',            disc: 'D' }, { text: 'Enthusiastic',  disc: 'I' },
    { text: 'Patient',           disc: 'S' }, { text: 'Precise',       disc: 'C' } ] },
  { id: 't02', options: [
    { text: 'Competitive',       disc: 'D' }, { text: 'Persuasive',    disc: 'I' },
    { text: 'Loyal',             disc: 'S' }, { text: 'Systematic',    disc: 'C' } ] },
  { id: 't03', options: [
    { text: 'Decisive',          disc: 'D' }, { text: 'Outgoing',      disc: 'I' },
    { text: 'Steady',            disc: 'S' }, { text: 'Analytical',    disc: 'C' } ] },
  { id: 't04', options: [
    { text: 'Takes charge',      disc: 'D' }, { text: 'Inspires people', disc: 'I' },
    { text: 'Listens closely',   disc: 'S' }, { text: 'Checks the facts', disc: 'C' } ] },
  { id: 't05', options: [
    { text: 'Blunt',             disc: 'D' }, { text: 'Talkative',     disc: 'I' },
    { text: 'Accommodating',     disc: 'S' }, { text: 'Reserved',      disc: 'C' } ] },
  { id: 't06', options: [
    { text: 'Willing to risk',   disc: 'D' }, { text: 'Optimistic',    disc: 'I' },
    { text: 'Dependable',        disc: 'S' }, { text: 'Cautious',      disc: 'C' } ] },
  { id: 't07', options: [
    { text: 'Demanding',         disc: 'D' }, { text: 'Sociable',      disc: 'I' },
    { text: 'Even-tempered',     disc: 'S' }, { text: 'Detail-focused', disc: 'C' } ] },
  { id: 't08', options: [
    { text: 'Results-driven',    disc: 'D' }, { text: 'Expressive',    disc: 'I' },
    { text: 'Supportive',        disc: 'S' }, { text: 'By the book',   disc: 'C' } ] },
  { id: 't09', options: [
    { text: 'Forceful',          disc: 'D' }, { text: 'Charming',      disc: 'I' },
    { text: 'Deliberate',        disc: 'S' }, { text: 'Exacting',      disc: 'C' } ] },
  { id: 't10', options: [
    { text: 'Independent',       disc: 'D' }, { text: 'Spontaneous',   disc: 'I' },
    { text: 'Consistent',        disc: 'S' }, { text: 'Disciplined',   disc: 'C' } ] }
];

/* --- Part 3: reasoning (Caliper-style abstract / logical) ----------------- */
export const REASONING_ITEMS = [
  { id: 'r1', text: 'Which number continues the series?',
    detail: '3,  6,  11,  18,  27,  ?',
    options: ['34', '36', '38', '40'], answer: 2 },
  { id: 'r2', text: 'Which letter continues the series?',
    detail: 'A,  C,  F,  J,  O,  ?',
    options: ['S', 'T', 'U', 'V'], answer: 2 },
  { id: 'r3', text: 'Complete the analogy.',
    detail: 'Ledger is to transactions as portfolio is to …',
    options: ['Advisers', 'Holdings', 'Markets', 'Statements'], answer: 1 },
  { id: 'r4', text: 'Every senior adviser at the firm holds the CFP. Some CFP holders at the firm are not senior advisers. Which statement must be true?',
    detail: '',
    options: [
      'Most CFP holders are senior advisers.',
      'Anyone without the CFP is not a senior adviser.',
      'Some senior advisers do not hold the CFP.',
      'The firm has more senior advisers than CFP holders.'
    ], answer: 1 },
  { id: 'r5', text: 'A book of business grows from $40M to $50M in year one, then falls 10% in year two. Where does it end year two?',
    detail: '',
    options: ['$44M', '$45M', '$46M', '$49M'], answer: 1 },
  { id: 'r6', text: 'Which value does not belong with the others?',
    detail: '121,  144,  169,  180,  196',
    options: ['144', '169', '180', '196'], answer: 2 }
];

/* --- Section assembly ----------------------------------------------------
   Likert items are interleaved so consecutive statements rarely share a
   facet, which limits response sets and makes straight-lining visible.
   ------------------------------------------------------------------------ */
function interleave(items, candour) {
  const byFacet = {};
  items.forEach(i => (byFacet[i.facet] ||= []).push(i));
  const order = Object.keys(byFacet);
  const out = [];
  for (let round = 0; round < 3; round++) {
    const seq = round % 2 === 0 ? order : [...order].reverse();
    seq.forEach(f => { if (byFacet[f][round]) out.push(byFacet[f][round]); });
  }
  // Seed the candour items at fixed, spread-out positions.
  candour.forEach((c, i) => out.splice(Math.round((i + 1) * out.length / (candour.length + 1)) + i, 0, c));
  return out;
}

export const LIKERT_SEQUENCE = interleave(LIKERT_ITEMS, CANDOUR_ITEMS);

export const SECTIONS = [
  { id: 'likert',    title: 'How you work',        kind: 'likert',
    intro: 'Fifty-four statements about work. There are no right answers — answer as you actually are, not as you think a hiring manager wants. First instinct is usually the accurate one.',
    perPage: 6, items: LIKERT_SEQUENCE },
  { id: 'tetrad',    title: 'Most and least like you', kind: 'tetrad',
    intro: 'Ten sets of four words. In each set choose the one word MOST like you at work and the one word LEAST like you. All four may fit, or none may fit well — pick the extremes anyway.',
    perPage: 1, items: TETRADS },
  { id: 'reasoning', title: 'Reasoning',           kind: 'reasoning',
    intro: 'Six short problems on pattern recognition and logic. Untimed, but work briskly — spending more than a minute on any one problem rarely helps.',
    perPage: 1, items: REASONING_ITEMS }
];

export const TOTAL_ITEMS =
  LIKERT_SEQUENCE.length + TETRADS.length + REASONING_ITEMS.length;
