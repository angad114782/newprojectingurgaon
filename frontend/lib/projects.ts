// Central project data — based on real 2025 Gurgaon market research
// Images from Unsplash (free, no attribution needed)

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
  // Amenities
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  clubhouse: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80',
  interior: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
  bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
  lobby: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  terrace: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  garden: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  // Locations
  gurgaon: 'https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?w=1200&q=80',
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
  corridor: string; // Dwarka Expressway, Golf Course Ext Road, etc.
  status: 'New Launch' | 'Pre Launch' | 'Under Construction' | 'Ready To Move';
  price: string;
  pricePerSqft: string;
  priceMin: number; // in Lakhs — for budget-based filtering
  priceMax: number;
  configurations: string[];
  possession: string;
  totalUnits: number;
  totalTowers: number;
  totalArea: string; // acres
  floors: string;
  rera: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean; // launched in last 6 months
  shortDescription: string;
  description: string;
  highlights: string[];
  amenities: string[];
  connectivity: string[];
  nearbyLandmarks: string[];
  floorPlans: Array<{ config: string; area: string; price: string }>;
  gallery: string[];
  heroImage: string;
  tags: string[]; // for filtering
  appreciationRate: string;
  rentalYield: string;
  whyBuy: string[];
  faqs: Array<{ q: string; a: string }>;
}

export const ALL_PROJECTS: Project[] = [
  {
    slug: 'sobha-altus-sector-106-gurgaon',
    name: 'Sobha Altus',
    builder: 'Sobha Limited',
    location: 'Sector 106, Dwarka Expressway, Gurgaon',
    sector: 'Sector 106',
    corridor: 'Dwarka Expressway',
    status: 'New Launch',
    price: '₹3.1 Cr – ₹4.65 Cr',
    pricePerSqft: '₹13,500 – ₹16,000',
    priceMin: 310,
    priceMax: 465,
    configurations: ['2 BHK (1,850 sqft)', '3 BHK (2,450 sqft)', '4 BHK (3,200 sqft)'],
    possession: 'December 2028',
    totalUnits: 835,
    totalTowers: 5,
    totalArea: '6.5 Acres',
    floors: 'G+42',
    rera: 'RERA/GGM/2024/589',
    isVerified: true,
    isFeatured: true,
    isNew: true,
    shortDescription: 'Sobha\'s latest ultra-luxury high-rise on Dwarka Expressway — exceptional build quality with iconic design.',
    description: 'Sobha Altus redefines luxury living on Dwarka Expressway with its iconic twin-tower design rising 42 floors above Sector 106. Developed by Sobha Limited — India\'s most quality-conscious developer — this project offers spacious 2, 3 and 4 BHK sky residences with panoramic views of the Aravallis and the Delhi skyline. Every home is designed with Sobha\'s signature quality: reinforced concrete, imported marble, premium kitchen fittings and double-glazed windows. The project is IGBC Gold Pre-certified for sustainability.',
    highlights: [
      'Sobha\'s iconic quality — in-house construction, zero outsourcing',
      'Panoramic Aravalli views from 25th floor onwards',
      'IGBC Green Gold certified sustainable project',
      'Private elevator lobbies on premium floors',
      '5-minute drive to IGI Airport',
      'RERA registered — transparent pricing',
      'Construction-linked payment plan available',
    ],
    amenities: ['Clubhouse (60,000 sqft)', 'Infinity Pool', 'Sky Lounge (40F)', 'Gym & Yoga Studio', 'Squash & Tennis Courts', 'Jogging Track', 'Co-working Space', 'Kids Zone', 'Home Theatre Room', 'Concierge Services', 'EV Charging Points', 'Golf Simulator'],
    connectivity: [
      'IGI Airport — 5 minutes via Dwarka Expressway',
      'Dwarka Sector 21 Metro — 8 km',
      'NH-48 (Delhi–Jaipur Highway) — 2 km',
      'Cyber City, Gurgaon — 20 min',
      'Delhi (Dhaula Kuan) — 12 km',
      'Proposed Metro Phase II stop — 1.5 km',
    ],
    nearbyLandmarks: ['Ryan International School — 3 km', 'Medanta Hospital — 14 km', 'Ambience Mall — 10 km', 'CISF Campus — 4 km', 'Diplomatic Enclave — 10 km'],
    floorPlans: [
      { config: '2 BHK', area: '1,850 sqft', price: '₹3.1 Cr onwards' },
      { config: '3 BHK', area: '2,450 sqft', price: '₹3.9 Cr onwards' },
      { config: '4 BHK', area: '3,200 sqft', price: '₹4.65 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury1, UNSPLASH.luxury4, UNSPLASH.pool, UNSPLASH.gym, UNSPLASH.interior, UNSPLASH.bedroom],
    heroImage: UNSPLASH.luxury1,
    tags: ['luxury', 'new-launch', 'dwarka-expressway', 'sobha', 'sector-106'],
    appreciationRate: '35–40% (3Y)',
    rentalYield: '3.2%',
    whyBuy: ['Best-in-class Sobha construction quality', 'Airport zone — 5 min to IGI', 'Limited units ensure scarcity premium', 'Highest ROI corridor in Gurgaon'],
    faqs: [
      { q: 'What is the starting price of Sobha Altus?', a: 'Sobha Altus starts from ₹3.1 Cr for a 2 BHK (1,850 sqft). The price includes basic cost; additional charges like PLC, EDC/IDC and parking apply.' },
      { q: 'What is the possession timeline?', a: 'Possession is expected by December 2028. Sobha Limited has a strong track record of on-time delivery across all its projects.' },
      { q: 'Is Sobha Altus RERA registered?', a: 'Yes. RERA Number: RERA/GGM/2024/589. Verify at haryanarera.gov.in.' },
    ],
  },
  {
    slug: 'dlf-the-crest-gurgaon',
    name: 'DLF The Crest',
    builder: 'DLF Limited',
    location: 'Sector 54, Golf Course Road, Gurgaon',
    sector: 'Sector 54',
    corridor: 'Golf Course Road',
    status: 'Ready To Move',
    price: '₹2.5 Cr – ₹8 Cr',
    pricePerSqft: '₹18,000 – ₹25,000',
    priceMin: 250,
    priceMax: 800,
    configurations: ['3 BHK (2,300 sqft)', '4 BHK (3,500 sqft)', 'Penthouse (6,500+ sqft)'],
    possession: 'Ready',
    totalUnits: 360,
    totalTowers: 5,
    totalArea: '18 Acres',
    floors: 'G+43',
    rera: 'RERA/GGM/2018/201',
    isVerified: true,
    isFeatured: true,
    isNew: false,
    shortDescription: 'DLF\'s most iconic ultra-luxury tower on Golf Course Road — ready to move, maximum privacy.',
    description: 'DLF The Crest stands as Gurgaon\'s most coveted ultra-luxury address — 5 iconic towers on Golf Course Road offering the best of DLF 5 living. Each residence has panoramic city views, private elevator lobbies, imported marble floors and a 43-storey sky lounge. The Crest is ready to move, eliminating construction risk while offering immediate possession and rental income potential.',
    highlights: [
      'Ready to move — immediate possession, no wait',
      'Golf Course Road\'s most iconic luxury address',
      'Private elevator lobby on every floor',
      'Sky Lounge and infinity pool on 43rd floor',
      'DLF 5 micro-market — highest resale premium in Gurgaon',
      'Strong NRI and HNI demand drives values',
    ],
    amenities: ['Grand Clubhouse', 'Infinity Sky Pool', 'Spa & Wellness', 'Golf Simulator', 'Squash & Tennis', 'Fine Dining', 'Business Centre', 'Concierge & Valet', '5-Tier Security', 'Kids\' Club', 'Party Terrace'],
    connectivity: ['Cyber City — 5 km', 'Huda City Centre Metro — 4 km', 'IGI Airport — 30 min', 'MG Road — 3 km', 'DLF Cyberhub — 6 km', 'Rapid Metro Golf Course — adjacent'],
    nearbyLandmarks: ['DLF Mega Mall — 1 km', 'Fortis Hospital — 3 km', 'Shri Ram School — 2 km', 'American Express — 3 km', 'Rapid Metro Station — 500m'],
    floorPlans: [
      { config: '3 BHK', area: '2,300 sqft', price: '₹2.5 Cr onwards' },
      { config: '4 BHK', area: '3,500 sqft', price: '₹4.5 Cr onwards' },
      { config: 'Penthouse', area: '6,500+ sqft', price: '₹8 Cr+' },
    ],
    gallery: [UNSPLASH.luxury4, UNSPLASH.luxury2, UNSPLASH.pool, UNSPLASH.lobby, UNSPLASH.bedroom, UNSPLASH.interior],
    heroImage: UNSPLASH.luxury4,
    tags: ['luxury', 'ready-to-move', 'golf-course-road', 'dlf', 'ultra-luxury'],
    appreciationRate: '20–28% (3Y)',
    rentalYield: '2.8%',
    whyBuy: ['Ready to move — zero construction risk', 'Gurgaon\'s most iconic address', 'Highest resale premium market', 'Strong NRI investment demand'],
    faqs: [
      { q: 'Is DLF The Crest ready to move?', a: 'Yes. DLF The Crest is fully ready with OC received. You can take immediate possession and start living or renting from day one.' },
      { q: 'What is the resale value of DLF The Crest?', a: 'DLF The Crest commands a significant resale premium in DLF 5 — one of Gurgaon\'s highest-value micro-markets. Units appreciate 15–20% over 3 years.' },
    ],
  },
  {
    slug: 'm3m-altitude-sector-65-gurgaon',
    name: 'M3M Altitude',
    builder: 'M3M India',
    location: 'Sector 65, SPR Road, Gurgaon',
    sector: 'Sector 65',
    corridor: 'SPR Road',
    status: 'Under Construction',
    price: '₹1.8 Cr – ₹3.2 Cr',
    pricePerSqft: '₹10,500 – ₹13,000',
    priceMin: 180,
    priceMax: 320,
    configurations: ['2 BHK (1,600 sqft)', '3 BHK (2,100 sqft)', '3.5 BHK (2,500 sqft)'],
    possession: 'March 2027',
    totalUnits: 650,
    totalTowers: 4,
    totalArea: '8 Acres',
    floors: 'G+38',
    rera: 'RERA/GGM/2023/445',
    isVerified: true,
    isFeatured: true,
    isNew: false,
    shortDescription: 'M3M\'s premium high-rise on SPR Road with resort-style amenities and strong investment potential.',
    description: 'M3M Altitude on Southern Peripheral Road offers premium sky-high living with resort-inspired amenities across 8 acres. The project is strategically positioned between Golf Course Extension Road and Sohna Road — commanding strong end-user and investor demand. M3M\'s track record of timely delivery and quality assurance makes this a trusted investment.',
    highlights: ['Strategic SPR Road location — connects GCER to Sohna Road', 'Resort-style amenities on 5-acre podium', 'RERA-compliant construction-linked payment', 'Strong rental demand from Cyber City professionals', '3.5 BHK — rare configuration with high demand'],
    amenities: ['Resort-Style Clubhouse', 'Temperature-Controlled Pool', 'Gymnasium', 'Meditation Deck', 'Cricket Net', 'Basketball Court', 'Kids Splash Zone', 'Co-Working Lounge', 'Amphitheatre', 'Party Lawn'],
    connectivity: ['Cyber City — 15 km', 'Golf Course Extension Road — 3 km', 'Sohna Road — 4 km', 'NH-48 — 12 km', 'South Point Mall — 6 km', 'IGI Airport — 35 min'],
    nearbyLandmarks: ['GD Goenka School — 5 km', 'Fortis Hospital — 8 km', 'M3M Golfestate — adjacent', 'Vatika Chowk — 7 km'],
    floorPlans: [
      { config: '2 BHK', area: '1,600 sqft', price: '₹1.8 Cr onwards' },
      { config: '3 BHK', area: '2,100 sqft', price: '₹2.4 Cr onwards' },
      { config: '3.5 BHK', area: '2,500 sqft', price: '₹3.2 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury3, UNSPLASH.luxury5, UNSPLASH.pool, UNSPLASH.clubhouse, UNSPLASH.interior, UNSPLASH.garden],
    heroImage: UNSPLASH.luxury3,
    tags: ['premium', 'under-construction', 'spr-road', 'm3m', 'sector-65'],
    appreciationRate: '28–35% (3Y)',
    rentalYield: '3.0%',
    whyBuy: ['SPR — connects two premium corridors', 'Resort lifestyle at mid-premium price', 'M3M\'s on-time delivery history', 'Strong NRI and investor demand'],
    faqs: [
      { q: 'What is M3M Altitude possession date?', a: 'M3M Altitude is expected to offer possession by March 2027. M3M India has a strong track record of on-time or early delivery across its Gurgaon projects.' },
    ],
  },
  {
    slug: 'godrej-meridien-gurgaon',
    name: 'Godrej Meridien',
    builder: 'Godrej Properties',
    location: 'Sector 106, Dwarka Expressway, Gurgaon',
    sector: 'Sector 106',
    corridor: 'Dwarka Expressway',
    status: 'Under Construction',
    price: '₹95 Lakh – ₹2.2 Cr',
    pricePerSqft: '₹8,000 – ₹9,500',
    priceMin: 95,
    priceMax: 220,
    configurations: ['2 BHK (1,150 sqft)', '3 BHK (1,680 sqft)', '4 BHK (2,400 sqft)'],
    possession: 'March 2026',
    totalUnits: 1100,
    totalTowers: 7,
    totalArea: '15 Acres',
    floors: 'G+36',
    rera: 'RERA/GGM/2021/389',
    isVerified: true,
    isFeatured: true,
    isNew: false,
    shortDescription: 'Godrej\'s premium mid-size project on Dwarka Expressway — near possession, transparent pricing.',
    description: 'Godrej Meridien in Sector 106 is a large-format premium residential development offering spacious 2, 3 and 4 BHK apartments with French-themed design and world-class lifestyle infrastructure. Nearing possession with strong OC prospects, Godrej Meridien is ideal for both end-users and investors seeking a near-ready premium home on Dwarka Expressway.',
    highlights: ['Nearing possession — March 2026', 'Godrej\'s transparent pricing, no hidden charges', '15-acre French-themed township', 'Strong rental demand due to airport proximity', 'IGBC Green Gold certification'],
    amenities: ['Grand Clubhouse', 'Olympic Pool', 'Gym', 'Squash Court', 'Tennis Court', 'Jogging Track', 'Kids Zone', 'Amphitheatre', 'Party Hall', 'EV Charging', '5-Tier Security'],
    connectivity: ['IGI Airport — 18 min', 'Dwarka Sector 21 Metro — 9 km', 'NH-48 — 4 km', 'Cyber City — 22 min', 'Palam Vihar Market — 6 km'],
    nearbyLandmarks: ['Ryan International School — 4 km', 'Fortis Hospital — 18 km', 'Ambience Mall — 11 km', 'Ansal University — 5 km'],
    floorPlans: [
      { config: '2 BHK', area: '1,150 sqft', price: '₹95 Lakh onwards' },
      { config: '3 BHK', area: '1,680 sqft', price: '₹1.4 Cr onwards' },
      { config: '4 BHK', area: '2,400 sqft', price: '₹2.2 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury5, UNSPLASH.luxury3, UNSPLASH.pool, UNSPLASH.gym, UNSPLASH.interior, UNSPLASH.garden],
    heroImage: UNSPLASH.luxury5,
    tags: ['premium', 'under-construction', 'dwarka-expressway', 'godrej', 'sector-106'],
    appreciationRate: '30–38% (3Y)',
    rentalYield: '3.4%',
    whyBuy: ['Nearing possession — minimal wait risk', 'Godrej brand trust and ethics', 'Best-value 4BHK on Dwarka Expressway', 'Strong rental demand from airport zone'],
    faqs: [
      { q: 'Is Godrej Meridien near possession?', a: 'Yes. Godrej Meridien is in its final stages with possession expected March 2026. Construction is 90%+ complete.' },
      { q: 'What is the price of 3 BHK in Godrej Meridien?', a: '3 BHK in Godrej Meridien starts from ₹1.4 Cr (₹8,500/sqft for 1,680 sqft). The price includes basic cost; PLC, EDC/IDC and parking are additional.' },
    ],
  },
  {
    slug: 'sobha-city-gurgaon',
    name: 'Sobha City Gurgaon',
    builder: 'Sobha Limited',
    location: 'Sector 108, Dwarka Expressway, Gurgaon',
    sector: 'Sector 108',
    corridor: 'Dwarka Expressway',
    status: 'Under Construction',
    price: '₹1 Cr – ₹2.5 Cr',
    pricePerSqft: '₹8,500 – ₹9,800',
    priceMin: 100,
    priceMax: 250,
    configurations: ['2 BHK (1,250 sqft)', '3 BHK (1,680 sqft)', '4 BHK (2,400 sqft)'],
    possession: 'December 2025',
    totalUnits: 1200,
    totalTowers: 8,
    totalArea: '40 Acres',
    floors: 'G+38',
    rera: 'RERA/GGM/2021/452',
    isVerified: true,
    isFeatured: false,
    isNew: false,
    shortDescription: 'Sobha\'s largest township on Dwarka Expressway — Japanese-inspired design, exceptional quality.',
    description: 'Sobha City Gurgaon is a 40-acre integrated township in Sector 108 offering spacious 2, 3 and 4 BHK apartments. Designed with Japanese-style zen landscaping, the project features Sobha\'s signature quality construction — in-house manufacturing ensures every detail exceeds expectations. With possession scheduled for December 2025, this is one of Gurgaon\'s most anticipated near-ready large-format townships.',
    highlights: ['40-acre integrated township', 'Japanese zen landscaping design', 'In-house construction — Sobha quality guarantee', 'Dual road frontage — Expressway and CPR Road', 'IGBC Green Gold certified'],
    amenities: ['Clubhouse (50,000 sqft)', 'Olympic Pool', 'Gym & Yoga', 'Tennis & Badminton', 'Jogging Track', 'Kids Zone', 'Concierge', 'Banquet Hall', 'Party Lawn', 'Temple', 'EV Charging'],
    connectivity: ['IGI Airport — 20 min', 'Dwarka Metro — 11 km', 'NH-48 — 3 km', 'Cyber City — 22 min', 'Sheetla Mata Mandir — 4 km'],
    nearbyLandmarks: ['DPS Dwarka — 8 km', 'Fortis Hospital — 19 km', 'Pacific D21 Mall — 7 km', 'CISF Campus — 5 km'],
    floorPlans: [
      { config: '2 BHK', area: '1,250 sqft', price: '₹1 Cr onwards' },
      { config: '3 BHK', area: '1,680 sqft', price: '₹1.6 Cr onwards' },
      { config: '4 BHK', area: '2,400 sqft', price: '₹2.5 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury8, UNSPLASH.luxury6, UNSPLASH.pool, UNSPLASH.clubhouse, UNSPLASH.bedroom, UNSPLASH.terrace],
    heroImage: UNSPLASH.luxury8,
    tags: ['premium', 'under-construction', 'dwarka-expressway', 'sobha', 'sector-108'],
    appreciationRate: '28–35% (3Y)',
    rentalYield: '3.5%',
    whyBuy: ['Largest Sobha township in Gurgaon', 'Near-possession — December 2025', 'Japanese design — unique lifestyle', 'Airport zone premium — Sector 108'],
    faqs: [
      { q: 'What is the size of Sobha City township?', a: 'Sobha City Gurgaon is spread across 40 acres in Sector 108 — one of the largest gated communities on Dwarka Expressway.' },
    ],
  },
  {
    slug: 'krisumi-waterside-residences-gurgaon',
    name: 'Krisumi Waterside Residences',
    builder: 'Krisumi Corporation',
    location: 'Sector 36A, Dwarka Expressway, Gurgaon',
    sector: 'Sector 36A',
    corridor: 'Dwarka Expressway',
    status: 'New Launch',
    price: '₹1.2 Cr – ₹2.8 Cr',
    pricePerSqft: '₹9,500 – ₹12,000',
    priceMin: 120,
    priceMax: 280,
    configurations: ['2 BHK (1,350 sqft)', '3 BHK (1,900 sqft)', '4 BHK (2,650 sqft)'],
    possession: 'June 2028',
    totalUnits: 750,
    totalTowers: 5,
    totalArea: '12 Acres',
    floors: 'G+40',
    rera: 'RERA/GGM/2024/612',
    isVerified: true,
    isFeatured: true,
    isNew: true,
    shortDescription: 'Indo-Japanese collaboration — Krisumi\'s waterfront luxury living at launch pricing on Dwarka Expressway.',
    description: 'Krisumi Waterside Residences is a landmark Indo-Japanese collaboration between Krishna Group and Sumitomo Corporation — bringing Japanese precision and Indian warmth to Gurgaon real estate. The project features a stunning water body as the centerpiece, surrounded by lush Japanese gardens and residences designed with minimalist elegance.',
    highlights: ['Indo-Japanese collaboration — Krishna Group x Sumitomo', 'Stunning water body as central feature', 'Japanese minimalist design philosophy', 'Sumitomo\'s engineering precision', 'New launch — best entry pricing'],
    amenities: ['Waterfront Clubhouse', 'Japanese Water Garden', 'Infinity Pool', 'Onsen (Japanese Spa)', 'Gymnasium', 'Meditation Pavilion', 'Co-Working', 'Kids Zone', 'Amphitheatre'],
    connectivity: ['IGI Airport — 15 min', 'NH-48 — 2 km', 'Dwarka Metro — 9 km', 'Cyber City — 20 min', 'Delhi border — 2 km'],
    nearbyLandmarks: ['Ryan International — 3 km', 'Sheetla Mata Mandir — 5 km', 'Pacific D21 Mall — 8 km'],
    floorPlans: [
      { config: '2 BHK', area: '1,350 sqft', price: '₹1.2 Cr onwards' },
      { config: '3 BHK', area: '1,900 sqft', price: '₹1.85 Cr onwards' },
      { config: '4 BHK', area: '2,650 sqft', price: '₹2.8 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury7, UNSPLASH.luxury2, UNSPLASH.pool, UNSPLASH.lobby, UNSPLASH.interior, UNSPLASH.garden],
    heroImage: UNSPLASH.luxury7,
    tags: ['luxury', 'new-launch', 'dwarka-expressway', 'krisumi', 'japanese-design'],
    appreciationRate: '35–45% (3Y)',
    rentalYield: '3.3%',
    whyBuy: ['Unique Indo-Japanese concept — unmatched in NCR', 'New launch pricing — get before price hike', 'Sumitomo engineering quality', 'Best waterfront design in Gurgaon'],
    faqs: [
      { q: 'Who is Krisumi Corporation?', a: 'Krisumi is a joint venture between Krishna Group (India) and Sumitomo Corporation (Japan) — bringing Japanese construction standards to Indian real estate. Their first Gurgaon project, Krisumi Waterfall Residences, delivered on time with exceptional quality.' },
    ],
  },
  {
    slug: 'emaar-digihomes-gurgaon',
    name: 'Emaar Digi Homes',
    builder: 'Emaar India',
    location: 'Sector 62, Golf Course Extension Road, Gurgaon',
    sector: 'Sector 62',
    corridor: 'Golf Course Extension Road',
    status: 'Ready To Move',
    price: '₹1.2 Cr – ₹3 Cr',
    pricePerSqft: '₹9,800 – ₹13,000',
    priceMin: 120,
    priceMax: 300,
    configurations: ['2 BHK (1,200 sqft)', '3 BHK (1,850 sqft)'],
    possession: 'Ready',
    totalUnits: 460,
    totalTowers: 4,
    totalArea: '10 Acres',
    floors: 'G+35',
    rera: 'RERA/GGM/2020/298',
    isVerified: true,
    isFeatured: true,
    isNew: false,
    shortDescription: 'Emaar\'s smart-home community on Golf Course Extension — ready to move, premium tech features.',
    description: 'Emaar Digi Homes is a ready-to-move smart-home residential community on Golf Course Extension Road. Developed by Emaar India — the subsidiary of Dubai\'s largest real estate developer — the project features integrated smart-home technology, premium specifications and excellent lifestyle infrastructure. All homes are digitally connected with smart locks, automated lighting and energy management.',
    highlights: ['Ready to move — immediate possession', 'Emaar\'s Dubai-standard quality', 'Smart-home technology integrated', 'Golf Course Extension Road address', 'Emaar brand — strong resale premium'],
    amenities: ['Smart Clubhouse', 'Pool', 'Gym', 'Smart Co-Work', 'EV Zone', 'Tennis', 'Kids Smart Zone', 'Party Hall', 'Amphitheatre'],
    connectivity: ['Cyber City — 10 km', 'NH-48 — 8 km', 'IGI Airport — 28 min', 'Vatika Chowk — 5 km', 'Golf Course Road — 8 km'],
    nearbyLandmarks: ['GD Goenka School — 4 km', 'South Point Mall — 5 km', 'Emaar Palm Hills — adjacent'],
    floorPlans: [
      { config: '2 BHK', area: '1,200 sqft', price: '₹1.2 Cr onwards' },
      { config: '3 BHK', area: '1,850 sqft', price: '₹2 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury9, UNSPLASH.luxury6, UNSPLASH.pool, UNSPLASH.gym, UNSPLASH.interior, UNSPLASH.terrace],
    heroImage: UNSPLASH.luxury9,
    tags: ['smart-home', 'ready-to-move', 'golf-course-extension', 'emaar', 'sector-62'],
    appreciationRate: '22–28% (3Y)',
    rentalYield: '3.1%',
    whyBuy: ['Ready to move — start living immediately', 'Emaar brand — Dubai quality in Gurgaon', 'Smart-home tech — unique in this price range', 'Strong rental demand from Golf Course corridor'],
    faqs: [
      { q: 'Is Emaar Digi Homes ready to move?', a: 'Yes, Emaar Digi Homes has received its OC and all units are ready for immediate possession.' },
    ],
  },
  {
    slug: 'signature-global-city-37d-gurgaon',
    name: 'Signature Global City 37D',
    builder: 'Signature Global',
    location: 'Sector 37D, Dwarka Expressway, Gurgaon',
    sector: 'Sector 37D',
    corridor: 'Dwarka Expressway',
    status: 'New Launch',
    price: '₹45 Lakh – ₹90 Lakh',
    pricePerSqft: '₹4,500 – ₹5,500',
    priceMin: 45,
    priceMax: 90,
    configurations: ['2 BHK (870 sqft)', '3 BHK (1,200 sqft)'],
    possession: 'December 2027',
    totalUnits: 1400,
    totalTowers: 12,
    totalArea: '20 Acres',
    floors: 'G+25',
    rera: 'RERA/GGM/2024/534',
    isVerified: true,
    isFeatured: false,
    isNew: true,
    shortDescription: 'Signature Global\'s DDJAY affordable housing — best-value new launch for first-time homebuyers.',
    description: 'Signature Global City 37D is one of Gurgaon\'s most sought-after affordable housing projects under the Deen Dayal Jan Awas Yojana (DDJAY) scheme. Developed by Signature Global — Gurgaon\'s leading affordable housing developer — the project offers 2 and 3 BHK homes at prices starting ₹45 Lakh with RERA protection and solid metro connectivity.',
    highlights: ['DDJAY scheme — government-backed affordable housing', 'Signature Global\'s proven delivery track record', 'Best price per sqft in Gurgaon with metro access', 'Metro Yellow Line at Sector 37 — 3 km', 'Ideal for first-time buyers under ₹75 Lakh budget'],
    amenities: ['Clubhouse', 'Pool', 'Gym', 'Kids Zone', 'Jogging Track', '24/7 Security', 'Community Hall', 'Park'],
    connectivity: ['Metro Sector 37 — 3 km', 'NH-48 — 5 km', 'Hero Honda Chowk — 5 km', 'Gurgaon Railway Station — 12 km'],
    nearbyLandmarks: ['Sector 37 Metro Station — 3 km', 'IMT Manesar — 18 km', 'Pataudi Road — adjacent'],
    floorPlans: [
      { config: '2 BHK', area: '870 sqft', price: '₹45 Lakh onwards' },
      { config: '3 BHK', area: '1,200 sqft', price: '₹70 Lakh onwards' },
    ],
    gallery: [UNSPLASH.luxury10, UNSPLASH.luxury11, UNSPLASH.pool, UNSPLASH.gym, UNSPLASH.interior, UNSPLASH.garden],
    heroImage: UNSPLASH.luxury10,
    tags: ['affordable', 'new-launch', 'sector-37d', 'signature-global', 'ddjay', 'first-time-buyer'],
    appreciationRate: '18–22% (3Y)',
    rentalYield: '4.5%',
    whyBuy: ['Most affordable RERA project in Gurgaon', 'DDJAY — government scheme protection', 'Signature Global\'s on-time delivery', 'High rental yield from industrial demand'],
    faqs: [
      { q: 'What is DDJAY scheme in Gurgaon?', a: 'Deen Dayal Jan Awas Yojana (DDJAY) is a Haryana government scheme for affordable housing under ₹10 Lakh per unit cost for builders. The scheme limits developer margins, ensuring lower prices for buyers.' },
    ],
  },
  {
    slug: 'tata-one-gurgaon-sector-72',
    name: 'Tata One Gurgaon',
    builder: 'Tata Housing',
    location: 'Sector 72, Golf Course Extension Road, Gurgaon',
    sector: 'Sector 72',
    corridor: 'Golf Course Extension Road',
    status: 'New Launch',
    price: '₹60 Lakh – ₹1.5 Cr',
    pricePerSqft: '₹5,800 – ₹7,500',
    priceMin: 60,
    priceMax: 150,
    configurations: ['1 BHK (650 sqft)', '2 BHK (1,050 sqft)', '3 BHK (1,550 sqft)'],
    possession: 'December 2027',
    totalUnits: 900,
    totalTowers: 7,
    totalArea: '18 Acres',
    floors: 'G+30',
    rera: 'RERA/GGM/2024/491',
    isVerified: true,
    isFeatured: false,
    isNew: true,
    shortDescription: 'Tata Housing\'s new integrated township — premium lifestyle, Tata ethics and on-time delivery guarantee.',
    description: 'Tata One Gurgaon is an integrated township by Tata Housing — India\'s most ethical real estate developer. Spread across 18 acres in Sector 72 on Golf Course Extension Road, the project offers 1, 2 and 3 BHK residences with premium lifestyle infrastructure and Tata\'s signature transparency in pricing and delivery.',
    highlights: ['Tata Housing — India\'s most trusted developer', 'Transparent pricing — no hidden charges', 'Integrated 18-acre township with all amenities', 'Launch pricing — best time to invest', '1 BHK available — ideal for single professionals'],
    amenities: ['Clubhouse', 'Pool', 'Gym', 'Tennis & Badminton', 'Kids Zone', 'Jogging Track', 'Co-Working Hub', 'Mini Theatre', 'Party Hall'],
    connectivity: ['Sohna Road — 5 km', 'NH-48 — 12 km', 'Cyber City — 18 km', 'IGI Airport — 35 min', 'Vatika Chowk — 8 km'],
    nearbyLandmarks: ['GD Goenka University — 10 km', 'South Point Mall — 8 km', 'Sector 55–56 Metro — 9 km'],
    floorPlans: [
      { config: '1 BHK', area: '650 sqft', price: '₹60 Lakh onwards' },
      { config: '2 BHK', area: '1,050 sqft', price: '₹90 Lakh onwards' },
      { config: '3 BHK', area: '1,550 sqft', price: '₹1.5 Cr onwards' },
    ],
    gallery: [UNSPLASH.luxury11, UNSPLASH.luxury12, UNSPLASH.pool, UNSPLASH.gym, UNSPLASH.bedroom, UNSPLASH.interior],
    heroImage: UNSPLASH.luxury11,
    tags: ['mid-segment', 'new-launch', 'golf-course-extension', 'tata', 'sector-72'],
    appreciationRate: '20–25% (3Y)',
    rentalYield: '4.0%',
    whyBuy: ['Tata brand — zero compromise on quality', 'Affordable entry on Golf Course Extension', '1 BHK available — widest buyer pool', 'Integrated township — self-sufficient community'],
    faqs: [
      { q: 'Is Tata One Gurgaon a good investment?', a: 'Yes. Tata Housing has a perfect delivery track record. The project is in a growth corridor with 20–25% appreciation expected over 3 years.' },
    ],
  },
];

// Helper: get projects by corridor
export function getProjectsByCorridor(corridor: string, excludeSlug?: string) {
  return ALL_PROJECTS.filter((p) => p.corridor === corridor && p.slug !== excludeSlug).slice(0, 3);
}

// Helper: get related projects by budget overlap
export function getRelatedByBudget(priceMin: number, priceMax: number, excludeSlug?: string) {
  return ALL_PROJECTS.filter((p) => {
    if (p.slug === excludeSlug) return false;
    // overlap check
    return p.priceMin <= priceMax * 1.5 && p.priceMax >= priceMin * 0.5;
  }).slice(0, 3);
}

// Helper: get featured projects
export function getFeaturedProjects() {
  return ALL_PROJECTS.filter((p) => p.isFeatured);
}

// Helper: get new launches
export function getNewLaunches() {
  return ALL_PROJECTS.filter((p) => p.status === 'New Launch');
}

// All corridors for interlinking
export const CORRIDORS = [
  { name: 'Dwarka Expressway', slug: 'dwarka-expressway-projects', count: '35+' },
  { name: 'Golf Course Extension Road', slug: 'golf-course-extension-road-projects', count: '20+' },
  { name: 'SPR Road', slug: 'spr-road-projects', count: '15+' },
  { name: 'Sector 113', slug: 'sector-113-gurgaon-property', count: '12+' },
  { name: 'Sector 106', slug: 'sector-106-gurgaon-property', count: '10+' },
  { name: 'Sector 102', slug: 'sector-102-gurgaon-property', count: '8+' },
  { name: 'Sector 37D', slug: 'sector-37d-gurgaon-property', count: '6+' },
  { name: 'New Gurgaon', slug: 'new-gurgaon-projects', count: '25+' },
];

// All page routes for sitemap and interlinking
export const ALL_SEO_PAGES = [
  { title: 'New Launch Projects in Gurgaon', url: '/new-launch-projects-in-gurgaon' },
  { title: 'New Projects in Gurgaon', url: '/new-projects-in-gurgaon' },
  { title: 'Residential Property in Gurgaon', url: '/residential-property-in-gurgaon' },
  { title: 'Dwarka Expressway Projects', url: '/dwarka-expressway-projects' },
  { title: 'Golf Course Extension Road Projects', url: '/golf-course-extension-road-projects' },
  { title: 'SPR Road Projects', url: '/spr-road-projects' },
  { title: 'Sector 113 Gurgaon Property', url: '/sector-113-gurgaon-property' },
  { title: 'Sector 106 Gurgaon Property', url: '/sector-106-gurgaon-property' },
  { title: 'Sector 102 Gurgaon Property', url: '/sector-102-gurgaon-property' },
  { title: 'Sector 37D Gurgaon Property', url: '/sector-37d-gurgaon-property' },
  { title: 'New Gurgaon Projects', url: '/new-gurgaon-projects' },
];

// Market stats for homepage/pages
export const MARKET_STATS = {
  avgAppreciation: '32%',
  avgRentalYield: '3.5%',
  totalProjects: '150+',
  topBuilders: '50+',
  familiesHelped: '4,200+',
  yearsActive: '5+',
};

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'Rajesh Mehta', city: 'Delhi', role: 'IT Professional',
    review: 'GurgaonRealty helped me compare 6 projects in one weekend. I booked Godrej Meridien at the exact price quoted — zero hidden charges. Their advisor was honest and patient.',
    rating: 5, project: 'Godrej Meridien', avatar: 'RM',
  },
  {
    name: 'Priya Sharma', city: 'Bangalore (NRI)', role: 'Software Engineer',
    review: 'Being an NRI, I was worried about buying from abroad. The team handled everything — RERA verification, price negotiation, registration POA. Couldn\'t have done it without them.',
    rating: 5, project: 'Sobha Altus', avatar: 'PS',
  },
  {
    name: 'Vikram Singh', city: 'Gurgaon', role: 'Business Owner',
    review: 'I\'ve invested in 3 Gurgaon projects through GurgaonRealty. Each time they gave unbiased advice — even told me when NOT to buy a project. That kind of honesty is rare.',
    rating: 5, project: 'M3M Altitude', avatar: 'VS',
  },
  {
    name: 'Anita Kapoor', city: 'Noida', role: 'Doctor',
    review: 'The ROI calculator on the website is what convinced me. Saw my ₹1.2 Cr growing to ₹1.9 Cr in 3 years on Dwarka Expressway. Booked Krisumi Waterside and already 15% up in 6 months!',
    rating: 5, project: 'Krisumi Waterside', avatar: 'AK',
  },
];
