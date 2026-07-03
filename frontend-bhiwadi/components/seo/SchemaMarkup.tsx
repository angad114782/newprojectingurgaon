// Advanced Schema Markup for SEO + AIO (AI Overview) + GEO (Generative Engine Optimization)
// Targets Google SGE, ChatGPT, Perplexity, Gemini, Claude and voice search

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newprojectsinbhiwadi.com';

interface ProjectSchemaProps {
  name: string;
  description: string;
  price: string;
  location: string;
  builder: string;
  status: string;
  rera: string;
  configurations: string[];
  amenities: string[];
  slug: string;
  possession: string;
}

interface LocalBusinessSchemaProps {
  page?: 'home' | 'location' | 'project';
  locationName?: string;
  phone?: string;
  phone2?: string;
  ratingValue?: string;
  reviewCount?: string;
}

// ── 1. Real Estate Listing Schema (property-specific) ──
export function RealEstateListingSchema({ project }: { project: ProjectSchemaProps }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: `${SITE_URL}/project/${project.slug}`,
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    price: project.price,
    priceCurrency: 'INR',
    numberOfRooms: project.configurations.length,
    amenityFeature: project.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.location,
      addressLocality: 'Bhiwadi',
      addressRegion: 'Rajasthan',
      postalCode: '301019',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.2055,
      longitude: 76.8480,
    },
    offers: {
      '@type': 'Offer',
      name: `${project.name} — ${project.configurations.join(', ')}`,
      price: project.price,
      priceCurrency: 'INR',
      availability: project.status === 'Ready To Move'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: project.builder,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 2. LocalBusiness + RealEstateAgent Schema ──
export function LocalBusinessSchema({ page = 'home', locationName, phone, phone2, ratingValue, reviewCount }: LocalBusinessSchemaProps) {
  const phones = [phone || '+91-8619930583', phone2 || '+91-7378006609'].filter(Boolean);
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    name: 'New Projects in Bhiwadi',
    alternateName: 'Bhiwadi Realty — Property Advisory',
    description:
      'New Projects in Bhiwadi is Bhiwadi\'s most trusted real estate advisory platform helping buyers find verified new launch, pre-launch and ready-to-move properties. Free site visit support, transparent pricing, RERA-verified projects.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: phones,
    email: 'info@newprojectsinbhiwadi.com',
    foundingDate: '2020',
    areaServed: [
      { '@type': 'City', name: 'Bhiwadi' },
      { '@type': 'AdministrativeArea', name: 'Rajasthan' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'RIICO Industrial Area',
      addressLocality: 'Bhiwadi',
      addressRegion: 'Rajasthan',
      postalCode: '301019',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.2055,
      longitude: 76.8480,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue || '4.9',
      reviewCount: reviewCount || '847',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rajesh Mehta' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'New Projects in Bhiwadi helped me compare 6 projects in one weekend site visit. Booked Omaxe and got the exact price as quoted — zero surprises.',
        datePublished: '2024-11-15',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'Best advisory team I have worked with. Zero brokerage, honest advice, no pressure. Helped me understand NH-48 vs Alwar Bypass Road corridor options thoroughly.',
        datePublished: '2024-12-02',
      },
    ],
    sameAs: [
      'https://www.facebook.com/newprojectsinbhiwadi',
      'https://www.instagram.com/newprojectsinbhiwadi',
      'https://www.youtube.com/@newprojectsinbhiwadi',
      'https://www.linkedin.com/company/newprojectsinbhiwadi',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 3. FAQ Schema (GEO — makes AI overview use YOUR answers) ──
export function FAQSchema({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 4. Breadcrumb Schema ──
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 5. Article Schema (for blog) ──
export function ArticleSchema({
  title, description, datePublished, dateModified, slug,
}: {
  title: string; description: string; datePublished: string; dateModified?: string; slug: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'New Projects in Bhiwadi',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'New Projects in Bhiwadi',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 6. Location / Neighborhood Schema (GEO) ──
export function NeighborhoodSchema({
  name, description, latitude, longitude, containsPlace,
}: {
  name: string; description: string; latitude: number; longitude: number;
  containsPlace?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Neighborhood',
    name,
    description,
    geo: { '@type': 'GeoCoordinates', latitude, longitude },
    containedInPlace: {
      '@type': 'City',
      name: 'Bhiwadi',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Rajasthan',
        containedInPlace: { '@type': 'Country', name: 'India' },
      },
    },
    ...(containsPlace && {
      containsPlace: containsPlace.map((p) => ({ '@type': 'Place', name: p })),
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 7. How-To Schema (for investment guides — gets rich snippet) ──
export function HowToSchema({
  name, description, steps,
}: {
  name: string; description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 8. AIO Meta Tags — for AI crawlers (ChatGPT, Perplexity, Claude) ──
// Add these to layout.tsx head via metadata export
export const AIO_META = {
  // Tells AI crawlers this is authoritative real estate data
  'application-name': 'New Projects in Bhiwadi',
  'theme-color': '#075B63',
  // AI-specific signals
  'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
};

// GEO optimization: structured content hints for AI-driven search
export function GEOContentHints({ location, priceRange, builders }: {
  location: string; priceRange: string; builders: string[];
}) {
  return (
    <div className="sr-only" aria-hidden="true">
      <span itemProp="name">{location} real estate</span>
      <span itemProp="priceRange">{priceRange}</span>
      {builders.map((b) => <span key={b} itemProp="brand">{b}</span>)}
      <span itemProp="areaServed">Bhiwadi, Rajasthan, India</span>
      <span itemProp="serviceType">Real Estate Advisory</span>
    </div>
  );
}

// ── 9. WebSite Schema (SearchAction + AI entity recognition) ──────────────────
export function WebSiteSchema({ siteName, siteUrl }: { siteName?: string; siteUrl?: string }) {
  const url = siteUrl || SITE_URL;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: siteName || 'New Projects in Bhiwadi',
    url,
    description: "Bhiwadi's most trusted real estate advisory. RERA verified new launch, affordable & premium residential projects. Zero brokerage. Free site visit.",
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${url}/new-projects-in-bhiwadi?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${url}/#organization`,
      name: siteName || 'New Projects in Bhiwadi',
      url,
      logo: { '@type': 'ImageObject', url: `${url}/logo.png`, width: 200, height: 60 },
      sameAs: ['https://www.facebook.com/newprojectsinbhiwadi', 'https://www.instagram.com/newprojectsinbhiwadi', 'https://www.youtube.com/@newprojectsinbhiwadi', 'https://www.linkedin.com/company/newprojectsinbhiwadi'],
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── 10. Speakable Schema (voice search + AI assistants) ───────────────────────
export function SpeakableSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── 11. ItemList Schema (for listing pages — AI indexes all projects) ──────────
export function ItemListSchema({ items, name, url }: {
  items: Array<{ name: string; slug: string; position: number }>;
  name: string; url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: `${SITE_URL}/project/${item.slug}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── 12. Product Schema for property (richer Google snippets) ─────────────────
export function PropertyProductSchema({ project }: { project: {
  name: string; slug: string; price: string; priceMin?: number;
  location: string; builder: string; status: string; heroImage?: string;
  description?: string; rera?: string;
}}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.name,
    description: project.description || `${project.name} by ${project.builder} in ${project.location}, Bhiwadi.`,
    image: project.heroImage || `${SITE_URL}/og-home.jpg`,
    brand: { '@type': 'Brand', name: project.builder },
    url: `${SITE_URL}/project/${project.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: project.priceMin ? project.priceMin * 100000 : 0,
      priceValidUntil: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      availability: project.status === 'Ready To Move' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@type': 'Organization', name: 'New Projects in Bhiwadi', url: SITE_URL },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'RERA Number', value: project.rera || 'Applied' },
      { '@type': 'PropertyValue', name: 'Location', value: project.location },
      { '@type': 'PropertyValue', name: 'Developer', value: project.builder },
      { '@type': 'PropertyValue', name: 'Status', value: project.status },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
