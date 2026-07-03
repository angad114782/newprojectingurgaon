import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import { fetchApiProjects } from '@/lib/api-projects';
import { fetchSettings } from '@/lib/settings';
import LeadCTA from '@/components/lead/LeadCTA';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();
  const pageUrl = `${siteUrl}/new-projects-in-bhiwadi`;
  return {
    title: `New Projects in Bhiwadi 2025 | Latest Residential Launches | ${settings.siteName}`,
    description: `Latest new residential projects in Bhiwadi 2025. Compare all new launches — Omaxe, GLS, Eldeco, Adani, Hero Homes — from ₹28L. RERA verified. Free advisory. Free site visit. Zero brokerage. Call ${settings.phone}.`,
    keywords: 'new projects in bhiwadi 2025, bhiwadi new residential projects, latest bhiwadi projects',
    openGraph: { title: `New Projects in Bhiwadi 2025 | Latest Residential Launches | ${settings.siteName}`, url: pageUrl, type: 'website' },
    alternates: { canonical: pageUrl },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const corridor = searchParams.location || searchParams.corridor || '';
  const status   = searchParams.status   || '';
  const config   = searchParams.config   || searchParams.bhk || '';
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;

  const projects = await fetchApiProjects({
    corridor:  corridor  || undefined,
    status:    status    || undefined,
    config:    config    || undefined,
    maxPrice,
    minPrice,
    limit: 50,
  });

  // Active filter label for heading
  const filterLabel = [
    corridor && `in ${corridor}`,
    status,
    config,
    maxPrice && `Under ₹${maxPrice}L`,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link> <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">New Projects in Bhiwadi 2025</span>
          {filterLabel && <><span className="mx-2">/</span><span className="text-brand-accent">{filterLabel}</span></>}
        </div>
      </nav>

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">🆕 Latest Projects</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              New Projects in Bhiwadi 2025{filterLabel && ` — ${filterLabel}`}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              {projects.length} RERA-verified project{projects.length !== 1 ? 's' : ''} found{filterLabel ? ` for ${filterLabel}` : ' in Bhiwadi'}. Free advisory — get full pricing on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View Properties</a>
              <LeadCTA ctaType="site_visit" className="btn-white">Book Free Site Visit</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      <ProjectFilterBar
        basePath="/new-projects-in-bhiwadi"
        active={{ location: corridor, status, config, maxPrice: searchParams.maxPrice || '' }}
        totalCount={projects.length}
      />

      <section className="py-14 bg-brand-mint/20" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            {filterLabel ? `${filterLabel} — Projects in Bhiwadi` : 'All Projects in Bhiwadi 2025'}
          </h2>
          <p className="text-brand-muted text-center mb-10">RERA-registered properties with current pricing</p>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <Link key={p.slug} href={`/project/${p.slug}`} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="h-44 bg-gradient-to-br from-brand-dark to-brand-deep flex items-center justify-center rounded-t-2xl overflow-hidden relative">
                    {p.heroImage ? <img src={p.heroImage} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-white/40 text-5xl">🏢</span>}
                    <div className="absolute top-3 left-3"><span className="bg-brand-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.status}</span></div>
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
          ) : (
            <div className="text-center py-12 text-brand-muted">
              <p className="text-lg mb-4">No projects found for this filter. Try removing a filter or call us for latest options.</p>
              <LeadCTA ctaType="site_visit" className="btn-primary">Get WhatsApp Update</LeadCTA>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-white border-y border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'All Bhiwadi Properties', href: '/residential-property-in-bhiwadi' },
              { label: 'Alwar Bypass Road', href: '/alwar-bypass-road-projects' },
              { label: 'NH-48 Projects', href: '/nh-48-bhiwadi-projects' },
              { label: 'Neemrana Projects', href: '/neemrana-bhiwadi-projects' },
              { label: 'Tapukara Projects', href: '/tapukara-bhiwadi-projects' },
              { label: 'Ready to Move', href: '/ready-to-move-bhiwadi' },
              { label: 'Flats Under 30 Lakh', href: '/flats-under-30-lakh-bhiwadi' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-brand-mint/40 border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">{l.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get Property Details — New Projects in Bhiwadi 2025</h2>
          <p className="text-white/70 mb-8">We'll share matching properties with pricing on WhatsApp within 2 hours.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
