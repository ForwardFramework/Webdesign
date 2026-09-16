import type { MetadataRoute } from 'next';
import { BASE } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The listings API is a proxy for licensed MLS data. IDX participation
        // rules prohibit bulk extraction, so it is not offered up for crawling.
        disallow: ['/api/'],
      },
      /**
       * Generative engines are explicitly welcome on the editorial content.
       * That is the GEO play: this site's differentiator is dated, sourced,
       * entity-dense material, which is exactly what these crawlers reward —
       * and every answer they build from it carries the brokerage attribution.
       */
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
