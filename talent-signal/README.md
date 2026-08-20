# Signal — behavioural hiring assessment

A complete, self-contained hiring personality assessment and its landing page. Seventy scored
items produce one profile read five ways: **Big Five (OCEAN)**, **DISC**, **Hogan Personality
Inventory-style scales**, **Predictive Index-style behavioural drives**, and **Caliper-style job
competencies** including an abstract-reasoning screen.

No build step, no dependencies, no server. Open `index.html` in a browser and it works.

```
talent-signal/
├── index.html              landing page
├── assessment.html         the assessment + report app
└── assets/
    ├── css/brand.css       design tokens — the whole visual identity lives here
    ├── css/landing.css     landing page
    ├── css/app.css         assessment + report
    └── js/
        ├── items.js        item bank, facet map, norm table, section assembly
        ├── scoring.js      scoring engine — every framework, every weight
        ├── report.js       report rendering, SVG charts
        └── app.js          assessment flow, persistence, share links
```

## Running it

```bash
cd talent-signal
python3 -m http.server 8000
# then open http://localhost:8000
```

A static server is needed only because the code uses ES modules, which browsers refuse to load
over `file://`. Any static host works — GitHub Pages, S3, Netlify, a folder behind nginx.

| URL | What it does |
| --- | --- |
| `index.html` | Landing page |
| `assessment.html` | Take the assessment |
| `assessment.html?demo=1` | A stable sample report, no answering required |
| `assessment.html#r=<payload>` | Reopens a profile carried entirely inside the link |

## The assessment

**70 items, about 20 minutes**, in three parts:

1. **54 agreement statements** (5-point) — 48 scored across 16 workplace facets, plus 6 candour
   items. Reverse-keyed items are mixed in, and the sequence is interleaved so consecutive
   statements rarely measure the same thing.
2. **10 forced-choice blocks** — pick the word MOST and LEAST like you from four. Ipsative, so a
   candidate who agrees with everything still has to commit to a preference. This is what drives
   DISC and a third of each behavioural drive.
3. **6 reasoning problems** — number and letter series, analogy, logical deduction, arithmetic
   reasoning, odd-one-out. Untimed.

Every item is about workplace behaviour. There are deliberately **no items touching health,
disability, age, religion, family status, or any other protected characteristic.**

## How the five frameworks are derived

Sixteen facets are scored first. Everything else is a documented linear blend of them — there is
no hidden model, and every weight in `scoring.js` can be re-tuned against your own hires.

**The 16 facets** — curiosity, adaptability, structure & detail, achievement drive, assertiveness,
sociability, cooperation, empathy, composure, resilience, urgency, persuasion, service
orientation, accountability, learning approach, prudence. Each is the mean of three items, then
converted to a percentile band against the norm table.

| Framework | How it is produced |
| --- | --- |
| **Big Five (OCEAN)** | Five domains composed from the facets. *Openness* = curiosity ·0.4 + adaptability ·0.35 + learning ·0.25. *Conscientiousness* = structure ·0.3 + drive ·0.25 + accountability ·0.25 + prudence ·0.2. *Extraversion* = assertiveness ·0.35 + sociability ·0.35 + persuasion ·0.3. *Agreeableness* = cooperation ·0.35 + empathy ·0.35 + service ·0.3. *Emotional Stability* = composure ·0.5 + resilience ·0.5. |
| **DISC** | From the forced-choice blocks only. MOST scores +1 to that word's quadrant, LEAST scores −1; the net is mapped onto 0–100. Primary and secondary quadrants resolve to one of 16 named patterns (Driver, Trailblazer, Anchor, Perfectionist, …). |
| **Hogan HPI-style** | Seven bright-side scales: Adjustment, Ambition, Sociability, Interpersonal Sensitivity, Prudence, Inquisitive, Learning Approach — each a weighted blend of the facets (see `scoreHpi`). |
| **Predictive Index-style drives** | Four bipolar drives — Dominance, Extraversion, Patience, Formality — each **70% normative** (facets) and **30% ipsative** (the matching DISC quadrant), then matched by Euclidean distance to the nearest of **18 reference profiles** (Maverick, Captain, Guardian, Specialist, Strategist, …). |
| **Caliper-style competencies** | Persuasiveness, Urgency & Drive, Resilience, Service Orientation, Accountability, and Abstract Reasoning (the only score that comes from a right/wrong section rather than self-report). |

### Norm table

Facet raw means are converted to percentiles with a normal CDF against per-facet means and SDs in
`items.js → NORMS`. **These anchors are illustrative**, chosen so scores spread realistically —
they are not a validated sample. They live in one object precisely so they can be replaced: once
you have 150+ respondents in a given role, substitute your own means and SDs and the percentile
bands become meaningful for your firm.

### Response quality

Three checks decide whether the profile can be read at face value at all:

- **Candour** — agreement with six items denying near-universal minor failings ("I have never been
  irritated by a colleague"). High agreement means the profile was answered as the person wishes to
  be seen. Below 45, the report says trait scores are a ceiling.
- **Consistency** — spread between items measuring the same facet from opposite directions.
- **Engagement** — standard deviation across all agreement answers, which catches straight-lining,
  alongside a completion-pace flag under six minutes.

### Role fit

Six templates (`ROLE_TEMPLATES` in `scoring.js`) name the competency level a role actually needs.

```
fit = 100 − (mean(gaps) × 0.5 + worst gap × 0.5) × 1.7
```

Weighting the worst gap at half is deliberate: one catastrophic shortfall must not be averaged
away by five comfortable scores. Some competencies are marked `capped`, where overshooting also
costs — heavy persuasiveness in a compliance seat is friction, not an asset — and those are
reported separately as "more than the seat needs" rather than as a strength.

Adding a role is one object: a label, a summary, six target levels, and which of them are capped.

## Privacy

Everything is scored in the browser. There is no account, no server call and no database — answers
persist to `localStorage` under `signal.assessment.v1` until cleared. A profile leaves the machine
only by explicit action: **Download JSON**, **Print / save as PDF**, or **Copy shareable link**,
which encodes the whole answer set into the URL fragment. That link is not secret, so treat it as
you would the report itself.

## Re-branding

Every colour, font and shape token is in `assets/css/brand.css` under `:root`. Nothing else in the
codebase references a raw colour, so re-skinning is one file. Product naming lives in the page
`<title>`, the `.mark` wordmark blocks in `index.html` / `assessment.html`, and the footer.

The current palette — deep navy `#0b1f3a`, gold `#c8a44d`, serif display over sans body — was set
to read like a professional financial-services recruiting brand.

> **Note on the brand reference.** This was asked to follow the branding of
> `prianosolutions.com`. That domain is blocked by this environment's network egress policy, so
> its stylesheet, palette and type could not be inspected. The visual direction here was built
> from the firm's published positioning and voice (premium wealth-management recruiting; "the best
> candidates are never looking"), not from its actual CSS. **Swap the exact hex values and font
> families into `brand.css` and the whole product matches** — no other file needs to change.

## Fair use

Signal is an **independent instrument built on public constructs**. It is not the DISC assessment,
the Hogan Personality Inventory, the Predictive Index Behavioral Assessment, or the Caliper
Profile, and it is not normed or validated against those publishers' samples. Those are
proprietary instruments owned by their respective publishers and are named here only to describe
the constructs this assessment draws on. Where a certified, legally defensible instrument is
required for a specific hire, license the real one.

Personality assessment in hiring is regulated and the rules vary by jurisdiction. This instrument
has **not been validated for adverse impact**. Use it to structure interviews, reference calls and
management conversations — never as a pass/fail screen, and never as the sole basis for a decision.
Share the profile with the candidate; if you would not be comfortable showing it to them, do not
use it. It is not a clinical, medical or diagnostic instrument.
