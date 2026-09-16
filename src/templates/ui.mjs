import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities } from '../../data/areas.mjs';
import { icon } from './icons.mjs';

/**
 * Assembles a <title>. Search results cut off near 60 characters, and the
 * brand is the least valuable thing to lose — so the suffix shortens before
 * the descriptive part does.
 */
export function pageTitle(descriptive) {
  const full = `${descriptive} | ${site.name}`;
  if (full.length <= 62) return full;
  const short = `${descriptive} | Booth\u2019s`;
  return short.length <= 64 ? short : descriptive;
}

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- Logo ---------- */
export function logo({ href = '/', size = '', className = '', label = site.name } = {}) {
  const inner = site.logoImage
    ? `<img class="logo__img" src="${site.logoImage}" alt="${esc(site.name)} — ${esc(site.tagline)}" width="220" height="110">`
    : `<span class="logo__badge">
        <span class="logo__script">Booth&rsquo;s</span>
        <span class="logo__word">Contracting</span>
      </span>`;
  const cls = ['logo', size, className].filter(Boolean).join(' ');
  return href
    ? `<a class="${cls}" href="${href}" aria-label="${esc(label)} — home">${inner}</a>`
    : `<span class="${cls}">${inner}</span>`;
}

/* ---------- Call / text links ---------- */
export const telLink = (loc = 'page', text = site.phoneDisplay, cls = '') =>
  `<a href="tel:${site.phoneHref}" data-loc="${esc(loc)}"${cls ? ` class="${cls}"` : ''}>${esc(text)}</a>`;

/* ---------- Trust bar ---------- */
export function trustBar() {
  const items = [
    ['shield', 'Licensed &amp; Insured', 'Full liability coverage on every job'],
    ['ruler', 'Free On-Site Estimates', 'Fixed written pricing, no surprises'],
    ['truck', 'Concrete · Excavation · Landscaping', 'One crew, start to finish'],
    ['badge', 'Residential &amp; Commercial', 'Serving ' + esc(site.region)],
  ];
  return `<section class="trustbar" aria-label="Why homeowners choose ${esc(site.name)}">
    <div class="wrap"><div class="trustbar__inner">
      ${items
        .map(
          ([ic, t, s]) => `<div class="trustbar__item">${icon(ic, 30)}<div><strong>${t}</strong><small>${s}</small></div></div>`
        )
        .join('')}
    </div></div>
  </section>`;
}

/* ---------- Header ---------- */
export function header(current = '') {
  const isCurrent = (path) => (current === path ? ' aria-current="page"' : '');
  const serviceLinks = services
    .map((s) => `<li><a href="/services/${s.slug}/"${isCurrent(`/services/${s.slug}/`)}>${esc(s.name)}</a></li>`)
    .join('');
  const areaLinks = cities
    .slice(0, 8)
    .map((c) => `<li><a href="/service-areas/${c.slug}/"${isCurrent(`/service-areas/${c.slug}/`)}>${esc(c.full)}</a></li>`)
    .join('');

  const promo = site.promo.show
    ? `<div class="promo" id="promo-bar">
        <div class="promo__inner">
          <span class="promo__tag">${esc(site.promo.label)}</span>
          <span>${esc(site.promo.text)} &mdash; <a href="${site.promo.href}">${esc(site.promo.cta)}</a></span>
          <button class="promo__close" id="promo-close" type="button" aria-label="Dismiss announcement">&times;</button>
        </div>
      </div>`
    : '';

  return `${promo}
  <header class="header" id="site-header">
    <div class="wrap header__inner">
      ${logo({ href: '/' })}
      <nav class="nav" id="primary-nav" aria-label="Main">
        <a href="/"${isCurrent('/')}>Home</a>
        <div class="has-sub">
          <a href="/services/"${isCurrent('/services/')}>Services</a>
          <ul class="sub">${serviceLinks}<li><a href="/services/">All services</a></li></ul>
        </div>
        <div class="has-sub">
          <a href="/service-areas/"${isCurrent('/service-areas/')}>Service Areas</a>
          <ul class="sub">${areaLinks}<li><a href="/service-areas/">All areas</a></li></ul>
        </div>
        <a href="/gallery/"${isCurrent('/gallery/')}>Our Work</a>
        <a href="/about/"${isCurrent('/about/')}>About</a>
        <a href="/faq/"${isCurrent('/faq/')}>FAQ</a>
        <a href="/contact/"${isCurrent('/contact/')}>Contact</a>
        <a class="btn btn--primary nav__cta" href="/contact/">${esc(site.primaryCta)}</a>
      </nav>
      <div class="header__actions">
        <a class="header__phone" href="tel:${site.phoneHref}" data-loc="header">
          <small>Call or text</small>
          <strong>${esc(site.phoneDisplay)}</strong>
        </a>
        <a class="btn btn--primary" href="/contact/">Free Estimate</a>
        <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-scrim" id="nav-scrim" aria-hidden="true"></div>`;
}

/* ---------- Breadcrumbs ---------- */
export function crumbs(trail, onDark = false) {
  const items = trail
    .map((c, i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${esc(c.name)}</li>`
        : `<li><a href="${c.url}">${esc(c.name)}</a></li>`
    )
    .join('');
  return `<nav class="crumbs${onDark ? ' crumbs--on-dark' : ''}" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

/* ---------- Forms ---------- */
const serviceOptions = (selected = '') =>
  services
    .map((s) => `<option value="${esc(s.slug)}"${selected === s.slug ? ' selected' : ''}>${esc(s.name)}</option>`)
    .join('') + '<option value="other">Something else / not sure</option>';

/**
 * Short hero form — four fields. Every additional field costs conversions,
 * so this one asks only what is needed to call the person back.
 */
export function quickForm({ heading = 'Get Your Free Estimate', sub = '', id = 'quick' } = {}) {
  return `<div class="lead-card">
    <div class="lead-card__head">
      <h2>${esc(heading)}</h2>
      <p>${sub || 'Tell us what you need and we&rsquo;ll call you back with a real number &mdash; usually the same day.'}</p>
    </div>
    <form name="quote-fast" method="POST" data-netlify="true" netlify-honeypot="bot-field"
          action="/thank-you/" data-lead-form id="form-${id}" novalidate>
      <input type="hidden" name="form-name" value="quote-fast">
      <input type="hidden" name="attribution" value="">
      <input type="hidden" name="submitted_from" value="">
      <p class="hp"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="form-status" role="alert"></div>

      <div class="field">
        <label for="${id}-name">Name <span class="req" aria-hidden="true">*</span></label>
        <input id="${id}-name" name="name" type="text" autocomplete="name" required data-validate="name" data-label="Name">
        <span class="field__err" role="alert"></span>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="${id}-phone">Phone <span class="req" aria-hidden="true">*</span></label>
          <input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required
                 placeholder="(724) 555-0123" data-label="Phone number">
          <span class="field__err" role="alert"></span>
        </div>
        <div class="field">
          <label for="${id}-zip">ZIP code <span class="req" aria-hidden="true">*</span></label>
          <input id="${id}-zip" name="zip" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code"
                 required data-validate="zip" placeholder="16001" data-label="ZIP code">
          <span class="field__err" role="alert"></span>
        </div>
      </div>
      <div class="field">
        <label for="${id}-service">What do you need? <span class="req" aria-hidden="true">*</span></label>
        <select id="${id}-service" name="service" required data-label="Service">
          <option value="">Choose a service&hellip;</option>
          ${serviceOptions()}
        </select>
        <span class="field__err" role="alert"></span>
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit">${esc(site.primaryCta)}</button>
      <p class="form-consent">By submitting you agree we may call or text you about your project. No spam, and we never sell your information. See our <a href="/privacy/">privacy policy</a>.</p>
    </form>
    <div class="lead-card__foot">${icon('lock', 16)} <span>Takes 30 seconds &middot; No obligation &middot; Your details stay with us</span></div>
  </div>`;
}

/** Full quote form for the contact page — more detail, still under two minutes. */
export function detailedForm({ id = 'quote' } = {}) {
  const timing = ['As soon as possible', 'Within 30 days', 'This season', 'Next season / just planning'];
  const budget = ['Under $2,500', '$2,500 – $7,500', '$7,500 – $15,000', '$15,000+', 'Not sure yet'];
  return `<form name="quote-detailed" method="POST" data-netlify="true" netlify-honeypot="bot-field"
        action="/thank-you/" data-lead-form id="form-${id}" class="stack" novalidate>
    <input type="hidden" name="form-name" value="quote-detailed">
    <input type="hidden" name="attribution" value="">
    <input type="hidden" name="submitted_from" value="">
    <p class="hp"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <div class="form-status" role="alert"></div>

    <div class="field-row">
      <div class="field">
        <label for="${id}-name">Name <span class="req" aria-hidden="true">*</span></label>
        <input id="${id}-name" name="name" type="text" autocomplete="name" required data-validate="name" data-label="Name">
        <span class="field__err" role="alert"></span>
      </div>
      <div class="field">
        <label for="${id}-phone">Phone <span class="req" aria-hidden="true">*</span></label>
        <input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required
               placeholder="(724) 555-0123" data-label="Phone number">
        <span class="field__err" role="alert"></span>
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label for="${id}-email">Email <span class="hint">Optional &mdash; for sending your written quote</span></label>
        <input id="${id}-email" name="email" type="email" autocomplete="email" data-label="Email">
        <span class="field__err" role="alert"></span>
      </div>
      <div class="field">
        <label for="${id}-address">Project address or town <span class="req" aria-hidden="true">*</span></label>
        <input id="${id}-address" name="address" type="text" autocomplete="street-address" required
               placeholder="123 Main St, Butler PA" data-label="Project address">
        <span class="field__err" role="alert"></span>
      </div>
    </div>
    <div class="field">
      <label for="${id}-service">Service needed <span class="req" aria-hidden="true">*</span></label>
      <select id="${id}-service" name="service" required data-label="Service">
        <option value="">Choose a service&hellip;</option>
        ${serviceOptions()}
      </select>
      <span class="field__err" role="alert"></span>
    </div>
    <fieldset class="field fieldset" style="border:0;padding:0;">
      <legend>When would you like the work done?</legend>
      <div class="choice-grid">
        ${timing.map((t, i) => `<label class="choice"><input type="radio" name="timeline" value="${esc(t)}"${i === 0 ? '' : ''}> ${esc(t)}</label>`).join('')}
      </div>
    </fieldset>
    <fieldset class="field fieldset" style="border:0;padding:0;">
      <legend>Rough budget <span class="hint">Helps us scope the right solution &mdash; never used to pad a price</span></legend>
      <div class="choice-grid">
        ${budget.map((b) => `<label class="choice"><input type="radio" name="budget" value="${esc(b)}"> ${esc(b)}</label>`).join('')}
      </div>
    </fieldset>
    <div class="field">
      <label for="${id}-details">Project details <span class="hint">Approximate size, current condition, anything we should know</span></label>
      <textarea id="${id}-details" name="details" rows="5" data-label="Project details"
        placeholder="e.g. Replace a 20x24 driveway that's cracked and settling near the garage. Would like it done before winter."></textarea>
    </div>
    <div class="field">
      <label for="${id}-contact-pref">Best way to reach you</label>
      <select id="${id}-contact-pref" name="contact_preference">
        <option value="Call">Phone call</option>
        <option value="Text">Text message</option>
        <option value="Email">Email</option>
      </select>
    </div>
    <button class="btn btn--primary btn--lg btn--block" type="submit">Send My Project Details</button>
    <p class="form-consent">We reply to every message within one business day. By submitting you agree we may call or text you about your project. We never sell or share your information &mdash; see our <a href="/privacy/">privacy policy</a>.</p>
  </form>`;
}

/* ---------- CTA band ---------- */
export function ctaBand({
  heading = 'Ready to get it priced?',
  text = 'Free on-site estimate, fixed written pricing, and a straight answer about what your project actually needs.',
} = {}) {
  return `<section class="cta-band">
    <div class="wrap cta-band__inner">
      <div>
        <h2>${heading}</h2>
        <p>${text}</p>
      </div>
      <div class="btn-row">
        <a class="btn btn--dark btn--lg" href="/contact/">${esc(site.primaryCta)}</a>
        <a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}" data-loc="cta-band">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </section>`;
}

/* ---------- FAQ block ---------- */
export function faqList(faqs, open = 0) {
  return `<div class="faq">${faqs
    .map(
      (f, i) => `<details${i === open ? ' open' : ''}>
      <summary>${esc(f.q)}</summary>
      <div class="faq__body"><p>${esc(f.a)}</p></div>
    </details>`
    )
    .join('')}</div>`;
}

/* ---------- Service cards ---------- */
export function serviceCards(list = services) {
  return `<div class="grid grid--3">${list
    .map(
      (s) => `<article class="card card--link reveal">
      <span class="card__icon">${icon(s.icon, 28)}</span>
      <h3><a href="/services/${s.slug}/">${esc(s.name)}</a></h3>
      <p>${esc(s.teaser)}</p>
      <span class="card__more">Details &amp; pricing ${icon('arrow', 16)}</span>
    </article>`
    )
    .join('')}</div>`;
}

/* ---------- Gallery ----------
   Photos come from data/gallery.mjs. Files live in public/assets/img/gallery/. */
export function galleryGrid(items) {
  if (!items.length) return '';
  return `<div class="gallery">${items
    .map(
      (it, i) => `<figure class="shot">
      <img src="/assets/img/gallery/${esc(it.file)}" alt="${esc(it.alt)}"
           loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" width="800" height="600">
      <figcaption class="shot__cap">${esc(it.caption)}</figcaption>
    </figure>`
    )
    .join('')}</div>`;
}

/** Shown in place of the grid until there are real photos to show. */
export function galleryEmpty() {
  return `<div class="panel panel--gold" style="max-width:720px;margin-inline:auto;text-align:center;">
    <span class="card__icon" style="margin-inline:auto;">${icon('camera', 28)}</span>
    <h2 style="margin-top:1rem;font-size:var(--step-2);">The work is on Facebook and Instagram</h2>
    <p style="margin-top:.75rem;color:var(--text-muted);">
      We post every finished job as it comes off the trailer &mdash; driveways, patios, steps and site
      work across ${esc(site.region)}. Ask us for addresses of projects near you and we will send a
      few you can drive past.
    </p>
    <div class="btn-row btn-row--center" style="margin-top:1.5rem;">
      <a class="btn btn--dark" href="${site.social.facebook}" rel="noopener">${icon('facebook', 18)} Facebook</a>
      <a class="btn btn--ghost" href="${site.social.instagram}" rel="noopener">${icon('instagram', 18)} Instagram</a>
    </div>
  </div>`;
}

/* ---------- Footer ---------- */
export function footer() {
  const serviceLinks = services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('');
  const areaLinks = cities.slice(0, 7).map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(c.full)}</a></li>`).join('');
  const hours = site.hours.map((h) => `<li><span>${esc(h.days)}</span> &mdash; ${esc(h.time)}</li>`).join('');

  return `<footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          ${logo({ href: '/', className: 'logo--footer' })}
          <p style="margin-top:1rem;max-width:34ch;">${esc(site.shortDescription)}</p>
          <div class="footer__social">
            <a href="${site.social.facebook}" aria-label="${esc(site.name)} on Facebook" rel="noopener">${icon('facebook', 20)}</a>
            <a href="${site.social.instagram}" aria-label="${esc(site.name)} on Instagram" rel="noopener">${icon('instagram', 20)}</a>
          </div>
        </div>
        <div>
          <h2>Services</h2>
          <ul>${serviceLinks}</ul>
        </div>
        <div>
          <h2>Service Areas</h2>
          <ul>${areaLinks}<li><a href="/service-areas/">All areas &rarr;</a></li></ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul class="contact-list">
            <li>${icon('phone', 18)}<div><a href="tel:${site.phoneHref}" data-loc="footer"><strong>${esc(site.phoneDisplay)}</strong></a><br><small>Call or text</small></div></li>
            <li>${icon('mail', 18)}<div><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
            <li>${icon('pin', 18)}<div>Serving ${esc(site.region)}<br><small>${esc(site.serviceRadiusMiles)}-mile radius of ${esc(site.city)}, ${esc(site.state)}</small></div></li>
            <li>${icon('clock', 18)}<div><ul style="gap:.2rem;">${hours}</ul></div></li>
          </ul>
        </div>
      </div>
      <div class="footer__bar">
        <p>&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(site.legalName)}. All rights reserved.</p>
        <p><a href="/privacy/">Privacy</a> &middot; <a href="/terms/">Terms</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
      </div>
    </div>
  </footer>
  <div class="callbar">
    <a class="callbar__call" href="tel:${site.phoneHref}" data-loc="callbar">${icon('phone', 18)} Call Now</a>
    <a class="callbar__quote" href="/contact/">${icon('ruler', 18)} Free Estimate</a>
  </div>`;
}
