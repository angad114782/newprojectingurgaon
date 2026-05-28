import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogs } from '@/lib/api-blogs';
import { fetchSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/blog`;
  const settings = await fetchSettings();

  const title = 'Gurgaon Real Estate Blog | Property Investment Guides & Market Updates';
  const description = `Read expert guides on buying property in Gurgaon — investment advice, sector analysis, RERA tips and market trends from ${settings.siteName} advisors.`;

  return {
    title,
    description,
    keywords: [
      'gurgaon real estate blog', 'property investment guide gurgaon', 'gurgaon property market 2025',
      'buy property in gurgaon guide', 'dwarka expressway investment', 'rera gurgaon guide',
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      title,
      description,
      url: pageUrl,
      siteName: settings.siteName,
      locale: 'en_IN',
      images: [{ url: `${siteUrl}/og-home.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPage() {
  const [blogs, settings] = await Promise.all([fetchBlogs(), fetchSettings()]);

  // Fallback static blogs if DB is empty
  const staticBlogs = [
    { slug: 'best-sectors-to-invest-in-gurgaon', title: 'Best Sectors to Invest in Gurgaon in 2025', excerpt: 'A sector-by-sector breakdown of where smart money is going in Gurgaon real estate in 2025.', category: 'Investment Guide', date: '2025-03-01', readTime: '8 min', heroImage: '', author: { name: 'New Projects in Gurgaon' } },
    { slug: 'dwarka-expressway-investment-guide', title: "Dwarka Expressway Investment Guide 2025 — Why It's Still Gurgaon's Best Bet", excerpt: 'Everything you need to know before investing in a property on Dwarka Expressway.', category: 'Investment Guide', date: '2025-02-01', readTime: '10 min', heroImage: '', author: { name: 'New Projects in Gurgaon' } },
    { slug: 'new-launch-vs-ready-to-move-property', title: 'New Launch vs Ready to Move Property in Gurgaon — What Should You Buy?', excerpt: 'A detailed comparison of new launch and ready-to-move properties in Gurgaon.', category: 'Buying Guide', date: '2025-01-01', readTime: '7 min', heroImage: '', author: { name: 'New Projects in Gurgaon' } },
    { slug: 'how-to-check-rera-before-buying-property', title: 'How to Check RERA Registration Before Buying a Property in Gurgaon', excerpt: "Step-by-step guide to verifying a project's RERA status on haryanarera.gov.in.", category: 'Legal & RERA', date: '2024-12-01', readTime: '5 min', heroImage: '', author: { name: 'New Projects in Gurgaon' } },
    { slug: 'best-builders-in-gurgaon', title: 'Best Builders in Gurgaon — Ranked by Delivery Record, Quality & Trust', excerpt: 'An honest ranking of top real estate builders in Gurgaon — DLF, Sobha, Godrej, M3M and more.', category: 'Builder Guide', date: '2024-11-01', readTime: '9 min', heroImage: '', author: { name: 'New Projects in Gurgaon' } },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : staticBlogs;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${settings.siteName?.toLowerCase().replace(/\s+/g, '')}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium">Blog</span>
        </div>
      </nav>

      <section className="hero-gradient py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <span className="inline-block bg-brand-accent/20 text-brand-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              📚 Gurgaon Real Estate Blog
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Expert Guides on Gurgaon Property
            </h1>
            <p className="text-white/80">
              Investment advice, sector analysis, RERA guidance and market trends from our property advisors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBlogs.map((blog: any) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="card group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 rounded-t-2xl overflow-hidden bg-gradient-to-br from-brand-dark to-[#06616B] flex items-center justify-center">
                  {blog.heroImage ? (
                    <Image
                      src={blog.heroImage}
                      alt={blog.title}
                      width={400}
                      height={176}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/30 text-5xl">📝</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge bg-brand-mint text-brand-dark border border-brand-border text-xs">{blog.category}</span>
                    <span className="text-brand-muted text-xs">{blog.readTime} read</span>
                  </div>
                  <h2 className="font-display font-semibold text-brand-text text-base mb-2 group-hover:text-brand-dark leading-snug">
                    {blog.title}
                  </h2>
                  <p className="text-brand-muted text-sm leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  {blog.author?.name && (
                    <p className="text-xs text-brand-muted mt-2">By {blog.author.name}</p>
                  )}
                  <div className="mt-3 text-brand-dark text-sm font-semibold">Read More →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-brand-mint/30 border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-brand-muted text-sm mb-4 text-center">Related Pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
              { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
              { label: 'Dwarka Expressway', href: '/dwarka-expressway-projects' },
              { label: 'Residential Property', href: '/residential-property-in-gurgaon' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="bg-white border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
