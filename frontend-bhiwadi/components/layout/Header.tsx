'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Image from 'next/image';
import LeadCTA from '@/components/lead/LeadCTA';

type NavItem = { label: string; href: string; dropdown?: { label: string; href: string; isHeader?: boolean }[] };

const BASE_NAV: NavItem[] = [
  {
    label: 'New Launch',
    href: '/new-launch-bhiwadi',
    dropdown: [], // corridors injected dynamically
  },
  {
    label: 'By BHK',
    href: '/residential-property-in-bhiwadi',
    dropdown: [
      { label: '1 BHK in Bhiwadi', href: '/1-bhk-flats-bhiwadi' },
      { label: '2 BHK in Bhiwadi', href: '/2-bhk-flats-bhiwadi' },
      { label: '3 BHK in Bhiwadi', href: '/3-bhk-flats-bhiwadi' },
      { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
      { label: 'Industrial Plots', href: '/industrial-plots-bhiwadi' },
    ],
  },
  {
    label: 'By Budget',
    href: '/flats-under-50-lakh-bhiwadi',
    dropdown: [
      { label: 'Under ₹30 Lakh', href: '/flats-under-30-lakh-bhiwadi' },
      { label: 'Under ₹50 Lakh', href: '/flats-under-50-lakh-bhiwadi' },
      { label: 'All Flats in Bhiwadi', href: '/flats-in-bhiwadi' },
    ],
  },
  { label: 'Ready To Move', href: '/ready-to-move-bhiwadi' },
  {
    label: 'Explore',
    href: '#',
    dropdown: [
      { label: 'NH-48 Projects', href: '/nh-48-bhiwadi-projects' },
      { label: 'Bhiwadi Extension', href: '/bhiwadi-extension-projects' },
      { label: 'Under Construction', href: '/under-construction-bhiwadi' },
      { label: 'Khushkhera Projects', href: '/khushkhera-bhiwadi-projects' },
      { label: 'Tapukara Projects', href: '/tapukara-bhiwadi-projects' },
      { label: 'New Projects Bhiwadi', href: '/new-projects-in-bhiwadi' },
      { label: 'Blog & Guides', href: '/blog' },
    ],
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export default function Header({ phone = '{phone}', siteName = 'New Projects in Bhiwadi', logoUrl }: { phone?: string; siteName?: string; logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavItem[]>(BASE_NAV);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 300);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API_URL}/settings/corridors`)
      .then(r => r.json())
      .then(d => {
        if (!d.success || !d.data?.length) return;
        const raw: { name: string; href: string; city?: string }[] = d.data;
        // Group by city — if only one city, flat list; if multiple, add city headers
        const cities = Array.from(new Set(raw.map(c => c.city || 'Bhiwadi')));
        let corridorDropdown: { label: string; href: string; isHeader?: boolean }[];
        if (cities.length <= 1) {
          corridorDropdown = raw.map(c => ({ label: c.name, href: c.href }));
        } else {
          corridorDropdown = cities.flatMap(city => [
            { label: `— ${city} —`, href: '#', isHeader: true },
            ...raw.filter(c => (c.city || 'Bhiwadi') === city).map(c => ({ label: c.name, href: c.href })),
          ]);
        }
        setNavLinks(prev => prev.map(n =>
          n.label === 'New Launch' ? { ...n, dropdown: corridorDropdown } : n
        ));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 bg-white transition-all duration-300',
        scrolled ? 'shadow-md border-b border-brand-border' : 'shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <>
                <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-display font-bold text-base leading-none">{siteName[0] || 'G'}</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-display font-bold text-brand-dark text-lg leading-none">{siteName}</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.dropdown && openDropdown(link.label)}
                onMouseLeave={scheduleClose}
              >
                <Link
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    pathname === link.href
                      ? 'text-brand-dark bg-brand-mint'
                      : 'text-brand-muted hover:text-brand-dark hover:bg-brand-mint/60'
                  )}
                >
                  {link.label}
                  {link.dropdown && <ChevronDownIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown */}
                {link.dropdown && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-card border border-brand-border/60 py-2 z-50 animate-fade-in"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    {link.dropdown.map((item: any) => item.isHeader ? (
                      <div key={item.label}
                        className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest first:pt-1">
                        {item.label.replace(/^—\s*|\s*—$/g, '')}
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-brand-muted hover:text-brand-dark hover:bg-brand-mint/60 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-2 text-brand-dark font-semibold text-sm hover:text-brand-accent transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              {phone}
            </a>
            <LeadCTA ctaType="site_visit_request" className="btn-primary text-sm py-2.5 px-5">
              Free Site Visit
            </LeadCTA>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-brand-dark hover:bg-brand-mint transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full bg-white border-t border-brand-border shadow-xl z-50 max-h-[80vh] overflow-y-auto animate-slide-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-brand-text font-medium rounded-xl hover:bg-brand-mint transition-colors"
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-brand-muted hover:text-brand-dark hover:bg-brand-mint/60 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="btn-outline w-full justify-center text-sm py-2.5">
                📞 Call Us
              </a>
              <LeadCTA ctaType="site_visit_request" className="btn-primary w-full justify-center text-sm py-2.5">
                📅 Free Site Visit
              </LeadCTA>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
