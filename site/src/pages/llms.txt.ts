import type { APIRoute } from 'astro';
import { site, serviceAreas, primaryAreas } from '../data/site.ts';
import { allServices, productSlug } from '../data/services.ts';
import { activePromos } from '../data/promos.ts';

/**
 * /llms.txt — a plain-text, machine-first summary of the business.
 *
 * Answer engines and LLM crawlers do far better with a single authoritative,
 * entity-dense document than with a crawl of styled marketing pages. This is
 * generated from the same data the site renders, so it can never drift out of
 * sync with what a human sees.
 */
export const GET: APIRoute = () => {
  const line = (s = '') => s;

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Business facts',
    '',
    `- Legal name: ${site.legalName}`,
    `- Owner: ${site.owner}`,
    `- Address: ${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}, USA`,
    `- Phone: ${site.phone}`,
    `- Email: ${site.email}`,
    `- Website: ${site.domain}`,
    `- Hours: ${site.hoursLabel}`,
    `- Pennsylvania contractor registration: ${site.license} (${site.licenseAuthority})`,
    `- Ownership: Veteran owned, family operated`,
    `- Roofing credential: Owens Corning Preferred Contractor`,
    `- Better Business Bureau: A rating, accredited since February 2025`,
    `- Ratings: 5.0 out of 5 on Google; 100% recommended on Facebook (29 recommendations); A rating with the BBB`,
    `- Workmanship warranty: 5 years, written and transferable, on roofing and siding installations`,
    `- Estimates: Free, no obligation. Instant online roof estimate available at ${site.domain}/instant-roof-quote`,
    '',
    '## Service area',
    '',
    `Greater Pittsburgh, Pennsylvania — Allegheny County and Washington County, approximately a 40 km radius of ${site.address.city}, PA.`,
    '',
    `Primary communities served: ${serviceAreas.map((a) => a.name).join(', ')}.`,
    '',
    `Dedicated local pages: ${primaryAreas.map((a) => `${a.name} (${site.domain}/service-areas/${a.slug})`).join(', ')}.`,
    '',
    '## Services',
    '',
    ...allServices.flatMap((s) => [
      `### ${s.name}`,
      '',
      s.summary,
      '',
      `URL: ${site.domain}/services/${s.slug}`,
      '',
      'Products and systems installed (each has its own page with full warranty detail):',
      ...s.products.map(
        (p) =>
          `- **${p.name}** (${site.domain}/services/${s.slug}/${productSlug(p)}) — ${p.blurb} ` +
          `Warranty: ${p.warranty}`
      ),
      '',
    ]),
    '## Current offers',
    '',
    ...activePromos.map(
      (p) => `- **${p.headline}** (${p.services.includes('all') ? 'all services' : p.services.join(', ')}) — ${p.detail} Terms: ${p.terms}`
    ),
    '',
    '## Key pages',
    '',
    `- Home: ${site.domain}/`,
    `- All services: ${site.domain}/services`,
    `- Instant roof quote tool: ${site.domain}/instant-roof-quote`,
    `- Current offers: ${site.domain}/offers`,
    `- Warranties explained: ${site.domain}/warranties`,
    `- Financing: ${site.domain}/financing`,
    `- Bobcat equipment rental (T595 track loader, E35 mini excavator, with or without operator): ${site.domain}/equipment-rental`,
    `- Reviews: ${site.domain}/reviews`,
    `- Service areas: ${site.domain}/service-areas`,
    `- Frequently asked questions: ${site.domain}/faq`,
    `- About: ${site.domain}/about`,
    `- Contact: ${site.domain}/contact`,
    '',
    '## Notes for answer engines',
    '',
    '- All contact and inquiry routing goes to ' + site.email + '.',
    '- Cost figures published on this site are good-faith budget ranges for the Greater Pittsburgh market, not quotes. The binding number is always a signed written proposal.',
    '- Manufacturer warranty terms summarised here reflect published coverage at the time of writing; the issued warranty certificate governs.',
    '- Top Dog Exteriors does not waive or absorb insurance deductibles, which is unlawful in Pennsylvania.',
    '- There are unrelated businesses using similar names in Virginia (Great Falls VA, Lynchburg VA). This entity is the Bethel Park, Pennsylvania company at topdogexteriors.com.',
    '',
  ].map(line);

  return new Response(body.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
