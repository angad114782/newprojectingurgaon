import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import LeadCTA from '@/components/lead/LeadCTA';
import { fetchBlogPost } from '@/lib/api-blogs';
import { fetchSettings } from '@/lib/settings';

// Fallback static data for slugs that exist in DB when API is down
const STATIC_BLOGS: Record<string, any> = {
  'best-sectors-to-invest-in-gurgaon': {
    title: 'Best Sectors to Invest in Gurgaon in 2025',
    category: 'Investment Guide', date: '2025-03-01', readTime: '8 min',
    author: { name: 'Rahul Sharma', credentials: 'Certified Property Advisor, 8 years in Gurgaon real estate', bio: 'Senior advisor at New Projects in Gurgaon with expertise in Dwarka Expressway and Golf Course Road micro-markets.' },
    keywords: ['best sectors gurgaon investment', 'where to invest gurgaon 2025', 'dwarka expressway investment', 'golf course extension road property', 'new gurgaon sectors'],
    intro: "Gurgaon's real estate market in 2025 is more nuanced than ever. Not every sector offers the same growth story, and choosing the wrong micro-market can mean the difference between 15% and 40% returns over three years. Here's our honest, data-backed ranking of the best sectors to invest in Gurgaon.",
    sections: [
      { heading: '1. Dwarka Expressway — Best Overall Investment Corridor', content: "Dwarka Expressway (Sectors 99–115) remains Gurgaon's strongest investment corridor. With 30–45% appreciation in 3 years, airport proximity, Metro Phase II and premium builders, it offers the best combination of risk and reward. Sector 113 is the top pick for airport zone premium; Sector 102–106 for mid-segment value.", link: '/dwarka-expressway-projects', linkText: 'Explore Dwarka Expressway Projects →' },
      { heading: '2. Golf Course Extension Road — Premium Living, Stable Returns', content: 'GCER (Sectors 57–75) is the premium residential belt offering stable 20–28% appreciation with strong rental demand from Cyber City professionals. Projects by Emaar, M3M and Sobha dominate. Best for end-users who want quality lifestyle and investors with a 3+ year horizon.', link: '/golf-course-extension-road-projects', linkText: 'Explore Golf Course Extension Road →' },
      { heading: '3. SPR Road — High ROI Emerging Corridor', content: 'Southern Peripheral Road (Sectors 65–85) connects Sohna Road to Dwarka Expressway and has shown 30–35% appreciation. M3M and Emaar\'s premium projects here offer strong investment upside as commercial development matures. Best for investors with 3–5 year horizon.', link: '/spr-road-projects', linkText: 'Explore SPR Road Projects →' },
      { heading: '4. New Gurgaon (Sectors 81–95) — Best Entry-Level Investment', content: 'New Gurgaon offers the lowest entry point in Gurgaon real estate (₹4,000–5,500/sqft) with 4–5% rental yields from Manesar industrial demand. Appreciation is moderate (15–20%) but consistent. Best for investors seeking rental income over capital gains.', link: '/new-gurgaon-projects', linkText: 'Explore New Gurgaon Projects →' },
    ],
    relatedLinks: [
      { label: 'New Launch Projects in Gurgaon', href: '/new-launch-projects-in-gurgaon' },
      { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
      { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
    ],
  },
  'dwarka-expressway-investment-guide': {
    title: "Dwarka Expressway Investment Guide 2025 — Why It's Still Gurgaon's Best Bet",
    category: 'Investment Guide', date: '2025-02-01', readTime: '10 min',
    author: { name: 'Priya Verma', credentials: 'Senior Property Consultant, 6 years Dwarka Expressway specialist', bio: 'Property consultant at New Projects in Gurgaon specialising in Dwarka Expressway and airport-zone properties.' },
    keywords: ['dwarka expressway investment guide', 'dwarka expressway property 2025', 'sector 113 gurgaon', 'dwarka expressway price trends', 'gurgaon airport zone property'],
    intro: 'Dwarka Expressway opened to full traffic in 2024 and immediately transformed into one of India\'s most dynamic real estate corridors. If you\'re thinking about investing in Gurgaon property in 2025, here\'s everything you need to know about Dwarka Expressway.',
    sections: [
      { heading: "Why Dwarka Expressway is Gurgaon's Best Investment", content: "Three things drive Dwarka Expressway's value: IGI Airport at 15 minutes, the Delhi border at 2 km (limited supply pressure), and premium builders choosing this corridor for flagship projects. The result is a market that has outperformed most Gurgaon micro-markets over the past 5 years.", link: '/dwarka-expressway-projects', linkText: 'View All Dwarka Expressway Projects →' },
      { heading: 'Sector-Wise Analysis', content: 'Sector 113 is the premium end — airport access, Metro Phase II and Delhi proximity. Sectors 106–109 are the sweet spot for mid-premium buyers with Godrej, Sobha and M3M projects. Sectors 99–105 offer the most affordable entry points with moderate appreciation.', link: '/sector-113-gurgaon-property', linkText: 'Explore Sector 113 →' },
      { heading: 'Price Trends and Appreciation', content: 'Average prices on Dwarka Expressway moved from ₹5,200/sqft in 2021 to ₹8,500–11,000/sqft in 2024 — a 40–60% increase. This growth is supported by genuine end-user demand, not speculative buying, making it sustainable through 2025–27.', link: '/new-launch-projects-in-gurgaon', linkText: 'View New Launch Options →' },
    ],
    relatedLinks: [
      { label: 'Sector 113 Gurgaon Property', href: '/sector-113-gurgaon-property' },
      { label: 'Sector 106 Gurgaon Property', href: '/sector-106-gurgaon-property' },
      { label: 'Sector 102 Gurgaon Property', href: '/sector-102-gurgaon-property' },
      { label: 'New Launch Projects Gurgaon', href: '/new-launch-projects-in-gurgaon' },
    ],
  },
  'new-launch-vs-ready-to-move-property': {
    title: 'New Launch vs Ready to Move Property in Gurgaon — What Should You Buy?',
    category: 'Buying Guide', date: '2025-01-01', readTime: '7 min',
    author: { name: 'Amit Kapoor', credentials: 'Real Estate Advisor, IIM-A Alumni', bio: 'Investment advisor at New Projects in Gurgaon with a background in finance and 5 years advising Gurgaon property buyers.' },
    keywords: ['new launch vs ready to move gurgaon', 'buy flat gurgaon 2025', 'new launch property benefits', 'ready to move gurgaon', 'rera verified projects gurgaon'],
    intro: "One of the most common questions from Gurgaon property buyers is: should I buy a new launch and wait 3–4 years, or pay more for a ready-to-move home? The right answer depends on your goals, risk appetite and financial situation.",
    sections: [
      { heading: 'New Launch: Lower Price, Higher Wait', content: 'New launch projects in Gurgaon are typically priced 10–25% lower than ready-to-move equivalents. This price gap represents your potential appreciation — if the project delivers on time and the builder is credible. The risk is delay or quality compromise. Stick to RERA-verified projects from builders with clean delivery records.', link: '/new-launch-projects-in-gurgaon', linkText: 'View New Launch Projects →' },
      { heading: 'Ready to Move: No Wait, Higher Price, Immediate Value', content: "Ready-to-move properties eliminate construction risk and let you start rental income or self-use immediately. In Gurgaon, RTM options on Golf Course Road, Sector 54 and parts of Dwarka Expressway offer excellent quality and immediate possession.", link: '/new-projects-in-gurgaon', linkText: 'View Ready to Move Options →' },
      { heading: 'Our Recommendation', content: 'For investors: new launch on Dwarka Expressway from Sobha, Godrej or M3M offers the best return potential. For end-users: ready-to-move eliminates risk and gives you the home immediately. For hybrid buyers: under-construction with possession in 12–18 months is the sweet spot.', link: '/residential-property-in-gurgaon', linkText: 'Explore Residential Property →' },
    ],
    relatedLinks: [
      { label: 'New Launch Projects Gurgaon', href: '/new-launch-projects-in-gurgaon' },
      { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      { label: 'Residential Property Gurgaon', href: '/residential-property-in-gurgaon' },
      { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
    ],
  },
  'how-to-check-rera-before-buying-property': {
    title: 'How to Check RERA Registration Before Buying a Property in Gurgaon',
    category: 'Legal & RERA', date: '2024-12-01', readTime: '5 min',
    author: { name: 'Neha Gupta', credentials: 'Property Legal Consultant, LLB', bio: 'Legal and compliance advisor at New Projects in Gurgaon with expertise in RERA matters and property documentation.' },
    keywords: ['check rera gurgaon', 'haryana rera portal', 'rera verified projects', 'how to verify rera', 'rera gurgaon property'],
    intro: "RERA (Real Estate Regulatory Authority) is your biggest protection as a property buyer in Gurgaon. Before you book any project, verify its RERA status on the Haryana RERA portal. Here's exactly how to do it.",
    sections: [
      { heading: 'Step 1: Visit Haryana RERA Portal', content: 'Go to haryanarera.gov.in. This is the official Haryana RERA website. Look for the "Projects" section in the navigation. All RERA-registered projects in Haryana (including Gurgaon) are listed here with full details.', link: '/new-projects-in-gurgaon', linkText: 'View RERA Verified Projects on New Projects in Gurgaon →' },
      { heading: 'Step 2: Search by Project Name or RERA Number', content: 'Use the search function to find your project. Enter the project name or the RERA registration number provided by the developer. Verify: Registration number, Project name, Builder name, Completion date, Land area, and Number of units.', link: '/new-launch-projects-in-gurgaon', linkText: 'New Launch Projects — All RERA Verified →' },
      { heading: 'Key Red Flags to Watch For', content: "Be cautious if: the project is not found on RERA (illegal), the possession date is significantly past the current date, the builder has multiple RERA complaints on the portal, or the project details don't match what the builder told you.", link: '/residential-property-in-gurgaon', linkText: 'Safe, Verified Residential Properties →' },
    ],
    relatedLinks: [
      { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
      { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      { label: 'Residential Property', href: '/residential-property-in-gurgaon' },
    ],
  },
  'best-builders-in-gurgaon': {
    title: 'Best Builders in Gurgaon — Ranked by Delivery Record, Quality & Trust',
    category: 'Builder Guide', date: '2024-11-01', readTime: '9 min',
    author: { name: 'Vikram Malhotra', credentials: 'Property Analyst, 10 years Gurgaon market', bio: 'Senior property analyst at New Projects in Gurgaon with deep expertise in builder track records and project quality assessment.' },
    keywords: ['best builders gurgaon', 'dlf gurgaon', 'sobha gurgaon', 'godrej properties gurgaon', 'top builders gurgaon 2025', 'm3m gurgaon'],
    intro: "Choosing the right builder is often more important than choosing the right project. A great location with a bad builder can mean years of delay and quality compromise. Here's our honest ranking of Gurgaon's top builders.",
    sections: [
      { heading: '1. Sobha Limited — Best for Quality', content: "Sobha is widely regarded as India's most quality-conscious developer. Their Gurgaon projects feature in-house construction, superior finishing and on-time delivery. Premium pricing but worth it for quality seekers.", link: '/project/sobha-city-gurgaon', linkText: 'View Sobha City Gurgaon →' },
      { heading: '2. DLF — Best for Brand & Resale Value', content: "DLF is Gurgaon's founding developer and the most trusted brand. DLF 5, Golf Course Road and Camellias are iconic addresses with the highest resale premiums. Their projects command loyalty from HNI and NRI buyers.", link: '/project/dlf-the-crest-gurgaon', linkText: 'View DLF The Crest →' },
      { heading: '3. Godrej Properties — Best for Mid-Premium', content: 'Godrej has built a strong reputation in Gurgaon for delivering what they promise. Godrej Meridien, Godrej Summit and Serenity are well-executed projects at competitive prices. Good choice for value-conscious premium buyers.', link: '/project/godrej-meridien-gurgaon', linkText: 'View Godrej Meridien →' },
      { heading: '4. Tata Housing — Best for Trust & Ethics', content: "Tata's entry into Gurgaon real estate brought the Tata brand's ethics and reliability. Tata Primanti and Tata One are well-regarded for transparency and construction quality.", link: '/new-projects-in-gurgaon', linkText: 'View Tata Projects →' },
    ],
    relatedLinks: [
      { label: 'New Projects in Gurgaon', href: '/new-projects-in-gurgaon' },
      { label: 'New Launch Projects', href: '/new-launch-projects-in-gurgaon' },
      { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      { label: 'Residential Property', href: '/residential-property-in-gurgaon' },
    ],
  },
};

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const keys = Object.keys(STATIC_BLOGS);
  return keys.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/blog/${params.slug}`;

  const [blog, settings] = await Promise.all([
    fetchBlogPost(params.slug),
    fetchSettings(),
  ]);
  const post = blog || STATIC_BLOGS[params.slug];
  if (!post) return { title: 'Blog | New Projects in Gurgaon' };

  const title = `${post.title} | ${settings.siteName}`;
  const description = post.excerpt || (post.intro ? post.intro.substring(0, 155) + '…' : '');
  const ogImage = post.heroImage || `${siteUrl}/og-home.jpg`;

  return {
    title,
    description,
    keywords: post.keywords?.length ? post.keywords : [
      post.category?.toLowerCase(), 'gurgaon property', 'real estate gurgaon',
    ].filter(Boolean),
    authors: post.author?.name
      ? [{ name: post.author.name }]
      : [{ name: settings.siteName, url: siteUrl }],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      title,
      description,
      url: pageUrl,
      siteName: settings.siteName,
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      modifiedTime: post.dateModified || post.date,
      authors: post.author?.name ? [post.author.name] : [settings.siteName],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const siteUrl = `${proto}://${host}`;
  const pageUrl = `${siteUrl}/blog/${params.slug}`;

  const [blog, settings] = await Promise.all([
    fetchBlogPost(params.slug),
    fetchSettings(),
  ]);

  const post = blog || STATIC_BLOGS[params.slug];
  if (!post) notFound();

  const authorName = post.author?.name || settings.siteName;
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = post.dateModified ? new Date(post.dateModified).toISOString() : publishDate;
  const displayDate = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Article JSON-LD — full E-E-A-T schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': pageUrl,
    headline: post.title,
    description: post.excerpt || post.intro?.substring(0, 155),
    url: pageUrl,
    datePublished: publishDate,
    dateModified: modifiedDate,
    image: post.heroImage || `${siteUrl}/og-home.jpg`,
    inLanguage: 'en-IN',
    author: {
      '@type': 'Person',
      name: authorName,
      ...(post.author?.credentials ? { description: post.author.credentials } : {}),
      ...(post.author?.avatar ? { image: post.author.avatar } : {}),
      worksFor: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: settings.siteName,
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: settings.siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    articleSection: post.category,
    keywords: post.keywords?.join(', '),
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website` },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-brand-dark">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium line-clamp-1">{post.title}</span>
        </div>
      </nav>

      <section className="hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-brand-accent/20 text-brand-accent border-0">{post.category}</span>
            <span className="text-white/60 text-sm">{displayDate} · {post.readTime} read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">{post.title}</h1>
          {post.author?.name && (
            <div className="flex items-center gap-3 mt-5">
              {post.author.avatar && (
                <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="rounded-full w-10 h-10 object-cover" />
              )}
              <div>
                <p className="text-white font-medium text-sm">By {post.author.name}</p>
                {post.author.credentials && <p className="text-white/60 text-xs">{post.author.credentials}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {post.heroImage && (
        <div className="max-w-3xl mx-auto px-4 -mt-6 mb-2">
          <Image
            src={post.heroImage}
            alt={post.title}
            width={800}
            height={420}
            className="rounded-2xl w-full object-cover shadow-lg"
          />
        </div>
      )}

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {post.intro && (
            <p className="text-brand-muted text-lg leading-relaxed mb-10 border-l-4 border-brand-accent pl-5">
              {post.intro}
            </p>
          )}

          <div className="space-y-10">
            {(post.sections || []).map((section: any, i: number) => (
              <div key={i}>
                <h2 className="text-xl font-display font-bold text-brand-text mb-3">{section.heading}</h2>
                <p className="text-brand-muted leading-relaxed mb-3">{section.content}</p>
                {section.link && (
                  <Link href={section.link} className="inline-flex items-center text-brand-dark font-semibold text-sm hover:text-brand-accent transition-colors">
                    {section.linkText}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {post.author?.bio && (
            <div className="mt-12 bg-brand-mint/30 border border-brand-border/40 rounded-2xl p-5 flex gap-4 items-start">
              {post.author.avatar && (
                <Image src={post.author.avatar} alt={post.author.name} width={56} height={56} className="rounded-full w-14 h-14 object-cover shrink-0" />
              )}
              <div>
                <p className="font-semibold text-brand-text text-sm">{post.author.name}</p>
                {post.author.credentials && <p className="text-brand-dark text-xs mb-1">{post.author.credentials}</p>}
                <p className="text-brand-muted text-sm">{post.author.bio}</p>
              </div>
            </div>
          )}

          <div className="mt-12 bg-brand-dark rounded-2xl p-6 text-white">
            <h3 className="font-display font-bold text-lg mb-2">Need Help Finding the Right Property?</h3>
            <p className="text-white/70 text-sm mb-4">Our advisors will match you with verified projects based on your budget, location preference and investment goals.</p>
            <LeadCTA ctaType="site_visit_request" className="btn-primary">Get Free Advisory →</LeadCTA>
          </div>

          {(post.relatedLinks || []).length > 0 && (
            <div className="mt-10">
              <p className="text-brand-muted text-sm font-medium mb-4">Related Pages</p>
              <div className="flex flex-wrap gap-3">
                {post.relatedLinks.map((l: any) => (
                  <Link key={l.href} href={l.href} className="bg-brand-mint border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
