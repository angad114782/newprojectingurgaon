import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sector 113 Gurgaon Property 2025 | Near IGI Airport | M3M Capital Walk',
  description: 'Best property in Sector 113 Gurgaon — near IGI Airport, Dwarka Expressway. M3M Capital Walk 2/3/4 BHK from ₹1.5 Cr. Airport zone investment. Free site visit.',
  keywords: 'sector 113 gurgaon property, sector 113 gurgaon flats, property in sector 113 gurgaon, M3M Capital Walk Sector 113, near airport property gurgaon, dwarka expressway sector 113, 2 bhk sector 113 gurgaon',
  openGraph: { title: 'Sector 113 Gurgaon Property — Airport Zone', description: 'M3M Capital Walk & top projects in Sector 113 Gurgaon from ₹1.5 Cr.', url: '/sector-113-gurgaon-property', type: 'website' },
  alternates: { canonical: '/sector-113-gurgaon-property' },
  robots: { index: true, follow: true },
};

export default async function Sector113Page() {
  const projects = await fetchProjectsWithFallback({ sector: 'Sector 113', limit: 9 });
  return (
    <LocationPageTemplate
      title="Sector 113 Gurgaon Property"
      metaTitle="Sector 113 Gurgaon Property"
      badge="📍 Sector 113 — Airport Zone"
      heroSubtitle="Sector 113 on Dwarka Expressway is Gurgaon's closest residential sector to IGI Airport. With Metro Phase II connectivity, premium builders and strong appreciation history, it is one of the most sought-after investment addresses in Gurgaon."
      overview="Sector 113 Gurgaon is located on the Dwarka Expressway (NH-248BB) at the Delhi–Gurgaon border. The sector is 2 km from the Delhi border, 15 minutes from IGI Airport and is set to receive Metro Phase II connectivity. Premium builders including M3M, Tata Housing and others have active projects here. The area offers a mix of new launch and under-construction residences with strong rental demand from airport zone professionals."
      whyInvest={[
        'Closest residential sector to IGI Airport — 15 min drive',
        'Delhi border sector — low land availability limits future supply',
        'Metro Phase II extension planned to Sector 113',
        'Strong rental demand from airport, aviation and corporate zones',
        '30–40% price appreciation recorded in past 3 years',
        'Premium builders ensuring project quality and delivery',
        'Excellent connectivity to NH-48, SPR and Cyber City',
      ]}
      connectivity={[
        'IGI Airport — 15 minutes via Dwarka Expressway',
        'Dwarka Sector 21 Metro — 8 km',
        'NH-48 (Delhi–Jaipur Highway) — 3 km',
        'Cyber City, Gurgaon — 22 minutes',
        'Connaught Place — 30 minutes',
        'Proposed Metro Phase II stop within sector',
      ]}
      landmarks={[
        'Diplomatic Enclave, Delhi — 12 km',
        'DLF Cybercity — 22 km',
        'Ambience Mall — 12 km',
        'Medanta Hospital — 18 km',
        'Ryan International School — 6 km',
        'Dwarka Expressway toll plaza — 2 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹9,500' },
        { label: 'Appreciation (3Y)', value: '38%' },
        { label: 'Rental Yield', value: '3.5%' },
        { label: 'Active Projects', value: '12+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'Is Sector 113 Gurgaon good for investment?', a: 'Yes. Sector 113 is one of the best investment addresses in Gurgaon owing to airport proximity, limited land supply at Delhi border and upcoming Metro Phase II connectivity. The sector has shown 35–40% appreciation in 3 years.' },
        { q: 'What is the price per sq ft in Sector 113 Gurgaon?', a: 'Current prices in Sector 113 range from ₹8,500–11,000 per sq ft depending on the project, configuration and floor. New launch options are available from ₹80 Lakh for 2BHK.' },
        { q: 'Is Sector 113 on Dwarka Expressway?', a: 'Yes, Sector 113 Gurgaon is located on Dwarka Expressway (NH-248BB) at the Delhi–Gurgaon border. It is directly accessible from the expressway and falls within the premium airport zone.' },
      ]}
      relatedLinks={[
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Sector 106 Gurgaon', href: '/sector-106-gurgaon-property' },
        { label: 'Sector 102 Gurgaon', href: '/sector-102-gurgaon-property' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
      ]}
    />
  );
}
