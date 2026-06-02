import { MetadataRoute } from 'next';
import { ALL_SEO_PAGES } from '@/lib/projects';
import { fetchBlogs } from '@/lib/api-blogs';
import { headers } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

// Fixed date — update this only when the page's content meaningfully changes.
const SITE_LAUNCH = new Date('2025-12-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const BASE = `${proto}://${host}`;

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

  // Blogs — only published entries from DB (no hardcoded static slugs)
  const allBlogs = await fetchBlogs();
  const publishedBlogs = allBlogs.filter((b) => b.status === 'published');

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'daily', priority: 1.0, lastModified: new Date() },
    ...ALL_SEO_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      lastModified: SITE_LAUNCH,
    })),
    { url: `${BASE}/blog`,          changeFrequency: 'weekly',  priority: 0.7,  lastModified: new Date() },
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

  const blogPages: MetadataRoute.Sitemap = publishedBlogs.map((blog) => ({
    url: `${BASE}/blog/${blog.slug}`,
    lastModified: blog.dateModified
      ? new Date(blog.dateModified)
      : blog.date
      ? new Date(blog.date)
      : SITE_LAUNCH,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
