'use client';
import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function Topbar() {
  return (
    <div className="topbar-gradient text-white text-xs hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Location + Trust Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/90">
            <MapPinIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Gurgaon, Haryana</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-accent font-semibold">
            <CheckBadgeIcon className="w-3.5 h-3.5" />
            <span>100+ Verified New Projects in Gurgaon</span>
          </div>
        </div>

        {/* Right: Contact + CTA */}
        <div className="flex items-center gap-5">
          <a href="tel:+919999999999" className="flex items-center gap-1.5 text-white/90 hover:text-brand-accent transition-colors">
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>+91-9999999999</span>
          </a>
          <a href="mailto:info@gurgaonrealty.com" className="flex items-center gap-1.5 text-white/90 hover:text-brand-accent transition-colors">
            <EnvelopeIcon className="w-3.5 h-3.5" />
            <span>info@gurgaonrealty.com</span>
          </a>
          <Link
            href="#lead-form"
            className="bg-brand-accent text-white font-semibold px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition-opacity"
          >
            📅 Book Free Site Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
