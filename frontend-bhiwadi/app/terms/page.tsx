import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchSettings } from '@/lib/settings';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  return {
    title: `Terms of Service | ${settings.siteName}`,
    description: `Terms of Service for ${settings.siteName}. Understand the terms governing use of our Bhiwadi real estate advisory platform.`,
    alternates: { canonical: `${siteUrl}/terms` },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Terms of Service</span>
        </div>
      </nav>

      <section className="hero-gradient py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/70">Last Updated: January 2025</p>
        </div>
      </section>

      <article className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-headings:font-display prose-headings:text-brand-text prose-p:text-brand-muted prose-li:text-brand-muted">

          <div className="bg-brand-mint/30 border border-brand-border/40 rounded-2xl p-5 mb-8 not-prose">
            <p className="text-brand-dark font-semibold text-sm mb-1">Key Points</p>
            <p className="text-brand-muted text-sm">By using {settings.siteName}, you agree to receive advisory services and communications from our team. Our platform is free for buyers. Property information is indicative and must be verified with the developer before any investment decision.</p>
          </div>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using {settings.siteName} (the "Platform", accessible at {siteUrl}), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform.</p>

          <h2>2. Our Services</h2>
          <p>{settings.siteName} provides:</p>
          <ul>
            <li>An online platform to discover new launch and residential property projects in Bhiwadi</li>
            <li>Free advisory services connecting property buyers with expert advisors</li>
            <li>Project information, pricing, and availability sourced from verified developers</li>
            <li>Site visit scheduling and coordination</li>
            <li>Investment guidance and market analysis</li>
          </ul>
          <p>Our services are <strong>completely free for buyers</strong>. We earn referral fees from developers only after a successful transaction — with full transparency.</p>

          <h2>3. Information Accuracy</h2>
          <p>While we strive to provide accurate and up-to-date information, all property details on this Platform (including prices, configurations, possession dates, RERA numbers, and availability) are:</p>
          <ul>
            <li>Sourced from developers and subject to change without notice</li>
            <li>Indicative and not a binding offer or commitment</li>
            <li>To be independently verified by you directly with the developer before any booking or financial commitment</li>
          </ul>
          <p>{settings.siteName} makes no warranty, express or implied, regarding the accuracy, completeness, or suitability of any property information on this Platform.</p>

          <h2>4. User Obligations</h2>
          <p>When using our Platform, you agree to:</p>
          <ul>
            <li>Provide accurate contact information when submitting enquiries</li>
            <li>Use the Platform only for lawful purposes related to property research and advisory</li>
            <li>Not submit false or misleading enquiries</li>
            <li>Not attempt to reverse-engineer, scrape, or copy Platform content for commercial use</li>
            <li>Verify all property details with the developer or on rrerarajasthan.in before making any financial commitment</li>
          </ul>

          <h2>5. Communications</h2>
          <p>By submitting a contact form or enquiry on our Platform, you expressly consent to:</p>
          <ul>
            <li>Receive calls, SMS, and WhatsApp messages from our advisors regarding your property requirements</li>
            <li>Receive property recommendations and market updates from {settings.siteName}</li>
            <li>Be contacted by the specific developer(s) for projects you enquired about</li>
          </ul>
          <p>You may opt out of communications at any time by contacting us at {settings.email} or replying "STOP" to any WhatsApp/SMS message.</p>

          <h2>6. Intellectual Property</h2>
          <p>All content on this Platform — including text, images, project descriptions, blog articles, and design — is the property of {settings.siteName} or licensed for use on this Platform. You may not reproduce, distribute, or commercially exploit any content without our prior written consent.</p>

          <h2>7. Third-Party Links & Developer Websites</h2>
          <p>This Platform may contain links to developer websites or third-party resources. {settings.siteName} is not responsible for the content, accuracy, or practices of such third-party sites. Linking does not imply endorsement.</p>

          <h2>8. Limitation of Liability</h2>
          <p>{settings.siteName} shall not be liable for:</p>
          <ul>
            <li>Any loss arising from reliance on property information without independent verification</li>
            <li>Developer delays, cancellations, or changes to project specifications</li>
            <li>Any investment decisions made based on information provided on this Platform</li>
            <li>Indirect, consequential, or incidental damages arising from use of this Platform</li>
          </ul>
          <p>Our maximum liability to you for any claim shall not exceed the amount, if any, paid by you to {settings.siteName} for services (which in most cases is nil, as our service is free to buyers).</p>

          <h2>9. Governing Law</h2>
          <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bhiwadi, Rajasthan.</p>

          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.</p>

          <h2>11. Contact</h2>
          <p>For any questions about these Terms:</p>
          <ul>
            <li>Email: <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a></li>
            <li>Phone: {settings.phone}</li>
            <li>Address: {settings.address || 'Bhiwadi, Rajasthan 301019'}</li>
          </ul>

          <div className="not-prose mt-10 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="btn-outline text-sm">Privacy Policy</Link>
            <Link href="/disclaimer" className="btn-outline text-sm">Disclaimer</Link>
            <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </article>
    </>
  );
}
