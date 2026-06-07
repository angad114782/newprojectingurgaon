import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBHK } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/penthouse-in-gurgaon`;
  return {
    title: 'Penthouse for Sale in Gurgaon 2025 | Luxury Duplex Penthouse ₹5 Cr to ₹100 Cr+',
    description: 'Buy ultra-luxury penthouse in Gurgaon — DLF Camellias, Tulip Monsella, M3M Altitude, Oberoi Sky Heights on Golf Course Road, Golf Course Extension Road. 4/5 BHK sky villas. Free advisory.',
    keywords: 'penthouse in gurgaon, luxury penthouse gurgaon price, duplex penthouse golf course road gurgaon, penthouse for sale gurgaon 2025, dlf camellias penthouse, tulip monsella penthouse, 5 bhk penthouse gurgaon',
    openGraph: {
      title: 'Penthouse for Sale in Gurgaon | Ultra-Luxury ₹5 Cr to ₹100 Cr+',
      description: 'DLF Camellias, Tulip Monsella, M3M Altitude penthouses — Gurgaon\'s most exclusive sky homes. Free advisory.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function PenthouseGurgaonPage() {
  const projects = await fetchProjectsByBHK({ bhk: 'Penthouse', limit: 50 });

  return (
    <LocationPageTemplate
      title="Penthouse for Sale in Gurgaon"
      metaTitle="Penthouse in Gurgaon"
      badge="👑 Ultra-Luxury — Gurgaon's Finest Sky Residences"
      heroSubtitle="Gurgaon's most exclusive penthouses — from ₹5 Cr to ₹100 Cr+. DLF Camellias, Tulip Monsella, M3M Altitude, Oberoi Sky Heights and DLF The Crest offer duplex and triplex penthouses on Golf Course Road and Golf Course Extension Road with private pools, sky terraces and Aravalli views."
      overview="Penthouses in Gurgaon represent the pinnacle of luxury living. The Golf Course Road belt — DLF 5, DLF Cyber City adjacent — is home to India's most coveted penthouse addresses. DLF The Camellias starts at ₹40 Cr for duplex penthouses. Tulip Monsella, Golf Course Road, offers penthouse floors from ₹15 Cr. Golf Course Extension Road has emerging luxury penthouse offerings from Emaar, M3M and Oberoi. All feature private elevators, rooftop terraces, infinity pools and smart home automation."
      whyInvest={[
        'Scarce asset: fewer than 200 penthouses available in all of Gurgaon',
        'Capital value appreciation: DLF Camellias penthouses up 3x in 10 years',
        'Complete privacy — typically only 1–4 residences per floor',
        'Private elevators, rooftop pools, sky gardens — unmatched lifestyle',
        'Strong rental demand from C-suite executives and diplomats',
        'Aravalli views, golf course vistas and city skyline panoramas',
        'Best store-of-value real estate in NCR for HNI buyers',
      ]}
      connectivity={[
        'Golf Course Road — directly accessible from DLF 5 and Sector 42',
        'Cyber City, Gurgaon — 5 minutes',
        'IGI Airport — 30–40 minutes',
        'NH-48 (Delhi–Jaipur Highway) — 5 km',
        'Golf Course Extension Road penthouses — Vatika Chowk area',
        'MG Road Metro — 3 km from Golf Course Road addresses',
      ]}
      landmarks={[
        'DLF Cyber Hub — 4 km',
        'DLF Golf & Country Club — adjacent to Camellias',
        'Leela Hotel, Gurgaon — 5 km',
        'Oberoi Hotel, MG Road — 7 km',
        'ITC Grand Bharat — 25 km (Manesar)',
        'American Embassy School — 8 km',
      ]}
      bestFor="End User"
      investmentHighlights={[
        { label: 'Price Range', value: '₹5 Cr – ₹100 Cr+' },
        { label: 'Size', value: '3,000 – 12,000 sqft' },
        { label: 'Top Address', value: 'DLF Camellias' },
        { label: 'Capital Gain (10Y)', value: '200–300%' },
        { label: 'Inventory', value: '<200 in all Gurgaon' },
        { label: 'Private Elevator', value: 'Available' },
      ]}
      faqs={[
        { q: 'What is the price of a penthouse in Gurgaon?', a: 'Penthouses in Gurgaon range from ₹5 Cr (compact sky apartments in Golf Course Extension Road) to ₹100 Cr+ (duplex penthouses in DLF The Camellias, Golf Course Road). Mid-range luxury penthouses in Tulip Monsella, M3M Altitude and Oberoi Sky Heights are priced ₹10–₹30 Cr.' },
        { q: 'Which is the best penthouse address in Gurgaon?', a: 'DLF The Camellias on Golf Course Road is considered Gurgaon\'s most prestigious penthouse address, followed by Tulip Monsella, DLF The Magnolias and DLF The Crest. On Golf Course Extension Road, Oberoi Sky Heights and M3M Altitude are top-rated.' },
        { q: 'Do penthouses in Gurgaon have private pools?', a: 'Yes. Most ultra-luxury penthouses in Gurgaon come with private rooftop pools or plunge pools. DLF Camellias, Tulip Monsella and Oberoi Sky Heights penthouses feature private sky terraces, infinity pools and landscaped gardens.' },
        { q: 'Is buying a penthouse in Gurgaon a good investment?', a: 'Penthouses are the most scarce asset class in Gurgaon real estate. DLF Camellias penthouses have tripled in value over 10 years. They provide excellent capital preservation and strong rental income from MNC executives and HNIs. However, they are illiquid — ideal as long-term wealth storage, not short-term flips.' },
        { q: 'What is the size of a penthouse in Gurgaon?', a: 'Penthouses in Gurgaon range from 3,000 sqft (compact luxury) to 12,000+ sqft (duplex/triplex in DLF Camellias). Standard luxury penthouses are 4,000–6,000 sqft with double-height ceilings, private terraces and multiple parking spaces.' },
      ]}
      relatedLinks={[
        { label: '4 BHK Luxury Apartments Gurgaon', href: '/luxury-apartments-above-3-crore-gurgaon' },
        { label: 'Golf Course Extension Road Projects', href: '/golf-course-extension-road-projects' },
        { label: 'Golf Course Road Projects', href: '/golf-course-road-projects' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: '3 BHK GCER Gurgaon', href: '/3-bhk-flats-golf-course-extension-road-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
