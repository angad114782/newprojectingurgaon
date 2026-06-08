'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTracking } from '@/components/lead/TrackingProvider';
import type { Project } from '@/lib/projects';

const STATUS_STYLES: Record<string, string> = {
  'New Launch': 'bg-green-100 text-green-800 border-green-200',
  'Pre Launch': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Under Construction': 'bg-blue-100 text-blue-800 border-blue-200',
  'Ready To Move': 'bg-purple-100 text-purple-800 border-purple-200',
};

interface ProjectCardProps {
  project: Project | any; // supports both full and API project
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const { trackEvent, trackCTA, openLeadModal } = useTracking();
  const [imgError, setImgError] = useState(false);

  const slug = project.slug;
  const name = project.name;
  const builder = project.builder?.name || project.builder || project.builderName || '';
  const location = project.location;
  const status = project.status;
  const price = project.priceDisplay || project.price;
  const configs = project.configurations || [];
  const possession = project.possessionDate || project.possession || '';
  const isVerified = project.isVerified !== false;
  const isNew = project.isNew || status === 'New Launch';
  const heroImg = project.heroImage || project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';

  const handleProjectView = () => {
    trackEvent('project_view', { projectSlug: slug, projectName: name });
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackCTA('price_section_view', slug, { projectName: name });
    openLeadModal({ ctaType: 'price_list', projectName: name });
  };

  if (variant === 'compact') {
    return (
      <Link href={`/project/${slug}`} onClick={handleProjectView}
        className="flex gap-3 p-3 bg-white rounded-2xl border border-brand-border/40 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={imgError ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=70' : heroImg}
            alt={name} fill className="object-cover" onError={() => setImgError(true)} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{status}</span>
          <h3 className="font-display font-semibold text-brand-text text-sm mt-1 truncate">{name}</h3>
          <p className="text-brand-muted text-xs truncate">📍 {location}</p>
          <p className="text-brand-dark font-bold text-sm mt-0.5">{price}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/project/${slug}`} onClick={handleProjectView}
        className="flex gap-4 bg-white rounded-2xl border border-brand-border/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="relative w-48 h-36 flex-shrink-0">
          <Image src={imgError ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70' : heroImg}
            alt={name} fill className="object-cover" onError={() => setImgError(true)} />
          <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[status] || ''}`}>{status}</span>
        </div>
        <div className="flex-1 p-4">
          <p className="text-brand-muted text-xs mb-0.5">{builder}</p>
          <h3 className="font-display font-semibold text-brand-text mb-1">{name}</h3>
          <p className="text-brand-muted text-sm mb-1">📍 {location}</p>
          <div className="flex items-center gap-3">
            <span className="text-brand-dark font-bold">{price}</span>
            {possession && <span className="text-brand-muted text-xs">🔑 {possession}</span>}
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <>
      <div className="card group flex flex-col hover:-translate-y-1 transition-all duration-300"
        onMouseEnter={handleProjectView}>
        {/* Image */}
        <Link href={`/project/${slug}`} className="block relative h-52 overflow-hidden rounded-t-2xl">
          <Image
            src={imgError ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70' : heroImg}
            alt={`${name} — ${location}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge border text-xs font-semibold ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
              {status}
            </span>
            {isNew && <span className="badge bg-red-500 text-white border-0 text-xs">NEW</span>}
          </div>
          {isVerified && (
            <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2 py-1 flex items-center gap-1 text-xs text-green-700 font-semibold shadow">
              ✓ RERA
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white font-display font-bold text-lg">{price}</span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex-1">
            <p className="text-brand-muted text-xs mb-0.5">{builder}</p>
            <Link href={`/project/${slug}`}>
              <h3 className="font-display font-semibold text-brand-text text-base mb-1 group-hover:text-brand-dark transition-colors leading-snug">
                {name}
                {location && (
                  <span className="block text-xs font-normal font-sans text-brand-muted mt-0.5">
                    📍 {location}
                  </span>
                )}
              </h3>
            </Link>

            {/* Configs */}
            {configs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {configs.slice(0, 3).map((c: string) => (
                  <span key={c} className="text-xs bg-brand-mint text-brand-dark border border-brand-border/50 px-2 py-0.5 rounded-full font-medium">
                    {typeof c === 'string' ? c.split('(')[0].trim() : c}
                  </span>
                ))}
              </div>
            )}

            {possession && (
              <p className="text-brand-muted text-xs mb-3">
                🔑 Possession: <span className="font-medium text-brand-text">{possession}</span>
              </p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-brand-border/30">
            <button
              onClick={handlePriceClick}
              className="flex-1 bg-brand-dark text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-all duration-200"
            >
              Get Price
            </button>
            <Link
              href={`/project/${slug}`}
              onClick={() => trackEvent('project_view', { projectSlug: slug })}
              className="flex-1 border border-brand-dark text-brand-dark text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-brand-mint text-center transition-all duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

    </>
  );
}
