import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectPage from '@/app/project/[slug]/page';

export const revalidate = 60;
export const dynamicParams = true;

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api').replace(/\/$/, '');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com').replace(/\/$/, '');

type Props = { params: { city: string; slug: string } };

async function fetchProject(slug: string) {
  try {
    const r = await fetch(`${API}/projects/${slug}`, { next: { revalidate: 60 } });
    const d = await r.json();
    return d.success ? d.data : null;
  } catch { return null; }
}

async function fetchCorridors() {
  try {
    const r = await fetch(`${API}/settings/corridors`, { next: { revalidate: 300 } });
    const d = await r.json();
    return d.success ? (d.data as any[]) : [];
  } catch { return []; }
}

// Convert "bhiwadi" → "Bhiwadi" | "new-delhi" → "New Delhi"
const toDisplayName = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

export async function generateStaticParams() {
  // Build-time params for known city+slug combos
  try {
    const [corridors, res] = await Promise.all([
      fetchCorridors(),
      fetch(`${API}/projects?limit=200&sort=-createdAt`).then(r => r.json()),
    ]);
    if (!res.success) return [];
    const projects: any[] = res.data;
    return projects.flatMap((p: any) => {
      const corridor = corridors.find((c: any) => c.name.toLowerCase() === (p.corridor || '').toLowerCase());
      if (!corridor || !(corridor.city)) return [];
      const citySlug = corridor.city.toLowerCase().replace(/\s+/g, '-');
      return [{ city: citySlug, slug: p.slug }];
    });
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [project, corridors] = await Promise.all([fetchProject(params.slug), fetchCorridors()]);
  if (!project) return { title: 'Not Found' };

  const corridor = corridors.find((c: any) => c.name.toLowerCase() === (project.corridor || '').toLowerCase());
  const cityName = corridor?.city ? toDisplayName(corridor.city) : toDisplayName(params.city);

  const title = project.metaTitle || `${project.name} ${cityName} | Price, Floor Plan, RERA`;
  const description = project.metaDescription || project.shortDescription ||
    `${project.name} in ${cityName}. ${project.priceDisplay || 'Price on Request'}. RERA verified. Free site visit.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE}/${params.city}/${params.slug}`,
      images: project.heroImage ? [{ url: project.heroImage, width: 1200, height: 630, alt: project.name }] : [],
    },
    alternates: { canonical: `${SITE}/${params.city}/${params.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CityProjectPage({ params }: Props) {
  const [project, corridors] = await Promise.all([fetchProject(params.slug), fetchCorridors()]);

  if (!project) notFound();

  // Verify this project belongs to the requested city
  const corridor = corridors.find((c: any) =>
    c.name.toLowerCase() === (project.corridor || '').toLowerCase()
  );
  const projectCitySlug = (corridor?.city || 'Bhiwadi').toLowerCase().replace(/\s+/g, '-');

  // If city doesn't match, 404 (prevents duplicate content across city slugs)
  if (projectCitySlug !== params.city) notFound();

  // Render the full project page — all components, schema, conversion triggers
  return <ProjectPage params={{ slug: params.slug }} />;
}
