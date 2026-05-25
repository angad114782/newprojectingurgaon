'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

const navLinks = [
  {
    label: 'New Launch',
    href: '/new-launch-projects-in-gurgaon',
    dropdown: [
      { label: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
      { label: 'Golf Course Ext Road', href: '/golf-course-extension-road-projects' },
      { label: 'SPR Road', href: '/spr-road-projects' },
    ],
  },
  { label: 'Residential', href: '/residential-property-in-gurgaon' },
  { label: 'Pre Launch', href: '/new-projects-in-gurgaon' },
  { label: 'Ready To Move', href: '/new-projects-in-gurgaon?status=ready' },
  { label: 'Commercial', href: '/new-projects-in-gurgaon?type=commercial' },
  {
    label: 'Explore',
    href: '#',
    dropdown: [
      { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
      { label: 'Sector 106 Gurgaon', href: '/sector-106-gurgaon-property' },
      { label: 'Sector 102 Gurgaon', href: '/sector-102-gurgaon-property' },
      { label: 'New Gurgaon Projects', href: '/new-gurgaon-projects' },
      { label: 'Blog & Guides', href: '/blog' },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

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
            <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-base leading-none">G</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-brand-dark text-lg leading-none">Gurgaon</span>
              <span className="text-brand-accent font-semibold text-xs tracking-widest uppercase leading-tight">Realty</span>
            </div>
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
              href="tel:+919999999999"
              className="flex items-center gap-2 text-brand-dark font-semibold text-sm hover:text-brand-accent transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              +91-9999999999
            </a>
            <Link href="#lead-form" className="btn-primary text-sm py-2.5 px-5">
              Free Site Visit
            </Link>
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
              <a href="tel:+919999999999" className="btn-outline w-full justify-center text-sm py-2.5">
                📞 Call Us
              </a>
              <Link href="#lead-form" className="btn-primary w-full justify-center text-sm py-2.5">
                📅 Free Site Visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
