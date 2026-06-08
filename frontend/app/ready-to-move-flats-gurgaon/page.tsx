import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const pageUrl = `${siteUrl}/ready-to-move-flats-gurgaon`;
  return {
    title: 'Ready to Move Flats in Gurgaon 2025 | Immediate Possession Apartments',
    description: 'Buy ready-to-move flats in Gurgaon — immediate possession, no GST, no wait. 2/3/4 BHK apartments on Dwarka Expressway, Golf Course Road, Sohna Road. Verified projects. Free site visit.',
    keywords: 'ready to move flats gurgaon, ready possession apartments gurgaon, immediate possession flats gurgaon, ready to move 3 bhk gurgaon, rtm flats gurgaon 2025, no gst ready flats gurgaon',
    openGraph: {
      title: 'Ready to Move Flats in Gurgaon 2025 | Immediate Possession',
      description: 'Best ready-to-move apartments in Gurgaon — no GST, instant possession, verified projects.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function ReadyToMoveFlatsPage() {
  const projects = await fetchProjectsWithFallback({ status: 'Ready To Move', limit: 20 });

  return (
    <LocationPageTemplate
      title="Ready to Move Flats in Gurgaon"
      metaTitle="Ready to Move Flats in Gurgaon"
      badge="🔑 Move In Today — Zero GST, Immediate Possession"
      heroSubtitle="Skip the wait. Gurgaon's best ready-to-move apartments are available for immediate possession — no GST on completed projects, no construction risk, start living or earning rental income from day one. 2, 3 and 4 BHK options on Dwarka Expressway, Golf Course Road, Sohna Road and New Gurgaon."
      overview="Ready-to-move properties in Gurgaon offer significant advantages over under-construction units: zero GST (saving 5%), no construction delay risk, ability to inspect the actual unit before buying, and immediate rental income. Major RTM projects are concentrated in Sectors 37D, 102, 106, 108 (Dwarka Expressway), Sectors 65–70 (Golf Course Extension Road), and Sectors 47–50 (Sohna Road). Prices are typically 10–15% higher than new launches but offer immediate possession."
      whyInvest={[
        'Zero GST on ready-to-move properties (save 5% compared to under-construction)',
        'No construction delay risk — what you see is what you get',
        'Immediate rental income — start earning from day one',
        'Actual flat inspection possible — judge finishes, view and noise levels',
        'Faster home loan processing for completed properties',
        'No payment default risk from builder delays',
        'Strong resale value — RTM always commands a premium',
      ]}
      connectivity={[
        'Dwarka Expressway RTM projects — 20 min to IGI Airport',
        'Golf Course Extension Road RTM — 10 min to Cyber City',
        'Sohna Road RTM — connects to NH-48 and SPR',
        'MG Road Metro for central Gurgaon RTM projects',
        'Rapid Metro (Gurgaon) — connects Golf Course Road RTM areas',
        'NH-48 (Delhi–Jaipur Highway) — accessible from all RTM zones',
      ]}
      landmarks={[
        'Sobha City (Sector 108) — major RTM township on Dwarka Expressway',
        'BPTP Park Floors (Sector 102) — popular RTM option',
        'Emaar Palm Heights (GCER) — ready luxury apartments',
        'DLF The Crest (Sector 54, Golf Course Road) — premium RTM',
        'Vatika City (Sector 49) — large ready township',
        'Bestech Park View (Sector 57) — established RTM project',
      ]}
      bestFor="End User"
      investmentHighlights={[
        { label: 'GST Saving', value: '5% (Zero GST)' },
        { label: 'Possession', value: 'Immediate' },
        { label: 'Price Premium', value: '10–15% over NL' },
        { label: 'Rental Start', value: 'Day 1' },
        { label: 'Loan Approval', value: 'Faster' },
        { label: 'Risk', value: 'Zero Construction' },
      ]}
      faqs={[
        { q: 'Is there GST on ready-to-move flats in Gurgaon?', a: 'No. Ready-to-move properties with a valid Occupancy Certificate (OC) or Completion Certificate (CC) are exempt from GST. This saves 5% compared to under-construction properties where GST is applicable. This is one of the biggest advantages of buying ready-to-move in Gurgaon.' },
        { q: 'What is the advantage of buying ready-to-move over under-construction in Gurgaon?', a: 'Key advantages: (1) Zero GST saves 5% of property value; (2) No construction delay risk; (3) Immediate possession and rental income; (4) Actual flat inspection before purchase; (5) Faster home loan disbursement; (6) No risk of builder default on construction.' },
        { q: 'Which areas in Gurgaon have the most ready-to-move flats?', a: 'Ready-to-move inventory is highest in: Dwarka Expressway Sectors 102, 104, 108 (Sobha City, BPTP); Golf Course Extension Road Sectors 65–70 (Emaar, Bestech); Sohna Road Sectors 47–50 (Vatika City, DLF); and Sector 37D (DDJAY ready homes).' },
        { q: 'Are ready-to-move flats in Gurgaon more expensive?', a: 'Yes, typically 10–15% more than new launches. However, the 5% GST saving partially offsets this. When you factor in the elimination of GST, lower risk and immediate income potential, RTM often works out to similar or better value than an under-construction home.' },
      ]}
      relatedLinks={[
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: '3 BHK Dwarka Expressway', href: '/3-bhk-flats-in-dwarka-expressway-gurgaon' },
        { label: 'Golf Course Extension Road Projects', href: '/golf-course-extension-road-projects' },
        { label: 'Flats Under 1 Crore', href: '/flats-under-1-crore-gurgaon' },
        { label: 'All New Projects', href: '/new-projects-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
