import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBHK } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/3-bhk-flats-golf-course-extension-road-gurgaon`;
  return {
    title: '3 BHK Flats in Golf Course Extension Road Gurgaon | ₹1.8 Cr to ₹8 Cr',
    description: 'Premium 3 BHK apartments on Golf Course Extension Road Gurgaon by Emaar, M3M, Sobha, DLF, Tata from ₹1.8 Cr to ₹8 Cr. Sector 65, 66, 69 — luxury lifestyle, top schools, golf course views. Free advisory.',
    keywords: '3 bhk golf course extension road gurgaon, 3 bhk apartments gcer gurgaon, 3 bhk sector 65 gurgaon, luxury 3 bhk gurgaon price, emaar 3 bhk gurgaon, sobha 3 bhk golf course extension road',
    openGraph: {
      title: '3 BHK Flats in Golf Course Extension Road Gurgaon | Premium ₹1.8–8 Cr',
      description: 'Luxury 3 BHK on GCER — Emaar, M3M, Sobha, DLF from ₹1.8 Cr. Golf course views, premium lifestyle.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function ThreeBHKGCERPage() {
  const projects = await fetchProjectsByBHK({ bhk: '3 BHK', corridor: 'Golf Course Extension Road', limit: 60 });

  return (
    <LocationPageTemplate
      title="3 BHK Flats in Golf Course Extension Road, Gurgaon"
      metaTitle="3 BHK Flats — Golf Course Extension Road"
      badge="⛳ GCER — Gurgaon's Most Prestigious 3 BHK Address"
      heroSubtitle="Golf Course Extension Road is home to Gurgaon's finest 3 BHK apartments — projects by Emaar, M3M, Sobha, DLF, Tata and Adani across sectors 57–75. Premium lifestyle, golf course views and unmatched connectivity from ₹1.8 Cr to ₹8 Cr."
      overview="Golf Course Extension Road (GCER) stretches from Vatika Chowk to Sohna Road, spanning sectors 57–75. It is the most sought-after corridor for luxury 3 BHK buyers in Gurgaon. Projects like Emaar Digi Homes, M3M Golf Estate, Sobha City, DLF The Arbour and Tata Primanti offer 3 BHK homes ranging from 1,850 sqft to 3,500 sqft. Prices have doubled since 2019 — from ₹8,800/sqft to ₹20,000+/sqft in 2025."
      whyInvest={[
        'Most prestigious corridor — highest quality builders concentrated here',
        'Price doubled in 5 years: ₹8,800/sqft (2019) to ₹20,000+/sqft (2025)',
        'Golf course views from Emaar Palm Hills and M3M Golf Estate',
        'Best-in-class amenities: clubhouses, sports facilities, 5-star hotels nearby',
        'Top schools: DPS, GD Goenka, Heritage School within 5 km',
        'Vatika Chowk connectivity to NH-48, Golf Course Road and Sohna Road',
        'Strong NRI and HNI buyer demand drives consistent appreciation',
      ]}
      connectivity={[
        'NH-48 (Delhi–Jaipur Highway) — 8 km via GCER',
        'Cyber City, Gurgaon — 10 km',
        'Golf Course Road (GCR) — connects via Vatika Chowk',
        'Sohna Road — connects to SPR and Faridabad',
        'IGI Airport — 30 minutes',
        'Huda City Centre Metro — 12 km',
      ]}
      landmarks={[
        'Emaar Palm Hills Golf Course — adjacent',
        'M3M Golfestate Community — nearby',
        'Vatika Chowk — 3 km',
        'South Point Mall — 5 km',
        'GD Goenka School — 4 km',
        'Fortis Memorial Hospital — 8 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Price Range', value: '₹1.8 Cr – ₹8 Cr' },
        { label: 'Avg Price/sqft', value: '₹15,000–₹22,000' },
        { label: 'Appreciation (5Y)', value: '100%+' },
        { label: 'Size Range', value: '1,850 – 3,500 sqft' },
        { label: 'Top Builders', value: 'Emaar, M3M, DLF' },
        { label: 'Rental Yield', value: '2.5–3.5%' },
      ]}
      faqs={[
        { q: 'What is the price of 3 BHK flats on Golf Course Extension Road Gurgaon?', a: '3 BHK flats on GCER range from ₹1.8 Cr (new launch by Adani or Tata in Sector 70–72) to ₹8 Cr (ultra-luxury in Sector 65–66 by Emaar or M3M). Average price for a quality 3 BHK is ₹3–5 Cr in 2025.' },
        { q: 'Which builder has the best 3 BHK on Golf Course Extension Road?', a: 'Emaar Digi Homes (Sector 62), Sobha City (Sector 108 adjacent), M3M Golf Estate (Sector 65), DLF The Arbour (Sector 63) and Tata Primanti (Sector 72) are the top-rated 3 BHK projects on GCER.' },
        { q: 'Is GCER better than Dwarka Expressway for 3 BHK?', a: 'GCER is better for lifestyle and luxury (premium brands, golf course proximity, established social infrastructure). Dwarka Expressway is better for capital appreciation and budget range. For end-use luxury, GCER wins; for investment ROI, both are strong but Dwarka Expressway has higher upside due to newer infrastructure.' },
        { q: 'Are there under-construction 3 BHK projects on Golf Course Extension Road?', a: 'Yes. Several new launches in 2024–25 including DLF The Arbour Phase 2, M3M Altitude and Adani Samsara Avencia are offering 3 BHK units in various stages of construction on GCER.' },
      ]}
      relatedLinks={[
        { label: 'All Golf Course Extension Road Projects', href: '/golf-course-extension-road-projects' },
        { label: '4 BHK Luxury in Gurgaon', href: '/luxury-apartments-above-3-crore-gurgaon' },
        { label: 'Penthouse in Gurgaon', href: '/penthouse-in-gurgaon' },
        { label: '3 BHK Dwarka Expressway', href: '/3-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
