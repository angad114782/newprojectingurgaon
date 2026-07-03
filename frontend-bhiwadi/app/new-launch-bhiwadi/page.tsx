import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import { fetchApiProjects } from '@/lib/api-projects';
import { fetchSettings } from '@/lib/settings';
import LeadCTA from '@/components/lead/LeadCTA';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();
  const pageUrl = `${siteUrl}/new-launch-bhiwadi`;
  return {
    title: `New Launch Projects in Bhiwadi 2025 | Best Entry Price | ${settings.siteName}`,
    description: `New launch projects in Bhiwadi 2025 — best entry price before appreciation. Omaxe, GLS, Eldeco, Adani, Hero Homes. 2 BHK from ₹35L. RERA verified. Free site visit.`,
    keywords: 'new launch bhiwadi, bhiwadi new projects 2025, new launch property bhiwadi, latest projects bhiwadi',
    openGraph: { title: `New Launch Projects in Bhiwadi 2025 | ${settings.siteName}`, url: pageUrl, type: 'website' },
    alternates: { canonical: pageUrl },
  };
}

export default async function NewLaunchBhiwadiPage() {
  const projects = await fetchApiProjects({ status: 'New Launch', limit: 50 });
  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link> <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">New Launch Projects in Bhiwadi</span>
        </div>
      </nav>
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 max-w-3xl">
          <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">🚀 New Launch 2025</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">New Launch Projects in Bhiwadi</h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8">Get the best entry price on new launch residential projects in Bhiwadi. Book at launch-stage pricing before 15–25% appreciation at possession. Compare Omaxe, GLS, Eldeco, Adani, Hero Homes launches.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">View New Launches</a>
            <LeadCTA ctaType="price_list" className="btn-white">Get Price List</LeadCTA>
          </div>
        </div>
      </section>
      <section className="py-14 bg-brand-mint/20" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">Latest New Launch Projects in Bhiwadi</h2>
          <p className="text-brand-muted text-center mb-10">RERA-verified new launches with launch-stage pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <Link key={p.slug} href={`/project/${p.slug}`} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="h-44 bg-gradient-to-br from-brand-dark to-brand-deep flex items-center justify-center rounded-t-2xl overflow-hidden relative">
                  {p.heroImage ? <img src={p.heroImage} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-white/40 text-5xl">🏢</span>}
                  <div className="absolute top-3 left-3"><span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New Launch</span></div>
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
      <section className="py-10 bg-white border-y border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Alwar Bypass Road Projects', href: '/alwar-bypass-road-projects' },
              { label: 'NH-48 Projects', href: '/nh-48-bhiwadi-projects' },
              { label: 'Ready to Move Bhiwadi', href: '/ready-to-move-bhiwadi' },
              { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
              { label: 'Flats Under 30 Lakh', href: '/flats-under-30-lakh-bhiwadi' },
              { label: 'Neemrana Projects', href: '/neemrana-bhiwadi-projects' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-brand-mint/40 border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">{l.label}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get New Launch Price List — Bhiwadi</h2>
          <p className="text-white/70 mb-8">Share your budget. We'll send matching new launch options with best pricing on WhatsApp.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
