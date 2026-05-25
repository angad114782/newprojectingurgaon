import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const metadata: Metadata = {
  title: 'Sector 37D Gurgaon Property | Affordable New Projects in New Gurgaon',
  description: 'Explore affordable residential projects in Sector 37D Gurgaon near Dwarka Expressway metro. Signature Global, Hero Homes and budget-friendly new launches for first-time homebuyers.',
  keywords: 'sector 37d gurgaon property, sector 37d gurgaon flats, new gurgaon sector 37d projects',
  alternates: { canonical: 'https://www.gurgaonrealty.in/sector-37d-gurgaon-property' },
};

export default async function Sector37DPage() {
  const projects = await fetchProjectsWithFallback({ sector: 'Sector 37D', limit: 9 });
  return (
    <LocationPageTemplate
      title="Sector 37D Gurgaon Property"
      metaTitle="Sector 37D Gurgaon Property"
      badge="📍 Sector 37D — Affordable New Gurgaon"
      heroSubtitle="Sector 37D in New Gurgaon is one of the most active affordable housing zones in Gurgaon. Known for Signature Global and Deen Dayal Jan Awas Yojana (DDJAY) projects, it offers budget-friendly homes near the Dwarka Expressway metro corridor."
      overview="Sector 37D is part of New Gurgaon, located near Dwarka Expressway and the Delhi–Jaipur Highway. The sector is home to several affordable housing projects by Signature Global under DDJAY scheme and Hero Homes, making it the go-to destination for first-time buyers in the ₹35–80 Lakh range. The metro connectivity from Sector 37 station on Yellow Line further enhances its appeal."
      whyInvest={[
        'Most affordable new launch and possession-ready options in Gurgaon',
        'Signature Global DDJAY projects — government-backed affordable scheme',
        'Metro Yellow Line at Sector 37 — 3 km walk or feeder',
        'IMT Manesar industrial zone drives rental demand',
        'NH-48 access — Hero Honda Chowk at 5 km',
        'Price appreciation potential as area matures',
        'Perfect first home or investment under ₹80 Lakh',
      ]}
      connectivity={[
        'Metro Yellow Line — Sector 37 station, 3 km',
        'NH-48 (Delhi–Jaipur Highway) — 5 km',
        'Hero Honda Chowk — 5 km',
        'Pataudi Road — direct access',
        'IMT Manesar — 15 km',
        'Gurgaon Railway Station — 12 km',
      ]}
      landmarks={[
        'IMT Manesar Industrial Zone — 15 km',
        'Hero Honda factory — 8 km',
        'Sector 37 Metro Station — 3 km',
        'Gurgaon Bus Stand — 12 km',
        'Pacific Mall (proposed) — nearby',
        'Upcoming commercial developments on Pataudi Road',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹4,800' },
        { label: 'Appreciation (3Y)', value: '18%' },
        { label: 'Rental Yield', value: '4.2%' },
        { label: 'Active Projects', value: '6+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'What are DDJAY projects in Sector 37D?', a: 'DDJAY (Deen Dayal Jan Awas Yojana) is a Haryana government scheme for affordable housing. Projects under DDJAY in Sector 37D by Signature Global offer 2BHK and 3BHK homes at subsidised rates, ideal for first-time homebuyers.' },
        { q: 'Is Sector 37D good for first-time homebuyers?', a: 'Yes. Sector 37D offers the most affordable housing options in Gurgaon with government-backed DDJAY projects. It is ideal for buyers with a ₹40–80 Lakh budget looking for RERA-approved, builder-delivered homes.' },
      ]}
      relatedLinks={[
        { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
      ]}
    />
  );
}
