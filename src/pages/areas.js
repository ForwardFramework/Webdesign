const { business: B, services, areas, reviews } = require('../data/site.js');
const { esc, telHref, I, cityState } = require('../templates/layout.js');
const C = require('../templates/components.js');
const { page, abs, D } = require('../templates/shell.js');

const counties = [...new Set(areas.map(a => a.county))];

function hub() {
  const byCounty = counties.map(c => `
    <div class="card">
      <h3>${esc(c)}</h3>
      <div class="area-cloud" style="margin-top:1rem">
        ${areas.filter(a => a.county === c).map(a => a.page
          ? `<a class="area-chip" href="/service-areas/${a.slug}/">${I.pin}${esc(a.name)}</a>`
          : `<span class="area-chip">${esc(a.name)}</span>`).join('')}
      </div>
    </div>`).join('');

  const body = `
<section class="section">
  <div class="wrap">
    ${C.answerBox('Coverage',
      `${B.name} serves ${B.city} and communities within roughly ${B.serviceRadiusMiles} miles, covering ${counties.join(', ')} in Western Pennsylvania. We handle roof replacement, repair, storm damage claims, gutters, and siding throughout that area, with 24/7 emergency tarping.`)}
    <div style="height:2.5rem"></div>
    <div class="grid g-2">${byCounty}</div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap-narrow prose">
    <h2 style="margin-top:0">Roofing in Western Pennsylvania is its own problem</h2>
    <p>This region is hard on roofs in a specific way. It is not the depth of the cold or the height of
    the heat &mdash; it is the cycling. Western PA runs through freeze-and-thaw dozens of times each winter,
    and every cycle works water deeper into whatever small gap it found last time. Add high annual
    precipitation, heavy cloud cover that keeps north slopes damp, and the ice that forms at cold eaves
    below warm attics, and you get roofs that reach the end of their service life a few years earlier
    than the national averages suggest.</p>
    <p>Housing stock matters too. A 1930s home in the city has steep pitches, tight access, and a
    chimney that was almost certainly flashed with mortar rather than metal. A 2005 development in
    Cranberry has wide-open wind exposure and a builder-grade roof that is now hitting twenty. Those
    are different jobs with different failure points, and pricing them off a satellite measurement
    alone misses most of what matters.</p>
    <h2>Not sure whether you are in our area?</h2>
    <p>Call or text <a href="${telHref}">${esc(B.phone)}</a>. If we are not the right crew for your address,
    we will say so rather than waste your afternoon.</p>
  </div>
</section>

${C.ctaBand()}`;

  return page({
    path: '/service-areas/',
    title: `Roofing Service Areas | ${B.city} & Western PA`,
    desc: `${B.name} serves ${B.city} and communities within ${B.serviceRadiusMiles} miles across Allegheny, Butler, Beaver, Washington, and Westmoreland counties.`,
    crumbs: [{ label: 'Service Areas' }],
    pageType: 'CollectionPage',
    head: `<h1>Where We Work</h1>
      <p class="lede">${esc(B.city)} and roughly ${B.serviceRadiusMiles} miles in every direction &mdash;
      ${esc(counties.join(', '))}.</p>`,
    body
  });
}

function detail(a) {
  const title = `${a.name}, ${B.state}`;
  const body = `
<section class="section">
  <div class="wrap split">
    <div>
      ${C.answerBox('The short answer',
        `${B.name} provides roof replacement, roof repair, storm damage restoration, gutters, and siding in ${title} and the surrounding ${a.county} area. Inspections and written estimates are free, emergency tarping is available 24/7, and we hold a ${B.ratingValue}-star rating from ${B.reviewCount} customer recommendations. Call ${B.phone}.`)}

      <div class="prose" style="margin-top:2.5rem">
        <p class="lede">${esc(a.note)}</p>

        <h2>Roofing services we provide in ${esc(a.name)}</h2>
        <ul class="checklist">
          ${services.map(s => `<li>${I.checkPlain}<span><strong><a href="/services/${s.slug}/">${esc(s.title)}</a></strong> &mdash; ${esc(s.blurb)}</span></li>`).join('')}
        </ul>

        <h2>What ${esc(a.name)} homeowners call us about most</h2>
        <p>The pattern here is consistent: leaks that start at a failed pipe boot or a chimney that was
        never properly flashed, wind damage along ridges and rake edges after a front moves through, and
        roofs that reached twenty years all at once because the neighbourhood was built at the same time.
        Ice dams show up every winter in homes where the attic is under-insulated and the soffit intake
        is blocked &mdash; which is a much cheaper problem to fix than most people assume.</p>

        <h2>How fast can you get to ${esc(a.name)}?</h2>
        <p>Emergency tarping is 24/7 across our whole service area, including ${esc(a.name)}. Standard
        inspections are usually scheduled within a few days. The week after a major storm runs longer,
        because the entire region calls at once &mdash; if a front just went through, call early.</p>

        <h2>Free inspection, no obligation</h2>
        <p>We get on the roof and into the attic, photograph everything we find, and give you a written
        estimate only if you need one. If your roof has years left, that is what we will tell you.
        Call or text <a href="${telHref}">${esc(B.phone)}</a>.</p>
      </div>
    </div>

    <div class="sticky-aside">
      <div class="aside-card">
        <h3>Free estimate in ${esc(a.name)}</h3>
        <p>Photo-documented inspection and written pricing. Same-day reply on most weekdays.</p>
        ${C.quoteForm({ id: 'area-' + a.slug })}
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">Nearby</span>
      <h2>Other areas we cover</h2>
    </div>
    ${C.areaCloud()}
  </div>
</section>

${C.ctaBand(`Roofing help in ${a.name}?`, `Free inspection, photos of everything we find, and a written estimate. Call or text ${B.phone}.`)}`;

  return page({
    path: `/service-areas/${a.slug}/`,
    title: `${a.name}, ${B.state} Roofing Contractor | ${B.name}`,
    desc: `Roof replacement, repair, and storm damage restoration in ${title}. Free photo-documented inspection and 24/7 emergency tarping. Call ${B.phone}.`,
    crumbs: [{ label: 'Service Areas', href: '/service-areas/' }, { label: a.name }],
    head: `<h1>Roofing in ${esc(title)}</h1>
      <p class="lede">Roof replacement, repair, storm damage, gutters, and siding for ${esc(a.name)} and the rest of ${esc(a.county)}.</p>`,
    schema: [{
      '@type': 'Service',
      '@id': abs(`/service-areas/${a.slug}/`) + '#service',
      name: `Roofing services in ${title}`,
      provider: { '@id': D + '/#organization' },
      areaServed: { '@type': 'City', name: title, containedInPlace: { '@type': 'AdministrativeArea', name: a.county } },
      url: abs(`/service-areas/${a.slug}/`)
    }],
    body
  });
}

module.exports = { hub, detail, counties };
