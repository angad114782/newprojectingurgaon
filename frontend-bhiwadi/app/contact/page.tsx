import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchSettings } from '@/lib/settings';
import LeadForm from '@/components/home/LeadForm';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  const title = `Contact Us | ${settings.siteName} — Bhiwadi Property Advisory`;
  const description = `Contact ${settings.siteName} for expert Bhiwadi property advice. Phone: ${settings.phone}. Email: ${settings.email}. Office: ${settings.address}. Free consultation, RERA verified.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/contact` },
    openGraph: {
      type: 'website', title, description, url: `${siteUrl}/contact`, siteName: settings.siteName,
      images: [{ url: settings.ogImage?.startsWith('http') ? settings.ogImage : `${siteUrl}/og-home.jpg`, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';

  const settings = await fetchSettings();
  const ci = (settings as any).companyInfo || {};
  const waLink = `https://wa.me/${settings.whatsapp}?text=Hi, I am looking for property in Bhiwadi and would like free advisory`;

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteUrl}/contact`,
    name: `Contact ${settings.siteName}`,
    url: `${siteUrl}/contact`,
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    description: `Contact page for ${settings.siteName} — Bhiwadi's trusted real estate advisory.`,
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: settings.siteName,
    url: siteUrl,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress || 'RIICO Industrial Area',
      addressLocality: 'Bhiwadi',
      addressRegion: 'Rajasthan',
      postalCode: settings.postalCode || '301019',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.geoLat || '28.2069',
      longitude: settings.geoLng || '76.8514',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' },
    ],
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${siteUrl}/contact` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Contact Us</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Free Advisory · 2-Hour Response
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Get in Touch With Our Expert Advisors</h1>
          <p className="text-white/70 text-lg">Zero brokerage. RERA verified. We respond within 2 hours on all enquiries.</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left — Contact info */}
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-text mb-6">Our Office</h2>
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4 bg-brand-mint/20 rounded-2xl p-5 border border-brand-border/40">
                  <span className="text-2xl mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold text-brand-text text-sm mb-1">Office Address</p>
                    <p className="text-brand-muted text-sm">{settings.address || 'RIICO Industrial Area, Bhiwadi, Rajasthan 301019'}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 bg-brand-mint/20 rounded-2xl p-5 border border-brand-border/40">
                  <span className="text-2xl mt-0.5">📞</span>
                  <div>
                    <p className="font-semibold text-brand-text text-sm mb-1">Phone / WhatsApp</p>
                    <a href={`tel:${settings.phone?.replace(/[^+\d]/g, '')}`} className="text-brand-dark font-semibold hover:text-brand-accent transition-colors">{settings.phone}</a>
                    <p className="text-brand-muted text-xs mt-1">Available {settings.openingHours || 'Mon–Sun: 9 AM – 8 PM'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 bg-brand-mint/20 rounded-2xl p-5 border border-brand-border/40">
                  <span className="text-2xl mt-0.5">✉️</span>
                  <div>
                    <p className="font-semibold text-brand-text text-sm mb-1">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-brand-dark font-semibold hover:text-brand-accent transition-colors">{settings.email}</a>
                    <p className="text-brand-muted text-xs mt-1">We respond within 2 hours</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 bg-brand-mint/20 rounded-2xl p-5 border border-brand-border/40">
                  <span className="text-2xl mt-0.5">🕐</span>
                  <div>
                    <p className="font-semibold text-brand-text text-sm mb-1">Office Hours</p>
                    <p className="text-brand-muted text-sm">{settings.openingHours || 'Monday – Saturday: 9:00 AM – 8:00 PM'}</p>
                    <p className="text-brand-muted text-sm">Sunday: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
                    💬 WhatsApp Now
                  </a>
                  <a href={`tel:${settings.phone?.replace(/[^+\d]/g, '')}`}
                    className="flex items-center justify-center gap-2 bg-brand-dark text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-accent hover:text-brand-dark transition-colors">
                    📞 Call Us
                  </a>
                </div>

                {/* Map */}
                {ci.mapEmbedUrl && (
                  <div className="rounded-2xl overflow-hidden border border-brand-border/40 h-52">
                    <iframe
                      src={ci.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${settings.siteName} Office Location`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right — Lead Form */}
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-text mb-2">Send Us a Message</h2>
              <p className="text-brand-muted text-sm mb-6">Fill in your details and a certified advisor will contact you within 2 hours.</p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust footer block */}
      <section className="py-10 bg-brand-mint/20 border-t border-brand-border/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-brand-text font-semibold mb-3">Why Buyers Trust {settings.siteName}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-muted">
            {['✅ RERA Verified Projects', '💯 Zero Brokerage', '🎓 Certified Advisors', '⚡ 2-Hour Response', '🔒 Data Privacy'].map((t) => (
              <span key={t} className="bg-white border border-brand-border/40 px-4 py-2 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
