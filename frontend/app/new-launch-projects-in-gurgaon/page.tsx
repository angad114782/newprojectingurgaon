import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import { fetchApiProjects } from '@/lib/api-projects';
import { ALL_PROJECTS } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'New Launch Projects in Gurgaon 2025 | DLF, M3M, Oberoi, Krisumi',
  description:
    'Latest new launch projects in Gurgaon 2025 — DLF Privana South, M3M Antalya Hills, Oberoi Sky Heights, Krisumi Waterside. Best pre-launch pricing. RERA approved. Free advisory.',
  keywords: 'new launch projects gurgaon 2025, new launch property gurgaon, pre-launch gurgaon, new residential projects gurgaon 2025, DLF new launch, M3M new launch, Oberoi new launch gurgaon, best new launch gurgaon',
  openGraph: {
    title: 'New Launch Projects in Gurgaon 2025 | DLF, M3M, Oberoi, Krisumi',
    description: 'DLF Privana, M3M Antalya Hills, Oberoi Sky Heights — best new launch pricing in Gurgaon 2025.',
    url: 'https://www.gurgaonrealty.in/new-launch-projects-in-gurgaon',
    type: 'website',
  },
  alternates: { canonical: 'https://www.gurgaonrealty.in/new-launch-projects-in-gurgaon' },
  robots: { index: true, follow: true },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why should I buy a new launch project in Gurgaon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New launch projects offer the best entry-level pricing, flexible payment plans and highest appreciation potential before the project nears completion.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between new launch and pre-launch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pre-launch is before RERA registration and public announcement. New launch is the official first sale phase after RERA approval. Pre-launch carries higher risk but can have better pricing.',
      },
    },
  ],
};


const checklist = [
  'Verify RERA registration at haryanarera.gov.in',
  'Check builder track record and delivery history',
  'Confirm possession timeline and penalty clauses',
  'Review payment plan – construction-linked is safer',
  'Assess location connectivity and future infrastructure',
  'Compare price per sq ft with nearby ready projects',
  'Check for hidden charges – PLC, EDC, IDC, parking',
  'Get loan pre-approval before committing',
];

export default async function NewLaunchPage() {
  const apiProjects = await fetchApiProjects({ status: 'New Launch', limit: 12 });
  const newLaunchProjects = apiProjects.length > 0
    ? apiProjects.map((p) => ({
        name: p.name,
        location: p.location || p.sector || 'Gurgaon',
        price: p.priceDisplay || p.price || 'Price on Request',
        config: (p.configurations || []).slice(0, 3).map((c: string) => c.split('(')[0].trim()).join(', ') || '—',
        status: p.status,
        slug: p.slug,
      }))
    : (ALL_PROJECTS as any[]).filter((p) => p.status === 'New Launch').map((p) => ({
        name: p.name, location: p.location, price: p.price, config: p.configurations.slice(0, 3).map((c: string) => c.split('(')[0].trim()).join(', '), status: p.status, slug: p.slug,
      }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">New Launch Projects in Gurgaon</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🚀 New Launch 2025
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              New Launch Projects in Gurgaon
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Discover the latest new launch property in Gurgaon with pre-launch pricing, construction-linked
              payment plans and strong appreciation potential. Compare new launches across Dwarka Expressway,
              SPR Road, Golf Course Extension Road and New Gurgaon sectors.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View New Launch Projects</a>
              <a href="#lead-form" className="btn-white">Get Latest Price List</a>
            </div>
          </div>
        </div>
      </section>

      {/* What are new launch projects */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-text mb-4">
                What Are New Launch Projects in Gurgaon?
              </h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                New launch projects in Gurgaon are freshly announced residential developments that have received
                RERA approval and opened for public bookings for the first time. These are distinct from pre-launch
                (before RERA) and differ significantly from ready-to-move projects.
              </p>
              <p className="text-brand-muted leading-relaxed mb-4">
                Buying at the new launch stage gives you access to the developer's introductory pricing — typically
                10–25% lower than the same project's pricing 12–18 months later. As construction progresses and demand
                builds, prices appreciate. This is why seasoned investors often prefer the new launch window.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Gurgaon's new launch market in 2025 is active across Dwarka Expressway, Sector 37D, Sector 113,
                and Golf Course Extension Road — driven by strong end-user and NRI demand, infrastructure expansion
                and proximity to Cyber City and the IGI Airport.
              </p>
            </div>
            <div className="bg-brand-mint/40 rounded-2xl p-6 border border-brand-border/40">
              <h3 className="font-display font-bold text-brand-text text-lg mb-4">
                Why New Launch Pricing Can Be Attractive
              </h3>
              <ul className="space-y-3">
                {[
                  '10–25% lower entry price vs ongoing or ready projects',
                  'Construction-linked payment plans ease cash flow',
                  'First-mover advantage on premium floors and views',
                  'Highest ROI potential over a 3–5 year horizon',
                  'Easy resale at appreciation before possession',
                  'More configuration and floor choice availability',
                  'Developer introductory offers and assured gifts',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-brand-muted text-sm">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best locations */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Best Locations for New Launch Projects in Gurgaon
          </h2>
          <p className="text-brand-muted text-center max-w-2xl mx-auto mb-10">
            These micro-markets are seeing the highest new launch activity in 2025 with strong appreciation fundamentals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { location: 'Dwarka Expressway', sectors: 'Sector 99–115', why: 'Airport proximity, NH-48 access, fastest growing corridor', href: '/dwarka-expressway-projects' },
              { location: 'Sector 37D', sectors: 'New Gurgaon', why: 'Affordable new launches, excellent metro connectivity, Signature Global belt', href: '/sector-37d-gurgaon-property' },
              { location: 'Golf Course Ext Road', sectors: 'Sector 57–75', why: 'Premium residential belt, Vatika Chowk to SPR, Emaar and M3M projects', href: '/golf-course-extension-road-projects' },
              { location: 'SPR Road', sectors: 'Sector 65–85', why: 'Rapid infrastructure, proximity to Golf Course Road, luxury segment growth', href: '/spr-road-projects' },
              { location: 'Sector 113', sectors: 'Dwarka Expressway', why: 'Border of Delhi, Metro Phase II, airport in 15 minutes', href: '/sector-113-gurgaon-property' },
              { location: 'New Gurgaon', sectors: 'Sector 81–95', why: 'Budget-friendly, IMT Manesar access, Hero Honda Chowk corridor', href: '/new-gurgaon-projects' },
            ].map((loc) => (
              <Link
                key={loc.location}
                href={loc.href}
                className="bg-white rounded-2xl p-6 border border-brand-border/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="font-display font-semibold text-brand-dark text-base mb-1">{loc.location}</h3>
                <p className="text-brand-accent text-xs font-medium mb-2">{loc.sectors}</p>
                <p className="text-brand-muted text-sm leading-relaxed">{loc.why}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Project listings */}
      <section className="py-14 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Latest New Launch Projects in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">Verified, RERA-approved new launches with current pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {newLaunchProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/project/${p.slug}`}
                className="card group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-brand-dark to-brand-primary flex items-center justify-center rounded-t-2xl">
                  <span className="text-white/40 text-4xl">🏢</span>
                </div>
                <div className="p-5">
                  <span className="badge bg-green-50 text-green-700 border border-green-200 text-xs mb-2">
                    {p.status}
                  </span>
                  <h3 className="font-display font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-dark">
                    {p.name}
                  </h3>
                  <p className="text-brand-muted text-xs mb-2">📍 {p.location}</p>
                  <p className="text-brand-dark font-bold text-sm mb-1">{p.price}</p>
                  <p className="text-brand-muted text-xs">{p.config}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/new-projects-in-gurgaon" className="btn-outline">
              View All New Projects in Gurgaon →
            </Link>
          </div>
        </div>
      </section>

      {/* Buyer Checklist */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            New Launch Buyer Checklist
          </h2>
          <p className="text-brand-muted text-center mb-8">
            Before booking a new launch project in Gurgaon, verify these critical points.
          </p>
          <div className="bg-white rounded-2xl border border-brand-border/40 p-6 space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-mint border border-brand-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-brand-dark font-bold text-xs">{i + 1}</span>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">
            Frequently Asked Questions — New Launch Projects Gurgaon
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Why should I buy a new launch project in Gurgaon?', a: 'New launch projects offer the best entry-level pricing, flexible payment plans and highest appreciation potential before the project nears completion. Gurgaon has shown consistent 15–25% appreciation in key corridors over 3–5 years.' },
              { q: 'What is the difference between new launch and pre-launch?', a: 'Pre-launch is before RERA registration and public announcement. New launch is the official first sale phase after RERA approval. Pre-launch carries higher risk but can have better pricing. We only list RERA-approved new launches.' },
              { q: 'What payment plans are available for new launches?', a: 'Most new launches in Gurgaon offer construction-linked plans (CLP), down payment plans with discounts, and subvention schemes (builder-funded EMI till possession). CLP is safest for buyers as payments are tied to construction milestones.' },
              { q: 'How do I find the best new launch deal in Gurgaon?', a: 'Compare the price per sq ft with nearby ready projects, check the builder\'s past delivery record, review payment plan flexibility, and assess the location\'s growth potential. Our advisors can do this comparison for you at zero cost.' },
            ].map((faq, i) => (
              <details key={i} className="bg-brand-mint/20 rounded-2xl border border-brand-border/50 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none">
                  {faq.q}
                  <span className="text-brand-accent text-lg ml-4 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-10 bg-brand-mint/30 border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm font-medium mb-4 text-center">Explore More</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
              { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
              { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
              { label: 'Sector 113 Property', href: '/sector-113-gurgaon-property' },
              { label: 'Golf Course Ext Road', href: '/golf-course-extension-road-projects' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-white border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark hover:border-brand-accent/40 transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get Latest New Launch Price List</h2>
          <p className="text-white/70 mb-8">Tell us your requirement and we'll share the best new launch options with price details on WhatsApp.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
