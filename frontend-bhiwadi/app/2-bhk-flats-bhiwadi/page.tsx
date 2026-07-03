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
  const pageUrl = `${siteUrl}/2-bhk-flats-bhiwadi`;
  return {
    title: `2 BHK Flats in Bhiwadi 2025 | from ₹35 Lakh | RERA Verified | ${settings.siteName}`,
    description: `Compare 2 BHK flats in Bhiwadi from ₹35 Lakh. Omaxe Green Meadow (₹45L), Ashiana (₹48L), Avalon Sports City (₹55L) and more. All RERA registered. Free site visit. Zero brokerage. RERA verified. Call ${settings.phone}.`,
    keywords: '2 bhk flats bhiwadi, 2 bhk bhiwadi price, bhiwadi 2 bhk apartments',
    openGraph: { title: `2 BHK Flats in Bhiwadi 2025 | from ₹35 Lakh | RERA Verified | ${settings.siteName}`, url: pageUrl, type: 'website' },
    alternates: { canonical: pageUrl },
  };
}

export default async function Page() {
  const projects = await fetchApiProjects({ config: '2 BHK', limit: 50 });
  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link> <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">2 BHK Flats in Bhiwadi</span>
        </div>
      </nav>
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">🏠 2 BHK</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">2 BHK Flats in Bhiwadi</h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">Compare 2 BHK flats in Bhiwadi from ₹35 Lakh. Omaxe Green Meadow (₹45L), Ashiana (₹48L), Avalon Sports City (₹55L) and more. All RERA registered.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View Properties</a>
              <LeadCTA ctaType="site_visit" className="btn-white">Book Free Site Visit</LeadCTA>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-brand-mint/20" id="projects">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">2 BHK Flats in Bhiwadi</h2>
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
              <p className="text-lg mb-4">Projects coming soon — please call us for latest options.</p>
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
          <h2 className="text-3xl font-display font-bold text-white mb-3">Get Property Details — 2 BHK Flats in Bhiwadi</h2>
          <p className="text-white/70 mb-8">We'll share matching properties with pricing on WhatsApp within 2 hours.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
