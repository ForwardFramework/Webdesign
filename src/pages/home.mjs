import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities, additional } from '../../data/areas.mjs';
import { testimonials } from '../../data/testimonials.mjs';
import { gallery } from '../../data/gallery.mjs';
import { icon } from '../templates/icons.mjs';
import {
  esc, pageTitle, quickForm, trustBar, serviceCards, ctaBand, faqList, galleryGrid,
} from '../templates/ui.mjs';
import {
  businessNode, websiteNode, webPageNode, breadcrumbNode, faqNode, itemListNode,
} from '../templates/schema.mjs';

const path = '/';

export const homeFaqs = [
  {
    q: 'What areas does Booth’s Contracting serve?',
    a: `Booth’s Contracting serves ${site.region} within about ${site.serviceRadiusMiles} miles of ${site.city}, ${site.state} — including Butler, Cranberry Township, Mars, Zelienople, Evans City, Saxonburg, Slippery Rock, Gibsonia, Wexford and New Castle, plus the surrounding parts of Butler, Allegheny, Lawrence, Beaver and Armstrong counties.`,
  },
  {
    q: 'Do you charge for estimates?',
    a: 'No. On-site estimates are free and carry no obligation. We walk the project with you, measure, check the grade and drainage, and give you a fixed written price rather than a per-square-foot guess over the phone.',
  },
  {
    q: 'How soon can you start my project?',
    a: 'Most residential projects are scheduled within two to four weeks of an approved estimate, and smaller jobs like pads and walkways often sooner. Fall and early spring are the easiest times to get a preferred date; midsummer books out furthest.',
  },
  {
    q: 'Are you licensed and insured?',
    a: 'Yes. Booth’s Contracting carries general liability insurance and workers’ compensation coverage, and is registered as a Pennsylvania Home Improvement Contractor. We will hand you a certificate of insurance with your estimate — ask any contractor who will not.',
  },
  {
    q: 'What does a concrete project cost?',
    a: 'As a working range in our area: driveways run about $8–$16 per square foot, standard patios $10–$14, stamped decorative patios $16–$22, sidewalks $9–$15, and a typical set of front steps $1,800–$4,500. The real number depends on demolition, excavation depth, access and finish, which is why we price on site instead of over the phone.',
  },
  {
    q: 'Do you handle both residential and commercial work?',
    a: 'Both. Residential work is the bulk of what we do — driveways, patios, steps, pads — and we also handle commercial sidewalks, ADA ramps, dumpster and loading pads, parking area prep and site work for contractors and property managers.',
  },
  {
    q: 'What time of year can concrete be poured in Pennsylvania?',
    a: 'Early spring through late fall for standard work, and into colder weather using heated mix, insulating blankets and accelerating admixtures. Fall is genuinely a good time to book: the ground is dry, the schedule is predictable, and the slab cures through the winter before it takes real load.',
  },
];

const heroPoints = [
  'Driveways, patios, sidewalks, steps, pads and site prep',
  'Compacted stone base and proper drainage on every pour',
  'Fixed written pricing before a machine touches your property',
  'Licensed, insured, and we haul our own debris away',
];

function proofSection() {
  if (!testimonials.length) {
    return `<section class="section section--alt">
      <div class="wrap">
        <div class="split">
          <div>
            <span class="eyebrow">Straight dealing</span>
            <h2>We&rsquo;d rather show you the work than talk about it</h2>
            <p style="margin-top:1rem;color:var(--text-muted);font-size:var(--step-1);">
              Every finished job goes up on our Facebook and Instagram &mdash; the good weather pours and the
              rainy ones. Scroll through, read what neighbors say in the comments, and then ask us for
              references on a project like yours. We will give you addresses you can drive past.
            </p>
            <div class="btn-row" style="margin-top:1.75rem;">
              <a class="btn btn--dark" href="${site.social.facebook}" rel="noopener">${icon('facebook', 18)} See our work on Facebook</a>
              <a class="btn btn--ghost" href="/gallery/">Project gallery</a>
            </div>
          </div>
          <div class="panel panel--gold">
            <span class="eyebrow">What you get in writing</span>
            <ul class="checklist" style="margin-top:.5rem;">
              <li><span><strong>A fixed price</strong>, not a range that moves after demolition.</span></li>
              <li><span><strong>A scope of work</strong> listing thickness, base depth, reinforcement and finish.</span></li>
              <li><span><strong>A certificate of insurance</strong> naming you, before we start.</span></li>
              <li><span><strong>A start window</strong> and a realistic number of days on site.</span></li>
              <li><span><strong>References</strong> for the same type of job, in your area.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>`;
  }
  return `<section class="section section--alt">
    <div class="wrap">
      <div class="sec-head center">
        <span class="eyebrow">Reviews</span>
        <h2>What our neighbors say</h2>
      </div>
      <div class="grid grid--3">
        ${testimonials
          .map(
            (t) => `<figure class="quote reveal">
          <div class="stars" aria-label="${t.stars} out of 5 stars">${'★'.repeat(t.stars)}</div>
          <blockquote>&ldquo;${esc(t.quote)}&rdquo;</blockquote>
          <figcaption><strong>${esc(t.name)}</strong>${esc(t.location)}${t.service ? ` &middot; ${esc(t.service)}` : ''}${t.source ? ` &middot; via ${esc(t.source)}` : ''}</figcaption>
        </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

export default function home() {
  const title = pageTitle(`Concrete & Excavation Contractor in ${site.region}`);
  const description = `Concrete driveways, patios, sidewalks, steps, pads and excavation across ${site.region}. Licensed, insured, free on-site estimates. ${site.phoneDisplay}.`;
  const trail = [{ name: 'Home', url: '/' }];

  const body = `
<section class="hero">
  <div class="wrap hero__inner">
    <div>
      <span class="hero__badge"><span class="dot"></span> ${esc(site.promo.short || site.promo.text)}</span>
      <h1>
        <span class="script">Built to Last</span>
        Concrete, Excavation &amp; Landscaping
        <span class="accent">in ${esc(site.region)}</span>
      </h1>
      <p class="hero__lede">
        Driveways, patios, sidewalks, steps and site work done the way they last through
        Pennsylvania winters &mdash; dug out properly, built on a compacted base, drained and
        jointed so the slab you pay for still looks right in ten years.
      </p>
      <ul class="hero__points">
        ${heroPoints.map((p) => `<li>${icon('check', 18)}<span>${esc(p)}</span></li>`).join('')}
      </ul>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="#quote">${esc(site.primaryCta)}</a>
        <a class="btn btn--on-dark btn--lg" href="tel:${site.phoneHref}" data-loc="hero">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
      </div>
      <div class="hero__trust">
        <span>${icon('shield', 18)} Licensed &amp; insured</span>
        <span>${icon('ruler', 18)} Free on-site estimates</span>
        <span>${icon('checkCircle', 18)} Residential &amp; commercial</span>
      </div>
    </div>
    <div id="quote">
      ${quickForm({ heading: 'Get My Free Estimate', id: 'hero' })}
    </div>
  </div>
</section>

${trustBar()}

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">What we do</span>
      <h2>One crew for the concrete, the dirt work and the finish</h2>
      <p>
        Most projects need all three. Hiring one company that does the excavation, the pour and the
        landscaping means the grade is right before the concrete goes down, and nobody is waiting on
        anybody else to show up.
      </p>
    </div>
    ${serviceCards(services)}
    <div class="btn-row btn-row--center" style="margin-top:2.5rem;">
      <a class="btn btn--dark btn--lg" href="/services/">See all services &amp; pricing</a>
    </div>
  </div>
</section>

<section class="section section--grit">
  <div class="wrap">
    <div class="split split--wide-left">
      <div>
        <span class="eyebrow">Why Booth&rsquo;s</span>
        <h2>The part you can&rsquo;t see is the part that fails</h2>
        <p style="margin-top:1.25rem;color:var(--text-on-dark-muted);font-size:var(--step-1);">
          Almost every cracked driveway and tipped-over set of steps we are called to replace failed
          for the same handful of reasons: no stone base, no compaction, no drainage, no control
          joints, and a mix that was never rated for freeze-thaw. Those five things cost very little
          to do right and are impossible to fix afterward.
        </p>
        <ul class="checklist checklist--2" style="margin-top:1.75rem;color:var(--text-on-dark);">
          <li><span><strong>Compacted stone base</strong> placed in lifts, not dumped and raked.</span></li>
          <li><span><strong>Air-entrained 4,000 PSI mix</strong> that survives the freeze-thaw cycle.</span></li>
          <li><span><strong>Saw-cut control joints</strong> so cracks land where we put them.</span></li>
          <li><span><strong>Positive drainage</strong> pitched away from your foundation.</span></li>
          <li><span><strong>Footers below frost line</strong> under every set of steps.</span></li>
          <li><span><strong>Debris hauled off</strong> and the lawn seeded back before we leave.</span></li>
        </ul>
      </div>
      <div class="panel panel--dark">
        <span class="eyebrow">Straight answers</span>
        <h3 style="color:#fff;">We&rsquo;ll tell you when you don&rsquo;t need us</h3>
        <p style="margin-top:.9rem;color:var(--text-on-dark-muted);">
          If your steps only need resurfacing, we will quote resurfacing. If an overlay on your
          driveway would fail in three years, we will say so and lose the sale rather than take it.
          The estimate is where you find out which contractor you are dealing with.
        </p>
        <div class="stat-row" style="margin-top:2rem;">
          <div class="stat"><strong>4,000</strong><span>PSI air-entrained mix, standard</span></div>
          <div class="stat"><strong>36&Prime;</strong><span>Footer depth, below frost line</span></div>
          <div class="stat"><strong>1 day</strong><span>Typical reply to every message</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">How it works</span>
      <h2>From first call to final walk-through</h2>
      <p>No sales pressure, no moving numbers, no disappearing for three weeks mid-project.</p>
    </div>
    <div class="steps">
      <div class="step reveal"><h3>Call or message</h3><p>Tell us what you are thinking. We will ask a few questions and book a time to come look.</p></div>
      <div class="step reveal"><h3>On-site estimate</h3><p>We measure, check grade, drainage and access, and talk through the options that actually fit.</p></div>
      <div class="step reveal"><h3>Fixed written price</h3><p>You get a scope and a number in writing &mdash; thickness, base, reinforcement, finish, timeline.</p></div>
      <div class="step reveal"><h3>Scheduled &amp; built</h3><p>We confirm a start window, file the One Call ticket, and do the work with our own crew.</p></div>
      <div class="step reveal"><h3>Walk it together</h3><p>We clean up, seed the disturbed ground, and walk the finished job with you before we leave.</p></div>
    </div>
  </div>
</section>

${proofSection()}

${gallery.length ? `<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <span class="eyebrow">Recent work</span>
      <h2>Concrete you can drive past</h2>
      <p>A sample of driveways, patios, steps and site work across ${esc(site.region)}.</p>
    </div>
    ${galleryGrid(gallery.slice(0, 8))}
    <div class="btn-row btn-row--center" style="margin-top:2.25rem;">
      <a class="btn btn--dark" href="/gallery/">See the full gallery</a>
    </div>
  </div>
</section>` : ''}

<section class="section section--concrete">
  <div class="wrap">
    <div class="split">
      <div>
        <span class="eyebrow">Where we work</span>
        <h2>Local to ${esc(site.city)}, working across ${esc(site.region)}</h2>
        <p style="margin-top:1rem;color:var(--text-muted);font-size:var(--step-1);">
          We keep the service radius at roughly ${site.serviceRadiusMiles} miles on purpose. It means
          the crew is not burning half a day driving, you get a real answer about scheduling, and if
          something needs attention two winters from now we are still a short drive away.
        </p>
        <div class="btn-row" style="margin-top:1.75rem;">
          <a class="btn btn--dark" href="/service-areas/">Check your town</a>
          <a class="btn btn--ghost" href="tel:${site.phoneHref}" data-loc="areas">${icon('phone', 18)} ${esc(site.phoneDisplay)}</a>
        </div>
      </div>
      <div>
        <h3 style="font-size:var(--step-1);margin-bottom:1rem;">Towns we serve most</h3>
        <ul class="area-list">
          ${cities.map((c) => `<li><a href="/service-areas/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
          ${additional.slice(0, 14).map((t) => `<li>${esc(t)}</li>`).join('')}
        </ul>
        <p class="note" style="margin-top:1rem;">Not on the list? Call &mdash; if we can get there, we will quote it.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap wrap--narrow">
    <div class="sec-head center">
      <span class="eyebrow">Common questions</span>
      <h2>Answers before you call</h2>
    </div>
    ${faqList(homeFaqs)}
    <p class="center" style="margin-top:2rem;"><a class="btn btn--ghost" href="/faq/">Read all FAQs</a></p>
  </div>
</section>

${ctaBand({
    heading: 'Get your project on the schedule',
    text: `A few openings are left this season. Send your details and we’ll come look, measure, and give you a fixed written price — free, with no obligation.`,
  })}

<section class="section">
  <div class="wrap wrap--narrow">
    ${quickForm({
      heading: 'Tell us about your project',
      sub: 'Two minutes now saves a week of phone tag. We reply to every message within one business day.',
      id: 'footer',
    })}
  </div>
</section>`;

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
      faqNode(homeFaqs, path),
      itemListNode(path, 'Services', services.map((s) => ({ name: s.name, url: `/services/${s.slug}/` }))),
    ],
  };
}
