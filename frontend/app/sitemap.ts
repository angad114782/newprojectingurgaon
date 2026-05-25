import { MetadataRoute } from 'next';
import { ALL_PROJECTS, ALL_SEO_PAGES } from '@/lib/projects';
import { fetchAllProjectSlugs } from '@/lib/api-projects';

const BASE = 'https://www.gurgaonrealty.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Merge API slugs + static slugs (deduped)
  const apiSlugs = await fetchAllProjectSlugs();
  const staticSlugs = ALL_PROJECTS.map((p) => p.slug);
  const allSlugs = Array.from(new Set([...apiSlugs, ...staticSlugs]));

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

  const blogPages = [
    'best-sectors-to-invest-in-gurgaon',
    'dwarka-expressway-investment-guide',
    'new-launch-vs-ready-to-move-property',
    'how-to-check-rera-before-buying-property',
    'best-builders-in-gurgaon',
    'property-in-gurgaon-2025-complete-guide',
    '2-bhk-homes-in-gurgaon-buying-guide',
    'spr-road-investment-guide-2025',
    'golf-course-extension-road-projects-review',
    'new-gurgaon-emerging-real-estate-hub',
  ].map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
