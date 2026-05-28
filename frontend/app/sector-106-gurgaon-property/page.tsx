import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const metadata: Metadata = {
  title: 'Sector 106 Gurgaon Property | Premium Projects on Dwarka Expressway',
  description: 'Find the best residential projects in Sector 106 Gurgaon — premium 2BHK, 3BHK and 4BHK apartments on Dwarka Expressway from top builders like Godrej, Tata and Hero Homes.',
  keywords: 'sector 106 gurgaon property, sector 106 gurgaon flats, sector 106 gurgaon projects',
  alternates: { canonical: '/sector-106-gurgaon-property' },
};

export default async function Sector106Page() {
  const projects = await fetchProjectsWithFallback({ sector: 'Sector 106', limit: 9 });
  return (
    <LocationPageTemplate
      title="Sector 106 Gurgaon Property"
      metaTitle="Sector 106 Gurgaon Property"
      badge="📍 Sector 106 — Premium Residential Belt"
      heroSubtitle="Sector 106 Gurgaon is a premium residential sector on Dwarka Expressway, home to projects by Godrej Properties, Tata Housing and Hero Homes. With excellent connectivity, green surroundings and lifestyle infrastructure, it is a top choice for families and investors."
      overview="Sector 106 Gurgaon is a well-established premium residential sector on Dwarka Expressway. The sector hosts mid-to-premium segment projects from reputed builders and offers a balanced mix of under-construction and ready-to-move residences. It is popular with families seeking connectivity to Delhi and the Gurgaon business districts without the premium of DLF 5 or Golf Course Road."
      whyInvest={[
        'Well-connected to NH-48 and Dwarka Expressway',
        'Projects by Godrej, Tata, Hero Homes — credible builders',
        'Green belt sector with low-density development',
        'Strong end-user demand keeping rental yields healthy',
        '25–35% appreciation recorded in past 3 years',
        'Multiple possession options — both ready and under construction',
        'Proximity to upcoming commercial hub at Sector 109–112',
      ]}
      connectivity={[
        'Dwarka Expressway — 1 km from sector',
        'IGI Airport — 20 minutes',
        'NH-48 — 5 km via expressway',
        'Proposed metro — Phase II extension nearby',
        'Cyber City — 25 minutes',
        'Dwarka, Delhi — 15 minutes',
      ]}
      landmarks={[
        'Ansal University — 4 km',
        'Ryan International School — 3 km',
        'Palam Vihar market — 5 km',
        'Akshardham Temple, Delhi — 18 km',
        'Fortis Hospital — 20 km',
        'Sector 109 commercial hub — 4 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹8,500' },
        { label: 'Appreciation (3Y)', value: '30%' },
        { label: 'Rental Yield', value: '3.2%' },
        { label: 'Active Projects', value: '10+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'Is Sector 106 good for residential living?', a: 'Yes. Sector 106 is a green, low-density sector with premium projects and good connectivity to Delhi and Gurgaon. It is especially popular with families looking for quality housing away from the central Gurgaon buzz.' },
        { q: 'What is the price range in Sector 106 Gurgaon?', a: 'Residential projects in Sector 106 are priced between ₹7,500–10,000 per sq ft. A 2BHK typically ranges from ₹85 Lakh to ₹1.5 Cr and a 3BHK from ₹1.2 Cr to ₹2.2 Cr.' },
      ]}
      relatedLinks={[
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
        { label: 'Sector 102 Gurgaon', href: '/sector-102-gurgaon-property' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
      ]}
    />
  );
}
