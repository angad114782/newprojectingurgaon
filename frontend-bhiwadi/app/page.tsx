import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import LeadForm from '@/components/home/LeadForm';
import { LocationsSection, WhyChooseUs, BuilderLogos, TestimonialsSection, MarketStatsSection, FAQSection, InternalLinksBlock, LuxuryHighlightsStrip, BhiwadiRealEstateGuide, LatestGuidesSection, MarketIntelligenceSection, DynamicCorridorsSection } from '@/components/home/HomeSections';
import { ROICalculator } from '@/components/conversion/PsychTriggers';
import { FAQSchema, SpeakableSchema } from '@/components/seo/SchemaMarkup';
import { fetchSettings } from '@/lib/settings';
import { fetchApiProjects } from '@/lib/api-projects';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  const title = settings.seoTitle || `Property in Bhiwadi 2025 | Residential Plots, Flats & New Launch | ${settings.siteName}`;
  const description = settings.seoDescription || `${settings.siteName} — Bhiwadi's #1 real estate advisory. Verified 1 BHK, 2 BHK & 3 BHK projects from ₹28L on Alwar Bypass, NH-48 & RIICO. Free site visit. Zero brokerage.`;
  const ogImage = settings.ogImage?.startsWith('http') ? settings.ogImage : `${siteUrl}${settings.ogImage || '/og-home.jpg'}`;

  return {
    title,
    description,
    keywords: settings.seoKeywords?.length ? settings.seoKeywords : [
      'property in bhiwadi', 'bhiwadi real estate', 'flats in bhiwadi', 'plots in bhiwadi',
      'new launch bhiwadi 2025', 'residential property bhiwadi', 'bhiwadi property price',
      'nh-48 bhiwadi property', 'alwar bypass road projects', 'industrial plots bhiwadi',
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.siteName,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Property in Bhiwadi — ${settings.siteName}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: { canonical: siteUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  };
}

export default async function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const [settings, featuredProjects] = await Promise.all([
    fetchSettings(),
    fetchApiProjects({ limit: 20 }).catch(() => []),
  ]);

  const faqsForSchema = settings.faqs?.length ? settings.faqs : [
    { q: 'What is the price of property in Bhiwadi in 2025?', a: 'Property prices in Bhiwadi range from ₹28 Lakh for 1 BHK to ₹1.2 Crore for 3 BHK on NH-48. Plots start from ₹15 Lakh. RIICO industrial plots are priced from ₹50 Lakh. Alwar Bypass Road commands ₹3,200–₹5,800 per sq ft.' },
    { q: 'Is Bhiwadi a good investment in 2025?', a: 'Yes. Bhiwadi offers 4–6% rental yield (vs 2.5% in Gurgaon), 18–35% price appreciation over 3 years, and strong demand from 5,000+ RIICO industrial units including Honda, Panasonic, Adidas and Bosch.' },
    { q: `Is ${settings.siteName} free for buyers?`, a: 'Yes. Our advisory, price comparisons, site visits and new launch information are completely free for buyers. We earn only from verified builders — never from you.' },
    { q: 'How far is Bhiwadi from Delhi and Gurgaon?', a: 'Bhiwadi is 55 km from Delhi (60–70 min via NH-48) and 35 km from Gurgaon (40 min via NH-48). The Delhi-Jaipur National Highway provides excellent direct connectivity.' },
    { q: 'Can I get PMAY subsidy for property in Bhiwadi?', a: 'Yes. First-time homebuyers with income under ₹12 Lakh per year are eligible for PMAY subsidy of up to ₹2.67 Lakh on home loans in Bhiwadi. Our advisors assist with the complete PMAY application process.' },
  ];

  return (
    <>
      <FAQSchema faqs={faqsForSchema} />
      <SpeakableSchema />

      {/* Hero — 100% dynamic from DB settings */}
      <HeroSection
        siteName={settings.siteName}
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        heroTagline={settings.heroTagline}
        heroTitle={settings.heroTitle}
        heroTitleAccent={settings.heroTitleAccent}
        heroSubtitle={settings.heroSubtitle}
        heroCTAPrimary={settings.heroCTAPrimary}
        heroCTASecondary={settings.heroCTASecondary}
        heroImageUrl={settings.heroImageUrl}
        stats={settings.marketStats}
        locations={settings.locations?.map((l) => ({ name: l.name, href: l.href }))}
      />

      {/* Bhiwadi category quick links */}
      <LuxuryHighlightsStrip />

      {/* Builder logos */}
      <BuilderLogos />

      {/* Featured Projects — SSR data passed as props so Googlebot sees full content */}
      <FeaturedProjects phone={settings.phone} initialProjects={featuredProjects} />

      {/* Location grid */}
      <LocationsSection />

      {/* Market Stats */}
      <MarketStatsSection />

      {/* Market Intelligence — corridor data table + editorial insight for Google authority */}
      <MarketIntelligenceSection />
      <DynamicCorridorsSection />

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
                See How Your Money Grows in Bhiwadi
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Bhiwadi real estate has delivered 18–35% appreciation over 3 years across key corridors.
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
                Our advisor will share the top 3 verified Bhiwadi projects matching your budget, location and goals — within 2 hours.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQSection />

      {/* Latest Investment Guides — direct blog post links for Google crawlability */}
      <LatestGuidesSection />

      {/* Bhiwadi Real Estate Area Guide — rich editorial content for Google */}
      <BhiwadiRealEstateGuide />

      {/* Internal Links */}
      <InternalLinksBlock currentPage="/" />
    </>
  );
}
