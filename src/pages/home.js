const { business: B, services, reviews, gallery, faqs } = require('../data/site.js');
const { esc, telHref, stars, I, cityState } = require('../templates/layout.js');
const C = require('../templates/components.js');
const { page, abs } = require('../templates/shell.js');

module.exports = function home() {
  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${esc(cityState)} Roofing Contractor</span>
      <h1><span class="hl">Roofs Built Tough.</span><br>Service Done Right.</h1>
      <div class="rating-inline">
        ${stars()} <b>${B.ratingValue}</b>
        <span>from ${B.reviewCount} verified customer recommendations</span>
      </div>
      <p class="lede">
        Roof replacement, leak repair, and storm damage restoration across ${esc(cityState)} and the
        surrounding counties &mdash; done by a crew that gets on your roof, shows you the photos,
        and tells you the truth about what it needs.
      </p>
      <ul class="hero-points">
        <li>${I.check}<span><strong>Free inspection with photos</strong> &mdash; you keep them whether or not you hire us</span></li>
        <li>${I.check}<span><strong>Written, line-item estimates</strong> &mdash; no pressure, no same-day-only pricing</span></li>
        <li>${I.check}<span><strong>Insurance claims handled properly</strong> &mdash; we meet your adjuster on the roof</span></li>
        <li>${I.check}<span><strong>24/7 emergency tarping</strong> &mdash; we stop the water first, diagnose after</span></li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="${telHref}">${I.phone} Call or Text ${esc(B.phone)}</a>
        <a class="btn btn--ghost btn--lg" href="#estimate">Get a Free Estimate</a>
      </div>
    </div>

    <div class="quote-card" id="estimate">
      <h2>Free Roof Estimate</h2>
      <p class="small">Tell us what is going on. We usually reply the same business day.</p>
      ${C.quoteForm({ id: 'home-estimate' })}
    </div>
  </div>
</section>

${C.trustbar()}

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">What we do</span>
      <h2>Everything above your walls, done to spec</h2>
      <p class="lede">Roofing is the whole system &mdash; deck, underlayment, flashing, shingles, ventilation,
      and the gutters that carry the water away. We build all of it, and we build it in the right order.</p>
    </div>
    ${C.serviceGrid()}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <span class="eyebrow">Straight answers</span>
        <h2 style="margin-top:0">Who is Roughneck Roofing?</h2>
        ${C.answerBox('The short answer',
          `${B.name} is a licensed and insured roofing contractor serving ${cityState} and the surrounding counties. We handle asphalt shingle roof replacement, leak and flashing repair, storm and hail damage with insurance claim documentation, seamless gutters, siding, and commercial flat roofing. Inspections and written estimates are free, and we hold a ${B.ratingValue}-star rating from ${B.reviewCount} customer recommendations.`)}

        <h2>Why homeowners here hire us</h2>
        <p>Most people calling a roofer are not roofing experts, and the industry knows it. Our whole
        approach is built on removing that asymmetry: you see what we see, you get it in writing, and
        you decide without anyone standing in your kitchen waiting for a signature.</p>
        <ul class="checklist">
          <li>${I.checkPlain}<span><strong>We show you the photos.</strong> Every inspection comes with pictures of what is actually happening on your roof and in your attic &mdash; not a stock-photo brochure.</span></li>
          <li>${I.checkPlain}<span><strong>We will tell you not to buy.</strong> If your roof has years of life left, that is what we will say. A repair we know will hold beats a replacement you did not need.</span></li>
          <li>${I.checkPlain}<span><strong>We do not shingle-over.</strong> Layering new shingles on old hides rotted decking, traps heat, and voids most manufacturer warranties. Full tear-off, every time.</span></li>
          <li>${I.checkPlain}<span><strong>Ventilation is part of the job.</strong> Unbalanced attic airflow is the single most common defect we find, and it is what quietly takes years off a roof.</span></li>
          <li>${I.checkPlain}<span><strong>We clean up like it is our own yard.</strong> Magnetic sweep across lawn, drive, and street &mdash; twice &mdash; before we call a job finished.</span></li>
          <li>${I.checkPlain}<span><strong>We keep insurance claims honest.</strong> We document damage thoroughly and we never offer to absorb your deductible, because that is fraud.</span></li>
        </ul>
      </div>

      <div class="sticky-aside">
        <div class="aside-card">
          <h3>Have an active leak?</h3>
          <p>We tarp 24/7 to stop water entry, then diagnose once conditions allow. Do not wait for the ceiling to open up.</p>
          <a class="btn btn--primary btn--block" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
        </div>
        <div class="aside-card">
          <h3>Storm went through?</h3>
          <p>Wind and hail damage is usually invisible from the ground, and most policies close the claim window one year after the storm date.</p>
          <a class="btn btn--ghost btn--block" href="/services/storm-damage-insurance-claims/">Storm damage &amp; claims ${I.arrow}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">How it works</span>
      <h2>Five steps, no surprises</h2>
    </div>
    <ol class="steps steps--row">
      <li><h4>Call or request online</h4><p>Tell us what is going on. Emergencies get tarped the same day.</p></li>
      <li><h4>Free inspection</h4><p>On the roof and in the attic. We photograph everything we find.</p></li>
      <li><h4>Written estimate</h4><p>Line-item scope, materials, and price. Yours to think about.</p></li>
      <li><h4>We build it</h4><p>Most homes torn off and re-roofed in one to two days. Never left open overnight.</p></li>
      <li><h4>Walkthrough</h4><p>Double magnetic sweep, debris hauled, and a final walk with you.</p></li>
    </ol>
  </div>
</section>

<section class="section section--deep">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">Recent work</span>
      <h2>Roofs we have built around ${esc(B.city)}</h2>
      <p class="lede">Tear-offs, valleys, flashing details, and finished roofs. Click any photo to enlarge.</p>
    </div>
    ${C.galleryGrid(gallery.slice(0, 6))}
    <div class="btn-row" style="justify-content:center;margin-top:2rem">
      <a class="btn btn--ghost" href="/gallery/">See the full gallery ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">What customers say</span>
      <h2>${B.ratingValue} stars from ${B.reviewCount} recommendations</h2>
      <p class="lede">Every review below is a verified recommendation left on our Facebook page &mdash; unedited.</p>
    </div>
    ${C.reviewsGrid(reviews.slice(0, 6))}
    <div class="btn-row" style="justify-content:center;margin-top:.5rem">
      <a class="btn btn--ghost" href="/reviews/">Read all reviews ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">Where we work</span>
      <h2>Serving ${esc(cityState)} and ${B.serviceRadiusMiles} miles around it</h2>
      <p class="lede">Allegheny, Butler, Beaver, Washington, and Westmoreland counties. Not sure if you are in range? Call and ask.</p>
    </div>
    ${C.areaCloud()}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap-narrow">
    <div class="section-head center">
      <span class="eyebrow">Common questions</span>
      <h2>Roofing questions, answered</h2>
    </div>
    ${C.faqBlock(faqs.slice(0, 8).map(f => [f.q, f.a]))}
    <div class="btn-row" style="justify-content:center;margin-top:2rem">
      <a class="btn btn--ghost" href="/faq/">All frequently asked questions ${I.arrow}</a>
    </div>
  </div>
</section>

${C.ctaBand()}`;

  return page({
    path: '/',
    title: `Roofing Contractor in ${cityState} | ${B.name}`,
    desc: `Licensed, insured roofing contractor in ${cityState}. Roof replacement, leak repair, storm damage claims, gutters, and siding. Free photo-documented inspection.`,
    faqs: faqs.slice(0, 8).map(f => [f.q, f.a]),
    body
  });
};
