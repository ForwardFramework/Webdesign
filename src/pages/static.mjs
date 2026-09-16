import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities } from '../../data/areas.mjs';
import { icon } from '../templates/icons.mjs';
import { esc, pageTitle, crumbs, ctaBand, faqList, quickForm, detailedForm, galleryGrid, galleryEmpty, trustBar } from '../templates/ui.mjs';
import { gallery } from '../../data/gallery.mjs';
import { businessNode, websiteNode, webPageNode, breadcrumbNode, faqNode } from '../templates/schema.mjs';
import { homeFaqs } from './home.mjs';

const base = (path, trail) => [
  businessNode(),
  websiteNode(),
  webPageNode({ path, title: '', description: '', trail }),
  breadcrumbNode(trail),
];

/* ============================== /about/ ============================== */
export function aboutPage() {
  const path = '/about/';
  const title = pageTitle('About Us');
  const description = `Who we are, how we build, and what you get in writing — a licensed, insured concrete, excavation and landscaping contractor serving ${site.region}.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'About', url: path }];

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">About us</span>
      <h1>Built to Last Isn&rsquo;t a Slogan, It&rsquo;s the Spec</h1>
      <p class="phero__lede">
        Booth&rsquo;s Contracting is a ${esc(site.region)} concrete, excavation and landscaping
        contractor. We do the dirt work and the pour with the same crew, we put the price in writing
        before we start, and we build to a standard that outlives the warranty.
      </p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="/contact/">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="about-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap">
    <div class="split split--wide-left" style="align-items:start;">
      <div class="prose">
        <h2 class="mt-0">One crew, three trades, no finger-pointing</h2>
        <p>
          Most outdoor projects are really three jobs stacked on top of each other: something has to be
          dug out and graded, something has to be poured or built, and something has to be put back so
          the property does not look like a construction site. Hire three companies and you become the
          project manager &mdash; chasing schedules, paying twice for mobilization, and listening to each
          one explain that the problem is the other one&rsquo;s fault.
        </p>
        <p>
          We run all three in-house. The same people who set the grade pour the concrete and seed the
          lawn back. That is not a marketing angle; it is the reason our slabs sit on a base that was
          actually compacted and our jobs finish in days instead of seasons.
        </p>

        <h2>What we will always do</h2>
        <ul class="checklist">
          <li><span><strong>Show up to the estimate.</strong> If we say Tuesday at four, we are there Tuesday at four &mdash; or you get a call before four.</span></li>
          <li><span><strong>Put it in writing.</strong> Scope, thickness, base depth, reinforcement, finish, timeline, price. One number, not a range that grows.</span></li>
          <li><span><strong>Build the part you can&rsquo;t see.</strong> Compacted stone, drainage, footers below frost, control joints. The invisible half is what fails.</span></li>
          <li><span><strong>Clean up.</strong> Debris hauled off, ruts raked out, disturbed ground topsoiled and seeded before we call it done.</span></li>
          <li><span><strong>Tell you the truth.</strong> Including when the cheaper fix is the right one, and when the job you asked for is not the job you need.</span></li>
        </ul>

        <h2>What we will never do</h2>
        <ul class="checklist">
          <li><span>Quote a firm price over the phone without seeing the property.</span></li>
          <li><span>Pour concrete over dirt, unstable fill or an uncompacted base to save a day.</span></li>
          <li><span>Sell an overlay on a driveway that needs replacing.</span></li>
          <li><span>Take a large deposit and disappear onto another job.</span></li>
          <li><span>Leave your lawn as ruts and your street as a staging area.</span></li>
        </ul>

        <h2>Licensed, insured, and happy to prove it</h2>
        <p>
          Booth&rsquo;s Contracting carries general liability insurance and workers&rsquo; compensation
          coverage and is registered as a Pennsylvania Home Improvement Contractor. You get a
          certificate of insurance with your estimate without having to ask. Any contractor who
          hesitates when you ask for one is telling you something important.
        </p>

        <h2>Residential and commercial</h2>
        <p>
          The bulk of our work is residential &mdash; driveways, patios, steps, pads and the site work
          that goes under them. We also handle commercial sidewalks and ADA ramps, dumpster and loading
          pads, parking area preparation, and site work subcontracted for builders and property
          managers across ${esc(site.region)}.
        </p>
      </div>

      <aside style="position:sticky;top:calc(var(--header-h) + 1.5rem);">
        ${quickForm({ heading: 'Talk to us directly', sub: 'No call center, no lead broker. Your message comes straight to us.', id: 'about' })}
      </aside>
    </div>
  </div>
</section>

<section class="section section--grit section--tight">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Our standards</span>
      <h2>The numbers we build to</h2>
    </div>
    <div class="stat-row">
      <div class="stat center"><strong>4,000</strong><span>PSI air-entrained mix on exterior pours</span></div>
      <div class="stat center"><strong>4&ndash;6&Prime;</strong><span>Compacted stone base under every slab</span></div>
      <div class="stat center"><strong>36&Prime;</strong><span>Minimum footer depth, below frost line</span></div>
      <div class="stat center"><strong>1/8&Prime;</strong><span>Minimum fall per foot away from the house</span></div>
      <div class="stat center"><strong>24 hrs</strong><span>Control joints saw-cut within one day</span></div>
    </div>
  </div>
</section>

${ctaBand()}`;

  return { path, title, description, body, schema: base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, name: title, description } : n)) };
}

/* ============================== /gallery/ ============================== */
export function galleryPage() {
  const path = '/gallery/';
  const title = pageTitle('Project Gallery');
  const description = `Driveways, patios, sidewalks, steps, pads, excavation and hardscaping completed across ${site.region}. See the work, then get your free estimate.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Our Work', url: path }];

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">Our work</span>
      <h1>Project Gallery</h1>
      <p class="phero__lede">
        Finished work across ${esc(site.region)}. Every one of these has an address, and we are glad
        to give you a couple you can drive past before you decide.
      </p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="/contact/">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="${site.social.facebook}" rel="noopener">${icon('facebook', 18)} More on Facebook</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${gallery.length ? galleryGrid(gallery) : galleryEmpty()}
    <p class="note center" style="margin-top:2rem;">
      Looking for something specific &mdash; a stamped pattern, a driveway on a slope, a commercial pad?
      ${icon('phone', 14)} <a href="tel:${site.phoneHref}" data-loc="gallery">Call ${esc(site.phoneDisplay)}</a> and we will send photos of a job like yours.
    </p>
  </div>
</section>

${ctaBand({ heading: 'Want yours to look like this?', text: 'Free on-site estimate and a fixed written price. Most projects are scheduled within two to four weeks.' })}`;

  return { path, title, description, body, schema: base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, '@type': 'CollectionPage', name: title, description } : n)) };
}

/* ============================== /faq/ ============================== */
export function faqPage() {
  const path = '/faq/';
  const title = pageTitle('Concrete & Excavation FAQ');
  const description = `Costs, timelines, permits and curing times — straight answers from a licensed ${site.region} concrete and excavation contractor.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'FAQ', url: path }];

  const groups = [
    { h: 'Working with Booth’s', faqs: homeFaqs },
    ...services.map((s) => ({ h: s.name, faqs: s.faqs, link: `/services/${s.slug}/` })),
  ];
  const all = groups.flatMap((g) => g.faqs);

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">FAQ</span>
      <h1>Straight Answers About Concrete Work</h1>
      <p class="phero__lede">
        What things cost, how long they take, what needs a permit, and how to tell whether the
        contractor in your driveway knows what they are doing.
      </p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="/contact/">Ask us anything</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="faq-hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap wrap--narrow">
    ${groups
      .map(
        (g, i) => `<div style="margin-bottom:3rem;">
      <h2 style="font-size:var(--step-3);margin-bottom:1rem;">${esc(g.h)}</h2>
      ${faqList(g.faqs, i === 0 ? 0 : -1)}
      ${g.link ? `<p style="margin-top:1rem;"><a href="${g.link}">More about ${esc(g.h.toLowerCase())} &rarr;</a></p>` : ''}
    </div>`
      )
      .join('')}
  </div>
</section>

${ctaBand({ heading: 'Still have a question?', text: 'Call, text or send it over. We answer every message within one business day, whether or not it turns into a job.' })}`;

  return {
    path, title, description, body,
    schema: [...base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, name: title, description } : n)), faqNode(all, path)],
  };
}

/* ============================== /contact/ ============================== */
export function contactPage() {
  const path = '/contact/';
  const title = pageTitle(`Contact Us — Free Estimates`);
  const description = `Call or text ${site.phoneDisplay}, or send your project details for a free on-site estimate anywhere in ${site.region}. Every message answered.`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Contact', url: path }];

  const hours = site.hours.map((h) => `<li style="display:flex;justify-content:space-between;gap:1rem;border-bottom:1px dashed var(--border);padding:.45rem 0;"><span>${esc(h.days)}</span><strong>${esc(h.time)}</strong></li>`).join('');

  const body = `
<section class="phero">
  <div class="wrap">
    ${crumbs(trail, true)}
    <div class="phero__inner">
      <span class="eyebrow">Contact</span>
      <h1>Get Your Free Estimate</h1>
      <p class="phero__lede">
        Two ways to reach us and both get answered. Call or text
        <a href="tel:${site.phoneHref}" data-loc="contact-hero" style="color:var(--gold);">${esc(site.phoneDisplay)}</a>,
        or fill in the form below and we will get back to you within one business day.
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split split--wide-left" style="align-items:start;">
      <div>
        <div class="lead-card">
          <div class="lead-card__head">
            <h2>Tell us about your project</h2>
            <p>The more you tell us, the more accurate the first number is. Nothing here is required except your name, phone and where the work is.</p>
          </div>
          <div style="padding:var(--sp-5);">
            ${detailedForm({ id: 'contact' })}
          </div>
          <div class="lead-card__foot">${icon('lock', 16)} <span>Your information stays with us. We never sell or share leads.</span></div>
        </div>
      </div>

      <aside class="stack">
        <div class="panel">
          <span class="eyebrow">Fastest way</span>
          <h3 style="font-size:var(--step-2);">Call or text</h3>
          <p style="margin-top:.5rem;"><a href="tel:${site.phoneHref}" data-loc="contact-panel" style="font-family:var(--font-display);font-size:var(--step-3);color:var(--ink);text-decoration:none;">${esc(site.phoneDisplay)}</a></p>
          <div class="btn-row" style="margin-top:1rem;">
            <a class="btn btn--primary" href="tel:${site.phoneHref}" data-loc="contact-panel">${icon('phone', 18)} Call now</a>
            <a class="btn btn--ghost" href="sms:${site.phoneHref}" data-loc="contact-panel">${icon('message', 18)} Text us</a>
          </div>
          <p class="note" style="margin-top:1rem;">${esc(site.emergencyNote)}</p>
        </div>

        <div class="panel">
          <span class="eyebrow">Hours</span>
          <ul style="list-style:none;padding:0;margin-top:.5rem;">${hours}</ul>
        </div>

        <div class="panel">
          <span class="eyebrow">Email</span>
          <p style="margin-top:.4rem;"><a href="mailto:${site.email}">${esc(site.email)}</a></p>
          <span class="eyebrow" style="margin-top:1.25rem;">Service area</span>
          <p style="margin-top:.4rem;color:var(--text-muted);">
            ${esc(site.region)} &mdash; roughly ${site.serviceRadiusMiles} miles around ${esc(site.city)}, ${esc(site.state)}.
            <a href="/service-areas/">Check your town &rarr;</a>
          </p>
          <span class="eyebrow" style="margin-top:1.25rem;">Follow the work</span>
          <div class="btn-row" style="margin-top:.6rem;">
            <a class="btn btn--ghost" href="${site.social.facebook}" rel="noopener">${icon('facebook', 18)} Facebook</a>
            <a class="btn btn--ghost" href="${site.social.instagram}" rel="noopener">${icon('instagram', 18)} Instagram</a>
          </div>
        </div>

        <div class="panel panel--gold">
          <span class="eyebrow">What happens next</span>
          <ol style="margin-top:.6rem;display:grid;gap:.6rem;padding-left:1.1rem;">
            <li>We call or text you back &mdash; same day where we can, always within one business day.</li>
            <li>We book a time to come look at the project, usually within a few days.</li>
            <li>You get a fixed written price with the full scope of work, and a start window.</li>
          </ol>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--alt section--tight">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Serving</span>
      <h2>Towns we cover</h2>
    </div>
    <ul class="area-list" style="max-width:900px;margin-inline:auto;">
      ${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(c.full)}</a></li>`).join('')}
    </ul>
  </div>
</section>`;

  return {
    path, title, description, body,
    schema: [...base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, '@type': 'ContactPage', name: title, description } : n))],
  };
}

/* ============================== /thank-you/ ============================== */
export function thankYouPage() {
  const path = '/thank-you/';
  const title = pageTitle('Thanks — we got your request');
  const description = 'Your project details are in. We reply to every message within one business day.';
  const trail = [{ name: 'Home', url: '/' }, { name: 'Thank you', url: path }];

  const body = `
<section class="section">
  <div class="wrap wrap--narrow center">
    <span class="card__icon" style="margin-inline:auto;width:76px;height:76px;">${icon('checkCircle', 40)}</span>
    <h1 style="margin-top:1.5rem;">Got it &mdash; thanks.</h1>
    <p style="font-size:var(--step-1);color:var(--text-muted);margin-top:1rem;">
      Your request is in front of us. We reply to every message within one business day, and usually
      the same day. If it is urgent, call or text
      <a href="tel:${site.phoneHref}" data-loc="thankyou"><strong>${esc(site.phoneDisplay)}</strong></a>
      and you will get a person.
    </p>

    <div class="panel panel--gold" style="text-align:left;margin-top:2.5rem;">
      <span class="eyebrow">What happens next</span>
      <ol style="margin-top:.6rem;display:grid;gap:.7rem;padding-left:1.1rem;">
        <li><strong>We call you back.</strong> A few quick questions so we arrive with the right information.</li>
        <li><strong>We come look.</strong> We measure, check the grade, the drainage and the access.</li>
        <li><strong>You get a fixed written price.</strong> Full scope, timeline, and a start window. No obligation.</li>
      </ol>
    </div>

    <div class="btn-row btn-row--center" style="margin-top:2.5rem;">
      <a class="btn btn--dark" href="/gallery/">See our recent work</a>
      <a class="btn btn--ghost" href="${site.social.facebook}" rel="noopener">${icon('facebook', 18)} Follow on Facebook</a>
    </div>

    <p class="note" style="margin-top:2.5rem;">
      While you wait &mdash; our <a href="/faq/">FAQ</a> covers costs, timelines, permits and curing times.
    </p>
  </div>
</section>`;

  return {
    path, title, description, body,
    robots: 'noindex, follow',
    schema: base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, name: title, description } : n)),
  };
}

/* ============================== /privacy/ & /terms/ ============================== */
export function privacyPage() {
  const path = '/privacy/';
  const title = pageTitle('Privacy Policy');
  const description = 'How we collect, use and protect the information you submit through this website.';
  const trail = [{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: path }];

  const body = `
<section class="section">
  <div class="wrap wrap--narrow prose">
    ${crumbs(trail)}
    <h1 style="margin-top:1rem;">Privacy Policy</h1>
    <p class="note">Last updated: <span id="pp-date">September 2026</span></p>

    <h2>What we collect</h2>
    <p>
      When you submit a form on this site we collect the information you type into it: your name,
      phone number, email address if you provide one, the project address or town, the service you are
      interested in, and any details you choose to share. We also record which page the form was
      submitted from and, if you arrived from an ad or a campaign link, the campaign details attached
      to that link.
    </p>

    <h2>How we use it</h2>
    <p>
      Solely to respond to your enquiry, prepare an estimate, schedule and perform work, and follow up
      about that work. If you ask us not to contact you again, we stop.
    </p>

    <h2>What we never do</h2>
    <ul>
      <li>We do not sell your information.</li>
      <li>We do not share or trade it with lead brokers or other contractors.</li>
      <li>We do not send marketing email or text messages you did not ask for.</li>
    </ul>

    <h2>Who processes it</h2>
    <p>
      This website is hosted on Netlify, and form submissions are stored in Netlify&rsquo;s form
      handling service and forwarded to our email. Those providers process the data on our behalf
      under their own privacy terms.
    </p>

    <h2>Cookies and analytics</h2>
    <p>
      This site sets no advertising cookies. Your browser&rsquo;s local storage is used for two small
      things: remembering that you dismissed the announcement bar, and remembering which campaign
      brought you to the site so that it can be attached to your enquiry. If website analytics are
      enabled, they are used in aggregate to understand which pages are useful &mdash; never to identify
      you personally.
    </p>

    <h2>Calls and texts</h2>
    <p>
      By submitting a form you agree that we may contact you by phone, text message or email about
      your project. Message and data rates may apply. Reply STOP to any text to opt out.
    </p>

    <h2>Your choices</h2>
    <p>
      You can ask us at any time to tell you what information we hold about you, correct it, or delete
      it. Email <a href="mailto:${site.email}">${esc(site.email)}</a> or call
      <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a> and we will handle it.
    </p>

    <h2>Contact</h2>
    <p>
      ${esc(site.legalName)}<br>
      ${esc(site.city)}, ${esc(site.state)} ${esc(site.postalCode)}<br>
      <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a> &middot;
      <a href="mailto:${site.email}">${esc(site.email)}</a>
    </p>
  </div>
</section>`;

  return { path, title, description, body, robots: 'noindex, follow', schema: base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, name: title, description } : n)) };
}

export function termsPage() {
  const path = '/terms/';
  const title = pageTitle('Terms of Use');
  const description = 'Terms governing use of this website, including the status of published price ranges and estimates.';
  const trail = [{ name: 'Home', url: '/' }, { name: 'Terms of Use', url: path }];

  const body = `
<section class="section">
  <div class="wrap wrap--narrow prose">
    ${crumbs(trail)}
    <h1 style="margin-top:1rem;">Terms of Use</h1>
    <p class="note">Last updated: September 2026</p>

    <h2>About this site</h2>
    <p>
      This website is operated by ${esc(site.legalName)}. By using it you agree to these terms. If you
      do not agree with them, please do not use the site.
    </p>

    <h2>Pricing information is indicative</h2>
    <p>
      Price ranges published anywhere on this site are typical ranges for ${esc(site.region)} and are
      provided to help you budget. They are not quotations, not offers, and not binding. The only
      binding price is the written estimate we give you after inspecting the property, and it is valid
      for the period stated on that estimate.
    </p>

    <h2>Technical guidance</h2>
    <p>
      Descriptions of construction methods, dimensions, code requirements and material specifications
      are general information about how we build. Code requirements vary by municipality and change
      over time, and every site is different. Nothing here is engineering advice for your specific
      project &mdash; that comes from a site visit, and from a licensed engineer where one is required.
    </p>

    <h2>Content</h2>
    <p>
      Text, images, logos and design on this site belong to ${esc(site.legalName)} and may not be
      reproduced without permission.
    </p>

    <h2>Links to other sites</h2>
    <p>
      We link to our own social media profiles and occasionally to third-party resources. We are not
      responsible for the content or practices of sites we do not operate.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      This site is provided as is. We take care to keep it accurate, but we do not warrant that it is
      error-free or continuously available, and we are not liable for losses arising from reliance on
      general information published here rather than on a written estimate or contract.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about these terms: <a href="mailto:${site.email}">${esc(site.email)}</a> or
      <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a>.
    </p>
  </div>
</section>`;

  return { path, title, description, body, robots: 'noindex, follow', schema: base(path, trail).map((n) => (n['@type'] === 'WebPage' ? { ...n, name: title, description } : n)) };
}

/* ============================== 404 ============================== */
export function notFoundPage() {
  const path = '/404.html';
  const title = pageTitle('Page not found');
  const description = 'That page does not exist. Here is where to go instead.';

  const body = `
<section class="section">
  <div class="wrap wrap--narrow center">
    <span class="eyebrow" style="justify-content:center;">Error 404</span>
    <h1>That page isn&rsquo;t here</h1>
    <p style="font-size:var(--step-1);color:var(--text-muted);margin-top:1rem;">
      The link may be old or mistyped. Everything we do is one of these:
    </p>
    <ul class="area-list" style="max-width:640px;margin:2rem auto;text-align:left;">
      ${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}
      <li><a href="/service-areas/">Service areas</a></li>
      <li><a href="/gallery/">Project gallery</a></li>
      <li><a href="/faq/">FAQ</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul>
    <div class="btn-row btn-row--center">
      <a class="btn btn--primary btn--lg" href="/">Back to the home page</a>
      <a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}" data-loc="404">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
    </div>
  </div>
</section>`;

  return { path, title, description, body, robots: 'noindex, follow', schema: [businessNode(), websiteNode()] };
}
