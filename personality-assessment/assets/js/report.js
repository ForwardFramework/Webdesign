/* ==========================================================================
   Forward Framework Personality Assessment — report rendering
   Pure functions from a scored result object to DOM. No dependencies.
   ========================================================================== */

import { FACETS, REASONING_ITEMS } from './items.js';
import { BIG_FIVE_META, HPI_META, CALIPER_META, DRIVE_LABELS, DISC_LABEL, bandClass, band } from './scoring.js';

export const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* --- Charts -------------------------------------------------------------- */
function radar(values, labels, size = 300) {
  const cx = size / 2, cy = size / 2 + 6, r = size * 0.33;
  const n = values.length;
  const pt = (i, frac) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * frac, cy + Math.sin(a) * r * frac];
  };
  const ring = frac => Array.from({ length: n }, (_, i) => pt(i, frac).map(v => v.toFixed(1)).join(',')).join(' ');
  const shape = values.map((v, i) => pt(i, Math.max(v, 3) / 100).map(x => x.toFixed(1)).join(',')).join(' ');
  const spokes = Array.from({ length: n }, (_, i) => {
    const [x, y] = pt(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }).join('');
  // Square vertices rather than circles — the system has no round corners.
  const dots = values.map((v, i) => {
    const [x, y] = pt(i, Math.max(v, 3) / 100);
    return `<rect x="${(x - 3).toFixed(1)}" y="${(y - 3).toFixed(1)}" width="6" height="6"/>`;
  }).join('');
  const text = labels.map((l, i) => {
    const [x, y] = pt(i, 1.24);
    const anchor = x < cx - 12 ? 'end' : x > cx + 12 ? 'start' : 'middle';
    return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}">${esc(l)}
      <tspan x="${x.toFixed(1)}" dy="14" font-weight="500" font-size="13" fill="#FFFFFF">${Math.round(values[i])}</tspan></text>`;
  }).join('');

  // Extra horizontal room in the viewBox: the outer labels sit beyond the plot.
  return `<svg viewBox="-30 -8 ${size + 60} ${size + 44}" width="100%" style="height:auto" role="img"
    aria-label="Radar chart: ${labels.map((l, i) => `${l} ${Math.round(values[i])}`).join(', ')}">
    <g fill="none" stroke="rgba(255,255,255,.10)" stroke-width="1">
      <polygon points="${ring(1)}"/><polygon points="${ring(.75)}"/>
      <polygon points="${ring(.5)}"/><polygon points="${ring(.25)}"/>
    </g>
    <g stroke="rgba(255,255,255,.06)" stroke-width="1">${spokes}</g>
    <polygon points="${shape}" fill="rgba(169,154,140,.20)" stroke="#A99A8C" stroke-width="2" stroke-linejoin="round"/>
    <g fill="#EFEBE6">${dots}</g>
    <g font-size="9.5" font-family="Jost, sans-serif" letter-spacing="1.4" fill="#8B8681">${text}</g>
  </svg>`;
}

function discQuadrant(disc, patternName) {
  const s = 300, pad = 22, inner = s - pad * 2;
  // Horizontal: task (left) <-> people (right). Vertical: fast (top) <-> steady (bottom).
  const x = pad + inner * (((disc.I + disc.S) / 2) / 100);
  const y = pad + inner * (1 - ((disc.D + disc.I) / 2) / 100);
  const r = v => 6 + (v / 100) * 20;
  const corner = (cx, cy, v) => `<circle cx="${cx}" cy="${cy}" r="${r(v).toFixed(1)}"
      fill="rgba(169,154,140,.20)" stroke="#A99A8C" stroke-width="1.2"/>`;
  return `<svg viewBox="0 0 ${s} ${s + 22}" width="100%" style="height:auto" role="img"
    aria-label="DISC quadrant. D ${Math.round(disc.D)}, I ${Math.round(disc.I)}, S ${Math.round(disc.S)}, C ${Math.round(disc.C)}. Pattern ${esc(patternName)}.">
    <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" fill="#0A0A0A" stroke="rgba(255,255,255,.10)"/>
    <line x1="${s / 2}" y1="${pad}" x2="${s / 2}" y2="${s - pad}" stroke="rgba(255,255,255,.06)"/>
    <line x1="${pad}" y1="${s / 2}" x2="${s - pad}" y2="${s / 2}" stroke="rgba(255,255,255,.06)"/>
    ${corner(pad + inner * .25, pad + inner * .25, disc.D)}
    ${corner(pad + inner * .75, pad + inner * .25, disc.I)}
    ${corner(pad + inner * .75, pad + inner * .75, disc.S)}
    ${corner(pad + inner * .25, pad + inner * .75, disc.C)}
    <g font-family="Jost, sans-serif" text-anchor="middle">
      <g font-size="15" font-weight="500" fill="#FFFFFF">
        <text x="${pad + inner * .25}" y="${pad + inner * .25 + 5}">D</text>
        <text x="${pad + inner * .75}" y="${pad + inner * .25 + 5}">I</text>
        <text x="${pad + inner * .75}" y="${pad + inner * .75 + 5}">S</text>
        <text x="${pad + inner * .25}" y="${pad + inner * .75 + 5}">C</text>
      </g>
      <g font-size="9.5" fill="#8B8681" letter-spacing="1">
        <text x="${pad + inner * .25}" y="${(pad + inner * .25 + r(disc.D) + 13).toFixed(1)}">${Math.round(disc.D)}</text>
        <text x="${pad + inner * .75}" y="${(pad + inner * .25 + r(disc.I) + 13).toFixed(1)}">${Math.round(disc.I)}</text>
        <text x="${pad + inner * .75}" y="${(pad + inner * .75 + r(disc.S) + 13).toFixed(1)}">${Math.round(disc.S)}</text>
        <text x="${pad + inner * .25}" y="${(pad + inner * .75 + r(disc.C) + 13).toFixed(1)}">${Math.round(disc.C)}</text>
      </g>
    </g>
    <rect x="${(x - 7).toFixed(1)}" y="${(y - 7).toFixed(1)}" width="14" height="14" fill="#EFEBE6" stroke="#0A0A0A" stroke-width="2"/>
    <g font-size="9" font-family="Jost, sans-serif" letter-spacing="1.2" fill="#8B8681">
      <text x="${s / 2}" y="13" text-anchor="middle">FASTER / MORE FORCEFUL</text>
      <text x="${s / 2}" y="${s - 6}" text-anchor="middle">STEADIER / MORE MEASURED</text>
      <text x="${s / 2}" y="${s + 16}" text-anchor="middle" fill="#A99A8C" font-weight="500">${esc(patternName).toUpperCase()}</text>
    </g>
  </svg>`;
}

/* --- Building blocks ----------------------------------------------------- */
const bar = (label, value, sub = '', axis = null) => `
  <div class="bar">
    <div class="bar__top">
      <span class="bar__label">${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
      <span class="bar__value">${Math.round(value)}</span>
    </div>
    <div class="bar__track"><div class="bar__fill ${bandClass(value)}" style="width:${value}%"></div></div>
    ${axis ? `<div class="bar__axis"><span>${esc(axis.split('←→')[0].trim())}</span><span>${esc(axis.split('←→')[1].trim())}</span></div>` : ''}
  </div>`;

const driveRow = (key, value) => {
  const m = DRIVE_LABELS[key];
  return `<div class="drive">
    <div class="drive__head"><span>${esc(m.label)}</span><span class="bar__value">${Math.round(value)}</span></div>
    <div class="drive__scale">
      <div class="drive__line"></div><div class="drive__mid"></div>
      <div class="drive__dot" style="left:${value}%"></div>
    </div>
    <div class="drive__ends"><span>${esc(m.low)}</span><span>${esc(m.high)}</span></div>
  </div>`;
};

const fmtDate = iso => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return '—'; }
};

/* --- Panels -------------------------------------------------------------- */
function panelSummary(r) {
  const top = r.roleFit[0];
  const v = r.validity;
  return `
  <div class="rcard">
    <h3>Headline</h3>
    <p class="rcard__sub">The four things a hiring manager reads first.</p>
    <div class="readout">
      <div class="readout__item"><strong>DISC pattern<em>${esc(r.pattern.primaryLabel)} / ${esc(r.pattern.secondaryLabel)}</em></strong>
        <p><b>${esc(r.pattern.name)}.</b> ${esc(r.pattern.blurb)}</p></div>
      <div class="readout__item"><strong>Reference profile<em>${r.profile.match}% match</em></strong>
        <p><b>${esc(r.profile.name)}.</b> ${esc(r.profile.blurb)} Closest alternative read: ${esc(r.profile.runnerUp)}.</p></div>
      <div class="readout__item"><strong>Best-fit role<em>${Math.round(top.fit)} / 100</em></strong>
        <p><b>${esc(top.label)} — ${esc(top.verdict)}.</b> ${esc(top.summary)}${top.shortfalls.length ? ` Watch: ${esc(top.shortfalls.slice(0, 2).join(' and '))}.` : ''}</p></div>
      <div class="readout__item"><strong>Response quality<em>${v.status === 'clear' ? 'Clear' : 'Read with care'}</em></strong>
        <p>${esc(v.flags[0].text)}</p></div>
    </div>
  </div>

  <div class="rcard">
    <h3>Where they’re strongest</h3>
    <p class="rcard__sub">Highest four facets, with what each one looks like day to day.</p>
    <div class="readout">
      ${r.narrative.strengths.map(s => `<div class="readout__item">
        <strong>${esc(s.label)}<em>${Math.round(s.score)}</em></strong><p>${esc(s.text)}</p></div>`).join('')}
    </div>
  </div>

  <div class="rcard">
    <h3>Where to look twice</h3>
    <p class="rcard__sub">Lowest three facets. Not weaknesses in every seat — but a cost in the wrong one.</p>
    <div class="readout">
      ${r.narrative.watchouts.map(s => `<div class="readout__item">
        <strong>${esc(s.label)}<em>${Math.round(s.score)}</em></strong><p>${esc(s.text)}</p></div>`).join('')}
    </div>
  </div>

  ${r.narrative.tips.length ? `<div class="rcard">
    <h3>Managing this person</h3>
    <p class="rcard__sub">Derived from the behavioural drives, not from the trait scores.</p>
    <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.6rem;font-size:.94rem;color:var(--muted)">
      ${r.narrative.tips.map(t => `<li>${esc(t)}</li>`).join('')}
    </ul>
  </div>` : ''}`;
}

function panelTraits(r) {
  const keys = Object.keys(BIG_FIVE_META);
  // Four-letter codes, as on the specimen card: the full domain names sit in
  // the bars alongside, and long words overrun the plot area.
  const labels = keys.map(k => BIG_FIVE_META[k].short);
  const values = keys.map(k => r.bigFive[k]);
  return `
  <div class="rcard">
    <h3>Big Five (OCEAN)</h3>
    <p class="rcard__sub">Five domains, each composed from three or four of the sixteen facets below.</p>
    <div class="chart-pair">
      <div>${radar(values, labels)}</div>
      <div class="bars">${keys.map(k => bar(BIG_FIVE_META[k].label, r.bigFive[k], '', BIG_FIVE_META[k].axis)).join('')}</div>
    </div>
  </div>

  <div class="rcard">
    <h3>Facet detail</h3>
    <p class="rcard__sub">Percentile bands against the norm table. Everything above is built from these sixteen.</p>
    <div class="bars">
      ${Object.keys(FACETS).map(k => bar(FACETS[k].label, r.facets[k], FACETS[k].blurb)).join('')}
    </div>
  </div>`;
}

function panelStyle(r) {
  return `
  <div class="rcard">
    <h3>DISC style</h3>
    <p class="rcard__sub">Scored from the ten forced-choice blocks only — agreeing with everything cannot move it.</p>
    <div class="chart-pair">
      <div>${discQuadrant(r.disc, r.pattern.name)}</div>
      <div>
        <p style="font-size:1.05rem;color:var(--white);margin-bottom:var(--s-4)">
          <b>${esc(r.pattern.name)}</b> — ${esc(r.pattern.blurb)}</p>
        <div class="bars">
          ${['D', 'I', 'S', 'C'].map(k => bar(DISC_LABEL[k], r.disc[k])).join('')}
        </div>
      </div>
    </div>
  </div>

  <div class="rcard">
    <h3>Behavioural drives</h3>
    <p class="rcard__sub">Four bipolar drives, 70% from the statements and 30% from the forced-choice blocks. The midpoint is genuinely neutral — neither end is better.</p>
    ${Object.keys(DRIVE_LABELS).map(k => driveRow(k, r.drives[k])).join('')}
    <div class="notice" style="margin-top:var(--s-5)">
      <b>Nearest reference profile: ${esc(r.profile.name)}</b> (${r.profile.match}% match) — ${esc(r.profile.blurb)}
      Second-closest read is <b>${esc(r.profile.runnerUp)}</b>; where the two disagree, the interview should settle it.
    </div>
  </div>`;
}

function panelScales(r) {
  return `
  <div class="rcard">
    <h3>Bright-side scales (HPI-style)</h3>
    <p class="rcard__sub">How this person is likely to be described by colleagues on an ordinary day.</p>
    <div class="bars">${Object.keys(HPI_META).map(k => bar(HPI_META[k].label, r.hpi[k], HPI_META[k].blurb)).join('')}</div>
  </div>

  <div class="rcard">
    <h3>Job competencies (Caliper-style)</h3>
    <p class="rcard__sub">The performance layer, including the reasoning section.</p>
    <div class="bars">${Object.keys(CALIPER_META).map(k => bar(CALIPER_META[k].label, r.caliper[k], CALIPER_META[k].blurb)).join('')}</div>
    <div class="notice" style="margin-top:var(--s-5)">
      <b>Reasoning: ${r.reasoning.correct} of ${r.reasoning.total} correct.</b>
      Six items is a screen rather than a full ability test, so the score is deliberately compressed toward the middle.
      Read it as a rough band, and never as the deciding factor on its own.
    </div>
  </div>`;
}

function panelRoles(r) {
  return `
  <div class="rcard">
    <h3>Role fit</h3>
    <p class="rcard__sub">Scored against six templates. Falling short of what a role needs costs the most; overshooting costs a little where excess causes friction.</p>
    <div class="rolefit">
      ${r.roleFit.map((role, i) => `
        <div class="rolefit__row${i === 0 ? ' is-top' : ''}">
          <div><strong>${esc(role.label)}</strong><p>${esc(role.summary)}</p></div>
          <div class="rolefit__detail">
            ${role.strengths.length ? `<div><b class="is-clears">Clears</b> ${esc(role.strengths.slice(0, 3).join(', '))}</div>` : ''}
            ${role.shortfalls.length ? `<div><b class="is-short">Short</b> ${esc(role.shortfalls.slice(0, 3).join(', '))}</div>` : '<div class="muted">Nothing materially below the bar.</div>'}
            ${role.overshoot.length ? `<div><b class="is-over">More than the seat needs</b> ${esc(role.overshoot.slice(0, 3).join(', '))}</div>` : ''}
          </div>
          <div class="rolefit__score">
            <b>${Math.round(role.fit)}</b>
            <span class="verdict-${role.verdict.split(' ')[0].toLowerCase()}">${esc(role.verdict)}</span>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function panelInterview(r) {
  return `
  <div class="rcard">
    <h3>Interview guide</h3>
    <p class="rcard__sub">Generated from this profile: low scores to verify, very high scores to confirm. Ask for specifics — a date, a name, a number — not a philosophy.</p>
    ${r.probes.map((p, i) => `
      <div class="probe">
        <div class="probe__meta">
          <span class="q__num">Q${i + 1}</span>
          <span class="tag ${p.score >= 65 ? 'is-high' : p.score <= 45 ? 'is-low' : ''}">${esc(p.label)} · ${Math.round(p.score)}</span>
        </div>
        <p class="probe__q">${esc(p.q)}</p>
        <p class="probe__why">${esc(p.why)}</p>
      </div>`).join('')}
  </div>`;
}

function panelValidity(r) {
  const v = r.validity;
  return `
  <div class="rcard">
    <h3>Response quality</h3>
    <p class="rcard__sub">Whether this profile can be read at face value. These are not personality scores.</p>
    <div class="bars">
      ${bar('Candour', v.candour, 'Willingness to admit ordinary human failings.')}
      ${bar('Consistency', v.consistency, 'Agreement between items measuring the same trait.')}
      ${bar('Engagement', v.engagement, 'Variation across answers — catches straight-lining.')}
    </div>
    <div style="margin-top:var(--s-5);display:grid;gap:.6rem">
      ${v.flags.map(f => `<div class="notice ${f.level === 'ok' ? 'notice--ok' : 'notice--warn'}">${esc(f.text)}</div>`).join('')}
    </div>
    <p style="margin-top:var(--s-5);font-size:.85rem;color:var(--muted)">
      Completed ${esc(fmtDate(r.completedAt))}${v.minutes ? ` in about ${v.minutes} minutes` : ''}.
      ${r.blocksAnswered} of 10 forced-choice blocks and ${r.reasoning.answered} of ${r.reasoning.total} reasoning items were answered.
    </p>
  </div>

  <div class="rcard">
    <h3>How to use this responsibly</h3>
    <p class="rcard__sub">Read before the profile goes anywhere near a decision.</p>
    <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.55rem;font-size:.92rem;color:var(--muted)">
      <li>This is an independent instrument built on public constructs. It is not the DISC, Hogan, Predictive Index or Caliper product, and it has not been validated against those publishers’ norms.</li>
      <li>The norm table is illustrative, so percentile bands are relative rather than absolute until you replace it with your own respondent data.</li>
      <li>Use it to shape an interview and reference calls, not as a pass/fail screen. A score has never been evidence of anything on its own.</li>
      <li>Share the profile with the candidate. If you would not be comfortable showing it to them, do not use it.</li>
      <li>It measures workplace behaviour only. It is not a clinical, medical or diagnostic instrument, and it says nothing about anyone’s health or character.</li>
    </ul>
  </div>`;
}

/* --- Public -------------------------------------------------------------- */
export const REPORT_TABS = [
  { id: 'summary',   label: 'Summary',       render: panelSummary },
  { id: 'traits',    label: 'Traits',        render: panelTraits },
  { id: 'style',     label: 'Style & Drives', render: panelStyle },
  { id: 'scales',    label: 'Scales',        render: panelScales },
  { id: 'roles',     label: 'Role Fit',      render: panelRoles },
  { id: 'interview', label: 'Interview',     render: panelInterview },
  { id: 'validity',  label: 'Validity',      render: panelValidity }
];

export function renderReportHead(r) {
  const c = r.candidate || {};
  const top = r.roleFit[0];
  const name = c.name?.trim() || 'Candidate profile';
  return `
  <header class="report-head">
    <p class="eyebrow">Personality profile</p>
    <h1>${esc(name)}</h1>
    <p class="report-head__sub">${esc(c.role?.trim() || 'Role not specified')} · completed ${esc(fmtDate(r.completedAt))}</p>
    <div class="report-head__row">
      <div class="headline-stat"><small>DISC pattern</small><b>${esc(r.pattern.name)}</b>
        <span>${esc(r.pattern.primary)}/${esc(r.pattern.secondary)}</span></div>
      <div class="headline-stat"><small>Reference profile</small><b>${esc(r.profile.name)}</b>
        <span>${r.profile.match}% match</span></div>
      <div class="headline-stat"><small>Best-fit role</small><b>${esc(top.label)}</b>
        <span>${Math.round(top.fit)} · ${esc(top.verdict)}</span></div>
      <div class="headline-stat"><small>Response quality</small><b>${r.validity.status === 'clear' ? 'Clear' : 'Review'}</b>
        <span>candour ${Math.round(r.validity.candour)} · consistency ${Math.round(r.validity.consistency)}</span></div>
    </div>
  </header>`;
}

export function renderReport(r, mount) {
  mount.innerHTML = `
    ${renderReportHead(r)}
    <div class="report-tabs" role="tablist" aria-label="Report sections">
      ${REPORT_TABS.map((t, i) => `<button role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}"
        aria-selected="${i === 0}" data-tab="${t.id}">${esc(t.label)}</button>`).join('')}
    </div>
    <div id="report-panels">
      ${REPORT_TABS.map((t, i) => `<section class="rpanel${i === 0 ? ' is-active' : ''}" id="panel-${t.id}"
        role="tabpanel" aria-labelledby="tab-${t.id}"${i === 0 ? '' : ' hidden'}>${t.render(r)}</section>`).join('')}
    </div>`;

  const tabs = [...mount.querySelectorAll('[role="tab"]')];
  const select = id => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    REPORT_TABS.forEach(t => {
      const p = mount.querySelector('#panel-' + t.id);
      p.classList.toggle('is-active', t.id === id);
      p.hidden = t.id !== id;
    });
  };
  tabs.forEach(t => {
    t.addEventListener('click', () => select(t.dataset.tab));
    t.addEventListener('keydown', e => {
      const i = tabs.indexOf(t);
      const next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length]
                 : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (next) { e.preventDefault(); next.focus(); select(next.dataset.tab); }
    });
  });
  // Printing must show everything, so un-hide before print and restore afterwards.
  const beforePrint = () => REPORT_TABS.forEach(t => { mount.querySelector('#panel-' + t.id).hidden = false; });
  const afterPrint = () => select(tabs.find(t => t.getAttribute('aria-selected') === 'true').dataset.tab);
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
}
