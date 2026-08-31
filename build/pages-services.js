const T = require('./templates.js');
const { B, services, cities, icons, esc } = T;

/* ------------------------------------------------------ SERVICES INDEX -- */
function servicesIndex() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Services</p>
    <h1>Roofing &amp; Exterior Services in Pittsburgh</h1>
    <p>One crew for the whole weather envelope — roof, gutters, soffit, fascia and siding. Nothing falls between trades, because there is only one trade on site.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="answer-box">
      <p>${esc(B.name)} provides roof replacement, roof and leak repair, storm damage and insurance claim work, seamless gutters and downspouts, soffit and fascia repair, siding, and free roof inspections throughout the ${esc(B.region)} area. Every inspection is free and photo-documented, every estimate is written and itemised, and every job ends with a magnetic nail sweep of the property.</p>
    </div>

    <div class="grid grid-3">
      ${services.map((s) => `<a class="card" href="${s.slug}.html">
        <span class="card__icon">${icons[s.icon]}</span>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.short)}</p>
        <span class="card__link">Learn more ${icons.arrowRight}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${T.trustBar()}
${T.ctaBand(1)}
`;

  return {
    path: 'services/index.html',
    html: T.page({
      depth: 1, path: '/services/',
      title: 'Roofing Services in Pittsburgh, PA | Top Gun Roofing LLC',
      desc: 'Roof replacement, leak repair, storm damage claims, seamless gutters, soffit and fascia across the Pittsburgh metro. Free inspections.',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/index.html' }],
      schema: [
        T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }]),
        {
          '@type': 'ItemList', name: 'Roofing services offered by Top Gun Roofing LLC',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem', position: i + 1, name: s.name,
            url: `${B.origin}/services/${s.slug}.html`,
          })),
        },
      ],
      body,
    }),
  };
}

/* ------------------------------------------------------- SERVICE PAGES -- */
function servicePage(s) {
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/index.html' },
    { label: s.name, href: `/services/${s.slug}.html` },
  ];

  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">${esc(s.name)}</p>
    <h1>${esc(s.h1)}</h1>
    <p>${esc(s.intro)}</p>
    <div class="btn-row mt-5">
      <a class="btn btn--primary btn--lg" href="${B.phoneHref}" data-cta="service-call">${icons.phone} Call ${esc(B.phone)}</a>
      <a class="btn btn--ghost-light btn--lg" href="#estimate">Free Estimate ${icons.arrowRight}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split-grid">
    <div class="prose">
      <div class="answer-box">
        <p>${esc(s.answer)}</p>
      </div>

      <h2>What's Included</h2>
      <ul class="checklist">
        ${s.bullets.map(([t, d]) => `<li>${icons.checkCircle}<span><strong>${esc(t)}</strong>${esc(d)}</span></li>`).join('\n        ')}
      </ul>

      <h2>${esc(s.name)} At A Glance</h2>
      <div class="table-scroll">
        <table class="facts">
          <caption class="sr-only">Key facts about ${esc(s.name.toLowerCase())} from Top Gun Roofing</caption>
          <tbody>
            ${s.facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2>Serving The Whole Pittsburgh Metro</h2>
      <p>We provide ${esc(s.name.toLowerCase())} throughout Allegheny County and into Butler, Washington and Westmoreland — including ${cities.slice(0, 6).map((c) => `<a href="../service-areas/${c.slug}.html">${esc(c.name)}</a>`).join(', ')} and <a href="../service-areas/index.html">many more communities</a>.</p>
    </div>

    <div class="split-grid__aside">
      ${T.quoteForm(1, { heading: `Free ${esc(s.name)} Estimate`, id: s.slug, level: 2 })}
    </div>
  </div>
</section>

${T.trustBar()}

${T.faqSection(s.faqs, { alt: true, heading: `${esc(s.name)} — Common Questions` })}

<section class="section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Also Available</p>
      <h2>Other Services</h2>
    </div>
    <div class="grid grid-3">
      ${others.map((o) => `<a class="card" href="${o.slug}.html">
        <span class="card__icon">${icons[o.icon]}</span>
        <h3>${esc(o.name)}</h3>
        <p>${esc(o.short)}</p>
        <span class="card__link">Learn more ${icons.arrowRight}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${T.ctaBand(1)}
`;

  return {
    path: `services/${s.slug}.html`,
    html: T.page({
      depth: 1, path: `/services/${s.slug}.html`,
      title: s.title, desc: s.metaDesc, crumbs,
      schema: [
        T.breadcrumbSchema(crumbs.map((c) => ({ label: c.label, href: c.href === '/' ? '/' : c.href }))),
        T.faqSchema(s.faqs),
        {
          '@type': 'Service', '@id': `${B.origin}/services/${s.slug}.html#service`,
          name: s.name, description: s.answer,
          serviceType: s.name,
          url: `${B.origin}/services/${s.slug}.html`,
          provider: { '@id': `${B.origin}/#organization` },
          areaServed: cities.map((c) => ({ '@type': 'City', name: `${c.name}, ${B.state}` })),
          audience: { '@type': 'Audience', audienceType: 'Homeowners' },
          offers: { '@type': 'Offer', priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: 'Free written estimate, no obligation' },
        },
      ],
      body,
    }),
  };
}

/* --------------------------------------------------- SERVICE-AREA INDEX -- */
function areasIndex() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Service Areas</p>
    <h1>Roofing Across The Pittsburgh Metro</h1>
    <p>We work throughout Allegheny County and into Butler, Washington and Westmoreland Counties — roughly a ${B.radiusMiles}-mile radius of Downtown Pittsburgh.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="answer-box">
      <p>${esc(B.name)} serves ${cities.length} primary communities across the ${esc(B.region)} area, including ${cities.slice(0, 8).map((c) => esc(c.name)).join(', ')} and the surrounding boroughs and townships. If your home is within about ${B.radiusMiles} miles of Downtown Pittsburgh, we cover it — and the inspection is free either way.</p>
    </div>

    <div class="grid grid-3 mt-6">
      ${cities.map((c) => `<a class="card" href="${c.slug}.html">
        <span class="card__icon">${icons.pin}</span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.county)} &middot; ${esc(c.zips.slice(0, 3).join(', '))}</p>
        <span class="card__link">${esc(c.name)} roofing ${icons.arrowRight}</span>
      </a>`).join('\n      ')}
    </div>

    <h2 class="mt-6 mb-4">Don't See Your Town?</h2>
    <p class="lead mb-5">These are the communities we work in most often, not a limit. Call ${esc(B.phone)} and we will tell you straight away whether we cover you.</p>

    <iframe class="map-embed" title="Map of the Top Gun Roofing service area around Pittsburgh, Pennsylvania"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-80.45%2C40.16%2C-79.55%2C40.72&amp;layer=mapnik&amp;marker=${B.lat}%2C${B.lng}"
      loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>
</section>

${T.ctaBand(1)}
`;

  return {
    path: 'service-areas/index.html',
    html: T.page({
      depth: 1, path: '/service-areas/',
      title: 'Service Areas | Roofing Across the Pittsburgh Metro',
      desc: `Top Gun Roofing serves Pittsburgh and ${cities.length - 1} surrounding communities across Allegheny, Butler, Washington and Westmoreland Counties.`,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Service Areas', href: '/service-areas/index.html' }],
      schema: [
        T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Service Areas', href: '/service-areas/' }]),
        {
          '@type': 'ItemList', name: 'Communities served by Top Gun Roofing LLC',
          itemListElement: cities.map((c, i) => ({
            '@type': 'ListItem', position: i + 1, name: `${c.name}, ${B.state}`,
            url: `${B.origin}/service-areas/${c.slug}.html`,
          })),
        },
      ],
      body,
    }),
  };
}

/* ---------------------------------------------------------- CITY PAGES -- */
function cityPage(c) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Service Areas', href: '/service-areas/index.html' },
    { label: c.name, href: `/service-areas/${c.slug}.html` },
  ];

  const faqs = [
    [`Do you serve ${c.name}, PA?`,
     `Yes. ${B.name} works throughout ${c.name} and the rest of ${c.county}, covering ${c.zips.join(', ')}. Inspections are free and there is no obligation.`],
    [`How much does a new roof cost in ${c.name}?`,
     `Cost depends on the square footage, pitch, number of existing layers and shingle choice — which is why we measure before quoting rather than giving a per-square number over the phone. Estimates are free, written and itemised, and ${c.name} homeowners regularly tell us our pricing came in below the other bids they collected.`],
    [`How fast can you get to a leak in ${c.name}?`,
     `We schedule inspections in ${c.name} within the same week in most cases, and we prioritise active leaks. If water is coming in now, call ${B.phone} rather than using the contact form.`],
    [`Do you handle insurance claims for ${c.name} homeowners?`,
     `Yes. We document the storm damage in detail, provide a written scope of work, and meet your adjuster on site so the claim reflects the full extent of the damage. On an approved claim you typically pay only your deductible.`],
  ];

  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">${esc(c.county)}</p>
    <h1>Roofing Contractor in ${esc(c.name)}, PA</h1>
    <p>Roof replacement, leak repair, storm damage and gutters for ${esc(c.name)} homeowners — with free, photo-documented inspections and the owner on site.</p>
    <div class="btn-row mt-5">
      <a class="btn btn--primary btn--lg" href="${B.phoneHref}" data-cta="city-call">${icons.phone} Call ${esc(B.phone)}</a>
      <a class="btn btn--ghost-light btn--lg" href="#estimate">Free ${esc(c.name)} Estimate ${icons.arrowRight}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split-grid">
    <div class="prose">
      <div class="answer-box">
        <p>${esc(B.name)} is a ${B.veteranOwned ? 'veteran-owned, ' : ''}owner-operated roofing contractor serving ${esc(c.name)}, ${esc(B.state)} and the surrounding ${esc(c.county)} communities. We provide roof replacement, leak repair, storm damage and insurance claim work, seamless gutters, and soffit and fascia repair, with free photo-documented inspections and ${B.rating}-star reviews from ${B.reviewCount} local homeowners.</p>
      </div>

      <h2>Roofing In ${esc(c.name)}</h2>
      <p>${esc(c.housing)}</p>
      <p>${esc(c.challenge)}</p>

      <h2>What ${esc(c.name)} Roofs Are Up Against</h2>
      <p>Pittsburgh-area weather is hard on roofs in a specific way. The region averages roughly 38 inches of rain and 28 inches of snow a year, spread across about 150 wet days — but the real damage comes from the freeze-thaw cycling. Water melts during the day, refreezes at the eave overnight, and works backwards under the shingles. That is why we install ice-and-water shield at every eave and valley on a replacement, and why we check attic ventilation on every inspection: a warm attic melts snow from underneath and builds the ice dam for you.</p>

      <h2>Services For ${esc(c.name)} Homeowners</h2>
      <div class="grid grid-2 mt-4">
        ${services.slice(0, 6).map((s) => `<a class="card" href="../services/${s.slug}.html">
          <span class="card__icon">${icons[s.icon]}</span>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.short)}</p>
          <span class="card__link">Learn more ${icons.arrowRight}</span>
        </a>`).join('\n        ')}
      </div>

      <h2>${esc(c.name)} Coverage</h2>
      <div class="table-scroll">
        <table class="facts">
          <caption class="sr-only">Top Gun Roofing service details for ${esc(c.name)}, Pennsylvania</caption>
          <tbody>
            <tr><th scope="row">Municipality</th><td>${esc(c.name)}, ${esc(B.state)}</td></tr>
            <tr><th scope="row">County</th><td>${esc(c.county)}</td></tr>
            <tr><th scope="row">ZIP codes served</th><td>${esc(c.zips.join(', '))}</td></tr>
            <tr><th scope="row">Areas covered</th><td>${esc(c.neighborhoods.join(', '))}</td></tr>
            <tr><th scope="row">Inspection cost</th><td>Free, with photo documentation and no obligation</td></tr>
            <tr><th scope="row">Phone</th><td><a href="${B.phoneHref}">${esc(B.phone)}</a></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="split-grid__aside">
      ${T.quoteForm(1, { heading: `Free ${esc(c.name)} Estimate`, id: c.slug, level: 2, note: `Serving ${esc(c.name)} and all of ${esc(c.county)}.` })}
    </div>
  </div>
</section>

${T.trustBar()}

${T.faqSection(faqs, { alt: true, heading: `Roofing In ${esc(c.name)} — FAQs` })}

<section class="section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Nearby</p>
      <h2>Other Communities We Serve</h2>
    </div>
    <div class="area-links" style="justify-content:center">
      ${cities.filter((x) => x.slug !== c.slug).map((x) => `<a href="${x.slug}.html">${esc(x.name)}</a>`).join('\n      ')}
    </div>
  </div>
</section>

${T.ctaBand(1, {
  heading: `${esc(c.name)} Homeowners: Start With A Free Inspection`,
  text: `Photos of exactly what your roof needs, a written itemised estimate, and an honest answer about whether you need a repair or a replacement.`,
})}
`;

  return {
    path: `service-areas/${c.slug}.html`,
    html: T.page({
      depth: 1, path: `/service-areas/${c.slug}.html`,
      title: `${c.name} Roofing Contractor | Top Gun Roofing LLC`,
      desc: `Roof replacement, repair and storm damage work in ${c.name}, ${B.state}. ${B.rating} stars from ${B.reviewCount} reviews. Free inspections — call ${B.phone}.`,
      crumbs,
      schema: [
        T.breadcrumbSchema(crumbs),
        T.faqSchema(faqs),
        {
          '@type': 'Service',
          '@id': `${B.origin}/service-areas/${c.slug}.html#service`,
          name: `Roofing services in ${c.name}, ${B.state}`,
          serviceType: 'Roofing contractor',
          description: `Roof replacement, roof repair, storm damage restoration, insurance claim assistance, gutters, and soffit and fascia repair for homeowners in ${c.name}, ${c.county}, Pennsylvania.`,
          url: `${B.origin}/service-areas/${c.slug}.html`,
          provider: { '@id': `${B.origin}/#organization` },
          areaServed: {
            '@type': 'City', name: `${c.name}, ${B.state}`,
            containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county}, Pennsylvania` },
          },
        },
      ],
      body,
    }),
  };
}

module.exports = { servicesIndex, servicePage, areasIndex, cityPage };
