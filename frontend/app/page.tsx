import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import LeadForm from '@/components/home/LeadForm';
import { LocationsSection, WhyChooseUs, BuilderLogos, TestimonialsSection, MarketStatsSection, FAQSection, InternalLinksBlock, LuxuryHighlightsStrip, GurgaonRealEstateGuide } from '@/components/home/HomeSections';
import { ROICalculator } from '@/components/conversion/PsychTriggers';
import { FAQSchema, SpeakableSchema } from '@/components/seo/SchemaMarkup';
import { fetchSettings } from '@/lib/settings';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const settings = await fetchSettings();

  const title = settings.seoTitle || `Luxury Apartments & New Projects in Gurgaon 2025 | ₹2 Cr–₹15 Cr | ${settings.siteName}`;
  const description = settings.seoDescription || `${settings.siteName} — Gurgaon's top luxury real estate advisory. Verified 3 BHK, 4 BHK & penthouse projects from ₹2 Cr–₹15 Cr on Dwarka Expressway, Golf Course Road, SPR Road. Free site visit. Zero brokerage.`;
  const ogImage = settings.ogImage?.startsWith('http') ? settings.ogImage : `${siteUrl}${settings.ogImage || '/og-home.jpg'}`;

  return {
    title,
    description,
    keywords: settings.seoKeywords?.length ? settings.seoKeywords : ['new projects in gurgaon', 'new launch projects gurgaon 2025', 'property in gurgaon', 'luxury apartments gurgaon', 'dwarka expressway projects', 'residential property gurgaon'],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.siteName,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `New Projects in Gurgaon — ${settings.siteName}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: { canonical: siteUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  };
}

export default async function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsingurgaon.com';
  const settings = await fetchSettings();

  const faqsForSchema = settings.faqs?.length ? settings.faqs : [
    { q: 'What are luxury apartments available in Gurgaon above 5 crore?', a: 'Gurgaon has premium luxury apartments from ₹5 Cr–₹25 Cr+ across Golf Course Road, Dwarka Expressway and SPR Road by DLF, Sobha, M3M, Emaar and Oberoi. These offer 4–5 BHK configurations, private pools, smart-home technology and ultra-luxury amenities.' },
    { q: 'Which is the best area to buy luxury property in Gurgaon in 2025?', a: 'Golf Course Road (Sectors 54–57) is the most prestigious luxury address. Dwarka Expressway (Sectors 99–115) offers the highest ROI with airport proximity. Both corridors have 25–45% appreciation in 3 years.' },
    { q: `Is ${settings.siteName} free for high-ticket buyers?`, a: 'Yes. Our advisory, price comparisons, site visits and exclusive pre-launch allocations are completely free for buyers. We earn only from verified builders — never from you.' },
    { q: 'How do I get the best price on a 5 Crore+ property in Gurgaon?', a: 'Contact us before a project officially launches — we get exclusive pre-launch pricing 10–20% below market. We also negotiate PLC waivers, free parking and priority floor selection for our buyers.' },
    { q: 'What is the expected appreciation on luxury property in Gurgaon?', a: 'Luxury projects on Golf Course Road and Dwarka Expressway have shown 30–45% appreciation in 3 years (2021–2024). Rental yields are 3–4.5% for luxury furnished apartments.' },
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

      {/* Luxury category quick links */}
      <LuxuryHighlightsStrip />

      {/* Builder logos */}
      <BuilderLogos />

      {/* Featured Projects */}
      <FeaturedProjects phone={settings.phone} />

      {/* Location grid */}
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

      {/* FAQs */}
      <FAQSection />

      {/* Gurgaon Real Estate Area Guide — rich editorial content for Google */}
      <GurgaonRealEstateGuide />

      {/* Internal Links */}
      <InternalLinksBlock currentPage="/" />
    </>
  );
}
