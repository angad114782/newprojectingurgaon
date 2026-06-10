'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Image from 'next/image';
import LeadCTA from '@/components/lead/LeadCTA';

type NavItem = { label: string; href: string; dropdown?: { label: string; href: string }[] };

const BASE_NAV: NavItem[] = [
  {
    label: 'New Launch',
    href: '/new-launch-projects-in-gurgaon',
    dropdown: [], // corridors injected dynamically
  },
  {
    label: 'By BHK',
    href: '/residential-property-in-gurgaon',
    dropdown: [
      { label: '2 BHK — Dwarka Expressway', href: '/2-bhk-flats-in-dwarka-expressway-gurgaon' },
      { label: '3 BHK — Dwarka Expressway', href: '/3-bhk-flats-in-dwarka-expressway-gurgaon' },
      { label: '3 BHK — Golf Course Ext Road', href: '/3-bhk-flats-golf-course-extension-road-gurgaon' },
      { label: 'Penthouse in Gurgaon', href: '/penthouse-in-gurgaon' },
    ],
  },
  {
    label: 'By Budget',
    href: '/flats-under-1-crore-gurgaon',
    dropdown: [
      { label: 'Under ₹50 Lakh', href: '/flats-under-50-lakh-gurgaon' },
      { label: 'Under ₹1 Crore', href: '/flats-under-1-crore-gurgaon' },
      { label: 'Luxury Above ₹3 Crore', href: '/luxury-apartments-above-3-crore-gurgaon' },
    ],
  },
  { label: 'Ready To Move', href: '/ready-to-move-flats-gurgaon' },
  {
    label: 'Explore',
    href: '#',
    dropdown: [
      { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
      { label: 'Sector 106 Gurgaon', href: '/sector-106-gurgaon-property' },
      { label: 'Sector 102 Gurgaon', href: '/sector-102-gurgaon-property' },
      { label: 'Sector 37D Gurgaon', href: '/sector-37d-gurgaon-property' },
      { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
      { label: 'Blog & Guides', href: '/blog' },
    ],
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

export default function Header({ phone = '{phone}', siteName = 'New Projects in Gurgaon', logoUrl }: { phone?: string; siteName?: string; logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavItem[]>(BASE_NAV);
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API_URL}/settings/corridors`)
      .then(r => r.json())
      .then(d => {
        if (!d.success || !d.data?.length) return;
        const corridorDropdown = d.data.map((c: any) => ({ label: c.name, href: c.href }));
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
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
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
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-card border border-brand-border/60 py-2 z-50 animate-fade-in">
                    {link.dropdown.map((item) => (
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
