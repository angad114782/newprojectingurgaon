'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { TESTIMONIALS, CORRIDORS } from '@/lib/projects';

// ── Locations Grid ──
const LOCATIONS = [
  { name: 'Dwarka Expressway', projects: '35+', icon: '🛣️', href: '/dwarka-expressway-projects', highlight: 'Fastest Growing', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70', color: 'from-blue-900/80' },
  { name: 'Sector 113', projects: '12+', icon: '✈️', href: '/sector-113-gurgaon-property', highlight: 'Near Airport', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70', color: 'from-green-900/80' },
  { name: 'Sector 106', projects: '10+', icon: '🏢', href: '/sector-106-gurgaon-property', highlight: 'Premium Belt', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70', color: 'from-purple-900/80' },
  { name: 'Golf Course Ext Road', projects: '20+', icon: '⛳', href: '/golf-course-extension-road-projects', highlight: 'Top Rated', img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=70', color: 'from-teal-900/80' },
  { name: 'Sector 102', projects: '8+', icon: '🌿', href: '/sector-102-gurgaon-property', highlight: 'Green Sector', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=70', color: 'from-indigo-900/80' },
  { name: 'SPR Road', projects: '15+', icon: '📈', href: '/spr-road-projects', highlight: 'High ROI', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70', color: 'from-orange-900/80' },
  { name: 'New Gurgaon', projects: '25+', icon: '🌆', href: '/new-gurgaon-projects', highlight: 'Emerging', img: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=70', color: 'from-red-900/80' },
  { name: 'Sector 37D', projects: '6+', icon: '🏡', href: '/sector-37d-gurgaon-property', highlight: 'Affordable', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=70', color: 'from-yellow-900/80' },
];

export function LocationsSection() {
  return (
    <section className="py-16 bg-brand-mint/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-white text-brand-dark border border-brand-border mb-3">📍 Prime Locations</span>
          <h2 className="section-title">Top Locations to Buy Property in Gurgaon</h2>
          <p className="section-subtitle mx-auto mt-2">
            Explore Gurgaon's fastest-growing micro-markets — each offering unique investment advantages.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {LOCATIONS.map((loc) => (
            <Link key={loc.name} href={loc.href}
              className="group relative rounded-2xl overflow-hidden h-44 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <Image src={loc.img} alt={`Property in ${loc.name}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw" />
              <div className={`absolute inset-0 bg-gradient-to-t ${loc.color} to-transparent`} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium mb-1.5 inline-block w-fit">
                  {loc.highlight}
                </span>
                <h3 className="font-display font-bold text-sm leading-snug">{loc.name}</h3>
                <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                  <MapPinIcon className="w-3 h-3" />{loc.projects} Projects
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/new-projects-in-gurgaon" className="btn-outline">
            View All 150+ Verified Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ──
const USPs = [
  { icon: '✅', title: 'Verified Projects Only', desc: 'Every project is RERA-registered and builder-verified before listing. We never promote unverified or fraudulent projects.', stat: '150+ RERA verified' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'Actual price list, floor plan cost and complete payment plan — no hidden charges, no bait-and-switch.', stat: 'Zero hidden costs' },
  { icon: '🏡', title: 'Free Site Visit', desc: 'Our advisors personally accompany you on site visits. No pressure, no scripts — just genuine guidance.', stat: 'Same-day visits' },
  { icon: '📊', title: 'Investment Analysis', desc: 'Understand ROI potential, rental yield and exit strategy before you commit any money.', stat: 'Data-driven advice' },
  { icon: '🤝', title: 'Zero Brokerage', desc: 'Our advisory is completely free for buyers. We earn only from builders — never from you.', stat: '₹0 for buyers' },
  { icon: '📱', title: 'WhatsApp Updates', desc: 'Get price changes, new launches and site visit confirmations directly on WhatsApp.', stat: '< 2hr response' },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏆 Our Advantage</span>
          <h2 className="section-title">Why 4,200+ Families Trust GurgaonRealty</h2>
          <p className="section-subtitle mx-auto mt-2">
            We've helped thousands of buyers find verified properties in Gurgaon — without brokerage, without pressure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {USPs.map((u) => (
            <div key={u.title} className="group p-6 rounded-2xl border border-brand-border/50 hover:border-brand-accent/40 hover:bg-brand-mint/30 hover:shadow-card transition-all duration-300">
              <div className="text-3xl mb-3">{u.icon}</div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-brand-text text-base group-hover:text-brand-dark">{u.title}</h3>
                <span className="text-xs bg-brand-accent/10 text-brand-dark font-semibold px-2.5 py-1 rounded-full ml-2 whitespace-nowrap">{u.stat}</span>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Builder Logos ──
const BUILDERS = [
  { name: 'DLF', img: null }, { name: 'Sobha', img: null }, { name: 'M3M', img: null },
  { name: 'Godrej', img: null }, { name: 'Emaar', img: null }, { name: 'Tata', img: null },
  { name: 'Signature Global', img: null }, { name: 'Hero Homes', img: null },
  { name: 'Krisumi', img: null }, { name: 'Elan', img: null }, { name: 'Smartworld', img: null },
  { name: 'Shapoorji', img: null },
];

export function BuilderLogos() {
  return (
    <section className="py-12 bg-brand-dark border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-widest mb-6">
          India's Most Trusted Builders on Our Platform
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {BUILDERS.map((b) => (
            <div key={b.name}
              className="bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-white/80 text-sm font-medium hover:bg-brand-accent/20 hover:text-white hover:border-brand-accent/30 transition-all duration-200 cursor-default">
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──
export function TestimonialsSection() {
  return (
    <section className="py-16 bg-brand-mint/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-white text-brand-dark border border-brand-border mb-3">⭐ Buyer Reviews</span>
          <h2 className="section-title">What Our Buyers Say</h2>
          <p className="section-subtitle mx-auto mt-2">Real reviews from verified property buyers across Gurgaon</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-brand-border/40 shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-dark to-brand-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-text">{t.name}</h4>
                  <p className="text-brand-muted text-xs">{t.role} · {t.city}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-brand-mint text-brand-dark border border-brand-border px-2.5 py-1 rounded-full font-medium">
                    Booked: {t.project}
                  </span>
                </div>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed italic">"{t.review}"</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-brand-muted">
          <div className="flex items-center gap-1.5"><span className="text-yellow-400">★★★★★</span> <span>4.9/5 Rating</span></div>
          <div className="h-4 w-px bg-brand-border" />
          <span>847 Google Reviews</span>
          <div className="h-4 w-px bg-brand-border" />
          <span>4,200+ Happy Buyers</span>
        </div>
      </div>
    </section>
  );
}

// ── Market Stats Section ──
export function MarketStatsSection() {
  return (
    <section className="py-12 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dot-pattern" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '₹6,500 – ₹25,000', label: 'Price range /sqft', sub: 'Based on sector & builder' },
            { value: '18–45%', label: 'Expected 3-yr appreciation', sub: 'Dwarka Expressway corridors' },
            { value: '3–5%', label: 'Rental yield p.a.', sub: 'Across key micro-markets' },
            { value: '₹40L – ₹15Cr+', label: 'Budget options available', sub: 'For all buyer types' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-brand-accent mb-1">{s.value}</div>
              <div className="text-white font-semibold text-sm">{s.label}</div>
              <div className="text-white/50 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ──
const FAQS = [
  { q: 'What are new launch projects in Gurgaon?', a: 'New launch projects in Gurgaon are freshly announced residential developments that have received RERA registration and opened bookings for the first time. They offer the best entry pricing — typically 10–25% below what the same project will cost in 12–18 months.' },
  { q: 'Which is the best location to invest in Gurgaon in 2025?', a: 'Dwarka Expressway (Sectors 99–115), Golf Course Extension Road and SPR Road are the top investment zones in 2025, with 15–45% appreciation potential driven by metro expansion, airport proximity and corporate demand.' },
  { q: 'Is there any fee for using GurgaonRealty?', a: 'No. Our advisory, site visits, price comparisons and documentation support are completely free for buyers. We earn only from verified builders, never from you.' },
  { q: 'How do I verify a project\'s RERA registration?', a: 'Visit haryanarera.gov.in and search by project name or RERA number. All projects listed on GurgaonRealty are RERA-verified before listing.' },
  { q: 'What is the difference between new launch and ready-to-move?', a: 'New launch offers lower pricing but requires 3–4 year wait. Ready-to-move has higher pricing but immediate possession and rental income potential. The right choice depends on your goals and risk appetite.' },
  { q: 'What is the minimum budget to buy in Gurgaon?', a: 'Properties in Gurgaon start from ₹40 Lakh for 1BHK in New Gurgaon (Sector 37D) under DDJAY scheme. Premium 2BHK apartments on Dwarka Expressway start from ₹80 Lakh. Luxury options start from ₹2 Cr.' },
];

export function FAQSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">❓ FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details key={i} className="bg-brand-mint/20 rounded-2xl border border-brand-border/50 overflow-hidden group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none hover:text-brand-dark">
                {faq.q}
                <span className="text-brand-accent text-xl ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Internal Links Block — important for SEO / AIO / GEO ──
export function InternalLinksBlock({ currentPage }: { currentPage?: string }) {
  const allLinks = [
    { label: 'Property in Gurgaon', href: '/new-projects-in-gurgaon' },
    { label: 'New Launch Projects Gurgaon', href: '/new-launch-projects-in-gurgaon' },
    { label: 'Residential Property in Gurgaon', href: '/residential-property-in-gurgaon' },
    { label: 'New Projects in Gurgaon 2025', href: '/new-projects-in-gurgaon' },
    { label: 'Projects on Dwarka Expressway', href: '/dwarka-expressway-projects' },
    { label: 'Projects on SPR Road', href: '/spr-road-projects' },
    { label: 'Golf Course Extension Road', href: '/golf-course-extension-road-projects' },
    { label: 'Property in New Gurgaon', href: '/new-gurgaon-projects' },
    { label: 'Sector 113 Property Gurgaon', href: '/sector-113-gurgaon-property' },
    { label: 'Sector 106 Property Gurgaon', href: '/sector-106-gurgaon-property' },
    { label: 'Sector 102 Property Gurgaon', href: '/sector-102-gurgaon-property' },
    { label: '2 BHK in Sector 37D Gurgaon', href: '/sector-37d-gurgaon-property' },
    { label: 'Gurgaon Property Blog', href: '/blog' },
  ];

  const links = allLinks.filter((l) => l.href !== currentPage);

  return (
    <section className="py-10 bg-brand-mint/30 border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-brand-muted text-xs font-semibold uppercase tracking-widest mb-4 text-center">Explore More Pages</p>
        <div className="flex flex-wrap justify-center gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-white border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark hover:border-brand-accent/40 hover:bg-brand-mint transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
