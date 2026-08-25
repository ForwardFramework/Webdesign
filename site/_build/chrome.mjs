/* Shared page chrome: head, header, footer, and repeated blocks. */
import { icons } from './icons.mjs';
import { biz } from './content.mjs';

export const NAV = [
  { href: 'index.html',    label: 'Home' },
  { href: 'services.html', label: 'Services' },
  { href: 'about.html',    label: 'About' },
  { href: 'contact.html',  label: 'Contact' }
];

export function head({ page, title, description, extraHead = '' }) {
  const canonical = `${biz.origin}/${page === 'index.html' ? '' : page}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0B0B0D">
<meta name="robots" content="index, follow">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${biz.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${biz.origin}/assets/img/logo-mark.svg">
<meta name="twitter:card" content="summary">

<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/favicon.svg">

<link rel="preload" href="assets/fonts/barlow-condensed-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/barlow-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/styles.css">
${extraHead}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

export function header(current) {
  const links = NAV.map(item => {
    const isCurrent = item.href === current;
    return `        <li><a class="nav__link" href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
  }).join('\n');

  return `
<div class="topbar">
  <div class="container topbar__inner">
    <span class="topbar__item"><span class="topbar__pulse" aria-hidden="true"></span> ${biz.hours} &mdash; emergency calls welcome</span>
    <span class="topbar__item">${icons.pin} Mobile service across ${biz.region}</span>
  </div>
</div>

<header class="site-header">
  <div class="container">
    <nav class="nav" aria-label="Main">
      <a class="brand" href="index.html">
        <img class="brand__mark" src="assets/img/logo-mark-compact.svg" alt="" width="46" height="46">
        <span class="brand__text">
          <span class="brand__name">Ko<em>touch</em></span>
          <span class="brand__sub">Equipment Services</span>
        </span>
      </a>

      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu">
        <span class="icon-open">${icons.menu}</span>
        <span class="icon-close">${icons.close}</span>
        <span class="visually-hidden">Toggle navigation menu</span>
      </button>

      <div class="nav__menu" id="nav-menu">
        <ul class="nav__links">
${links}
        </ul>
        <div class="nav__cta">
          <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} ${biz.phone}</a>
        </div>
      </div>
    </nav>
  </div>
</header>
<div class="hazard hazard--thin" aria-hidden="true"></div>`;
}

/* Gold conversion band used at the foot of every page. */
export function ctaBand(heading, body) {
  return `
<section class="cta-band">
  <img class="cta-band__gear" src="assets/img/logo-mark.svg" alt="" aria-hidden="true" width="340" height="340">
  <div class="container cta-band__inner">
    <div>
      <h2>${heading}</h2>
      <p>${body}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--dark" href="${biz.phoneHref}">${icons.phone} ${biz.phone}</a>
      <a class="btn btn--dark" href="contact.html">Request Service</a>
    </div>
  </div>
</section>`;
}

export function footer() {
  const links = NAV.map(i => `        <li><a href="${i.href}">${i.label}</a></li>`).join('\n');

  return `
<div class="hazard" aria-hidden="true"></div>
<footer class="site-footer">
  <div class="container">
    <div class="footer__grid footer">
      <div class="footer__brand">
        <a class="brand" href="index.html">
          <img class="brand__mark" src="assets/img/logo-mark-compact.svg" alt="" width="46" height="46">
          <span class="brand__text">
            <span class="brand__name">Ko<em>touch</em></span>
            <span class="brand__sub">Equipment Services</span>
          </span>
        </a>
        <p>${biz.tagline} serving ${biz.region}. ${biz.slogan}.</p>
      </div>

      <div>
        <h4>Site</h4>
        <ul class="footer__list">
${links}
        </ul>
      </div>

      <div>
        <h4>Services</h4>
        <ul class="footer__list">
          <li><a href="services.html#diagnostics-repair">Diagnostics &amp; Repair</a></li>
          <li><a href="services.html#hydraulics">Hydraulics</a></li>
          <li><a href="services.html#engine-repair">Engine Repair</a></li>
          <li><a href="services.html#welding-fabrication">Welding &amp; Fabrication</a></li>
          <li><a href="services.html#preventative-maintenance">Preventative Maintenance</a></li>
        </ul>
      </div>

      <div>
        <h4>Contact</h4>
        <ul class="footer__list">
          <li><a href="${biz.phoneHref}">${biz.phone}</a></li>
          <li><a href="mailto:${biz.email}">${biz.email}</a></li>
          <li><span>${biz.region}</span></li>
          <li><span>${biz.hours}</span></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; <span data-year>2025</span> ${biz.name}. All rights reserved.</p>
      <p>${biz.owner} &mdash; ${biz.ownerRole}</p>
    </div>
  </div>
</footer>

<div class="call-bar">
  <a class="is-primary" href="${biz.phoneHref}">${icons.phone} Call Now</a>
  <a href="mailto:${biz.email}">${icons.mail} Email</a>
</div>

<script src="assets/js/main.js" defer></script>
</body>
</html>`;
}
