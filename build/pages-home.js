const T = require('./templates.js');
const { B, services, cities, icons, esc, stars, initials } = T;
const { reviews } = require('./reviews.js');

const HOME_FAQS = [
  ['How much does a new roof cost in Pittsburgh?',
   'Roof cost depends on square footage, pitch, how many layers have to come off, and the shingle you choose — so any number given before a roof is measured is a guess. Top Gun Roofing provides a free, written, itemised estimate. Customers regularly report our pricing came in below the other bids they collected.'],
  ['How long does a roof replacement take?',
   'Most single-family homes in the Pittsburgh area are torn off and completely re-roofed in one day. Larger or steeper roofs, or ones needing significant decking replacement, may run into a second day. You get a firm schedule before we start.'],
  ['Do you help with insurance claims?',
   'Yes. We photograph and document the damage, provide a written scope of work, and meet your adjuster on site so the claim reflects the full extent of the damage. On an approved claim, homeowners typically pay only their deductible.'],
  ['Are your roof inspections really free?',
   'Yes — free, documented with photos, and with no obligation. If your roof is fine, we will tell you it is fine. We would rather earn your business in five years than sell you something you do not need today.'],
  ['Do you take small repair jobs?',
   'We do. We regularly handle single flashing repairs, cracked pipe boots, attic fans, and soffit and fascia work. No job is too small to deserve the same quality and respect as a full replacement.'],
  ['What areas around Pittsburgh do you serve?',
   `We serve the ${B.region} area — Pittsburgh proper plus the surrounding Allegheny, Butler, Washington and Westmoreland County communities, including Mt. Lebanon, Bethel Park, Upper St. Clair, Cranberry Township, Wexford, Monroeville, Sewickley and Moon Township.`],
  ['How do I know if I need a repair or a full replacement?',
   'It comes down to the age of the roof, how widespread the damage is, and the condition of the decking underneath. A roof with ten good years left and one bad valley needs a repair, not a replacement. We show you photos of what we find and give you a straight answer either way.'],
  ['What makes Top Gun Roofing different from other Pittsburgh roofers?',
   `${B.owner}, the owner, is on your job — inspecting the finished work himself before the crew leaves. Every roof is a full tear-off, every property gets a magnetic nail sweep, and every homeowner gets the process explained without a hard sell.`],
];

const WHY = [
  [icons.handshake, 'The owner is on your roof', `${B.owner} personally inspects every finished job before the crew leaves. You are not handed off to a salesperson who never sees the work.`],
  [icons.camera, 'Everything is documented', 'Dated photos before, during and after — so you can see exactly what was found and what was fixed, even if you were at work all day.'],
  [icons.clipboard, 'No hard sell, ever', 'We explain what your roof actually needs and what it does not. Customers routinely tell us we found things other companies missed — and did not push a thing.'],
  [icons.broom, 'Your yard left spotless', 'Full magnetic sweep of the yard, beds and driveway. No nails, no debris, nothing left behind for you to find with a tyre.'],
  [icons.shield, 'Insurance claims handled', 'We document the damage properly and meet your adjuster on site so the claim covers the real scope, not a fraction of it.'],
  [icons.snow, 'Built for Pittsburgh winters', 'Ice-and-water shield at every eave and valley, and balanced attic ventilation — the two details that decide whether ice dams damage your home.'],
];

const STEPS = [
  ['Free inspection', 'We get on the roof, photograph everything, and check the attic and ventilation. You see what we see, close up — not a summary from the driveway.'],
  ['Straight answer, written estimate', `${B.owner} walks you through what your roof actually needs, what it does not, and what each line costs. Itemised, in writing, with no pressure to sign anything.`],
  ['Insurance handled, if needed', 'Storm damage? We provide the documentation and meet your adjuster on site so the claim reflects the full scope of the loss.'],
  ['Install day', 'Full tear-off to the deck, decking replaced where needed, ice-and-water shield, synthetic underlayment, architectural shingles. Most homes finished in a day.'],
  ['Inspected and swept clean', 'The owner inspects the finished roof himself, and the property gets a full magnetic nail sweep before we leave. Then the warranty paperwork is registered in your name.'],
];

const GALLERY = [
  ['aerial-tear-off-before.jpg', 'Aerial view of a weathered asphalt shingle roof in the Pittsburgh area before tear-off, with the disposal trailer staged in the driveway', 'Before: aged, moss-shadowed shingles', 'Full tear-off underway'],
  ['aerial-new-shingles-driftwood.jpg', 'Aerial view of a Pittsburgh-area home part-way through a roof replacement, with new driftwood-toned architectural shingles installed', 'During: new architectural shingles', 'Same-day replacement'],
  ['aerial-new-roof-chimneys.jpg', 'Aerial view of a completed grey architectural shingle roof with two brick chimneys and a dormer, installed by Top Gun Roofing', 'After: finished roof with new chimney flashing', 'Complete replacement'],
  ['aerial-full-replacement-street.jpg', 'Aerial street-side view of a completed roof replacement on a two-storey Pittsburgh home with new gutters and white trim', 'After: roof, gutters and trim', 'Full exterior package'],
];

function homeServiceCards() {
  return services.slice(0, 6).map((s) => `<a class="card" href="services/${s.slug}.html">
        <span class="card__icon">${icons[s.icon]}</span>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.short)}</p>
        <span class="card__link">Learn more ${icons.arrowRight}</span>
      </a>`).join('\n      ');
}

function reviewCard(r) {
  return `<article class="review">
        <div class="review__head">${stars(r.rating)}<span class="review__meta">${esc(r.when)}</span></div>
        <blockquote>${esc(r.text)}</blockquote>
        ${r.tag ? `<span class="review__tag">${esc(r.tag)}</span>` : ''}
        <div class="review__foot">
          <span class="review__avatar" aria-hidden="true">${esc(initials(r.name))}</span>
          <span>
            <span class="review__name">${esc(r.name)}</span>
            <span class="review__meta">${r.localGuide ? 'Google Local Guide' : 'Google review'}</span>
          </span>
        </div>
      </article>`;
}

function build() {
  const featured = [
    reviews.find((r) => r.name === 'Sandy Klocek'),
    reviews.find((r) => r.name === 'Pearl the person'),
    reviews.find((r) => r.name === 'Jeffrey Wagner'),
    reviews.find((r) => r.name === 'PseudoWyvern'),
    reviews.find((r) => r.name === 'Jacob Fitzpatrick'),
    reviews.find((r) => r.name === 'Carlos Mezarina'),
  ].filter(Boolean);

  const body = `
<section class="hero hero--home">
  <div class="container hero__grid">
    <div>
      <p class="eyebrow">${B.veteranOwned ? 'Veteran-Owned' : 'Locally Owned'} &middot; Pittsburgh, PA</p>
      <h1>Pittsburgh Roofing<span class="gold">Done Right The First Time</span></h1>
      <p class="hero__sub">Roof replacement, leak repair and storm damage work across the ${esc(B.region)} area — with the owner on your roof, every job photographed, and your yard swept clean before we leave.</p>

      <div class="hero__badges">
        <span class="badge">${icons.checkCircle} Free Inspections</span>
        <span class="badge">${icons.checkCircle} Insurance Claims Handled</span>
        <span class="badge">${icons.checkCircle} Licensed &amp; Insured</span>
        <span class="badge">${icons.checkCircle} Most Roofs Done In A Day</span>
      </div>

      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="${B.phoneHref}" data-cta="hero-call">${icons.phone} Call ${esc(B.phone)}</a>
        <a class="btn btn--ghost-light btn--lg" href="#estimate">Get A Free Estimate ${icons.arrowRight}</a>
      </div>

      <div class="hero__proof">
        <span class="hero__proof-score">${esc(B.rating)}</span>
        <span class="hero__proof-text">
          ${stars(5)}
          <strong>${B.reviewCount} Google reviews</strong>
          Not one of them below five stars.
        </span>
      </div>
    </div>

    ${T.quoteForm(0, { heading: 'Free Estimate — No Pressure', id: 'hero', level: 2 })}
  </div>
</section>

${T.trustBar()}

<section class="section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">What We Do</p>
      <h2>Complete Roofing &amp; Exterior Services</h2>
      <p class="lead">From a single cracked pipe boot to a full tear-off with new gutters, soffit and fascia — handled by one crew that does not stop at the edge of its own trade.</p>
    </div>
    <div class="grid grid-3">
      ${homeServiceCards()}
    </div>
    <p class="text-center mt-6"><a class="btn btn--ghost" href="services/index.html">See all services ${icons.arrowRight}</a></p>
  </div>
</section>

<section class="section dark-section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Why Homeowners Choose Us</p>
      <h2>The Difference Is In What Other Roofers Skip</h2>
      <p class="lead">Read our reviews and the same words keep coming up: honest, thorough, meticulous, no pressure, spotless cleanup. That is not an accident — it is how the business is run.</p>
    </div>
    <div class="grid grid-3">
      ${WHY.map(([ic, t, d]) => `<div class="card">
        <span class="card__icon">${ic}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section alt-section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Recent Work</p>
      <h2>Pittsburgh Roofs We've Replaced</h2>
      <p class="lead">Aerial documentation from real jobs across the Pittsburgh metro — before, during and after.</p>
    </div>
    <div class="gallery">
      ${GALLERY.map(([f, alt, cap, sub]) => `<figure>
        <img src="assets/img/projects/${f}" alt="${esc(alt)}" width="1200" height="900" loading="lazy" decoding="async">
        <figcaption>${esc(cap)}<span>${esc(sub)}</span></figcaption>
      </figure>`).join('\n      ')}
    </div>
    <p class="text-center mt-6"><a class="btn btn--ghost" href="gallery.html">View the full gallery ${icons.arrowRight}</a></p>
  </div>
</section>

<section class="section dark-section">
  <div class="container">
    <div class="hero__grid">
      <div>
        <p class="eyebrow">How It Works</p>
        <h2 class="mb-5">Five Steps, No Surprises</h2>
        <p class="lead mb-6">Most homeowners have never bought a roof before. We make sure you understand every stage before it happens — which is exactly what our customers say they valued most.</p>
        <a class="btn btn--primary" href="contact.html">Start With A Free Inspection ${icons.arrowRight}</a>
      </div>
      <ol class="steps">
        ${STEPS.map(([t, d]) => `<li class="step"><h3>${t}</h3><p>${d}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Reviews</p>
      <h2>${esc(B.rating)} Stars Across ${B.reviewCount} Google Reviews</h2>
      <p class="lead">Every review below is a real, verified Google review from a Pittsburgh-area homeowner.</p>
    </div>
    <div class="grid grid-3">
      ${featured.map(reviewCard).join('\n      ')}
    </div>
    <p class="text-center mt-6"><a class="btn btn--ghost" href="reviews.html">Read all ${B.reviewCount} reviews ${icons.arrowRight}</a></p>
  </div>
</section>

<section class="section alt-section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Service Area</p>
      <h2>Roofing Across The Pittsburgh Metro</h2>
      <p class="lead">We work throughout Allegheny County and into Butler, Washington and Westmoreland — roughly a ${B.radiusMiles}-mile radius of Downtown Pittsburgh.</p>
    </div>
    <div class="area-links mb-6">
      ${cities.map((c) => `<a href="service-areas/${c.slug}.html">${esc(c.name)}</a>`).join('\n      ')}
    </div>
    <iframe class="map-embed" title="Map of the Top Gun Roofing service area around Pittsburgh, Pennsylvania"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-80.45%2C40.16%2C-79.55%2C40.72&amp;layer=mapnik&amp;marker=${B.lat}%2C${B.lng}"
      loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>
</section>

${T.faqSection(HOME_FAQS, { heading: 'Pittsburgh Roofing Questions, Answered', sub: 'Straight answers to what homeowners ask us most.' })}

${T.ctaBand(0)}
`;

  return {
    path: 'index.html',
    html: T.page({
      depth: 0,
      path: '/',
      title: `Top Gun Roofing LLC | Roofing Contractor in Pittsburgh, PA`,
      desc: `${B.veteranOwned ? 'Veteran-owned' : 'Locally owned'} Pittsburgh roofing contractor. Roof replacement, leak repair, storm damage and insurance claims. ${B.rating} stars, ${B.reviewCount} Google reviews. Free estimates.`,
      schema: [T.faqSchema(HOME_FAQS)],
      body,
    }),
  };
}

module.exports = { build, HOME_FAQS, GALLERY, reviewCard, STEPS, WHY };
