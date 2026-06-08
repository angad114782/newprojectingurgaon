import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBHK } from '@/lib/api-projects';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const pageUrl = `${siteUrl}/2-bhk-flats-in-dwarka-expressway-gurgaon`;
  return {
    title: '2 BHK Flats in Dwarka Expressway Gurgaon 2025 | Price ₹60 Lakh to ₹1.8 Cr',
    description: 'Buy 2 BHK flats in Dwarka Expressway Gurgaon from ₹60 Lakh. Best budget & mid-segment projects in Sector 37D, 102, 106 by Signature Global, Hero Homes, BPTP. RERA verified. Zero brokerage.',
    keywords: '2 bhk flats dwarka expressway gurgaon, 2 bhk apartments dwarka expressway price, 2 bhk sector 37d gurgaon, 2 bhk affordable gurgaon, buy 2 bhk gurgaon under 1 crore dwarka expressway',
    openGraph: {
      title: '2 BHK Flats in Dwarka Expressway Gurgaon | ₹60 Lakh to ₹1.8 Cr',
      description: 'Best 2 BHK projects on Dwarka Expressway — Signature Global, Hero Homes, BPTP from ₹60 Lakh.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function TwoBHKDwarkaExpresswayPage() {
  const projects = await fetchProjectsByBHK({ bhk: '2 BHK', corridor: 'Dwarka Expressway', limit: 60 });

  return (
    <LocationPageTemplate
      title="2 BHK Flats in Dwarka Expressway, Gurgaon"
      metaTitle="2 BHK Flats in Dwarka Expressway"
      badge="🏢 2 BHK — Best Value Homes on Dwarka Expressway"
      heroSubtitle="Looking for an affordable 2 BHK flat on Dwarka Expressway? Gurgaon's fastest-growing corridor offers 2 BHK apartments from just ₹60 Lakh in Sector 37D (DDJAY scheme) to ₹1.8 Cr in premium Sector 106. Ideal for first-time buyers, investors and young families."
      overview="Dwarka Expressway offers the widest range of 2 BHK options in Gurgaon — from budget DDJAY affordable homes in Sector 37D (₹45–90 Lakh) to mid-premium apartments in Sector 102 and 106 (₹90L–₹1.8 Cr). Builders like Signature Global, Hero Homes, BPTP, Paras and Adani are active across these sectors. 2 BHK units here typically range from 900 sqft to 1,400 sqft."
      whyInvest={[
        'Lowest entry price for Dwarka Expressway — from ₹45 Lakh in DDJAY scheme',
        'High rental demand: ₹18,000–₹35,000/month for 2 BHK in this corridor',
        'Excellent connectivity: Metro Phase II, airport in 20 minutes',
        'Best for first-time buyers and salaried professionals',
        'Government DDJAY scheme projects available (Sector 37D)',
        'Strong resale market — 2 BHK is the most liquid asset class',
        'Multiple ready-to-move options available for immediate possession',
      ]}
      connectivity={[
        'IGI Airport — 20 minutes via NH-248BB',
        'Cyber City, Gurgaon — 25 minutes',
        'Delhi border — 3 km from Sector 37D',
        'Dwarka Sector 21 Metro — 8 km',
        'NH-48 (Delhi–Jaipur Highway) — 10 km',
        'ISBT Dwarka — 8 km',
      ]}
      landmarks={[
        'Sector 37 Metro Station — 3 km',
        'Government schools (DDJAY sector) — 1–2 km',
        'Upcoming retail and commercial in Sector 102',
        'BPTP Park Floors — Sector 102',
        'Hero Homes — Sector 104',
        'Manesar Industrial Area — 15 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Price Range', value: '₹60 L – ₹1.8 Cr' },
        { label: 'Size Range', value: '900 – 1,400 sqft' },
        { label: 'Rental Yield', value: '3.5–5%' },
        { label: 'Monthly Rental', value: '₹18K–₹35K' },
        { label: 'DDJAY Scheme', value: 'Sector 37D' },
        { label: 'Appreciation (3Y)', value: '30–40%' },
      ]}
      faqs={[
        { q: 'What is the price of 2 BHK flats on Dwarka Expressway Gurgaon?', a: '2 BHK flats on Dwarka Expressway range from ₹45 Lakh (DDJAY scheme in Sector 37D) to ₹1.8 Cr (premium in Sector 106 by Godrej or M3M). Budget options in Sector 102 and 104 are available from ₹65 Lakh to ₹1.2 Cr.' },
        { q: 'Which is the cheapest 2 BHK on Dwarka Expressway?', a: 'Sector 37D offers the most affordable 2 BHK homes under the DDJAY (Deen Dayal Jan Awas Yojana) scheme — prices start from ₹45 Lakh. Projects by Signature Global, Paras Seasons and Adani Aangan are popular options.' },
        { q: 'Is 2 BHK a good investment on Dwarka Expressway in 2025?', a: 'Yes. 2 BHK is the most liquid property type on Dwarka Expressway. High rental demand, airport proximity, upcoming Metro Phase II and consistent appreciation make it an excellent investment.' },
        { q: 'Are there ready-to-move 2 BHK flats on Dwarka Expressway?', a: 'Yes. Sector 108 (Sobha City), Sector 102 (BPTP Park Floors) and Sector 37D (multiple DDJAY projects) all have ready-to-move 2 BHK inventory. Prices for RTM options are generally 10–15% higher than new launches.' },
      ]}
      relatedLinks={[
        { label: '3 BHK on Dwarka Expressway', href: '/3-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'All Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Sector 37D Property', href: '/sector-37d-gurgaon-property' },
        { label: 'Sector 102 Property', href: '/sector-102-gurgaon-property' },
        { label: 'Flats Under ₹1 Crore', href: '/flats-under-1-crore-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
