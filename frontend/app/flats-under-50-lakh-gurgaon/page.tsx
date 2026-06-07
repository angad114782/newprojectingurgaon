import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsByBudget } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/flats-under-50-lakh-gurgaon`;
  return {
    title: 'Flats Under 50 Lakh in Gurgaon 2025 | Affordable DDJAY Housing Scheme',
    description: 'Buy affordable flats under ₹50 Lakh in Gurgaon — DDJAY scheme homes in Sector 37D, New Gurgaon, Sohna. 2 BHK from ₹28 Lakh. Signature Global, Adani, GLS, ROF projects. RERA verified. Free advisory.',
    keywords: 'flats under 50 lakh gurgaon, affordable housing gurgaon under 50 lakh, ddjay homes gurgaon, 2 bhk under 50 lakh gurgaon, cheap flats gurgaon, budget apartments gurgaon 2025, sector 37d affordable homes',
    openGraph: {
      title: 'Flats Under ₹50 Lakh in Gurgaon | DDJAY Affordable Housing 2025',
      description: 'RERA approved affordable flats under ₹50 Lakh in Gurgaon — DDJAY scheme, Sector 37D, New Gurgaon.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function FlatsUnder50LakhPage() {
  const projects = await fetchProjectsByBudget({ maxPrice: 50, limit: 30 });

  return (
    <LocationPageTemplate
      title="Affordable Flats Under ₹50 Lakh in Gurgaon"
      metaTitle="Flats Under 50 Lakh in Gurgaon"
      badge="🏗️ Affordable — DDJAY & Budget Homes Under ₹50 Lakh"
      heroSubtitle="Yes, you can own a flat in Gurgaon under ₹50 Lakh! The DDJAY (Deen Dayal Jan Awas Yojana) scheme and Haryana Affordable Housing Policy have created hundreds of budget-friendly apartments in Sector 37D, New Gurgaon (Sectors 88–95) and Sohna. Ideal for first-time homebuyers, government employees and salaried professionals."
      overview="Gurgaon's affordable housing segment under ₹50 Lakh is primarily concentrated in three areas: (1) Sector 37D — DDJAY homes starting from ₹28 Lakh for 1 BHK and ₹40 Lakh for 2 BHK; (2) New Gurgaon (Sectors 88–95) — affordable apartments from ₹32–50 Lakh; (3) Sohna and Dharuhera corridors on the periphery. These properties are RERA approved and qualify for PMAY home loan subsidy, reducing effective cost further."
      whyInvest={[
        'PMAY (Pradhan Mantri Awas Yojana) subsidy available — save up to ₹2.67 Lakh',
        'DDJAY homes have fixed pricing — government regulated, no hidden charges',
        'Easiest home loan approval: SBI, HDFC, ICICI all have affordable housing schemes',
        'EMI as low as ₹22,000–₹35,000/month for ₹30–40 Lakh homes',
        'Rental income of ₹12,000–₹20,000/month — strong yield',
        'Best for EWS/LIG/MIG-I income brackets',
        'First step into Gurgaon real estate market — appreciation upside as city expands',
      ]}
      connectivity={[
        'Sector 37D — adjacent to Dwarka Expressway (NH-248BB)',
        'New Gurgaon (Sec 88–95) — near NH-48 and Manesar IMT',
        'Sector 37 Metro Station — 3 km from Sector 37D',
        'IMT Manesar (jobs hub) — 8 km from Sector 95',
        'Delhi border — 12 km from Sector 37D',
        'Upcoming peripheral expressway connections',
      ]}
      landmarks={[
        'Sector 37 Metro Station — 3 km',
        'IMT Manesar Industrial Area — 8 km',
        'Upcoming schools in New Gurgaon Sectors',
        'Primary health centres within each sector',
        'NH-48 Toll Plaza — 5 km from Sector 95',
        'Manesar Police Lines — 3 km',
      ]}
      bestFor="End User"
      investmentHighlights={[
        { label: 'Price Range', value: '₹28 L – ₹50 L' },
        { label: 'PMAY Subsidy', value: 'Up to ₹2.67 L' },
        { label: 'Min EMI', value: '~₹22,000/mo' },
        { label: 'Rental Yield', value: '4.5–6%' },
        { label: 'Best Scheme', value: 'DDJAY Sector 37D' },
        { label: 'Appreciation (3Y)', value: '20–30%' },
      ]}
      faqs={[
        { q: 'Are there RERA approved flats under ₹50 Lakh in Gurgaon?', a: 'Yes. DDJAY (Deen Dayal Jan Awas Yojana) homes in Sector 37D are RERA registered with Haryana RERA. Builders like Signature Global, Paras Buildtech, GLS, ROF and Adani all have Haryana RERA approvals for their affordable housing projects.' },
        { q: 'What is the DDJAY housing scheme in Gurgaon?', a: 'DDJAY (Deen Dayal Jan Awas Yojana) is a Haryana government affordable housing scheme for plots between 50–150 square yards. Projects under DDJAY offer 1, 2 and 3 BHK apartments in Gurgaon at regulated prices, primarily in Sector 37D, 99 and New Gurgaon.' },
        { q: 'Can I get a home loan for a flat under ₹50 Lakh in Gurgaon?', a: 'Yes. Home loans for affordable housing under ₹50 Lakh are easily approved. Major banks like SBI (home loan at 8.5%), HDFC and ICICI offer 80–90% LTV financing. PMAY (Credit Linked Subsidy Scheme) provides additional interest subsidy of up to ₹2.67 Lakh for first-time home buyers.' },
        { q: 'Which builders have affordable flats under ₹50 Lakh in Gurgaon?', a: 'Signature Global (Sector 37D, 92), Paras Buildtech (Sector 37D), GLS Avenue 51 (Sector 92), ROF Amaltas (Sector 92), Adani Aangan (Sector 89A) and BPTP Sector 37D are among the most active builders in the under ₹50 Lakh segment in Gurgaon.' },
      ]}
      relatedLinks={[
        { label: 'Flats Under ₹1 Crore Gurgaon', href: '/flats-under-1-crore-gurgaon' },
        { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
        { label: 'Sector 37D Property', href: '/sector-37d-gurgaon-property' },
        { label: '2 BHK Dwarka Expressway', href: '/2-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'All Residential Property', href: '/residential-property-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
