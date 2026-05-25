import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import LeadForm from '@/components/home/LeadForm';
import { fetchApiProjects } from '@/lib/api-projects';
import { ALL_PROJECTS } from '@/lib/projects';
import { InternalLinksBlock } from '@/components/home/HomeSections';

const SITE_URL = 'https://www.gurgaonrealty.in';

export const metadata: Metadata = {
  title: 'New Projects in Gurgaon 2025 | Verified Properties & New Developments',
  description:
    'Browse all new projects in Gurgaon — new launch, pre-launch, under construction and ready to move from DLF, M3M, Godrej, Krisumi, Oberoi. Compare residential, luxury and affordable properties with price details and floor plans. Free advisory.',
  keywords: 'new projects in gurgaon, new residential projects gurgaon 2025, upcoming projects gurgaon, gurgaon real estate 2025, property in gurgaon, buy property gurgaon, flats in gurgaon',
  openGraph: {
    title: 'New Projects in Gurgaon 2025 | All New Properties',
    description: 'Verified new projects in Gurgaon across all budgets, locations and configurations. Free site visit support.',
    url: `${SITE_URL}/new-projects-in-gurgaon`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: 'New Projects in Gurgaon' }],
  },
  alternates: { canonical: `${SITE_URL}/new-projects-in-gurgaon` },
  robots: { index: true, follow: true },
};

const statusColors: Record<string, string> = {
  'New Launch': 'bg-green-50 text-green-700 border-green-200',
  'Pre Launch': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
  'Ready To Move': 'bg-purple-50 text-purple-700 border-purple-200',
};

const locationComparisons = [
  { area: 'Dwarka Expressway', budget: '₹45L – ₹5 Cr', type: 'Affordable, Mid, Luxury', topFor: 'Investors & End-Users', link: '/dwarka-expressway-projects' },
  { area: 'Golf Course Ext Road', budget: '₹80L – ₹12 Cr', type: 'Premium & Ultra Luxury', topFor: 'Premium Lifestyle', link: '/golf-course-extension-road-projects' },
  { area: 'New Gurgaon', budget: '₹35L – ₹1.5 Cr', type: 'Affordable & Mid', topFor: 'First-Time Buyers', link: '/new-gurgaon-projects' },
  { area: 'SPR Road', budget: '₹90L – ₹18 Cr', type: 'Premium & Ultra Luxury', topFor: 'HNI & NRI Investors', link: '/spr-road-projects' },
];

const listingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'New Projects in Gurgaon 2025',
  description: 'RERA-verified new residential and luxury projects in Gurgaon',
  url: `${SITE_URL}/new-projects-in-gurgaon`,
};

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';

export default async function NewProjectsPage() {
  const apiProjects = await fetchApiProjects({ limit: 30 });
  const allProjects = apiProjects.length > 0
    ? apiProjects.map((p) => ({
        name: p.name,
        location: p.location || p.sector || '',
        price: p.priceDisplay || p.price || 'Price on Request',
        config: (p.configurations || []).slice(0, 3).map((c: string) => c.split('(')[0].trim()).join(', ') || '—',
        status: p.status,
        builder: typeof p.builder === 'object' ? (p.builder as any).name : p.builder || '',
        slug: p.slug,
        heroImage: p.heroImage,
        isVerified: p.isVerified !== false,
        isNew: p.isNew || p.status === 'New Launch',
        possession: p.possession,
      }))
    : (ALL_PROJECTS as any[]).map((p) => ({
        name: p.name, location: p.location, price: p.price, config: (p.configurations || []).slice(0, 3).map((c: string) => c.split('(')[0].trim()).join(', '),
        status: p.status, builder: p.builder, slug: p.slug, heroImage: p.heroImage,
        isVerified: p.isVerified, isNew: p.isNew, possession: p.possession,
      }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />

      {/* Breadcrumb */}
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">New Projects in Gurgaon</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🏙️ {allProjects.length}+ Verified Projects
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              New Projects in Gurgaon 2025
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-2xl">
              Explore all new residential, luxury and affordable projects in Gurgaon. Compare
              new launch, pre-launch, under construction and ready-to-move options from
              DLF, M3M, Godrej, Krisumi, Oberoi and 50+ verified builders — free advisory included.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">Browse All Projects</a>
              <a href="#compare" className="btn-white">Compare by Location</a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick filters */}
      <section className="bg-white border-b border-brand-border/40 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
              { label: 'Golf Course Extension', href: '/golf-course-extension-road-projects' },
              { label: 'SPR Road', href: '/spr-road-projects' },
              { label: 'New Gurgaon', href: '/new-gurgaon-projects' },
              { label: 'Sector 113', href: '/sector-113-gurgaon-property' },
              { label: 'Sector 106', href: '/sector-106-gurgaon-property' },
              { label: 'Sector 37D', href: '/sector-37d-gurgaon-property' },
              { label: 'New Launch', href: '/new-launch-projects-in-gurgaon' },
            ].map((f) => (
              <Link key={f.href} href={f.href}
                className="bg-brand-mint border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark hover:bg-brand-border transition-all">
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="py-14 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2">
            Verified New Projects in Gurgaon
          </h2>
          <p className="text-brand-muted mb-8">All RERA-approved, builder-verified properties in Gurgaon.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/project/${p.slug}`}
                className="card group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
                  <Image
                    src={p.heroImage || DEFAULT_IMG}
                    alt={`${p.name} — ${p.location}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`badge border text-xs ${statusColors[p.status] || ''}`}>{p.status}</span>
                    {p.isNew && <span className="badge bg-red-500 text-white border-0 text-xs">NEW</span>}
                  </div>
                  {p.isVerified && (
                    <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2 py-1 flex items-center gap-1 text-xs text-green-700 font-semibold shadow">
                      ✓ RERA
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-display font-bold text-lg">{p.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-brand-muted text-xs mb-0.5">{p.builder}</p>
                  <h3 className="font-display font-semibold text-brand-text mb-1 group-hover:text-brand-dark">
                    {p.name}
                  </h3>
                  <p className="text-brand-muted text-sm mb-2">📍 {p.location}</p>
                  <div className="flex items-center justify-between text-xs text-brand-muted">
                    <span>{p.config}</span>
                    {p.possession && <span>🔑 {p.possession}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location-wise comparison */}
      <section className="py-14 bg-brand-mint/20" id="compare">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            New Projects by Location in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">
            Pick the right micro-market based on your budget, buyer type and investment goals.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden border border-brand-border/40 text-sm">
              <thead>
                <tr className="bg-brand-dark text-white">
                  <th className="text-left px-5 py-4 font-semibold">Location</th>
                  <th className="text-left px-5 py-4 font-semibold">Budget Range</th>
                  <th className="text-left px-5 py-4 font-semibold">Property Type</th>
                  <th className="text-left px-5 py-4 font-semibold">Best For</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {locationComparisons.map((row, i) => (
                  <tr key={row.area} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-mint/20'}>
                    <td className="px-5 py-4 font-medium text-brand-text">{row.area}</td>
                    <td className="px-5 py-4 text-brand-muted">{row.budget}</td>
                    <td className="px-5 py-4 text-brand-muted">{row.type}</td>
                    <td className="px-5 py-4 text-brand-muted">{row.topFor}</td>
                    <td className="px-5 py-4">
                      <Link href={row.link} className="text-brand-dark font-semibold hover:text-brand-accent text-xs">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-4">
            Property in Gurgaon — Complete 2025 Buyer's Guide
          </h2>
          <div className="prose prose-sm text-brand-muted max-w-none space-y-4">
            <p>
              <strong className="text-brand-text">Gurgaon</strong> (officially Gurugram) is India's most dynamic real estate market in 2025.
              Whether you're looking for a <strong>2 BHK home in Gurgaon</strong> starting ₹45 Lakh, a premium
              3 BHK on Dwarka Expressway at ₹1.5 Cr, or ultra-luxury residences from DLF and Oberoi at ₹6 Cr+,
              Gurgaon has options across every segment and budget.
            </p>
            <p>
              The key corridors — <Link href="/dwarka-expressway-projects" className="text-brand-dark underline">Dwarka Expressway</Link>,{' '}
              <Link href="/golf-course-extension-road-projects" className="text-brand-dark underline">Golf Course Extension Road</Link>,{' '}
              <Link href="/spr-road-projects" className="text-brand-dark underline">SPR Road</Link>, and{' '}
              <Link href="/new-gurgaon-projects" className="text-brand-dark underline">New Gurgaon</Link> —
              each offer distinct investment profiles. Dwarka Expressway leads for ROI (35–45% in 3 years),
              GCER is best for premium lifestyle, SPR Road is emerging for HNI buyers, and New Gurgaon is ideal
              for first-time buyers and affordable housing.
            </p>
            <p>
              Top builders active in Gurgaon in 2025 include DLF (Privana South, The Crest), M3M (Altitude, Crown, Capital Walk),
              Godrej Properties (Meridien, Icon), Krisumi (Waterside Residences), Oberoi Realty (Sky Heights, Eternia),
              Sobha (Altus, City), Emaar India and Signature Global. All projects listed are RERA-verified on haryanarera.gov.in.
            </p>
          </div>
        </div>
      </section>

      <InternalLinksBlock currentPage="/new-projects-in-gurgaon" />

      {/* Lead Form */}
      <section className="py-16 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Compare Best Projects in Gurgaon</h2>
          <p className="text-white/70 mb-8">Get a personalised comparison of top new projects based on your budget and preferred location — free advisory.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
