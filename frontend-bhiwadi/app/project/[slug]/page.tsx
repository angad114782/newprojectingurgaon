import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LeadForm from '@/components/home/LeadForm';
import ProjectCard from '@/components/project/ProjectCard';
import {
  ViewingCount,
  ScarcityBadge,
  PriceCountdown,
  ScrollTriggerModal,
  ROICalculator,
} from '@/components/conversion/PsychTriggers';
import {
  RealEstateListingSchema,
  BreadcrumbSchema,
  FAQSchema,
} from '@/components/seo/SchemaMarkup';
import { InternalLinksBlock } from '@/components/home/HomeSections';
import LeadCTA from '@/components/lead/LeadCTA';
import { fetchSettings } from '@/lib/settings';
import {
  fetchProjectBySlug,
  fetchRelatedByCorridor,
  fetchRelatedByBudget,
  fetchAllProjectSlugs,
  getBuilderName as apiGetBuilderName,
  getReraNumber,
} from '@/lib/api-projects';

type Props = { params: { slug: string } };

const fallbackImage = '/placeholder-project.jpg';

const getBuilderName = (builder: any) => {
  if (!builder) return 'Developer';

  if (typeof builder === 'string') {
    return builder;
  }

  if (typeof builder === 'object') {
    return builder.name || 'Developer';
  }

  return 'Developer';
};

const getBuilderReraId = (builder: any) => {
  if (!builder || typeof builder !== 'object') return '';
  return builder.reraId || '';
};

const safeArray = (value: any) => {
  return Array.isArray(value) ? value : [];
};

const safeImage = (src: any) => {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return fallbackImage;
  }

  return src;
};

const safeText = (value: any, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
};

async function getProject(slug: string) {
  return await fetchProjectBySlug(slug);
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const apiSlugs = await fetchAllProjectSlugs();
  return apiSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const [project, settings] = await Promise.all([getProject(params.slug), fetchSettings()]);

  if (!project) {
    return { title: `Project Not Found | ${settings.siteName}` };
  }

  const builderName = getBuilderName(project.builder);
  const configurations = safeArray(project.configurations);
  const p = project as any;
  const title = p.metaTitle || `${project.name} Bhiwadi | Price, Floor Plans, RERA | ${settings.siteName}`;
  const description = p.metaDescription || `${project.name} by ${builderName} in ${project.location}. ${configurations.slice(0, 2).join(', ')} available from ${p.price || p.priceDisplay || 'Price on Request'}. Get price list, floor plans, RERA details and free site visit.`;
  const pageUrl = `${siteUrl}/project/${params.slug}`;

  return {
    title,
    description,
    keywords: p.metaKeywords || `${project.name}, ${builderName}, ${project.name} Bhiwadi, ${project.sector} Bhiwadi property, ${project.corridor} projects, residential property in Bhiwadi`,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: [{ url: safeImage((project as any).heroImage) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', width: 1200, height: 630, alt: project.name }],
    },
    alternates: { canonical: pageUrl },
  };
}

const STATUS_COLORS: Record<string, string> = {
  'New Launch': 'bg-green-100 text-green-800',
  'Pre Launch': 'bg-yellow-100 text-yellow-800',
  'Under Construction': 'bg-blue-100 text-blue-800',
  'Ready To Move': 'bg-purple-100 text-purple-800',
};

export default async function ProjectDetailPage({ params }: Props) {
  const [project, settings] = await Promise.all([getProject(params.slug), fetchSettings()]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mint/20 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-brand-text mb-4">
            Project Not Found
          </h1>
          <p className="text-brand-muted mb-6">
            This project may have been removed or the URL is incorrect.
          </p>
          <Link href="/residential-property-in-bhiwadi" className="btn-primary">
            Browse All Projects
          </Link>
        </div>
      </div>
    );
  }

  const builderName = apiGetBuilderName(project.builder) || getBuilderName(project.builder);
  const builderReraId = getBuilderReraId(project.builder);
  const reraNumber = getReraNumber(project.rera) || safeText(project.rera, 'Available on Request');

  const configurations = safeArray(project.configurations);
  const gallery = safeArray(project.gallery).filter(Boolean);
  const whyBuy = safeArray(project.whyBuy);
  const highlights = safeArray(project.highlights);
  const floorPlans = safeArray(project.floorPlans);
  const amenities = safeArray(project.amenities);
  const connectivity = safeArray(project.connectivity);
  const nearbyLandmarks = safeArray(project.nearbyLandmarks);
  const faqs = safeArray(project.faqs);
  const tags = safeArray(project.tags);

  const mainImage = safeImage(project.heroImage || gallery[0]);

  const corridorSlugMap: Record<string, string> = {
    'Alwar Bypass Road': 'alwar-bypass-road-projects',
    'NH-48': 'nh-48-bhiwadi-projects',
    'Tapukara': 'tapukara-bhiwadi-projects',
    'Neemrana': 'neemrana-bhiwadi-projects',
    'Bhiwadi Extension': 'bhiwadi-extension-projects',
  };
  const locationSlug = corridorSlugMap[project.corridor] ||
    tags.find((t: string) => typeof t === 'string' && (t.includes('expressway') || t.includes('road') || t.includes('golf') || t.includes('spr'))) ||
    'residential-property-in-bhiwadi';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';

  const [sameCorridor, similarBudgetRaw] = await Promise.all([
    fetchRelatedByCorridor(project.corridor, project.slug, 3),
    project.priceMin
      ? fetchRelatedByBudget(project.priceMin, project.priceMax || project.priceMin * 2, project.slug, 4)
      : Promise.resolve([]),
  ]);

  const sameCorridorSlugs = new Set(sameCorridor.map((p: any) => p.slug));
  const similarBudget = similarBudgetRaw.filter((p: any) => !sameCorridorSlugs.has(p.slug)).slice(0, 3);

  return (
    <>
      <RealEstateListingSchema
        project={{
          ...(project as any),
          builder: builderName,
          description: (project as any).description || '',
          price: (project as any).price || (project as any).priceDisplay || 'Price on Request',
          amenities,
          configurations,
        }}
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'Projects', url: `${siteUrl}/residential-property-in-bhiwadi` },
          { name: project.corridor, url: `${siteUrl}/${locationSlug}` },
          { name: project.name, url: `${siteUrl}/project/${project.slug}` },
        ]}
      />

      <FAQSchema faqs={faqs} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs text-brand-muted flex flex-wrap gap-1">
          <Link href="/" className="hover:text-brand-dark">
            Home
          </Link>
          <span>/</span>
          <Link href="/residential-property-in-bhiwadi" className="hover:text-brand-dark">
            Projects
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-medium">{project.name}</span>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-brand-dark via-[#065B63] to-[#04484F]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`badge text-xs font-semibold ${
                    STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {safeText(project.status, 'Project')}
                </span>

                {project.isNew && (
                  <span className="badge bg-red-500 text-white border-0 text-xs">
                    🔥 NEW LAUNCH
                  </span>
                )}

                {project.isVerified && (
                  <span className="badge bg-green-100 text-green-800 border-green-200 text-xs">
                    ✓ RERA Verified
                  </span>
                )}

                <ViewingCount projectName={project.name} />
                <ScarcityBadge units={4} />
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                {project.name}
              </h1>

              <p className="text-white/70 mb-3">
                by{' '}
                <span className="font-medium text-white/90">
                  {builderName}
                </span>
              </p>

              <div className="flex flex-wrap gap-4 text-white/80 text-sm mb-5">
                <span>📍 {safeText(project.location)}</span>
                <span>
                  🏢 {safeText(project.totalTowers, 'N/A')} Towers ·{' '}
                  {safeText(project.floors, 'N/A')}
                </span>
                <span>🏠 {safeText(project.totalUnits, 'N/A')} Units</span>
                <span>📐 {safeText(project.totalArea, 'N/A')}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-5">
                <div className="col-span-2 relative h-64">
                  <Image
                    src={mainImage}
                    alt={`${project.name} exterior`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {(gallery.length > 1 ? gallery.slice(1, 3) : [mainImage, mainImage]).map(
                    (img: string, i: number) => (
                      <div key={i} className="relative flex-1">
                        <Image
                          src={safeImage(img)}
                          alt={`${project.name} view ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {configurations.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                  {configurations.map((c: string) => (
                    <div
                      key={c}
                      className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-white/60 text-xs">Starting Price</span>
                  <br />
                  <span className="text-2xl font-display font-bold text-brand-accent">
                    {safeText(project.price, 'Price on Request')}
                  </span>
                </div>

                <div>
                  <span className="text-white/60 text-xs">Price/sqft</span>
                  <br />
                  <span className="text-white font-semibold">
                    {safeText(project.pricePerSqft, 'On Request')}
                  </span>
                </div>

                <div>
                  <span className="text-white/60 text-xs">Possession</span>
                  <br />
                  <span className="text-white font-semibold">
                    {safeText(project.possession, 'On Request')}
                  </span>
                </div>

                <div>
                  <span className="text-white/60 text-xs">RERA</span>
                  <br />
                  <span className="text-white/80 text-xs font-mono">
                    {reraNumber}
                  </span>
                </div>

                <div>
                  <span className="text-white/60 text-xs">3Y Appreciation</span>
                  <br />
                  <span className="text-green-400 font-bold">
                    {safeText(project.appreciationRate, 'N/A')}
                  </span>
                </div>

                <div>
                  <span className="text-white/60 text-xs">Rental Yield</span>
                  <br />
                  <span className="text-brand-accent font-bold">
                    {safeText(project.rentalYield, 'N/A')}
                  </span>
                </div>
              </div>

              <ROICalculator />
            </div>

            <div className="space-y-4" id="enquiry-form">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-brand-dark px-5 py-4">
                  <PriceCountdown />
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold text-brand-text mb-0.5">
                    Get Full Price Details
                  </h3>
                  <p className="text-brand-muted text-xs mb-4">
                    Free advisory · No obligation · RERA verified
                  </p>
                  <LeadForm compact projectName={project.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                About {project.name}
              </h2>
              <p className="text-brand-muted leading-relaxed">
                {safeText(project.description, `${project.name} is a residential project in Bhiwadi.`)}
              </p>
            </section>

            {whyBuy.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Why Buy in {project.name}?
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {whyBuy.map((w: string) => (
                    <div
                      key={w}
                      className="flex items-start gap-2.5 bg-brand-mint/30 rounded-xl p-4 border border-brand-border/40"
                    >
                      <span className="text-brand-accent font-bold text-lg mt-0.5">
                        ✓
                      </span>
                      <span className="text-brand-muted text-sm leading-relaxed">
                        {w}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Project Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h: string) => (
                    <div
                      key={h}
                      className="flex items-start gap-2.5 bg-white rounded-xl p-4 border border-brand-border/40 shadow-sm"
                    >
                      <span className="text-brand-accent font-bold text-lg">
                        ★
                      </span>
                      <span className="text-brand-muted text-sm leading-relaxed">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {gallery.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img: string, i: number) => (
                    <div
                      key={`${img}-${i}`}
                      className="relative h-40 rounded-2xl overflow-hidden group"
                    >
                      <Image
                        src={safeImage(img)}
                        alt={`${project.name} — view ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {floorPlans.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Floor Plans & Price List
                </h2>

                <div className="bg-white border border-brand-border/40 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-dark text-white text-left">
                        <th className="px-5 py-3 font-medium">Configuration</th>
                        <th className="px-5 py-3 font-medium">Area</th>
                        <th className="px-5 py-3 font-medium">Starting Price</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {floorPlans.map((fp: any, i: number) => (
                        <tr
                          key={`${fp.config}-${i}`}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-brand-mint/20'}
                        >
                          <td className="px-5 py-3.5 font-semibold text-brand-text">
                            {safeText(fp.config)}
                          </td>
                          <td className="px-5 py-3.5 text-brand-muted">
                            {safeText(fp.area)}
                          </td>
                          <td className="px-5 py-3.5 text-brand-dark font-bold">
                            {safeText(fp.price)}
                          </td>
                          <td className="px-5 py-3.5">
                            <LeadCTA ctaType="price_list" projectName={project.name}
                              className="text-xs text-brand-dark font-semibold hover:text-brand-accent">
                              Get Details →
                            </LeadCTA>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-brand-muted text-xs mt-2">
                  * Prices are indicative. PLC, EDC/IDC, parking and GST are additional.
                </p>
              </section>
            )}

            {amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((a: string) => (
                    <div
                      key={a}
                      className="flex items-center gap-2 bg-brand-mint/20 rounded-xl p-3 text-sm text-brand-muted border border-brand-border/30"
                    >
                      <span className="text-brand-accent font-bold text-base">
                        ✓
                      </span>
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(connectivity.length > 0 || nearbyLandmarks.length > 0) && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  Location & Connectivity
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  {connectivity.length > 0 && (
                    <div className="bg-white border border-brand-border/40 rounded-2xl p-5">
                      <h3 className="font-semibold text-brand-text mb-3">
                        Connectivity
                      </h3>
                      <ul className="space-y-2">
                        {connectivity.map((c: string) => (
                          <li
                            key={c}
                            className="flex items-start gap-2 text-brand-muted text-sm"
                          >
                            <span className="text-brand-accent font-bold mt-0.5">
                              →
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nearbyLandmarks.length > 0 && (
                    <div className="bg-white border border-brand-border/40 rounded-2xl p-5">
                      <h3 className="font-semibold text-brand-text mb-3">
                        Nearby Landmarks
                      </h3>
                      <ul className="space-y-2">
                        {nearbyLandmarks.map((l: string) => (
                          <li
                            key={l}
                            className="flex items-start gap-2 text-brand-muted text-sm"
                          >
                            <span className="text-brand-accent font-bold mt-0.5">
                              📍
                            </span>
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-brand-mint/20 border border-brand-border/40 rounded-2xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-brand-muted text-sm mb-2">
                      📍 {safeText(project.location)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        safeText(project.location, project.name)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-dark text-sm font-semibold underline hover:text-brand-accent"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </section>
            )}


            <div className="bg-white border border-brand-border/40 rounded-2xl p-5">
              <h3 className="font-semibold text-brand-text mb-3 text-sm">
                Investment Snapshot
              </h3>

              {[
                {
                  l: '3-Year Appreciation',
                  v: safeText(project.appreciationRate, 'N/A'),
                  color: 'text-green-600',
                },
                {
                  l: 'Rental Yield p.a.',
                  v: safeText(project.rentalYield, 'N/A'),
                  color: 'text-blue-600',
                },
                {
                  l: 'Min Investment',
                  v: project.priceMin ? `₹${project.priceMin} Lakh` : 'On Request',
                  color: 'text-brand-dark',
                },
                {
                  l: 'Max Investment',
                  v: project.priceMax ? `₹${project.priceMax} Lakh` : 'On Request',
                  color: 'text-brand-dark',
                },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-brand-muted text-xs">{s.l}</span>
                  <span className={`font-bold text-sm ${s.color}`}>{s.v}</span>
                </div>
              ))}
            </div>

            <section>
              <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                RERA & Legal Details
              </h2>

              <div className="bg-white border border-brand-border/40 rounded-2xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  {[
                    { l: 'RERA Number', v: reraNumber || 'Available on Request' },
                    { l: 'Builder', v: builderName },
                    ...(builderReraId
                      ? [{ l: 'Builder RERA ID', v: builderReraId }]
                      : []),
                    { l: 'Project Status', v: safeText(project.status) },
                    { l: 'Possession', v: safeText(project.possession) },
                    { l: 'Total Units', v: safeText(project.totalUnits, 'N/A') },
                    { l: 'Total Towers', v: safeText(project.totalTowers, 'N/A') },
                    { l: 'Total Area', v: safeText(project.totalArea, 'N/A') },
                    { l: 'Floors', v: safeText(project.floors, 'N/A') },
                    { l: 'IGBC Certified', v: 'Green Gold' },
                  ].map((f) => (
                    <div key={f.l}>
                      <div className="text-brand-muted text-xs mb-0.5">
                        {f.l}
                      </div>
                      <div className="font-semibold text-brand-text">
                        {f.v}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-brand-muted text-xs">
                  Verify registration on{' '}
                  <a
                    href="https://rrerarajasthan.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-dark underline"
                  >
                    rrerarajasthan.in
                  </a>{' '}
                  using RERA number {reraNumber || 'provided by developer'}
                </p>
              </div>
            </section>

            {faqs.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-brand-text mb-4">
                  FAQs — {project.name}
                </h2>

                <div className="space-y-3">
                  {faqs.map((faq: any, i: number) => (
                    <details
                      key={i}
                      className="bg-brand-mint/20 rounded-2xl border border-brand-border/50 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-brand-text text-sm list-none">
                        {safeText(faq.q, faq.question || 'Question')}
                        <span className="text-brand-accent text-lg ml-4 flex-shrink-0">
                          +
                        </span>
                      </summary>

                      <div className="px-5 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border/40 pt-3">
                        {safeText(faq.a, faq.answer || 'Answer available on request.')}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-brand-dark rounded-2xl p-5 text-white sticky top-24">
              <h3 className="font-display font-bold mb-1">
                Interested in {project.name.split(' ').slice(0, 2).join(' ')}?
              </h3>

              <p className="text-white/70 text-sm mb-4">
                Get price list, floor plans and brochure on WhatsApp — free.
              </p>

              <div className="space-y-2.5">
                <LeadCTA ctaType="price_list" projectName={project.name} className="btn-primary w-full text-center block">
                  📋 Get Price List
                </LeadCTA>

                <LeadCTA ctaType="brochure" projectName={project.name} className="btn-white w-full text-center block">
                  📄 Download Brochure
                </LeadCTA>

                <LeadCTA ctaType="site_visit_request" projectName={project.name}
                  className="border border-white/30 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full text-center block hover:bg-white/10 transition-colors"
                >
                  🏠 Book Free Site Visit
                </LeadCTA>

                <a
                  href={`https://wa.me/${
                    (settings.whatsapp || '918619930583').replace(/[^+\d]/g, '')
                  }?text=${encodeURIComponent(
                    `Hi, I am interested in ${project.name}. Please share complete details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full hover:bg-green-600 transition-colors"
                >
                  💬 WhatsApp Details
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50 space-y-1">
                <div>
                  📞 Call: {settings.phone || '+91-8619930583'}
                </div>
                <div>⚡ Advisor responds in &lt; 2 hours</div>
                <div>🔒 Your info is private and secure</div>
              </div>
            </div>
          </div>
        </div>

        {sameCorridor.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-brand-text">
                  More Projects on {project.corridor}
                </h2>
                <p className="text-brand-muted text-sm mt-0.5">
                  Other verified projects in the same location
                </p>
              </div>

              <Link
                href={`/${locationSlug}`}
                className="text-brand-dark text-sm font-semibold hover:text-brand-accent"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sameCorridor.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}

        {similarBudget.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-brand-text">
                  Similar Budget Projects
                </h2>
                <p className="text-brand-muted text-sm mt-0.5">
                  Projects in the {safeText(project.price, 'same')} range across Bhiwadi
                </p>
              </div>

              <Link
                href="/residential-property-in-bhiwadi"
                className="text-brand-dark text-sm font-semibold hover:text-brand-accent"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similarBudget.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ScrollTriggerModal projectName={project.name} />
      <InternalLinksBlock currentPage={`/project/${project.slug}`} />

      <section className="py-16 bg-brand-dark" id="lead-form">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Get Complete Details for {project.name}
          </h2>
          <p className="text-white/70 mb-8">
            Price list · Floor plans · Payment schedule · Brochure — all on WhatsApp in minutes.
          </p>
          <LeadForm projectName={project.name} />
        </div>
      </section>
    </>
  );
}