import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities, additional, counties } from '../../data/areas.mjs';
import { icon } from '../templates/icons.mjs';
import { esc, pageTitle, crumbs, ctaBand, faqList, quickForm } from '../templates/ui.mjs';
import {
  businessNode, websiteNode, webPageNode, breadcrumbNode, faqNode, cityServiceNode, itemListNode,
} from '../templates/schema.mjs';

/* ---------- /service-areas/ ---------- */
export function areasIndex() {
  const path = '/service-areas/';
  const title = pageTitle(`Service Areas Across ${site.region}`);
  const description = `We serve ${site.region} within ${site.serviceRadiusMiles} miles of ${site.city} — Butler, Cranberry, Mars, Zelienople, Wexford, Gibsonia, New Castle and more.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Service Areas', url: path }];

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">Service areas</span>
      <h1>Concrete &amp; Excavation Across ${esc(site.region)}</h1>
      <p class="phero__lede">
        Based in ${esc(site.city)} and working a roughly ${site.serviceRadiusMiles}-mile radius across
        ${counties.slice(0, 4).join(', ')} and ${counties[4]}. Close enough to show up on time, and close
        enough to come back if you ever need us.
      </p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="/contact/">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="areas-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Town by town</span>
      <h2>Find your area</h2>
      <p>Each page covers what we see most in that town &mdash; the soil, the housing stock, the local permit rules.</p>
    </div>
    <div class="grid grid--3">
      ${cities
        .map(
          (c) => `<article class="card card--link reveal">
        <span class="card__icon">${icon('pin', 26)}</span>
        <h3><a href="/service-areas/${c.slug}/">${esc(c.full)}</a></h3>
        <p>${esc(c.county)} &middot; ${esc(c.zips.join(', '))}</p>
        <span class="card__more">Local details ${icon('arrow', 16)}</span>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--concrete">
  <div class="wrap">
    <div class="split">
      <div>
        <span class="eyebrow">Also serving</span>
        <h2>Towns across the ${esc(site.region)} radius</h2>
        <p style="margin-top:1rem;color:var(--text-muted);">
          These towns are inside the regular service area even though they do not have a page of
          their own. If yours is not listed, call anyway &mdash; if we can get there, we will quote it.
        </p>
        <div class="btn-row" style="margin-top:1.5rem;">
          <a class="btn btn--dark" href="tel:${site.phoneHref}" data-loc="areas-list">${icon('phone', 18)} Ask about your town</a>
        </div>
      </div>
      <div>
        <ul class="area-list">
          ${[...new Set(additional)].map((t) => `<li>${esc(t)}</li>`).join('')}
        </ul>
      </div>
    </div>
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
      itemListNode(path, 'Service areas', cities.map((c) => ({ name: c.full, url: `/service-areas/${c.slug}/` }))),
    ],
  };
}

/* ---------- /service-areas/<slug>/ ---------- */
export function cityPage(city) {
  const path = `/service-areas/${city.slug}/`;
  const title = pageTitle(city.metaTitle);
  const description = city.metaDescription;
  const trail = [
    { name: 'Home', url: '/' },
    { name: 'Service Areas', url: '/service-areas/' },
    { name: city.full, url: path },
  ];
  const others = cities.filter((c) => c.slug !== city.slug).slice(0, 6);

  const faqs = [
    {
      q: `Do you do concrete work in ${city.full}?`,
      a: `Yes. ${site.name} serves ${city.full} and the rest of ${city.county} for concrete driveways, patios, sidewalks, steps, pads, excavation, grading and landscaping. ${city.name} is inside our regular ${site.serviceRadiusMiles}-mile service radius, so there is no travel surcharge and no minimum job size beyond what makes sense to mobilize equipment for.`,
    },
    {
      q: `How much does a concrete driveway cost in ${city.name}, ${site.state}?`,
      a: `Most residential concrete driveways in ${city.name} run $8 to $16 per square foot installed, which puts a typical 600-square-foot two-car driveway between roughly $5,000 and $9,500. The spread comes from whether the old surface has to be demolished and hauled off, how much excavation and stone the site needs, slab thickness and the finish you choose.`,
    },
    {
      q: `How fast can you get to a job in ${city.name}?`,
      a: `We can usually be out to look at a ${city.name} project within a few days of your call, and most approved estimates are scheduled to start within two to four weeks. Fall and early spring have the most flexible dates; midsummer books out furthest.`,
    },
    {
      q: `Do I need a permit for concrete work in ${city.name}?`,
      a: `It depends on the municipality and the scope. Replacing an existing driveway or patio in kind often does not require a permit, while new impervious surface, work in the right-of-way, retaining walls over four feet and anything that changes drainage usually does. We confirm the local requirement in ${city.county} during the estimate and pull the permit when one is needed.`,
    },
  ];

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">${esc(city.county)}</span>
      <h1>Concrete &amp; Excavation Contractor in ${esc(city.full)}</h1>
      <p class="phero__lede">${esc(city.intro)}</p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="#quote">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="city-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split split--wide-left" style="align-items:start;">
      <div class="prose">
        <div class="answer-box">
          <span class="eyebrow">Serving ${esc(city.name)}</span>
          <p>
            ${esc(site.name)} provides concrete driveways, patios, sidewalks, steps, pads, excavation,
            grading and landscaping throughout ${esc(city.full)} (${esc(city.zips.join(', '))}) and the
            surrounding ${esc(city.county)} area. Estimates are free and on site, pricing is fixed and in
            writing, and the crew that quotes the job is the crew that does it. Call or text
            ${esc(site.phoneDisplay)}.
          </p>
        </div>

        <h2 class="mt-0">What we see in ${esc(city.name)}</h2>
        <p>${esc(city.local)}</p>

        <h2>Services available in ${esc(city.name)}</h2>
        <ul class="checklist">
          ${services.map((s) => `<li><span><a href="/services/${s.slug}/"><strong>${esc(s.name)}</strong></a> &mdash; ${esc(s.short)} work across ${esc(city.name)} and ${esc(city.county)}.</span></li>`).join('')}
        </ul>

        <h2>Nearby neighborhoods and communities</h2>
        <p>
          We work regularly in ${city.landmarks.slice(0, -1).map(esc).join(', ')} and
          ${esc(city.landmarks[city.landmarks.length - 1])} &mdash; and everywhere in between.
        </p>
      </div>

      <aside style="position:sticky;top:calc(var(--header-h) + 1.5rem);" id="quote">
        ${quickForm({
          heading: `Free estimate in ${city.name}`,
          sub: `Local crew, local pricing. Tell us what you need and we&rsquo;ll come look.`,
          id: city.slug,
        })}
      </aside>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap--narrow">
    <div class="sec-head center">
      <span class="eyebrow">${esc(city.name)} FAQ</span>
      <h2>Questions from ${esc(city.name)} homeowners</h2>
    </div>
    ${faqList(faqs)}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Nearby</span>
      <h2>Other towns we serve</h2>
    </div>
    <ul class="area-list" style="max-width:860px;margin-inline:auto;">
      ${others.map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(c.full)}</a></li>`).join('')}
      <li><a href="/service-areas/">See all areas</a></li>
    </ul>
  </div>
</section>

${ctaBand({
    heading: `Get a free estimate in ${city.name}`,
    text: `Call or text ${site.phoneDisplay}, or send your project details and we will get back to you within one business day.`,
  })}`;

  return {
    path,
    title,
    description,
    body,
    schema: [
      businessNode(),
      websiteNode(),
      webPageNode({ path, title, description, trail }),
      breadcrumbNode(trail),
      cityServiceNode(city),
      faqNode(faqs, path),
    ],
  };
}
