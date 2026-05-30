import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import LeadCTA from '@/components/lead/LeadCTA';
import { fetchBlogPost } from '@/lib/api-blogs';
import { fetchSettings } from '@/lib/settings';
import { FAQSchema, HowToSchema } from '@/components/seo/SchemaMarkup';

// Fallback static data for slugs that exist in DB when API is down
const STATIC_BLOGS: Record<string, any> = {
  'best-sectors-to-invest-in-gurgaon': {
    title: 'Best Sectors to Invest in Gurgaon in 2025',
    category: 'Investment Guide', date: '2025-03-01', readTime: '12 min',
    author: { name: 'Ajay Singh', credentials: 'Senior Property Advisor, 10 years Dwarka Expressway specialist. RERA Agent ID: HRERA-PKL-REA-0512-2021', bio: 'Senior advisor at New Projects in Gurgaon with decade-long expertise in Dwarka Expressway and Gurgaon micro-market analysis.' },
    keywords: ['best sectors gurgaon investment', 'where to invest gurgaon 2025', 'dwarka expressway investment', 'golf course extension road property', 'new gurgaon sectors'],
    intro: "Gurgaon has over 100 residential sectors. Each has a different price point, different builder mix, different infrastructure quality, and a completely different risk-return profile. In 2025, with prices significantly higher than 2021, choosing the wrong sector can mean paying full market price for sub-market returns. Here is our data-backed sector ranking — with honest analysis of what each zone offers and at what cost.",
    sections: [
      { heading: 'Rank 1: Dwarka Expressway (Sectors 99–115) — Best Overall 2025', content: "Overall score: 9.2/10. Best investment corridor in Gurgaon for the second consecutive year.\n\nWhy it ranks first: Airport proximity (10–18 min to IGI), Delhi border constraint limiting future supply, Metro Phase II incoming, and India's top builders concentrated here — DLF, Sobha, Godrej, Krisumi.\n\nPrice range: ₹7,000–14,500/sqft. Appreciation 2021–2025: 45–65%.\nBest sectors within: 113 (airport premium), 104–109 (builder quality), 99–103 (value entry).\nBest for: Investors seeking capital appreciation, NRI buyers, senior corporate professionals.", link: '/dwarka-expressway-projects', linkText: 'Explore All Dwarka Expressway Projects →' },
      { heading: 'Rank 2: Golf Course Extension Road (Sectors 57–75) — Premium Living', content: "Overall score: 8.6/10. Premium residential belt with best lifestyle infrastructure in Gurgaon.\n\nWhy it ranks second: Golf courses, five-star hotels, Cyber Hub proximity, best school-hospital-mall ecosystem, and projects by Emaar, M3M, Mahindra, Smartworld and Conscient.\n\nPrice range: ₹10,500–17,500/sqft. Appreciation 2021–2025: 40–55%.\nBest sectors within: 61 (township scale), 65 (Golf Estate), 59 (forest views), 72 (integrated).\nBest for: HNI buyers, luxury end-users, buyers seeking best lifestyle, expat rental demand.", link: '/golf-course-extension-road-projects', linkText: 'Explore Golf Course Extension Road →' },
      { heading: 'Rank 3: SPR Road (Sectors 65–85) — Highest ROI Emerging Zone', content: "Overall score: 8.1/10. The corridor with the highest remaining appreciation potential in 2025.\n\nSPR Road connects Sohna Road, Golf Course Extension Road, and Dwarka Expressway in a single spine. DLF Privana West and South have repriced the entire zone. Commercial development is maturing rapidly.\n\nPrice range: ₹8,000–13,500/sqft. Appreciation 2021–2025: 50–62%.\nBest for: Investors with 3–5 year horizon seeking maximum appreciation.", link: '/spr-road-projects', linkText: 'Explore SPR Road Projects →' },
      { heading: 'Rank 4: New Gurgaon (Sectors 81–95) — Best Affordable Entry', content: "Overall score: 7.4/10. Best zone for buyers with ₹50–90 Lakh budget seeking a Gurgaon address.\n\nNew Gurgaon offers the cheapest entry into Gurgaon (₹55–80 Lakh for 2 BHK) with stable rental demand from Manesar's 600+ industrial units. Infrastructure is improving with new road links.\n\nPrice range: ₹4,500–7,500/sqft. Appreciation 2021–2025: 40–52%.\nBest for: First-time buyers, investors seeking rental income, buyers with ₹50–90 Lakh budget.", link: '/new-gurgaon-projects', linkText: 'Explore New Gurgaon Projects →' },
      { heading: 'Sectors to Avoid in 2025', content: "Old Gurgaon (Sectors 1–40): Priced at ₹15,000–30,000/sqft. Resale only — limited appreciation remaining. Buy only if you value address prestige over financial return.\n\nSectors with stalled projects: Sectors 67–69 and parts of Sohna Road have multiple stalled projects from the 2015–2018 era. Avoid any project where construction is visibly stopped.\n\nSectors beyond 30 km from Cyber City: Unless prices are below ₹4,000/sqft, avoid sectors requiring 45+ minute commute to main employment zones.", link: '/residential-property-in-gurgaon', linkText: 'View Safe Verified Projects →' },
    ],
    faqs: [
      { q: 'Which sector in Gurgaon is best for investment in 2025?', a: 'Sectors 104–113 on Dwarka Expressway offer the best combination of appreciation potential, builder quality, and demand drivers. Sectors 57–75 on Golf Course Extension Road are best for luxury lifestyle. New Gurgaon Sectors 84–88 offer best value under ₹1 Cr.' },
      { q: 'Which Gurgaon sector gives the highest rental yield?', a: 'Sectors 99–106 on Dwarka Expressway offer 3.5–4.5% rental yield from corporate and airport tenants. New Gurgaon Sectors 84–88 offer 4.5–5.5% yield from Manesar industrial demand.' },
      { q: 'Is it better to invest in Golf Course Road or Dwarka Expressway?', a: 'For capital appreciation: Dwarka Expressway (15–25% forecast 2025–2027 vs 8–12% for Golf Course Road). For lifestyle: Golf Course Extension Road. For best ROI: Dwarka Expressway mid-market.' },
      { q: 'What is the price range in different Gurgaon sectors?', a: 'Old Gurgaon: ₹15,000–30,000/sqft. Golf Course Road: ₹18,000–25,000/sqft. Golf Course Extension: ₹10,500–17,500/sqft. Dwarka Expressway: ₹7,000–14,500/sqft. New Gurgaon: ₹4,500–7,500/sqft.' },
      { q: 'Which Gurgaon sector is cheapest with good appreciation?', a: 'New Gurgaon Sectors 84–88 are cheapest (₹4,500–6,500/sqft) with 22–30% appreciation forecast over 2025–2027. Sector 37D on Dwarka Expressway offers ₹5,500–7,000/sqft with airport-adjacent appreciation potential.' },
      { q: 'Is Sohna Road Gurgaon good for investment in 2025?', a: 'Yes. SPR Road (Sohna Road belt) appreciated 50–62% since 2021. DLF Privana West delivery in 2026 will re-price the zone further. Best for investors with 3–5 year horizon.' },
      { q: 'How do I choose between Gurgaon sectors for investment?', a: 'Evaluate: 3-year appreciation track record, builder quality and RERA compliance, infrastructure connectivity, rental demand, and upcoming catalysts. Consult a RERA-registered advisor who specializes in the specific corridor.' },
      { q: 'Which Gurgaon sector has best connectivity to Delhi?', a: 'Sector 113 (Dwarka Expressway, Delhi border 1.5 km). NH-48 sectors (Sectors 28–32). Golf Course Road sectors (via Mehrauli-Gurgaon Road). Delhi Metro Phase IV will improve Sectors 55–65 when complete.' },
    ],
    relatedLinks: [
      { label: 'New Launch Projects in Gurgaon', href: '/new-launch-projects-in-gurgaon' },
      { label: 'Dwarka Expressway Projects', href: '/dwarka-expressway-projects' },
      { label: 'Sector 113 Gurgaon', href: '/sector-113-gurgaon-property' },
      { label: 'SPR Road Projects', href: '/spr-road-projects' },
    ],
  },
  'dwarka-expressway-investment-guide': {
    title: "Dwarka Expressway Investment Guide 2025 — Complete Sector-Wise Analysis",
    category: 'Investment Guide', date: '2025-02-01', readTime: '12 min',
    author: { name: 'Ajay Singh', credentials: 'Senior Property Advisor — 10 Years Dwarka Expressway Specialist. RERA Agent ID: HRERA-PKL-REA-0512-2021', bio: 'Senior advisor with decade-long expertise exclusively in Dwarka Expressway. 300+ transactions in Sectors 99–115.' },
    keywords: ['dwarka expressway investment guide', 'dwarka expressway property 2025', 'sector 113 gurgaon', 'dwarka expressway price trends', 'gurgaon airport zone property'],
    intro: "Dwarka Expressway opened to full traffic in March 2024 and immediately became India's most dynamic real estate corridor. Prices rose 18–22% in the 12 months post-opening — more than any other Gurgaon corridor. With IGI Airport at 10–15 minutes, Delhi border access, Metro Phase II incoming, and India's premium builders here — this is everything you need to know before investing.",
    sections: [
      { heading: "Why Dwarka Expressway Outperforms Every Gurgaon Corridor", content: "Three structural drivers make Dwarka Expressway uniquely powerful.\n\nFirst, IGI Airport proximity at 10–15 minutes creates perpetual demand from aviation professionals, MNC frequent fliers, and NRIs. No other Gurgaon corridor has this airport anchor.\n\nSecond, the Delhi border constraint at 2 km means supply is permanently limited. All new supply must come from vertical development — this structural scarcity is the single most powerful price driver.\n\nThird, Metro Phase II will add 15–20% premium the moment it becomes operational (expected 2026–27). Smart money is buying before this catalyst.\n\nPrice trajectory: ₹5,200/sqft (2021) → ₹9,500–13,000/sqft (2025) — a 45–60% increase backed by end-user demand.", link: '/dwarka-expressway-projects', linkText: 'View All Dwarka Expressway Projects →' },
      { heading: 'Sector-Wise Price Analysis: Where to Buy in 2025', content: "Sector 113: ₹11,000–14,500/sqft — Airport zone premium. Best for NRI investment.\nSectors 109–112: ₹9,500–12,000/sqft — Ultra-premium belt. Krisumi, Elan, luxury projects.\nSectors 104–108: ₹8,000–10,500/sqft — Investment sweet spot. Best combination of price, appreciation and builder quality.\nSectors 99–103: ₹7,000–9,000/sqft — Value zone. Good rental yield 3.5–4%.\nSector 37D fringe: ₹5,500–7,500/sqft — Affordable entry, highest % appreciation potential.", link: '/sector-113-gurgaon-property', linkText: 'Explore Sector 113 →' },
      { heading: 'Top Projects Worth Buying in 2025', content: "Sobha Aranya Villas (Sector 80): Private pool villas, ₹5 Cr+. Sobha's in-house construction guarantees quality no other builder matches.\n\nKrisumi Waterfall Residences (Sector 36A): Japanese-Indian JV, world-class construction. RTM units available. ₹2.8–4.5 Cr.\n\nElan The Mark (Sector 106): Luxury high-rise, rooftop infinity pool. ₹2.8–4 Cr.\n\nHero Homes (Sector 104): Mid-premium ₹1.5–2.5 Cr. Hero Group brand with clean delivery record.\n\nSmart World Gems (Sector 89): Best value at ₹72 Lakh–1.8 Cr. Competitive pricing with strong builder record.", link: '/new-launch-projects-in-gurgaon', linkText: 'View New Launch Options →' },
      { heading: 'Common Mistakes Buyers Make on Dwarka Expressway', content: "After 300+ transactions, here are the costliest mistakes:\n\nMistake 1: Buying on price/sqft alone. ₹7,000/sqft with weak builder underperforms ₹8,500/sqft from Sobha or Godrej. Builder quality determines resale value.\n\nMistake 2: Ignoring floor plan efficiency. Many projects have 30–35% loading. Calculate carpet area price — RERA mandates carpet area disclosure.\n\nMistake 3: Not checking RERA complaints. Visit haryanarera.gov.in and check the builder's complaint history before booking.\n\nMistake 4: Buying without a site visit. Photos lie. Always visit the construction site and assess quality in person.", link: '/new-projects-in-gurgaon', linkText: 'View RERA Verified Projects →' },
    ],
    faqs: [
      { q: 'Is Dwarka Expressway a good investment in 2025?', a: 'Yes. Best-performing corridor in Gurgaon. Prices up 45–60% since 2021. IGI Airport proximity creates permanent demand. Metro Phase II will add another 15–20% catalyst in 2026–27.' },
      { q: 'Which sector is best on Dwarka Expressway?', a: 'For maximum appreciation: Sector 113. For best value-to-return ratio: Sectors 104–108. For affordable entry with high ROI: Sectors 99–103 at ₹7,000–9,000/sqft.' },
      { q: 'What is the price per sqft on Dwarka Expressway in 2025?', a: 'Ranges from ₹5,500/sqft (Sector 37D) to ₹14,500/sqft (Sector 113). Mid-market sweet spot: ₹8,000–10,500/sqft in Sectors 104–109.' },
      { q: 'Which builders have projects on Dwarka Expressway?', a: 'Sobha, Krisumi, Elan, Godrej, Hero Homes, DLF, Smart World, BPTP, Signature Global and ROF. Sobha and Krisumi are highest quality; DLF commands best resale premium.' },
      { q: 'What rental yield can I expect on Dwarka Expressway?', a: 'Yields range from 2.5–3% in premium Sector 113 to 3.5–4.5% in Sectors 99–106 mid-market. A ₹1.5 Cr 2 BHK in Sector 104 can generate ₹40,000–55,000/month rent.' },
      { q: 'How far is Dwarka Expressway from IGI Airport?', a: 'Most sectors are 10–18 minutes from IGI Airport Terminal 2 and Terminal 3 via the elevated expressway. Sector 113 is closest at approximately 10–12 minutes.' },
      { q: 'Will Dwarka Expressway prices fall in 2025?', a: 'Unlikely. Genuine end-user demand, permanent supply constraint from Delhi border proximity, and Metro Phase II catalyst all support prices. Market correction risk is low.' },
      { q: 'Is under-construction property on Dwarka Expressway safe?', a: 'Yes, if RERA-registered from builders with clean delivery records. Verify on haryanarera.gov.in, check possession date, and review builder past project history before booking.' },
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
    faqs: [
      { q: 'Should I buy a new launch or ready-to-move property in Gurgaon?', a: 'Investors prefer new launch (10–25% lower price, maximum appreciation). End-users prefer ready-to-move (no construction risk, immediate possession). Hybrid buyers should target under-construction with 12–18 month possession.' },
      { q: 'How much cheaper are new launch projects vs ready-to-move in Gurgaon?', a: 'New launch projects are 15–25% cheaper than equivalent ready-to-move projects. This discount is your potential appreciation if the project delivers on time.' },
      { q: 'Is it safe to buy a new launch project in Gurgaon?', a: 'Yes, with RERA-registered projects from builders with proven delivery records. Check haryanarera.gov.in for registration, possession date, and complaint history.' },
      { q: 'What are the risks of buying new launch property?', a: 'Main risks: construction delay (add 12–18 months buffer), quality not matching sample flat, builder financial stress. Mitigate by choosing credible builders and using construction-linked payment plan.' },
      { q: 'What is a construction-linked payment plan?', a: 'CLP links your payments to construction milestones — foundation, floors, possession. Safer than time-linked plans because you only pay when builder delivers. Preferred by DLF, Sobha and Godrej for new launches.' },
      { q: 'Which new launch projects are best in Gurgaon in 2025?', a: 'Top new launches: DLF Privana West (Sector 76, ₹3.5 Cr+), Sobha Aranya (Sector 80, ₹5 Cr+), Elan The Mark (Sector 106, ₹2.8 Cr+), Smart World Gems (Sector 89, ₹72 Lakh+). All RERA-verified.' },
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
    category: 'Legal & RERA', date: '2024-12-01', readTime: '6 min',
    author: { name: 'Neha Gupta', credentials: 'Property Legal Consultant, LLB', bio: 'Legal and compliance advisor at New Projects in Gurgaon with expertise in RERA matters and property documentation.' },
    keywords: ['check rera gurgaon', 'haryana rera portal', 'rera verified projects', 'how to verify rera', 'rera gurgaon property'],
    intro: "RERA (Real Estate Regulatory Authority) is your biggest protection as a property buyer in Gurgaon. Before you book any project, verify its RERA status on the Haryana RERA portal. Here's exactly how to do it.",
    sections: [
      { heading: 'Step 1: Visit Haryana RERA Portal', content: 'Go to haryanarera.gov.in. This is the official Haryana RERA website. Look for the "Projects" section in the navigation. All RERA-registered projects in Haryana (including Gurgaon) are listed here with full details.', link: '/new-projects-in-gurgaon', linkText: 'View RERA Verified Projects on New Projects in Gurgaon →' },
      { heading: 'Step 2: Search by Project Name or RERA Number', content: 'Use the search function to find your project. Enter the project name or the RERA registration number provided by the developer. Verify: Registration number, Project name, Builder name, Completion date, Land area, and Number of units.', link: '/new-launch-projects-in-gurgaon', linkText: 'New Launch Projects — All RERA Verified →' },
      { heading: 'Key Red Flags to Watch For', content: "Be cautious if: the project is not found on RERA (illegal), the possession date is significantly past the current date, the builder has multiple RERA complaints on the portal, or the project details don't match what the builder told you.", link: '/residential-property-in-gurgaon', linkText: 'Safe, Verified Residential Properties →' },
    ],
    faqs: [
      { q: 'How do I check if a Gurgaon project is RERA registered?', a: 'Visit haryanarera.gov.in, click on "Projects", and search by project name or RERA number. Confirm registration number, possession date, total units, and check if any complaints have been filed.' },
      { q: 'What information does RERA registration give me?', a: 'RERA shows: project registration number, approved units and floors, possession date committed by builder, land details, and buyer complaint records against the builder.' },
      { q: 'What happens if a builder doesn\'t have RERA registration?', a: 'An unregistered project is illegal under RERA Act 2016. Never pay even a booking amount for an unregistered project — the builder commits a criminal offence by selling without RERA.' },
      { q: 'What is the RERA agent registration number for New Projects in Gurgaon?', a: 'Our RERA agent registration is HRERA-PKL-REA-677-2021, issued by Haryana Real Estate Regulatory Authority. Verify on haryanarera.gov.in.' },
      { q: 'Can a builder change the possession date after RERA registration?', a: 'Yes, but they must pay 10.5% interest (above repo rate) to buyers for every month of delay. This makes intentional delay financially costly for builders.' },
      { q: 'What should I check on RERA portal before booking a flat?', a: 'Check: (1) Valid and current RERA number, (2) Possession date matches builder quote, (3) Your specific unit is in registered units, (4) Low complaint count, (5) Builder PAN and company registration match.' },
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
    faqs: [
      { q: 'Which is the best builder in Gurgaon in 2025?', a: 'For quality: Sobha (in-house construction). For brand and resale: DLF. For value-premium balance: Godrej Properties. For trust: Tata Housing. Best NRI choice: Sobha or DLF for guaranteed resale market.' },
      { q: 'Which Gurgaon builder has the best delivery record?', a: 'Sobha has the best on-time delivery record with in-house construction. DLF and Godrej also have strong post-RERA delivery records. M3M has improved significantly since 2022.' },
      { q: 'Is DLF a good builder in Gurgaon?', a: 'Yes. DLF is Gurgaon\'s founding developer and most trusted brand for resale value. DLF projects command 10–20% resale premium over comparable projects. Best for long-term capital preservation.' },
      { q: 'Is M3M builder reliable in Gurgaon?', a: 'M3M has improved significantly since 2022. Recent projects are on schedule. However, check the specific project RERA complaint record and verify current construction progress before booking.' },
      { q: 'Which Gurgaon builder is best for affordable housing?', a: 'Signature Global (affordable specialist, listed company), ROF Affordable Housing, and Pareena Infrastructure are most reliable for affordable projects under ₹80 Lakh.' },
      { q: 'How do I check a builder\'s track record before buying?', a: 'Check RERA portal for complaint history. Visit a completed project. Talk to residents of past projects. Check Housing.com/MagicBricks reviews. Ask builder for delivery certificates of past projects.' },
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

  const faqs: Array<{ q: string; a: string }> = post.faqs || [];

  // Auto-detect how-to posts: sections whose headings start with "Step"
  const howToSteps = (post.sections || [])
    .filter((s: any) => /^step\s*\d/i.test(s.heading?.trim() || ''))
    .map((s: any) => ({ name: s.heading, text: s.content }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
