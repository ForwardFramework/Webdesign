import type { MetadataRoute } from 'next';
import { VILLAGES } from '@/data/villages';
import { GUIDES } from '@/data/guides';
import { BASE } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/homes', priority: 0.95, freq: 'hourly' },
    { path: '/villages', priority: 0.95, freq: 'weekly' },
    { path: '/lakewood-ranch', priority: 0.9, freq: 'monthly' },
    { path: '/explore', priority: 0.85, freq: 'monthly' },
    { path: '/new-construction', priority: 0.85, freq: 'weekly' },
    { path: '/schools', priority: 0.8, freq: 'monthly' },
    { path: '/happy-hours', priority: 0.8, freq: 'weekly' },
    { path: '/beaches', priority: 0.75, freq: 'monthly' },
    { path: '/lifestyle', priority: 0.75, freq: 'monthly' },
    { path: '/guides', priority: 0.8, freq: 'monthly' },
    { path: '/faq', priority: 0.8, freq: 'monthly' },
    { path: '/sell', priority: 0.75, freq: 'monthly' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/sources', priority: 0.4, freq: 'monthly' },
    { path: '/accessibility', priority: 0.3, freq: 'yearly' },
    { path: '/fair-housing', priority: 0.3, freq: 'yearly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/terms', priority: 0.2, freq: 'yearly' },
  ];

  return [
    ...core.map((c) => ({
      url: `${BASE}${c.path}`,
      lastModified: now,
      changeFrequency: c.freq,
      priority: c.priority,
    })),
    ...VILLAGES.map((v) => ({
      url: `${BASE}/villages/${v.slug}`,
      lastModified: new Date(v.verifiedOn),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...GUIDES.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
