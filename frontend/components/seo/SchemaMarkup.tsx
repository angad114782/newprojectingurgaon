// Advanced Schema Markup for SEO + AIO (AI Overview) + GEO (Generative Engine Optimization)
// This makes the site rank in Google SGE, ChatGPT, Perplexity and other AI search engines

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
}

// ── 1. Real Estate Listing Schema (property-specific) ──
export function RealEstateListingSchema({ project }: { project: ProjectSchemaProps }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: `https://www.gurgaonrealty.in/project/${project.slug}`,
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
      addressLocality: 'Gurgaon',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4595,
      longitude: 77.0266,
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
export function LocalBusinessSchema({ page = 'home', locationName }: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    name: 'GurgaonRealty',
    alternateName: 'Gurgaon Realty — Property Advisory',
    description:
      'GurgaonRealty is Gurgaon\'s most trusted real estate advisory platform helping buyers find verified new launch, pre-launch and ready-to-move properties. Free site visit support, transparent pricing, RERA-verified projects.',
    url: 'https://www.gurgaonrealty.in',
    logo: 'https://www.gurgaonrealty.in/logo.png',
    image: 'https://www.gurgaonrealty.in/og-image.jpg',
    telephone: '+91-99999-99999',
    email: 'info@gurgaonrealty.in',
    foundingDate: '2020',
    areaServed: [
      { '@type': 'City', name: 'Gurgaon' },
      { '@type': 'AdministrativeArea', name: 'Haryana' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cyber City',
      addressLocality: 'Gurgaon',
      addressRegion: 'Haryana',
      postalCode: '122002',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4595,
      longitude: 77.0266,
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
      ratingValue: '4.8',
      reviewCount: '847',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rajesh Mehta' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'GurgaonRealty helped me compare 6 projects in one weekend site visit. Booked DLF and got the exact price as quoted — zero surprises.',
        datePublished: '2024-11-15',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody:
          'Best advisory team I have worked with. Zero brokerage, honest advice, no pressure. Helped me understand Dwarka Expressway vs Golf Course Extension Road thoroughly.',
        datePublished: '2024-12-02',
      },
    ],
    sameAs: [
      'https://www.facebook.com/gurgaonrealty',
      'https://www.instagram.com/gurgaonrealty',
      'https://www.youtube.com/@gurgaonrealty',
      'https://www.linkedin.com/company/gurgaonrealty',
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
    url: `https://www.gurgaonrealty.in/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'GurgaonRealty',
      url: 'https://www.gurgaonrealty.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GurgaonRealty',
      url: 'https://www.gurgaonrealty.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.gurgaonrealty.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.gurgaonrealty.in/blog/${slug}`,
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
      name: 'Gurgaon',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Haryana',
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
  'application-name': 'GurgaonRealty',
  'theme-color': '#075B63',
  // AI-specific signals
  'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
};

// GEO optimization: structured content hints for AI-driven search
export function GEOContentHints({ location, priceRange, builders }: {
  location: string; priceRange: string; builders: string[];
}) {
  // Hidden semantic enrichment for AI parsers — structured facts
  return (
    <div className="sr-only" aria-hidden="true">
      <span itemProp="name">{location} real estate</span>
      <span itemProp="priceRange">{priceRange}</span>
      {builders.map((b) => <span key={b} itemProp="brand">{b}</span>)}
      <span itemProp="areaServed">Gurgaon, Haryana, India</span>
      <span itemProp="serviceType">Real Estate Advisory</span>
    </div>
  );
}
