import type { Metadata } from 'next';
import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { fetchProjectsWithFallback } from '@/lib/api-projects';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const pageUrl = `${siteUrl}/golf-course-road-projects`;
  return {
    title: 'Golf Course Road Projects Gurgaon 2025 | DLF Luxury Property Sector 42–54',
    description: 'Premium projects on Golf Course Road Gurgaon — DLF Camellias, DLF Crest, Tulip Monsella, Oberoi Sky Heights. Luxury 3/4 BHK and penthouses in Sector 42, 43, 54, 56. From ₹3 Cr to ₹100 Cr. Free advisory.',
    keywords: 'golf course road projects gurgaon, property on golf course road gurgaon, gcr gurgaon property, dlf golf course road, luxury apartments golf course road, sector 54 gurgaon property, sector 42 43 gurgaon',
    openGraph: {
      title: 'Golf Course Road Projects Gurgaon | DLF, Oberoi, Tulip ₹3 Cr+',
      description: 'Gurgaon\'s most prestigious address — Golf Course Road luxury apartments by DLF, Oberoi, Tulip.',
      url: pageUrl, type: 'website',
    },
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true },
  };
}

export default async function GolfCourseRoadPage() {
  const projects = await fetchProjectsWithFallback({ corridor: 'Golf Course Road', limit: 15 });

  return (
    <LocationPageTemplate
      title="Golf Course Road Projects, Gurgaon"
      metaTitle="Golf Course Road Projects Gurgaon"
      badge="⛳ Golf Course Road — Gurgaon's Most Prestigious Address"
      heroSubtitle="Golf Course Road (GCR) is Gurgaon's most exclusive residential corridor — home to DLF Camellias, DLF Magnolias, DLF The Crest, Tulip Monsella and Oberoi Sky Heights. Luxury 3, 4 and 5 BHK apartments and penthouses from ₹3 Crore to ₹100 Crore+ in Sectors 42, 43, 54 and 56."
      overview="Golf Course Road (GCR) is distinct from Golf Course Extension Road (GCER) — GCR runs from DLF Cyber City to Sohna Road via Sectors 42–56, while GCER extends towards Sohna from Vatika Chowk. GCR is Gurgaon's original luxury belt, established in the 2000s by DLF's landmark townships. Today it commands the highest per-sqft rates in Gurgaon — ₹20,000 to ₹50,000/sqft — and is home to India's most expensive private apartments."
      whyInvest={[
        'Most prestigious Gurgaon address — highest per-sqft value after South Mumbai',
        'DLF dominates this corridor — brand commands perennial premium',
        'Excellent social infrastructure: 5-star hotels, world-class hospitals, international schools',
        'Cyber City proximity — 5 minutes to Gurgaon\'s largest business district',
        'Highest rental values: ₹3–₹10 Lakh/month for luxury 4 BHK',
        'Long-term capital preservation — most stable luxury real estate in NCR',
        'MG Road Metro for secondary connectivity',
      ]}
      connectivity={[
        'Cyber City, Gurgaon — 5 minutes',
        'NH-48 (Delhi–Jaipur Highway) — 5 km via Shankar Chowk',
        'IGI Airport — 30–35 minutes',
        'MG Road Metro — 3 km',
        'IFFCO Chowk Metro — 4 km',
        'Sohna Road — 15 minutes via Golf Course Road',
      ]}
      landmarks={[
        'DLF Golf & Country Club — adjacent',
        'DLF Cyber Hub — 4 km',
        'The Leela Hotel, Gurgaon — 5 km',
        'Medanta Medicity — 10 km',
        'American Embassy School — 8 km',
        'DLF Mall of India (proposed) — 5 km',
      ]}
      bestFor="End User"
      investmentHighlights={[
        { label: 'Price Range', value: '₹3 Cr – ₹100 Cr+' },
        { label: 'Avg Price/sqft', value: '₹20,000–₹50,000' },
        { label: 'Best Project', value: 'DLF Camellias' },
        { label: 'Rental (4 BHK)', value: '₹3L–₹10L/mo' },
        { label: 'Appreciation (10Y)', value: '200–300%' },
        { label: 'Key Sectors', value: '42, 43, 54, 56' },
      ]}
      faqs={[
        { q: 'What is the difference between Golf Course Road (GCR) and Golf Course Extension Road (GCER) in Gurgaon?', a: 'Golf Course Road (GCR) runs from DLF Cyber City through Sectors 42–56 — it is the original luxury belt established by DLF in the early 2000s. Golf Course Extension Road (GCER) extends further towards Sohna from Vatika Chowk, through sectors 57–75. GCR is more established and premium, GCER is newer with higher appreciation potential.' },
        { q: 'What are the best projects on Golf Course Road Gurgaon?', a: 'Top projects on Golf Course Road include: DLF The Camellias (ultra-luxury penthouse, ₹40–100 Cr), DLF The Magnolias (luxury 4 BHK, ₹15–40 Cr), DLF The Crest (Sector 54, 3/4 BHK, ₹5–15 Cr), Tulip Monsella (Sector 54, 4 BHK, ₹8–25 Cr) and Oberoi Sky Heights (3/4 BHK, ₹8–20 Cr).' },
        { q: 'What is the price per sqft on Golf Course Road Gurgaon?', a: 'Golf Course Road commands ₹20,000–₹50,000 per sqft depending on the project. DLF Camellias is at ₹45,000–₹55,000/sqft. Mid-luxury projects like DLF The Crest are at ₹20,000–₹25,000/sqft. New launches on adjacent sectors (42, 43) start at ₹15,000/sqft.' },
        { q: 'Is Golf Course Road good for investment in 2025?', a: 'GCR is best for capital preservation and long-term wealth creation rather than short-term flipping. Luxury properties here have given 200–300% returns in 10 years. However, entry prices are very high (₹3 Cr+). For pure investment returns, Golf Course Extension Road may offer better near-term upside at lower entry prices.' },
      ]}
      relatedLinks={[
        { label: 'Golf Course Extension Road Projects', href: '/golf-course-extension-road-projects' },
        { label: 'Penthouse in Gurgaon', href: '/penthouse-in-gurgaon' },
        { label: 'Luxury Above ₹3 Crore', href: '/luxury-apartments-above-3-crore-gurgaon' },
        { label: '3 BHK Golf Course Ext Road', href: '/3-bhk-flats-golf-course-extension-road-gurgaon' },
        { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      ]}
      projects={projects}
    />
  );
}
