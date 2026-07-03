'use client';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import LeadCTA from '@/components/lead/LeadCTA';

interface TopbarProps {
  phone?: string;
  email?: string;
  address?: string;
  totalProjects?: string;
}

export default function Topbar({
  phone = '+91-8619930583',
  email = 'info@newprojectsinbhiwadi.com',
  address = 'Bhiwadi, Rajasthan',
  totalProjects = '150+',
}: TopbarProps) {
  const ph = phone.replace(/[^+\d]/g, '');
  const city = address?.split(',')[0] || 'Bhiwadi';

  return (
    <div className="topbar-gradient text-white text-xs hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/90">
            <MapPinIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>{city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-accent font-semibold">
            <CheckBadgeIcon className="w-3.5 h-3.5" />
            <span>{totalProjects} Verified New Projects in Bhiwadi</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <a href={`tel:${ph}`} className="flex items-center gap-1.5 text-white/90 hover:text-brand-accent transition-colors">
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-white/90 hover:text-brand-accent transition-colors">
            <EnvelopeIcon className="w-3.5 h-3.5" />
            <span>{email}</span>
          </a>
          <LeadCTA ctaType="site_visit_request" className="bg-brand-accent text-white font-semibold px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition-opacity">
            📅 Book Free Site Visit
          </LeadCTA>
        </div>
      </div>
    </div>
  );
}
