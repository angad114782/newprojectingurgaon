import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBHK } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const pageUrl = `${siteUrl}/3-bhk-flats-in-dwarka-expressway-gurgaon`;
  return {
    title: '3 BHK Flats in Dwarka Expressway Gurgaon 2025 | Price ₹1.5 Cr to ₹4.5 Cr',
    description: 'Buy 3 BHK flats in Dwarka Expressway Gurgaon from ₹1.5 Cr. Verified projects by DLF, M3M, Godrej, Sobha, Krisumi in Sector 106, 108, 113. RERA approved. Free site visit. Zero brokerage.',
    keywords: '3 bhk flats dwarka expressway gurgaon, 3 bhk apartments dwarka expressway, 3 bhk dwarka expressway price, 3 bhk sector 113 gurgaon, 3 bhk sector 106 gurgaon, buy 3 bhk gurgaon 2025',
    openGraph: {
      title: '3 BHK Flats in Dwarka Expressway Gurgaon | ₹1.5 Cr to ₹4.5 Cr',
      description: 'Verified 3 BHK flats on Dwarka Expressway — DLF, M3M, Godrej, Sobha from ₹1.5 Cr. Free advisory.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function ThreeBHKDwarkaExpresswayPage() {
  const projects = await fetchProjectsByBHK({ bhk: '3 BHK', corridor: 'Dwarka Expressway', limit: 60 });

  return (
    <LocationPageTemplate
      title="3 BHK Flats in Dwarka Expressway, Gurgaon"
      metaTitle="3 BHK Flats in Dwarka Expressway"
      badge="🏠 3 BHK — Dwarka Expressway's Best Family Homes"
      heroSubtitle="Gurgaon's fastest-growing corridor now offers premium 3 BHK apartments from ₹1.5 Cr to ₹4.5 Cr. Projects by DLF, M3M, Godrej, Krisumi and Sobha in Sector 106, 108 and 113 — with Metro connectivity, airport access and top schools nearby."
      overview="Dwarka Expressway (NH-248BB) is the most sought-after corridor for 3 BHK buyers in Gurgaon. After the 2024 expressway inauguration, property prices have appreciated 30–45% and continue to rise. 3 BHK apartments here range from 1,650 sq ft to 2,800 sq ft, priced between ₹1.5 Cr and ₹4.5 Cr depending on the builder, sector and configuration. Sector 106 and 113 are premium zones with maximum builder activity."
      whyInvest={[
        '3 BHK demand is highest on Dwarka Expressway — 60%+ of buyers choose this config',
        'Price appreciation: 35–45% in 3 years — best ROI for family-sized homes',
        'Metro Phase II connectivity to both Delhi and Cyber City',
        'IGI Airport just 15–20 minutes away — ideal for NRI and frequent flyers',
        'Top schools: DPS, GD Goenka, Shri Ram School within 10 km',
        'Hospital access: Medanta, Fortis, Artemis within 15 km',
        'Active projects by DLF, M3M, Godrej, Sobha, Krisumi in multiple price bands',
      ]}
      connectivity={[
        'IGI Airport — 15–20 minutes via NH-248BB',
        'Cyber City, Gurgaon — 25 minutes',
        'Connaught Place, Delhi — 40 minutes',
        'NH-48 (Delhi–Jaipur Highway) — 8 km via ISBT Dwarka',
        'Dwarka Sector 21 Metro — 8 km (Phase II extension upcoming)',
        'Huda City Centre Metro — 22 km',
      ]}
      landmarks={[
        'DPS Dwarka School — 7 km',
        'Medanta Medicity Hospital — 18 km',
        'ISBT Dwarka Bus Terminus — 8 km',
        'Ambience Mall, Gurgaon — 14 km',
        'M3M Capital Walk (Commercial) — adjacent Sector 113',
        'Cyber City Business Hub — 25 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Price Range', value: '₹1.5 Cr – ₹4.5 Cr' },
        { label: 'Size Range', value: '1,650 – 2,800 sqft' },
        { label: 'Appreciation (3Y)', value: '35–45%' },
        { label: 'Rental Yield', value: '3–4%' },
        { label: 'Top Builders', value: '8+' },
        { label: 'Metro (upcoming)', value: 'Phase II' },
      ]}
      faqs={[
        { q: 'What is the price of 3 BHK flats on Dwarka Expressway in 2025?', a: '3 BHK flats on Dwarka Expressway range from ₹1.5 Cr (affordable new launch in Sector 37D or 102) to ₹4.5 Cr (luxury in Sector 113 by DLF or M3M). The average price is around ₹2.2 Cr for a 2,000 sqft 3 BHK.' },
        { q: 'Which sectors are best for 3 BHK on Dwarka Expressway?', a: 'Sector 113 is premium (DLF, M3M projects, metro connectivity), Sector 106 is mid-premium (Godrej, Sobha), Sector 108 (Sobha City township), and Sector 102 for budget-friendly options.' },
        { q: 'Are 3 BHK projects on Dwarka Expressway RERA approved?', a: 'Yes. All active projects by DLF, M3M, Godrej, Sobha, Krisumi and Signature Global on Dwarka Expressway are RERA registered with Haryana RERA. Always verify at haryanarera.gov.in.' },
        { q: 'What is the size of a 3 BHK flat on Dwarka Expressway?', a: 'Standard 3 BHK sizes on Dwarka Expressway range from 1,650 sqft (compact) to 2,800 sqft (luxury). Most new launch projects offer 3 BHK in the 2,000–2,400 sqft range.' },
        { q: 'Is Dwarka Expressway a good investment for 3 BHK buyers in 2025?', a: 'Absolutely. Dwarka Expressway saw 35–45% appreciation in 3 years. With Metro Phase II, airport expansion and continued NRI demand, 3 BHK units here are one of the best long-term real estate investments in NCR.' },
      ]}
      relatedLinks={[
        { label: '2 BHK on Dwarka Expressway', href: '/2-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'All Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Sector 113 Property', href: '/sector-113-gurgaon-property' },
        { label: 'Sector 106 Property', href: '/sector-106-gurgaon-property' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
