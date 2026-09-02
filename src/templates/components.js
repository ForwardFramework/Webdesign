const { business: B, services, reviews, areas, gallery, faqs } = require('../data/site.js');
const { esc, telHref, stars, I } = require('./layout.js');

/* ---------- lead capture form ---------- */
function quoteForm(opts = {}) {
  const id = opts.id || 'quote';
  return `
<form class="quote-form" data-lead name="${id}" method="POST" action="${B.formEndpoint || '/'}"
      data-netlify="true" netlify-honeypot="company_website" novalidate>
  <input type="hidden" name="form-name" value="${id}">
  <input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="form-status" role="status" aria-live="polite"></div>
  <div class="field-row">
    <div class="field">
      <label for="${id}-name">Name <span class="req">*</span></label>
      <input id="${id}-name" name="name" type="text" autocomplete="name" required placeholder="Jane Smith">
      <span class="err-msg">Please tell us your name.</span>
    </div>
    <div class="field">
      <label for="${id}-phone">Phone <span class="req">*</span></label>
      <input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required placeholder="878-000-0000" inputmode="tel">
      <span class="err-msg">A 10-digit phone number, please.</span>
    </div>
  </div>
  <div class="field-row">
    <div class="field">
      <label for="${id}-email">Email <span class="req">*</span></label>
      <input id="${id}-email" name="email" type="email" autocomplete="email" required placeholder="jane@email.com">
      <span class="err-msg">We need a valid email address.</span>
    </div>
    <div class="field">
      <label for="${id}-zip">Property ZIP</label>
      <input id="${id}-zip" name="zip" type="text" autocomplete="postal-code" placeholder="15205" inputmode="numeric" maxlength="5">
    </div>
  </div>
  <div class="field">
    <label for="${id}-service">What do you need? <span class="req">*</span></label>
    <select id="${id}-service" name="service" required>
      <option value="">Choose a service…</option>
      ${services.map(s => `<option value="${esc(s.title)}">${esc(s.title)}</option>`).join('')}
      <option value="Emergency / active leak">Emergency — I have an active leak</option>
      <option value="Not sure">Not sure — I need an inspection</option>
    </select>
    <span class="err-msg">Pick the closest match so we send the right crew.</span>
  </div>
  <div class="field">
    <label for="${id}-msg">Anything we should know?</label>
    <textarea id="${id}-msg" name="message" placeholder="Roof age, where you're seeing the leak, storm date, insurance claim number — whatever helps."></textarea>
  </div>
  <button class="btn btn--primary btn--lg btn--block" type="submit">${I.checkPlain} Get My Free Estimate</button>
  <p class="form-note">
    No cost, no obligation, no high-pressure sales visit. We usually reply the same business day.<br>
    Prefer to talk? Call or text <a href="${telHref}">${esc(B.phone)}</a>.
  </p>
</form>`;
}

/* ---------- trust bar ---------- */
const TRUST = [
  [I.shield, 'Licensed &amp; fully insured'],
  [I.camera, 'Photo-documented inspections'],
  [I.award,  'Manufacturer-backed warranties'],
  [I.broom,  'Double magnetic-sweep cleanup'],
  [I.bolt,   '24/7 emergency tarping']
];
const trustbar = () => `
<section class="trustbar">
  <div class="wrap">
    <ul>${TRUST.map(([ic, t]) => `<li>${ic}<span>${t}</span></li>`).join('')}</ul>
  </div>
</section>`;

/* ---------- services grid ---------- */
const serviceGrid = (list = services) => `
<div class="grid g-3">
  ${list.map(s => `
  <a class="card card--link reveal" href="/services/${s.slug}/">
    <span class="card-icon">${I[s.icon] || I.shingle}</span>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.blurb)}</p>
    <span class="card-price">${esc(s.price)}</span>
    <span class="card-more">Learn more ${I.arrow}</span>
  </a>`).join('')}
</div>`;

/* ---------- reviews ---------- */
const initials = (n) => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const reviewCard = (r) => `
<article class="review">
  <div class="review-top">${stars(r.rating)}${I.quote.replace('<svg', '<svg width="34" height="34"')}</div>
  <blockquote>${esc(r.text)}</blockquote>
  <div class="review-by">
    <span class="avatar" aria-hidden="true">${initials(r.name)}</span>
    <div><b>${esc(r.name)}</b><span>${I.facebook} Recommended on ${esc(r.source)}</span></div>
  </div>
</article>`;
const reviewsGrid = (list = reviews) => `<div class="masonry">${list.map(reviewCard).join('')}</div>`;

/* ---------- gallery ---------- */
const galleryGrid = (list = gallery) => `
<div class="gallery">
  ${list.map(g => `
  <figure class="shot reveal" data-cat="${esc(g.cat)}">
    <img src="/assets/photos/${esc(g.file)}" alt="${esc(g.alt)}" loading="lazy" decoding="async" width="800" height="600" onerror="RRphoto(this)">
    <figcaption>${esc(g.cat)}</figcaption>
  </figure>`).join('')}
</div>`;

/* ---------- FAQ accordion ---------- */
const faqBlock = (list) => `
<div class="faq">
  ${list.map(([q, a]) => `
  <details>
    <summary><span>${esc(q)}</span><span class="plus">${I.plus}</span></summary>
    <div class="answer"><p>${a}</p></div>
  </details>`).join('')}
</div>`;

/* ---------- CTA band ---------- */
const ctaBand = (title, copy) => `
<section class="cta-band section section--tight">
  <div class="wrap inner">
    <div>
      <h2>${title || 'Get a straight answer about your roof.'}</h2>
      <p>${copy || `Free inspection, photos of everything we find, and a written estimate with no pressure attached. Call or text ${esc(B.phone)}.`}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary btn--lg" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
      <a class="btn btn--ghost btn--lg" href="/contact/">Request Online</a>
    </div>
  </div>
</section>`;

/* ---------- long-form section renderer (services + articles) ---------- */
function renderSections(sections) {
  return sections.map(sec => {
    let out = `<h2>${esc(sec.h)}</h2>`;
    if (sec.p) out += `<p>${esc(sec.p)}</p>`;
    if (sec.list) out += `<ul class="checklist">${sec.list.map(li =>
      `<li>${I.checkPlain}<span>${esc(li)}</span></li>`).join('')}</ul>`;
    if (sec.table) {
      out += `<div class="table-wrap"><table>
        <thead><tr>${sec.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${sec.table.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
      if (sec.table.note) out += `<p class="table-note">${esc(sec.table.note)}</p>`;
    }
    if (sec.steps) out += `<ol class="steps">${sec.steps.map(([h, p]) =>
      `<li><h4>${esc(h)}</h4><p>${esc(p)}</p></li>`).join('')}</ol>`;
    if (sec.p2) out += `<p>${esc(sec.p2)}</p>`;
    return out;
  }).join('');
}

/* ---------- direct-answer block (what AI answer engines quote) ---------- */
const answerBox = (label, text) => `
<div class="answer-box">
  <span class="eyebrow">${esc(label || 'The short answer')}</span>
  <p>${esc(text)}</p>
</div>`;

/* ---------- area chips ---------- */
const areaCloud = () => `
<div class="area-cloud">
  ${areas.map(a => a.page
    ? `<a class="area-chip" href="/service-areas/${a.slug}/">${I.pin}${esc(a.name)}</a>`
    : `<span class="area-chip">${esc(a.name)}</span>`).join('')}
</div>`;

module.exports = {
  quoteForm, trustbar, serviceGrid, reviewsGrid, reviewCard, galleryGrid,
  faqBlock, ctaBand, renderSections, answerBox, areaCloud, initials
};
