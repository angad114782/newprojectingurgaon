import { MetadataRoute } from 'next';
import { ALL_SEO_PAGES } from '@/lib/projects';
import { fetchBlogs } from '@/lib/api-blogs';

export const revalidate = 3600; // regenerate sitemap every hour

// Use today as the lastmod for all active pages — signals freshness to Google
const TODAY = new Date();
const SITE_LAUNCH = TODAY; // kept for naming compat

// Use env var as primary — reliable in all environments (CDN, proxy, Vercel, etc.)
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com').replace(/\/$/, '');

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

// These 5 blog posts always exist as static fallbacks in /blog/[slug]/page.tsx
// regardless of DB state — they MUST be in the sitemap at all times.
const STATIC_BLOG_SLUGS: { slug: string; date: string }[] = [
  { slug: 'property-investment-in-bhiwadi-guide',      date: '2025-03-01' },
  { slug: 'alwar-bypass-road-real-estate-bhiwadi',     date: '2025-02-01' },
  { slug: 'nh-48-bhiwadi-property-investment',         date: '2025-01-01' },
  { slug: 'how-to-check-rera-before-buying-property',  date: '2024-12-01' },
  { slug: 'best-builders-in-bhiwadi',                  date: '2024-11-01' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Projects — fetch with real timestamps so Google gets accurate freshness signals
  type ProjectEntry = { slug: string; updatedAt?: string };
  let projects: ProjectEntry[] = [];
  try {
    const res = await fetch(`${API}/projects?limit=200&sort=-createdAt`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data.data)) {
      projects = data.data.map((p: any) => ({ slug: p.slug, updatedAt: p.updatedAt }));
    }
  } catch {}

  // DB blogs (published only) merged with static fallbacks — deduplicated by slug
  const allBlogs = await fetchBlogs();
  const publishedDbBlogs = allBlogs.filter((b) => b.status === 'published');
  const dbSlugs = new Set(publishedDbBlogs.map((b) => b.slug));

  // Static blogs that are NOT already in the DB result
  const staticBlogEntries = STATIC_BLOG_SLUGS.filter((s) => !dbSlugs.has(s.slug));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'daily', priority: 1.0, lastModified: new Date() },
    ...ALL_SEO_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      lastModified: SITE_LAUNCH,
    })),
    { url: `${BASE}/blog`,          changeFrequency: 'weekly',  priority: 0.75, lastModified: new Date() },
    { url: `${BASE}/about`,         changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_LAUNCH },
    { url: `${BASE}/contact`,       changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_LAUNCH },
    { url: `${BASE}/privacy-policy`,changeFrequency: 'yearly',  priority: 0.3,  lastModified: SITE_LAUNCH },
    { url: `${BASE}/terms`,         changeFrequency: 'yearly',  priority: 0.3,  lastModified: SITE_LAUNCH },
    { url: `${BASE}/disclaimer`,    changeFrequency: 'yearly',  priority: 0.3,  lastModified: SITE_LAUNCH },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map(({ slug, updatedAt }) => ({
    url: `${BASE}/project/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : SITE_LAUNCH,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // DB blog pages
  const dbBlogPages: MetadataRoute.Sitemap = publishedDbBlogs.map((blog) => ({
    url: `${BASE}/blog/${blog.slug}`,
    lastModified: blog.dateModified
      ? new Date(blog.dateModified)
      : blog.date
      ? new Date(blog.date)
      : SITE_LAUNCH,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Static fallback blog pages (always present)
  const staticBlogPages: MetadataRoute.Sitemap = staticBlogEntries.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticPages, ...projectPages, ...dbBlogPages, ...staticBlogPages];
}
