import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sector 102 Gurgaon Property | Affordable Projects near Palam Vihar',
  description: 'Explore residential property in Sector 102 Gurgaon with affordable pricing, Palam Vihar connectivity and upcoming metro extension. Best budget projects on Dwarka Expressway.',
  keywords: 'sector 102 gurgaon property, sector 102 gurgaon flats, sector 102 gurgaon projects',
  alternates: { canonical: '/sector-102-gurgaon-property' },
};

export default async function Sector102Page() {
  const projects = await fetchProjectsWithFallback({ sector: 'Sector 102', limit: 9 });
  return (
    <LocationPageTemplate
      title="Sector 102 Gurgaon Property"
      metaTitle="Sector 102 Gurgaon Property"
      badge="📍 Sector 102 — Budget-Friendly on Dwarka Expressway"
      heroSubtitle="Sector 102 Gurgaon offers value-priced residential options on Dwarka Expressway near Palam Vihar. An emerging sector with good connectivity and strong rental demand, ideal for first-time buyers and budget-conscious investors."
      overview="Sector 102 Gurgaon is located on the Dwarka Expressway corridor near Palam Vihar, offering budget-friendly residential options compared to higher sectors like 113 or 106. The sector is popular with government employees, mid-income families and investors seeking affordable entry points on the Dwarka Expressway belt."
      whyInvest={[
        'Most affordable entry point on Dwarka Expressway',
        'Close to Palam Vihar — established residential market',
        'Strong rental demand from CISF, army and government employees',
        'Expected appreciation as expressway infrastructure matures',
        'Upcoming Metro Phase II to improve connectivity',
        'Quiet, green sector with low-rise and mid-rise mix',
      ]}
      connectivity={[
        'Dwarka Expressway — 1.5 km',
        'Palam Vihar market — 4 km',
        'IGI Airport — 22 minutes',
        'NH-48 — 6 km',
        'Dwarka, Delhi — 14 km',
        'Gurgaon Railway Station — 15 km',
      ]}
      landmarks={[
        'Palam Vihar Extension — adjacent',
        'CISF Campus — 5 km',
        'Rangpuri market — 8 km',
        'Bata Chowk — 6 km',
        'Ryan International School — 5 km',
        'Sheetla Mata Mandir — 7 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹6,500' },
        { label: 'Appreciation (3Y)', value: '22%' },
        { label: 'Rental Yield', value: '3.8%' },
        { label: 'Active Projects', value: '8+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'What is the price range in Sector 102 Gurgaon?', a: 'Sector 102 properties range from ₹5,500–7,500 per sq ft, making it one of the most affordable sectors on Dwarka Expressway. 2BHK flats are available from ₹50 Lakh.' },
        { q: 'Is Sector 102 a good investment?', a: 'Yes for budget investors. The sector offers lower entry costs with moderate appreciation potential as Dwarka Expressway infrastructure matures. Rental yields are strong due to proximity to CISF and government facilities.' },
      ]}
      relatedLinks={[
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
        { label: 'Sector 106 Gurgaon', href: '/sector-106-gurgaon-property' },
        { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
        { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
      ]}
    />
  );
}
