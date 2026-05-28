import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const metadata: Metadata = {
  title: 'Golf Course Extension Road Projects 2025 | Luxury & Premium Property Gurgaon',
  description: 'Best projects on Golf Course Extension Road Gurgaon — Oberoi Sky Heights, Emaar Digi Homes, DLF Arbour, Tata One. Luxury 3/4 BHK from ₹1.2 Cr to ₹12 Cr. Free advisory.',
  keywords: 'golf course extension road projects, golf course extension road gurgaon, property on golf course extension road, sector 58 gurgaon, Oberoi Gurgaon, DLF Arbour sector 63, luxury apartments GCER Gurgaon',
  openGraph: { title: 'Golf Course Extension Road Projects Gurgaon | Luxury Property', description: 'Oberoi, DLF, Emaar projects on GCER — luxury 3/4 BHK from ₹1.2 Cr.', url: '/golf-course-extension-road-projects', type: 'website' },
  alternates: { canonical: '/golf-course-extension-road-projects' },
  robots: { index: true, follow: true },
};

export default async function GolfCourseExtPage() {
  const projects = await fetchProjectsWithFallback({ corridor: 'Golf Course Extension Road', limit: 9 });
  return (
    <LocationPageTemplate
      title="Golf Course Extension Road Projects"
      metaTitle="Golf Course Extension Road Projects"
      badge="⛳ Golf Course Ext Road — Top Rated Premium Belt"
      heroSubtitle="Golf Course Extension Road is Gurgaon's most desirable premium residential corridor, stretching from Vatika Chowk to Sohna Road. Home to projects by Emaar, M3M, Sobha, DLF and Tata, it offers the perfect blend of luxury lifestyle, business connectivity and investment potential."
      overview="Golf Course Extension Road (GCER) runs from Vatika Chowk in Gurgaon to Sohna Road, spanning sectors 57–75. It is one of the widest and best-maintained arterial roads in Gurgaon, lined with premium residential complexes, 5-star hotels, office parks and retail. Projects here command premium pricing due to unmatched lifestyle infrastructure, corporate proximity and brand-name builders."
      whyInvest={[
        'Premium corridor with highest quality residential projects',
        'Best-in-class lifestyle: clubhouses, sports facilities, retail',
        'Top builders: Emaar, M3M, Sobha, Tata, DLF',
        'Office parks and corporate campuses within 5 km',
        'Consistent 20–30% appreciation in premium projects',
        'Strong NRI and HNI buyer demand',
        'Easy access to Cyber City, Golf Course Road and Sohna Road',
      ]}
      connectivity={[
        'NH-48 (Delhi–Jaipur Highway) — 8 km via GCER',
        'Cyber City, Gurgaon — 10 km',
        'Golf Course Road — connects via Vatika Chowk',
        'Sohna Road — connects to SPR and Faridabad',
        'IGI Airport — 30 minutes',
        'Huda City Centre Metro — 12 km',
      ]}
      landmarks={[
        'Emaar Palm Hills Golf Course — adjacent',
        'M3M Golfestate — nearby',
        'Vatika Chowk — 3 km',
        'South Point Mall — 5 km',
        'GD Goenka School — 4 km',
        'Fortis Hospital — 8 km',
      ]}
      bestFor="Both"
      investmentHighlights={[
        { label: 'Avg Price/sqft', value: '₹11,500' },
        { label: 'Appreciation (3Y)', value: '28%' },
        { label: 'Rental Yield', value: '3.0%' },
        { label: 'Active Projects', value: '20+' },
      ]}
      projects={projects}
      faqs={[
        { q: 'What is Golf Course Extension Road in Gurgaon?', a: 'Golf Course Extension Road is a premium residential and commercial corridor in Gurgaon stretching from Vatika Chowk to Sohna Road (Sectors 57–75). It is known for luxury residential projects, golf courses, 5-star hotels and premium offices.' },
        { q: 'What is the price range on Golf Course Extension Road?', a: 'Properties on Golf Course Extension Road range from ₹9,000–15,000+ per sq ft. 2BHK apartments start from ₹1 Cr and luxury 4BHK penthouses can exceed ₹6 Cr.' },
      ]}
      relatedLinks={[
        { label: 'SPR Road Projects', href: '/spr-road-projects' },
        { label: 'New Projects Gurgaon', href: '/new-projects-in-gurgaon' },
        { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
        { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      ]}
    />
  );
}
