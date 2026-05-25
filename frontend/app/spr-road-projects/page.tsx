import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const metadata: Metadata = {
  title: 'SPR Road Projects Gurgaon 2025 | Southern Peripheral Road Property',
  description: 'Best projects on SPR Road (Southern Peripheral Road) Gurgaon — DLF Privana, M3M Altitude, M3M Antalya Hills. Luxury & premium 3/4 BHK from ₹1.8 Cr. Free advisory.',
  keywords: 'spr road gurgaon projects, on spr road property, southern peripheral road gurgaon, spr road property, sector 65 gurgaon, DLF Privana SPR, M3M Altitude SPR Road',
  openGraph: { title: 'SPR Road Projects Gurgaon | Premium Property', description: 'Best luxury projects on SPR Road Gurgaon — DLF, M3M from ₹1.8 Cr.', url: 'https://www.gurgaonrealty.in/spr-road-projects', type: 'website' },
  alternates: { canonical: 'https://www.gurgaonrealty.in/spr-road-projects' },
  robots: { index: true, follow: true },
};

export default async function SPRRoadPage() {
  const projects = await fetchProjectsWithFallback({ corridor: 'SPR Road', limit: 9 });
  return (
    <LocationPageTemplate
      title="SPR Road Projects"
      metaTitle="SPR Road Projects Gurgaon"
      badge="🏗️ SPR Road — High ROI Corridor"
      heroSubtitle="Southern Peripheral Road (SPR) is one of Gurgaon's fastest-growing real estate corridors, stretching from Sohna Road to Dwarka Expressway. Known for luxury and premium residential projects with high investment returns."
      overview="Southern Peripheral Road (SPR), also known as the 135-metre road, runs from Sohna Road to Dwarka Expressway, covering sectors 65–85 of Gurgaon. The road connects two major highways and has emerged as a premium investment corridor with M3M, Emaar, Tata and other top builders launching projects along its stretch."
      whyInvest={[
        'Connects Sohna Road to Dwarka Expressway — strategic location',
        'M3M and Emaar presence ensures quality and delivery',
        '25–35% appreciation potential in under-construction projects',
        'Growing commercial development driving end-user demand',
        'Proximity to Golf Course Extension Road premium belt',
        'Large format luxury and premium projects with modern amenities',
        'Strong NRI and HNI investor interest',
      ]}
      connectivity={[
        'Sohna Road — 5 km north',
        'Dwarka Expressway — 10 km west via NH-48',
        'Golf Course Extension Road — 5 km',
        'NH-48 (Delhi–Jaipur Highway) — 12 km',
        'Cyber City — 20 km',
        'IGI Airport — 35 minutes',
      ]}
      landmarks={[
        'M3M Golf Hills — adjacent',
        'Emaar Urban Oasis — nearby',
        'Sector 67 market — 4 km',
        'South Point Mall — 7 km',
        'GD Goenka University — 12 km',
        'Badshahpur metro — 8 km',
      ]}
      bestFor="Investor"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹10,000' },
        { label: 'Appreciation (3Y)', value: '32%' },
        { label: 'Rental Yield', value: '2.8%' },
        { label: 'Active Projects', value: '15+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'What is SPR Road in Gurgaon?', a: 'SPR (Southern Peripheral Road) is a 135-metre wide road in Gurgaon connecting Sohna Road to Dwarka Expressway across sectors 65–85. It is a premium residential and commercial corridor with M3M, Emaar and other top builders.' },
        { q: 'Is SPR Road good for investment?', a: 'Yes. SPR Road has shown 30–35% appreciation in 3 years and is expected to continue growing as commercial developments mature and end-user demand increases from Cyber City and Golf Course Road corporate zone.' },
      ]}
      relatedLinks={[
        { label: 'Golf Course Ext Road', href: '/golf-course-extension-road-projects' },
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
        { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      ]}
    />
  );
}
