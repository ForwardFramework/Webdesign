const { business: B, services, areas } = require('../data/site.js');
const I = require('./icons.js');

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const telHref = `tel:${B.phoneRaw}`;
const cityState = `${B.city}, ${B.state}`;
const stars = (n = 5) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${I.star.repeat(n)}</span>`;

/* ---------- navigation model ---------- */
const serviceLinks = services.map(s => ({ href: `/services/${s.slug}/`, label: s.nav }));
const nav = [
  { href: '/services/', label: 'Services', children: serviceLinks },
  { href: '/gallery/', label: 'Our Work' },
  { href: '/reviews/', label: 'Reviews' },
  { href: '/service-areas/', label: 'Service Areas' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
];

/* ---------- logo (auto-falls back until logo.png is added) ---------- */
const logo = (cls, h) => `
<a class="${cls}" href="/" aria-label="${esc(B.name)} — home">
  <img src="/assets/img/logo.png" alt="${esc(B.name)} logo" width="240" height="${h}"
       style="height:${h}px" decoding="async"
       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
  <span class="brand-fallback" style="display:none">
    <b>ROUGHNECK</b><span>Roofing</span>
  </span>
</a>`;

/* ---------- header ---------- */
function header(active) {
  const isOn = (href) => href === '/' ? active === '/' : active.startsWith(href);
  const links = nav.map(item => {
    const cur = isOn(item.href) ? ' aria-current="page"' : '';
    if (!item.children) return `<li><a href="${item.href}"${cur}>${item.label}</a></li>`;
    return `<li class="has-menu">
      <a href="${item.href}"${cur} aria-haspopup="true">${item.label}${I.chev.replace('<svg', '<svg class="caret"')}</a>
      <ul class="submenu">${item.children.map(c =>
        `<li><a href="${c.href}"${active === c.href ? ' aria-current="page"' : ''}>${c.label}</a></li>`).join('')}
      </ul></li>`;
  }).join('');

  const drawerLinks = nav.map(item => {
    let out = `<li><a href="${item.href}"${isOn(item.href) ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
    if (item.children) out += item.children.map(c =>
      `<li class="sub"><a href="${c.href}">${c.label}</a></li>`).join('');
    return out;
  }).join('') + `<li><a href="/resources/">Resources</a></li><li><a href="/faq/">FAQ</a></li>`;

  return `
<div class="topbar">
  <div class="wrap">
    <div class="topbar-left">
      <span class="topbar-item">${I.pin}${esc(cityState)} &amp; surrounding areas</span>
      <span class="topbar-item hide-sm">${I.clock}${esc(B.hoursLabel)}</span>
    </div>
    <div class="topbar-right">
      <span class="topbar-item hide-sm">${stars()} <strong>${B.ratingValue}</strong> from ${B.reviewCount} reviews</span>
      <a class="topbar-item" href="${telHref}">${I.phone}${esc(B.phone)}</a>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="wrap">
    <nav class="nav" aria-label="Main">
      ${logo('brand', 52)}
      <ul class="nav-links">${links}</ul>
      <div class="nav-cta">
        <a class="nav-phone" href="${telHref}"><small>Call or text</small><b>${esc(B.phone)}</b></a>
        <a class="btn btn--primary btn--sm" href="/contact/">Free Estimate</a>
        <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
      </div>
    </nav>
  </div>
</header>

<div class="scrim"></div>
<aside class="drawer" id="drawer" aria-hidden="true" aria-label="Menu">
  <div class="drawer-head">
    ${logo('brand', 40)}
    <button class="drawer-close" type="button" aria-label="Close menu">&times;</button>
  </div>
  <nav aria-label="Mobile"><ul>${drawerLinks}</ul></nav>
  <div class="drawer-foot">
    <a class="btn btn--primary btn--block" href="${telHref}">${I.phone} Call ${esc(B.phone)}</a>
    <a class="btn btn--ghost btn--block" href="/contact/">Get a Free Estimate</a>
  </div>
</aside>`;
}

/* ---------- footer ---------- */
function footer() {
  const areaLinks = areas.filter(a => a.page)
    .map(a => `<li><a href="/service-areas/${a.slug}/">${esc(a.name)} Roofing</a></li>`).join('');
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid foot">
      <div class="foot-brand">
        ${logo('brand', 64)}
        <p>${esc(B.tagline)} Roof replacement, repair, storm damage, gutters, and siding across ${esc(cityState)} and the surrounding counties.</p>
        <div class="socials">
          <a href="${B.facebook}" rel="noopener" target="_blank" aria-label="${esc(B.name)} on Facebook">${I.facebook}</a>
          <a href="${telHref}" aria-label="Call ${esc(B.phone)}">${I.phone}</a>
          <a href="mailto:${esc(B.email)}" aria-label="Email ${esc(B.name)}">${I.mail}</a>
        </div>
      </div>
      <div>
        <h4>Services</h4>
        <ul>${services.map(s => `<li><a href="/services/${s.slug}/">${esc(s.title)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Service Areas</h4>
        <ul>${areaLinks}<li><a href="/service-areas/">All areas we cover</a></li></ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about/">About Roughneck Roofing</a></li>
          <li><a href="/gallery/">Project Gallery</a></li>
          <li><a href="/reviews/">Customer Reviews</a></li>
          <li><a href="/resources/">Roofing Resources</a></li>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/contact/">Free Estimate</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <address>
          <div>${I.phone}<a href="${telHref}">${esc(B.phone)}</a></div>
          <div>${I.mail}<a href="mailto:${esc(B.email)}">${esc(B.email)}</a></div>
          <div>${I.pin}<span>Serving ${esc(cityState)}<br>within ${B.serviceRadiusMiles} miles</span></div>
          <div>${I.clock}<span>${esc(B.hoursLabel)}</span></div>
        </address>
      </div>
    </div>
    <div class="foot-bottom">
      <span>&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(B.legalName)}. All rights reserved.${B.licenseNumber ? ' PA HIC #' + esc(B.licenseNumber) + '.' : ''} Licensed &amp; insured.</span>
      <nav aria-label="Legal">
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/accessibility/">Accessibility</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </div>
</footer>

<div class="callbar">
  <a class="c-call" href="${telHref}">${I.phone} Call Now</a>
  <a class="c-quote" href="/contact/">${I.file} Free Estimate</a>
</div>

<div class="lightbox" role="dialog" aria-modal="true" aria-label="Project photo">
  <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
  <button class="lightbox-nav prev" type="button" aria-label="Previous photo">&#8249;</button>
  <img src="" alt="">
  <button class="lightbox-nav next" type="button" aria-label="Next photo">&#8250;</button>
  <p class="lightbox-cap"></p>
</div>`;
}

module.exports = { esc, jsonld, telHref, cityState, stars, logo, header, footer, nav, I, B };
