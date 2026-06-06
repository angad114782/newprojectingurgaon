import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import LeadForm from '@/components/home/LeadForm';
import { fetchProjectsWithFallback } from '@/lib/api-projects';
import { InternalLinksBlock } from '@/components/home/HomeSections';
import LeadCTA from '@/components/lead/LeadCTA';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';

export const metadata: Metadata = {
  title: 'Dwarka Expressway Projects 2025 | New Launch & Premium Property on NH-248BB',
  description: 'Explore the best projects on Dwarka Expressway — new launch, under construction & ready to move near IGI Airport. DLF, M3M, Godrej, Krisumi, Sobha projects from ₹45 Lakh to ₹5 Cr. Free site visit.',
  keywords: 'dwarka expressway projects, property on dwarka expressway, sector 113 gurgaon, sector 106 gurgaon, new projects dwarka expressway 2025, 2 bhk dwarka expressway, flats on dwarka expressway gurgaon',
  openGraph: { title: 'Dwarka Expressway Projects 2025 | Property on NH-248BB', description: 'Best new projects on Dwarka Expressway Gurgaon — DLF, M3M, Godrej, Krisumi from ₹45 Lakh. Free site visit.', url: '/dwarka-expressway-projects', type: 'website' },
  alternates: { canonical: '/dwarka-expressway-projects' },
  robots: { index: true, follow: true },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is Dwarka Expressway a good investment in 2025?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Dwarka Expressway has seen 30–45% price appreciation in the past 3 years. With Metro Phase II, airport expansion and continued corporate demand, the corridor is expected to remain one of Gurgaon\'s top investment zones through 2025–28.' } },
    { '@type': 'Question', name: 'Which sectors are best on Dwarka Expressway?', acceptedAnswer: { '@type': 'Answer', text: 'Sector 113 (nearest IGI Airport), Sector 106, 108 (premium belt) and Sector 102 (budget-friendly) are the top picks. Sector 37D is best for affordable housing under ₹90 Lakh.' } },
    { '@type': 'Question', name: 'What is the price range for property on Dwarka Expressway?', acceptedAnswer: { '@type': 'Answer', text: '2 BHK homes on Dwarka Expressway start from ₹45 Lakh (Sector 37D DDJAY) to ₹3 Cr+ (luxury in Sector 113). Average is ₹80L–₹1.5 Cr for mid-segment.' } },
    { '@type': 'Question', name: 'Which builders have projects on Dwarka Expressway?', acceptedAnswer: { '@type': 'Answer', text: 'Top builders on Dwarka Expressway include DLF, M3M, Godrej Properties, Krisumi Corporation, Sobha Limited, Hero Homes, Signature Global and BPTP.' } },
  ],
};

const sectors = [
  { name: 'Sector 113', dist: '2 km from Delhi border', why: 'Closest to IGI Airport, Metro Phase II, M3M Capital Walk, premium zone', href: '/sector-113-gurgaon-property' },
  { name: 'Sector 106', dist: '5 km from NH-48', why: 'Premium belt — Godrej Meridien, Sobha Altus, best builder concentration', href: '/sector-106-gurgaon-property' },
  { name: 'Sector 108', dist: '4 km from NH-48', why: 'Sobha City 40-acre township, near possession, high occupancy', href: '/new-projects-in-gurgaon' },
  { name: 'Sector 102', dist: '6 km from NH-48', why: 'Budget-friendly, Palam Vihar extension, high rental demand', href: '/sector-102-gurgaon-property' },
  { name: 'Sector 37D', dist: 'Metro Sec 37 — 3 km', why: 'Most affordable — DDJAY homes from ₹45 Lakh, best for first-time buyers', href: '/sector-37d-gurgaon-property' },
  { name: 'Sector 111', dist: '3 km from Delhi border', why: 'M3M Crown, near Delhi border, high appreciation zone', href: '/new-projects-in-gurgaon' },
];

const statusColors: Record<string, string> = {
  'New Launch': 'bg-green-50 text-green-700 border-green-200',
  'Pre Launch': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
  'Ready To Move': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default async function DwarkaExpresswayPage() {
  const projects = await fetchProjectsWithFallback({ corridor: 'Dwarka Expressway', limit: 12 });

  const neighborhoodSchema = {
    '@context': 'https://schema.org',
    '@type': 'Neighborhood',
    name: 'Dwarka Expressway',
    description: 'Dwarka Expressway (NH-248BB) is Gurgaon\'s fastest growing residential corridor connecting Delhi to Gurgaon, with IGI Airport just 15–20 minutes away. Home to projects by DLF, M3M, Godrej, Krisumi, Sobha and Signature Global.',
    geo: { '@type': 'GeoCoordinates', latitude: 28.5923, longitude: 77.0284 },
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
      { '@type': 'Place', name: 'Sector 113' },
      { '@type': 'Place', name: 'Sector 106' },
      { '@type': 'Place', name: 'Sector 108' },
      { '@type': 'Place', name: 'Sector 102' },
      { '@type': 'Place', name: 'Sector 37D' },
      { '@type': 'Place', name: 'Sector 111' },
    ],
  };

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/new-projects-in-gurgaon" className="hover:text-brand-dark">New Projects in Gurgaon</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Dwarka Expressway Projects</span>
        </div>
      </nav>

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🛣️ NH-248BB — Gurgaon's Fastest Growing Corridor
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Dwarka Expressway Projects
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Dwarka Expressway (NH-248BB) connects Delhi to Gurgaon, with IGI Airport just 15–20 minutes away.
              Discover new launch, under construction and ready-to-move properties from DLF, M3M, Godrej,
              Krisumi and Sobha — from ₹45 Lakh to ₹5 Cr.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View Projects</a>
              <LeadCTA ctaType="site_visit_request" className="btn-white">Get Expert Advice</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Investment story */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-text mb-4">
                Why Invest in Dwarka Expressway Property?
              </h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                Dwarka Expressway transformed from an infrastructure bottleneck to Gurgaon's premier real estate
                corridor after the expressway inauguration in 2024. The 29-km elevated stretch connecting
                Sheetla Mata Mandir (Gurgaon) to Dwarka (Delhi) has unlocked massive real estate value.
              </p>
              <p className="text-brand-muted leading-relaxed mb-4">
                Property prices on Dwarka Expressway appreciated by <strong className="text-brand-text">30–45%</strong> between
                2021 and 2024. Sectors 99–115 have seen the most activity, with DLF, M3M, Godrej, Krisumi, Sobha
                and Signature Global all having active projects here.
              </p>
              <p className="text-brand-muted leading-relaxed">
                The upcoming Metro Phase II extension and expansion of IGI Airport Terminal 2 position
                Dwarka Expressway for continued growth through 2026–30.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-brand-mint/30 rounded-2xl p-5 border border-brand-border/40">
                <h3 className="font-semibold text-brand-text mb-3">Key Investment Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Appreciation (3Y)', value: '35–45%' },
                    { label: 'Rental Yield', value: '3–4.5%' },
                    { label: 'Active Projects', value: `${projects.length}+` },
                    { label: 'Top Builders', value: '8+' },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-2xl font-bold text-brand-dark">{m.value}</div>
                      <div className="text-brand-muted text-xs mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-brand-border/40">
                <h3 className="font-semibold text-brand-text mb-3">Connectivity Highlights</h3>
                <ul className="space-y-2 text-brand-muted text-sm">
                  {[
                    '🛫 IGI Airport — 15–20 min drive',
                    '🚇 Metro — Dwarka Sector 21 & proposed Phase II',
                    '🛣️ NH-48 (Delhi–Jaipur Highway) — direct access',
                    '🏙️ Cyber City, Gurgaon — 20–25 min',
                    '🏙️ Connaught Place, Delhi — 30–35 min',
                  ].map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sectors */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Best Sectors on Dwarka Expressway
          </h2>
          <p className="text-brand-muted text-center mb-10">Each sector has its own character, price point and investment potential.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((s) => (
              <Link key={s.name} href={s.href}
                className="bg-white rounded-2xl p-6 border border-brand-border/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-display font-semibold text-brand-dark mb-1">{s.name}</h3>
                <p className="text-brand-accent text-xs font-medium mb-2">📍 {s.dist}</p>
                <p className="text-brand-muted text-sm leading-relaxed">{s.why}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Project listings */}
      <section className="py-14 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Top Projects on Dwarka Expressway ({projects.length} Listed)
          </h2>
          <p className="text-brand-muted text-center mb-8">All RERA-verified, builder-certified properties on Dwarka Expressway.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link key={p.slug} href={`/project/${p.slug}`} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
                  <Image
                    src={(p as any).heroImage || DEFAULT_IMG}
                    alt={`${p.name} — Dwarka Expressway Gurgaon`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`badge border text-xs ${statusColors[p.status] || ''}`}>{p.status}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-display font-bold">{p.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-brand-muted text-xs mb-0.5">{p.builder}</p>
                  <h3 className="font-display font-semibold text-brand-text mb-1 group-hover:text-brand-dark">{p.name}</h3>
                  <p className="text-brand-muted text-sm mb-2">📍 {(p as any).location || 'Dwarka Expressway, Gurgaon'}</p>
                  <div className="flex items-center justify-between text-xs text-brand-muted">
                    <span>{p.config}</span>
                    <span className="text-brand-dark font-semibold">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/new-projects-in-gurgaon" className="btn-outline">View All Gurgaon Projects →</Link>
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="py-12 bg-brand-mint/10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-display font-bold text-brand-text mb-4">
            2 BHK Homes on Dwarka Expressway — Buying Guide
          </h2>
          <p className="text-brand-muted leading-relaxed mb-4">
            Looking for a <strong>2 BHK home on Dwarka Expressway</strong>? Options start from ₹45 Lakh
            (Sector 37D, DDJAY scheme) to ₹3.1 Cr (Sobha Altus, Sector 106). The most popular range is
            ₹80 Lakh–₹1.5 Cr in sectors 102, 106, 108, 111 and 113.
          </p>
          <p className="text-brand-muted leading-relaxed">
            For investment, <strong>Sector 113</strong> offers the highest ROI due to airport proximity.
            For affordability, <strong>Sector 37D</strong> under DDJAY is unmatched in Gurgaon.
            For near-possession, <strong>Sector 106 and 108</strong> (Godrej Meridien, Sobha City) are top picks.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">FAQs — Dwarka Expressway Projects</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <details key={i} className="bg-brand-mint/20 rounded-2xl border border-brand-border/50 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none">
                  {faq.name}
                  <span className="text-brand-accent text-lg ml-4 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">{faq.acceptedAnswer.text}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <InternalLinksBlock currentPage="/dwarka-expressway-projects" />

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get Best Projects on Dwarka Expressway</h2>
          <p className="text-white/70 mb-8">Our advisor will share the top 3 Dwarka Expressway projects matching your budget and requirements — free advisory.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
