'use client';
import Link from 'next/link';
import Image from 'next/image';
import LeadForm from '@/components/home/LeadForm';
import LeadCTA from '@/components/lead/LeadCTA';
import { GEOContentHints } from '@/components/seo/SchemaMarkup';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';

const statusColors: Record<string, string> = {
  'New Launch': 'bg-green-50 text-green-700 border-green-200',
  'Pre Launch': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
  'Ready To Move': 'bg-purple-50 text-purple-700 border-purple-200',
};

// Known corridor coordinates for NeighborhoodSchema
const GEO_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'NH-48 Corridor'              : { latitude: 28.2055, longitude: 76.8480 },
  'Bhiwadi Extension'           : { latitude: 28.2200, longitude: 76.8600 },
  'Chopanki'                    : { latitude: 28.1850, longitude: 76.8350 },
  'Khushkhera'                  : { latitude: 28.1700, longitude: 76.8200 },
  'Tapukara'                    : { latitude: 28.1600, longitude: 76.8100 },
  'Bhiwadi Phase 3'             : { latitude: 28.2100, longitude: 76.8550 },
  'RIICO Industrial Area'       : { latitude: 28.2050, longitude: 76.8450 },
  'Bhiwadi'                     : { latitude: 28.2055, longitude: 76.8480 },
};

function resolveGeo(title: string) {
  const match = Object.keys(GEO_COORDS).find((k) => title.toLowerCase().includes(k.toLowerCase()));
  return match ? GEO_COORDS[match] : { latitude: 28.2055, longitude: 76.8480 };
}

interface LocationPageProps {
  title: string;
  metaTitle: string;
  heroSubtitle: string;
  overview: string;
  whyInvest: string[];
  connectivity: string[];
  landmarks: string[];
  bestFor: 'Investor' | 'End User' | 'Both';
  projects: Array<{ name: string; price: string; config: string; status: string; builder: string; slug: string; heroImage?: string; location?: string; isVerified?: boolean; isNew?: boolean }>;
  faqs: Array<{ q: string; a: string }>;
  relatedLinks: Array<{ label: string; href: string }>;
  investmentHighlights: Array<{ label: string; value: string }>;
  badge: string;
}

export default function LocationPageTemplate({
  title, heroSubtitle, overview, whyInvest, connectivity, landmarks,
  bestFor, projects, faqs, relatedLinks, investmentHighlights, badge,
}: LocationPageProps) {
  const bestForColor = bestFor === 'Investor' ? 'bg-blue-50 text-blue-700' : bestFor === 'End User' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700';

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://newprojectsinbhiwadi.com' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://newprojectsinbhiwadi.com/new-projects-in-bhiwadi' },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  const geo = resolveGeo(title);
  const neighborhoodSchema = {
    '@context': 'https://schema.org',
    '@type': 'Neighborhood',
    name: title,
    description: heroSubtitle,
    geo: { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude },
    containedInPlace: {
      '@type': 'City',
      name: 'Bhiwadi',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Rajasthan',
        containedInPlace: { '@type': 'Country', name: 'India' },
      },
    },
    ...(landmarks.length > 0 && {
      containsPlace: landmarks.map((l) => ({ '@type': 'Place', name: l })),
    }),
  };

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
  };

  // Extract price range and builder names from investmentHighlights + projects
  const priceHighlight = investmentHighlights.find((h) => /price|range|sqft|₹/i.test(h.label));
  const priceRange = priceHighlight ? priceHighlight.value : '';
  const builderNames = Array.from(new Set(projects.map((p) => p.builder).filter(Boolean)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <GEOContentHints location={title} priceRange={priceRange} builders={builderNames} />
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/new-projects-in-bhiwadi" className="hover:text-brand-dark">Projects</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">{title}</span>
        </div>
      </nav>

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">{title}</h1>
            <p className="text-white/80 text-lg mb-8">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View Projects Here</a>
              <LeadCTA ctaType="site_visit_request" className="btn-white">Get Free Advisory</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + Highlights */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-display font-bold text-brand-text mb-4">Location Overview</h2>
              <p className="text-brand-muted leading-relaxed mb-6">{overview}</p>
              <h3 className="font-display font-semibold text-brand-text mb-3">Why Invest Here</h3>
              <ul className="space-y-2">
                {whyInvest.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-brand-muted text-sm">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-brand-mint/30 rounded-2xl p-5 border border-brand-border/40">
                <h3 className="font-semibold text-brand-text mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {investmentHighlights.map((h) => (
                    <div key={h.label} className="text-center">
                      <div className="text-xl font-bold text-brand-dark">{h.value}</div>
                      <div className="text-brand-muted text-xs mt-0.5">{h.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-brand-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-brand-muted font-medium">Best Suitable For</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${bestForColor}`}>
                  {bestFor === 'Both' ? '🏠 Investor & End User' : bestFor === 'Investor' ? '📈 Investor' : '🏡 End User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity & Landmarks */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-display font-bold text-brand-text mb-4">Connectivity</h2>
              <ul className="space-y-2">
                {connectivity.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-brand-muted text-sm">
                    <span className="text-brand-accent font-bold mt-0.5">→</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-brand-text mb-4">Nearby Landmarks</h2>
              <ul className="space-y-2">
                {landmarks.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-brand-muted text-sm">
                    <span className="text-brand-accent font-bold mt-0.5">📍</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-14 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8">Projects in {title.replace(' Property', '').replace(' Projects', '')}</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <Link key={p.slug} href={`/project/${p.slug}`} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 rounded-t-2xl overflow-hidden">
                    <Image
                      src={p.heroImage || DEFAULT_IMG}
                      alt={`${p.name} — ${p.location || 'Bhiwadi'}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`badge border text-xs ${statusColors[p.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>{p.status}</span>
                      {p.isNew && <span className="badge bg-red-500 text-white border-0 text-xs">NEW</span>}
                    </div>
                    {p.isVerified !== false && (
                      <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2 py-1 flex items-center gap-1 text-xs text-green-700 font-semibold shadow">
                        ✓ RERA
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white font-display font-bold">{p.price}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-brand-muted text-xs mb-0.5">{p.builder}</p>
                    <h3 className="font-display font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-dark">{p.name}</h3>
                    {p.location && <p className="text-brand-muted text-xs mb-2">📍 {p.location}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-brand-muted text-xs">{p.config}</span>
                      <span className="text-brand-dark text-xs font-semibold">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-brand-mint/20 rounded-2xl border border-brand-border/40">
              <p className="text-brand-muted mb-4">Contact us to get a curated list of verified projects in this area.</p>
              <LeadCTA ctaType="brochure" className="btn-primary">Get Project List</LeadCTA>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-14 bg-brand-mint/20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">Frequently Asked Questions</h2>
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
      )}

      {/* Blog Guides — cross-links to help Google crawl & index blog posts */}
      <section className="py-12 bg-white border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-xs font-semibold uppercase tracking-widest mb-6 text-center">Expert Guides for Property Buyers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/blog/best-areas-to-invest-in-bhiwadi', label: 'Best Areas to Invest in Bhiwadi 2025', icon: '📊' },
              { href: '/blog/nh-48-bhiwadi-investment-guide', label: 'NH-48 Bhiwadi Investment Guide', icon: '✈️' },
              { href: '/blog/best-builders-in-bhiwadi', label: 'Best Builders in Bhiwadi — Ranked', icon: '🏗️' },
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

      {/* Internal Links */}
      <section className="py-10 bg-white border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm mb-4 text-center">Explore Related</p>
          <div className="flex flex-wrap justify-center gap-3">
            {relatedLinks.map((l) => (
              <Link key={l.href} href={l.href} className="bg-brand-mint border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get Best Properties in {title.replace(' Property', '').replace(' Projects', '')}</h2>
          <p className="text-white/70 mb-8">Our advisor will match you with verified projects in this area based on your budget and timeline.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
