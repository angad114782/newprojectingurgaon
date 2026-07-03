import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/home/LeadForm';
import { InternalLinksBlock } from '@/components/home/HomeSections';

export const revalidate = 60;
export const dynamicParams = true;

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api').replace(/\/$/, '');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com').replace(/\/$/, '');

type Props = { params: { city: string } };

// "bhiwadi" → "Bhiwadi" | "new-delhi" → "New Delhi"
const toDisplayName = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

// Detect "3-bhk-flats-in-bhiwadi" → { bhk: '3 BHK', citySlug: 'bhiwadi' }
function detectBHKPattern(seg: string) {
  const m = seg.match(/^(\d+)-bhk-flats-in-(.+)$/);
  return m ? { bhk: `${m[1]} BHK`, citySlug: m[2] } : null;
}

async function getCorridors() {
  try {
    const r = await fetch(`${API}/settings/corridors`, { next: { revalidate: 300 } });
    const d = await r.json();
    return d.success ? (d.data as any[]) : [];
  } catch { return []; }
}

async function getProjects(citySlug: string, extra: Record<string, string> = {}) {
  try {
    const qs = new URLSearchParams({ city: citySlug, limit: '60', sort: '-createdAt', ...extra });
    const r = await fetch(`${API}/projects?${qs}`, { next: { revalidate: 60 } });
    const d = await r.json();
    return d.success ? (d.data as any[]) : [];
  } catch { return []; }
}

export async function generateStaticParams() {
  const corridors = await getCorridors();
  const cities = Array.from(new Set(
    corridors
      .filter((c: any) => c.city)
      .map((c: any) => c.city.toLowerCase().replace(/\s+/g, '-'))
  )) as string[];
  return cities.map(city => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bhk = detectBHKPattern(params.city);
  const citySlug = bhk ? bhk.citySlug : params.city;
  const cityName = toDisplayName(citySlug);

  if (bhk) {
    return {
      title: `${bhk.bhk} Flats in ${cityName} 2025 | New Launch & Ready To Move`,
      description: `Find verified ${bhk.bhk} apartments in ${cityName}. New launch & ready-to-move. RERA approved. Free site visit. Best price.`,
      alternates: { canonical: `${SITE}/${params.city}` },
      robots: { index: true, follow: true },
    };
  }
  return {
    title: `New Projects in ${cityName} 2025 | New Launch Property | Best Price`,
    description: `Explore verified new launch, under construction & ready-to-move projects in ${cityName}. RERA approved. Free site visit. Zero brokerage.`,
    alternates: { canonical: `${SITE}/${params.city}` },
    robots: { index: true, follow: true },
  };
}

const STATUS_COLORS: Record<string, string> = {
  'New Launch': 'bg-green-50 text-green-700 border-green-200',
  'Pre Launch': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
  'Ready To Move': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default async function CityPage({ params }: Props) {
  const bhk = detectBHKPattern(params.city);
  const citySlug = bhk ? bhk.citySlug : params.city;
  const cityName = toDisplayName(citySlug);

  const corridors = await getCorridors();
  const cityCorridors = corridors.filter(
    (c: any) => (c.city || 'Bhiwadi').toLowerCase().replace(/\s+/g, '-') === citySlug
  );

  if (!cityCorridors.length) notFound();

  const extra: Record<string, string> = {};
  if (bhk) extra.config = bhk.bhk;

  const projects = await getProjects(citySlug, extra);

  const pageTitle = bhk
    ? `${bhk.bhk} Flats in ${cityName}`
    : `New Projects in ${cityName} 2025`;
  const pageSub = bhk
    ? `Verified ${bhk.bhk} apartments in ${cityName}. RERA approved. Free site visit.`
    : `RERA verified new launch, under construction & ready-to-move projects in ${cityName}. Zero brokerage.`;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            🏙️ {cityName} Real Estate
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{pageTitle}</h1>
          <p className="text-white/70 text-base max-w-2xl mx-auto mb-6">{pageSub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#projects" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              View {projects.length} Projects ↓
            </a>
            <a href="#lead-form" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20">
              📞 Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Quick filter pills */}
      <section className="py-4 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 shrink-0">Filter:</span>
          <Link href={`/${citySlug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white">All</Link>
          <Link href={`/ready-to-move/${citySlug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors">Ready To Move</Link>
          {['2', '3', '4'].map(n => (
            <Link key={n} href={`/${n}-bhk-flats-in-${citySlug}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors">
              {n} BHK
            </Link>
          ))}
          {cityCorridors.length > 1 && cityCorridors.map((c: any) => (
            <span key={c.slug} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {c.icon || '🛣️'} {c.name}
            </span>
          ))}
        </div>
      </section>

      {/* Projects grid */}
      <section id="projects" className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {projects.length > 0 ? `${projects.length} Properties in ${cityName}` : `Properties in ${cityName}`}
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">🏗️</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Coming Soon</h3>
              <p className="text-slate-500 text-sm mb-4">No projects listed for {cityName} yet. Check back soon.</p>
              <Link href="/residential-property-in-bhiwadi" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                View All Projects →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p: any) => {
                const img = p.heroImage || p.gallery?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';
                const price = p.priceOnRequest ? 'Price on Request' : p.priceDisplay || 'Ask for Price';
                return (
                  <Link key={p._id} href={`/${citySlug}/${p.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md overflow-hidden transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {p.status && (
                        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[p.status] || 'bg-white text-slate-600 border-slate-200'}`}>
                          {p.status}
                        </span>
                      )}
                      {p.isVerified && (
                        <span className="absolute top-3 right-3 bg-white/90 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">✓ RERA</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{p.builder?.name || p.builder} · {p.location || p.sector || cityName}</p>
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

      {/* Lead form */}
      <section id="lead-form" className="py-12 px-4 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Get Free Expert Advice</h2>
          <p className="text-slate-500 text-sm text-center mb-6">Our advisor will share top 3 projects in {cityName} matching your budget — within 2 hours.</p>
          <LeadForm />
        </div>
      </section>

      <InternalLinksBlock />
    </main>
  );
}
