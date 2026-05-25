import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import LeadForm from '@/components/home/LeadForm';
import { LocationsSection, WhyChooseUs, BuilderLogos, TestimonialsSection, MarketStatsSection, FAQSection, InternalLinksBlock } from '@/components/home/HomeSections';
import { ROICalculator } from '@/components/conversion/PsychTriggers';
import { LocalBusinessSchema, FAQSchema } from '@/components/seo/SchemaMarkup';

const SITE_URL = 'https://www.gurgaonrealty.in';

export const metadata: Metadata = {
  title: 'New Projects in Gurgaon 2025 | New Launch & Premium Property | GurgaonRealty',
  description:
    'GurgaonRealty — Gurgaon\'s most trusted real estate advisory. Explore 150+ verified new launch projects, pre-launch, under construction and ready-to-move properties on Dwarka Expressway, Golf Course Extension Road and SPR Road. Free site visit. Zero brokerage.',
  keywords: [
    'new projects in gurgaon', 'new launch projects gurgaon 2025', 'property in gurgaon',
    'luxury apartments gurgaon', 'dwarka expressway projects', 'residential property gurgaon',
    'new launch gurgaon', 'gurgaon real estate', 'flats in gurgaon', 'buy property gurgaon',
    'sector 113 gurgaon', 'sector 106 gurgaon', 'golf course extension road projects',
    'spr road gurgaon', 'new gurgaon projects',
  ],
  openGraph: {
    title: 'New Projects in Gurgaon 2025 | New Launch & Premium Property',
    description: 'Discover 150+ verified new launch and ready-to-move properties in Gurgaon. Free advisory, site visits and RERA-verified projects.',
    url: SITE_URL,
    siteName: 'GurgaonRealty',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: 'New Projects in Gurgaon — GurgaonRealty' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Projects in Gurgaon 2025 | GurgaonRealty',
    description: 'Verified new launch and premium property advisory in Gurgaon.',
    images: [`${SITE_URL}/og-home.jpg`],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
};

const HOME_FAQS = [
  { q: 'What are new launch projects in Gurgaon?', a: 'New launch projects in Gurgaon are freshly RERA-registered residential developments with bookings open for the first time. They offer 10–25% lower pricing vs ongoing projects and the highest appreciation potential.' },
  { q: 'Which is the best sector to invest in Gurgaon in 2025?', a: 'Dwarka Expressway (Sectors 99–115) leads for ROI. Golf Course Extension Road is best for premium lifestyle. Sector 37D and New Gurgaon offer the best affordable options. SPR Road is emerging for luxury investment.' },
  { q: 'Is GurgaonRealty free for buyers?', a: 'Yes. Our advisory, price comparisons, site visits and brochure sharing are completely free for buyers. We earn only from verified builders — never from you.' },
  { q: 'How do I verify a Gurgaon project is RERA approved?', a: 'Visit haryanarera.gov.in and search by project name or RERA number. Every project on GurgaonRealty is RERA-verified before listing.' },
  { q: 'What is the minimum investment for property in Gurgaon?', a: 'Residential property in Gurgaon starts from ₹40 Lakh for 2BHK in Sector 37D (DDJAY scheme). Mid-segment starts at ₹80 Lakh (2BHK on Dwarka Expressway). Luxury starts from ₹2.5 Cr.' },
  { q: 'How does GurgaonRealty\'s site visit support work?', a: 'Fill in your requirements and an advisor calls you within 2 hours to schedule a free site visit. We personally accompany you, share honest project analysis and follow up without any pressure.' },
];

export default function HomePage() {
  return (
    <>
      {/* AIO/GEO: Rich structured data for AI search engines */}
      <LocalBusinessSchema page="home" />
      <FAQSchema faqs={HOME_FAQS} />

      {/* Semantic content hint for AI crawlers */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GurgaonRealty',
        url: SITE_URL,
        description: 'Gurgaon\'s most trusted real estate advisory for new launch projects, premium properties and investment guidance.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/new-projects-in-gurgaon?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }) }} />

      {/* Hero */}
      <HeroSection />

      {/* Trust strip + builder logos */}
      <BuilderLogos />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Location grid with images */}
      <LocationsSection />

      {/* Market Stats */}
      <MarketStatsSection />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Investment Calculator + Lead Form */}
      <section className="py-16 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                📈 Investment Calculator
              </span>
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                See How Your Money Grows in Gurgaon
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Gurgaon real estate has delivered 15–45% appreciation over 3 years across key corridors.
                Use our calculator to see what your investment could become.
              </p>
              <ROICalculator />
            </div>
            <div id="lead-form">
              <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                📋 Free Advisory
              </span>
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Get Expert Property Advice — Free
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Our advisor will share the top 3 verified projects matching your budget, location and goals — within 2 hours.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Internal links — SEO */}
      <InternalLinksBlock currentPage="/" />
    </>
  );
}
