/* =============================================================================
   Pricing model regression tests.   Run:  node tests/pricing.test.js
   -----------------------------------------------------------------------------
   These lock the estimator to the benchmarks in docs/PRICING-MODEL.md. If you
   change a rate, a test here should fail — update the rate AND the benchmark,
   or you have silently drifted away from the market.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* ---- Minimal browser shim so calculator.js can be loaded outside a page ---- */
const noop = () => {};
const stubEl = {
  innerHTML: '', value: '', hidden: true, textContent: '', classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], appendChild: noop,
  setAttribute: noop, removeAttribute: noop, focus: noop, remove: noop, options: [], style: {}, dataset: {}
};
const sandbox = {
  console,
  setTimeout, clearTimeout,
  window: {},
  document: {
    readyState: 'complete',
    addEventListener: noop,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => Object.assign({}, stubEl),
    documentElement: { classList: { add: noop } },
    body: { classList: { add: noop, remove: noop, toggle: noop } }
  },
  location: { hash: '', href: 'http://localhost/', search: '' },
  matchMedia: () => ({ matches: false })
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

for (const f of ['assets/js/config.js', 'assets/js/pricing-data.js', 'assets/js/calculator.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), sandbox, { filename: f });
}

const { estimate, monthlyPayment } = sandbox.window.EclipseCalc;
const PRICING = sandbox.window.ECLIPSE_PRICING;

/* ---- tiny test runner ----------------------------------------------------- */
let pass = 0, fail = 0;
const results = [];

function test(name, fn) {
  try { fn(); pass++; results.push(['PASS', name, '']); }
  catch (e) { fail++; results.push(['FAIL', name, e.message]); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

/** Assert the estimate midpoint lands inside a benchmarked window. */
function inRange(r, lo, hi, label) {
  assert(r, `${label}: estimator returned null`);
  assert(r.mid >= lo && r.mid <= hi,
    `${label}: midpoint $${r.mid.toLocaleString()} outside benchmark $${lo.toLocaleString()}–$${hi.toLocaleString()}`);
}

/** Look up an option's index by its label, so tests read like the UI. */
function pick(serviceId, questionId, label) {
  const q = PRICING[serviceId].questions.find(q => q.id === questionId);
  assert(q, `no question ${questionId} on ${serviceId}`);
  const i = q.options.findIndex(o => o.label === label);
  assert(i !== -1, `no option "${label}" on ${serviceId}.${questionId}`);
  return { value: q.options[i].value, index: i, label };
}

/* =============================================================================
   AWNINGS  — benchmark: $15–30/sq ft installed nationally (HomeGuide/Angi 2026);
   quality Florida motorised cassette units run materially higher.
   ========================================================================== */

test('Awnings: 12x10 manual, open roll, standard fabric → entry-level band', () => {
  const r = estimate('awnings', {
    type:       pick('awnings', 'type', 'Retractable — hand crank'),
    width:      pick('awnings', 'width', '10 – 13 feet'),
    projection: pick('awnings', 'projection', '10 feet'),
    housing:    pick('awnings', 'housing', 'Open roll'),
    fabric:     pick('awnings', 'fabric', 'Standard acrylic'),
    mounting:   pick('awnings', 'mounting', 'Standard wall'),
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  // 120 sq ft x $22 = $2,640. Angi: "most homeowners pay $1,000–$3,500".
  inRange(r, 2400, 2900, 'entry awning');
  assert(r.low < r.mid && r.mid < r.high, 'range must bracket the midpoint');
});

test('Awnings: 15x11.5 motorised, semi-cassette, premium fabric, wind sensor', () => {
  const r = estimate('awnings', {
    type:       pick('awnings', 'type', 'Retractable — motorized'),
    width:      pick('awnings', 'width', '14 – 16 feet'),
    projection: pick('awnings', 'projection', '11 – 12 feet'),
    housing:    pick('awnings', 'housing', 'Semi-cassette'),
    fabric:     pick('awnings', 'fabric', 'Premium marine'),
    mounting:   pick('awnings', 'mounting', 'Standard wall'),
    addons:     ['wind_sensor'],
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  // A premium 16-ft motorised cassette awning from a Florida dealer: ~$6k–$10k.
  inRange(r, 6000, 8000, 'premium motorised awning');
});

test('Awnings: fixed awnings skip the cassette question entirely', () => {
  const q = PRICING.awnings.questions.find(q => q.id === 'housing');
  assert(q.dependsOn && q.dependsOn.notIn.includes('fixed'), 'housing must be hidden for fixed awnings');
  const r = estimate('awnings', {
    type:       pick('awnings', 'type', 'Fixed / stationary'),
    width:      pick('awnings', 'width', '10 – 13 feet'),
    projection: pick('awnings', 'projection', '10 feet'),
    // A cassette answer left over from a previous path must NOT be counted.
    housing:    pick('awnings', 'housing', 'Full cassette'),
    fabric:     pick('awnings', 'fabric', 'Standard acrylic'),
    mounting:   pick('awnings', 'mounting', 'Standard wall'),
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  inRange(r, 3000, 3500, 'fixed awning');       // 120 x $27 = $3,240, no cassette adder
});

test('Awnings: three units cost less each than three separate jobs', () => {
  const base = {
    type:       pick('awnings', 'type', 'Retractable — motorized'),
    width:      pick('awnings', 'width', '10 – 13 feet'),
    projection: pick('awnings', 'projection', '10 feet'),
    housing:    pick('awnings', 'housing', 'Open roll'),
    fabric:     pick('awnings', 'fabric', 'Standard acrylic'),
    mounting:   pick('awnings', 'mounting', 'Standard wall')
  };
  const one   = estimate('awnings', { ...base, quantity: pick('awnings', 'quantity', 'Just one') });
  const three = estimate('awnings', { ...base, quantity: pick('awnings', 'quantity', 'Three') });
  assert(three.mid < one.mid * 3, 'three units must be cheaper than 3x a single unit');
  assert(three.mid > one.mid * 2.5, 'volume discount must not be absurd');
});

/* =============================================================================
   ROLL SCREENS — benchmark: motorised roll-downs $45–65/sq ft installed in FL
   (Eurex Shutters, SWFL), premium/marine systems reaching higher.
   ========================================================================== */

test('Screens: single 10x8 solar motorised opening', () => {
  const r = estimate('screens', {
    goal:      pick('screens', 'goal', 'Block sun & heat'),
    operation: pick('screens', 'operation', 'Motorized'),
    openings:  pick('screens', 'openings', '1 opening'),
    width:     pick('screens', 'width', '8 – 12 feet'),
    height:    pick('screens', 'height', '8 feet'),
    location:  pick('screens', 'location', 'Inland'),
    addons:    []
  });
  // 80 sq ft x $29 + $450 = $2,770
  inRange(r, 2500, 3100, 'single solar screen');
});

test('Screens: three 12x10 hurricane motorised openings, coastal, permitted', () => {
  const r = estimate('screens', {
    goal:      pick('screens', 'goal', 'Hurricane protection'),
    operation: pick('screens', 'operation', 'Motorized'),
    openings:  pick('screens', 'openings', '3 openings'),
    width:     pick('screens', 'width', '8 – 12 feet'),
    height:    pick('screens', 'height', '9 – 10 feet'),
    location:  pick('screens', 'location', 'Coastal / waterfront'),
    addons:    ['permit']
  });
  // ~$45–65/sq ft over 285 effective sq ft, plus coastal load and engineering.
  inRange(r, 17000, 24000, 'three coastal hurricane screens');
  const perSqFt = r.mid / (95 * 3);
  assert(perSqFt > 40 && perSqFt < 90, `implied $${perSqFt.toFixed(0)}/sq ft outside the published band`);
});

test('Screens: hurricane rating costs more than solar-only', () => {
  const base = {
    operation: pick('screens', 'operation', 'Motorized'),
    openings:  pick('screens', 'openings', '1 opening'),
    width:     pick('screens', 'width', '8 – 12 feet'),
    height:    pick('screens', 'height', '8 feet'),
    location:  pick('screens', 'location', 'Inland'),
    addons:    []
  };
  const solar = estimate('screens', { ...base, goal: pick('screens', 'goal', 'Block sun & heat') });
  const storm = estimate('screens', { ...base, goal: pick('screens', 'goal', 'Hurricane protection') });
  assert(storm.mid > solar.mid * 1.4, 'hurricane rating should be a clear step up in price');
});

test('Screens: manual is cheaper than motorised', () => {
  const base = {
    goal:     pick('screens', 'goal', 'Block sun & heat'),
    openings: pick('screens', 'openings', '1 opening'),
    width:    pick('screens', 'width', '8 – 12 feet'),
    height:   pick('screens', 'height', '8 feet'),
    location: pick('screens', 'location', 'Inland'),
    addons:   []
  };
  const manual = estimate('screens', { ...base, operation: pick('screens', 'operation', 'Manual crank') });
  const motor  = estimate('screens', { ...base, operation: pick('screens', 'operation', 'Motorized') });
  assert(manual.mid < motor.mid, 'manual must undercut motorised');
});

/* =============================================================================
   ALUMINUM — benchmark: solid aluminum patio cover $20–50/sq ft installed;
   insulated $30–60; South FL custom pergola $8,700–$11,700 (813patiopros).
   ========================================================================== */

test('Aluminum: 14x14 open lattice pergola on existing pavers', () => {
  const r = estimate('aluminum', {
    style:      pick('aluminum', 'style', 'Open lattice pergola'),
    width:      pick('aluminum', 'width', '12 – 16 feet'),
    depth:      pick('aluminum', 'depth', '12 – 16 feet'),
    attachment: pick('aluminum', 'attachment', 'Attached to the house'),
    surface:    pick('aluminum', 'surface', 'Existing concrete or pavers'),
    height:     pick('aluminum', 'height', 'Standard — up to 10 feet'),
    location:   pick('aluminum', 'location', 'Inland'),
    addons:     []
  });
  // 196 sq ft x $40 + $1,450 permit = $9,290 — inside the published SW FL band.
  inRange(r, 8500, 10500, 'lattice pergola');
});

test('Aluminum: 18x14 insulated roof with lighting and a fan', () => {
  const r = estimate('aluminum', {
    style:      pick('aluminum', 'style', 'Insulated roof panel'),
    width:      pick('aluminum', 'width', '16 – 20 feet'),
    depth:      pick('aluminum', 'depth', '12 – 16 feet'),
    attachment: pick('aluminum', 'attachment', 'Attached to the house'),
    surface:    pick('aluminum', 'surface', 'Existing concrete or pavers'),
    height:     pick('aluminum', 'height', 'Standard — up to 10 feet'),
    location:   pick('aluminum', 'location', 'Inland'),
    addons:     ['lighting', 'fans']
  });
  const perSqFt = r.mid / 252;
  assert(perSqFt > 40 && perSqFt < 75, `implied $${perSqFt.toFixed(0)}/sq ft outside the insulated-cover band`);
});

test('Aluminum: motorised louvered roof is the premium tier', () => {
  const base = {
    width:      pick('aluminum', 'width', '12 – 16 feet'),
    depth:      pick('aluminum', 'depth', '12 – 16 feet'),
    attachment: pick('aluminum', 'attachment', 'Attached to the house'),
    surface:    pick('aluminum', 'surface', 'Existing concrete or pavers'),
    height:     pick('aluminum', 'height', 'Standard — up to 10 feet'),
    location:   pick('aluminum', 'location', 'Inland'),
    addons:     []
  };
  const lattice  = estimate('aluminum', { ...base, style: pick('aluminum', 'style', 'Open lattice pergola') });
  const louvered = estimate('aluminum', { ...base, style: pick('aluminum', 'style', 'Motorized louvered roof') });
  assert(louvered.mid > lattice.mid * 2, 'louvered roofs should be a big step up');
});

test('Aluminum: bare ground adds a slab cost that scales with the footprint', () => {
  const base = {
    style:      pick('aluminum', 'style', 'Solid roof cover'),
    width:      pick('aluminum', 'width', '16 – 20 feet'),
    depth:      pick('aluminum', 'depth', '12 – 16 feet'),
    attachment: pick('aluminum', 'attachment', 'Attached to the house'),
    height:     pick('aluminum', 'height', 'Standard — up to 10 feet'),
    location:   pick('aluminum', 'location', 'Inland'),
    addons:     []
  };
  const onSlab = estimate('aluminum', { ...base, surface: pick('aluminum', 'surface', 'Existing concrete or pavers') });
  const onDirt = estimate('aluminum', { ...base, surface: pick('aluminum', 'surface', 'Bare ground / grass') });
  const delta = onDirt.mid - onSlab.mid;
  assert(delta > 2000 && delta < 3500, `slab adder $${delta} should track 252 sq ft x $11`);
});

/* =============================================================================
   ENGINE BEHAVIOUR
   ========================================================================== */

test('Band: "not sure" answers widen the range, but never past the cap', () => {
  const sure = estimate('awnings', {
    type:       pick('awnings', 'type', 'Retractable — motorized'),
    width:      pick('awnings', 'width', '14 – 16 feet'),
    projection: pick('awnings', 'projection', '10 feet'),
    housing:    pick('awnings', 'housing', 'Semi-cassette'),
    fabric:     pick('awnings', 'fabric', 'Premium marine'),
    mounting:   pick('awnings', 'mounting', 'Standard wall'),
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  const vague = estimate('awnings', {
    type:       pick('awnings', 'type', 'Not sure yet'),
    width:      pick('awnings', 'width', 'Not sure'),
    projection: pick('awnings', 'projection', 'Not sure'),
    housing:    pick('awnings', 'housing', 'Semi-cassette'),
    fabric:     pick('awnings', 'fabric', 'Premium marine'),
    mounting:   pick('awnings', 'mounting', 'Not sure'),
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  assert(vague.band > sure.band, 'unsure answers must widen the band');
  assert(vague.band <= PRICING.band.max + 1e-9, 'band must respect its cap');
  assert(sure.band === PRICING.band.base, 'a fully specific answer set should use the base band');
});

test('Range stays useful: never wider than +/-28% of the midpoint', () => {
  const r = estimate('screens', {
    goal:      pick('screens', 'goal', 'Both — sun and storms'),
    operation: pick('screens', 'operation', 'Not sure'),
    openings:  pick('screens', 'openings', '4 – 5 openings'),
    width:     pick('screens', 'width', 'Not sure'),
    height:    pick('screens', 'height', 'Not sure'),
    location:  pick('screens', 'location', 'Not sure'),
    addons:    ['permit']
  });
  const spread = (r.high - r.low) / r.mid;
  assert(spread <= 0.58, `range spread ${(spread * 100).toFixed(0)}% is too wide to be useful`);
});

test('Project minimum floors tiny jobs', () => {
  const r = estimate('awnings', {
    type:       pick('awnings', 'type', 'Retractable — hand crank'),
    width:      pick('awnings', 'width', 'Up to 10 feet'),
    projection: pick('awnings', 'projection', '8 feet'),
    housing:    pick('awnings', 'housing', 'Open roll'),
    fabric:     pick('awnings', 'fabric', 'Standard acrylic'),
    mounting:   pick('awnings', 'mounting', 'Standard wall'),
    quantity:   pick('awnings', 'quantity', 'Just one')
  });
  // 72 sq ft x $22 = $1,584, below the $1,750 floor.
  assert(r.mid >= PRICING.awnings.minProject * 0.99, `midpoint $${r.mid} fell under the project minimum`);
});

test('Offer discount applies above the threshold and not below it', () => {
  const big = estimate('aluminum', {
    style:      pick('aluminum', 'style', 'Solid roof cover'),
    width:      pick('aluminum', 'width', '12 – 16 feet'),
    depth:      pick('aluminum', 'depth', '12 – 16 feet'),
    attachment: pick('aluminum', 'attachment', 'Attached to the house'),
    surface:    pick('aluminum', 'surface', 'Existing concrete or pavers'),
    height:     pick('aluminum', 'height', 'Standard — up to 10 feet'),
    location:   pick('aluminum', 'location', 'Inland'),
    addons:     []
  });
  assert(big.discount === sandbox.window.ECLIPSE_CONFIG.offer.dollarsOff, 'large project should get the discount');
  assert(big.lowAfterOffer === big.low - big.discount, 'discounted low must subtract the offer');
});

test('Missing size returns null rather than a bogus number', () => {
  assert(estimate('awnings', { type: pick('awnings', 'type', 'Fixed / stationary') }) === null,
    'no dimensions should yield null');
  assert(estimate('nonsense', {}) === null, 'unknown service should yield null');
});

test('Monthly payment maths matches a standard amortisation', () => {
  // $10,000 at 9.99% over 120 months ≈ $132.15/mo
  const m = monthlyPayment(10000, 9.99, 120);
  assert(Math.abs(m - 132.15) < 0.5, `expected ~$132.15, got $${m.toFixed(2)}`);
  assert(Math.abs(monthlyPayment(12000, 0, 12) - 1000) < 0.01, '0% APR should divide evenly');
});

test('Every option in every service carries a usable price signal', () => {
  Object.keys(PRICING).forEach(key => {
    const svc = PRICING[key];
    if (!svc || !svc.questions) return;
    svc.questions.forEach(q => {
      q.options.forEach(o => {
        const priced = ['rate', 'rateAdd', 'mult', 'flat', 'perSqFt', 'volume']
          .some(k => typeof o[k] === 'number');
        // Screens price off a goal x operation matrix rather than per-option rates.
        const matrixDriven = key === 'screens' && ['goal', 'operation', 'width', 'height'].includes(q.id);
        const dimension = ['width', 'projection', 'depth'].includes(q.id);
        assert(priced || matrixDriven || dimension,
          `${key}.${q.id} → "${o.label}" has no price effect`);
      });
    });
  });
});

/* ---- report --------------------------------------------------------------- */
const pad = (s, n) => String(s).padEnd(n);
console.log('\n  Eclipse pricing model\n  ' + '─'.repeat(74));
results.forEach(([status, name, msg]) => {
  const mark = status === 'PASS' ? '  ✓' : '  ✗';
  console.log(`${mark} ${pad(name, 68)}`);
  if (msg) console.log(`      → ${msg}`);
});
console.log('  ' + '─'.repeat(74));
console.log(`  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
