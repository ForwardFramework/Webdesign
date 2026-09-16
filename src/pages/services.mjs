import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities } from '../../data/areas.mjs';
import { icon } from '../templates/icons.mjs';
import { esc, pageTitle, crumbs, serviceCards, ctaBand, faqList, quickForm } from '../templates/ui.mjs';
import {
  businessNode, websiteNode, webPageNode, breadcrumbNode, faqNode, serviceNode, itemListNode,
} from '../templates/schema.mjs';

/* ---------- /services/ ---------- */
export function servicesIndex() {
  const path = '/services/';
  const title = pageTitle('Concrete, Excavation & Landscaping Services');
  const description = `Concrete driveways, patios, sidewalks, steps, pads, excavation and landscaping across ${site.region} — with the typical price range for each.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Services', url: path }];

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">Services</span>
      <h1>Concrete, Excavation &amp; Landscaping</h1>
      <p class="phero__lede">
        Seven services, one crew, one number to call. Most projects touch at least two of them &mdash;
        which is exactly why we do not hand the dirt work off to somebody else and hope it is level.
      </p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="/contact/">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="services-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">What we do</span>
      <h2>Everything we build, start to finish</h2>
      <p>Pick the one you need &mdash; each page covers what is included, how the job runs and what it typically costs.</p>
    </div>
    ${serviceCards(services)}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Ballpark pricing</span>
      <h2>What things generally cost around here</h2>
      <p>
        Real ranges for ${esc(site.region)}, published so you can budget before anyone comes out.
        Your written estimate is a fixed number, not a range &mdash; but these are honest brackets.
      </p>
    </div>
    <div class="grid grid--3">
      ${[
        ['Concrete driveway', '$8 – $16 / sq ft', 'Installed, including demolition and haul-away of the old surface.'],
        ['Standard patio', '$10 – $14 / sq ft', 'Broom-finished, on compacted stone, pitched away from the house.'],
        ['Stamped patio', '$16 – $22 / sq ft', 'Integral color, pattern stamping and sealer included.'],
        ['Sidewalk / walkway', '$9 – $15 / sq ft', 'Replacement including removal of the failed panels.'],
        ['Front steps', '$1,800 – $4,500', 'Typical 3–5 riser set with a landing, on frost-depth footers.'],
        ['Shed pad (10×12)', '$900 – $1,600', 'Excavation, stone base, reinforced 4&Prime; slab, level and square.'],
        ['Retaining wall', '$35 – $60 / face ft', 'Segmental block with base, drainage stone and drain tile.'],
        ['Excavation / grading', '$1,200 – $2,500 / day', 'Machine and operator; haul-off and materials quoted separately.'],
        ['Hot tub pad', '$1,100 – $2,200', 'Reinforced and level for filled weight, not dry weight.'],
      ]
        .map(
          ([n, p, d]) => `<div class="card reveal">
        <span class="tag">${esc(n)}</span>
        <h3 style="margin-top:.75rem;font-size:var(--step-2);color:var(--gold-800);">${p}</h3>
        <p>${d}</p>
      </div>`
        )
        .join('')}
    </div>
    <p class="note center" style="margin-top:2rem;max-width:70ch;margin-inline:auto;">
      Prices move with site access, excavation depth, how much stone a site needs, concrete market
      pricing and finish. Anyone quoting a firm number without seeing the property is guessing.
    </p>
  </div>
</section>

${ctaBand()}`;

  return {
    path,
    title,
    description,
    body,
    schema: [
      businessNode(),
      websiteNode(),
      webPageNode({ path, title, description, trail, type: 'CollectionPage' }),
      breadcrumbNode(trail),
      itemListNode(path, 'Services', services.map((s) => ({ name: s.name, url: `/services/${s.slug}/` }))),
    ],
  };
}

/* ---------- /services/<slug>/ ---------- */
export function servicePage(service) {
  const path = `/services/${service.slug}/`;
  const title = pageTitle(service.metaTitle);
  const description = service.metaDescription;
  const trail = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services/' },
    { name: service.name, url: path },
  ];
  const related = service.related
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean);

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">${esc(service.name)}</span>
      <h1>${esc(service.h1)}</h1>
      <p class="phero__lede">${esc(service.lede)}</p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="#quote">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="service-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split split--wide-left" style="align-items:start;">
      <div class="prose">
        <div class="answer-box">
          <span class="eyebrow">The short answer</span>
          <p>${esc(service.answer)}</p>
        </div>

        <h2 class="mt-0">What&rsquo;s included</h2>
        <ul class="checklist">
          ${service.bullets.map((b) => `<li><span>${esc(b)}</span></li>`).join('')}
        </ul>

        ${service.sections.map((s) => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join('')}
      </div>

      <aside style="position:sticky;top:calc(var(--header-h) + 1.5rem);">
        ${quickForm({
          heading: `Price my ${service.short.toLowerCase()}`,
          sub: 'Free on-site estimate. Fixed written price. No obligation, and no sales visit you have to sit through.',
          id: service.slug,
        })}
      </aside>
    </div>
  </div>
</section>

<section class="section section--grit section--tight">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Our process</span>
      <h2>How a ${esc(service.short.toLowerCase())} job runs</h2>
    </div>
    <div class="steps">
      ${service.process.map(([h, p]) => `<div class="step reveal"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap wrap--narrow">
    <div class="sec-head center">
      <span class="eyebrow">${esc(service.name)} FAQ</span>
      <h2>Questions we get asked most</h2>
    </div>
    ${faqList(service.faqs)}
  </div>
</section>

<section class="section section--alt section--tight">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Also useful</span>
      <h2>Often done at the same time</h2>
    </div>
    ${related.length ? `<div class="grid grid--3">${related
      .map(
        (s) => `<article class="card card--link">
      <span class="card__icon">${icon(s.icon, 28)}</span>
      <h3><a href="/services/${s.slug}/">${esc(s.name)}</a></h3>
      <p>${esc(s.teaser)}</p>
      <span class="card__more">Learn more ${icon('arrow', 16)}</span>
    </article>`
      )
      .join('')}</div>` : ''}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Local</span>
      <h2>${esc(service.name)} near you</h2>
      <p>We handle ${esc(service.name.toLowerCase())} throughout ${esc(site.region)}.</p>
    </div>
    <ul class="area-list" style="max-width:900px;margin-inline:auto;">
      ${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(c.full)}</a></li>`).join('')}
    </ul>
  </div>
</section>

${ctaBand({
    heading: `Get your ${service.short.toLowerCase()} priced`,
    text: 'We come out, measure, look at the grade and the drainage, and give you a fixed written number. Free, and no obligation.',
  })}`;

  return {
    path,
    title,
    description,
    body,
    bodyAttrs: `data-service="${service.slug}"`,
    schema: [
      businessNode(),
      websiteNode(),
      webPageNode({ path, title, description, trail }),
      breadcrumbNode(trail),
      serviceNode(service),
      faqNode(service.faqs, path),
    ],
  };
}
