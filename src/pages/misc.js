const { business: B, services, reviews, areas, gallery, faqs, posts } = require('../data/site.js');
const { esc, telHref, stars, I, cityState } = require('../templates/layout.js');
const C = require('../templates/components.js');
const { page, abs, D } = require('../templates/shell.js');

/* =========================== ABOUT ======================================= */
const about = () => page({
  path: '/about/',
  title: `About ${B.name} | ${cityState} Roofing Contractor`,
  desc: `${B.name} is a licensed and insured roofing contractor serving ${cityState}. How we work, what we stand behind, and why we show you the photos.`,
  crumbs: [{ label: 'About' }],
  pageType: 'AboutPage',
  head: `<h1>About Roughneck Roofing</h1>
    <p class="lede">A roofing company built on the idea that homeowners deserve to see what we see.</p>`,
  body: `
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <p class="lede">Roofing has a trust problem, and it is not hard to see why. The product sits
      twenty feet in the air where nobody can inspect it, the work is finished in a day or two, and the
      difference between a roof built correctly and one built fast does not show up for five years.</p>

      <p>Roughneck Roofing was built around closing that gap. We photograph what we find and hand you
      the pictures. We write estimates line by line so you can compare them honestly against anyone
      else's. And we tell people not to buy roofs when they do not need them, which costs us jobs in the
      short run and is the entire reason our customers send their neighbours.</p>

      <h2>What we actually stand behind</h2>
      <ul class="checklist">
        <li>${I.checkPlain}<span><strong>Full tear-off, always.</strong> We do not shingle-over. It hides rotted decking, traps heat that shortens the new roof's life, and voids most manufacturer warranties.</span></li>
        <li>${I.checkPlain}<span><strong>The whole system, not just the shingle.</strong> Ice-and-water shield, synthetic underlayment, new flashing, and balanced ventilation. The shingle is the part you see; the rest is what keeps water out.</span></li>
        <li>${I.checkPlain}<span><strong>New flashing, every time.</strong> Reusing old step and counter flashing is the single most common corner cut in this trade, and it is why so many "new" roofs leak at the chimney.</span></li>
        <li>${I.checkPlain}<span><strong>Ventilation math, not guesswork.</strong> Intake and exhaust sized to your attic square footage. Get this wrong and the best shingle on the market still fails early.</span></li>
        <li>${I.checkPlain}<span><strong>Honest insurance work.</strong> We document damage thoroughly and meet your adjuster on the roof. We never offer to absorb a deductible &mdash; that is fraud, and a contractor willing to commit it for you will happily commit it against you.</span></li>
        <li>${I.checkPlain}<span><strong>Cleanup you would accept in your own yard.</strong> Two magnetic sweeps of lawn, driveway, and street. Find a nail afterward and we come back out.</span></li>
      </ul>

      <h2>Licensed, insured, and local</h2>
      <p>We carry general liability and workers compensation coverage and are registered as a home
      improvement contractor in Pennsylvania. We will send certificates before work starts &mdash; and you
      should ask that of every contractor you consider, not just us. If an uninsured crew is hurt on
      your roof, the exposure can land on your homeowners policy.</p>
      <p>Local matters here for a practical reason. Storm-chasing outfits follow weather into a region,
      sell hard for a season, and are gone before anyone tries to make a warranty claim. We answer the
      phone at ${esc(B.phone)} in three years because we live here.</p>

      <h2>What our customers say about the experience</h2>
      <p>Nine straight recommendations, and the same words keep coming up: professional, punctual,
      explained everything, cleaned up. That is not an accident &mdash; it is the whole business plan.</p>
    </div>

    <div class="sticky-aside">
      <div class="aside-card">
        <h3>${B.ratingValue} stars &middot; ${B.reviewCount} reviews</h3>
        <p>Verified recommendations from our Facebook page, unedited.</p>
        <a class="btn btn--ghost btn--block" href="/reviews/">Read them all ${I.arrow}</a>
      </div>
      <div class="aside-card">
        <h3>Free estimate</h3>
        <p>Photos of everything we find and a written price. No pressure attached.</p>
        <a class="btn btn--primary btn--block" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
      </div>
    </div>
  </div>
</section>

${C.trustbar()}

<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">What we do</span><h2>Our services</h2></div>
    ${C.serviceGrid()}
  </div>
</section>

${C.ctaBand()}`
});

/* =========================== GALLERY ===================================== */
const galleryPage = () => page({
  path: '/gallery/',
  title: `Roofing Project Gallery | ${cityState} | ${B.name}`,
  desc: `Photos of completed roof replacements, repairs, flashing details, gutters, and siding by ${B.name} in ${cityState} and surrounding areas.`,
  crumbs: [{ label: 'Our Work' }],
  pageType: 'CollectionPage',
  head: `<h1>Our Work</h1>
    <p class="lede">Tear-offs, valleys, flashing details, and finished roofs from around ${esc(cityState)}. Click any photo to enlarge.</p>`,
  schema: [{
    '@type': 'ImageGallery', '@id': D + '/gallery/#gallery',
    name: `${B.name} project gallery`,
    associatedMedia: gallery.map(g => ({
      '@type': 'ImageObject', contentUrl: abs('/assets/photos/' + g.file),
      caption: g.alt, creditText: B.name
    }))
  }],
  body: `
<section class="section">
  <div class="wrap">${C.galleryGrid()}</div>
</section>

<section class="section section--alt">
  <div class="wrap wrap-narrow prose">
    <h2 style="margin-top:0">What to look for in a finished roof</h2>
    <p>Photos of a completed roof mostly show you the shingle, which is the part least likely to fail.
    If you are comparing contractors, these are the details worth asking about &mdash; they are what
    separates a roof that lasts its rated life from one that does not:</p>
    <ul class="checklist">
      <li>${I.checkPlain}<span><strong>Valleys.</strong> Woven or closed-cut over new valley metal, with no nails driven through the centre.</span></li>
      <li>${I.checkPlain}<span><strong>Chimney flashing.</strong> Step flashing woven into each shingle course with counter flashing cut into the mortar &mdash; not a bead of caulk.</span></li>
      <li>${I.checkPlain}<span><strong>Drip edge.</strong> Present at both eaves and rakes, installed in the correct order relative to underlayment.</span></li>
      <li>${I.checkPlain}<span><strong>Ridge line.</strong> Straight, with continuous ridge vent and matching cap shingles.</span></li>
      <li>${I.checkPlain}<span><strong>Pipe boots.</strong> New collars on every penetration. Reused boots are a leak on a countdown.</span></li>
    </ul>
    <p>Ask any contractor to show you photos of those five things on a job they finished. The answer
    tells you most of what you need to know.</p>
  </div>
</section>

${C.ctaBand('Want your roof in this gallery?', `Free inspection and a written estimate. Call or text ${B.phone}.`)}`
});

/* =========================== REVIEWS ===================================== */
const reviewsPage = () => page({
  path: '/reviews/',
  title: `Customer Reviews | ${B.ratingValue} Stars | ${B.name} ${cityState}`,
  desc: `Read all ${B.reviewCount} verified customer recommendations for ${B.name} in ${cityState}. ${B.ratingValue} out of 5 stars for roof replacement, repair, and storm damage work.`,
  crumbs: [{ label: 'Reviews' }],
  pageType: 'CollectionPage',
  head: `<h1>Customer Reviews</h1>
    <div class="rating-inline" style="margin-top:1.25rem">${stars()} <b>${B.ratingValue}</b>
      <span>from ${B.reviewCount} verified recommendations on Facebook</span></div>
    <p class="lede">Every review below is reproduced exactly as the customer wrote it.</p>`,
  body: `
<section class="section">
  <div class="wrap">
    ${C.reviewsGrid()}
    <div class="btn-row" style="justify-content:center;margin-top:2rem">
      <a class="btn btn--ghost" href="${B.facebook}" target="_blank" rel="noopener">${I.facebook} See them on Facebook</a>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap-narrow prose">
    <h2 style="margin-top:0">Why the same three things keep coming up</h2>
    <p>Read enough of these and a pattern emerges: <strong>they explained everything</strong>,
    <strong>they showed up when they said they would</strong>, and <strong>they cleaned up</strong>.
    None of those is about shingles. They are about the parts of a roofing job a homeowner can actually
    evaluate &mdash; which is precisely why we treat them as the job rather than as extras.</p>
    <p>The craftsmanship matters more, and it is the part you have to take on faith for the first five
    years. That is why we photograph the deck, the flashing, and the ventilation before they disappear
    under the shingles, and why you keep those photos.</p>
    <h2>Had us out? We would appreciate the review.</h2>
    <p>Recommendations on <a href="${B.facebook}" target="_blank" rel="noopener">our Facebook page</a>
    are how most of our neighbours find us. It takes a minute and it genuinely matters to a local crew.</p>
  </div>
</section>

${C.ctaBand()}`
});

/* =========================== FAQ ========================================= */
function faqPage() {
  const groups = [...new Set(faqs.map(f => f.g))];
  return page({
    path: '/faq/',
    title: `Roofing FAQ | Costs, Timelines & Insurance | ${B.name}`,
    desc: `Answers to the questions ${cityState} homeowners ask most: what a roof costs, how long it takes, how insurance claims work, warranties, and winter installation.`,
    crumbs: [{ label: 'FAQ' }],
    faqs: faqs.map(f => [f.q, f.a]),
    head: `<h1>Frequently Asked Questions</h1>
      <p class="lede">Straight answers about cost, timelines, insurance, materials, and what we will and will not do.</p>`,
    body: `
<section class="section">
  <div class="wrap wrap-narrow">
    ${groups.map(g => `
      <h2 class="faq-group-title">${esc(g)}</h2>
      ${C.faqBlock(faqs.filter(f => f.g === g).map(f => [f.q, f.a]))}`).join('')}
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap-narrow center">
    <h2>Still have a question?</h2>
    <p class="lede" style="margin:1rem auto 2rem">Call or text and you will get a person, not a phone tree.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--primary btn--lg" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
      <a class="btn btn--ghost btn--lg" href="/contact/">Ask online</a>
    </div>
  </div>
</section>`
  });
}

/* =========================== CONTACT ===================================== */
const contact = () => page({
  path: '/contact/',
  title: `Free Roof Estimate in ${cityState} | Contact ${B.name}`,
  desc: `Request a free, photo-documented roof inspection and written estimate in ${cityState}. Call or text ${B.phone}, or send the form. 24/7 emergency tarping.`,
  crumbs: [{ label: 'Contact' }],
  pageType: 'ContactPage',
  head: `<h1>Get Your Free Estimate</h1>
    <p class="lede">Photo-documented inspection, a written line-item price, and no pressure attached to either.</p>`,
  body: `
<section class="section">
  <div class="wrap split">
    <div>
      <div class="quote-card">
        <h2>Tell us about your roof</h2>
        <p class="small">We usually reply the same business day. Emergencies &mdash; call instead, we answer.</p>
        ${C.quoteForm({ id: 'contact' })}
      </div>
    </div>

    <div class="sticky-aside">
      <div class="aside-card">
        <h3>Call or text</h3>
        <p>Fastest way to reach us, especially for an active leak.</p>
        <a class="btn btn--primary btn--block btn--lg" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
      </div>
      <div class="aside-card">
        <h3>Details</h3>
        <address class="info-list">
          <div>${I.mail}<a href="mailto:${esc(B.email)}">${esc(B.email)}</a></div>
          <div>${I.pin}<span>Serving ${esc(cityState)} and ${B.serviceRadiusMiles} miles around it</span></div>
          <div>${I.clock}<span>${esc(B.hoursLabel)}</span></div>
          <div>${I.facebook}<a href="${B.facebook}" target="_blank" rel="noopener">Roughneck Roofing on Facebook</a></div>
        </address>
      </div>
      <div class="aside-card">
        <h3>What happens next</h3>
        <ol class="steps" style="gap:.9rem">
          <li><h4>We call you back</h4><p>Same business day in almost every case.</p></li>
          <li><h4>We inspect</h4><p>On the roof and in the attic, with photos.</p></li>
          <li><h4>You get it in writing</h4><p>Line-item estimate. Yours to think about.</p></li>
        </ol>
      </div>
    </div>
  </div>
</section>

${C.trustbar()}`
});

/* =========================== THANK YOU / 404 ============================= */
const thankYou = () => page({
  path: '/thank-you/',
  title: `Thank You | ${B.name}`,
  desc: 'Your request reached us. We will be in touch shortly.',
  noindex: true,
  body: `
<section class="section err-page">
  <div class="wrap wrap-narrow">
    <span class="card-icon" style="margin:0 auto 1.5rem">${I.check}</span>
    <h1>Got it &mdash; thank you.</h1>
    <p class="lede" style="margin:1.25rem auto 2rem;max-width:52ch">
      Your request is in. We usually reply the same business day. If this is an active leak or storm
      damage, call us directly and we will move it to the front of the line.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--primary btn--lg" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
      <a class="btn btn--ghost btn--lg" href="/">Back to home</a>
    </div>
    <div style="margin-top:3rem">
      <p class="muted small">While you wait &mdash; a few things worth reading:</p>
      <div class="btn-row" style="justify-content:center;margin-top:1rem">
        ${posts.slice(0, 3).map(p => `<a class="btn btn--ghost btn--sm" href="/resources/${p.slug}/">${esc(p.title)}</a>`).join('')}
      </div>
    </div>
  </div>
</section>`
});

const notFound = () => page({
  path: '/404.html',
  title: `Page Not Found | ${B.name}`,
  desc: 'That page does not exist.',
  noindex: true,
  body: `
<section class="section err-page">
  <div class="wrap wrap-narrow">
    <div class="code">404</div>
    <h1 style="margin-top:1rem">This page slid off the roof.</h1>
    <p class="lede" style="margin:1.25rem auto 2rem;max-width:48ch">
      The page you were after is not here. The roof, thankfully, still is.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--primary btn--lg" href="/">Back to home</a>
      <a class="btn btn--ghost btn--lg" href="/services/">Browse services</a>
      <a class="btn btn--ghost btn--lg" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
    </div>
  </div>
</section>`
});

module.exports = { about, galleryPage, reviewsPage, faqPage, contact, thankYou, notFound };
