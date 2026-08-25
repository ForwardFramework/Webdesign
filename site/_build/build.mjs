/* Renders the static pages into site/. Run: node _build/build.mjs */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { icons } from './icons.mjs';
import { biz, services, equipment, counties, process as steps, differentiators } from './content.mjs';
import { head, header, footer, ctaBand } from './chrome.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- Reusable blocks ----------------------------------------------------- */

const serviceCard = (s, i) => `
      <article class="card reveal" data-reveal-delay="${i * 70}">
        <div class="card__icon">${icons[s.icon]}</div>
        <h3>${s.title}</h3>
        <p>${s.short}</p>
        <a class="btn btn--ghost mt-6" href="services.html#${s.slug}">Details ${icons.arrow}</a>
      </article>`;

const areaBlock = () => `
      <ul class="area-list">
${counties.map(c => `        <li>${icons.pin} ${c} County</li>`).join('\n')}
      </ul>
      <p class="lede mt-6">Just outside the list? Call anyway &mdash; travel beyond these counties is arranged case by case.</p>`;

const equipmentBlock = () => `
      <ul class="equip-list">
${equipment.map(e => `        <li>${e}</li>`).join('\n')}
      </ul>`;

/* ---- Structured data ----------------------------------------------------- */

const jsonLd = () => `
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: biz.name,
  description: `${biz.tagline} providing mobile heavy equipment repair across ${biz.region}.`,
  url: biz.origin,
  telephone: `+1-724-531-7457`,
  email: biz.email,
  image: `${biz.origin}/assets/img/logo-mark.svg`,
  logo: `${biz.origin}/assets/img/logo-mark.svg`,
  slogan: biz.slogan,
  founder: { '@type': 'Person', name: biz.owner, jobTitle: biz.ownerRole },
  address: { '@type': 'PostalAddress', addressRegion: 'PA', addressCountry: 'US' },
  areaServed: counties.map(c => ({ '@type': 'AdministrativeArea', name: `${c} County, Pennsylvania` })),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Mobile equipment services',
    itemListElement: services.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.short }
    }))
  }
}, null, 2)}
</script>`;

/* ---- Pages --------------------------------------------------------------- */

const pages = {};

pages['index.html'] = `${head({
  page: 'index.html',
  title: `${biz.name} | Mobile Heavy Equipment Mechanic in ${biz.region}`,
  description: `Mobile heavy equipment repair across ${biz.region}. Diagnostics, hydraulics, engine repair, welding and preventative maintenance — on your jobsite, 24/7. Call ${biz.phone}.`,
  extraHead: jsonLd()
})}
${header('index.html')}

<main id="main">

  <section class="hero hex-field">
    <div class="container hero__inner">
      <div class="hero__grid">
        <div>
          <p class="hero__slogan"><span>${biz.slogan}</span></p>
          <h1>
            <span class="line">Mobile Heavy</span>
            <span class="line">Equipment</span>
            <span class="line line--gold">Mechanic</span>
          </h1>
          <p class="lede">When a machine goes down, the shop comes to you. ${biz.owner} brings a fully
            equipped service truck to jobsites across ${biz.region} &mdash; diagnosing and repairing
            excavators, skid steers, dozers and loaders where they sit.</p>

          <ul class="hero__points">
            <li>${icons.check} <span>On-site repair &mdash; no hauling, no tow bill, no shop queue</span></li>
            <li>${icons.check} <span>Phone answered 24/7, including nights and weekends</span></li>
            <li>${icons.check} <span>Diagnosis and repair by one mechanic, start to finish</span></li>
          </ul>

          <div class="btn-row">
            <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} Call ${biz.phone}</a>
            <a class="btn btn--ghost" href="contact.html">Request Service</a>
          </div>
        </div>

        <aside class="call-card">
          <div class="hazard hazard--thin" aria-hidden="true"></div>
          <div class="call-card__body">
            <p class="call-card__label">Machine down right now?</p>
            <a class="call-card__phone" href="${biz.phoneHref}">${biz.phone}</a>
            <p class="call-card__note">${biz.promise}</p>
            <a class="btn btn--primary btn--block" href="${biz.phoneHref}">${icons.phone} Call Now</a>
            <ul class="call-card__list">
              <li>${icons.mail} <a href="mailto:${biz.email}">${biz.email}</a></li>
              <li>${icons.pin} <span>Mobile service &mdash; ${biz.region}</span></li>
              <li>${icons.clock} <span>${biz.hours}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="trust">
    <div class="container">
      <div class="trust__grid">
        <div class="trust__item">
          <span class="trust__icon">${icons.truck}</span>
          <span><span class="trust__title">We Come To You</span><span class="trust__sub">Jobsite, shop or yard</span></span>
        </div>
        <div class="trust__item">
          <span class="trust__icon">${icons.clock}</span>
          <span><span class="trust__title">${biz.hours}</span><span class="trust__sub">Emergency calls welcome</span></span>
        </div>
        <div class="trust__item">
          <span class="trust__icon">${icons.pin}</span>
          <span><span class="trust__title">${biz.region}</span><span class="trust__sub">${counties.length} counties covered</span></span>
        </div>
        <div class="trust__item">
          <span class="trust__icon">${icons.wrench}</span>
          <span><span class="trust__title">All Makes</span><span class="trust__sub">Compact through full size</span></span>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="services">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">What We Do</p>
        <h2>Field Service That Covers The Whole Machine</h2>
        <p class="lede" style="margin-inline:auto">Five service lines that between them handle almost everything
          that stops a machine &mdash; performed on site, by the same mechanic who diagnosed it.</p>
      </div>
      <div class="grid grid--3 grid--5up">
${services.map(serviceCard).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="split">
        <div>
          <p class="eyebrow">Why Kotouch</p>
          <h2>Downtime Is The Real Cost</h2>
          <p class="lede">A machine sitting idle costs more than the repair does. Everything here is built
            around getting yours running again in the fewest hours possible &mdash; starting with the fact
            that it never has to leave your site.</p>
          <div class="stat-grid mt-6">
            <div class="stat"><div class="stat__value">24/7</div><div class="stat__label">Phone answered day, night and weekend</div></div>
            <div class="stat"><div class="stat__value">100%</div><div class="stat__label">Mobile &mdash; the truck comes to the machine</div></div>
            <div class="stat"><div class="stat__value">${counties.length}</div><div class="stat__label">Western PA counties in the service area</div></div>
          </div>
        </div>
        <ul class="check-list">
${differentiators.map(d => `          <li>${icons.check}<span><strong>${d.title}</strong><span>${d.body}</span></span></li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">How It Works</p>
        <h2>From Phone Call To Back In Service</h2>
      </div>
      <div class="grid grid--4">
${steps.map((s, i) => `        <div class="step reveal" data-reveal-delay="${i * 70}">
          <span class="step__num">${s.n}</span>
          <h3>${s.title}</h3>
          <p>${s.body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--alt" id="area">
    <div class="container">
      <div class="split split--top">
        <div>
          <p class="eyebrow">Service Area</p>
          <h2>Mobile Across ${biz.region}</h2>
          <p class="lede">Regular coverage of the counties below, with travel further out arranged case by
            case. If your machine is in the region, it is worth a phone call.</p>
          <div class="mt-6">${areaBlock()}</div>
        </div>
        <div>
          <p class="eyebrow">Equipment</p>
          <h2>Machines We Work On</h2>
          <p class="lede">Construction, excavation, landscaping and material-handling equipment &mdash;
            compact machines through full-size iron, all makes.</p>
          <div class="mt-6">${equipmentBlock()}</div>
        </div>
      </div>
    </div>
  </section>

</main>
${ctaBand('Get Your Machine Running Again', `Call ${biz.owner} directly at ${biz.phone}, any hour. Emergency breakdowns move to the front of the line.`)}
${footer()}
`;

pages['services.html'] = `${head({
  page: 'services.html',
  title: `Services | Mobile Equipment Repair &amp; Maintenance | ${biz.name}`,
  description: `Diagnostics and repair, hydraulics, engine repair, welding and fabrication, and preventative maintenance — performed on site across ${biz.region}.`
})}
${header('services.html')}

<main id="main">

  <section class="section section--tight hero hex-field">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Services</p>
        <h1>Everything We Fix,<br>Where It Sits</h1>
        <p class="lede">Five service lines, one mechanic, one truck. Each of these is performed on your
          jobsite, in your shop or in your yard &mdash; not after a haul to somebody else's bay.</p>
        <div class="btn-row mt-6">
          <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} Call ${biz.phone}</a>
          <a class="btn btn--ghost" href="contact.html">Request Service</a>
        </div>
      </div>
    </div>
  </section>

${services.map((s, i) => `
  <section class="section${i % 2 === 1 ? ' section--alt' : ''}" id="${s.slug}">
    <div class="container">
      <div class="split">
        <div>
          <div class="card__icon">${icons[s.icon]}</div>
          <p class="eyebrow">Service 0${i + 1}</p>
          <h2>${s.title}</h2>
          <p class="lede">${s.body}</p>
          <div class="btn-row mt-6">
            <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} Call About This</a>
          </div>
        </div>
        <div class="card">
          <h3>What This Covers</h3>
          <ul class="card__list">
${s.points.map(p => `            <li>${p}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`).join('\n')}

  <section class="section${services.length % 2 === 1 ? ' section--alt' : ''}">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Equipment</p>
        <h2>Machines We Work On</h2>
        <p class="lede" style="margin-inline:auto">All makes, compact through full size. If it runs on a
          jobsite and it has stopped, it is worth a call.</p>
      </div>
      ${equipmentBlock()}
    </div>
  </section>

</main>
${ctaBand('Not Sure Which One You Need?', 'Describe the symptom over the phone and we will work out what it is likely to be before anyone drives anywhere.')}
${footer()}
`;

pages['about.html'] = `${head({
  page: 'about.html',
  title: `About ${biz.owner} | ${biz.name}`,
  description: `${biz.owner}, ${biz.ownerRole} at ${biz.name} — a mobile machine mechanic keeping heavy equipment running across ${biz.region}.`
})}
${header('about.html')}

<main id="main">

  <section class="section section--tight hero hex-field">
    <div class="container">
      <div class="hero__grid">
        <div>
          <p class="eyebrow">About</p>
          <h1>One Mechanic,<br><span class="gold">One Standard</span></h1>
          <p class="lede">${biz.name} is ${biz.owner} &mdash; ${biz.ownerRole.toLowerCase()} &mdash; and a
            service truck built to handle real repairs in the field rather than just swap filters.</p>
        </div>
        <aside class="call-card">
          <div class="hazard hazard--thin" aria-hidden="true"></div>
          <div class="call-card__body">
            <p class="call-card__label">${biz.ownerRole}</p>
            <p class="call-card__phone" style="font-size:clamp(1.7rem,4vw,2.2rem)">${biz.owner}</p>
            <p class="call-card__note">${biz.promise}</p>
            <ul class="call-card__list" style="border-top:0;padding-top:0;margin-top:var(--space-4)">
              <li>${icons.phone} <a href="${biz.phoneHref}">${biz.phone}</a></li>
              <li>${icons.mail} <a href="mailto:${biz.email}">${biz.email}</a></li>
              <li>${icons.clock} <span>${biz.hours}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split">
        <div>
          <p class="eyebrow">The Approach</p>
          <h2>Built Around Your Downtime, Not Our Schedule</h2>
          <p class="lede">Contractors and equipment owners across ${biz.region} lose money the moment a
            machine stops. The traditional answer &mdash; load it, haul it, wait in line at a dealer
            &mdash; can turn a half-day repair into a week off the job.</p>
          <p class="lede">Mobile service removes most of that. The truck comes to the machine with
            diagnostic equipment, hydraulic tooling and a welder aboard, so the majority of failures get
            found and fixed in a single visit.</p>
          <p class="lede">You deal with the same person the whole way through: the one who answered the
            phone, diagnosed the fault and turned the wrenches.</p>
        </div>
        <ul class="check-list">
${differentiators.map(d => `          <li>${icons.check}<span><strong>${d.title}</strong><span>${d.body}</span></span></li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">What You Can Expect</p>
        <h2>${biz.promise}</h2>
      </div>
      <div class="grid grid--3">
        <article class="card reveal">
          <div class="card__icon">${icons.bolt}</div>
          <h3>Fast</h3>
          <p>Calls answered around the clock and emergency breakdowns prioritised. The truck arrives loaded
            for the job that was described on the phone, not for a generic service call.</p>
        </article>
        <article class="card reveal" data-reveal-delay="70">
          <div class="card__icon">${icons.shield}</div>
          <h3>Reliable</h3>
          <p>Repairs done properly the first time, with the root cause explained rather than the symptom
            cleared. If something needs watching, you are told before we leave the site.</p>
        </article>
        <article class="card reveal" data-reveal-delay="140">
          <div class="card__icon">${icons.check}</div>
          <h3>Professional</h3>
          <p>Clear pricing before the work starts, a clean work area when it finishes, and honest advice on
            whether a machine is worth the repair at all.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section" id="area">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Service Area</p>
        <h2>Where We Work</h2>
        <p class="lede">Mobile coverage across ${biz.region}, centred on the counties below.</p>
      </div>
      ${areaBlock()}
    </div>
  </section>

</main>
${ctaBand('Talk To The Mechanic Directly', `No call centre and no service writer. ${biz.phone} reaches ${biz.owner}.`)}
${footer()}
`;

const URGENCY = ['Emergency — down now', 'Same week', 'Scheduled maintenance', 'Just getting a quote'];

pages['contact.html'] = `${head({
  page: 'contact.html',
  title: `Contact | ${biz.phone} | ${biz.name}`,
  description: `Call ${biz.phone} or email ${biz.email} for mobile heavy equipment repair across ${biz.region}. Available 24/7 for breakdowns.`
})}
${header('contact.html')}

<main id="main">

  <section class="section section--tight hero hex-field">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Contact</p>
        <h1>Machine Down?<br><span class="gold">Call First.</span></h1>
        <p class="lede">A phone call is always the fastest route &mdash; especially out of hours. Use the
          form below for quotes, scheduled maintenance and non-urgent work.</p>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="contact-grid">

        <div>
          <h2>Direct Details</h2>
          <ul class="contact-list mt-6">
            <li>
              <span class="contact-list__icon">${icons.phone}</span>
              <div>
                <span class="contact-list__label">Phone</span>
                <span class="contact-list__value"><a href="${biz.phoneHref}">${biz.phone}</a></span>
                <small>Call or text &mdash; answered 24/7</small>
              </div>
            </li>
            <li>
              <span class="contact-list__icon">${icons.mail}</span>
              <div>
                <span class="contact-list__label">Email</span>
                <span class="contact-list__value"><a href="mailto:${biz.email}">${biz.email}</a></span>
                <small>Best for quotes and scheduling</small>
              </div>
            </li>
            <li>
              <span class="contact-list__icon">${icons.pin}</span>
              <div>
                <span class="contact-list__label">Service Area</span>
                <span class="contact-list__value">${biz.region}</span>
                <small>Fully mobile &mdash; we come to your site</small>
              </div>
            </li>
            <li>
              <span class="contact-list__icon">${icons.clock}</span>
              <div>
                <span class="contact-list__label">Hours</span>
                <span class="contact-list__value">${biz.hours}</span>
                <small>Emergency breakdown calls prioritised</small>
              </div>
            </li>
          </ul>

          <div class="btn-row mt-6">
            <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} Call Now</a>
          </div>

          <h3 style="margin-top:var(--space-8)">Counties Covered</h3>
          <div class="mt-6">${areaBlock()}</div>
        </div>

        <div class="form-card">
          <h2>Request Service</h2>
          <p class="lede">Fill this in and we will come back to you with next steps. For a machine that is
            down right now, call ${biz.phone} instead.</p>

          <form id="quote-form" novalidate class="mt-6">
            <div class="form-row">
              <div class="field">
                <label for="f-name">Name <span class="req" aria-hidden="true">*</span></label>
                <input id="f-name" aria-describedby="f-name-error" name="name" type="text" autocomplete="name" required>
                <span class="error" role="alert" id="f-name-error"></span>
              </div>
              <div class="field">
                <label for="f-phone">Phone <span class="req" aria-hidden="true">*</span></label>
                <input id="f-phone" aria-describedby="f-phone-error" name="phone" type="tel" autocomplete="tel" required>
                <span class="error" role="alert" id="f-phone-error"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="field">
                <label for="f-email">Email</label>
                <input id="f-email" aria-describedby="f-email-error" name="email" type="email" autocomplete="email">
                <span class="error" role="alert" id="f-email-error"></span>
              </div>
              <div class="field">
                <label for="f-location">Machine Location <span class="req" aria-hidden="true">*</span></label>
                <input id="f-location" aria-describedby="f-location-error" name="location" type="text" placeholder="Town or jobsite address" required>
                <span class="error" role="alert" id="f-location-error"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="field">
                <label for="f-service">Service Needed <span class="req" aria-hidden="true">*</span></label>
                <select id="f-service" aria-describedby="f-service-error" name="service" required>
                  <option value="">Choose one&hellip;</option>
${services.map(s => `                  <option>${s.title}</option>`).join('\n')}
                  <option>Not sure / other</option>
                </select>
                <span class="error" role="alert" id="f-service-error"></span>
              </div>
              <div class="field">
                <label for="f-urgency">Urgency <span class="req" aria-hidden="true">*</span></label>
                <select id="f-urgency" aria-describedby="f-urgency-error" name="urgency" required>
                  <option value="">Choose one&hellip;</option>
${URGENCY.map(u => `                  <option>${u}</option>`).join('\n')}
                </select>
                <span class="error" role="alert" id="f-urgency-error"></span>
              </div>
            </div>

            <div class="field" style="margin-bottom:var(--space-4)">
              <label for="f-equipment">Equipment</label>
              <input id="f-equipment" aria-describedby="f-equipment-hint" name="equipment" type="text" placeholder="Make, model and year if known">
              <span class="hint" id="f-equipment-hint">For example: Cat 305 mini excavator, 2019.</span>
            </div>

            <div class="field" style="margin-bottom:var(--space-4)">
              <label for="f-details">What Is It Doing? <span class="req" aria-hidden="true">*</span></label>
              <textarea id="f-details" aria-describedby="f-details-error" name="details" required placeholder="Symptoms, warning lights, fault codes, when it started&hellip;"></textarea>
              <span class="error" role="alert" id="f-details-error"></span>
            </div>

            <div class="hp" aria-hidden="true">
              <label for="f-company">Company (leave blank)</label>
              <input id="f-company" name="company" type="text" tabindex="-1" autocomplete="off">
            </div>

            <button class="btn btn--primary btn--block" type="submit">Send Request ${icons.arrow}</button>
            <p class="form-note">Submitting opens your email app with the details filled in, addressed to
              ${biz.email}. Prefer to talk? Call ${biz.phone}.</p>
            <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
          </form>
        </div>

      </div>
    </div>
  </section>

</main>
${ctaBand('Emergency Breakdown?', `Do not wait on email. ${biz.phone} is answered 24/7 and breakdown calls go to the front of the queue.`)}
${footer()}
`;

pages['404.html'] = `${head({
  page: '404.html',
  title: `Page Not Found | ${biz.name}`,
  description: `That page does not exist. Call ${biz.phone} for mobile equipment service across ${biz.region}.`
})}
${header('')}

<main id="main">
  <section class="section hero hex-field">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Error 404</p>
        <h1>This Page<br><span class="gold">Threw A Code</span></h1>
        <p class="lede" style="margin-inline:auto">The page you were after is not here. The phone still
          works, though &mdash; and that is usually faster anyway.</p>
        <div class="btn-row mt-6" style="justify-content:center">
          <a class="btn btn--primary" href="${biz.phoneHref}">${icons.phone} Call ${biz.phone}</a>
          <a class="btn btn--ghost" href="index.html">Back To Home</a>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
`;

/* ---- Write --------------------------------------------------------------- */
for (const [name, html] of Object.entries(pages)) {
  writeFileSync(join(OUT, name), html.trimStart() + '\n', 'utf8');
  console.log('wrote', name, html.length, 'bytes');
}

/* robots.txt + sitemap.xml */
writeFileSync(join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${biz.origin}/sitemap.xml\n`, 'utf8');

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.keys(pages).filter(p => p !== '404.html').map(p =>
    `  <url>\n    <loc>${biz.origin}/${p === 'index.html' ? '' : p}</loc>\n` +
    `    <lastmod>${today}</lastmod>\n    <priority>${p === 'index.html' ? '1.0' : '0.8'}</priority>\n  </url>`
  ).join('\n') + `\n</urlset>\n`, 'utf8');
console.log('wrote robots.txt, sitemap.xml');
