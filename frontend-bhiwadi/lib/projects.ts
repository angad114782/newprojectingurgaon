// All project data is served from the database via /api/projects
// This file contains only static types and navigation data

export const UNSPLASH = {
  luxury1: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  luxury2: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  luxury3: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  luxury4: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  luxury5: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
  luxury6: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
  luxury7: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  luxury8: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
  luxury9: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  luxury10: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  luxury11: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  luxury12: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  clubhouse: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80',
  interior: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
  bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
  lobby: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  terrace: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  garden: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  bhiwadi: 'https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?w=1200&q=80',
  hero: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=80',
  hero2: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',
};

export interface Project {
  slug: string;
  name: string;
  builder: string;
  builderLogo?: string;
  location: string;
  sector: string;
  corridor: string;
  status: 'New Launch' | 'Pre Launch' | 'Under Construction' | 'Ready To Move';
  price: string;
  pricePerSqft: string;
  priceMin: number;
  priceMax: number;
  configurations: string[];
  possession: string;
  totalUnits: number;
  totalTowers: number;
  totalArea: string;
  floors: string;
  rera: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  shortDescription: string;
  description: string;
  highlights: string[];
  amenities: string[];
  connectivity: string[];
  nearbyLandmarks: string[];
  floorPlans: Array<{ config: string; area: string; price: string }>;
  gallery: string[];
  heroImage: string;
  tags: string[];
  appreciationRate: string;
  rentalYield: string;
  whyBuy: string[];
  faqs: Array<{ q: string; a: string }>;
}

// No static project data — all projects come from the database
export const ALL_PROJECTS: Project[] = [];

// Static navigation pages (used for SEO interlinking — not DB-driven)
export const ALL_SEO_PAGES = [
  // Intent / overview pages
  { title: 'Property in Bhiwadi',                      url: '/residential-property-in-bhiwadi' },
  { title: 'New Launch Projects in Bhiwadi',            url: '/new-launch-bhiwadi' },
  { title: 'New Projects in Bhiwadi',                   url: '/new-projects-in-bhiwadi' },
  { title: 'Plots in Bhiwadi',                          url: '/plots-in-bhiwadi' },
  { title: 'Flats in Bhiwadi',                          url: '/flats-in-bhiwadi' },
  // Corridor pages
  { title: 'Alwar Bypass Road Projects',                url: '/alwar-bypass-road-projects' },
  { title: 'NH-48 Bhiwadi Projects',                    url: '/nh-48-bhiwadi-projects' },
  { title: 'Tapukara Bhiwadi Projects',                 url: '/tapukara-bhiwadi-projects' },
  { title: 'Neemrana Bhiwadi Projects',                 url: '/neemrana-bhiwadi-projects' },
  { title: 'Khushkhera Bhiwadi Projects',               url: '/khushkhera-bhiwadi-projects' },
  { title: 'Bhiwadi Extension Projects',                url: '/bhiwadi-extension-projects' },
  // BHK-specific pages
  { title: '2 BHK Flats in Bhiwadi',                   url: '/2-bhk-flats-bhiwadi' },
  { title: '3 BHK Flats in Bhiwadi',                   url: '/3-bhk-flats-bhiwadi' },
  { title: 'Industrial Plots in Bhiwadi',               url: '/industrial-plots-bhiwadi' },
  // Budget pages
  { title: 'Flats Under 30 Lakh in Bhiwadi',           url: '/flats-under-30-lakh-bhiwadi' },
  { title: 'Flats Under 50 Lakh in Bhiwadi',           url: '/flats-under-50-lakh-bhiwadi' },
  // Intent pages
  { title: 'Ready to Move Property in Bhiwadi',        url: '/ready-to-move-bhiwadi' },
];

// Static corridor nav (used for header/footer links)
export const CORRIDORS = [
  { name: 'Alwar Bypass Road',   slug: 'alwar-bypass-road-projects',  count: '20+' },
  { name: 'NH-48 Highway',       slug: 'nh-48-bhiwadi-projects',       count: '18+' },
  { name: 'Tapukara',            slug: 'tapukara-bhiwadi-projects',    count: '12+' },
  { name: 'Neemrana',            slug: 'neemrana-bhiwadi-projects',    count: '10+' },
  { name: 'Khushkhera',          slug: 'khushkhera-bhiwadi-projects',  count: '8+' },
  { name: 'Bhiwadi Extension',   slug: 'bhiwadi-extension-projects',   count: '15+' },
];

// Deprecated: TESTIMONIALS and MARKET_STATS are now served from /api/settings
// kept as empty for any legacy imports
export const TESTIMONIALS: any[] = [];
export const MARKET_STATS = {};
