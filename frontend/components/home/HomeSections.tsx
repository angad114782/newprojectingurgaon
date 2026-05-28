import Link from 'next/link';
import LeadCTA from '@/components/lead/LeadCTA';
import Image from 'next/image';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { fetchSettings } from '@/lib/settings';

// ── Locations Grid ─────────────────────────────────────────────────────────────
export async function LocationsSection() {
  const settings = await fetchSettings();
  const locations = settings.locations ?? [];
  const phone = settings.phone || '+91-9999999999';

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
  const phone = settings.phone || '+91-9999999999';

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
  const phone = settings.phone || '+91-9999999999';

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
  const phone = settings.phone || '+91-9999999999';

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

// ── Internal Links Block — important for SEO / AIO / GEO ──────────────────────
export function InternalLinksBlock({ currentPage }: { currentPage?: string }) {
  const allLinks = [
    { label: 'Luxury Property in Gurgaon', href: '/new-projects-in-gurgaon' },
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
    { label: 'Gurgaon Real Estate Blog', href: '/blog' },
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
