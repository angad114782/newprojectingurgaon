const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export interface SiteSettings {
  _id?: string;
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  streetAddress: string;
  postalCode: string;
  openingHours: string;
  geoLat: string;
  geoLng: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;
  ga4Id: string;
  marketStats: {
    totalProjects: string;
    familiesHelped: string;
    topBuilders: string;
    avgAppreciation: string;
    avgRentalYield: string;
    yearsActive: string;
    reviewCount: string;
    rating: string;
  };
  testimonials: Array<{
    _id?: string;
    name: string;
    city: string;
    role: string;
    review: string;
    rating: number;
    avatar: string;
    project: string;
  }>;
  locations: Array<{
    _id?: string;
    name: string;
    projects: string;
    icon: string;
    href: string;
    highlight: string;
    img: string;
    color: string;
  }>;
  builders: Array<{
    _id?: string;
    name: string;
    img?: string;
    website?: string;
  }>;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
  };
  faqs: Array<{ _id?: string; q: string; a: string }>;
  heroImages: string[];
  heroTagline: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroCTAPrimary: string;
  heroCTASecondary: string;
  heroImageUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'GurgaonRealty',
  phone: '+91-9999999999',
  whatsapp: '919999999999',
  email: 'info@gurgaonrealty.in',
  address: 'DLF Cyber City, Gurgaon, Haryana 122002',
  streetAddress: 'DLF Cyber City',
  postalCode: '122002',
  openingHours: 'Mon–Sun: 9 AM – 8 PM',
  geoLat: '28.4595',
  geoLng: '77.0266',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: [],
  ogImage: '/og-home.jpg',
  ga4Id: '',
  marketStats: {
    totalProjects: '150+',
    familiesHelped: '4,200+',
    topBuilders: '50+',
    avgAppreciation: '32%',
    avgRentalYield: '3.5%',
    yearsActive: '5+',
    reviewCount: '847',
    rating: '4.9',
  },
  testimonials: [],
  locations: [],
  builders: [],
  social: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' },
  faqs: [],
  heroImages: [],
  heroTagline: "Gurgaon's #1 Real Estate Advisory",
  heroTitle: 'New Projects in Gurgaon 2025',
  heroTitleAccent: '',
  heroSubtitle: '150+ verified new launch, pre-launch and ready-to-move properties. Free site visit. Transparent pricing. RERA approved.',
  heroCTAPrimary: '🏠 Book Free Site Visit',
  heroCTASecondary: 'View New Launches →',
  heroImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85',
};

// Server-side fetch with Next.js cache (5 min revalidate)
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/settings`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    if (data?.success && data.data) {
      return { ...DEFAULT_SETTINGS, ...data.data };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Client-side fetch (no cache headers, for admin panel)
export async function fetchSettingsClient(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/settings`);
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    if (data?.success && data.data) {
      return { ...DEFAULT_SETTINGS, ...data.data };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<SiteSettings>, token: string): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return data?.success ? { ...DEFAULT_SETTINGS, ...data.data } : null;
  } catch {
    return null;
  }
}
