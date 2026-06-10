import Link from 'next/link';
import LeadCTA from '@/components/lead/LeadCTA';
import Image from 'next/image';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { fetchSettings } from '@/lib/settings';

// ── Locations Grid ─────────────────────────────────────────────────────────────
export async function LocationsSection() {
  const settings = await fetchSettings();
  const locations = settings.locations ?? [];
  const phone = settings.phone || '+91-8619930583';

  return (
    <section className="py-16 bg-brand-mint/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-white text-brand-dark border border-brand-border mb-3">📍 Prime Locations</span>
          <h2 className="section-title">Top Locations to Buy Property in Gurgaon</h2>
          <p className="section-subtitle mx-auto mt-2">
            Explore Gurgaon's fastest-growing micro-markets — luxury homes, premium apartments and investment-grade projects.
          </p>
        </div>
        {locations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <Link key={loc.name} href={loc.href}
                className="group relative rounded-2xl overflow-hidden h-44 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                {loc.img ? (
                  <Image src={loc.img} alt={`Property in ${loc.name}`} fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-deep" />
                )}
                {/* Gradient overlay — inline style so DB dynamic values always work in production */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,30,40,0.85) 0%, rgba(4,30,40,0.3) 60%, transparent 100%)' }} />
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
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-brand-border/40">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="font-display font-bold text-brand-text text-xl mb-2">
              Our Representative Will Connect You Soon
            </h3>
            <p className="text-brand-muted text-sm mb-6 max-w-sm mx-auto">
              We're curating the best luxury locations across Gurgaon. Call us for immediate guidance on Dwarka Expressway, Golf Course Road and more.
            </p>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
              📞 Call Now: {phone}
            </a>
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/new-projects-in-gurgaon" className="btn-outline">
            View All Verified Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ──────────────────────────────────────────────────────────────
const USPs = [
  { icon: '✅', title: 'Verified Projects Only', desc: 'Every project is RERA-registered and builder-verified before listing. We never promote unverified or fraudulent projects.', stat: 'RERA verified' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'Actual price list, floor plan cost and complete payment plan — no hidden charges, no bait-and-switch.', stat: 'Zero hidden costs' },
  { icon: '🏡', title: 'Free Site Visit', desc: 'Our advisors personally accompany you on site visits. No pressure, no scripts — just genuine guidance.', stat: 'Same-day visits' },
  { icon: '📊', title: 'Investment Analysis', desc: 'Understand ROI potential, rental yield and exit strategy before you commit any money.', stat: 'Data-driven advice' },
  { icon: '🤝', title: 'Zero Brokerage', desc: 'Our advisory is completely free for buyers. We earn only from builders — never from you.', stat: '₹0 for buyers' },
  { icon: '📱', title: 'WhatsApp Updates', desc: 'Get price changes, new launches and site visit confirmations directly on WhatsApp.', stat: '< 2hr response' },
];

export async function WhyChooseUs() {
  const settings = await fetchSettings();
  const familiesHelped = settings.marketStats?.familiesHelped || '4,200+';
  const phone = settings.phone || '+91-8619930583';

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏆 Our Advantage</span>
          <h2 className="section-title">Why {familiesHelped} Families Trust {settings.siteName}</h2>
          <p className="section-subtitle mx-auto mt-2">
            We've helped thousands of luxury home buyers find verified premium properties in Gurgaon — without brokerage, without pressure.
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

        {/* CTA Strip */}
        <div className="mt-10 bg-gradient-to-r from-brand-dark to-[#06616B] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-display font-bold text-lg">Ready to find your dream home in Gurgaon?</h3>
            <p className="text-white/70 text-sm mt-1">Free advisory · No obligation · RERA-verified projects only</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="bg-white text-brand-dark font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-mint transition-colors">
              📞 {phone}
            </a>
            <LeadCTA ctaType="site_visit_request" className="btn-primary text-sm">Get Free Advisory →</LeadCTA>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Builder Logos ──────────────────────────────────────────────────────────────
export async function BuilderLogos() {
  const settings = await fetchSettings();
  const builders = settings.builders ?? [];
  const phone = settings.phone || '+91-8619930583';

  return (
    <section className="py-12 bg-brand-dark border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-widest mb-6">
          India's Most Trusted Builders on Our Platform
        </p>
        {builders.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {builders.map((b) => {
              const cls = 'flex items-center gap-2 bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-white/80 text-sm font-medium hover:bg-brand-accent/20 hover:text-white hover:border-brand-accent/30 transition-all duration-200';
              const inner = (
                <>
                  {b.img && (
                    <Image src={b.img} alt={b.name} width={56} height={24}
                      className="h-6 w-auto object-contain brightness-200 opacity-70 group-hover:opacity-100"
                      style={{ maxWidth: 56 }} />
                  )}
                  {b.name}
                </>
              );
              return b.website ? (
                <a key={b.name} href={b.website} target="_blank" rel="noopener noreferrer" className={cls + ' group'}>
                  {inner}
                </a>
              ) : (
                <Link key={b.name} href="/new-projects-in-gurgaon" className={cls + ' group'}>
                  {inner}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/50 text-sm mb-4">
              Our representative will connect you with verified builder projects soon.
            </p>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm">
              📞 Call Now: {phone}
            </a>
          </div>
        )}

        {/* Builder filter quick links */}
        {builders.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/new-projects-in-gurgaon"
              className="text-white/50 text-xs hover:text-white/80 transition underline underline-offset-2">
              View all projects by these builders →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
export async function TestimonialsSection() {
  const settings = await fetchSettings();
  const testimonials = settings.testimonials ?? [];
  const stats = settings.marketStats;
  const phone = settings.phone || '+91-8619930583';

  return (
    <section className="py-16 bg-brand-mint/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-white text-brand-dark border border-brand-border mb-3">⭐ Buyer Reviews</span>
          <h2 className="section-title">What Our Buyers Say</h2>
          <p className="section-subtitle mx-auto mt-2">Real reviews from verified luxury property buyers across Gurgaon</p>
        </div>
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-brand-border/40 shadow-card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-dark to-brand-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {t.avatar || t.name[0]}
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
                  {t.project && (
                    <div className="ml-auto">
                      <span className="text-xs bg-brand-mint text-brand-dark border border-brand-border px-2.5 py-1 rounded-full font-medium">
                        Booked: {t.project}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-brand-muted text-sm leading-relaxed italic">"{t.review}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-brand-border/40">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-display font-bold text-brand-text text-xl mb-2">
              Our Representative Will Connect You Soon
            </h3>
            <p className="text-brand-muted text-sm mb-6 max-w-md mx-auto">
              Join thousands of happy homebuyers across Gurgaon. Speak directly to our advisor for verified project reviews and buyer feedback.
            </p>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
              📞 Call Now: {phone}
            </a>
          </div>
        )}
        {stats && testimonials.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-brand-muted">
            <div className="flex items-center gap-1.5"><span className="text-yellow-400">★★★★★</span> <span>{stats.rating}/5 Rating</span></div>
            <div className="h-4 w-px bg-brand-border" />
            <span>{stats.reviewCount} Google Reviews</span>
            <div className="h-4 w-px bg-brand-border" />
            <span>{stats.familiesHelped} Happy Buyers</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Market Stats Section ───────────────────────────────────────────────────────
export async function MarketStatsSection() {
  const settings = await fetchSettings();
  const ms = settings.marketStats;

  const statsData = [
    {
      value: ms?.totalProjects || '150+',
      label: 'Verified Projects Listed',
      sub: 'RERA-registered & builder-verified',
    },
    {
      value: ms?.avgAppreciation ? `${ms.avgAppreciation}` : '18–45%',
      label: 'Expected 3-yr appreciation',
      sub: 'Dwarka Expressway corridors',
    },
    {
      value: ms?.avgRentalYield ? `${ms.avgRentalYield}` : '3–5%',
      label: 'Rental yield p.a.',
      sub: 'Across key micro-markets',
    },
    {
      value: ms?.familiesHelped || '4,200+',
      label: 'Happy Buyers Served',
      sub: `Since ${ms?.yearsActive ? new Date().getFullYear() - Number(ms.yearsActive.replace(/[^0-9]/g, '')) : '2020'}`,
    },
  ];

  return (
    <section className="py-12 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dot-pattern" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((s) => (
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

// ── FAQ Section ────────────────────────────────────────────────────────────────
export async function FAQSection() {
  const settings = await fetchSettings();
  const faqs = settings.faqs ?? [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">❓ FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto mt-2">
            Everything you need to know before buying a luxury home in Gurgaon
          </p>
        </div>
        {faqs.length > 0 ? (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-brand-mint/20 rounded-2xl border border-brand-border/50 overflow-hidden group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none hover:text-brand-dark">
                  {faq.q}
                  <span className="text-brand-accent text-xl ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">{faq.a}</div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-muted py-8">No FAQs configured. Add them in Admin → Settings.</p>
        )}
      </div>
    </section>
  );
}

// ── Luxury Highlights Strip ────────────────────────────────────────────────────
export function LuxuryHighlightsStrip() {
  const highlights = [
    { icon: '🏰', label: 'Ultra-Luxury Penthouses', sub: '₹5 Cr – ₹25 Cr', href: '/new-projects-in-gurgaon' },
    { icon: '⛳', label: 'Golf Course Road Homes', sub: 'Premium lifestyle', href: '/golf-course-extension-road-projects' },
    { icon: '✈️', label: 'Airport Zone Projects', sub: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
    { icon: '🌿', label: 'New Gurgaon Villas', sub: 'Low density, high ROI', href: '/new-gurgaon-projects' },
    { icon: '🏙️', label: 'SPR Road Luxury', sub: 'Premium connectivity', href: '/spr-road-projects' },
    { icon: '🔑', label: 'Ready To Move Homes', sub: 'Move in immediately', href: '/residential-property-in-gurgaon' },
  ];

  return (
    <section className="py-8 bg-white border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {highlights.map((h) => (
            <Link key={h.label} href={h.href}
              className="group text-center p-4 rounded-2xl border border-brand-border/50 hover:border-brand-accent/40 hover:bg-brand-mint/30 transition-all duration-200">
              <div className="text-3xl mb-2">{h.icon}</div>
              <div className="font-semibold text-brand-text text-xs group-hover:text-brand-dark leading-snug">{h.label}</div>
              <div className="text-brand-muted text-xs mt-0.5">{h.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Market Intelligence Section — unique data signals for Google authority ────
export function MarketIntelligenceSection() {
  const corridors = [
    {
      name: 'Dwarka Expressway',
      href: '/dwarka-expressway-projects',
      priceRange: '₹7,000–14,500/sqft',
      appreciation: '45–65%',
      rentalYield: '3.5–4.5%',
      hotSectors: 'Sectors 104–113',
      bestFor: 'Investment + NRI',
      tag: '🔥 Highest ROI',
      tagColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      name: 'Golf Course Ext Road',
      href: '/golf-course-extension-road-projects',
      priceRange: '₹10,500–17,500/sqft',
      appreciation: '40–55%',
      rentalYield: '3–4%',
      hotSectors: 'Sectors 57–75',
      bestFor: 'Luxury End-Use',
      tag: '⭐ Premium Lifestyle',
      tagColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    {
      name: 'SPR Road',
      href: '/spr-road-projects',
      priceRange: '₹8,000–13,500/sqft',
      appreciation: '50–62%',
      rentalYield: '3.5–5%',
      hotSectors: 'Sectors 65–85',
      bestFor: 'Investors 3–5Y',
      tag: '📈 Emerging Luxury',
      tagColor: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      name: 'New Gurgaon',
      href: '/new-gurgaon-projects',
      priceRange: '₹4,500–7,500/sqft',
      appreciation: '40–52%',
      rentalYield: '4.5–5.5%',
      hotSectors: 'Sectors 81–95',
      bestFor: 'Affordable Entry',
      tag: '💰 Best Value',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const dataPoints = [
    { label: 'Avg 3-Year Appreciation', value: '38%', sub: 'Across key Gurgaon corridors', icon: '📈' },
    { label: 'New Projects in 2025', value: '65+', sub: 'RERA-registered new launches', icon: '🏗️' },
    { label: 'Airport Distance', value: '10 min', sub: 'Sector 113 to IGI Terminal 3', icon: '✈️' },
    { label: 'Metro Connectivity', value: '8 Lines', sub: 'DMRC lines serving Gurgaon', icon: '🚇' },
    { label: 'Top Builder Count', value: '25+', sub: 'Active in Gurgaon 2025', icon: '🏢' },
    { label: 'RERA Registered', value: '100%', sub: 'All listed projects verified', icon: '✅' },
  ];

  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-brand-accent/20 text-brand-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            📊 Gurgaon Property Market Report 2025
          </span>
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Live Market Intelligence — Corridor-by-Corridor Breakdown
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto">
            Data-backed pricing, appreciation trends and rental yields across Gurgaon's top investment corridors — updated quarterly by our research team.
          </p>
        </div>

        {/* Key data points */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {dataPoints.map((d) => (
            <div key={d.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{d.icon}</div>
              <div className="text-2xl font-display font-bold text-brand-accent">{d.value}</div>
              <div className="text-white/80 text-xs font-medium mt-0.5 leading-snug">{d.label}</div>
              <div className="text-white/40 text-xs mt-0.5">{d.sub}</div>
            </div>
          ))}
        </div>

        {/* Corridor comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {corridors.map((c) => (
            <Link key={c.href} href={c.href}
              className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-brand-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-bold text-white text-base group-hover:text-brand-accent transition-colors">
                  {c.name}
                </h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.tagColor}`}>
                  {c.tag}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                <div>
                  <span className="text-white/40 text-xs block">Price Range</span>
                  <span className="text-white/90 font-medium">{c.priceRange}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs block">3-Year Appreciation</span>
                  <span className="text-brand-accent font-bold">{c.appreciation}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs block">Rental Yield</span>
                  <span className="text-white/90 font-medium">{c.rentalYield}</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs block">Best Suited For</span>
                  <span className="text-white/90 font-medium">{c.bestFor}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs">Hot zone: {c.hotSectors}</span>
                <span className="text-brand-accent text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  View Projects →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Editorial insight */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto">
          <h3 className="text-white font-display font-bold text-lg mb-3">
            Our 2025 Investment View — Where Smart Money Is Going
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            Dwarka Expressway remains the standout corridor for ROI — with IGI Airport at 10–15 minutes, Metro Phase II incoming,
            and a permanent supply constraint from the Delhi border just 2 km away, the structural case for appreciation is the strongest in NCR.
            Sectors 104–113 are our top pick for capital preservation with upside.
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            For luxury end-use with the best lifestyle infrastructure, Golf Course Extension Road (Sectors 57–75) remains unmatched.
            SPR Road (DLF Privana belt) is our dark horse — prices will reprice further when DLF Privana West takes possession in 2026.
            New Gurgaon is the best entry-level play with rental yields above 5% from Manesar industrial demand.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/blog/best-sectors-to-invest-in-gurgaon" className="text-brand-accent text-sm font-semibold hover:underline">
              Read Full Sector Analysis →
            </Link>
            <Link href="/blog/dwarka-expressway-investment-guide" className="text-brand-accent text-sm font-semibold hover:underline">
              Dwarka Expressway Deep Dive →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Latest Real Estate Guides — direct blog post links for crawlability ───────
export function LatestGuidesSection() {
  const guides = [
    {
      href: '/blog/best-sectors-to-invest-in-gurgaon',
      title: 'Best Sectors to Invest in Gurgaon in 2025',
      excerpt: 'Sector-by-sector breakdown of where smart money is going — Dwarka Expressway, Golf Course Extension & SPR Road ranked.',
      category: 'Investment Guide',
      icon: '📊',
    },
    {
      href: '/blog/dwarka-expressway-investment-guide',
      title: "Dwarka Expressway Investment Guide 2025",
      excerpt: 'Why Dwarka Expressway outperforms every Gurgaon corridor — IGI Airport proximity, Metro Phase II and sector-wise prices.',
      category: 'Investment Guide',
      icon: '✈️',
    },
    {
      href: '/blog/best-builders-in-gurgaon',
      title: 'Best Builders in Gurgaon — Ranked by Delivery & Trust',
      excerpt: 'Honest ranking of top Gurgaon builders — DLF, Sobha, Godrej, M3M — by delivery record, quality and resale value.',
      category: 'Builder Guide',
      icon: '🏗️',
    },
    {
      href: '/blog/how-to-check-rera-before-buying-property',
      title: 'How to Check RERA Before Buying a Property',
      excerpt: 'Step-by-step guide to verify any Gurgaon project on haryanarera.gov.in — protect yourself from fraud.',
      category: 'Legal & RERA',
      icon: '✅',
    },
    {
      href: '/blog/new-launch-vs-ready-to-move-property',
      title: 'New Launch vs Ready to Move — What Should You Buy?',
      excerpt: 'Detailed comparison of under-construction vs RTM properties in Gurgaon — ROI, risks and our recommendation.',
      category: 'Buying Guide',
      icon: '🔑',
    },
  ];

  return (
    <section className="py-16 bg-brand-mint/20 border-t border-brand-border/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-white text-brand-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-brand-border/40 uppercase tracking-widest">
            📚 Buyer's Resource Centre
          </span>
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">
            Gurgaon Real Estate Investment Guides
          </h2>
          <p className="text-brand-muted text-base max-w-2xl mx-auto">
            Expert guides written by RERA-registered advisors — everything you need to make the right property decision in Gurgaon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group bg-white rounded-2xl border border-brand-border/50 p-5 hover:border-brand-accent/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-semibold bg-brand-mint text-brand-dark border border-brand-border px-2.5 py-1 rounded-full">
                  {g.category}
                </span>
              </div>
              <h3 className="font-display font-bold text-brand-text text-base mb-2 group-hover:text-brand-dark leading-snug">
                {g.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">{g.excerpt}</p>
              <div className="mt-3 text-brand-accent text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                Read Guide →
              </div>
            </Link>
          ))}

          {/* View all blogs CTA */}
          <Link
            href="/blog"
            className="group bg-gradient-to-br from-brand-dark to-[#06616B] rounded-2xl border border-white/10 p-5 flex flex-col justify-center items-center text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-4xl mb-3">📖</span>
            <h3 className="font-display font-bold text-white text-base mb-2">All Investment Guides</h3>
            <p className="text-white/60 text-sm">Read all Gurgaon real estate guides and market updates →</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Internal Links Block — important for SEO / AIO / GEO ──────────────────────
// ── Gurgaon Real Estate Guide ──────────────────────────────────────────────────
export function GurgaonRealEstateGuide() {
  return (
    <section className="py-16 bg-white border-t border-brand-border/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-brand-border/40 uppercase tracking-widest">
            Complete Buyer's Guide
          </span>
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">
            Gurgaon Real Estate 2026 — Area-by-Area Investment Guide
          </h2>
          <p className="text-brand-muted text-base max-w-2xl mx-auto">
            Gurgaon (Gurugram) is India's fastest-growing real estate market. From ultra-luxury towers on Golf Course Road to high-ROI corridors on Dwarka Expressway — here's everything you need to make the right investment decision.
          </p>
        </div>

        <div className="space-y-10 text-brand-text leading-relaxed">

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">01.</span> Golf Course Road — Gurgaon's Most Prestigious Address
            </h3>
            <p className="mb-3">
              Golf Course Road (Sectors 54, 55, 56, 57) remains Gurgaon's most coveted residential corridor. Home to DLF, Emaar, M3M and Sobha projects, this stretch commands ₹15,000–₹35,000 per sq ft — the highest in the National Capital Region outside South Delhi. Properties here have delivered 30–45% appreciation over the past 3 years.
            </p>
            <p className="mb-3">
              The corridor connects directly to MG Road metro, Cyber City and the upcoming metro Phase-3 extension. Buyers here typically target 3 BHK, 4 BHK and penthouse configurations for both end-use and luxury investment.
            </p>
            <p>
              <strong>Best suited for:</strong> Ultra-HNI buyers, NRI investors, luxury end-use buyers with ₹5 Cr+ budget.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">02.</span> Dwarka Expressway — Highest ROI Corridor in NCR
            </h3>
            <p className="mb-3">
              Dwarka Expressway (Sectors 99–115, 37C, 37D) is Gurgaon's fastest appreciating corridor. Since metro connectivity opened in 2024 and the 8-lane expressway was completed, property values have jumped 40–60% across sectors. With the Indira Gandhi International Airport just 15 minutes away, this is a strategic investment zone.
            </p>
            <p className="mb-3">
              Projects by BPTP, Smart World, Signature Global, M3M and Sobha are actively under construction. The typical buyer gets 3 BHK apartments in the ₹1.2 Cr–₹3.5 Cr range — excellent value compared to Golf Course Road.
            </p>
            <p>
              <strong>Best suited for:</strong> First-time buyers, salaried professionals, investors looking for 5–7 year capital appreciation play.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">03.</span> SPR Road (Southern Peripheral Road) — The Emerging Luxury Belt
            </h3>
            <p className="mb-3">
              SPR Road connects Golf Course Extension Road to Sohna Road, creating a new luxury micro-market (Sectors 69–79). DLF Privana, Central Park, Vatika and Godrej projects have launched here at ₹10,000–₹18,000 per sq ft. The area offers Golf Course Road-quality living at a 20–30% discount.
            </p>
            <p>
              Corporate hubs from AIPL, Bestech and Emaar along SPR drive robust rental demand (3.5–5% rental yield). For buyers wanting luxury with better value, SPR is the #1 choice in 2026.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">04.</span> New Gurgaon (Sectors 80–115) — Mass Market + Emerging Zones
            </h3>
            <p className="mb-3">
              New Gurgaon encompasses the rapidly developing sectors beyond NH-48 and Pataudi Road. Sectors 80–95 offer the most affordable new projects — 2 BHK starting at ₹45–65 lakh and 3 BHK from ₹75 lakh to ₹1.8 Cr. Builders like Signature Global, Pareena and ROF are delivering completed projects.
            </p>
            <p>
              Infrastructure development — new metro corridors, DMIC (Delhi-Mumbai Industrial Corridor) proximity and IMT Manesar expansion — makes New Gurgaon a long-term growth story. Possession timelines are 2025–2028 for most new launches.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">05.</span> Sohna Road — Gurgaon's Mid-Luxury Sweet Spot
            </h3>
            <p className="mb-3">
              Sohna Road (Sectors 48–70) bridges the gap between Golf Course Road pricing and New Gurgaon affordability. Projects like Paras The Manor, Central Park Bellavista and Emaar Urban Oasis offer 3–4 BHK apartments at ₹2.5 Cr–₹6 Cr — right in the sweet spot for upgrade buyers.
            </p>
            <p>
              The Sohna elevated road has dramatically cut travel time to the Golf Course Extension corridor. Proximity to Rajiv Chowk metro, multiple schools (GD Goenka, Shriram, Heritage), and hospital clusters makes this ideal for families.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">06.</span> Gwal Pahari — Aravalli Views, Emerging Luxury Zone
            </h3>
            <p className="mb-3">
              Gwal Pahari sits on the Gurgaon-Faridabad border with unobstructed Aravalli forest views. Godrej Meridien and Emaar projects have established this as Gurgaon's next luxury frontier. With limited land supply and the Aravalli zone being protected, properties here are a scarce asset — prices have risen 25% in 18 months.
            </p>
            <p>
              The proposed RRTS (Rapid Rail Transit) corridor and proximity to Faridabad's industrial belt add long-term upside. Typical price: ₹8,000–₹14,000 per sq ft for new launches.
            </p>
          </div>

          <div className="bg-brand-mint/40 border border-brand-border/40 rounded-2xl p-6">
            <h3 className="text-lg font-display font-bold text-brand-dark mb-3">
              Key Things to Verify Before Buying Any Project in Gurgaon
            </h3>
            <ul className="space-y-2 text-brand-muted text-sm">
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">RERA Registration:</strong> Check haryanarera.gov.in for valid RERA number — never buy without it.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Builder Track Record:</strong> Verify previous project delivery timelines — DLF, Sobha, Godrej have the best delivery records in Gurgaon.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Possession Timeline:</strong> Under-construction projects carry higher risk — budget for 6–18 months delay beyond stated possession.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Floor Plans & Carpet Area:</strong> Super built-up area is 15–25% more than carpet area — always compare on carpet area basis.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Loan Approvals:</strong> Check if SBI, HDFC or ICICI has approved the project — it signals due diligence is done.</span></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

export function InternalLinksBlock({ currentPage }: { currentPage?: string }) {
  const allLinks = [
    { label: 'Luxury Property in Gurgaon', href: '/new-projects-in-gurgaon' },
    { label: 'New Launch Projects Gurgaon', href: '/new-launch-projects-in-gurgaon' },
    { label: 'Residential Property in Gurgaon', href: '/residential-property-in-gurgaon' },
    { label: 'Projects on Dwarka Expressway', href: '/dwarka-expressway-projects' },
    { label: 'Projects on SPR Road', href: '/spr-road-projects' },
    { label: 'Golf Course Extension Road', href: '/golf-course-extension-road-projects' },
    { label: 'Property in New Gurgaon', href: '/new-gurgaon-projects' },
    { label: 'Sector 113 Property Gurgaon', href: '/sector-113-gurgaon-property' },
    { label: 'Sector 106 Property Gurgaon', href: '/sector-106-gurgaon-property' },
    { label: 'Sector 102 Property Gurgaon', href: '/sector-102-gurgaon-property' },
    { label: '2 BHK in Sector 37D Gurgaon', href: '/sector-37d-gurgaon-property' },
    { label: 'Gurgaon Real Estate Blog', href: '/blog' },
    { label: 'Best Builders in Gurgaon', href: '/blog/best-builders-in-gurgaon' },
    { label: 'Best Sectors to Invest in Gurgaon', href: '/blog/best-sectors-to-invest-in-gurgaon' },
    { label: 'Dwarka Expressway Investment Guide', href: '/blog/dwarka-expressway-investment-guide' },
    { label: 'How to Check RERA Registration', href: '/blog/how-to-check-rera-before-buying-property' },
    { label: 'New Launch vs Ready to Move', href: '/blog/new-launch-vs-ready-to-move-property' },
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

// ── DynamicCorridorsSection — shows only custom (non-default) corridors added from admin ──
const DEFAULT_CORRIDOR_SLUGS = new Set([
  'dwarka-expressway', 'golf-course-road', 'golf-course-extension-road',
  'spr-road', 'sohna-road', 'new-gurgaon', 'mg-road',
]);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export async function DynamicCorridorsSection() {
  let corridors: any[] = [];
  try {
    const r = await fetch(`${API_BASE_URL}/settings/corridors`, { next: { revalidate: 300 } });
    const d = await r.json();
    if (d.success) corridors = (d.data || []).filter((c: any) => !DEFAULT_CORRIDOR_SLUGS.has(c.slug));
  } catch { return null; }

  if (!corridors.length) return null;

  return (
    <section className="py-12 px-4 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            New Corridors
          </span>
          <h2 className="text-2xl font-bold text-slate-900">More Gurgaon Corridors</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl mx-auto">Explore projects across newly added Gurgaon corridors</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c: any) => (
            <Link key={c.slug} href={c.href}
              className="group flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">
                {c.icon || '🛣️'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">View Projects →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
