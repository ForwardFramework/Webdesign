/* ==========================================================================
   Signal — assessment controller
   Screens: intro -> paged sections -> report. State persists to localStorage
   so a closed tab costs nothing, and a completed profile can be re-opened
   from a self-contained link with no server involved.
   ========================================================================== */

import { SECTIONS, LIKERT_SEQUENCE, TETRADS, REASONING_ITEMS, LIKERT_SCALE, TOTAL_ITEMS } from './items.js';
import { score } from './scoring.js';
import { renderReport } from './report.js';

const STORE_KEY = 'signal.assessment.v1';
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* --- Pages --------------------------------------------------------------- */
const PAGES = [];
SECTIONS.forEach((section, si) => {
  for (let i = 0; i < section.items.length; i += section.perPage) {
    PAGES.push({
      section, sectionIndex: si, items: section.items.slice(i, i + section.perPage),
      first: i === 0, offset: i
    });
  }
});

/* --- State --------------------------------------------------------------- */
const state = {
  screen: 'intro',        // intro | question | report
  page: 0,
  answers: {},
  candidate: { name: '', role: '' },
  startedAt: null,
  completedAt: null,
  elapsedMs: null,
  resumable: null
};

const el = {
  main: document.getElementById('app'),
  progress: document.getElementById('progress'),
  progressFill: document.getElementById('progress-fill'),
  progressLabel: document.getElementById('progress-label'),
  progressSection: document.getElementById('progress-section')
};

function answeredCount() {
  let n = 0;
  LIKERT_SEQUENCE.forEach(i => { if (state.answers[i.id] != null) n++; });
  TETRADS.forEach(t => {
    const a = state.answers[t.id];
    if (a && a.most != null && a.least != null) n++;
  });
  REASONING_ITEMS.forEach(i => { if (state.answers[i.id] != null) n++; });
  return n;
}

/* --- Persistence --------------------------------------------------------- */
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      answers: state.answers, candidate: state.candidate, page: state.page,
      startedAt: state.startedAt, screen: state.screen === 'report' ? 'report' : 'question',
      completedAt: state.completedAt, elapsedMs: state.elapsedMs
    }));
  } catch (err) { /* private browsing or quota — the assessment still runs in memory */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) { return null; }
}

function clearSaved() {
  try { localStorage.removeItem(STORE_KEY); } catch (err) { /* no-op */ }
}

/* --- Share link codec ----------------------------------------------------
   Order-dependent encoding: one digit per likert item, two digits per
   forced-choice block, one per reasoning item, plus the candidate fields,
   carried as a base64url JSON array in the URL fragment.
   ------------------------------------------------------------------------ */
function b64encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64decode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - s.length % 4) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

export function encodePayload(answers, candidate, elapsedMs, completedAt) {
  const likert = LIKERT_SEQUENCE.map(i => answers[i.id] || 0).join('');
  const tet = TETRADS.map(t => {
    const a = answers[t.id] || {};
    return `${a.most == null ? 9 : a.most}${a.least == null ? 9 : a.least}`;
  }).join('');
  const reas = REASONING_ITEMS.map(i => (answers[i.id] == null ? 9 : answers[i.id])).join('');
  return b64encode(JSON.stringify([
    'A', likert, tet, reas,
    (candidate && candidate.name) || '', (candidate && candidate.role) || '',
    elapsedMs || 0, completedAt || ''
  ]));
}

export function decodePayload(hash) {
  const parts = JSON.parse(b64decode(hash));
  if (!Array.isArray(parts) || parts[0] !== 'A') throw new Error('unrecognised payload');
  const [, likert, tet, reas, name, role, elapsed, completed] = parts;
  const answers = {};
  LIKERT_SEQUENCE.forEach((item, i) => {
    const v = Number(String(likert)[i]);
    if (v >= 1 && v <= 5) answers[item.id] = v;
  });
  TETRADS.forEach((t, i) => {
    const most = Number(String(tet)[i * 2]);
    const least = Number(String(tet)[i * 2 + 1]);
    if (most <= 3 && least <= 3 && most !== least) answers[t.id] = { most, least };
  });
  REASONING_ITEMS.forEach((item, i) => {
    const v = Number(String(reas)[i]);
    if (v <= 3) answers[item.id] = v;
  });
  if (!Object.keys(answers).length) throw new Error('empty payload');
  return {
    answers,
    candidate: { name: name || '', role: role || '' },
    elapsedMs: Number(elapsed) || null,
    completedAt: completed || null
  };
}

function encodeResult() {
  return encodePayload(state.answers, state.candidate, state.elapsedMs, state.completedAt);
}

function decodeResult(hash) {
  try {
    const p = decodePayload(hash);
    state.answers = p.answers;
    state.candidate = p.candidate;
    state.elapsedMs = p.elapsedMs;
    state.completedAt = p.completedAt;
    return true;
  } catch (err) { return false; }
}

/* --- Demo profile --------------------------------------------------------
   Deterministic responses, so the sample report is stable across visits.
   ------------------------------------------------------------------------ */
function fillDemo() {
  let seed = 20260420;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const lean = { // a business-development shaped candidate
    assertiveness: 1.1, persuasion: 1.1, drive: 1.3, urgency: 1.1, sociability: 0.9,
    resilience: 1.1, composure: 0.6, structure: 0.2, prudence: -0.2, empathy: 0.2,
    cooperation: 0.1, service: 0.7, curiosity: 0.6, adaptability: 0.6,
    learning: 0.4, accountability: 1.0
  };
  LIKERT_SEQUENCE.forEach(item => {
    if (item.facet === 'candour') { state.answers[item.id] = rnd() < 0.3 ? 2 : 1; return; }
    const base = 3.3 + (lean[item.facet] || 0) + (rnd() - 0.5) * 1.1;
    const raw = Math.max(1, Math.min(5, Math.round(base)));
    state.answers[item.id] = item.key === 1 ? raw : 6 - raw;
  });
  const most = [0, 1, 0, 1, 3, 1, 0, 0, 1, 0];   // leans D / I
  const least = [2, 3, 3, 2, 2, 3, 2, 3, 2, 2];  // leans S / C
  TETRADS.forEach((t, i) => { state.answers[t.id] = { most: most[i], least: least[i] }; });
  REASONING_ITEMS.forEach((item, i) => { state.answers[item.id] = i === 3 ? 0 : item.answer; });
  state.candidate = { name: 'Sample candidate', role: 'Senior Adviser — Business Development' };
  state.startedAt = Date.now() - 19 * 60000;
  state.completedAt = new Date().toISOString();
  state.elapsedMs = 19 * 60000;
}

/* --- Rendering: intro ---------------------------------------------------- */
function renderIntro(resumable) {
  el.progress.hidden = true;
  el.main.innerHTML = `
    <div class="wrap">
      <div class="panel panel--narrow">
        <p class="eyebrow">Before you start</p>
        <h1 style="font-size:var(--step-3)">Signal behavioural assessment</h1>
        <p class="lede">Seventy items, about twenty minutes. Fifty-four statements about how you work,
          ten forced-choice word blocks, and six short reasoning problems.</p>

        ${resumable ? `<div class="notice notice--ok" style="margin-bottom:var(--sp-5)">
          <b>You have an assessment in progress.</b> ${resumable.answered} of ${TOTAL_ITEMS} items answered.
          <div style="margin-top:var(--sp-3);display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="btn btn--ink btn--sm" id="resume">Resume where I left off</button>
            <button class="btn btn--ghost btn--sm" id="restart">Start over</button>
          </div></div>` : ''}

        <div class="grid" style="gap:var(--sp-4);margin-bottom:var(--sp-6)">
          <div class="field">
            <label for="cand-name">Name <span style="font-weight:400;color:var(--slate-400)">(optional)</span></label>
            <input id="cand-name" type="text" autocomplete="name" placeholder="Who is this profile for?"
                   value="${esc(state.candidate.name)}">
          </div>
          <div class="field">
            <label for="cand-role">Role being assessed for <span style="font-weight:400;color:var(--slate-400)">(optional)</span></label>
            <input id="cand-role" type="text" placeholder="e.g. Senior Adviser, Operations Manager"
                   value="${esc(state.candidate.role)}">
            <p class="hint">Used only to label the report. Nothing is sent anywhere.</p>
          </div>
        </div>

        <div class="notice" style="margin-bottom:var(--sp-6)">
          <b>Answer as you are, not as you think a hiring manager wants.</b>
          The assessment checks internal consistency and candour, and a profile answered to impress is
          reported as exactly that. First instinct is usually the accurate one.
        </div>

        <ul style="margin:0 0 var(--sp-6);padding-left:1.1rem;font-size:.9rem;color:var(--slate-500);display:grid;gap:.45rem">
          <li>Everything is scored in this browser. There is no account, no server and no upload.</li>
          <li>Progress saves automatically — closing the tab loses nothing.</li>
          <li>No timer, but work briskly. Long deliberation makes profiles less accurate, not more.</li>
        </ul>

        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="btn btn--primary btn--lg" id="start">Start the assessment</button>
          <a class="btn btn--ghost btn--lg" href="index.html">Back to overview</a>
        </div>
      </div>
    </div>`;

  const readFields = () => {
    state.candidate.name = document.getElementById('cand-name').value;
    state.candidate.role = document.getElementById('cand-role').value;
  };

  document.getElementById('start').addEventListener('click', () => {
    readFields();
    state.startedAt = state.startedAt || Date.now();
    state.screen = 'question';
    state.page = 0;
    save(); render(); window.scrollTo(0, 0);
  });

  const resumeBtn = document.getElementById('resume');
  if (resumeBtn) resumeBtn.addEventListener('click', () => {
    readFields();
    state.screen = 'question';
    render(); window.scrollTo(0, 0);
  });

  const restartBtn = document.getElementById('restart');
  if (restartBtn) restartBtn.addEventListener('click', () => {
    state.answers = {}; state.page = 0; state.startedAt = Date.now();
    state.completedAt = null; state.elapsedMs = null; state.resumable = null;
    clearSaved(); save(); render();
  });
}

/* --- Rendering: questions ------------------------------------------------ */
function likertBlock(item, index) {
  const current = state.answers[item.id];
  return `
    <fieldset class="q" data-qid="${item.id}" style="border:0;padding-inline:0;margin:0">
      <legend style="display:contents">
        <span class="q__num">${String(index).padStart(2, '0')}</span>
        <span class="q__text">${esc(item.text)}</span>
      </legend>
      <div class="likert">
        ${LIKERT_SCALE.map(s => `
          <input type="radio" name="${item.id}" id="${item.id}-${s.value}" value="${s.value}"
                 ${current === s.value ? 'checked' : ''}>
          <label for="${item.id}-${s.value}"><span class="dot" aria-hidden="true"></span>${esc(s.label)}</label>`).join('')}
      </div>
    </fieldset>`;
}

function tetradBlock(item, index) {
  const a = state.answers[item.id] || {};
  return `
    <div class="q" data-qid="${item.id}">
      <span class="q__num">Block ${String(index).padStart(2, '0')}</span>
      <p class="q__text">Which word is <b>most</b> like you at work, and which is <b>least</b>?</p>
      <div class="tetrad">
        <div class="tetrad__head"><span>Word</span><span>Most</span><span>Least</span></div>
        ${item.options.map((opt, i) => `
          <div class="tetrad__row">
            <span class="tetrad__word">${esc(opt.text)}</span>
            <span class="tetrad__cell is-most">
              <input type="radio" name="${item.id}--most" id="${item.id}-m${i}" value="${i}" ${a.most === i ? 'checked' : ''}>
              <label for="${item.id}-m${i}"><span class="visually-hidden">${esc(opt.text)} is most like me</span></label>
            </span>
            <span class="tetrad__cell is-least">
              <input type="radio" name="${item.id}--least" id="${item.id}-l${i}" value="${i}" ${a.least === i ? 'checked' : ''}>
              <label for="${item.id}-l${i}"><span class="visually-hidden">${esc(opt.text)} is least like me</span></label>
            </span>
          </div>`).join('')}
      </div>
      <p class="qnav__hint" style="margin-top:var(--sp-3)">Most and least must be different words.</p>
    </div>`;
}

function reasoningBlock(item, index) {
  const current = state.answers[item.id];
  const keys = ['A', 'B', 'C', 'D'];
  return `
    <fieldset class="q" data-qid="${item.id}" style="border:0;padding-inline:0;margin:0">
      <legend style="display:contents">
        <span class="q__num">Problem ${String(index).padStart(2, '0')}</span>
        <span class="q__text">${esc(item.text)}</span>
      </legend>
      ${item.detail ? `<p class="stimulus">${esc(item.detail)}</p>` : ''}
      <div class="choices">
        ${item.options.map((opt, i) => `
          <input type="radio" name="${item.id}" id="${item.id}-${i}" value="${i}" ${current === i ? 'checked' : ''}>
          <label for="${item.id}-${i}" data-key="${keys[i]}">${esc(opt)}</label>`).join('')}
      </div>
    </fieldset>`;
}

function itemComplete(item, kind) {
  if (kind === 'tetrad') {
    const a = state.answers[item.id];
    return !!a && a.most != null && a.least != null && a.most !== a.least;
  }
  return state.answers[item.id] != null;
}

function pageComplete(page) {
  return page.items.every(item => itemComplete(item, page.section.kind));
}

function updateProgress() {
  const done = answeredCount();
  const pct = Math.round((done / TOTAL_ITEMS) * 100);
  el.progressFill.style.width = pct + '%';
  el.progressLabel.textContent = `${done} / ${TOTAL_ITEMS}`;
  const track = el.progressFill.parentElement;
  track.setAttribute('aria-valuenow', String(pct));
}

let renderToken = 0;

function renderQuestions() {
  const token = ++renderToken;
  const page = PAGES[state.page];
  const section = page.section;
  const isLast = state.page === PAGES.length - 1;

  el.progress.hidden = false;
  updateProgress();
  el.progressSection.textContent = `Part ${page.sectionIndex + 1} of ${SECTIONS.length} — ${section.title}`;

  const renderer = section.kind === 'likert' ? likertBlock
    : section.kind === 'tetrad' ? tetradBlock : reasoningBlock;

  el.main.innerHTML = `
    <div class="wrap">
      <div class="panel panel--narrow">
        ${page.first ? `<div style="margin-bottom:var(--sp-6)">
          <p class="eyebrow">Part ${page.sectionIndex + 1} — ${esc(section.title)}</p>
          <p class="lede" style="font-size:var(--step-0)">${esc(section.intro)}</p>
        </div>` : ''}
        <form id="qform">
          ${page.items.map((item, i) => renderer(item, page.offset + i + 1)).join('')}
        </form>
        <div class="qnav">
          <button class="btn btn--ghost" id="prev" ${state.page === 0 ? 'disabled' : ''}>Back</button>
          <span class="qnav__hint" id="nav-hint" role="status"></span>
          <button class="btn btn--primary" id="next">${isLast ? 'See my profile' : 'Next'}</button>
        </div>
      </div>
    </div>`;

  const form = document.getElementById('qform');
  const hint = document.getElementById('nav-hint');

  function syncTetrad(qid) {
    const a = state.answers[qid] || {};
    form.querySelectorAll(`input[name^="${qid}--"]`).forEach(inp => {
      const side = inp.name.endsWith('most') ? 'most' : 'least';
      inp.checked = a[side] === Number(inp.value);
    });
  }

  function goNext() {
    if (!pageComplete(page)) {
      hint.textContent = section.kind === 'tetrad'
        ? 'Choose one word as most like you and a different word as least.'
        : 'Answer every item on this page to continue.';
      page.items.forEach(item => {
        const node = form.querySelector(`[data-qid="${CSS.escape(item.id)}"]`);
        if (node) node.classList.toggle('is-unanswered', !itemComplete(item, section.kind));
      });
      const firstMissing = form.querySelector('.is-unanswered');
      if (firstMissing) firstMissing.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    if (isLast) return finish();
    if (token !== renderToken) return;   // a later render already moved on
    state.page = Math.min(state.page + 1, PAGES.length - 1);
    save(); render(); window.scrollTo(0, 0);
  }

  form.addEventListener('change', e => {
    const input = e.target;
    if (!input.name) return;
    let qid = input.name;
    if (section.kind === 'tetrad') {
      const idx = input.name.lastIndexOf('--');
      qid = input.name.slice(0, idx);
      const side = input.name.slice(idx + 2);
      const a = Object.assign({}, state.answers[qid]);
      a[side] = Number(input.value);
      // Most and least cannot be the same word: the newer choice wins.
      if (a.most === a.least) delete a[side === 'most' ? 'least' : 'most'];
      state.answers[qid] = a;
      syncTetrad(qid);
    } else {
      state.answers[qid] = Number(input.value);
    }
    save();
    updateProgress();
    hint.textContent = '';
    const node = form.querySelector(`[data-qid="${CSS.escape(qid)}"]`);
    if (node) node.classList.remove('is-unanswered');
    // Single-item pages advance on their own once the item is complete.
    if (section.perPage === 1 && pageComplete(page) && !isLast) {
      setTimeout(() => { if (token === renderToken) goNext(); }, 260);
    }
  });

  document.getElementById('next').addEventListener('click', goNext);
  document.getElementById('prev').addEventListener('click', () => {
    if (state.page === 0) return;
    state.page--;
    save(); render(); window.scrollTo(0, 0);
  });
}

/* --- Finish + report ----------------------------------------------------- */
function finish() {
  state.completedAt = new Date().toISOString();
  state.elapsedMs = state.startedAt ? Date.now() - state.startedAt : null;
  state.screen = 'report';
  save(); render(); window.scrollTo(0, 0);
}

function renderReportScreen() {
  el.progress.hidden = true;
  const result = score(state.answers, {
    candidate: state.candidate, completedAt: state.completedAt, elapsedMs: state.elapsedMs
  });

  el.main.innerHTML = `
    <div class="wrap">
      <div id="report-mount"></div>
      <div class="rcard no-print" style="margin-top:var(--sp-6)">
        <h3>Keep this profile</h3>
        <p class="rcard__sub">Nothing has left this browser. These are the only ways a copy exists anywhere else.</p>
        <div class="actions-row">
          <button class="btn btn--ink" id="act-print">Print / save as PDF</button>
          <button class="btn btn--ghost" id="act-json">Download JSON</button>
          <button class="btn btn--ghost" id="act-link">Copy shareable link</button>
          <button class="btn btn--ghost" id="act-restart">Take it again</button>
        </div>
        <p class="qnav__hint" id="act-status" style="margin-top:var(--sp-3)" role="status"></p>
      </div>
    </div>`;

  renderReport(result, document.getElementById('report-mount'));

  const status = document.getElementById('act-status');
  const say = msg => {
    status.textContent = msg;
    setTimeout(() => { status.textContent = ''; }, 5000);
  };

  document.getElementById('act-print').addEventListener('click', () => window.print());

  document.getElementById('act-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ answers: state.answers, result }, null, 2)],
                          { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const slug = (state.candidate.name || 'candidate').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    a.download = `signal-profile-${slug || 'candidate'}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    say('Downloaded. The file holds the raw answers as well as every scored layer.');
  });

  document.getElementById('act-link').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#r=${encodeResult()}`;
    try {
      await navigator.clipboard.writeText(url);
      say('Link copied. The whole profile travels inside the link, so anyone holding it can open this report.');
    } catch (err) {
      location.hash = 'r=' + encodeResult();
      say('Clipboard unavailable — the link is now in the address bar, copy it from there.');
    }
  });

  document.getElementById('act-restart').addEventListener('click', () => {
    if (!confirm('Clear this profile and start a new assessment?')) return;
    state.answers = {}; state.page = 0; state.screen = 'intro';
    state.startedAt = null; state.completedAt = null; state.elapsedMs = null; state.resumable = null;
    clearSaved();
    if (location.hash) history.replaceState(null, '', location.pathname);
    render(); window.scrollTo(0, 0);
  });
}

/* --- Boot ---------------------------------------------------------------- */
function render() {
  if (state.screen === 'intro') return renderIntro(state.resumable);
  if (state.screen === 'question') return renderQuestions();
  return renderReportScreen();
}

function boot() {
  const params = new URLSearchParams(location.search);
  const hash = location.hash.startsWith('#r=') ? location.hash.slice(3) : null;

  if (hash && decodeResult(hash)) {
    state.screen = 'report';
    return render();
  }
  if (params.get('demo')) {
    fillDemo();
    state.screen = 'report';
    return render();
  }

  const saved = load();
  if (saved && saved.answers) {
    state.answers = saved.answers;
    state.candidate = saved.candidate || state.candidate;
    state.page = Math.min(saved.page || 0, PAGES.length - 1);
    state.startedAt = saved.startedAt || null;
    state.completedAt = saved.completedAt || null;
    state.elapsedMs = saved.elapsedMs || null;
    const answered = answeredCount();
    if (saved.screen === 'report' && answered === TOTAL_ITEMS) {
      state.screen = 'report';
      return render();
    }
    if (answered > 0) state.resumable = { answered };
  }
  render();
}

boot();
