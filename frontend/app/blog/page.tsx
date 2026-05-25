import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gurgaon Real Estate Blog | Property Investment Guides & Market Updates',
  description: 'Read expert guides on buying property in Gurgaon — investment advice, sector analysis, RERA tips and market trends from GurgaonRealty advisors.',
  alternates: { canonical: 'https://www.gurgaonrealty.in/blog' },
};

const blogs = [
  {
    slug: 'best-sectors-to-invest-in-gurgaon',
    title: 'Best Sectors to Invest in Gurgaon in 2025',
    excerpt: 'A sector-by-sector breakdown of where smart money is going in Gurgaon real estate in 2025 — covering Dwarka Expressway, Golf Course Extension Road, SPR and New Gurgaon.',
    category: 'Investment Guide',
    date: 'March 2025',
    readTime: '8 min',
  },
  {
    slug: 'dwarka-expressway-investment-guide',
    title: 'Dwarka Expressway Investment Guide 2025 — Why It\'s Still Gurgaon\'s Best Bet',
    excerpt: 'Everything you need to know before investing in a property on Dwarka Expressway — sector-wise analysis, builder comparison, price trends and growth potential.',
    category: 'Investment Guide',
    date: 'February 2025',
    readTime: '10 min',
  },
  {
    slug: 'new-launch-vs-ready-to-move-property',
    title: 'New Launch vs Ready to Move Property in Gurgaon — What Should You Buy?',
    excerpt: 'A detailed comparison of new launch and ready-to-move properties in Gurgaon covering price difference, risk, return potential and tax implications.',
    category: 'Buying Guide',
    date: 'January 2025',
    readTime: '7 min',
  },
  {
    slug: 'how-to-check-rera-before-buying-property',
    title: 'How to Check RERA Registration Before Buying a Property in Gurgaon',
    excerpt: 'Step-by-step guide to verifying a project\'s RERA status on haryanarera.gov.in — what to check, what red flags to look for and how to avoid unregistered projects.',
    category: 'Legal & RERA',
    date: 'December 2024',
    readTime: '5 min',
  },
  {
    slug: 'best-builders-in-gurgaon',
    title: 'Best Builders in Gurgaon — Ranked by Delivery Record, Quality & Trust',
    excerpt: 'An honest ranking of top real estate builders in Gurgaon — DLF, Sobha, Godrej, M3M, Emaar, Tata, Hero Homes and more — compared on delivery, quality and buyer reviews.',
    category: 'Builder Guide',
    date: 'November 2024',
    readTime: '9 min',
  },
];

export default function BlogPage() {
  return (
    <>
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
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="card group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 bg-gradient-to-br from-brand-dark to-[#06616B] flex items-center justify-center rounded-t-2xl">
                  <span className="text-white/30 text-5xl">📝</span>
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
