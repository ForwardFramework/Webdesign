const T = require('./templates.js');
const { B, services, cities, icons, esc, stars, initials } = T;
const { reviews } = require('./reviews.js');
const { GALLERY, reviewCard } = require('./pages-home.js');

/* ---------------------------------------------------------------- ABOUT -- */
const ABOUT_FAQS = [
  ['Who owns Top Gun Roofing?',
   `${B.name} is owned and operated by ${B.owner}, who personally inspects every finished roof before the crew leaves. Customers consistently describe him in reviews as honest, thorough and meticulous — and note that he is the one on site, not a salesperson who hands the job off.`],
  ['Is Top Gun Roofing licensed and insured?',
   'Yes. We are a licensed and insured roofing contractor operating in Pennsylvania. Proof of insurance is available on request before any work begins — you should ask every contractor you consider for the same.'],
  ['Is Top Gun Roofing veteran-owned?',
   'Yes. Top Gun Roofing is a veteran-owned small business serving the Pittsburgh area.'],
  ['How long has Top Gun Roofing been in business?',
   `Top Gun Roofing serves the ${B.region} area and has earned ${B.reviewCount} five-star Google reviews from local homeowners. ${B.owner} has built the business on repeat customers and referrals rather than door-knocking.`],
];

function aboutPage() {
  const values = [
    [icons.handshake, 'Integrity first', '"The definition of INTEGRITY" is how one customer put it. We would rather lose a job than sell someone something they do not need.'],
    [icons.search, 'Thorough, not fast', 'We check the things other companies do not mention — ventilation, existing layers, flashing details — because those are what fail first.'],
    [icons.camera, 'Show, do not tell', 'Photos of everything. You should never have to take a contractor at their word about what is on your roof.'],
    [icons.medal, 'No job too small', 'A single rotted soffit corner gets the same respect as a full tear-off. That is not marketing — read the reviews.'],
  ];

  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">About Us</p>
    <h1>${B.veteranOwned ? 'Veteran-Owned. ' : ''}Owner-Operated. Pittsburgh Born.</h1>
    <p>Top Gun Roofing is not a call centre with a crew attached. ${esc(B.owner)} sits down with you, gets on your roof himself, and inspects the finished work before anyone packs up.</p>
  </div>
</section>

<section class="section">
  <div class="container split-grid">
    <div class="prose">
      <p class="eyebrow">Our Story</p>
      <h2>A Roofing Company Built On Being Straight With People</h2>
      <p class="lead">Most homeowners buy one or two roofs in a lifetime. That imbalance — a contractor who does this every day talking to someone who has never done it — is where the roofing industry earns its reputation.</p>
      <p>${esc(B.owner)} built ${esc(B.name)} to work the other way around. Every inspection is free and documented with photos, so you see the actual condition of your roof rather than a description of it. Every estimate is written and itemised, so you know what each line costs and why it is there. And if your roof does not need replacing, you get told that too.</p>
      <p>That approach shows up in what customers write afterwards. They mention the things that were found that other companies never brought up. They mention the lack of pressure. They mention that the yard was left spotless. And they mention, again and again, that ${esc(B.owner)} was there — on time, every day, answering questions.</p>
      <h3>What we actually do</h3>
      <p>We are a full exterior contractor: roof replacement and repair, storm damage and insurance claim work, seamless gutters and downspouts, soffit and fascia, siding, attic ventilation and free inspections. Handling the whole envelope with one crew means the transitions — where roof meets gutter meets fascia meets wall — get done as one system instead of three separate trades stopping at their own edge.</p>
      <h3>Where we work</h3>
      <p>We serve the ${esc(B.region)} area within roughly ${B.radiusMiles} miles of Downtown Pittsburgh, covering Allegheny County and reaching into Butler, Washington and Westmoreland Counties. <a href="service-areas/index.html">See the full service area</a>.</p>
    </div>

    <div>
      <div class="rating-summary mb-5">
        <div>
          <span class="rating-summary__score">${esc(B.rating)}</span>
          <div style="margin-top:.5rem">${stars(5)}</div>
          <p style="color:var(--text-on-dark-mut);font-size:var(--fs-sm);margin-top:.5rem">${B.reviewCount} Google reviews</p>
        </div>
      </div>
      <img src="assets/img/projects/aerial-new-roof-chimneys.jpg" alt="Completed architectural shingle roof replacement with new chimney flashing on a Pittsburgh-area home" width="1200" height="900" loading="lazy" style="border-radius:var(--r-lg)">
    </div>
  </div>
</section>

<section class="section dark-section">
  <div class="container">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">What We Stand On</p>
      <h2>Four Things We Do Not Compromise</h2>
    </div>
    <div class="grid grid-4">
      ${values.map(([ic, t, d]) => `<div class="card">
        <span class="card__icon">${ic}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

${T.faqSection(ABOUT_FAQS, { alt: true, heading: 'About Top Gun Roofing' })}
${T.ctaBand(0)}
`;

  return {
    path: 'about.html',
    html: T.page({
      depth: 0, path: '/about.html',
      title: `About Top Gun Roofing LLC | ${B.veteranOwned ? 'Veteran-Owned ' : ''}Pittsburgh Roofer`,
      desc: `Meet ${B.owner} and Top Gun Roofing — a ${B.veteranOwned ? 'veteran-owned, ' : ''}owner-operated Pittsburgh roofer with ${B.rating} stars from ${B.reviewCount} Google reviews. Free inspections, honest answers.`,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about.html' }],
      schema: [
        T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'About', href: '/about.html' }]),
        T.faqSchema(ABOUT_FAQS),
        { '@type': 'AboutPage', '@id': `${B.origin}/about.html#webpage`, url: `${B.origin}/about.html`, name: 'About Top Gun Roofing LLC', about: { '@id': `${B.origin}/#organization` } },
      ],
      body,
    }),
  };
}

/* -------------------------------------------------------------- REVIEWS -- */
function reviewsPage() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Customer Reviews</p>
    <h1>${esc(B.rating)} Stars From ${B.reviewCount} Pittsburgh Homeowners</h1>
    <p>Every review on this page is a verified Google review left by a real customer. Nothing has been edited except the removal of our own replies.</p>
  </div>
</section>

<section class="section--tight section">
  <div class="container container--narrow">
    <div class="rating-summary">
      <div>
        <span class="rating-summary__score">${esc(B.rating)}</span>
        <div style="margin-top:.5rem">${stars(5)}</div>
      </div>
      <div style="text-align:left;max-width:40ch">
        <p style="color:#fff;font-weight:700;font-size:var(--fs-lg);margin-bottom:.25rem">${B.reviewCount} Google reviews</p>
        <p style="color:var(--text-on-dark-mut);font-size:var(--fs-sm)">Not a single review below five stars. The words that come up most often: honest, thorough, meticulous, no pressure, spotless cleanup.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="reviews-masonry">
      ${reviews.map(reviewCard).join('\n      ')}
    </div>
    <p class="text-center mt-6" style="color:var(--text-muted);font-size:var(--fs-sm)">
      Reviews marked with “…” were shortened by Google on its own review page. Nothing has been added or reworded.
    </p>
  </div>
</section>

${T.ctaBand(0, {
  heading: 'Want To Be The Next Five-Star Review?',
  text: `Start with a free, no-obligation inspection. ${B.owner} will show you photos of exactly what your roof needs — and what it does not.`,
})}
`;

  return {
    path: 'reviews.html',
    html: T.page({
      depth: 0, path: '/reviews.html',
      title: `Reviews | Top Gun Roofing LLC — ${B.rating} Stars, ${B.reviewCount} Google Reviews`,
      desc: `Read all ${B.reviewCount} verified Google reviews for Top Gun Roofing in Pittsburgh, PA. ${B.rating} star average for roof replacement, repair, storm damage and insurance claim work.`,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews.html' }],
      schema: [T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews.html' }])],
      body,
    }),
  };
}

/* -------------------------------------------------------------- GALLERY -- */
function galleryPage() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Our Work</p>
    <h1>Pittsburgh Roofing Project Gallery</h1>
    <p>Aerial documentation from real roof replacements across the Pittsburgh metro. We photograph every job before, during and after — these are the same photos our customers receive.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="gallery">
      ${GALLERY.map(([f, alt, cap, sub]) => `<figure>
        <img src="assets/img/projects/${f}" alt="${esc(alt)}" width="1200" height="900" loading="lazy" decoding="async">
        <figcaption>${esc(cap)}<span>${esc(sub)}</span></figcaption>
      </figure>`).join('\n      ')}
    </div>

    <div class="answer-box mt-6">
      <p><strong>Why we photograph everything.</strong> Most homeowners never see their own roof. Dated photos before, during and after mean you know exactly what was found, what was replaced, and what it looked like when we finished — whether you were home that day or not. It is also the documentation that makes an insurance claim stand up.</p>
    </div>
  </div>
</section>

${T.ctaBand(0, { heading: 'Want Your Roof To Look Like This?', text: 'Free inspection, photos of everything we find, and a written estimate with no pressure attached.' })}
`;

  return {
    path: 'gallery.html',
    html: T.page({
      depth: 0, path: '/gallery.html',
      title: 'Roofing Project Gallery | Top Gun Roofing, Pittsburgh PA',
      desc: 'Before-and-after photos of roof replacements completed by Top Gun Roofing across the Pittsburgh metro — tear-offs, shingles, gutters and trim.',
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery.html' }],
      schema: [
        T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery.html' }]),
        {
          '@type': 'ImageGallery', name: 'Top Gun Roofing project gallery',
          about: { '@id': `${B.origin}/#organization` },
          associatedMedia: GALLERY.map(([f, alt]) => ({
            '@type': 'ImageObject',
            contentUrl: `${B.origin}/assets/img/projects/${f}`,
            caption: alt, creditText: B.name,
          })),
        },
      ],
      body,
    }),
  };
}

/* -------------------------------------------------------------- CONTACT -- */
const CONTACT_FAQS = [
  ['How quickly will you get back to me?',
   `${B.owner} answers estimate requests personally, usually the same day. If it is an active leak, call ${B.phone} rather than filling in the form — we prioritise emergencies.`],
  ['Do you charge for estimates?',
   'No. Inspections and written estimates are free and carry no obligation. You get photos of what we find whether or not you hire us.'],
  ['Can I text you photos of the problem?',
   `Yes, and it genuinely helps. Text photos to ${B.phone} and we can often tell you what you are looking at before we ever come out.`],
  ['What information should I have ready?',
   'Your address, roughly how old the roof is if you know, and what you are seeing — a stain on the ceiling, missing shingles, a storm last week. None of it is required; we will figure the rest out on site.'],
];

function contactPage() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Free Estimate</p>
    <h1>Get Your Free Roof Inspection</h1>
    <p>No cost, no obligation, and no hard sell. ${esc(B.owner)} will photograph what he finds and give you a straight answer about what your roof actually needs.</p>
  </div>
</section>

<section class="section">
  <div class="container split-grid">
    ${T.quoteForm(0, { heading: 'Request Your Free Estimate', id: 'contact', level: 2, note: 'Fill this in and we will get back to you — usually the same day.' })}

    <div>
      <h2 class="mb-4">Or Reach Us Directly</h2>
      <ul class="checklist mb-6">
        <li>${icons.phone}<span><strong>Call or text ${esc(B.phone)}</strong>Fastest way to reach us. Emergencies and active leaks are prioritised.</span></li>
        <li>${icons.mail}<span><strong><a href="mailto:${B.email}">${esc(B.email)}</a></strong>Good for insurance documents and non-urgent questions.</span></li>
        <li>${icons.clock}<span><strong>Mon–Fri 7am–7pm &middot; Sat 8am–4pm</strong>Storm damage calls answered outside these hours.</span></li>
        <li>${icons.pin}<span><strong>Serving ${esc(B.region)}</strong>Allegheny County plus Butler, Washington and Westmoreland — roughly ${B.radiusMiles} miles around Downtown.</span></li>
      </ul>

      <div class="answer-box">
        <p><strong>Have an active leak?</strong> Call <a href="${B.phoneHref}" style="font-weight:800">${esc(B.phone)}</a> rather than using the form. Put a bucket under it, move what you can, and photograph the ceiling — that documentation matters if an insurance claim follows.</p>
      </div>

      <iframe class="map-embed mt-5" title="Map of the Top Gun Roofing service area around Pittsburgh, Pennsylvania"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-80.45%2C40.16%2C-79.55%2C40.72&amp;layer=mapnik&amp;marker=${B.lat}%2C${B.lng}"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>

${T.faqSection(CONTACT_FAQS, { alt: true, heading: 'Before You Get In Touch' })}
`;

  return {
    path: 'contact.html',
    html: T.page({
      depth: 0, path: '/contact.html',
      title: `Contact Top Gun Roofing | Free Roof Estimate in Pittsburgh, PA`,
      desc: `Request a free, no-obligation roof inspection and written estimate in Pittsburgh. Call ${B.phone} — ${B.owner} responds personally, usually the same day.`,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact.html' }],
      schema: [
        T.breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact.html' }]),
        T.faqSchema(CONTACT_FAQS),
        { '@type': 'ContactPage', '@id': `${B.origin}/contact.html#webpage`, url: `${B.origin}/contact.html`, name: 'Contact Top Gun Roofing', about: { '@id': `${B.origin}/#organization` } },
      ],
      body,
    }),
  };
}

/* -------------------------------------------------------------- PRIVACY -- */
function privacyPage() {
  const body = `
<section class="page-head">
  <div class="container"><h1>Privacy Policy</h1><p>How ${esc(B.name)} handles the information you send us.</p></div>
</section>
<section class="section">
  <div class="container container--narrow prose">
    <p><strong>Last updated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
    <h2>What we collect</h2>
    <p>When you submit an estimate request, we collect the name, phone number, email address, town and job description you choose to give us. We do not collect anything else, and none of it is required beyond what is marked required on the form.</p>
    <h2>How we use it</h2>
    <p>We use your information for one purpose: to respond to your request and, if you hire us, to carry out and warranty the work. We do not sell, rent or share your information with third parties for marketing.</p>
    <h2>Form handling</h2>
    <p>Estimate requests are delivered to us by a third-party form service, which processes the submission solely to pass it to our inbox.</p>
    <h2>Cookies and analytics</h2>
    <p>This site sets no advertising or tracking cookies of its own. If analytics are added in future, this policy will be updated to say so.</p>
    <h2>Your choices</h2>
    <p>Ask us at any time to delete the information you have sent, and we will. Email <a href="mailto:${B.email}">${esc(B.email)}</a> or call <a href="${B.phoneHref}">${esc(B.phone)}</a>.</p>
    <h2>Contact</h2>
    <p>${esc(B.name)}<br>Serving ${esc(B.region)}, ${esc(B.stateFull)}<br>
    <a href="${B.phoneHref}">${esc(B.phone)}</a> &middot; <a href="mailto:${B.email}">${esc(B.email)}</a></p>
  </div>
</section>`;

  return {
    path: 'privacy.html',
    html: T.page({
      depth: 0, path: '/privacy.html',
      title: `Privacy Policy | ${B.name}`,
      desc: `How Top Gun Roofing LLC collects, uses and protects the information you submit through this website.`,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy.html' }],
      body,
    }),
  };
}

/* ------------------------------------------------------------------ 404 -- */
function notFoundPage() {
  const body = `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Error 404</p>
    <h1>That Page Isn't On This Roof</h1>
    <p>The page you were looking for has moved or never existed. Here is where most people are headed.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="grid grid-3">
      <a class="card" href="/index.html"><span class="card__icon">${icons.home}</span><h3>Home</h3><p>Start over from the top.</p><span class="card__link">Go home ${icons.arrowRight}</span></a>
      <a class="card" href="/services/index.html"><span class="card__icon">${icons.grid}</span><h3>Services</h3><p>Roof replacement, repair, storm damage, gutters and more.</p><span class="card__link">See services ${icons.arrowRight}</span></a>
      <a class="card" href="/contact.html"><span class="card__icon">${icons.clipboard}</span><h3>Free Estimate</h3><p>Request a free, no-obligation roof inspection.</p><span class="card__link">Get started ${icons.arrowRight}</span></a>
    </div>
  </div>
</section>`;

  let html = T.page({
    depth: 0, path: '/404.html',
    title: 'Page Not Found | Top Gun Roofing LLC',
    desc: 'The page you requested could not be found. Browse our Pittsburgh roofing services or request a free estimate.',
    body,
  });
  // A 404 must never be indexed, and its links must be root-relative so they
  // resolve from any depth the server serves the page at.
  html = html.replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<meta name="robots" content="noindex, follow">');
  html = html.replace(/(href|src)="assets\//g, '$1="/assets/')
             .replace(/(href|src)="((?:services|service-areas)\/)/g, '$1="/$2')
             .replace(/href="(index|about|reviews|gallery|contact|privacy)\.html"/g, 'href="/$1.html"')
             .replace(/href="site\.webmanifest"/g, 'href="/site.webmanifest"');
  return { path: '404.html', html };
}

module.exports = { aboutPage, reviewsPage, galleryPage, contactPage, privacyPage, notFoundPage };
