const { business: B, services, reviews } = require('../data/site.js');
const { esc, telHref, I, cityState } = require('../templates/layout.js');
const C = require('../templates/components.js');
const { page, abs, D } = require('../templates/shell.js');

/* ---------- /services/ hub ---------- */
function hub() {
  const body = `
<section class="section">
  <div class="wrap">
    ${C.answerBox('At a glance',
      `${B.name} provides ${services.length} exterior services in ${cityState}: ${services.map(s => s.title.toLowerCase()).join(', ')}. Inspections and written estimates are free on all of them, and every job is photo-documented from start to finish.`)}
    <div style="height:2.5rem"></div>
    ${C.serviceGrid()}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">The standard</span>
      <h2>What every Roughneck job includes</h2>
    </div>
    <div class="grid g-4">
      <div class="card"><span class="card-icon">${I.camera}</span><h3>Photo documentation</h3><p>Dated pictures of the roof and attic before we start and after we finish. You keep them.</p></div>
      <div class="card"><span class="card-icon">${I.file}</span><h3>Written scope</h3><p>Line-item estimate with materials, quantities, and unit prices for anything discovered mid-job.</p></div>
      <div class="card"><span class="card-icon">${I.shield}</span><h3>Licensed &amp; insured</h3><p>General liability and workers compensation. Certificates on request, before work starts.</p></div>
      <div class="card"><span class="card-icon">${I.broom}</span><h3>Double magnetic sweep</h3><p>Lawn, driveway, and street swept twice. Find a nail later and we come back out.</p></div>
    </div>
  </div>
</section>

${C.ctaBand('Not sure which service you need?',
  `That is what a free inspection is for. We will look, photograph, and tell you honestly &mdash; including when the answer is "nothing yet."`)}`;

  return page({
    path: '/services/',
    title: `Roofing & Exterior Services in ${cityState} | ${B.name}`,
    desc: `Roof replacement, repair, storm damage claims, free inspections, seamless gutters, siding, and commercial flat roofing in ${cityState}. Free written estimates.`,
    crumbs: [{ label: 'Services' }],
    pageType: 'CollectionPage',
    head: `<h1>Roofing &amp; Exterior Services</h1>
      <p class="lede">Everything above your walls &mdash; and the gutters and siding that carry water away from them.
      Free inspection and written estimate on all of it.</p>`,
    schema: [{
      '@type': 'ItemList',
      '@id': D + '/services/#list',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem', position: i + 1, name: s.title, url: abs(`/services/${s.slug}/`)
      }))
    }],
    body
  });
}

/* ---------- individual service pages ---------- */
function detail(s) {
  const others = services.filter(x => x.slug !== s.slug);
  const body = `
<section class="section">
  <div class="wrap split">
    <div>
      ${C.answerBox('The short answer', s.answer)}
      <div class="prose" style="margin-top:2.5rem">
        <p class="lede">${esc(s.intro)}</p>
        ${C.renderSections(s.sections)}
      </div>

      <h2 style="margin-top:3rem">${esc(s.title)} questions</h2>
      ${C.faqBlock(s.faqs)}
    </div>

    <div class="sticky-aside">
      <div class="aside-card">
        <h3>Free estimate</h3>
        <p>Photo-documented inspection and a written, line-item price. No obligation.</p>
        <div class="btn-row" style="flex-direction:column">
          <a class="btn btn--primary btn--block" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
          <a class="btn btn--ghost btn--block" href="/contact/">Request online</a>
        </div>
      </div>
      <div class="aside-card">
        <h3>All services</h3>
        <ul class="aside-list">
          ${services.map(x => `<li><a href="/services/${x.slug}/"${x.slug === s.slug ? ' aria-current="page"' : ''}>${esc(x.title)}</a></li>`).join('')}
        </ul>
      </div>
      <div class="aside-card">
        <h3>${B.ratingValue} stars, ${B.reviewCount} reviews</h3>
        ${C.reviewCard(reviews[0])}
        <a class="btn btn--ghost btn--block btn--sm" style="margin-top:1rem" href="/reviews/">Read all reviews</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">Also from Roughneck</span>
      <h2>Related services</h2>
    </div>
    ${C.serviceGrid(others.slice(0, 3))}
  </div>
</section>

${C.ctaBand()}`;

  return page({
    path: `/services/${s.slug}/`,
    title: s.metaTitle,
    desc: s.metaDesc,
    crumbs: [{ label: 'Services', href: '/services/' }, { label: s.title }],
    pageType: 'WebPage',
    faqs: s.faqs,
    head: `<h1>${esc(s.h1)}</h1><p class="lede">${esc(s.blurb)}</p>`,
    schema: [{
      '@type': 'Service',
      '@id': abs(`/services/${s.slug}/`) + '#service',
      name: s.title,
      serviceType: s.title,
      description: s.answer,
      provider: { '@id': D + '/#organization' },
      areaServed: { '@type': 'City', name: `${B.city}, ${B.state}` },
      url: abs(`/services/${s.slug}/`),
      offers: { '@type': 'Offer', priceCurrency: 'USD', description: s.price,
                availability: 'https://schema.org/InStock' }
    }],
    body
  });
}

module.exports = { hub, detail };
