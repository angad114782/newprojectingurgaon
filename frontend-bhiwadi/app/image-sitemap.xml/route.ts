import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const headersList = headers();
  const host = headersList.get('host') || 'propertyinbhiwadi.com';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const BASE = `${proto}://${host}`;

  type ProjectImage = {
    slug: string;
    name: string;
    location: string;
    heroImage?: string;
    floorPlanImages?: string[];
  };

  let projects: ProjectImage[] = [];
  try {
    const res = await fetch(`${API}/projects?limit=200&sort=-createdAt`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data.data)) {
      projects = data.data.map((p: any) => ({
        slug: p.slug,
        name: p.name,
        location: p.location || 'Bhiwadi',
        heroImage: p.heroImage,
        floorPlanImages: p.floorPlanImages || [],
      }));
    }
  } catch {}

  const imageEntries = projects
    .filter((p) => p.heroImage && p.heroImage.startsWith('http'))
    .map((p) => {
      const images: string[] = [p.heroImage!];
      (p.floorPlanImages || [])
        .filter((img: string) => img && img.startsWith('http'))
        .forEach((img: string) => images.push(img));

      const imageXml = images
        .map(
          (imgUrl) => `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(`${p.name} — ${p.location}`)}</image:title>
      <image:caption>${escapeXml(`New project by ${p.name} in ${p.location}, Bhiwadi — Floor plans, price list and site visit available.`)}</image:caption>
    </image:image>`
        )
        .join('');

      return `
  <url>
    <loc>${BASE}/project/${p.slug}</loc>${imageXml}
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${imageEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
