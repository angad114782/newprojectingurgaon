import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBudget } from '@/lib/api-projects';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const pageUrl = `${siteUrl}/luxury-apartments-above-3-crore-gurgaon`;
  return {
    title: 'Luxury Apartments Above ₹3 Crore in Gurgaon | 4 BHK & Ultra-Premium',
    description: 'Buy luxury apartments above ₹3 Crore in Gurgaon — DLF, Oberoi, M3M, Emaar on Golf Course Road, GCER. 4 BHK from ₹3 Cr, penthouses up to ₹100 Cr. Ultra-premium lifestyle. Free advisory.',
    keywords: 'luxury apartments above 3 crore gurgaon, 4 bhk luxury apartments gurgaon, premium property gurgaon above 3 crore, ultra luxury flats gurgaon, dlf luxury gurgaon, oberoi sky heights gurgaon price',
    openGraph: {
      title: 'Luxury Apartments Above ₹3 Crore Gurgaon | DLF, Oberoi, M3M, Emaar',
      description: 'Ultra-premium 4 BHK and penthouse homes above ₹3 Crore in Gurgaon — Golf Course Road, GCER.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function LuxuryAbove3CrorePage() {
  const projects = await fetchProjectsByBudget({ minPrice: 300, limit: 30 });

  return (
    <LocationPageTemplate
      title="Luxury Apartments Above ₹3 Crore in Gurgaon"
      metaTitle="Luxury Apartments Above ₹3 Crore Gurgaon"
      badge="✨ Ultra-Luxury — Gurgaon's Finest Addresses Above ₹3 Cr"
      heroSubtitle="Gurgaon's ultra-luxury real estate segment — 4 BHK apartments, sky villas and penthouses above ₹3 Crore by DLF, Oberoi, M3M, Emaar and Anant Raj on Golf Course Road and Golf Course Extension Road. Private elevators, infinity pools, concierge services and Aravalli views define this segment."
      overview="Gurgaon's luxury segment above ₹3 Crore is concentrated on two corridors: Golf Course Road (DLF 5, DLF Cyber City adjacent) and Golf Course Extension Road (Sectors 57–75). Properties here range from large 4 BHK apartments (3,500–5,000 sqft) to duplex penthouses (6,000–12,000 sqft). Prices range from ₹3 Cr (new launch on GCER) to ₹100 Cr+ (DLF Camellias penthouse). This segment has seen 40–60% appreciation in 5 years."
      whyInvest={[
        'Highest appreciation in Gurgaon: 40–60% in 5 years for luxury segment',
        'Strong NRI, HNI and CXO buyer demand — global capital flowing in',
        'Rental income: ₹2 Lakh to ₹10 Lakh/month for luxury 4 BHK homes',
        'Capital preservation: luxury real estate outperforms stock market in India',
        'Ultra-premium lifestyle: private pools, sky gardens, smart home automation',
        'Best addresses — DLF, Oberoi, Emaar brands command strong premiums',
        'Only 50,000+ sqft clubhouses, concierge, valet, 24x7 luxury services',
      ]}
      connectivity={[
        'Golf Course Road — 5 minutes to Cyber City',
        'Golf Course Extension Road — Vatika Chowk, connects to NH-48',
        'IGI Airport — 30–40 minutes',
        'Aerocity Business District — 35 minutes',
        'Indira Gandhi International Airport — 40 minutes',
        'DLF Cyber Hub — 4 km from Golf Course Road',
      ]}
      landmarks={[
        'DLF Cyber Hub — 4 km',
        'DLF Golf & Country Club — adjacent (Golf Course Road)',
        'Emaar Palm Hills Golf Course — adjacent (GCER)',
        'American Embassy School — 8 km',
        'The Leela Hotel, Gurgaon — 5 km',
        'Fortis Memorial Hospital — 10 km',
      ]}
      bestFor="End User"
      investmentHighlights={[
        { label: 'Price Range', value: '₹3 Cr – ₹100 Cr+' },
        { label: 'Size', value: '3,500 – 12,000 sqft' },
        { label: 'Appreciation (5Y)', value: '40–60%' },
        { label: 'Monthly Rental', value: '₹2L – ₹10L' },
        { label: 'Top Brand', value: 'DLF, Oberoi, Emaar' },
        { label: 'Private Elevator', value: 'Standard' },
      ]}
      faqs={[
        { q: 'Which are the best luxury apartments above ₹3 Crore in Gurgaon?', a: 'Top luxury projects above ₹3 Crore in Gurgaon include DLF The Camellias (Golf Course Road, ₹40–100 Cr), Oberoi Sky Heights (Golf Course Road, ₹12–30 Cr), M3M Altitude (GCER, ₹4–10 Cr), Emaar Digi Homes (GCER, ₹3–6 Cr) and DLF The Arbour (GCER, ₹4–8 Cr).' },
        { q: 'What amenities do luxury apartments above ₹3 Crore in Gurgaon have?', a: 'Luxury apartments above ₹3 Crore in Gurgaon typically include: private elevators, infinity pools, rooftop terraces, smart home automation, 24x7 concierge and valet, double-height ceilings, designer kitchens with premium fittings, 3+ car parking and exclusive clubhouses of 50,000+ sqft.' },
        { q: 'Is there GST on luxury apartments above ₹3 Crore in Gurgaon?', a: 'Yes. GST at 5% (without ITC) applies to under-construction luxury apartments. For ready-to-move properties (with completion certificate), no GST is applicable. Stamp duty (7% in Haryana) and registration charges apply on all property purchases.' },
        { q: 'Which corridor is best for luxury apartments in Gurgaon?', a: 'Golf Course Road (GCR) is the traditional luxury address with DLF, Oberoi and Tulip brands. Golf Course Extension Road (GCER) is the emerging luxury corridor with Emaar, M3M, Adani and DLF — offering slightly lower entry prices with higher appreciation potential.' },
      ]}
      relatedLinks={[
        { label: 'Penthouse in Gurgaon', href: '/penthouse-in-gurgaon' },
        { label: 'Golf Course Extension Road Projects', href: '/golf-course-extension-road-projects' },
        { label: 'Golf Course Road Projects', href: '/golf-course-road-projects' },
        { label: '3 BHK Golf Course Extension Road', href: '/3-bhk-flats-golf-course-extension-road-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
