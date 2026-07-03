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
          <h2 className="section-title">Top Locations to Buy Property in Bhiwadi</h2>
          <p className="section-subtitle mx-auto mt-2">
            Explore Bhiwadi's fastest-growing corridors — affordable housing, industrial zone apartments and investment-grade projects on NH-48.
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
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,79,114,0.85) 0%, rgba(27,79,114,0.3) 60%, transparent 100%)' }} />
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
              We're curating the best verified projects across Bhiwadi — Alwar Bypass, NH-48, Tapukara and RIICO. Call us for immediate guidance.
            </p>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
              📞 Call Now: {phone}
            </a>
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/residential-property-in-bhiwadi" className="btn-outline">
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
  const familiesHelped = settings.marketStats?.familiesHelped || '2,800+';
  const phone = settings.phone || '+91-8619930583';

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏆 Our Advantage</span>
          <h2 className="section-title">Why {familiesHelped} Families Trust {settings.siteName}</h2>
          <p className="section-subtitle mx-auto mt-2">
            We've helped thousands of homebuyers find verified properties in Bhiwadi — without brokerage, without pressure.
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
        <div className="mt-10 bg-gradient-to-r from-brand-dark to-brand-deep rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-display font-bold text-lg">Ready to find your ideal property in Bhiwadi?</h3>
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
          Trusted Builders Active in Bhiwadi
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
                <Link key={b.name} href="/residential-property-in-bhiwadi" className={cls + ' group'}>
                  {inner}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/50 text-sm mb-4">
              Our representative will connect you with verified builder projects in Bhiwadi soon.
            </p>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 bg-brand-accent text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm">
              📞 Call Now: {phone}
            </a>
          </div>
        )}
        {builders.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/residential-property-in-bhiwadi"
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
          <p className="section-subtitle mx-auto mt-2">Real reviews from verified property buyers across Bhiwadi and Neemrana</p>
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
              Join thousands of happy homebuyers across Bhiwadi. Speak directly to our advisor for verified project reviews and buyer feedback.
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
      value: ms?.totalProjects || '80+',
      label: 'Verified Projects Listed',
      sub: 'RERA-registered & builder-verified',
    },
    {
      value: ms?.avgAppreciation ? `${ms.avgAppreciation}` : '18–35%',
      label: 'Expected 3-yr appreciation',
      sub: 'NH-48 & Alwar Bypass corridors',
    },
    {
      value: ms?.avgRentalYield ? `${ms.avgRentalYield}` : '4–6%',
      label: 'Rental yield p.a.',
      sub: 'Industrial zone demand',
    },
    {
      value: ms?.familiesHelped || '2,800+',
      label: 'Happy Buyers Served',
      sub: `Since ${ms?.yearsActive ? new Date().getFullYear() - Number(ms.yearsActive.replace(/[^0-9]/g, '')) : '2019'}`,
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
            Everything you need to know before buying property in Bhiwadi
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

// ── Bhiwadi Category Strip ─────────────────────────────────────────────────────
export function LuxuryHighlightsStrip() {
  const highlights = [
    { icon: '🏗️', label: 'New Launch Bhiwadi', sub: 'From ₹28 Lakh', href: '/new-launch-bhiwadi' },
    { icon: '🛣️', label: 'Alwar Bypass Projects', sub: 'Most Popular', href: '/alwar-bypass-road-projects' },
    { icon: '🚗', label: 'NH-48 Highway Zone', sub: 'Best ROI', href: '/nh-48-bhiwadi-projects' },
    { icon: '🏭', label: 'Tapukara / Honda Zone', sub: 'Top Rental Yield', href: '/tapukara-bhiwadi-projects' },
    { icon: '🇯🇵', label: 'Neemrana Japanese Zone', sub: 'Expat Housing', href: '/neemrana-bhiwadi-projects' },
    { icon: '🔑', label: 'Ready To Move Bhiwadi', sub: 'Immediate Possession', href: '/ready-to-move-bhiwadi' },
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

// ── Bhiwadi Market Intelligence Section ───────────────────────────────────────
export function MarketIntelligenceSection() {
  const corridors = [
    {
      name: 'Alwar Bypass Road',
      href: '/alwar-bypass-road-projects',
      priceRange: '₹3,200–5,800/sqft',
      appreciation: '28–40%',
      rentalYield: '4.5–6%',
      hotSectors: 'Sectors 2–8, Bhiwadi',
      bestFor: 'Families & End-Use',
      tag: '🔥 Most Popular',
      tagColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      name: 'NH-48 Highway',
      href: '/nh-48-bhiwadi-projects',
      priceRange: '₹3,800–6,500/sqft',
      appreciation: '30–45%',
      rentalYield: '5–6.5%',
      hotSectors: 'Bhiwadi–Neemrana stretch',
      bestFor: 'Investment + NRI',
      tag: '📈 Best ROI',
      tagColor: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      name: 'Tapukara (Honda Zone)',
      href: '/tapukara-bhiwadi-projects',
      priceRange: '₹2,800–4,500/sqft',
      appreciation: '20–32%',
      rentalYield: '5.5–7%',
      hotSectors: 'Near Honda Plant, Tapukara',
      bestFor: 'Rental Income',
      tag: '🏭 Highest Yield',
      tagColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    {
      name: 'Neemrana Japanese Zone',
      href: '/neemrana-bhiwadi-projects',
      priceRange: '₹4,200–7,000/sqft',
      appreciation: '25–38%',
      rentalYield: '4–5.5%',
      hotSectors: 'Neemrana RIICO, NH-48',
      bestFor: 'Expat Housing & NRI',
      tag: '🇯🇵 Japanese Zone',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const dataPoints = [
    { label: 'Avg 3-Year Appreciation', value: '28%', sub: 'Across Bhiwadi corridors', icon: '📈' },
    { label: 'New Launches 2025', value: '25+', sub: 'RERA-registered projects', icon: '🏗️' },
    { label: 'From Delhi via NH-48', value: '55 km', sub: '~60 min drive', icon: '🛣️' },
    { label: 'Industrial Units', value: '5,000+', sub: 'RIICO area, Bhiwadi', icon: '🏭' },
    { label: 'Active Builders', value: '15+', sub: 'Verified in Bhiwadi 2025', icon: '🏢' },
    { label: 'RERA Registered', value: '100%', sub: 'All listed projects verified', icon: '✅' },
  ];

  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-brand-accent/20 text-brand-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            📊 Bhiwadi Property Market Report 2025
          </span>
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Live Market Intelligence — Corridor-by-Corridor Breakdown
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto">
            Data-backed pricing, appreciation trends and rental yields across Bhiwadi's top investment corridors — updated quarterly by our research team.
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
            Our 2025 Investment View — Where Smart Money in Bhiwadi Is Going
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            Alwar Bypass Road remains Bhiwadi's most popular corridor for end-users — with RIICO infrastructure, social amenities and the Bhiwadi bypass expressway driving consistent demand.
            Sectors 2–8 on Alwar Bypass are our top pick for capital preservation with family-oriented living.
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            For investors seeking the highest rental yield, Tapukara (Honda Zone) is unmatched — 5.5–7% annual yield from industrial professionals.
            The Neemrana Japanese Zone is our dark horse — 50+ Japanese MNCs driving expat housing demand with premium rents. NH-48 corridor is the best bet for long-term capital appreciation as the Delhi-Jaipur highway sees continued infrastructure investment.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/blog/property-investment-in-bhiwadi-guide" className="text-brand-accent text-sm font-semibold hover:underline">
              Read Full Investment Guide →
            </Link>
            <Link href="/blog/nh-48-bhiwadi-investment-guide" className="text-brand-accent text-sm font-semibold hover:underline">
              NH-48 Corridor Deep Dive →
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
      href: '/blog/property-investment-in-bhiwadi-guide',
      title: 'Property Investment in Bhiwadi — Complete 2025 Guide',
      excerpt: 'Corridor-by-corridor breakdown of where smart money is going in Bhiwadi — Alwar Bypass, NH-48, Tapukara and Neemrana ranked.',
      category: 'Investment Guide',
      icon: '📊',
    },
    {
      href: '/blog/nh-48-bhiwadi-investment-guide',
      title: 'NH-48 Bhiwadi Investment Guide 2025',
      excerpt: 'Why NH-48 outperforms every Bhiwadi corridor — Delhi-Jaipur highway proximity, industrial demand and sector-wise prices.',
      category: 'Investment Guide',
      icon: '🛣️',
    },
    {
      href: '/blog/best-builders-in-bhiwadi',
      title: 'Best Builders in Bhiwadi — Ranked by Delivery & Trust',
      excerpt: 'Honest ranking of top Bhiwadi builders — Omaxe, Ashiana, GLS, Avalon, BPTP — by delivery record, quality and resale value.',
      category: 'Builder Guide',
      icon: '🏗️',
    },
    {
      href: '/blog/how-to-check-rera-before-buying-property',
      title: 'How to Check RERA Before Buying a Property in Bhiwadi',
      excerpt: 'Step-by-step guide to verify any Bhiwadi project on rrerarajasthan.in — protect yourself from fraud.',
      category: 'Legal & RERA',
      icon: '✅',
    },
    {
      href: '/blog/new-launch-vs-ready-to-move-property',
      title: 'New Launch vs Ready to Move in Bhiwadi — What to Buy?',
      excerpt: 'Detailed comparison of under-construction vs RTM properties in Bhiwadi — ROI, risks and our recommendation.',
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
            Bhiwadi Real Estate Investment Guides
          </h2>
          <p className="text-brand-muted text-base max-w-2xl mx-auto">
            Expert guides written by RERA-registered advisors — everything you need to make the right property decision in Bhiwadi.
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
            className="group bg-gradient-to-br from-brand-dark to-brand-deep rounded-2xl border border-white/10 p-5 flex flex-col justify-center items-center text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-4xl mb-3">📖</span>
            <h3 className="font-display font-bold text-white text-base mb-2">All Investment Guides</h3>
            <p className="text-white/60 text-sm">Read all Bhiwadi real estate guides and market updates →</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Bhiwadi Real Estate Guide ──────────────────────────────────────────────────
export function BhiwadiRealEstateGuide() {
  return (
    <section className="py-16 bg-white border-t border-brand-border/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-brand-border/40 uppercase tracking-widest">
            Complete Buyer's Guide
          </span>
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">
            Bhiwadi Real Estate 2025 — Area-by-Area Investment Guide
          </h2>
          <p className="text-brand-muted text-base max-w-2xl mx-auto">
            Bhiwadi (Rajasthan) is one of India's fastest-growing industrial and residential markets. From affordable apartments near Honda's Tapukara plant to high-ROI plots on NH-48 — here's everything you need to make the right investment decision.
          </p>
        </div>

        <div className="space-y-10 text-brand-text leading-relaxed">

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">01.</span> Alwar Bypass Road — Bhiwadi's Most Popular Residential Corridor
            </h3>
            <p className="mb-3">
              Alwar Bypass Road (Sectors 2–8, Bhiwadi) is the most in-demand residential corridor in Bhiwadi. With direct RIICO connectivity, social infrastructure (schools, hospitals, markets), and easy access to the Delhi-Jaipur highway, this corridor commands ₹3,200–₹5,800 per sq ft. Projects here include Omaxe Green Meadow, Avalon Sports City and Hero Homes.
            </p>
            <p className="mb-3">
              Properties on Alwar Bypass have delivered 28–40% appreciation over the past 3 years. The corridor is ideal for families and end-users who want proximity to industrial employers while maintaining a residential lifestyle.
            </p>
            <p>
              <strong>Best suited for:</strong> Salaried professionals, industrial workers, families relocating to Bhiwadi.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">02.</span> NH-48 Highway Corridor — Highest ROI in Bhiwadi
            </h3>
            <p className="mb-3">
              NH-48 (Delhi-Jaipur National Highway) is the primary investment corridor in Bhiwadi. With direct highway access to Delhi (55 km), Jaipur (150 km) and Gurgaon (35 km), this corridor attracts both investors and corporations. Property values have risen 30–45% since 2022.
            </p>
            <p className="mb-3">
              Projects by Ashiana Housing, BPTP, Supertech and Adani Wilton Park are actively under construction along NH-48. The typical buyer gets 2–3 BHK apartments in the ₹38L–₹1.2 Cr range — strong value for the long-term growth story.
            </p>
            <p>
              <strong>Best suited for:</strong> Investors, NRIs, first-time buyers looking for a 5–7 year appreciation play.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">03.</span> Tapukara — Honda Zone with Highest Rental Yield
            </h3>
            <p className="mb-3">
              Tapukara houses the Honda Motorcycle & Scooter India (HMSI) plant — one of India's largest two-wheeler manufacturing facilities. This generates constant housing demand from 15,000+ plant employees and contractors, driving Tapukara's rental yield to 5.5–7% — the highest in the Bhiwadi region.
            </p>
            <p>
              Properties here are priced at ₹2,800–₹4,500 per sq ft with high occupancy (95%+). GLS Bhiwadi Residency and Eldeco Bhiwadi Greens are the top projects in this zone. Ideal for rental income-focused buyers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">04.</span> Neemrana Japanese Zone — Premium Expat Housing Market
            </h3>
            <p className="mb-3">
              Neemrana, 25 km from Bhiwadi on NH-48, is home to India's largest Japanese Industrial Township with 50+ Japanese MNCs including Honda, Denso, Mitsubishi, Suzuki and Toray. Japanese and Korean expats living here create premium housing demand with rents 30–50% above Bhiwadi average.
            </p>
            <p>
              BPTP Astaire Gardens and RIICO Industrial Plots in Neemrana are the top investment choices. Properties are priced at ₹4,200–₹7,000 per sq ft with rental yields of 4–5.5%.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">05.</span> Khushkhera RIICO Belt — Industrial Heartland
            </h3>
            <p className="mb-3">
              Khushkhera is Bhiwadi's original RIICO industrial zone with 1,500+ industrial units. Companies like Gillette, Bosch, Havells and Asian Paints have factories here, ensuring year-round rental demand from blue-collar and managerial employees.
            </p>
            <p>
              Eldeco Bhiwadi Greens and Greenfield Residency are the most popular projects here. Entry prices start from ₹28L — ideal for first-time homebuyers and PMAY-eligible buyers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-3 flex items-center gap-2">
              <span className="text-brand-accent">06.</span> Bhiwadi Extension — Most Affordable Entry Zone
            </h3>
            <p className="mb-3">
              Bhiwadi Extension is the upcoming residential zone beyond the core Bhiwadi municipal area. Prices here are 20–30% below Alwar Bypass rates, making it the best entry-level option for first-time buyers. As infrastructure extends into this area, long-term appreciation potential is high.
            </p>
            <p>
              Ratan Pearl Residency is the flagship project in this zone. 1 BHK apartments start from ₹28L — PMAY subsidy eligible for qualifying buyers.
            </p>
          </div>

          <div className="bg-brand-mint/40 border border-brand-border/40 rounded-2xl p-6">
            <h3 className="text-lg font-display font-bold text-brand-dark mb-3">
              Key Things to Verify Before Buying Any Project in Bhiwadi
            </h3>
            <ul className="space-y-2 text-brand-muted text-sm">
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">RERA Registration:</strong> Check rrerarajasthan.in for valid RERA number — Bhiwadi projects fall under Rajasthan RERA, not Haryana RERA.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Builder Track Record:</strong> Verify previous project delivery — Ashiana, Omaxe and Eldeco have the best delivery records in Bhiwadi.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">RIICO Approval:</strong> For industrial plots, check RIICO allotment documents — only RIICO-allotted plots have clear legal title.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">Carpet Area vs Super Built-Up:</strong> Super built-up is 15–25% more than carpet area — always compare on carpet area basis.</span></li>
              <li className="flex gap-2"><span className="text-brand-accent font-bold flex-shrink-0">✓</span><span><strong className="text-brand-text">PMAY Eligibility:</strong> First-time buyers with income under ₹12L are eligible for PMAY subsidy of ₹2.67L on home loans in Bhiwadi.</span></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Internal Links Block — Bhiwadi SEO pages ──────────────────────────────────
export function InternalLinksBlock({ currentPage }: { currentPage?: string }) {
  const allLinks = [
    { label: 'Residential Property in Bhiwadi', href: '/residential-property-in-bhiwadi' },
    { label: 'New Launch Projects Bhiwadi', href: '/new-launch-bhiwadi' },
    { label: 'Alwar Bypass Road Projects', href: '/alwar-bypass-road-projects' },
    { label: 'NH-48 Bhiwadi Projects', href: '/nh-48-bhiwadi-projects' },
    { label: 'Tapukara Bhiwadi Projects', href: '/tapukara-bhiwadi-projects' },
    { label: 'Neemrana Projects', href: '/neemrana-bhiwadi-projects' },
    { label: 'Khushkhera RIICO Projects', href: '/khushkhera-bhiwadi-projects' },
    { label: 'Bhiwadi Extension Projects', href: '/bhiwadi-extension-projects' },
    { label: 'Ready To Move Bhiwadi', href: '/ready-to-move-bhiwadi' },
    { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
    { label: 'Flats in Bhiwadi', href: '/flats-in-bhiwadi' },
    { label: '2 BHK Flats Bhiwadi', href: '/2-bhk-flats-bhiwadi' },
    { label: '3 BHK Flats Bhiwadi', href: '/3-bhk-flats-bhiwadi' },
    { label: 'Flats Under 30 Lakh Bhiwadi', href: '/flats-under-30-lakh-bhiwadi' },
    { label: 'Industrial Plots Bhiwadi', href: '/industrial-plots-bhiwadi' },
    { label: 'Bhiwadi Real Estate Blog', href: '/blog' },
    { label: 'Property Investment Guide', href: '/blog/property-investment-in-bhiwadi-guide' },
    { label: 'Best Builders in Bhiwadi', href: '/blog/best-builders-in-bhiwadi' },
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

// ── DynamicCorridorsSection — shows only custom corridors added from admin ──
const DEFAULT_CORRIDOR_SLUGS = new Set([
  'alwar-bypass-road', 'nh-48', 'tapukara', 'neemrana', 'khushkhera', 'bhiwadi-extension',
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
          <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            New Corridors
          </span>
          <h2 className="text-2xl font-bold text-slate-900">More Bhiwadi Corridors</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl mx-auto">Explore projects across newly added Bhiwadi corridors</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c: any) => (
            <Link key={c.slug} href={c.href}
              className="group flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-brand-mint/30 hover:border-brand-accent/30 transition-all">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">
                {c.icon || '🛣️'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 group-hover:text-brand-dark transition-colors">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">View Projects →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
