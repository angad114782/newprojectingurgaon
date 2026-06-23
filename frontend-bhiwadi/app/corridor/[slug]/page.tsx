import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import { fetchProjectsWithFallback } from '@/lib/api-projects';
import { InternalLinksBlock } from '@/components/home/HomeSections';


export const revalidate = 60;
export const dynamicParams = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

type Props = { params: { slug: string } };

async function fetchCorridors() {
  try {
    const r = await fetch(`${API_URL}/settings/corridors`, { next: { revalidate: 300 } });
    const d = await r.json();
    return d.success ? d.data : [];
  } catch { return []; }
}

export async function generateStaticParams() {
  const corridors = await fetchCorridors();
  return corridors
    .filter((c: any) => c.href?.startsWith('/corridor/'))
    .map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const corridors = await fetchCorridors();
  const corridor = corridors.find((c: any) => c.slug === params.slug);
  const name = corridor?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  return {
    title: `${name} Projects 2025 | New Launch & Residential Property in Bhiwadi`,
    description: `Explore the best new launch, under construction and ready-to-move projects on ${name}, Bhiwadi. RERA verified. Free site visit. Best prices.`,
    alternates: { canonical: `/corridor/${params.slug}` },
    robots: { index: true, follow: true },
  };
}

const statusColors: Record<string, string> = {
  'New Launch': 'bg-green-50 text-green-700 border-green-200',
  'Pre Launch': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
  'Ready To Move': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default async function CorridorPage({ params }: Props) {
  const corridors = await fetchCorridors();
  const corridorData = corridors.find((c: any) => c.slug === params.slug);
  const corridorName = corridorData?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  const projects = await fetchProjectsWithFallback({ corridor: corridorName, limit: 20 });

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            {corridorData?.icon || '🛣️'} Bhiwadi Corridor
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {corridorName} Projects 2025
          </h1>
          <p className="text-white/70 text-base max-w-2xl mx-auto mb-6">
            New launch, under construction &amp; ready-to-move projects on {corridorName}, Bhiwadi. RERA verified. Free site visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#projects" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              View {projects.length} Projects ↓
            </a>
            <a href="#lead-form" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20">
              🏠 Book Free Site Visit
            </a>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {projects.length > 0 ? `${projects.length} Projects on ${corridorName}` : `Projects on ${corridorName}`}
            </h2>
            <Link href="/residential-property-in-bhiwadi" className="text-sm text-emerald-600 hover:underline">View All Bhiwadi →</Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">🏗️</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Coming Soon</h3>
              <p className="text-slate-500 text-sm mb-4">No projects listed for {corridorName} yet. Check back soon or explore all Bhiwadi projects.</p>
              <Link href="/residential-property-in-bhiwadi" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                All Bhiwadi Projects →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p: any) => {
                const img = p.heroImage || p.gallery?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';
                const price = p.priceOnRequest ? 'Price on Request' : p.priceDisplay || 'Ask for Price';
                return (
                  <Link key={p._id || p.slug} href={`/project/${p.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md overflow-hidden transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {p.status && (
                        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[p.status] || 'bg-white text-slate-600 border-slate-200'}`}>
                          {p.status}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{p.builder?.name || p.builder} · {p.location || p.sector}</p>
                      <p className="text-emerald-600 font-semibold text-sm mt-2">{price}</p>
                      {p.configurations?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {p.configurations.slice(0, 3).map((c: string) => (
                            <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lead Form */}
      <section id="lead-form" className="py-12 px-4 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Book Free Site Visit</h2>
          <p className="text-slate-500 text-sm text-center mb-6">Get expert advice on {corridorName} projects — no brokerage, transparent pricing.</p>
          <LeadForm />
        </div>
      </section>

      <InternalLinksBlock />
    </main>
  );
}
