import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import { fetchApiProjects } from '@/lib/api-projects';
import { fetchSettings } from '@/lib/settings';
import LeadCTA from '@/components/lead/LeadCTA';
import { ALL_SEO_PAGES } from '@/lib/projects';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();
  const pageUrl = `${siteUrl}/residential-property-in-bhiwadi`;
  return {
    title: `Residential Property in Bhiwadi 2025 | Flats, Plots & Houses | ${settings.siteName}`,
    description: `Residential property in Bhiwadi — 80+ verified projects on Alwar Bypass, NH-48 & RIICO. 1 BHK from ₹28L, 2 BHK from ₹35L, 3 BHK from ₹55L. RERA verified. Free site visit. Zero brokerage. ${settings.siteName}.`,
    keywords: 'residential property in bhiwadi, bhiwadi property, bhiwadi real estate, flats in bhiwadi, plots in bhiwadi, houses in bhiwadi, bhiwadi 2025 property',
    openGraph: { title: `Residential Property in Bhiwadi 2025 | ${settings.siteName}`, description: 'Verified flats, plots & houses in Bhiwadi from ₹28L. NH-48, Alwar Bypass, RIICO.', url: pageUrl, type: 'website' },
    alternates: { canonical: pageUrl },
  };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What types of residential property are available in Bhiwadi?', acceptedAnswer: { '@type': 'Answer', text: 'Bhiwadi offers 1 BHK (from ₹28L), 2 BHK (₹35L–₹70L), 3 BHK (₹55L–₹1.1 Cr), residential plots, and industrial plots. NH-48 and Alwar Bypass Road are the prime residential corridors.' } },
    { '@type': 'Question', name: 'Is Bhiwadi a good place to invest in 2025?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Bhiwadi offers 4–6% rental yield (vs 2.5% in Gurgaon), 18–35% price appreciation over 3 years, and strong industrial demand from 5,000+ RIICO units including Honda, Panasonic, and Adidas.' } },
    { '@type': 'Question', name: 'How far is Bhiwadi from Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Bhiwadi is 35 km from Gurgaon (40 min via NH-48). Delhi is 55 km away (60–70 min). Excellent connectivity via Delhi-Jaipur National Highway.' } },
  ],
};

const CORRIDORS = [
  { name: 'Alwar Bypass Road', desc: "Bhiwadi's prime residential corridor. Best for families and end-users.", projects: '20+', href: '/alwar-bypass-road-projects', badge: 'Most Popular' },
  { name: 'NH-48 Highway', desc: 'Delhi-Jaipur highway frontage. Best appreciation and rental income.', projects: '18+', href: '/nh-48-bhiwadi-projects', badge: 'Best ROI' },
  { name: 'Tapukara', desc: 'Near Honda Plant. Highest rental demand from industrial professionals.', projects: '12+', href: '/tapukara-bhiwadi-projects', badge: 'Honda Zone' },
  { name: 'Neemrana', desc: 'Japanese Industrial Zone. Expat housing demand, premium rents.', projects: '10+', href: '/neemrana-bhiwadi-projects', badge: 'Japanese Zone' },
  { name: 'Khushkhera', desc: 'RIICO belt with 1,500+ units. Highest rental yield (5.5%+).', projects: '8+', href: '/khushkhera-bhiwadi-projects', badge: 'RIICO Belt' },
  { name: 'Bhiwadi Extension', desc: 'Upcoming zone. Most affordable entry. Best for first-time buyers.', projects: '15+', href: '/bhiwadi-extension-projects', badge: 'Affordable' },
];

export default async function ResidentialPropertyBhiwadiPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const corridor = searchParams.location || searchParams.corridor || '';
  const status   = searchParams.status   || '';
  const config   = searchParams.config   || searchParams.bhk || '';
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const allProjects = await fetchApiProjects({
    corridor:  corridor  || undefined,
    status:    status    || undefined,
    config:    config    || undefined,
    maxPrice,
    limit: 50,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Residential Property in Bhiwadi</span>
        </div>
      </nav>
      <ProjectFilterBar
        basePath="/residential-property-in-bhiwadi"
        active={{ location: corridor, status, config, maxPrice: searchParams.maxPrice || '' }}
        totalCount={allProjects.length}
      />

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🏙️ Bhiwadi Real Estate 2025
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Residential Property in Bhiwadi
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Bhiwadi — Rajasthan's fastest growing industrial hub on NH-48 (Delhi-Jaipur Highway).
              80+ verified residential projects: flats, plots & townships from ₹28 Lakh.
              4–6% rental yield. RERA registered. Free advisory. Zero brokerage.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View All Properties</a>
              <LeadCTA ctaType="site_visit" className="btn-white">Book Free Site Visit</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Projects Listed', value: '80+' },
              { label: 'Entry Price', value: '₹28 L' },
              { label: 'Rental Yield', value: '4–6%' },
              { label: 'Industrial Units', value: '5,000+' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-display font-bold text-brand-dark">{s.value}</div>
                <div className="text-brand-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bhiwadi */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Why Buy Property in Bhiwadi?
          </h2>
          <p className="text-brand-muted text-center max-w-2xl mx-auto mb-10">
            Bhiwadi offers what Gurgaon used to — affordable pricing with high rental demand from a thriving industrial ecosystem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📈', title: 'High Rental Yield', desc: '4–6% rental yield vs 2.5% in Gurgaon. 90–95% occupancy year-round from industrial professionals.' },
              { icon: '🏭', title: '5,000+ Industrial Units', desc: 'Honda, Panasonic, Adidas, Bosch, Gillette — constant employee housing demand.' },
              { icon: '💰', title: 'Affordable Entry', desc: '1 BHK from ₹28L, 2 BHK from ₹35L — 50–60% cheaper than Gurgaon. PMAY subsidy eligible.' },
              { icon: '🛣️', title: 'NH-48 Connectivity', desc: 'Delhi-Jaipur Highway. 35 km to Gurgaon, 55 km to Delhi. Direct highway access.' },
              { icon: '🇯🇵', title: 'Japanese Zone Neemrana', desc: '50+ Japanese MNCs 25 km away. Expat housing demand drives premium rents.' },
              { icon: '📊', title: '18–35% Appreciation', desc: 'Strong industrial growth + infrastructure upgrades drive consistent capital appreciation.' },
            ].map((r) => (
              <div key={r.title} className="bg-white rounded-2xl p-6 border border-brand-border/40 hover:shadow-card transition-shadow">
                <span className="text-3xl mb-3 block">{r.icon}</span>
                <h3 className="font-display font-semibold text-brand-text mb-2">{r.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corridors */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Best Locations for Property in Bhiwadi
          </h2>
          <p className="text-brand-muted text-center max-w-2xl mx-auto mb-10">
            Bhiwadi's residential market spans six key corridors — each with distinct advantages for buyers and investors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORRIDORS.map((c) => (
              <Link key={c.href} href={c.href}
                className="bg-white rounded-2xl p-6 border border-brand-border/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-brand-dark text-base">{c.name}</h3>
                  <span className="bg-brand-accent/10 text-brand-accent text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{c.badge}</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed mb-3">{c.desc}</p>
                <p className="text-brand-dark font-bold text-sm">{c.projects} projects →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-14 bg-brand-mint/20" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">All Properties in Bhiwadi</h2>
          <p className="text-brand-muted text-center mb-10">Verified, RERA-registered residential projects with current pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allProjects.map((p) => (
              <Link key={p.slug} href={`/project/${p.slug}`}
                className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="h-44 bg-gradient-to-br from-brand-dark to-brand-deep flex items-center justify-center rounded-t-2xl overflow-hidden relative">
                  {p.heroImage ? (
                    <img src={p.heroImage} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/40 text-5xl">🏢</span>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-brand-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.status}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-dark">{p.name}</h3>
                  <p className="text-brand-muted text-xs mb-2">📍 {p.location}</p>
                  <p className="text-brand-dark font-bold text-sm mb-1">{p.priceDisplay || 'Price on Request'}</p>
                  <p className="text-brand-muted text-xs">{(p.configurations || []).slice(0, 2).join(' · ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO internal links */}
      <section className="py-10 bg-white border-y border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm font-medium mb-4 text-center">Explore Bhiwadi Properties By Category</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ALL_SEO_PAGES.map((l) => (
              <Link key={l.url} href={l.url} className="bg-brand-mint/40 border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark hover:border-brand-accent/40 transition-all">
                {l.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">FAQs — Property in Bhiwadi</h2>
          <div className="space-y-4">
            {[
              { q: 'What types of residential property are available in Bhiwadi?', a: 'Bhiwadi offers 1 BHK (from ₹28L), 2 BHK (₹35L–₹70L), 3 BHK (₹55L–₹1.1 Cr), residential plots and industrial plots. NH-48 and Alwar Bypass are the prime residential corridors.' },
              { q: 'Is Bhiwadi a good place to invest in 2025?', a: 'Yes. Bhiwadi offers 4–6% rental yield (vs 2.5% in Gurgaon), 18–35% price appreciation over 3 years, and strong industrial demand from 5,000+ RIICO units.' },
              { q: 'How far is Bhiwadi from Gurgaon?', a: 'Bhiwadi is 35 km from Gurgaon (40 min via NH-48). Delhi is 55 km away (60–70 min).' },
              { q: 'Can I get PMAY subsidy for property in Bhiwadi?', a: 'Yes. First-time homebuyers with income under ₹12 Lakh per year are eligible for PMAY subsidy of up to ₹2.67 Lakh on home loans in Bhiwadi.' },
            ].map((faq, i) => (
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

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Find Your Perfect Property in Bhiwadi</h2>
          <p className="text-white/70 mb-8">Share your budget and requirement — we'll send matching Bhiwadi properties on WhatsApp within 2 hours.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
