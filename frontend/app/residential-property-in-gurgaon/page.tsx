import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import LeadCTA from '@/components/lead/LeadCTA';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Residential Property in Gurgaon 2025 | 2/3 BHK Apartments, Luxury Homes',
  description:
    'Find the best residential property in Gurgaon — 2 BHK from ₹45 Lakh, 3 BHK from ₹95 Lakh, luxury from ₹3 Cr. Verified RERA projects. Apartments, floors, villas. Free advisory.',
  keywords: 'residential property gurgaon, property in gurgaon, apartments in gurgaon, 2 bhk homes in gurgaon, luxury homes gurgaon, flats in gurgaon, buy property in gurgaon, gurgaon real estate 2025',
  openGraph: { title: 'Residential Property in Gurgaon 2025', description: '2 BHK from ₹45 Lakh to luxury from ₹3 Cr — verified residential property in Gurgaon.', url: '/residential-property-in-gurgaon', type: 'website' },
  alternates: { canonical: '/residential-property-in-gurgaon' },
  robots: { index: true, follow: true },
};

const neighborhoodSchema = {
  '@context': 'https://schema.org',
  '@type': 'Neighborhood',
  name: 'Gurgaon Residential Areas',
  description: 'Gurgaon is Haryana\'s premier residential destination with a wide range of properties — from 2 BHK apartments from ₹45 Lakh to ultra-luxury villas above ₹20 Cr. Home to top builders like DLF, M3M, Godrej, Sobha and Emaar.',
  geo: { '@type': 'GeoCoordinates', latitude: 28.4595, longitude: 77.0266 },
  containedInPlace: {
    '@type': 'City',
    name: 'Gurgaon',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Haryana',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
  },
  containsPlace: [
    { '@type': 'Place', name: 'Dwarka Expressway' },
    { '@type': 'Place', name: 'Golf Course Road' },
    { '@type': 'Place', name: 'Golf Course Extension Road' },
    { '@type': 'Place', name: 'Sohna Road' },
    { '@type': 'Place', name: 'New Gurgaon' },
    { '@type': 'Place', name: 'SPR Road' },
  ],
};

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
};

export default function ResidentialPropertyPage() {
  const propertyTypes = [
    { icon: '🏢', name: 'Apartments & Flats', desc: 'High-rise and mid-rise apartments in gated communities with clubhouse, gym and 24/7 security.', budget: '₹50 Lakh – ₹5 Cr' },
    { icon: '🏠', name: 'Independent Floors', desc: 'Builder floors and independent floors with privacy and lower maintenance. Popular in South Gurgaon.', budget: '₹40 Lakh – ₹2.5 Cr' },
    { icon: '🏡', name: 'Villas & Villaments', desc: 'Luxury villas and row houses with private garden, terrace and premium finishes in plotted colonies.', budget: '₹2 Cr – ₹20 Cr+' },
    { icon: '🌆', name: 'Luxury Residences', desc: 'Ultra-premium high-rises and signature towers on Golf Course Road, DLF 5 and Sohna Road.', budget: '₹3 Cr – ₹15 Cr+' },
  ];

  const lifestyle = [
    { icon: '🎓', category: 'Schools', items: ['DPS Gurgaon', 'GD Goenka', 'The Shri Ram School', 'Pathways World School'] },
    { icon: '🏥', category: 'Hospitals', items: ['Medanta Medicity', 'Fortis Memorial', 'Artemis Hospital', 'Max Hospital'] },
    { icon: '💼', category: 'Business Hubs', items: ['Cyber City', 'Golf Course Road', 'Sohna Road', 'IMT Manesar'] },
    { icon: '🛍️', category: 'Retail & Leisure', items: ['Ambience Mall', 'DLF Mega Mall', 'MGF Metropolis', 'Ardee Mall'] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Residential Property in Gurgaon</span>
        </div>
      </nav>

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🏡 Residential Properties
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Residential Property in Gurgaon
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Discover the finest residential properties in Gurgaon — from premium apartments and independent
              floors to luxury villas and ultra-premium high-rises. Gurgaon offers unmatched lifestyle infrastructure
              for families seeking their dream home.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#types" className="btn-primary">Explore Property Types</a>
              <LeadCTA ctaType="site_visit_request" className="btn-white">Find Best Residential Property</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-14 bg-white" id="types">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Types of Residential Property in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">From affordable apartments to ultra-luxury villas — choose what suits your lifestyle and budget.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {propertyTypes.map((type) => (
              <div key={type.name} className="bg-brand-mint/30 rounded-2xl p-6 border border-brand-border/40 hover:shadow-card transition-all">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="font-display font-semibold text-brand-text mb-2">{type.name}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-3">{type.desc}</p>
                <span className="text-brand-dark font-semibold text-sm">{type.budget}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle & Infrastructure */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Lifestyle Infrastructure in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">
            Gurgaon is India's premier corporate and lifestyle city, offering world-class amenities for residents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifestyle.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl p-5 border border-brand-border/40">
                <div className="text-2xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-brand-text mb-3">{cat.category}</h3>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="text-brand-muted text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connectivity */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">
            Why Gurgaon is Perfect for Residential Living
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-semibold text-brand-text mb-4">Connectivity</h3>
              <ul className="space-y-2 text-brand-muted text-sm">
                {[
                  'NH-48 (Delhi–Jaipur Highway) runs through the city',
                  'IGI Airport — 20 minutes from most sectors',
                  'Delhi Metro Yellow Line connects to central Delhi',
                  'Rapid Metro within Gurgaon for last-mile connectivity',
                  'Dwarka Expressway links to west Delhi seamlessly',
                  'Proposed metro extensions to all major sectors',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-brand-text mb-4">Family Lifestyle</h3>
              <ul className="space-y-2 text-brand-muted text-sm">
                {[
                  '250+ international and premium schools',
                  'Super-specialty hospitals within 5 km in most areas',
                  'Gated communities with 24/7 security and CCTV',
                  'Clubhouses, pools and sports facilities in every project',
                  '50+ malls and retail centers across the city',
                  'Parks, green belts and cycling tracks in premium sectors',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Guides */}
      <section className="py-12 bg-white border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-xs font-semibold uppercase tracking-widest mb-6 text-center">Expert Guides for Property Buyers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/blog/best-sectors-to-invest-in-gurgaon', label: 'Best Sectors to Invest in Gurgaon 2025', icon: '📊' },
              { href: '/blog/dwarka-expressway-investment-guide', label: 'Dwarka Expressway Investment Guide', icon: '✈️' },
              { href: '/blog/best-builders-in-gurgaon', label: 'Best Builders in Gurgaon — Ranked', icon: '🏗️' },
              { href: '/blog/how-to-check-rera-before-buying-property', label: 'How to Check RERA Before Buying', icon: '✅' },
              { href: '/blog/new-launch-vs-ready-to-move-property', label: 'New Launch vs Ready to Move', icon: '🔑' },
              { href: '/blog', label: 'All Real Estate Guides & Market Updates', icon: '📚' },
            ].map((g) => (
              <Link key={g.href} href={g.href}
                className="flex items-center gap-3 bg-brand-mint/30 border border-brand-border/50 px-4 py-3 rounded-xl text-brand-muted text-sm hover:text-brand-dark hover:border-brand-accent/40 hover:bg-brand-mint/60 transition-all duration-200">
                <span className="text-xl flex-shrink-0">{g.icon}</span>
                <span className="font-medium leading-snug">{g.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location Links */}
      <section className="py-10 bg-brand-mint/30 border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm mb-4 text-center">Explore by Location</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
              { label: 'Sector 113', href: '/sector-113-gurgaon-property' },
              { label: 'Sector 106', href: '/sector-106-gurgaon-property' },
              { label: 'Golf Course Ext Road', href: '/golf-course-extension-road-projects' },
              { label: 'New Gurgaon', href: '/new-gurgaon-projects' },
              { label: 'SPR Road Projects', href: '/spr-road-projects' },
              { label: 'Golf Course Road', href: '/golf-course-road-projects' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-white border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section + JSON-LD */}
      {(() => {
        const faqs = [
          { q: 'What types of residential property are available in Gurgaon?', a: 'Gurgaon offers apartments/flats (₹45 Lakh–₹5 Cr), independent floors (₹40 Lakh–₹2.5 Cr), luxury residences (₹3 Cr–₹15 Cr+) and luxury villas (₹5 Cr–₹25 Cr+). The most popular segment is 2 & 3 BHK apartments in gated communities with clubhouse amenities.' },
          { q: 'What is the price of a 2 BHK flat in Gurgaon in 2025?', a: 'A 2 BHK flat in Gurgaon ranges from ₹45 Lakh (Sector 37D, DDJAY affordable scheme) to ₹3.5 Cr+ (Golf Course Road luxury). The most popular mid-segment 2 BHK on Dwarka Expressway costs ₹80 Lakh–₹1.5 Cr. Golf Course Extension Road 2 BHK starts from ₹1.5 Cr.' },
          { q: 'What is the price of a 3 BHK flat in Gurgaon?', a: 'A 3 BHK flat in Gurgaon ranges from ₹90 Lakh (New Gurgaon, affordable segment) to ₹8 Cr+ (Golf Course Road luxury). The most sought-after range is ₹1.5 Cr–₹3 Cr for a quality 3 BHK on Dwarka Expressway or Golf Course Extension Road with full amenities.' },
          { q: 'Which area is best for buying residential property in Gurgaon?', a: 'Dwarka Expressway (Sectors 99–115) is best for investment ROI with 35–45% appreciation. Golf Course Extension Road is best for premium lifestyle (Sectors 57–75). New Gurgaon is best for affordable first homes. Golf Course Road/Sector 54 is best for ultra-luxury and established addresses.' },
          { q: 'Can I buy property in Gurgaon without paying brokerage?', a: 'Yes. New Projects in Gurgaon offers completely free advisory — no consultation fee, no brokerage, no hidden charges for buyers. We earn referral fees directly from verified builders, ensuring our advice is always in your interest.' },
          { q: 'What is the expected rental yield on residential property in Gurgaon?', a: 'Rental yields in Gurgaon range from 3–5.5% annually. New Gurgaon and Sector 37D offer the highest yields (4.5–5.5%) due to industrial demand. Premium sectors on Dwarka Expressway yield 3–4%. Golf Course Road ultra-luxury yields 2–3% but with stronger capital appreciation.' },
        ];
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
            <section className="py-14 bg-brand-mint/20">
              <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">FAQs — Residential Property in Gurgaon</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none">
                        {faq.q}
                        <span className="text-brand-accent text-lg ml-4 flex-shrink-0">+</span>
                      </summary>
                      <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      })()}

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Find the Best Residential Property in Gurgaon</h2>
          <p className="text-white/70 mb-8">Get personalised recommendations based on your budget, lifestyle and preferred location.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
