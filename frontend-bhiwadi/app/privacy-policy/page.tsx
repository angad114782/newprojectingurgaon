import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchSettings } from '@/lib/settings';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  return {
    title: `Privacy Policy | ${settings.siteName}`,
    description: `Privacy Policy for ${settings.siteName}. Learn how we collect, use, and protect your personal information when you use our Bhiwadi real estate advisory services.`,
    alternates: { canonical: `${siteUrl}/privacy-policy` },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPolicyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  const lastUpdated = 'January 2025';

  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Privacy Policy</span>
        </div>
      </nav>

      <section className="hero-gradient py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      <article className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-headings:font-display prose-headings:text-brand-text prose-p:text-brand-muted prose-li:text-brand-muted">

          <div className="bg-brand-mint/30 border border-brand-border/40 rounded-2xl p-5 mb-8 not-prose">
            <p className="text-brand-dark font-semibold text-sm mb-1">Summary</p>
            <p className="text-brand-muted text-sm">We collect only the information you provide (name, phone, email) to connect you with verified property advisors. We never sell your data. You can request deletion at any time.</p>
          </div>

          <h2>1. Who We Are</h2>
          <p>{settings.siteName} ("{settings.siteName}", "we", "us", "our") is a real estate advisory platform based in Bhiwadi, Rajasthan, India. We help property buyers find verified new launch and luxury residential projects in Bhiwadi. Our registered office is at {settings.address || 'Bhiwadi, Rajasthan 301019'}.</p>
          <p>Contact us at: <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a> or {settings.phone}</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information you voluntarily provide when you:</p>
          <ul>
            <li><strong>Submit a lead form:</strong> Name, mobile number, email address (optional), budget, preferred location, buyer type</li>
            <li><strong>Verify via OTP:</strong> Your mobile number for identity verification</li>
            <li><strong>Contact us directly:</strong> Any information you share via phone, WhatsApp, or email</li>
          </ul>
          <p>We also automatically collect: IP address, browser type, pages visited, time spent on site, and referring website (via Google Analytics 4, if enabled). This data is aggregated and non-personally identifiable.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Connect you with a certified property advisor</li>
            <li>Share project details, pricing, and availability relevant to your requirements</li>
            <li>Schedule site visits at your convenience</li>
            <li>Send you OTP for identity verification</li>
            <li>Send WhatsApp/SMS updates about projects you enquired about (with your consent)</li>
            <li>Improve our services through aggregated analytics</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>We share your information with:</p>
          <ul>
            <li><strong>Verified builder/developer:</strong> Only for the specific project you enquired about, and only with your implicit consent when you submit the enquiry form</li>
            <li><strong>Our advisory team:</strong> Advisors who handle your enquiry</li>
            <li><strong>Service providers:</strong> WhatsApp Business API (Meta), email service providers — solely to deliver communications you requested</li>
          </ul>
          <p><strong>We do not:</strong> Sell your data to third parties, share your data with multiple builders without your consent, or use your data for unrelated marketing.</p>

          <h2>5. Data Retention</h2>
          <p>We retain your personal data for as long as needed to provide our services or as required by law. You may request deletion of your data at any time by emailing <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a>.</p>

          <h2>6. Your Rights</h2>
          <p>Under the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India), you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for data processing</li>
            <li>Lodge a complaint with the Data Protection Board of India</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a>.</p>

          <h2>7. Cookies & Tracking</h2>
          <p>We use Google Analytics 4 to understand how visitors use our website. GA4 uses cookies to collect anonymised usage data. You can opt out via the Google Analytics Opt-out Browser Add-on or by adjusting your browser settings.</p>
          <p>We do not use advertising cookies or third-party tracking pixels for remarketing.</p>

          <h2>8. Data Security</h2>
          <p>We implement industry-standard security measures including HTTPS encryption, secure database access controls, and regular security reviews. OTPs expire within 5 minutes and are not stored after verification.</p>

          <h2>9. Children's Privacy</h2>
          <p>Our services are not directed to persons under 18 years of age. We do not knowingly collect personal data from children.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of significant changes by posting the updated policy on this page with a revised "Last Updated" date.</p>

          <h2>11. Contact Us</h2>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li>Email: <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a></li>
            <li>Phone: {settings.phone}</li>
            <li>Address: {settings.address || 'Bhiwadi, Rajasthan 301019'}</li>
          </ul>

          <div className="not-prose mt-10 flex flex-wrap gap-3">
            <Link href="/terms" className="btn-outline text-sm">Terms of Service</Link>
            <Link href="/disclaimer" className="btn-outline text-sm">Disclaimer</Link>
            <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </article>
    </>
  );
}
