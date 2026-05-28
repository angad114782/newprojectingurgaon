import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import LeadCTA from '@/components/lead/LeadCTA';

export const metadata: Metadata = {
  title: 'Residential Property in Gurgaon 2025 | 2/3 BHK Apartments, Luxury Homes',
  description:
    'Find the best residential property in Gurgaon — 2 BHK from ₹45 Lakh, 3 BHK from ₹95 Lakh, luxury from ₹3 Cr. Verified RERA projects. Apartments, floors, villas. Free advisory.',
  keywords: 'residential property gurgaon, property in gurgaon, apartments in gurgaon, 2 bhk homes in gurgaon, luxury homes gurgaon, flats in gurgaon, buy property in gurgaon, gurgaon real estate 2025',
  openGraph: { title: 'Residential Property in Gurgaon 2025', description: '2 BHK from ₹45 Lakh to luxury from ₹3 Cr — verified residential property in Gurgaon.', url: '/residential-property-in-gurgaon', type: 'website' },
  alternates: { canonical: '/residential-property-in-gurgaon' },
  robots: { index: true, follow: true },
};

export default function ResidentialPropertyPage() {
  const propertyTypes = [
    { icon: '🏢', name: 'Apartments & Flats', desc: 'High-rise and mid-rise apartments in gated communities with clubhouse, gym and 24/7 security.', budget: '₹50 Lakh – ₹5 Cr' },
    { icon: '🏠', name: 'Independent Floors', desc: 'Builder floors and independent floors with privacy and lower maintenance. Popular in South Gurgaon.', budget: '₹40 Lakh – ₹2.5 Cr' },
    { icon: '🏡', name: 'Villas & Villaments', desc: 'Luxury villas and row houses with private garden, terrace and premium finishes in plotted colonies.', budget: '₹2 Cr – ₹20 Cr+' },
    { icon: '🌆', name: 'Luxury Residences', desc: 'Ultra-premium high-rises and signature towers on Golf Course Road, DLF 5 and Sohna Road.', budget: '₹3 Cr – ₹15 Cr+' },
  ];

  const lifestyle = [
    { icon: '🎓', category: 'Schools', items: ['DPS Gurgaon', 'GD Goenka', 'The Shri Ram School', 'Pathways World School'] },
    { icon: '🏥', category: 'Hospitals', items: ['Medanta Medicity', 'Fortis Memorial', 'Artemis Hospital', 'Max Hospital'] },
    { icon: '💼', category: 'Business Hubs', items: ['Cyber City', 'Golf Course Road', 'Sohna Road', 'IMT Manesar'] },
    { icon: '🛍️', category: 'Retail & Leisure', items: ['Ambience Mall', 'DLF Mega Mall', 'MGF Metropolis', 'Ardee Mall'] },
  ];

  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Residential Property in Gurgaon</span>
        </div>
      </nav>

      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🏡 Residential Properties
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Residential Property in Gurgaon
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Discover the finest residential properties in Gurgaon — from premium apartments and independent
              floors to luxury villas and ultra-premium high-rises. Gurgaon offers unmatched lifestyle infrastructure
              for families seeking their dream home.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#types" className="btn-primary">Explore Property Types</a>
              <LeadCTA ctaType="site_visit_request" className="btn-white">Find Best Residential Property</LeadCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-14 bg-white" id="types">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Types of Residential Property in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">From affordable apartments to ultra-luxury villas — choose what suits your lifestyle and budget.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {propertyTypes.map((type) => (
              <div key={type.name} className="bg-brand-mint/30 rounded-2xl p-6 border border-brand-border/40 hover:shadow-card transition-all">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="font-display font-semibold text-brand-text mb-2">{type.name}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-3">{type.desc}</p>
                <span className="text-brand-dark font-semibold text-sm">{type.budget}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle & Infrastructure */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-2 text-center">
            Lifestyle Infrastructure in Gurgaon
          </h2>
          <p className="text-brand-muted text-center mb-10">
            Gurgaon is India's premier corporate and lifestyle city, offering world-class amenities for residents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifestyle.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl p-5 border border-brand-border/40">
                <div className="text-2xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-brand-text mb-3">{cat.category}</h3>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="text-brand-muted text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connectivity */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-8 text-center">
            Why Gurgaon is Perfect for Residential Living
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-semibold text-brand-text mb-4">Connectivity</h3>
              <ul className="space-y-2 text-brand-muted text-sm">
                {[
                  'NH-48 (Delhi–Jaipur Highway) runs through the city',
                  'IGI Airport — 20 minutes from most sectors',
                  'Delhi Metro Yellow Line connects to central Delhi',
                  'Rapid Metro within Gurgaon for last-mile connectivity',
                  'Dwarka Expressway links to west Delhi seamlessly',
                  'Proposed metro extensions to all major sectors',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-brand-text mb-4">Family Lifestyle</h3>
              <ul className="space-y-2 text-brand-muted text-sm">
                {[
                  '250+ international and premium schools',
                  'Super-specialty hospitals within 5 km in most areas',
                  'Gated communities with 24/7 security and CCTV',
                  'Clubhouses, pools and sports facilities in every project',
                  '50+ malls and retail centers across the city',
                  'Parks, green belts and cycling tracks in premium sectors',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="text-brand-accent font-bold mt-0.5">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location Links */}
      <section className="py-10 bg-brand-mint/30 border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm mb-4 text-center">Explore by Location</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
              { label: 'Sector 113', href: '/sector-113-gurgaon-property' },
              { label: 'Sector 106', href: '/sector-106-gurgaon-property' },
              { label: 'Golf Course Ext Road', href: '/golf-course-extension-road-projects' },
              { label: 'New Gurgaon', href: '/new-gurgaon-projects' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-white border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Find the Best Residential Property in Gurgaon</h2>
          <p className="text-white/70 mb-8">Get personalised recommendations based on your budget, lifestyle and preferred location.</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
