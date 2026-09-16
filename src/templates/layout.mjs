import { site } from '../../data/site.mjs';
import { header, footer, esc } from './ui.mjs';
import { graph, abs } from './schema.mjs';

export function layout({
  path,
  title,
  description,
  body,
  schema = [],
  bodyClass = '',
  bodyAttrs = '',
  ogType = 'website',
  ogImage = '/assets/img/og-default.png',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  headExtra = '',
}) {
  const canonical = abs(path);
  const analytics = site.ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');</script>`
    : '';

  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#0E2029">
<meta name="format-detection" content="telephone=yes">

<meta name="geo.region" content="US-${site.state}">
<meta name="geo.placename" content="${esc(site.city)}, ${esc(site.state)}">
<meta name="geo.position" content="${site.geo.lat};${site.geo.lng}">
<meta name="ICBM" content="${site.geo.lat}, ${site.geo.lng}">

<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)} — ${esc(site.tagline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">

<link rel="icon" href="/favicon.ico" sizes="32x32 64x64">
<link rel="icon" href="/assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/oswald-latin-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-latin-var.woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
${headExtra}
${schema.length ? graph(schema) : ''}
${analytics}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}${bodyAttrs ? ` ${bodyAttrs}` : ''}>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

export default layout;
