'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/project/ProjectCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ALL_PROJECTS } from '@/lib/projects';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

const TABS = [
  { label: 'All', value: '' },
  { label: 'New Launch', value: 'New Launch' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'Ready To Move', value: 'Ready To Move' },
];

export default function FeaturedProjects() {
  const [activeTab, setActiveTab] = useState('');
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/projects?limit=20`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length > 0) setAllProjects(d.data);
        else setAllProjects(ALL_PROJECTS as any[]);
      })
      .catch(() => setAllProjects(ALL_PROJECTS as any[]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = (() => {
    const source = loading ? (ALL_PROJECTS as any[]) : allProjects;
    if (activeTab) return source.filter((p) => p.status === activeTab).slice(0, 6);
    return source.filter((p) => p.isFeatured).concat(source.filter((p) => !p.isFeatured)).slice(0, 6);
  })();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏙️ Premium Collection</span>
            <h2 className="section-title">New Projects in Gurgaon</h2>
            <p className="section-subtitle mt-2">
              Handpicked, verified and RERA-approved properties across all budgets.
            </p>
          </div>
          <Link href="/new-projects-in-gurgaon" className="btn-outline whitespace-nowrap flex-shrink-0 flex items-center gap-2">
            View All 150+ Projects <ArrowRightIcon className="w-4 h-4" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/new-projects-in-gurgaon" className="btn-primary inline-flex items-center gap-2">
            Explore All New Projects in Gurgaon <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
