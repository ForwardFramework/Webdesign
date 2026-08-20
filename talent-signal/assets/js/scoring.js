/* ==========================================================================
   Signal — scoring engine
   --------------------------------------------------------------------------
   One pass over the raw responses produces every layer of the report:

     facets        16 workplace facets, percentile-banded against NORMS
     bigFive       OCEAN domains, composed from the facets
     disc          D / I / S / C from the forced-choice blocks
     drives        four behavioural drives (PI-style), likert x forced-choice
     hpi           seven bright-side scales (HPI-style)
     caliper       six job-performance competencies (Caliper-style)
     validity      candour, consistency, straight-lining, pace
     roleFit       distance-weighted fit against six role templates

   Every derived score is a documented linear blend of the facets — nothing is
   a black box, and every weight below can be re-tuned against your own hires.
   ========================================================================== */

import { LIKERT_ITEMS, CANDOUR_ITEMS, TETRADS, REASONING_ITEMS, NORMS, FACETS } from './items.js';

/* --- Maths helpers ------------------------------------------------------- */
const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = n => Math.round(n * 10) / 10;
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/** Abramowitz & Stegun 7.1.26 error function — accurate to ~1.5e-7. */
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 +
               t * (-1.453152027 + t * 1.061405429))));
  return sign * (1 - poly * Math.exp(-x * x));
}
const normCdf = z => 0.5 * (1 + erf(z / Math.SQRT2));

/** Raw facet mean (1-5) -> percentile band (0-100) against the norm sample. */
function toPercentile(raw, norm) {
  const z = (raw - norm.m) / norm.sd;
  return clamp(round(normCdf(z) * 100), 1, 99);
}

const blend = (parts) => clamp(round(parts.reduce((s, [v, w]) => s + v * w, 0)));

export const band = v =>
  v >= 80 ? 'very high' : v >= 65 ? 'high' : v >= 36 ? 'mid' : v >= 21 ? 'low' : 'very low';
export const bandClass = v =>
  v >= 65 ? 'is-high' : v >= 36 ? 'is-mid' : 'is-low';

/* --- Part 1: facets ------------------------------------------------------ */
function scoreFacets(answers) {
  const buckets = {};
  LIKERT_ITEMS.forEach(item => {
    const a = answers[item.id];
    if (a == null) return;
    const scored = item.key === 1 ? a : 6 - a;
    (buckets[item.facet] ||= []).push(scored);
  });
  const facets = {}, rawMeans = {};
  Object.keys(FACETS).forEach(f => {
    const vals = buckets[f] || [];
    const m = vals.length ? mean(vals) : 3;
    rawMeans[f] = round(m);
    facets[f] = toPercentile(m, NORMS[f]);
  });
  return { facets, rawMeans, buckets };
}

/* --- Part 2: DISC from the forced-choice blocks -------------------------- */
function scoreDisc(answers) {
  const tally = { D: 0, I: 0, S: 0, C: 0 };
  let blocks = 0;
  TETRADS.forEach(t => {
    const a = answers[t.id];
    if (!a || a.most == null || a.least == null) return;
    blocks++;
    tally[t.options[a.most].disc] += 1;
    tally[t.options[a.least].disc] -= 1;
  });
  // Range is -blocks..+blocks; map onto 0-100 with 50 as "no net preference".
  const disc = {};
  const span = blocks || 1;
  Object.keys(tally).forEach(k => { disc[k] = clamp(round(50 + (tally[k] / span) * 55)); });
  return { disc, tally, blocks };
}

const DISC_NAMES = {
  DD: 'Driver',      DI: 'Trailblazer', DS: 'Producer',     DC: 'Commander',
  ID: 'Persuader',   II: 'Influencer',  IS: 'Connector',    IC: 'Promoter',
  SD: 'Achiever',    SI: 'Collaborator', SS: 'Supporter',   SC: 'Anchor',
  CD: 'Challenger',  CI: 'Diplomat',    CS: 'Coordinator',  CC: 'Perfectionist'
};
const DISC_LABEL = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness' };
const DISC_BLURB = {
  Driver: 'Blunt, fast and outcome-first. Sets the pace and expects others to keep up.',
  Trailblazer: 'Pushes into new ground and brings people with them by force of conviction.',
  Producer: 'Drives hard but keeps a stable base; sustained output over dramatic swings.',
  Commander: 'Decisive and exacting. Wants the result and wants it right.',
  Persuader: 'Wins through people. Competitive, but the pitch does the work.',
  Influencer: 'Energy, optimism and reach. Opens doors that stay open.',
  Connector: 'Warm and durable with people; builds the network rather than working it.',
  Promoter: 'Sells the idea, then wants the detail to hold up behind it.',
  Achiever: 'Quietly ambitious. Delivers through consistency rather than volume.',
  Collaborator: 'Keeps the team together and the tone right while the work gets done.',
  Supporter: 'Steady, dependable, low-drama. The one others lean on.',
  Anchor: 'Reliable and methodical. Protects the standard when things get busy.',
  Challenger: 'Questions the premise. Direct about what the analysis will not support.',
  Diplomat: 'Precise but personable; makes the careful case without friction.',
  Coordinator: 'Organises the moving parts and keeps everyone honest about them.',
  Perfectionist: 'Accuracy above all. Slow to commit, rarely wrong when they do.'
};

function discPattern(disc) {
  const ordered = Object.entries(disc).sort((a, b) => b[1] - a[1]);
  const primary = ordered[0][0], secondary = ordered[1][0];
  const key = primary + (ordered[0][1] - ordered[1][1] > 22 ? primary : secondary);
  return {
    primary, secondary,
    primaryLabel: DISC_LABEL[primary],
    secondaryLabel: DISC_LABEL[secondary],
    name: DISC_NAMES[key] || DISC_NAMES[primary + primary],
    blurb: DISC_BLURB[DISC_NAMES[key] || DISC_NAMES[primary + primary]],
    ordered
  };
}

/* --- Part 3: behavioural drives (PI-style) -------------------------------
   Each drive is 70% normative (facets) and 30% ipsative (forced choice), so a
   candidate who answers agreeably on the statements still has to commit to a
   preference under forced choice.
   ------------------------------------------------------------------------ */
function scoreDrives(f, disc) {
  const mix = (norm, ip) => clamp(round(norm * 0.7 + ip * 0.3));
  return {
    dominance: mix(blend([[f.assertiveness, .45], [f.drive, .3], [100 - f.cooperation, .25]]), disc.D),
    extraversion: mix(blend([[f.sociability, .55], [f.persuasion, .45]]), disc.I),
    patience: mix(blend([[100 - f.urgency, .5], [f.composure, .25], [f.cooperation, .25]]), disc.S),
    formality: mix(blend([[f.structure, .45], [f.prudence, .4], [f.accountability, .15]]), disc.C)
  };
}

const DRIVE_LABELS = {
  dominance: { label: 'Dominance', low: 'Cooperative, consensus-seeking', high: 'Independent, takes control' },
  extraversion: { label: 'Extraversion', low: 'Reserved, task-focused', high: 'Outgoing, people-focused' },
  patience: { label: 'Patience', low: 'Fast, restless, urgent', high: 'Steady, consistent, unhurried' },
  formality: { label: 'Formality', low: 'Informal, flexible with rules', high: 'Precise, structured, by the book' }
};

/* Reference profiles as points in drive space [dominance, extraversion, patience, formality]. */
const REFERENCE_PROFILES = [
  { name: 'Controller',   v: [82, 22, 24, 86], blurb: 'Fast, exacting and self-directed. Wants control of the standard as well as the outcome.' },
  { name: 'Venturer',     v: [86, 55, 24, 30], blurb: 'Builds things that do not exist yet. Tolerant of risk, impatient with process.' },
  { name: 'Maverick',     v: [86, 76, 26, 34], blurb: 'Drives hard and sells hard. Needs room to run and a target worth chasing.' },
  { name: 'Captain',      v: [80, 62, 36, 46], blurb: 'Natural leader of a push. Comfortable directing people toward a deadline.' },
  { name: 'Persuader',    v: [70, 86, 30, 34], blurb: 'Wins people over. Thrives on contact, competition and the close.' },
  { name: 'Promoter',     v: [50, 90, 36, 26], blurb: 'The connector. Enthusiasm and reach; detail is somebody else’s job.' },
  { name: 'Collaborator', v: [36, 74, 62, 42], blurb: 'Works through the team. Warm, supportive and steady with people.' },
  { name: 'Altruist',     v: [34, 70, 66, 66], blurb: 'Helpful and diplomatic. Puts the client or colleague ahead of the scoreboard.' },
  { name: 'Guardian',     v: [30, 30, 72, 86], blurb: 'Careful and unhurried. Protects accuracy and the way things are done.' },
  { name: 'Craftsman',    v: [36, 26, 76, 60], blurb: 'Steady producer. Head down, consistent, dependable output.' },
  { name: 'Specialist',   v: [24, 30, 70, 90], blurb: 'Deep and precise in a defined lane. Loyal to the standard.' },
  { name: 'Operator',     v: [30, 42, 80, 54], blurb: 'Patient and reliable. Keeps the routine running without supervision.' },
  { name: 'Individualist',v: [80, 34, 30, 46], blurb: 'Independent thinker. Direct, analytical and unbothered by consensus.' },
  { name: 'Strategist',   v: [70, 46, 56, 72], blurb: 'Long view with teeth. Plans carefully, then drives the plan.' },
  { name: 'Analyzer',     v: [68, 26, 32, 86], blurb: 'Rigorous and driving. Digs into the data before committing, then commits hard.' },
  { name: 'Scholar',      v: [40, 22, 56, 90], blurb: 'Quiet, thorough and technically deep. Learns before acting.' },
  { name: 'Artisan',      v: [26, 26, 80, 76], blurb: 'Patient and meticulous. Quality over pace, every time.' },
  { name: 'Adapter',      v: [50, 50, 50, 50], blurb: 'Flexes to what the situation needs. Reads the room and adjusts the approach.' }
];

function nearestProfile(drives) {
  const v = [drives.dominance, drives.extraversion, drives.patience, drives.formality];
  const scored = REFERENCE_PROFILES
    .map(p => ({ ...p, d: Math.hypot(...p.v.map((x, i) => x - v[i])) }))
    .sort((a, b) => a.d - b.d);
  const best = scored[0];
  return {
    name: best.name,
    blurb: best.blurb,
    // 0 distance -> 100; 120 units of distance -> 0.
    match: clamp(round(100 - (best.d / 1.2))),
    runnerUp: scored[1].name
  };
}

/* --- Part 4: Big Five ---------------------------------------------------- */
function scoreBigFive(f) {
  return {
    openness: blend([[f.curiosity, .4], [f.adaptability, .35], [f.learning, .25]]),
    conscientiousness: blend([[f.structure, .3], [f.drive, .25], [f.accountability, .25], [f.prudence, .2]]),
    extraversion: blend([[f.assertiveness, .35], [f.sociability, .35], [f.persuasion, .3]]),
    agreeableness: blend([[f.cooperation, .35], [f.empathy, .35], [f.service, .3]]),
    stability: blend([[f.composure, .5], [f.resilience, .5]])
  };
}

const BIG_FIVE_META = {
  openness:          { label: 'Openness',            axis: 'Conventional ←→ Inventive' },
  conscientiousness: { label: 'Conscientiousness',   axis: 'Flexible ←→ Disciplined' },
  extraversion:      { label: 'Extraversion',        axis: 'Reserved ←→ Outgoing' },
  agreeableness:     { label: 'Agreeableness',       axis: 'Challenging ←→ Accommodating' },
  stability:         { label: 'Emotional Stability', axis: 'Reactive ←→ Composed' }
};

/* --- Part 5: HPI-style bright-side scales -------------------------------- */
function scoreHpi(f) {
  return {
    adjustment: blend([[f.composure, .55], [f.resilience, .45]]),
    ambition: blend([[f.assertiveness, .4], [f.drive, .4], [f.persuasion, .2]]),
    sociability: blend([[f.sociability, .7], [f.persuasion, .3]]),
    sensitivity: blend([[f.empathy, .5], [f.cooperation, .3], [f.service, .2]]),
    prudence: blend([[f.structure, .4], [f.prudence, .35], [f.accountability, .25]]),
    inquisitive: blend([[f.curiosity, .6], [f.adaptability, .4]]),
    learning: blend([[f.learning, .8], [f.curiosity, .2]])
  };
}

const HPI_META = {
  adjustment:  { label: 'Adjustment',              blurb: 'Steadiness, stress tolerance, evenness under scrutiny.' },
  ambition:    { label: 'Ambition',                blurb: 'Initiative, competitiveness, appetite for leadership.' },
  sociability: { label: 'Sociability',             blurb: 'Need for social contact and visibility.' },
  sensitivity: { label: 'Interpersonal Sensitivity', blurb: 'Tact, warmth, maintaining relationships.' },
  prudence:    { label: 'Prudence',                blurb: 'Self-discipline, conscientiousness, rule-following.' },
  inquisitive: { label: 'Inquisitive',             blurb: 'Imagination, curiosity, appetite for problems.' },
  learning:    { label: 'Learning Approach',       blurb: 'Enjoyment of staying current and formally skilled.' }
};

/* --- Part 6: Caliper-style competencies ---------------------------------- */
function scoreReasoning(answers) {
  let correct = 0, answered = 0;
  REASONING_ITEMS.forEach(item => {
    const a = answers[item.id];
    if (a == null) return;
    answered++;
    if (a === item.answer) correct++;
  });
  const pct = REASONING_ITEMS.length ? (correct / REASONING_ITEMS.length) : 0;
  // Six items is a screen, not a full ability test: compress toward the middle.
  return { correct, answered, total: REASONING_ITEMS.length, score: clamp(round(18 + pct * 74)) };
}

function scoreCaliper(f, reasoning) {
  return {
    persuasiveness: blend([[f.persuasion, .55], [f.assertiveness, .25], [f.sociability, .2]]),
    urgency: blend([[f.drive, .4], [f.urgency, .4], [f.assertiveness, .2]]),
    resilience: blend([[f.resilience, .5], [f.composure, .35], [f.drive, .15]]),
    service: blend([[f.service, .5], [f.empathy, .3], [f.cooperation, .2]]),
    accountability: blend([[f.accountability, .5], [f.structure, .25], [f.prudence, .25]]),
    reasoning: reasoning.score
  };
}

const CALIPER_META = {
  persuasiveness: { label: 'Persuasiveness', blurb: 'Moves people to a decision.' },
  urgency:        { label: 'Urgency & Drive', blurb: 'Need to win, need to move.' },
  resilience:     { label: 'Resilience',     blurb: 'Absorbs rejection and keeps going.' },
  service:        { label: 'Service Orientation', blurb: 'Reads and meets client needs.' },
  accountability: { label: 'Accountability', blurb: 'Owns the outcome and the detail.' },
  reasoning:      { label: 'Abstract Reasoning', blurb: 'Sees patterns and draws sound conclusions.' }
};

/* --- Part 7: validity ---------------------------------------------------- */
function scoreValidity(answers, buckets, elapsedMs) {
  // Candour: agreement with denial-of-common-failing items.
  const cVals = CANDOUR_ITEMS.map(i => answers[i.id]).filter(v => v != null);
  const candourRaw = cVals.length ? mean(cVals) : 1;
  const candour = clamp(round(100 - ((candourRaw - 1) / 4) * 100)); // high = candid

  // Consistency: agreement between items inside the same facet.
  const spreads = Object.values(buckets)
    .filter(v => v.length > 1)
    .map(v => Math.max(...v) - Math.min(...v));
  const consistency = clamp(round(100 - (mean(spreads) / 4) * 100));

  // Engagement: variance across all likert answers catches straight-lining.
  const all = LIKERT_ITEMS.map(i => answers[i.id]).filter(v => v != null);
  const mu = mean(all);
  const sd = Math.sqrt(mean(all.map(v => (v - mu) ** 2)));
  const engagement = clamp(round((sd / 1.15) * 100));

  const minutes = elapsedMs ? elapsedMs / 60000 : null;
  const paceFlag = minutes != null && minutes < 6;

  const flags = [];
  if (candour < 45) flags.push({ level: 'warn', text: 'Self-presentation is unusually favourable — treat trait scores as a ceiling and probe with behavioural evidence.' });
  if (consistency < 45) flags.push({ level: 'warn', text: 'Answers within the same trait diverge more than usual. Confirm the standout scores in interview.' });
  if (engagement < 30) flags.push({ level: 'warn', text: 'Very little variation between answers, which can indicate a rushed or disengaged response set.' });
  if (paceFlag) flags.push({ level: 'warn', text: `Completed in ${Math.round(minutes)} minutes, faster than a considered response set usually allows.` });
  if (!flags.length) flags.push({ level: 'ok', text: 'No response-quality concerns. The profile can be read at face value.' });

  return { candour, consistency, engagement, minutes: minutes ? Math.round(minutes) : null, flags,
           status: flags.some(f => f.level === 'warn') ? 'review' : 'clear' };
}

/* --- Part 8: role fit ----------------------------------------------------
   Each template names the competency level the role actually needs. Fit is
   penalised only for falling short, and lightly for overshooting where an
   excess genuinely causes friction (marked `capped`).
   ------------------------------------------------------------------------ */
export const ROLE_TEMPLATES = [
  { id: 'bd', label: 'Business Development',
    summary: 'Opens relationships, carries a number, lives with rejection.',
    targets: { persuasiveness: 80, urgency: 82, resilience: 80, service: 58, accountability: 62, reasoning: 55 },
    capped: [] },
  { id: 'client', label: 'Client Relationship',
    summary: 'Owns the ongoing relationship, retention and trust.',
    targets: { persuasiveness: 62, urgency: 52, resilience: 68, service: 85, accountability: 76, reasoning: 60 },
    capped: ['urgency'] },
  { id: 'ops', label: 'Operations & Compliance',
    summary: 'Holds the process, the record and the standard.',
    targets: { persuasiveness: 40, urgency: 45, resilience: 62, service: 66, accountability: 88, reasoning: 68 },
    capped: ['urgency', 'persuasiveness'] },
  { id: 'lead', label: 'Team Leadership',
    summary: 'Sets direction, makes the calls, develops the people.',
    targets: { persuasiveness: 76, urgency: 72, resilience: 80, service: 66, accountability: 82, reasoning: 70 },
    capped: [] },
  { id: 'analyst', label: 'Analyst / Technical',
    summary: 'Depth, accuracy and defensible conclusions.',
    targets: { persuasiveness: 42, urgency: 48, resilience: 60, service: 52, accountability: 80, reasoning: 84 },
    capped: ['urgency'] },
  { id: 'talent', label: 'Recruiting / Talent',
    summary: 'Sources, sells and shepherds people who were not looking.',
    targets: { persuasiveness: 82, urgency: 74, resilience: 82, service: 74, accountability: 70, reasoning: 60 },
    capped: [] }
];

function scoreRoleFit(caliper) {
  return ROLE_TEMPLATES.map(role => {
    const keys = Object.keys(role.targets);
    const gaps = keys.map(k => {
      const target = role.targets[k], actual = caliper[k];
      if (actual >= target) return role.capped.includes(k) ? (actual - target) * 0.35 : 0;
      return target - actual;
    });
    // A single catastrophic shortfall must not be averaged away by five
    // comfortable scores, so the worst gap carries half the weight on its own.
    const worst = Math.max(...gaps);
    const fit = clamp(round(100 - (mean(gaps) * 0.5 + worst * 0.5) * 1.7));
    const shortfalls = keys
      .filter(k => caliper[k] < role.targets[k] - 12)
      .sort((a, b) => (role.targets[a] - caliper[a]) < (role.targets[b] - caliper[b]) ? 1 : -1)
      .map(k => CALIPER_META[k].label);
    // A capped competency the candidate overshoots is not a strength in this
    // seat — too much sell in a compliance role is friction, not an asset.
    const strengths = keys
      .filter(k => caliper[k] >= role.targets[k] && !role.capped.includes(k))
      .sort((a, b) => (caliper[b] - role.targets[b]) - (caliper[a] - role.targets[a]))
      .map(k => CALIPER_META[k].label);
    const overshoot = keys
      .filter(k => role.capped.includes(k) && caliper[k] > role.targets[k] + 12)
      .sort((a, b) => (caliper[b] - role.targets[b]) - (caliper[a] - role.targets[a]))
      .map(k => CALIPER_META[k].label);
    return { ...role, fit, shortfalls, strengths, overshoot,
             verdict: fit >= 75 ? 'Strong fit' : fit >= 58 ? 'Workable fit' : fit >= 42 ? 'Stretch' : 'Poor fit' };
  }).sort((a, b) => b.fit - a.fit);
}

/* --- Part 9: narrative --------------------------------------------------- */
const NARRATIVE = {
  curiosity:      ['Sticks to proven methods and prefers a settled playbook.', 'Actively hunts for a better way to do the work.'],
  adaptability:   ['Needs a stable plan; frequent pivots cost them energy.', 'Reorganises quickly when priorities move.'],
  structure:      ['Works loosely; detail and admin need a backstop.', 'Runs a tight system and catches errors before they ship.'],
  drive:          ['Content to meet the standard rather than beat it.', 'Sets a higher bar than the one they were given.'],
  assertiveness:  ['Waits to read the room before committing to a view.', 'States a position early and defends it.'],
  sociability:    ['Draws energy from focused solo work.', 'Gains energy from contact and new faces.'],
  cooperation:    ['Holds their ground; will spend goodwill to be right.', 'Defers readily and protects the working relationship.'],
  empathy:        ['Reads the task more closely than the person.', 'Picks up on how people are landing and adjusts.'],
  composure:      ['Feels pressure sharply and carries it afterwards.', 'Keeps an even keel when things get hot.'],
  resilience:     ['Setbacks linger and dent the next few days.', 'Recovers fast and treats a knock as fuel.'],
  urgency:        ['Prefers a measured, predictable tempo.', 'Pushes for the decision and dislikes drift.'],
  persuasion:     ['Would rather present the facts than work the room.', 'Comfortable making the case and closing it.'],
  service:        ['Guards their focus over inbound requests.', 'Anticipates needs and gets ahead of the ask.'],
  accountability: ['Frames shortfalls in terms of circumstance.', 'Puts their hand up first when something slips.'],
  learning:       ['Learns on the job rather than by deliberate study.', 'Invests continuously in staying current.'],
  prudence:       ['Comfortable bending process to move faster.', 'Follows the process and weighs the downside first.']
};

const MANAGEMENT_TIPS = {
  highDominance: 'Give them scope and a number, not a method. Litigating the how will cost you more than it buys.',
  lowDominance: 'Be explicit when you want a decision made. They will wait for consensus unless told the call is theirs.',
  highExtraversion: 'Keep them in front of people. Long stretches of solo desk work will flatten them.',
  lowExtraversion: 'Protect focus time and give notice before you put them in front of a room.',
  highPatience: 'Signal changes early. Sudden reversals cost them more than they let on.',
  lowPatience: 'Give them the next thing before they finish the current one. Idle queues create friction.',
  highFormality: 'Give them the standard in writing. Ambiguity in the spec reads to them as risk.',
  lowFormality: 'Agree the non-negotiables up front; assume the rest of the process will get streamlined.'
};

function buildNarrative(f, drives, bigFive, validity) {
  const ranked = Object.entries(f).sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 4);
  const bottom = ranked.slice(-3).reverse();

  const strengths = top.map(([k, v]) => ({ facet: k, label: FACETS[k].label, score: v, text: NARRATIVE[k][1] }));
  const watchouts = bottom.map(([k, v]) => ({ facet: k, label: FACETS[k].label, score: v, text: NARRATIVE[k][0] }));

  const tips = [];
  tips.push(drives.dominance >= 60 ? MANAGEMENT_TIPS.highDominance : drives.dominance <= 40 ? MANAGEMENT_TIPS.lowDominance : null);
  tips.push(drives.extraversion >= 60 ? MANAGEMENT_TIPS.highExtraversion : drives.extraversion <= 40 ? MANAGEMENT_TIPS.lowExtraversion : null);
  tips.push(drives.patience >= 60 ? MANAGEMENT_TIPS.highPatience : drives.patience <= 40 ? MANAGEMENT_TIPS.lowPatience : null);
  tips.push(drives.formality >= 60 ? MANAGEMENT_TIPS.highFormality : drives.formality <= 40 ? MANAGEMENT_TIPS.lowFormality : null);

  return { strengths, watchouts, tips: tips.filter(Boolean) };
}

/* --- Part 10: interview probes ------------------------------------------ */
const PROBES = {
  structure:      'Walk me through how you tracked commitments in your last role. What fell through the cracks, and what did you change afterwards?',
  accountability: 'Tell me about a result you were responsible for that came in under target. What was yours to own in that?',
  resilience:     'Describe the hardest stretch of rejection you have worked through. What did week three look like?',
  composure:      'Tell me about the angriest a client has been with you. What did you say in the first sixty seconds?',
  persuasion:     'Describe a time you changed a sceptical decision-maker’s mind. What was the specific objection?',
  assertiveness:  'When did you last tell someone more senior that they were wrong? How did you open that conversation?',
  urgency:        'Tell me about a decision you made without the full picture. How did you decide you had enough?',
  cooperation:    'Describe a disagreement with a colleague you did not win. How did you leave it?',
  empathy:        'Tell me about a time you realised a teammate was struggling before they told you.',
  service:        'What is the most inconvenient thing you have done for a client, and why did you do it?',
  drive:          'What target did you set for yourself last year that nobody asked you to set?',
  curiosity:      'What have you taught yourself in the last six months, and what prompted it?',
  learning:       'How do you keep current in your field? Give me something specific you have read or completed recently.',
  adaptability:   'Tell me about a project whose direction changed late. What did you have to throw away?',
  prudence:       'Describe a shortcut you decided not to take. What was the downside you were protecting against?',
  sociability:    'How do you build a network from a standing start in a new market?'
};

function buildProbes(f, validity, topRole) {
  const ranked = Object.entries(f).sort((a, b) => a[1] - b[1]);
  const probes = [];
  // Lowest-scoring facets that the top-fit role actually leans on come first.
  ranked.forEach(([k, v]) => {
    if (probes.length >= 5) return;
    if (v <= 45 && PROBES[k]) probes.push({ label: FACETS[k].label, score: v, why: 'Scored low — verify with behavioural evidence.', q: PROBES[k] });
  });
  // Then very high scores, which are worth confirming rather than assuming.
  Object.entries(f).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    if (probes.length >= 5) return;
    if (v >= 80 && PROBES[k] && !probes.some(p => p.q === PROBES[k]))
      probes.push({ label: FACETS[k].label, score: v, why: 'Scored very high — confirm it shows up in real situations.', q: PROBES[k] });
  });
  Object.entries(f).forEach(([k, v]) => {
    if (probes.length >= 5) return;
    if (!probes.some(p => p.q === PROBES[k])) probes.push({ label: FACETS[k].label, score: v, why: 'General coverage.', q: PROBES[k] });
  });
  if (validity.candour < 45) {
    probes.unshift({ label: 'Candour', score: validity.candour,
      why: 'Self-presentation ran favourable across the profile.',
      q: 'Tell me about a piece of feedback you disagreed with at the time and later accepted. What changed your mind?' });
  }
  return probes.slice(0, 6);
}

/* --- Public API ---------------------------------------------------------- */
export function score(answers, meta = {}) {
  const { facets, rawMeans, buckets } = scoreFacets(answers);
  const { disc, blocks } = scoreDisc(answers);
  const drives = scoreDrives(facets, disc);
  const bigFive = scoreBigFive(facets);
  const hpi = scoreHpi(facets);
  const reasoning = scoreReasoning(answers);
  const caliper = scoreCaliper(facets, reasoning);
  const validity = scoreValidity(answers, buckets, meta.elapsedMs);
  const roleFit = scoreRoleFit(caliper);
  const pattern = discPattern(disc);
  const profile = nearestProfile(drives);
  const narrative = buildNarrative(facets, drives, bigFive, validity);
  const probes = buildProbes(facets, validity, roleFit[0]);

  return {
    version: 1,
    candidate: meta.candidate || {},
    completedAt: meta.completedAt || null,
    elapsedMs: meta.elapsedMs || null,
    blocksAnswered: blocks,
    facets, rawMeans, bigFive, disc, pattern, drives, profile,
    hpi, caliper, reasoning, validity, roleFit, narrative, probes
  };
}

export { BIG_FIVE_META, HPI_META, CALIPER_META, DRIVE_LABELS, DISC_LABEL, REFERENCE_PROFILES };
