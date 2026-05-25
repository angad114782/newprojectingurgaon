import type { Metadata } from 'next';
import Link from 'next/link';

const BLOGS: Record<string, any> = {
  'best-sectors-to-invest-in-gurgaon': {
    title: 'Best Sectors to Invest in Gurgaon in 2025',
    category: 'Investment Guide', date: 'March 2025', readTime: '8 min',
    intro: 'Gurgaon\'s real estate market in 2025 is more nuanced than ever. Not every sector offers the same growth story, and choosing the wrong micro-market can mean the difference between 15% and 40% returns over three years. Here\'s our honest, data-backed ranking of the best sectors to invest in Gurgaon.',
    sections: [
      { heading: '1. Dwarka Expressway — Best Overall Investment Corridor', content: 'Dwarka Expressway (Sectors 99–115) remains Gurgaon\'s strongest investment corridor. With 30–45% appreciation in 3 years, airport proximity, Metro Phase II and premium builders, it offers the best combination of risk and reward. Sector 113 is the top pick for airport zone premium; Sector 102–106 for mid-segment value.', link: '/dwarka-expressway-projects', linkText: 'Explore Dwarka Expressway Projects →' },
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
    title: 'Dwarka Expressway Investment Guide 2025 — Why It\'s Still Gurgaon\'s Best Bet',
    category: 'Investment Guide', date: 'February 2025', readTime: '10 min',
    intro: 'Dwarka Expressway opened to full traffic in 2024 and immediately transformed into one of India\'s most dynamic real estate corridors. If you\'re thinking about investing in Gurgaon property in 2025, here\'s everything you need to know about Dwarka Expressway.',
    sections: [
      { heading: 'Why Dwarka Expressway is Gurgaon\'s Best Investment', content: 'Three things drive Dwarka Expressway\'s value: IGI Airport at 15 minutes, the Delhi border at 2 km (limited supply pressure), and premium builders choosing this corridor for flagship projects. The result is a market that has outperformed most Gurgaon micro-markets over the past 5 years.', link: '/dwarka-expressway-projects', linkText: 'View All Dwarka Expressway Projects →' },
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
    category: 'Buying Guide', date: 'January 2025', readTime: '7 min',
    intro: 'One of the most common questions from Gurgaon property buyers is: should I buy a new launch and wait 3–4 years, or pay more for a ready-to-move home? The right answer depends on your goals, risk appetite and financial situation.',
    sections: [
      { heading: 'New Launch: Lower Price, Higher Wait', content: 'New launch projects in Gurgaon are typically priced 10–25% lower than ready-to-move equivalents. This price gap represents your potential appreciation — if the project delivers on time and the builder is credible. The risk is delay or quality compromise. Stick to RERA-verified projects from builders with clean delivery records.', link: '/new-launch-projects-in-gurgaon', linkText: 'View New Launch Projects →' },
      { heading: 'Ready to Move: No Wait, Higher Price, Immediate Value', content: 'Ready-to-move properties eliminate construction risk and let you start rental income or self-use immediately. In Gurgaon, RTM options on Golf Course Road, Sector 54 and parts of Dwarka Expressway offer excellent quality and immediate possession.', link: '/new-projects-in-gurgaon', linkText: 'View Ready to Move Options →' },
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
    category: 'Legal & RERA', date: 'December 2024', readTime: '5 min',
    intro: 'RERA (Real Estate Regulatory Authority) is your biggest protection as a property buyer in Gurgaon. Before you book any project, verify its RERA status on the Haryana RERA portal. Here\'s exactly how to do it.',
    sections: [
      { heading: 'Step 1: Visit Haryana RERA Portal', content: 'Go to haryanarera.gov.in. This is the official Haryana RERA website. Look for the "Projects" section in the navigation. All RERA-registered projects in Haryana (including Gurgaon) are listed here with full details.', link: '/new-projects-in-gurgaon', linkText: 'View RERA Verified Projects on GurgaonRealty →' },
      { heading: 'Step 2: Search by Project Name or RERA Number', content: 'Use the search function to find your project. Enter the project name or the RERA registration number provided by the developer. Verify: Registration number, Project name, Builder name, Completion date, Land area, and Number of units.', link: '/new-launch-projects-in-gurgaon', linkText: 'New Launch Projects — All RERA Verified →' },
      { heading: 'Key Red Flags to Watch For', content: 'Be cautious if: the project is not found on RERA (illegal), the possession date is significantly past the current date, the builder has multiple RERA complaints on the portal, or the project details don\'t match what the builder told you.', link: '/residential-property-in-gurgaon', linkText: 'Safe, Verified Residential Properties →' },
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
    category: 'Builder Guide', date: 'November 2024', readTime: '9 min',
    intro: 'Choosing the right builder is often more important than choosing the right project. A great location with a bad builder can mean years of delay and quality compromise. Here\'s our honest ranking of Gurgaon\'s top builders.',
    sections: [
      { heading: '1. Sobha Limited — Best for Quality', content: 'Sobha is widely regarded as India\'s most quality-conscious developer. Their Gurgaon projects (Sobha City, Sobha Aranya) feature in-house construction, superior finishing and on-time delivery. Premium pricing but worth it for quality seekers.', link: '/project/sobha-city-gurgaon', linkText: 'View Sobha City Gurgaon →' },
      { heading: '2. DLF — Best for Brand & Resale Value', content: 'DLF is Gurgaon\'s founding developer and the most trusted brand. DLF 5, Golf Course Road and Camellias are iconic addresses with the highest resale premiums. Their projects command loyalty from HNI and NRI buyers.', link: '/project/dlf-the-crest-gurgaon', linkText: 'View DLF The Crest →' },
      { heading: '3. Godrej Properties — Best for Mid-Premium', content: 'Godrej has built a strong reputation in Gurgaon for delivering what they promise. Godrej Meridien, Godrej Summit and Serenity are well-executed projects at competitive prices. Good choice for value-conscious premium buyers.', link: '/project/godrej-meridien-gurgaon', linkText: 'View Godrej Meridien →' },
      { heading: '4. Tata Housing — Best for Trust & Ethics', content: 'Tata\'s entry into Gurgaon real estate brought the Tata brand\'s ethics and reliability. Tata Primanti and Tata One are well-regarded for transparency and construction quality. Slightly conservative but no surprises.', link: '/new-projects-in-gurgaon', linkText: 'View Tata Projects →' },
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = BLOGS[params.slug];
  if (!blog) return { title: 'Blog | GurgaonRealty' };
  return {
    title: `${blog.title} | GurgaonRealty Blog`,
    description: blog.intro.substring(0, 155),
    alternates: { canonical: `https://www.gurgaonrealty.in/blog/${params.slug}` },
  };
}

export default function BlogPostPage({ params }: Props) {
  const blog = BLOGS[params.slug];
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mint/20">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-brand-text mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    datePublished: blog.date,
    author: { '@type': 'Organization', name: 'GurgaonRealty' },
    publisher: { '@type': 'Organization', name: 'GurgaonRealty', url: 'https://www.gurgaonrealty.in' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <nav className="bg-brand-mint/30 border-b border-brand-border/40 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-brand-dark">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-medium line-clamp-1">{blog.title}</span>
        </div>
      </nav>

      <section className="hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-brand-accent/20 text-brand-accent border-0">{blog.category}</span>
            <span className="text-white/60 text-sm">{blog.date} · {blog.readTime} read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">{blog.title}</h1>
        </div>
      </section>

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-brand-muted text-lg leading-relaxed mb-10 border-l-4 border-brand-accent pl-5">
            {blog.intro}
          </p>

          <div className="space-y-10">
            {blog.sections.map((section: any, i: number) => (
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

          <div className="mt-12 bg-brand-dark rounded-2xl p-6 text-white">
            <h3 className="font-display font-bold text-lg mb-2">Need Help Finding the Right Property?</h3>
            <p className="text-white/70 text-sm mb-4">Our advisors will match you with verified projects based on your budget, location preference and investment goals.</p>
            <Link href="/#lead-form" className="btn-primary">Get Free Advisory →</Link>
          </div>

          <div className="mt-10">
            <p className="text-brand-muted text-sm font-medium mb-4">Related Pages</p>
            <div className="flex flex-wrap gap-3">
              {blog.relatedLinks.map((l: any) => (
                <Link key={l.href} href={l.href} className="bg-brand-mint border border-brand-border/60 px-4 py-2 rounded-full text-brand-muted text-sm hover:text-brand-dark transition-all">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
