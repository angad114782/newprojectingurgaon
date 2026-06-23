import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSettings } from '@/lib/settings';
import { fetchAuthors } from '@/lib/api-authors';
import LeadCTA from '@/components/lead/LeadCTA';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  const title = `About Us | ${settings.siteName} — Bhiwadi's Most Trusted Real Estate Advisory`;
  const description = `Learn about ${settings.siteName} — founded in ${settings.companyInfo?.foundingYear || '2019'}, ${settings.marketStats?.familiesHelped || '2,800+'} families helped, RERA verified advisory. Meet our expert team of certified property advisors in Bhiwadi.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/about` },
    openGraph: {
      type: 'website', title, description, url: `${siteUrl}/about`, siteName: settings.siteName,
      images: [{ url: settings.ogImage?.startsWith('http') ? settings.ogImage : `${siteUrl}/og-home.jpg`, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';

  const [settings, authors] = await Promise.all([fetchSettings(), fetchAuthors()]);

  const ci = (settings as any).companyInfo || {};
  const stats = settings.marketStats || {};

  const aboutTitle = ci.aboutTitle || `${settings.siteName} — Bhiwadi's Most Trusted Real Estate Advisory`;
  const aboutContent = ci.aboutContent || `${settings.siteName} is Bhiwadi's leading independent real estate advisory, helping home buyers and investors make confident property decisions since ${ci.foundingYear || '2019'}. We specialise in new launch, pre-launch, and residential projects across all major corridors — Alwar Bypass Road, NH-48, Tapukara, Neemrana, Khushkhera and Bhiwadi Extension.`;
  const mission = ci.missionStatement || `Our mission is to make luxury real estate accessible, transparent, and stress-free for every buyer. We earn only from verified builders — never from you. Zero brokerage, zero hidden charges.`;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: settings.siteName,
    url: siteUrl,
    foundingDate: ci.foundingYear || '2019',
    telephone: [settings.phone, settings.phone2].filter(Boolean),
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress || 'RIICO Industrial Area',
      addressLocality: 'Bhiwadi',
      addressRegion: 'Rajasthan',
      postalCode: settings.postalCode || '301019',
      addressCountry: 'IN',
    },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: ci.teamSize || '15' },
    description: aboutContent,
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl}/about`,
    name: aboutTitle,
    url: `${siteUrl}/about`,
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    description: aboutContent,
  };

  const teamSchema = authors.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${settings.siteName} — Expert Property Advisors`,
    itemListElement: authors.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: a.name,
        jobTitle: a.designation,
        description: a.bio || a.credentials,
        image: a.photo || undefined,
        worksFor: { '@id': `${siteUrl}/#organization` },
        ...(a.credentials ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: a.credentials } } : {}),
        ...(a.socialLinkedIn ? { sameAs: [a.socialLinkedIn] } : {}),
      },
    })),
  } : null;

  const awards: any[] = ci.awards || [];
  const certifications: any[] = ci.certifications || [];
  const mediaLinks: any[] = ci.mediaLinks || [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      {teamSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />}

      {/* Breadcrumb */}
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">About Us</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Est. {ci.foundingYear || '2019'} · Bhiwadi, Rajasthan
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-5">
            {aboutTitle}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">{mission}</p>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-brand-accent py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: stats.familiesHelped || '4,200+', l: 'Families Helped' },
              { v: stats.totalProjects || '150+', l: 'Verified Projects' },
              { v: stats.topBuilders || '50+', l: 'Builder Partners' },
              { v: `${ci.foundingYear ? new Date().getFullYear() - parseInt(ci.foundingYear) : 5}+`, l: 'Years of Trust' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-display font-bold text-brand-dark">{s.v}</div>
                <div className="text-brand-dark/70 text-sm mt-1 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className={`grid gap-12 items-center ${ci.officeImage ? 'lg:grid-cols-2' : ''}`}>
            <div>
              <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Who We Are</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-text mb-5">
                India's Most Transparent Property Advisory
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>{aboutContent}</p>
                <p>We maintain relationships with every major Bhiwadi builder — Omaxe, Ashiana, GLS, Avalon, Supertech, Eldeco, BPTP, Adani, Hero Homes, Ratan Group — ensuring our clients get verified pricing, exclusive pre-launch access, and the most accurate project information available.</p>
                <p>Our advisory model is simple: <strong className="text-brand-text">100% free for buyers.</strong> We earn from builder partnerships, never from you. This means our advice is always in your interest.</p>
              </div>
            </div>
            {ci.officeImage && (
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image src={ci.officeImage} alt={`${settings.siteName} Office`} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 bg-brand-mint/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Why Trust Us</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-text">Built on Experience, Expertise & Transparency</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏛️', title: 'RERA Registered', desc: `We only list RERA-verified projects. Every project on ${settings.siteName} is verified on rrerarajasthan.in before listing.` },
              { icon: '🎓', title: 'Certified Advisors', desc: 'Our team holds Rajasthan RERA agent registrations, CREDAI memberships, and professional property advisory certifications.' },
              { icon: '💯', title: 'Zero Brokerage', desc: 'Buyers pay nothing. No consultation fees, no site visit charges, no hidden brokerage. Our service is completely free for buyers.' },
              { icon: '📊', title: 'Data-Driven Advice', desc: 'We track real-time pricing, possession timelines, and builder track records so you make decisions based on facts, not marketing.' },
              { icon: '⚡', title: '2-Hour Response', desc: 'Every enquiry gets a response within 2 hours from a dedicated advisor who knows the project and micro-market you\'re interested in.' },
              { icon: '🔒', title: 'Your Privacy Protected', desc: 'Your contact details are never shared with multiple builders without your consent. See our Privacy Policy for full details.' },
            ].map((t) => (
              <div key={t.title} className="bg-white rounded-2xl p-6 border border-brand-border/40 shadow-sm">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-display font-semibold text-brand-text mb-2">{t.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {authors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Meet the Team</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-text">Expert Advisors — Real Experience, Real Results</h2>
              <p className="text-brand-muted mt-3 max-w-2xl mx-auto">Every advisor on our team has hands-on experience in Bhiwadi's real estate market, with verified Rajasthan RERA credentials and a track record of successful transactions.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.map((author) => (
                <div key={author.slug} className="bg-white rounded-2xl border border-brand-border/40 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="hero-gradient p-6 text-center">
                    {author.photo ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white/30">
                        <Image src={author.photo} alt={author.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-brand-accent/20 border-4 border-white/30 flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-display font-bold text-brand-accent">{author.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <h3 className="font-display font-bold text-white text-lg">{author.name}</h3>
                    <p className="text-white/70 text-sm">{author.designation}</p>
                    {author.experience && <p className="text-brand-accent text-xs font-semibold mt-1">{author.experience}</p>}
                  </div>
                  <div className="p-5">
                    {author.bio && <p className="text-brand-muted text-sm mb-3 leading-relaxed">{author.bio}</p>}
                    {author.credentials && (
                      <div className="bg-brand-mint/30 rounded-xl px-3 py-2 mb-3">
                        <p className="text-brand-dark text-xs font-semibold">Credentials</p>
                        <p className="text-brand-muted text-xs mt-0.5">{author.credentials}</p>
                      </div>
                    )}
                    {author.specializations && author.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {author.specializations.map((s) => (
                          <span key={s} className="text-xs bg-brand-mint text-brand-dark px-2.5 py-1 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                    {(author.socialLinkedIn || author.email) && (
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-border/40">
                        {author.socialLinkedIn && (
                          <a href={author.socialLinkedIn} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-dark text-xs font-medium transition-colors">LinkedIn →</a>
                        )}
                        {author.email && (
                          <a href={`mailto:${author.email}`} className="text-brand-muted hover:text-brand-dark text-xs font-medium transition-colors ml-auto">Email →</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards & Recognition */}
      {awards.length > 0 && (
        <section className="py-14 bg-brand-dark text-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block bg-brand-accent/20 text-brand-accent text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Recognition</span>
              <h2 className="text-2xl font-display font-bold">Awards & Achievements</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {awards.map((award: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-brand-accent text-2xl mb-2">🏆</div>
                  <h3 className="font-semibold text-white text-sm">{award.title}</h3>
                  {award.issuer && <p className="text-white/60 text-xs mt-1">{award.issuer}</p>}
                  {award.year && <p className="text-brand-accent text-xs font-semibold mt-1">{award.year}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Credentials</span>
              <h2 className="text-2xl font-display font-bold text-brand-text">Certifications & Memberships</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map((cert: any, i: number) => (
                <div key={i} className="bg-brand-mint/20 border border-brand-border/40 rounded-2xl p-5">
                  <div className="text-2xl mb-2">📜</div>
                  <h3 className="font-semibold text-brand-text text-sm">{cert.name}</h3>
                  {cert.issuer && <p className="text-brand-muted text-xs mt-1">{cert.issuer}</p>}
                  {cert.id && <p className="text-brand-dark text-xs font-mono mt-1">ID: {cert.id}</p>}
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer"
                      className="text-brand-accent text-xs font-semibold mt-2 block hover:underline">
                      Verify →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media Mentions */}
      {mediaLinks.length > 0 && (
        <section className="py-14 bg-brand-mint/20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block bg-brand-mint text-brand-dark text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">In the News</span>
              <h2 className="text-2xl font-display font-bold text-brand-text">Media Coverage</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mediaLinks.map((item: any, i: number) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-brand-border/40 rounded-2xl p-5 hover:shadow-md transition-shadow group">
                  <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-2">{item.outlet}</p>
                  <h3 className="font-semibold text-brand-text text-sm group-hover:text-brand-accent transition-colors leading-snug">{item.title}</h3>
                  {item.date && <p className="text-brand-muted text-xs mt-2">{item.date}</p>}
                  <p className="text-brand-accent text-xs font-semibold mt-2">Read Article →</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RERA & Compliance */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-brand-dark rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-brand-accent/20 text-brand-accent text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Regulatory Compliance</span>
                <h2 className="text-2xl font-display font-bold mb-4">RERA Verified & Fully Compliant</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  {settings.siteName} operates in full compliance with the Real Estate (Regulation and Development) Act, 2016 (RERA). All property listings on our platform are verified on Rajasthan RERA before being published.
                </p>
                {settings.reraNumber && (
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <p className="text-white/60 text-xs">Our RERA Registration</p>
                    <a href={settings.reraLink || 'https://rrerarajasthan.in'} target="_blank" rel="noopener noreferrer"
                      className="text-brand-accent font-mono text-sm font-semibold hover:underline">
                      {settings.reraNumber}
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { icon: '✅', title: 'All Projects RERA Verified', desc: 'Every listing cross-checked on rrerarajasthan.in' },
                  { icon: '🔍', title: 'Transparent Pricing', desc: 'We display actual developer pricing — no markup' },
                  { icon: '📋', title: 'Accurate Information', desc: 'Project details sourced directly from developers' },
                  { icon: '🔒', title: 'Data Protection', desc: 'Your information stored securely per Indian IT Act' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-white/60 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-brand-mint/20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-bold text-brand-text mb-3">Ready to Find Your Perfect Property?</h2>
          <p className="text-brand-muted mb-6">Talk to a certified advisor — free consultation, zero brokerage, 2-hour response.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LeadCTA ctaType="site_visit_request" className="btn-primary px-8 py-3 text-base">Book Free Site Visit</LeadCTA>
            <Link href="/contact" className="btn-outline px-8 py-3 text-base">Contact Us →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
