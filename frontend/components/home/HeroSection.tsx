'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTracking } from '@/components/lead/TrackingProvider';
import OTPModal from '@/components/lead/OTPModal';
import { MARKET_STATS } from '@/lib/projects';

const LOCATIONS = ['Dwarka Expressway', 'Golf Course Extension', 'SPR Road', 'Sector 113', 'Sector 106', 'New Gurgaon', 'Sohna Road'];
const TYPES = ['All Types', 'New Launch', 'Pre Launch', 'Under Construction', 'Ready To Move'];
const BUDGETS = ['Any Budget', 'Under ₹50L', '₹50L – ₹1 Cr', '₹1 Cr – ₹2 Cr', '₹2 Cr – ₹5 Cr', '₹5 Cr+'];

export default function HeroSection() {
  const { trackCTA } = useTracking();
  const [otpModal, setOtpModal] = useState(false);
  const [search, setSearch] = useState({ location: '', type: '', budget: '' });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.type) params.set('status', search.type);
    if (search.budget) params.set('budget', search.budget);
    window.location.href = `/new-projects-in-gurgaon?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85"
          alt="Luxury apartments in Gurgaon"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-20 z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
            </span>
            Gurgaon's #1 Real Estate Advisory — 4,200+ Families Helped
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] mb-5">
            New Projects in
            <span className="block text-brand-accent">Gurgaon 2025</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            150+ verified new launch, pre-launch and ready-to-move properties.
            Free site visit support. Transparent pricing. RERA approved.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <div className="border-b sm:border-b-0 sm:border-r border-gray-100">
                <div className="px-4 pt-3 pb-1">
                  <label className="text-brand-muted text-xs font-semibold uppercase tracking-wide">Location</label>
                </div>
                <select
                  value={search.location}
                  onChange={(e) => setSearch({ ...search, location: e.target.value })}
                  className="w-full px-4 pb-3 text-brand-text text-sm font-medium bg-transparent border-0 outline-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-gray-100">
                <div className="px-4 pt-3 pb-1">
                  <label className="text-brand-muted text-xs font-semibold uppercase tracking-wide">Property Type</label>
                </div>
                <select
                  value={search.type}
                  onChange={(e) => setSearch({ ...search, type: e.target.value })}
                  className="w-full px-4 pb-3 text-brand-text text-sm font-medium bg-transparent border-0 outline-none cursor-pointer"
                >
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex-1">
                  <div className="px-4 pt-3 pb-1">
                    <label className="text-brand-muted text-xs font-semibold uppercase tracking-wide">Budget</label>
                  </div>
                  <select
                    value={search.budget}
                    onChange={(e) => setSearch({ ...search, budget: e.target.value })}
                    className="w-full px-4 pb-3 text-brand-text text-sm font-medium bg-transparent border-0 outline-none cursor-pointer"
                  >
                    {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="m-2 bg-brand-dark text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-accent hover:text-brand-dark transition-all duration-200 whitespace-nowrap"
                >
                  Search →
                </button>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => { trackCTA('site_visit_request'); setOtpModal(true); }}
              className="btn-primary text-sm flex items-center gap-2"
            >
              🏠 Book Free Site Visit
            </button>
            <Link href="/new-launch-projects-in-gurgaon" className="btn-white text-sm">
              View New Launches →
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'}?text=Hi, I am looking for property in Gurgaon. Please help me.`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp Us
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: MARKET_STATS.totalProjects, label: 'Verified Projects' },
              { value: MARKET_STATS.familiesHelped, label: 'Families Helped' },
              { value: MARKET_STATS.avgAppreciation, label: 'Avg Appreciation' },
              { value: MARKET_STATS.topBuilders, label: 'Top Builders' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-white">
                <div className="text-2xl font-display font-bold text-brand-accent">{s.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating advisor card — desktop */}
        <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-80">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-brand-dark px-5 pt-5 pb-4 text-white text-center">
              <div className="w-14 h-14 rounded-full bg-brand-accent/20 border-2 border-brand-accent/50 flex items-center justify-center mx-auto mb-2 text-2xl">👨‍💼</div>
              <p className="font-semibold">Talk to a Property Advisor</p>
              <p className="text-white/70 text-xs mt-0.5">Free. No obligation. Expert guidance.</p>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-brand-muted font-medium">Your WhatsApp Number</span>
                <div className="flex gap-2">
                  <span className="flex items-center bg-brand-mint/60 border border-brand-border rounded-xl px-3 text-brand-muted text-sm">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile"
                    maxLength={10}
                    id="hero-mobile"
                    className="input-field flex-1 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('hero-mobile') as HTMLInputElement;
                  if (el?.value.length === 10) { trackCTA('whatsapp_click'); setOtpModal(true); }
                }}
                className="btn-primary w-full text-sm"
              >
                Get Free Advisory →
              </button>
              <div className="flex items-center justify-center gap-3 text-brand-muted text-xs">
                <span>🔒 100% Private</span>
                <span>·</span>
                <span>⚡ 2-hr response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {otpModal && <OTPModal onClose={() => setOtpModal(false)} onSuccess={() => setOtpModal(false)} ctaType="site_visit_request" />}
    </section>
  );
}
