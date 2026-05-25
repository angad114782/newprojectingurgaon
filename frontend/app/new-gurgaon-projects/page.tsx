import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const metadata: Metadata = {
  title: 'New Gurgaon Projects 2025 | Affordable Property in New Gurgaon',
  description: 'Best affordable projects in New Gurgaon — Godrej Nurture, Signature Global 37D. 2 BHK from ₹45 Lakh. Property in New Gurgaon near Manesar. Free site visit.',
  keywords: 'new gurgaon projects, property in new gurgaon, new gurgaon property, upcoming projects new gurgaon, affordable property gurgaon, 2 bhk new gurgaon, property near manesar gurgaon, sector 37d gurgaon, Godrej Nurture New Gurgaon',
  openGraph: { title: 'New Gurgaon Projects — Affordable Property', description: 'Godrej, Signature Global projects in New Gurgaon from ₹45 Lakh.', url: 'https://www.gurgaonrealty.in/new-gurgaon-projects', type: 'website' },
  alternates: { canonical: 'https://www.gurgaonrealty.in/new-gurgaon-projects' },
  robots: { index: true, follow: true },
};

export default async function NewGurgaonProjectsPage() {
  const projects = await fetchProjectsWithFallback({ corridor: 'New Gurgaon', limit: 9 });
  return (
    <LocationPageTemplate
      title="New Gurgaon Projects"
      metaTitle="New Gurgaon Projects"
      badge="🌆 New Gurgaon — Emerging Investment Zone"
      heroSubtitle="New Gurgaon (Sectors 81–95 and beyond) is Gurgaon's emerging residential belt with affordable to mid-segment housing options, strong infrastructure plans and proximity to IMT Manesar — one of India's largest industrial zones."
      overview="New Gurgaon refers to sectors 81–95 on the western side of Gurgaon, along Pataudi Road and near IMT Manesar. The area is experiencing rapid development with affordable, mid-segment and some premium projects. Government investment in road widening, the proposed metro extension and the growth of Manesar industrial zone are key growth drivers for New Gurgaon real estate."
      whyInvest={[
        'Most affordable large-format residential projects in Gurgaon',
        'Proximity to IMT Manesar — India\'s biggest industrial township',
        'Government infrastructure investment in roads and utilities',
        'Proposed metro extension to enhance connectivity',
        'Strong rental demand from Manesar and NH-48 corridor employees',
        'Large plotted and villa projects available at competitive rates',
        'Ideal for long-term investment at low entry cost',
      ]}
      connectivity={[
        'NH-48 (Delhi–Jaipur Highway) — 8 km',
        'Hero Honda Chowk — 10 km',
        'IMT Manesar — 10–15 km',
        'Gurgaon City Centre — 20 km',
        'NH-48 access via Pataudi Road',
        'Proposed metro extension on Pataudi Road corridor',
      ]}
      landmarks={[
        'IMT Manesar Industrial Zone — 12 km',
        'Maruti Suzuki Factory — 15 km',
        'Hero Honda Factory — 10 km',
        'Pataudi Town — 20 km',
        'NH-48 Haldiram toll — 8 km',
        'Sector 37D (DDJAY zone) — 5 km',
      ]}
      bestFor="Investor"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹4,200' },
        { label: 'Appreciation (3Y)', value: '15%' },
        { label: 'Rental Yield', value: '4.5%' },
        { label: 'Active Projects', value: '25+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'What is New Gurgaon?', a: 'New Gurgaon refers to the emerging residential and industrial belt in sectors 81–95 and beyond, extending towards IMT Manesar on the Pataudi Road. It offers affordable housing and strong rental demand from the Manesar industrial corridor.' },
        { q: 'Is New Gurgaon a good investment?', a: 'New Gurgaon is best suited for long-term investors seeking low entry prices with appreciation potential as infrastructure develops. Rental yields here are higher than premium Gurgaon at 4–5% due to strong industrial demand.' },
      ]}
      relatedLinks={[
        { label: 'Sector 37D Property', href: '/sector-37d-gurgaon-property' },
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
      ]}
    />
  );
}
