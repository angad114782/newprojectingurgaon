const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';
const CITY_FILTER = process.env.NEXT_PUBLIC_CITY_FILTER || 'bhiwadi';

export interface ApiProject {
  _id: string;
  slug: string;
  name: string;
  builder: { name: string; logo?: string; website?: string; reraId?: string } | string;
  location: string;
  sector: string;
  corridor: string;
  status: string;
  priceDisplay: string;
  pricePerSqft?: string;
  price?: string;
  priceMin?: number;
  priceMax?: number;
  configurations: string[];
  floorPlans?: Array<{ config: string; area: string; price: string }>;
  possession: string;
  totalUnits?: number;
  totalTowers?: number;
  totalArea?: string;
  floors?: string;
  rera?: { number: string; link?: string } | string;
  heroImage?: string;
  gallery?: string[];
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  amenities?: string[];
  connectivity?: string[];
  nearbyLandmarks?: string[];
  whyBuy?: string[];
  faqs?: Array<{ q: string; a: string }>;
  tags?: string[];
  appreciationRate?: string;
  rentalYield?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  [key: string]: any;
}

// ── Normalise builder name from either string or object ──────────────────────
export function getBuilderName(builder: any): string {
  if (!builder) return '';
  if (typeof builder === 'string') return builder;
  if (typeof builder === 'object') return builder.name || '';
  return '';
}

// ── Normalise RERA number from either string or object ───────────────────────
export function getReraNumber(rera: any): string {
  if (!rera) return '';
  if (typeof rera === 'string') return rera;
  if (typeof rera === 'object') return rera.number || '';
  return '';
}

// ── Map API project → LocationPageTemplate project shape ─────────────────────
export function mapToTemplateProject(p: ApiProject) {
  return {
    name: p.name,
    price: p.priceDisplay || p.price || 'Price on Request',
    config: (p.configurations || []).slice(0, 3).map((c: string) => c.split('(')[0].trim()).join(', ') || '—',
    status: p.status,
    builder: getBuilderName(p.builder),
    slug: p.slug,
    location: p.location,
    heroImage: p.heroImage,
    isVerified: p.isVerified,
    isNew: p.isNew,
  };
}

// ── Core fetch helper ─────────────────────────────────────────────────────────
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Fetch projects with query params ─────────────────────────────────────────
export async function fetchApiProjects(params: {
  corridor?: string;
  city?: string;
  sector?: string;
  status?: string;
  config?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<ApiProject[]> {
  try {
    const qs = new URLSearchParams();
    if (params.corridor) qs.set('corridor', params.corridor);
    if (params.city) qs.set('city', params.city);
    if (params.sector) qs.set('sector', params.sector);
    if (params.status) qs.set('status', params.status);
    if (params.config) qs.set('config', params.config);
    if (params.featured) qs.set('featured', 'true');
    if (params.minPrice) qs.set('minPrice', String(params.minPrice));
    if (params.maxPrice) qs.set('maxPrice', String(params.maxPrice));
    if (params.sort) qs.set('sort', params.sort);
    qs.set('limit', String(params.limit || 20));
    qs.set('page', String(params.page || 1));

    const data = await apiFetch(`/projects?${qs}`);
    return data?.success ? data.data : [];
  } catch {
    return [];
  }
}

// ── Fetch projects filtered by BHK type (client-side regex filter) ───────────
export async function fetchProjectsByBHK(params: {
  bhk: '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | 'Penthouse';
  corridor?: string;
  status?: string;
  limit?: number;
}) {
  const allProjects = await fetchApiProjects({
    corridor: params.corridor,
    status: params.status,
    limit: params.limit || 60,
  });
  const pattern = new RegExp(params.bhk.replace(' ', '\\s*'), 'i');
  return allProjects
    .filter((p) => p.configurations?.some((c: string) => pattern.test(c)))
    .map(mapToTemplateProject);
}

// ── Fetch projects by budget (price in lakhs) ─────────────────────────────────
export async function fetchProjectsByBudget(params: {
  minPrice?: number;
  maxPrice?: number;
  corridor?: string;
  status?: string;
  limit?: number;
}) {
  const apiProjects = await fetchApiProjects({
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    corridor: params.corridor,
    status: params.status,
    limit: params.limit || 30,
  });
  return apiProjects.map(mapToTemplateProject);
}

// ── Fetch a single project by slug ────────────────────────────────────────────
export async function fetchProjectBySlug(slug: string): Promise<ApiProject | null> {
  try {
    const data = await apiFetch(`/projects/${slug}`);
    return data?.success ? data.data : null;
  } catch {
    return null;
  }
}

// ── Fetch all project slugs (for sitemap & generateStaticParams) ─────────────
export async function fetchAllProjectSlugs(): Promise<string[]> {
  try {
    const data = await apiFetch(`/projects?limit=200&sort=-createdAt&city=${CITY_FILTER}`);
    if (data?.success && data.data?.length > 0) {
      return data.data.map((p: ApiProject) => p.slug);
    }
    return [];
  } catch {
    return [];
  }
}

// ── Fetch related projects by corridor ───────────────────────────────────────
export async function fetchRelatedByCorridor(
  corridor: string,
  excludeSlug: string,
  limit = 3
): Promise<ApiProject[]> {
  try {
    const data = await apiFetch(
      `/projects?corridor=${encodeURIComponent(corridor)}&limit=${limit + 1}`
    );
    if (data?.success && data.data?.length > 0) {
      return data.data
        .filter((p: ApiProject) => p.slug !== excludeSlug)
        .slice(0, limit);
    }
    return [];
  } catch {
    return [];
  }
}

// ── Fetch related projects by budget range ────────────────────────────────────
export async function fetchRelatedByBudget(
  priceMin: number,
  priceMax: number,
  excludeSlug: string,
  limit = 3
): Promise<ApiProject[]> {
  try {
    const lo = Math.floor(priceMin * 0.5);
    const hi = Math.ceil(priceMax * 1.5);
    const data = await apiFetch(`/projects?minPrice=${lo}&maxPrice=${hi}&limit=${limit + 1}`);
    if (data?.success && data.data?.length > 0) {
      return data.data
        .filter((p: ApiProject) => p.slug !== excludeSlug)
        .slice(0, limit);
    }
    return [];
  } catch {
    return [];
  }
}

// ── Fetch projects — no static fallback, DB is the only source of truth ──────
export async function fetchProjectsWithFallback(params: {
  corridor?: string;
  sector?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
} = {}) {
  const apiProjects = await fetchApiProjects({ sort: '-createdAt', ...params });
  return apiProjects.map(mapToTemplateProject);
}
