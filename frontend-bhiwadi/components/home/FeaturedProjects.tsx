'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/project/ProjectCard';
import LeadCTA from '@/components/lead/LeadCTA';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const TABS = [
  { label: 'All', value: '' },
  { label: 'New Launch', value: 'New Launch' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'Ready To Move', value: 'Ready To Move' },
];

export default function FeaturedProjects({ phone, initialProjects = [] }: { phone?: string; initialProjects?: any[] }) {
  const [activeTab, setActiveTab] = useState('');

  const displayed = (() => {
    if (activeTab) return initialProjects.filter((p) => p.status === activeTab).slice(0, 9);
    return initialProjects.filter((p) => p.isFeatured).concat(initialProjects.filter((p) => !p.isFeatured)).slice(0, 9);
  })();

  const callPhone = phone || process.env.NEXT_PUBLIC_PHONE || '+91-8619930583';

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏙️ Premium Collection</span>
            <h2 className="section-title">New & Premium Projects in Bhiwadi</h2>
            <p className="section-subtitle mt-2">
              Handpicked, RERA-verified luxury apartments, villas and penthouses — from ₹2 Cr to ₹15 Cr+.
            </p>
          </div>
          <Link href="/new-projects-in-bhiwadi"
            className="btn-outline whitespace-nowrap flex-shrink-0 flex items-center gap-2">
            View All Projects <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'bg-brand-mint text-brand-muted hover:text-brand-dark hover:bg-brand-border'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-mint/20 rounded-2xl border border-brand-border/40">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="font-display font-bold text-brand-text text-xl mb-2">
              Our Representative Will Connect You Soon
            </h3>
            <p className="text-brand-muted text-sm mb-6 max-w-md mx-auto">
              We're curating the finest projects in Bhiwadi for you. Call us now for exclusive pre-launch pricing and brochures.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${callPhone.replace(/[^+\d]/g, '')}`}
                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                📞 Call Now: {callPhone}
              </a>
              <LeadCTA ctaType="site_visit_request" className="btn-outline">
                Request Callback →
              </LeadCTA>
            </div>
          </div>
        )}

        {displayed.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/new-projects-in-bhiwadi" className="btn-primary inline-flex items-center gap-2">
              Explore All Projects in Bhiwadi <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
