import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LeadCTA from '@/components/lead/LeadCTA';
import { fetchBlogPost } from '@/lib/api-blogs';
import { fetchSettings } from '@/lib/settings';
import { FAQSchema, HowToSchema } from '@/components/seo/SchemaMarkup';

// Fallback static data for slugs that exist in DB when API is down
const STATIC_BLOGS: Record<string, any> = {
  'property-investment-in-bhiwadi-guide': {
    title: 'Property Investment in Bhiwadi — Complete 2025 Guide',
    category: 'Investment Guide', date: '2025-03-01', readTime: '12 min',
    author: { name: 'Ajay Singh', credentials: 'Senior Property Advisor, 10 years Bhiwadi market specialist. Rajasthan RERA Agent.', bio: 'Senior advisor with decade-long expertise in Bhiwadi, Neemrana and Alwar Bypass corridor analysis.' },
    keywords: ['bhiwadi property investment guide', 'where to invest bhiwadi 2025', 'nh-48 bhiwadi property', 'alwar bypass road projects', 'bhiwadi real estate 2025'],
    intro: "Bhiwadi (Rajasthan) is one of India's fastest-growing industrial and residential markets. On the Delhi-Jaipur National Highway (NH-48), 55 km from Delhi and 35 km from Gurgaon, Bhiwadi offers what few markets in NCR can — affordable entry prices, high rental yields (4–6%), and robust industrial demand from 5,000+ RIICO units. Here is our corridor-by-corridor investment guide for 2025.",
    sections: [
      { heading: 'Rank 1: Alwar Bypass Road — Best Overall for End-Users', content: "Overall score: 9.0/10. Most popular residential corridor in Bhiwadi.\n\nWhy it ranks first: RIICO connectivity, social infrastructure (schools, hospitals, markets), and 20+ residential projects from builders like Omaxe, Avalon and Hero Homes.\n\nPrice range: ₹3,200–5,800/sqft. Appreciation 2022–2025: 28–40%.\nBest zones: Sectors 2–8, Alwar Bypass Road.\nBest for: Families, end-users, salaried professionals at industrial employers.", link: '/alwar-bypass-road-projects', linkText: 'Explore Alwar Bypass Road Projects →' },
      { heading: 'Rank 2: NH-48 Highway Corridor — Best ROI', content: "Overall score: 8.8/10. Highest investment ROI in Bhiwadi.\n\nWhy it ranks second: Direct Delhi-Jaipur highway frontage, Neemrana connectivity, and projects by Ashiana, BPTP and Adani.\n\nPrice range: ₹3,800–6,500/sqft. Appreciation 2022–2025: 30–45%.\nBest zones: Bhiwadi–Neemrana NH-48 stretch.\nBest for: Investors, NRIs, buyers seeking capital appreciation.", link: '/nh-48-bhiwadi-projects', linkText: 'Explore NH-48 Bhiwadi Projects →' },
      { heading: 'Rank 3: Tapukara (Honda Zone) — Highest Rental Yield', content: "Overall score: 8.3/10. Highest rental yield in the Bhiwadi region at 5.5–7%.\n\nTapukara houses the Honda HMSI plant with 15,000+ employees driving constant housing demand. GLS and Eldeco have projects here.\n\nPrice range: ₹2,800–4,500/sqft. Appreciation 2022–2025: 20–32%.\nBest for: Investors seeking rental income, buy-to-let strategy.", link: '/tapukara-bhiwadi-projects', linkText: 'Explore Tapukara Projects →' },
      { heading: 'Rank 4: Neemrana Japanese Zone — Premium Expat Market', content: "Overall score: 8.0/10. 50+ Japanese MNCs create premium expat housing demand.\n\nNeemrana is 25 km from Bhiwadi on NH-48. Japanese and Korean expats drive rents 30–50% above Bhiwadi average. BPTP Astaire Gardens is the flagship project here.\n\nPrice range: ₹4,200–7,000/sqft. Appreciation 2022–2025: 25–38%.\nBest for: NRI investors, expat housing providers, premium rental strategy.", link: '/neemrana-bhiwadi-projects', linkText: 'Explore Neemrana Projects →' },
      { heading: 'Corridors to Consider Carefully', content: "Bhiwadi Extension: Most affordable entry (₹28–40L) but infrastructure is still developing. Best for first-time buyers with 5+ year horizon, not short-term investors.\n\nKhushkhera RIICO: 1,500+ industrial units ensure demand, but older construction stock dominates. Prefer new projects for better appreciation.\n\nAvoid: Unverified projects without Rajasthan RERA registration (rrerarajasthan.in). Many plots in fringe areas lack clear RIICO allotment — verify legal title before buying.", link: '/residential-property-in-bhiwadi', linkText: 'View Safe Verified Projects →' },
    ],
    faqs: [
      { q: 'Which corridor in Bhiwadi is best for investment in 2025?', a: 'NH-48 offers the best combination of appreciation potential and demand drivers. Alwar Bypass is best for end-users. Tapukara is best for rental income at 5.5–7% yield.' },
      { q: 'Which Bhiwadi corridor gives the highest rental yield?', a: 'Tapukara (Honda Zone) gives 5.5–7% rental yield from industrial professionals. Khushkhera RIICO belt gives 5–6.5%. Alwar Bypass gives 4.5–5.5% with more stable family tenants.' },
      { q: 'Is Bhiwadi a better investment than Gurgaon in 2025?', a: 'For rental yield: Yes (4–6% vs 2.5% in Gurgaon). For capital appreciation: Gurgaon has higher absolute growth but Bhiwadi offers better value entry. For affordability: Bhiwadi wins at 50–60% lower price.' },
      { q: 'What is the price range in different Bhiwadi corridors?', a: 'Bhiwadi Extension: ₹28–40L (1 BHK). Alwar Bypass: ₹35–85L (2–3 BHK). NH-48: ₹38L–1.2 Cr. Neemrana: ₹50L–1.5 Cr. Industrial plots from ₹50L (RIICO).' },
      { q: 'Is Bhiwadi Extension a good investment?', a: 'Yes for first-time buyers with ₹28–40L budget and 5+ year horizon. Infrastructure is still developing. Not ideal for short-term investors. Best project: Ratan Pearl Residency.' },
      { q: 'How do I choose the right corridor in Bhiwadi?', a: 'Evaluate: rental demand from industrial employers, RIICO infrastructure quality, builder delivery track record, and distance to NH-48. Consult a Rajasthan RERA-registered advisor.' },
    ],
    relatedLinks: [
      { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
      { label: 'Alwar Bypass Road Projects', href: '/alwar-bypass-road-projects' },
      { label: 'NH-48 Bhiwadi Projects', href: '/nh-48-bhiwadi-projects' },
      { label: 'Tapukara Projects', href: '/tapukara-bhiwadi-projects' },
    ],
  },
  'nh-48-bhiwadi-investment-guide': {
    title: 'NH-48 Bhiwadi Investment Guide 2025 — Complete Corridor Analysis',
    category: 'Investment Guide', date: '2025-02-01', readTime: '12 min',
    author: { name: 'Ajay Singh', credentials: 'Senior Property Advisor — NH-48 Corridor Specialist. Rajasthan RERA Registered Agent.', bio: 'Senior advisor with decade-long expertise in NH-48 Bhiwadi to Neemrana corridor. 200+ transactions on the highway belt.' },
    keywords: ['nh-48 bhiwadi property', 'nh-48 investment guide bhiwadi', 'bhiwadi highway property', 'neemrana property investment', 'bhiwadi property price 2025'],
    intro: "NH-48 (Delhi-Jaipur National Highway) is the primary investment corridor in Bhiwadi. Stretching from Bhiwadi through Tapukara to Neemrana and beyond to Jaipur, this 100+ km corridor is home to India's densest concentration of Japanese, Korean and global MNCs outside of the NCR core. With properties priced at ₹38L–₹1.2 Cr, rental yields of 5–6.5%, and 30–45% appreciation since 2022 — here's everything you need to know.",
    sections: [
      { heading: 'Why NH-48 Outperforms Every Bhiwadi Corridor', content: "Three structural drivers make NH-48 uniquely powerful for investors.\n\nFirst, industrial density: 5,000+ RIICO units on the NH-48 belt employing 2L+ workers create permanent housing demand. Honda, Panasonic, Denso, Bosch, Gillette, Adidas — all have plants here.\n\nSecond, Neemrana Japanese Zone at the 80 km mark: 50+ Japanese MNCs drive expat housing demand with rents 30–50% above Bhiwadi average. An apartment that rents for ₹15,000 in Bhiwadi rents for ₹22,000–28,000 near Neemrana.\n\nThird, highway infrastructure: The 8-lane NH-48 expressway connects to Delhi (55 km, 60 min), Gurgaon (35 km, 40 min) and Jaipur (150 km, 2 hrs) — creating multi-city tenant demand.", link: '/nh-48-bhiwadi-projects', linkText: 'View All NH-48 Bhiwadi Projects →' },
      { heading: 'Zone-Wise Price Analysis: Where to Buy on NH-48', content: "Bhiwadi NH-48 entry (km 0–15): ₹3,800–5,500/sqft. Ashiana Housing, Supertech projects. Best rental yield zone.\nTapukara (km 15–25): ₹2,800–4,500/sqft. Honda plant zone. Highest yield (5.5–7%).\nBhiwadi–Neemrana junction (km 25–40): ₹4,000–6,000/sqft. Emerging premium zone.\nNeemrana (km 40–60): ₹4,200–7,000/sqft. Japanese zone premium. BPTP, premium projects.", link: '/neemrana-bhiwadi-projects', linkText: 'Explore Neemrana Projects →' },
      { heading: 'Top Projects Worth Buying on NH-48 in 2025', content: "Ashiana Housing Bhiwadi (NH-48, ₹38L–75L): Best delivery record in Bhiwadi. 2–3 BHK with excellent build quality and amenities.\n\nBPTP Astaire Gardens (Neemrana, ₹50L–95L): Premium project in Japanese zone. Best for expat rental income.\n\nAdani Wilton Park (NH-48, ₹65L–1.2 Cr): Latest launch with modern amenities. Adani brand ensures delivery credibility.\n\nSupertech Bhiwadi Residency (NH-48, ₹40L–70L): Good value in mid-segment. Convenient NH-48 location.", link: '/new-launch-bhiwadi', linkText: 'View New Launch Options →' },
      { heading: 'Common Mistakes NH-48 Buyers Make', content: "Mistake 1: Buying based on price/sqft alone. A ₹3,500/sqft project near Honda plant with occupancy guarantee outperforms a ₹4,500/sqft project in an isolated location.\n\nMistake 2: Not verifying Rajasthan RERA. Bhiwadi falls under Rajasthan RERA (rrerarajasthan.in) — not Haryana RERA. Many buyers mistake this and end up with unverified projects.\n\nMistake 3: Ignoring industrial proximity. The closer to a major employer (Honda, RIICO), the higher the rental yield and occupancy.\n\nMistake 4: Buying without a site visit. Visit during working hours to assess industrial noise and commute patterns.", link: '/residential-property-in-bhiwadi', linkText: 'View RERA Verified Projects →' },
    ],
    faqs: [
      { q: 'Is NH-48 Bhiwadi a good investment in 2025?', a: 'Yes. Best-performing corridor in Bhiwadi. Prices up 30–45% since 2022. Industrial demand from 5,000+ RIICO units creates permanent tenant base. Neemrana Japanese Zone adds premium expat demand.' },
      { q: 'Which is better — Bhiwadi or Neemrana for investment?', a: 'Bhiwadi for rental income and lower entry price (₹38–85L). Neemrana for expat premium rents and capital appreciation (₹50L–1.5 Cr). Both are strong. Choose based on budget and yield preference.' },
      { q: 'What is the price per sqft on NH-48 Bhiwadi in 2025?', a: 'Ranges from ₹2,800/sqft (Tapukara affordable) to ₹7,000/sqft (Neemrana Japanese zone premium). NH-48 Bhiwadi mid-market: ₹3,800–5,500/sqft.' },
      { q: 'Which builders have projects on NH-48 Bhiwadi?', a: 'Ashiana, BPTP, Supertech, Adani, Omaxe, GLS. Ashiana has the best delivery record in Bhiwadi. BPTP is strongest in Neemrana. Adani is newest entrant with credibility.' },
      { q: 'What rental yield can I expect on NH-48 Bhiwadi?', a: 'Yields range from 4.5–5.5% in standard Bhiwadi NH-48 to 5.5–7% in Tapukara Honda zone to 4–5.5% in Neemrana premium. A ₹50L 2 BHK near Honda plant earns ₹18,000–22,000/month.' },
      { q: 'How far is Bhiwadi from Delhi on NH-48?', a: 'Bhiwadi is 55 km from Delhi (60–70 min via NH-48), 35 km from Gurgaon (40 min), and 150 km from Jaipur (2 hrs). Excellent multi-city connectivity.' },
    ],
    relatedLinks: [
      { label: 'Neemrana Projects', href: '/neemrana-bhiwadi-projects' },
      { label: 'Tapukara Projects', href: '/tapukara-bhiwadi-projects' },
      { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
      { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
    ],
  },
  'new-launch-vs-ready-to-move-property': {
    title: 'New Launch vs Ready to Move Property in Bhiwadi — What Should You Buy?',
    category: 'Buying Guide', date: '2025-01-01', readTime: '7 min',
    author: { name: 'Amit Kapoor', credentials: 'Real Estate Advisor, IIM-A Alumni', bio: 'Investment advisor with a background in finance and 5 years advising Bhiwadi property buyers.' },
    keywords: ['new launch vs ready to move bhiwadi', 'buy flat bhiwadi 2025', 'new launch property bhiwadi', 'ready to move bhiwadi', 'rera verified projects bhiwadi'],
    intro: "One of the most common questions from Bhiwadi property buyers is: should I buy a new launch and wait 2–3 years, or pay more for a ready-to-move home? The right answer depends on your goals, risk appetite and financial situation.",
    sections: [
      { heading: 'New Launch: Lower Price, Higher Wait', content: 'New launch projects in Bhiwadi are typically priced 10–20% lower than ready-to-move equivalents. This price gap represents your potential appreciation — if the project delivers on time and the builder is credible. Stick to Rajasthan RERA-verified projects from builders with clean delivery records like Ashiana and Omaxe.', link: '/new-launch-bhiwadi', linkText: 'View New Launch Projects →' },
      { heading: 'Ready to Move: No Wait, Immediate Rental Income', content: "Ready-to-move properties in Bhiwadi eliminate construction risk and let you start rental income immediately. RTM properties near Honda Tapukara and RIICO Bhiwadi offer 95%+ occupancy from industrial tenants.", link: '/ready-to-move-bhiwadi', linkText: 'View Ready to Move Bhiwadi →' },
      { heading: 'Our Recommendation for Bhiwadi Buyers', content: 'For investors seeking rental income: Ready-to-move near industrial hubs (Tapukara, RIICO). For capital appreciation: New launch on NH-48 from credible builders (Ashiana, BPTP, Adani). For first-time buyers with PMAY: New launch in Bhiwadi Extension where prices start from ₹28L.', link: '/residential-property-in-bhiwadi', linkText: 'Explore Residential Property Bhiwadi →' },
    ],
    faqs: [
      { q: 'Should I buy a new launch or ready-to-move property in Bhiwadi?', a: 'Investors seeking rental income should prefer ready-to-move near industrial hubs. Investors seeking capital appreciation should prefer new launch on NH-48. First-time buyers should target new launch with PMAY eligibility.' },
      { q: 'How much cheaper are new launch projects vs ready-to-move in Bhiwadi?', a: 'New launch projects are 10–20% cheaper than equivalent ready-to-move projects in Bhiwadi. The discount is lower than in Gurgaon because construction quality and risk perception are better here.' },
      { q: 'Is it safe to buy a new launch project in Bhiwadi?', a: 'Yes, with Rajasthan RERA-registered projects from builders with proven delivery records. Check rrerarajasthan.in for registration, possession date, and complaint history. Ashiana Housing has the best delivery record in Bhiwadi.' },
      { q: 'What are the risks of buying new launch property in Bhiwadi?', a: 'Main risks: construction delay (add 12–18 months buffer), quality not matching sample flat, builder financial stress. Mitigate by choosing credible builders (Ashiana, Omaxe) and using construction-linked payment plans.' },
      { q: 'Which new launch projects are best in Bhiwadi in 2025?', a: 'Top new launches: Adani Wilton Park (NH-48, ₹65L–1.2 Cr), BPTP Astaire Gardens (Neemrana, ₹50L–95L), GLS Bhiwadi Residency (Tapukara, ₹30L–55L), Greenfield Residency (Alwar Bypass, ₹35L–62L). All RERA-verified.' },
    ],
    relatedLinks: [
      { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
      { label: 'Ready to Move Bhiwadi', href: '/ready-to-move-bhiwadi' },
      { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
      { label: 'Flats in Bhiwadi', href: '/flats-in-bhiwadi' },
    ],
  },
  'how-to-check-rera-before-buying-property': {
    title: 'How to Check RERA Registration Before Buying a Property in Bhiwadi',
    category: 'Legal & RERA', date: '2024-12-01', readTime: '6 min',
    author: { name: 'Neha Gupta', credentials: 'Property Legal Consultant, LLB', bio: 'Legal and compliance advisor with expertise in Rajasthan RERA matters and property documentation in Bhiwadi.' },
    keywords: ['check rera bhiwadi', 'rajasthan rera portal', 'rera verified projects bhiwadi', 'how to verify rera rajasthan', 'rrerarajasthan bhiwadi property'],
    intro: "RERA (Real Estate Regulatory Authority) is your biggest protection as a property buyer in Bhiwadi. Bhiwadi projects fall under Rajasthan RERA — NOT Haryana RERA, which is a common mistake. Before you book any project, verify its RERA status on rrerarajasthan.in. Here's exactly how to do it.",
    sections: [
      { heading: 'Step 1: Visit Rajasthan RERA Portal', content: 'Go to rrerarajasthan.in. This is the official Rajasthan RERA website (Bhiwadi is in Rajasthan). Look for the "Registered Projects" section. All RERA-registered projects in Rajasthan (including Bhiwadi, Neemrana, Tapukara) are listed here with full details.', link: '/residential-property-in-bhiwadi', linkText: 'View RERA Verified Projects →' },
      { heading: 'Step 2: Search by Project Name or RERA Number', content: 'Use the search function to find your project. Enter the project name or the RERA registration number provided by the developer. Verify: Registration number, Project name, Builder name, Completion date, Land area, and Number of units.', link: '/new-launch-bhiwadi', linkText: 'New Launch Bhiwadi — All RERA Verified →' },
      { heading: 'Key Red Flags to Watch For', content: "Be cautious if: the project is not found on rrerarajasthan.in (illegal), the possession date is significantly past the current date, the builder has multiple RERA complaints on the portal, or the project details don't match what the builder told you. For plots, additionally verify RIICO allotment documents.", link: '/residential-property-in-bhiwadi', linkText: 'Safe, Verified Residential Properties Bhiwadi →' },
    ],
    faqs: [
      { q: 'Which RERA governs Bhiwadi projects?', a: 'Rajasthan RERA (rrerarajasthan.in) governs all Bhiwadi properties. Bhiwadi is in Alwar district, Rajasthan — NOT Haryana. Many buyers mistakenly check Haryana RERA and cannot find the project.' },
      { q: 'What information does Rajasthan RERA registration give me?', a: 'RERA shows: project registration number, approved units and floors, possession date committed by builder, land details, and buyer complaint records against the builder.' },
      { q: 'What happens if a builder does not have RERA registration?', a: 'An unregistered project is illegal under RERA Act 2016. Never pay even a booking amount for an unregistered project — the builder commits a criminal offence by selling without RERA.' },
      { q: 'Can a builder change the possession date after RERA registration?', a: 'Yes, but they must pay 10.5% interest (above repo rate) to buyers for every month of delay. This makes intentional delay financially costly for builders.' },
      { q: 'What should I check on RERA portal before booking a flat in Bhiwadi?', a: 'Check: (1) Valid and current RERA number on rrerarajasthan.in, (2) Possession date matches builder quote, (3) Your specific unit is in registered units, (4) Low complaint count, (5) Builder PAN matches company registration.' },
    ],
    relatedLinks: [
      { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
      { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
      { label: 'Plots in Bhiwadi', href: '/plots-in-bhiwadi' },
      { label: 'Industrial Plots Bhiwadi', href: '/industrial-plots-bhiwadi' },
    ],
  },
  'best-builders-in-bhiwadi': {
    title: 'Best Builders in Bhiwadi — Ranked by Delivery Record, Quality & Trust',
    category: 'Builder Guide', date: '2024-11-01', readTime: '9 min',
    author: { name: 'Vikram Malhotra', credentials: 'Property Analyst, 10 years Bhiwadi market', bio: 'Senior property analyst with deep expertise in builder track records and project quality assessment in Bhiwadi and Alwar district.' },
    keywords: ['best builders bhiwadi', 'ashiana housing bhiwadi', 'omaxe bhiwadi', 'gls bhiwadi', 'top builders bhiwadi 2025', 'bptp bhiwadi'],
    intro: "Choosing the right builder is often more important than choosing the right location. A great corridor with a bad builder can mean years of delay and quality compromise. Here's our honest ranking of Bhiwadi's top builders — based on delivery record, construction quality and buyer feedback.",
    sections: [
      { heading: '1. Ashiana Housing — Best for Quality & Delivery', content: "Ashiana Housing is widely regarded as Bhiwadi's most reliable developer. Their projects feature in-house construction quality monitoring, superior finishing and consistent on-time delivery. Premium pricing for Bhiwadi but worth it for quality seekers. Ashiana Bhiwadi is their flagship project with 1,000+ delivered units.", link: '/residential-property-in-bhiwadi', linkText: 'View Ashiana Projects →' },
      { heading: '2. Omaxe — Best for Scale & Brand', content: "Omaxe is a listed company with a strong pan-India brand. Omaxe Green Meadow on Alwar Bypass is their flagship Bhiwadi project. Good track record in Bhiwadi with multiple delivered phases. Commands 10–15% resale premium over comparable projects.", link: '/alwar-bypass-road-projects', linkText: 'View Alwar Bypass Projects →' },
      { heading: '3. BPTP — Best in Neemrana (Japanese Zone)', content: 'BPTP Astaire Gardens in Neemrana is the premium benchmark for the NH-48 corridor. Well-designed project with good amenities targeting industrial and expat housing demand. Strong RERA compliance record.', link: '/neemrana-bhiwadi-projects', linkText: 'View Neemrana Projects →' },
      { heading: '4. Adani Realty — Best New Entry with Credibility', content: "Adani Wilton Park on NH-48 is Bhiwadi's newest high-credibility project. Adani brand brings corporate governance and delivery commitment. Modern amenities, good location on NH-48. Best for buyers who want a credible brand with new inventory.", link: '/nh-48-bhiwadi-projects', linkText: 'View NH-48 Projects →' },
    ],
    faqs: [
      { q: 'Which is the best builder in Bhiwadi in 2025?', a: 'For quality and delivery: Ashiana Housing. For brand value: Omaxe. For Neemrana zone: BPTP. For new credible entry: Adani Realty. Best first-time buyer choice: Ashiana or GLS for transparent pricing.' },
      { q: 'Which Bhiwadi builder has the best delivery record?', a: 'Ashiana Housing has the best on-time delivery record in Bhiwadi. They have delivered 5+ phases and 2,000+ units in the Bhiwadi-Alwar belt with minimal delays.' },
      { q: 'Is Omaxe a good builder in Bhiwadi?', a: 'Yes. Omaxe is a listed company with public accountability. Green Meadow on Alwar Bypass is well-reviewed. Commands good resale value and 90%+ occupancy in delivered units.' },
      { q: 'Is GLS builder reliable in Bhiwadi?', a: 'GLS has improved significantly in recent years. Their Tapukara project is RERA-compliant with good construction progress. Check the specific project RERA complaint record before booking.' },
      { q: 'Which Bhiwadi builder is best for affordable housing?', a: 'Ratan Group (Ratan Pearl Residency, from ₹28L), Eldeco (RIICO belt, from ₹32L) and Greenfield Residency are most reliable for affordable projects under ₹50 Lakh.' },
      { q: 'How do I check a builder\'s track record in Bhiwadi?', a: 'Check rrerarajasthan.in for complaint history. Visit a completed project phase. Talk to residents of past projects. Check Housing.com reviews. Ask builder for delivery certificates of past projects.' },
    ],
    relatedLinks: [
      { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
      { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
      { label: 'Alwar Bypass Projects', href: '/alwar-bypass-road-projects' },
      { label: 'Neemrana Projects', href: '/neemrana-bhiwadi-projects' },
    ],
  },
};

type Props = { params: { slug: string } };

// ISR — revalidate every 5 min so new DB blogs appear without rebuild
export const revalidate = 300;

export async function generateStaticParams() {
  // Fetch DB slugs + static slugs (merged, deduplicated)
  const { fetchAllBlogSlugs } = await import('@/lib/api-blogs');
  const dbSlugs = await fetchAllBlogSlugs().catch(() => []);
  const staticSlugs = Object.keys(STATIC_BLOGS);
  const all = Array.from(new Set([...dbSlugs, ...staticSlugs]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
  const pageUrl = `${siteUrl}/blog/${params.slug}`;

  const [blog, settings] = await Promise.all([
    fetchBlogPost(params.slug),
    fetchSettings(),
  ]);
  const post = blog || STATIC_BLOGS[params.slug];
  if (!post) return { title: 'Blog | Property in Bhiwadi' };

  const title = `${post.title} | ${settings.siteName}`;
  const description = post.excerpt || (post.intro ? post.intro.substring(0, 155) + '…' : '');
  const ogImage = post.heroImage || `${siteUrl}/og-home.jpg`;

  return {
    title,
    description,
    keywords: post.keywords?.length ? post.keywords : [
      post.category?.toLowerCase(), 'bhiwadi property', 'real estate bhiwadi',
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';
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
      jobTitle: post.author?.designation || 'Property Advisor',
      ...(post.author?.credentials ? {
        description: post.author.credentials,
        hasCredential: [{ '@type': 'EducationalOccupationalCredential', name: post.author.credentials }],
      } : {}),
      ...(post.author?.avatar ? { image: post.author.avatar } : {}),
      worksFor: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: settings.siteName,
        url: siteUrl,
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

  const faqs: Array<{ q: string; a: string }> = post.faqs || [];

  // Auto-detect how-to posts: sections whose headings start with "Step"
  const howToSteps = (post.sections || [])
    .filter((s: any) => /^step\s*\d/i.test(s.heading?.trim() || ''))
    .map((s: any) => ({ name: s.heading, text: s.content }));

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      {howToSteps.length >= 2 && (
        <HowToSchema
          name={post.title}
          description={post.excerpt || post.intro?.substring(0, 155) || ''}
          steps={howToSteps}
        />
      )}

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

          {faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-display font-bold text-brand-text mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-brand-mint/30 border border-brand-border/40 rounded-xl p-5 group">
                    <summary className="font-semibold text-brand-text text-sm cursor-pointer list-none flex justify-between items-center gap-3">
                      {faq.q}
                      <span className="shrink-0 text-brand-accent text-lg group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-brand-muted text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

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
