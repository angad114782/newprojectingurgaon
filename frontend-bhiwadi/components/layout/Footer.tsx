'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_SEO_PAGES } from '@/lib/projects';
import LeadCTA from '@/components/lead/LeadCTA';

const NAV_LINKS = [
  { label: 'New Launch Projects Bhiwadi', href: '/new-launch-bhiwadi' },
  { label: 'New Projects in Bhiwadi', href: '/new-projects-in-bhiwadi' },
  { label: 'Ready to Move Bhiwadi', href: '/ready-to-move-bhiwadi' },
  { label: 'NH-48 Bhiwadi Projects', href: '/nh-48-bhiwadi-projects' },
  { label: 'Industrial Plots Bhiwadi', href: '/industrial-plots-bhiwadi' },
  { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
  { label: '2 BHK Flats in Bhiwadi', href: '/2-bhk-flats-bhiwadi' },
  { label: '3 BHK Flats in Bhiwadi', href: '/3-bhk-flats-bhiwadi' },
  { label: 'Flats Under ₹30 Lakh Bhiwadi', href: '/flats-under-30-lakh-bhiwadi' },
  { label: 'Flats Under ₹50 Lakh Bhiwadi', href: '/flats-under-50-lakh-bhiwadi' },
  { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
  { label: 'Bhiwadi Extension Projects', href: '/bhiwadi-extension-projects' },
  { label: 'Khushkhera Bhiwadi Projects', href: '/khushkhera-bhiwadi-projects' },
  { label: 'Property Blog', href: '/blog' },
];

interface FooterProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  siteName?: string;
  address?: string;
  openingHours?: string;
  reraNumber?: string;
  reraLink?: string;
  logoUrl?: string;
  social?: { facebook?: string; instagram?: string; youtube?: string; linkedin?: string; twitter?: string };
}

export default function Footer({
  phone = '+91-8619930583',
  email = 'info@newprojectsinbhiwadi.com',
  whatsapp = '918619930583',
  siteName = 'New Projects in Bhiwadi',
  address = 'Bhiwadi, Alwar, Rajasthan',
  openingHours = 'Mon–Sun: 9 AM – 8 PM',
  reraNumber = '',
  reraLink = 'https://rera.rajasthan.gov.in',
  logoUrl,
  social = {},
}: FooterProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllPages, setShowAllPages] = useState(false);
  const [projects, setProjects] = useState<Array<{ slug: string; name: string; sector?: string }>>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

  useEffect(() => {
    fetch(`${API}/projects?limit=20&featured=true`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProjects(d.data); })
      .catch(() => {});
  }, []);

  const INITIAL = 6;
  const displayedProjects = showAllProjects ? projects : projects.slice(0, INITIAL);
  const displayedPages = showAllPages ? NAV_LINKS : NAV_LINKS.slice(0, INITIAL);
  const waLink = `https://wa.me/${whatsapp}?text=Hi, I am looking for property in Bhiwadi`;

  return (
    <footer className="bg-brand-dark text-white">
      {/* CTA Bar */}
      <div className="border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-lg">Ready to Find Your Dream Property?</p>
            <p className="text-white/60 text-sm">Free advisory. RERA verified. No brokerage.</p>
          </div>
          <div className="flex gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
              💬 WhatsApp Now
            </a>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
              📞 Call Us
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain max-w-[180px]" loading="lazy" />
              ) : (
                <>
                  <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center text-brand-dark font-bold font-display">
                    {siteName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-display font-bold text-xl">{siteName}</span>
                </>
              )}
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Bhiwadi's most trusted real estate advisory. 4,200+ families helped. Zero brokerage for buyers. RERA verified projects only.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">📞 {phone}</a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white transition-colors">✉️ {email}</a>
              <p className="flex items-center gap-2">📍 {address}</p>
              <p className="text-white/40 text-xs">{openingHours}</p>
            </div>
          </div>

          {/* SEO Pages */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/80 mb-4">Explore Properties</h3>
            <ul className="space-y-2">
              {displayedPages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 text-sm hover:text-brand-accent transition-colors hover:pl-1 duration-200 block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {NAV_LINKS.length > INITIAL && (
              <button onClick={() => setShowAllPages(!showAllPages)}
                className="mt-3 text-brand-accent text-xs font-semibold hover:underline flex items-center gap-1">
                {showAllPages ? '↑ Show Less' : `+ ${NAV_LINKS.length - INITIAL} More Pages`}
              </button>
            )}
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/80 mb-4">Featured Projects</h3>
            <ul className="space-y-2">
              {displayedProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/project/${p.slug}`}
                    className="text-white/60 text-sm hover:text-brand-accent transition-colors hover:pl-1 duration-200 block">
                    <span>{p.name}</span>
                    {p.sector && <span className="text-white/30 text-xs ml-1">— {p.sector}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            {projects.length > INITIAL && (
              <button onClick={() => setShowAllProjects(!showAllProjects)}
                className="mt-3 text-brand-accent text-xs font-semibold hover:underline flex items-center gap-1">
                {showAllProjects ? '↑ Show Less' : `+ ${projects.length - INITIAL} More Projects`}
              </button>
            )}
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/80 mb-4">Resources & Tools</h3>
            <ul className="space-y-2">
              {[
                { label: 'Investment Calculator', modal: true, ctaType: 'price_list' },
                { label: 'Free Site Visit', modal: true, ctaType: 'site_visit_request' },
                { label: 'Get Price List', modal: true, ctaType: 'price_list' },
                { label: 'Download Brochure', modal: true, ctaType: 'brochure' },
                { label: 'Property Blog', href: '/blog' },
                { label: 'Best Areas in Bhiwadi 2025', href: '/blog/property-investment-in-bhiwadi-guide' },
                { label: 'NH-48 Investment Guide', href: '/blog/nh-48-bhiwadi-investment-guide' },
                { label: 'New Launch vs RTM', href: '/blog/new-launch-vs-ready-to-move-property' },
                { label: 'How to Check RERA', href: '/blog/how-to-check-rera-before-buying-property' },
                { label: 'Best Builders in Bhiwadi', href: '/blog/best-builders-in-bhiwadi' },
              ].map((l: any) => (
                <li key={l.label}>
                  {l.modal ? (
                    <LeadCTA ctaType={l.ctaType} className="text-white/60 text-sm hover:text-brand-accent transition-colors hover:pl-1 duration-200 block text-left w-full">
                      {l.label}
                    </LeadCTA>
                  ) : (
                    <Link href={l.href} className="text-white/60 text-sm hover:text-brand-accent transition-colors hover:pl-1 duration-200 block">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Keyword Links */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-semibold">All Property Pages</p>
          <div className="flex flex-wrap gap-2">
            {[
              ...NAV_LINKS,
              ...projects.map((p) => ({ label: p.name, href: `/project/${p.slug}` })),
              { label: 'Property Investment Blog', href: '/blog' },
            ].map((l) => (
              <Link key={l.href + l.label} href={l.href}
                className="text-white/40 text-xs hover:text-white/70 transition-colors border border-white/10 px-3 py-1 rounded-full hover:border-white/20">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/10 pt-6 mb-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="text-white/40 hover:text-brand-accent text-xs transition-colors">About Us</Link>
            <Link href="/contact" className="text-white/40 hover:text-brand-accent text-xs transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="text-white/40 hover:text-brand-accent text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-brand-accent text-xs transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="text-white/40 hover:text-brand-accent text-xs transition-colors">Disclaimer</Link>
            <a href={reraLink} target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-brand-accent text-xs transition-colors">Verify on RERA →</a>
          </div>
        </div>

        {/* Social + Bottom */}
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-1">Real estate advisory for new projects in Bhiwadi. RERA verified. Zero brokerage.</p>
            {reraNumber && (
              <a href={reraLink} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-brand-accent text-xs mt-1 block transition-colors">
                RERA Reg. No: {reraNumber}
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-green-400 text-xs transition-colors">WhatsApp</a>
            {social?.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-brand-accent text-xs transition-colors">Facebook</a>
            )}
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-brand-accent text-xs transition-colors">Instagram</a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-brand-accent text-xs transition-colors">LinkedIn</a>
            )}
            <Link href="/admin" className="text-white/20 hover:text-white/40 text-xs transition-colors">Admin</Link>
          </div>
        </div>

        <p className="text-white/25 text-xs mt-6 leading-relaxed">
          Disclaimer: All property information is indicative and subject to change. Prices, availability and specifications are as provided by respective developers. {siteName} is an independent advisory platform and not the developer or owner of any property listed. Verify all details directly with the builder and on rera.rajasthan.gov.in before making any investment decision. Images shown are for representational purposes only.
        </p>
      </div>
    </footer>
  );
}
