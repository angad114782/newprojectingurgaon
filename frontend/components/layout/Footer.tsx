'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ALL_PROJECTS, ALL_SEO_PAGES } from '@/lib/projects';

const PHONE = process.env.NEXT_PUBLIC_PHONE || '+91-99999-99999';
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || 'info@gurgaonrealty.in';
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

const CORRIDORS = [
  { label: 'New Launch Projects Gurgaon', href: '/new-launch-projects-in-gurgaon' },
  { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
  { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
  { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
  { label: 'Golf Course Extension Road', href: '/golf-course-extension-road-projects' },
  { label: 'SPR Road Projects', href: '/spr-road-projects' },
  { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
  { label: 'Sector 106 Gurgaon', href: '/sector-106-gurgaon-property' },
  { label: 'Sector 102 Gurgaon', href: '/sector-102-gurgaon-property' },
  { label: 'Sector 37D Gurgaon', href: '/sector-37d-gurgaon-property' },
  { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
  { label: 'Property Blog', href: '/blog' },
];

export default function Footer() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllPages, setShowAllPages] = useState(false);

  const INITIAL_PROJECTS = 6;
  const INITIAL_PAGES = 6;

  const displayedProjects = showAllProjects ? ALL_PROJECTS : ALL_PROJECTS.slice(0, INITIAL_PROJECTS);
  const displayedPages = showAllPages ? CORRIDORS : CORRIDORS.slice(0, INITIAL_PAGES);

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
            <a href={`https://wa.me/${WA}?text=Hi, I am looking for property in Gurgaon`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
              💬 WhatsApp Now
            </a>
            <a href={`tel:${PHONE}`}
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
              <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center text-brand-dark font-bold font-display">GR</div>
              <span className="font-display font-bold text-xl">GurgaonRealty</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Gurgaon's most trusted real estate advisory. 4,200+ families helped. Zero brokerage for buyers. RERA verified projects only.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">📞 {PHONE}</a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors">✉️ {EMAIL}</a>
              <p className="flex items-center gap-2">📍 Cyber City, Gurgaon, Haryana</p>
              <p className="text-white/40 text-xs">Mon–Sun: 9 AM – 8 PM</p>
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
            {CORRIDORS.length > INITIAL_PAGES && (
              <button onClick={() => setShowAllPages(!showAllPages)}
                className="mt-3 text-brand-accent text-xs font-semibold hover:underline flex items-center gap-1">
                {showAllPages ? '↑ Show Less' : `+ ${CORRIDORS.length - INITIAL_PAGES} More Pages`}
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
                    <span className="text-white/30 text-xs ml-1">— {p.sector}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {ALL_PROJECTS.length > INITIAL_PROJECTS && (
              <button onClick={() => setShowAllProjects(!showAllProjects)}
                className="mt-3 text-brand-accent text-xs font-semibold hover:underline flex items-center gap-1">
                {showAllProjects ? '↑ Show Less' : `+ ${ALL_PROJECTS.length - INITIAL_PROJECTS} More Projects`}
              </button>
            )}
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-white/80 mb-4">Resources & Tools</h3>
            <ul className="space-y-2">
              {[
                { label: 'Investment Calculator', href: '/#lead-form' },
                { label: 'Free Site Visit', href: '/#lead-form' },
                { label: 'Get Price List', href: '/#lead-form' },
                { label: 'Download Brochure', href: '/#lead-form' },
                { label: 'Property Blog', href: '/blog' },
                { label: 'Best Sectors 2025', href: '/blog/best-sectors-to-invest-in-gurgaon' },
                { label: 'Dwarka Expressway Guide', href: '/blog/dwarka-expressway-investment-guide' },
                { label: 'New Launch vs RTM', href: '/blog/new-launch-vs-ready-to-move-property' },
                { label: 'How to Check RERA', href: '/blog/how-to-check-rera-before-buying-property' },
                { label: 'Best Builders Guide', href: '/blog/best-builders-in-gurgaon' },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-white/60 text-sm hover:text-brand-accent transition-colors hover:pl-1 duration-200 block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Keyword Links — full internal link block */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-semibold">All Property Pages</p>
          <div className="flex flex-wrap gap-2">
            {[
              ...CORRIDORS,
              ...ALL_PROJECTS.map((p) => ({ label: p.name, href: `/project/${p.slug}` })),
              { label: 'Property Investment Blog', href: '/blog' },
            ].map((l) => (
              <Link key={l.href + l.label} href={l.href}
                className="text-white/40 text-xs hover:text-white/70 transition-colors border border-white/10 px-3 py-1 rounded-full hover:border-white/20">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social + Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white/40 text-xs">© 2025 GurgaonRealty. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-1">Real estate advisory for new projects in Gurgaon. RERA verified. Zero brokerage.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-green-400 text-xs transition-colors">WhatsApp</a>
            <a href="https://haryanarera.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-brand-accent text-xs transition-colors">Verify on RERA →</a>
            <Link href="/admin" className="text-white/20 hover:text-white/40 text-xs transition-colors">Admin</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-white/25 text-xs mt-6 leading-relaxed">
          Disclaimer: All property information is indicative and subject to change. Prices, availability and specifications are as provided by respective developers. GurgaonRealty is an independent advisory platform and not the developer or owner of any property listed. Verify all details directly with the builder and on haryanarera.gov.in before making any investment decision. Images shown are for representational purposes only.
        </p>
      </div>
    </footer>
  );
}
