import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogs } from '@/lib/api-blogs';
import { fetchSettings } from '@/lib/settings';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const pageUrl = `${siteUrl}/blog`;
  const settings = await fetchSettings();

  const title = 'Bhiwadi Real Estate Blog | Property Investment Guides & Market Updates';
  const description = `Read expert guides on buying property in Bhiwadi — investment advice, corridor analysis, RERA tips and market trends from ${settings.siteName} advisors.`;

  return {
    title,
    description,
    keywords: [
      'bhiwadi real estate blog', 'property investment guide bhiwadi', 'bhiwadi property market 2025',
      'buy property in bhiwadi guide', 'nh-48 bhiwadi investment', 'rera rajasthan guide',
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
    { slug: 'property-investment-in-bhiwadi-guide', title: 'Property Investment in Bhiwadi — Complete 2025 Guide', excerpt: 'A corridor-by-corridor breakdown of where smart money is going in Bhiwadi real estate in 2025.', category: 'Investment Guide', date: '2025-03-01', readTime: '8 min', heroImage: '', author: { name: 'Priya Arora', designation: 'Senior Property Advisor' } },
    { slug: 'nh-48-bhiwadi-investment-guide', title: 'NH-48 Bhiwadi Investment Guide 2025 — Why It Is the Best Bet', excerpt: 'Everything you need to know before investing in a property on the NH-48 corridor in Bhiwadi.', category: 'Investment Guide', date: '2025-02-01', readTime: '10 min', heroImage: '', author: { name: 'Rahul Mehta', designation: 'Investment Consultant' } },
    { slug: 'new-launch-vs-ready-to-move-property', title: 'New Launch vs Ready to Move Property in Bhiwadi — What Should You Buy?', excerpt: 'A detailed comparison of new launch and ready-to-move properties in Bhiwadi.', category: 'Buying Guide', date: '2025-01-01', readTime: '7 min', heroImage: '', author: { name: 'Priya Arora', designation: 'Senior Property Advisor' } },
    { slug: 'how-to-check-rera-before-buying-property', title: 'How to Check RERA Registration Before Buying a Property in Bhiwadi', excerpt: "Step-by-step guide to verifying a project's RERA status on rrerarajasthan.in (Rajasthan RERA).", category: 'Legal & RERA', date: '2024-12-01', readTime: '5 min', heroImage: '', author: { name: 'Vikram Sharma', designation: 'RERA & Legal Expert' } },
    { slug: 'best-builders-in-bhiwadi', title: 'Best Builders in Bhiwadi — Ranked by Delivery Record, Quality & Trust', excerpt: 'An honest ranking of top real estate builders in Bhiwadi — Omaxe, Ashiana, GLS, Avalon, BPTP and more.', category: 'Builder Guide', date: '2024-11-01', readTime: '9 min', heroImage: '', author: { name: 'Rahul Mehta', designation: 'Investment Consultant' } },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : staticBlogs;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bhiwadi Real Estate Blog — Expert Property Guides',
    description: 'Investment guides, corridor analysis, RERA tips and market trends for Bhiwadi property buyers.',
    url: `${siteUrl}/blog`,
    numberOfItems: displayBlogs.length,
    itemListElement: displayBlogs.map((blog: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/blog/${blog.slug}`,
      name: blog.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

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
              📚 Bhiwadi Real Estate Blog
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Expert Guides on Bhiwadi Property
            </h1>
            <p className="text-white/80">
              Investment advice, corridor analysis, RERA guidance and market trends from our Bhiwadi property advisors.
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
                    <p className="text-xs text-brand-muted mt-2">
                      By <span className="font-medium text-brand-text">{blog.author.name}</span>
                      {blog.author.designation && <span className="text-brand-muted"> · {blog.author.designation}</span>}
                    </p>
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
          <p className="text-brand-muted text-sm font-semibold mb-4 text-center uppercase tracking-widest">Explore More</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
              { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
              { label: 'Alwar Bypass Projects', href: '/alwar-bypass-road-projects' },
              { label: 'NH-48 Bhiwadi Projects', href: '/nh-48-bhiwadi-projects' },
              { label: 'SPR Road Projects', href: '/spr-road-projects' },
              { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
              { label: 'Flats in Bhiwadi', href: '/flats-in-bhiwadi' },
              { label: 'Industrial Plots Bhiwadi', href: '/industrial-plots-bhiwadi' },
              { label: '2 BHK Flats Bhiwadi', href: '/2-bhk-flats-bhiwadi' },
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
