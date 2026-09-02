const { business: B, posts } = require('../data/site.js');
const { esc, telHref, I, cityState } = require('../templates/layout.js');
const C = require('../templates/components.js');
const { page, abs, D } = require('../templates/shell.js');

const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function hub() {
  return page({
    path: '/resources/',
    title: `Roofing Guides & Resources | ${cityState} | ${B.name}`,
    desc: `Plain-English guides to roof lifespan, replacement cost, storm damage, and ice dams in ${cityState} and Western Pennsylvania. Written by working roofers.`,
    crumbs: [{ label: 'Resources' }],
    pageType: 'CollectionPage',
    head: `<h1>Roofing Resources</h1>
      <p class="lede">Plain-English guides to the questions we get asked on driveways every week &mdash;
      what things cost, how long they last, and what actually causes the problem.</p>`,
    schema: [{
      '@type': 'ItemList', '@id': D + '/resources/#list',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: p.title, url: abs(`/resources/${p.slug}/`)
      }))
    }],
    body: `
<section class="section">
  <div class="wrap">
    <div class="grid g-3">
      ${posts.map(p => `
      <a class="card card--link reveal" href="/resources/${p.slug}/">
        <span class="badge">${esc(p.cat)}</span>
        <h3 style="margin-top:1rem">${esc(p.title)}</h3>
        <p>${esc(p.excerpt)}</p>
        <span class="card-more">Read the guide ${I.arrow}</span>
      </a>`).join('')}
    </div>
  </div>
</section>

${C.ctaBand('Rather just ask someone?', `Free inspection, photos of what we find, and a straight answer. Call or text ${B.phone}.`)}`
  });
}

function article(p) {
  const others = posts.filter(x => x.slug !== p.slug).slice(0, 3);
  return page({
    path: `/resources/${p.slug}/`,
    title: p.metaTitle,
    desc: p.metaDesc,
    crumbs: [{ label: 'Resources', href: '/resources/' }, { label: p.title }],
    pageType: 'WebPage',
    ogType: 'article',
    faqs: p.faqs,
    head: `<span class="badge">${esc(p.cat)}</span>
      <h1 style="margin-top:1rem">${esc(p.title)}</h1>
      <p class="lede">${esc(p.excerpt)}</p>
      <p class="small muted" style="margin-top:1rem">Published ${fmt(p.date)}${p.updated !== p.date ? ' &middot; Updated ' + fmt(p.updated) : ''} &middot; by ${esc(B.name)}</p>`,
    schema: [{
      '@type': 'Article',
      '@id': abs(`/resources/${p.slug}/`) + '#article',
      headline: p.title,
      description: p.metaDesc,
      articleSection: p.cat,
      datePublished: p.date,
      dateModified: p.updated,
      author: { '@id': D + '/#organization' },
      publisher: { '@id': D + '/#organization' },
      mainEntityOfPage: { '@id': abs(`/resources/${p.slug}/`) + '#webpage' },
      image: abs('/assets/img/og-image.png'),
      inLanguage: 'en-US'
    }],
    body: `
<section class="section">
  <div class="wrap split">
    <div>
      ${C.answerBox('The short answer', p.answer)}
      <div class="prose" style="margin-top:2.5rem">
        ${C.renderSections(p.sections)}
        <h2>Related questions</h2>
      </div>
      ${C.faqBlock(p.faqs)}

      <div class="answer-box" style="margin-top:2.5rem">
        <span class="eyebrow">Local help</span>
        <p>Roughneck Roofing provides free, photo-documented roof inspections across ${esc(cityState)}
        and surrounding counties. If anything in this guide sounds like your roof, call or text
        <a href="${telHref}">${esc(B.phone)}</a> and we will come look at it.</p>
      </div>
    </div>

    <div class="sticky-aside">
      <div class="aside-card">
        <h3>Free inspection</h3>
        <p>On the roof and in the attic, with photos you keep. No obligation.</p>
        <div class="btn-row" style="flex-direction:column">
          <a class="btn btn--primary btn--block" href="${telHref}">${I.phone} ${esc(B.phone)}</a>
          <a class="btn btn--ghost btn--block" href="/contact/">Request online</a>
        </div>
      </div>
      <div class="aside-card">
        <h3>More guides</h3>
        <ul class="aside-list">
          ${others.map(o => `<li><a href="/resources/${o.slug}/">${esc(o.title)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>

${C.ctaBand()}`
  });
}

module.exports = { hub, article };
