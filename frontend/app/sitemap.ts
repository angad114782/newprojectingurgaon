import { MetadataRoute } from 'next';
import { ALL_SEO_PAGES } from '@/lib/projects';
import { fetchAllProjectSlugs } from '@/lib/api-projects';
import { fetchAllBlogSlugs } from '@/lib/api-blogs';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const BASE = `${proto}://${host}`;

  const [allSlugs, blogSlugs] = await Promise.all([
    fetchAllProjectSlugs(),
    fetchAllBlogSlugs(),
  ]);

  const staticPages = [
    { url: BASE, changeFrequency: 'daily' as const, priority: 1.0 },
    ...ALL_SEO_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    { url: `${BASE}/blog`, changeFrequency: 'weekly' as const, priority: 0.7 },
  ].map((p) => ({ ...p, lastModified: new Date() }));

  const projectPages = allSlugs.map((slug) => ({
    url: `${BASE}/project/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Merge API slugs with static fallback slugs (deduplicated)
  const staticBlogSlugs = [
    'best-sectors-to-invest-in-gurgaon',
    'dwarka-expressway-investment-guide',
    'new-launch-vs-ready-to-move-property',
    'how-to-check-rera-before-buying-property',
    'best-builders-in-gurgaon',
  ];
  const allBlogSlugs = Array.from(new Set([...blogSlugs, ...staticBlogSlugs]));
  const blogPages = allBlogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
