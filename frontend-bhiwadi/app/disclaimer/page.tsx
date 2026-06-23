import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchSettings } from '@/lib/settings';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const settings = await fetchSettings();

  return {
    title: `Disclaimer | ${settings.siteName}`,
    description: `Disclaimer for ${settings.siteName}. Important information about property pricing, availability, and investment risks for Bhiwadi real estate.`,
    alternates: { canonical: `${siteUrl}/disclaimer` },
    robots: { index: true, follow: true },
  };
}

export default async function DisclaimerPage() {
  const settings = await fetchSettings();

  return (
    <>
      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Disclaimer</span>
        </div>
      </nav>

      <section className="hero-gradient py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Disclaimer</h1>
          <p className="text-white/70">Important information — please read before making any property decisions.</p>
        </div>
      </section>

      <article className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-headings:font-display prose-headings:text-brand-text prose-p:text-brand-muted prose-li:text-brand-muted">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 not-prose">
            <p className="text-red-800 font-semibold text-sm mb-1">Important Notice</p>
            <p className="text-red-700 text-sm">Real estate investment involves significant financial risk. All information on this website is indicative only. Always verify details directly with the developer and on rrerarajasthan.in before making any booking or payment.</p>
          </div>

          <h2>1. General Disclaimer</h2>
          <p>{settings.siteName} is an independent real estate advisory platform. We are not a developer, builder, or owner of any property listed on this website. We provide advisory services to connect buyers with verified developers in Bhiwadi.</p>

          <h2>2. Property Information</h2>
          <p>All property information published on {settings.siteName} — including but not limited to prices, configurations, floor plans, RERA registration numbers, possession dates, amenities, and project specifications — is:</p>
          <ul>
            <li>Sourced from the respective developer/builder</li>
            <li>Indicative and subject to change without notice</li>
            <li>Not a legal or binding representation</li>
            <li>To be independently verified before any transaction</li>
          </ul>

          <h2>3. Pricing Disclaimer</h2>
          <p>All prices mentioned on this website are:</p>
          <ul>
            <li>Approximate and indicative — actual prices may vary based on unit selection, floor, view, PLC charges, and government levies</li>
            <li>Subject to change by the developer at any time</li>
            <li>Exclusive of GST, stamp duty, registration charges, and other applicable taxes unless explicitly stated</li>
            <li>Not inclusive of maintenance deposits, club charges, or other one-time/recurring charges</li>
          </ul>
          <p>The final price for any property unit shall be determined by the developer/builder and confirmed in writing via the builder-buyer agreement.</p>

          <h2>4. Investment Risk Disclaimer</h2>
          <p>Real estate investment is subject to market risks:</p>
          <ul>
            <li>Past appreciation rates do not guarantee future returns</li>
            <li>Rental yield projections are estimates based on current market conditions and may not materialise</li>
            <li>Property values can decrease as well as increase</li>
            <li>Possession timelines mentioned are indicative — actual delivery may vary</li>
            <li>Under-construction projects carry construction risk, developer solvency risk, and regulatory risk</li>
          </ul>
          <p>{settings.siteName} does not guarantee any investment return, capital appreciation, or rental income from any property listed on this website.</p>

          <h2>5. Images & Representations</h2>
          <p>All images, renders, floor plan illustrations, and amenity photographs displayed on this website are for representational purposes only. Actual construction, finishing, specifications, and amenities may differ from representations shown. Images may be artist's impressions of proposed projects.</p>

          <h2>6. RERA Compliance</h2>
          <p>While we endeavour to verify RERA registration of all projects listed, buyers must independently verify RERA registration status on the official Rajasthan RERA portal at <a href="https://rrerarajasthan.in" target="_blank" rel="noopener noreferrer" className="text-brand-accent">rrerarajasthan.in</a> before making any booking. RERA registration status may change, and {settings.siteName} cannot be held responsible for any lapses in RERA compliance by developers.</p>

          <h2>7. No Legal Advice</h2>
          <p>Information on this website does not constitute legal, financial, or tax advice. Buyers are strongly advised to consult qualified legal and financial professionals before making any property purchase decision.</p>

          <h2>8. Third-Party Content</h2>
          <p>This website may link to or reference external websites, press articles, or third-party data. {settings.siteName} is not responsible for the accuracy, completeness, or currency of third-party content.</p>

          <h2>9. Limitation of Liability</h2>
          <p>{settings.siteName}, its advisors, employees, and associates shall not be held liable for any loss, damage, or expense (including lost profits, business losses, or consequential damages) arising directly or indirectly from:</p>
          <ul>
            <li>Reliance on any information provided on this website</li>
            <li>Any property transaction entered into based on our advisory</li>
            <li>Developer defaults, delays, or misrepresentations</li>
            <li>Market fluctuations affecting property value</li>
          </ul>

          <h2>10. Contact</h2>
          <p>If you have questions about this disclaimer or any information on our website, please contact us:</p>
          <ul>
            <li>Email: <a href={`mailto:${settings.email}`} className="text-brand-accent">{settings.email}</a></li>
            <li>Phone: {settings.phone}</li>
          </ul>

          <div className="not-prose mt-10 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="btn-outline text-sm">Privacy Policy</Link>
            <Link href="/terms" className="btn-outline text-sm">Terms of Service</Link>
            <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </article>
    </>
  );
}
