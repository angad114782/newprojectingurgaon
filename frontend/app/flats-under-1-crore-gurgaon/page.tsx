import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBudget } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/flats-under-1-crore-gurgaon`;
  return {
    title: 'Flats Under 1 Crore in Gurgaon 2025 | 2/3 BHK Budget Apartments',
    description: 'Buy flats under 1 crore in Gurgaon — 2 BHK from ₹40 Lakh, 3 BHK from ₹75 Lakh in Sector 37D, New Gurgaon, Sohna Road. RERA verified. Signature Global, Hero Homes, BPTP projects. Free advisory.',
    keywords: 'flats under 1 crore gurgaon, apartments under 1 crore gurgaon, budget flats gurgaon, 2 bhk under 1 crore gurgaon, 3 bhk under 1 crore gurgaon, affordable apartments gurgaon 2025',
    openGraph: {
      title: 'Flats Under 1 Crore in Gurgaon 2025 | Best Budget Apartments',
      description: '2/3 BHK flats under ₹1 Crore in Gurgaon — verified projects in Sector 37D, New Gurgaon, Sohna Road.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function FlatsUnder1CrorePage() {
  const projects = await fetchProjectsByBudget({ maxPrice: 100, limit: 30 });

  return (
    <LocationPageTemplate
      title="Flats Under ₹1 Crore in Gurgaon"
      metaTitle="Flats Under 1 Crore in Gurgaon"
      badge="💰 Budget — Best Value Flats Under ₹1 Crore"
      heroSubtitle="Finding a quality flat under ₹1 Crore in Gurgaon is possible — if you know where to look. Sector 37D (DDJAY), New Gurgaon (Sector 80–95), and Sohna Road offer 2 BHK from ₹40 Lakh and 3 BHK from ₹75 Lakh. RERA verified. Zero brokerage from us."
      overview="Gurgaon has excellent housing options under ₹1 Crore concentrated in three zones: (1) Sector 37D — DDJAY affordable homes from ₹45–90 Lakh; (2) New Gurgaon (Sectors 80–95) — mid-segment apartments from ₹55–₹1 Crore; (3) Sohna Road (Sectors 68–75) — independent floors and budget apartments from ₹65–₹95 Lakh. These areas offer strong infrastructure, good connectivity and consistent rental demand."
      whyInvest={[
        'Most affordable entry point into Gurgaon real estate market',
        'Government DDJAY scheme homes qualify for PMAY subsidy (Sector 37D)',
        'Salaried buyers qualify for home loans up to ₹75 Lakh easily',
        'Strong rental yield: 4–5% in budget segments — best ROI in Gurgaon',
        'Resale liquidity is high — 2 BHK under ₹80L has maximum buyers',
        'New Gurgaon is emerging fast — early buyers get highest appreciation',
        'Multiple builder options: Signature Global, Paras, Adani, Hero Homes',
      ]}
      connectivity={[
        'Dwarka Expressway (NH-248BB) — adjacent to Sector 37D',
        'NH-48 (Delhi–Jaipur Highway) — 5 km from New Gurgaon',
        'Sohna Road connects to Golf Course Extension Road and SPR',
        'Cyber City — 20–30 minutes from New Gurgaon',
        'IGI Airport — 25–30 minutes',
        'IFFCO Chowk Metro — 10 km from Sector 95',
      ]}
      landmarks={[
        'Manesar Industrial Area — 10 km from New Gurgaon',
        'Sector 37 Metro Station — 3 km from Sector 37D',
        'Rajiv Chowk Metro — 15 km from New Gurgaon',
        'IMT Manesar — 15 km',
        'Upcoming schools and hospitals in New Gurgaon',
        'Vatika Chowk — 5 km from Sohna Road budget zone',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Price Range', value: '₹40 L – ₹1 Cr' },
        { label: 'Best Zone', value: 'Sector 37D / New Gurgaon' },
        { label: 'Rental Yield', value: '4–5%' },
        { label: 'EMI (₹60L loan)', value: '~₹52,000/mo' },
        { label: 'PMAY Subsidy', value: 'Up to ₹2.67 L' },
        { label: 'Appreciation (3Y)', value: '25–35%' },
      ]}
      faqs={[
        { q: 'Are there good flats under 1 crore in Gurgaon?', a: 'Yes. Gurgaon has quality flats under ₹1 Crore in three main zones: Sector 37D (DDJAY scheme, ₹45–90 Lakh), New Gurgaon (Sectors 80–95, ₹55L–₹1 Cr) and Sohna Road (₹65–₹95 Lakh). These offer good connectivity, RERA approval and strong rental demand.' },
        { q: 'Which is the cheapest area to buy a flat in Gurgaon?', a: 'Sector 37D (DDJAY scheme) is the cheapest — 2 BHK from ₹45 Lakh. New Gurgaon (Sectors 88–95) offers mid-budget options from ₹55 Lakh. Sohna Road independent builder floors start from ₹50 Lakh. These are the most affordable zones within Gurgaon city limits.' },
        { q: 'Can I get a 3 BHK under ₹1 Crore in Gurgaon?', a: 'Yes, but options are limited. 3 BHK flats under ₹1 Crore are available in Sector 37D (DDJAY — ₹70–90 Lakh), New Gurgaon Sectors 92–95 (₹80–₹1 Cr) and on Sohna Road in sectors 67–70. These are smaller 3 BHK units (950–1,200 sqft) compared to premium ones.' },
        { q: 'Is buying a flat under 1 crore in Gurgaon a good investment?', a: 'Yes, especially in New Gurgaon and Sector 37D. These areas have seen 25–35% appreciation in 3 years and offer rental yields of 4–5%. For salaried buyers, this is also the most home-loan-friendly price bracket.' },
      ]}
      relatedLinks={[
        { label: 'Flats Under ₹50 Lakh Gurgaon', href: '/flats-under-50-lakh-gurgaon' },
        { label: '2 BHK Dwarka Expressway', href: '/2-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'Sector 37D Property', href: '/sector-37d-gurgaon-property' },
        { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
        { label: 'Affordable Housing Gurgaon', href: '/residential-property-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
