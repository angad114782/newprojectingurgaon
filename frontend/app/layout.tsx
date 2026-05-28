import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Topbar from '@/components/layout/Topbar';
import Footer from '@/components/layout/Footer';
import MobileBottomCTA from '@/components/layout/MobileBottomCTA';
import StickyButtons from '@/components/layout/StickyButtons';
import { TrackingProvider } from '@/components/lead/TrackingProvider';
import { UrgencyBanner, TrustStrip, LiveActivityToast, BackToTopButton } from '@/components/conversion/PsychTriggers';
import { fetchSettings } from '@/lib/settings';

function getSiteUrl(host: string | null): string {
  if (!host) return 'https://localhost:3000';
  if (host.startsWith('localhost') || host.startsWith('127.') || host.startsWith('192.168')) {
    return `http://${host}`;
  }
  return `https://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const siteUrl = getSiteUrl(host);
  const settings = await fetchSettings();

  const siteName = settings.siteName || 'New Projects in Gurgaon';
  const title = settings.seoTitle ||
    `New Projects in Gurgaon 2025 | Luxury Apartments & New Launch Property | ${siteName}`;
  const description = settings.seoDescription ||
    `${siteName} — Verified new launch & luxury projects in Gurgaon by DLF, M3M, Godrej, Sobha, Emaar. 3 BHK & 4 BHK on Dwarka Expressway, Golf Course Road from ₹1.5 Cr. Free site visit. Zero brokerage. RERA verified.`;
  const keywords = settings.seoKeywords?.length ? settings.seoKeywords : [
    'new projects in gurgaon 2025', 'new launch projects gurgaon', 'luxury apartments gurgaon',
    'property in gurgaon', '3 bhk gurgaon', '4 bhk gurgaon', 'dwarka expressway projects',
    'golf course road property', 'dlf new project gurgaon', 'm3m gurgaon', 'residential property gurgaon',
    'gurgaon real estate', 'buy flat in gurgaon', 'rera verified projects gurgaon',
  ];
  const ogImage = settings.ogImage?.startsWith('http') ? settings.ogImage : `${siteUrl}${settings.ogImage || '/og-home.jpg'}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: 'Real Estate',
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
    },
    openGraph: {
      type: 'website', locale: 'en_IN', url: siteUrl, siteName,
      title, description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `New Projects in Gurgaon 2025 — ${siteName}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage], site: '@newprojectsingurgaon' },
    alternates: { canonical: siteUrl },
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    // AIO/GEO: structured signals for AI crawlers
    other: {
      'geo.region': 'IN-HR',
      'geo.placename': 'Gurgaon',
      'geo.position': '28.4595;77.0266',
      'ICBM': '28.4595, 77.0266',
      'rating': 'general',
      'revisit-after': '3 days',
      'language': 'English',
      // GSC verification — auto-added from admin settings
      ...((settings as any).googleSearchConsole?.verificationCode
        ? { 'google-site-verification': (settings as any).googleSearchConsole.verificationCode }
        : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const host = headersList.get('host');
  const siteUrl = getSiteUrl(host);
  const settings = await fetchSettings();
  const ga4Id = settings.ga4Id || process.env.NEXT_PUBLIC_GA4_ID || '';

  const sameAsLinks = [
    settings.social?.facebook,
    settings.social?.instagram,
    settings.social?.youtube,
    settings.social?.linkedin,
    settings.social?.twitter,
  ].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: settings.siteName,
    alternateName: 'Gurgaon Realty — Property Advisory',
    description: `${settings.siteName} — Gurgaon's most trusted real estate advisory for new launch projects, luxury apartments and premium residential property. Free advisory. Zero brokerage.`,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 200, height: 60 },
    image: `${siteUrl}/og-home.jpg`,
    telephone: settings.phone,
    email: settings.email,
    foundingDate: '2020',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Online Transfer, Cheque',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress || 'DLF Cyber City',
      addressLocality: 'Gurgaon',
      addressRegion: 'Haryana',
      postalCode: settings.postalCode || '122002',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: settings.geoLat || '28.4595', longitude: settings.geoLng || '77.0266' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' },
    ],
    priceRange: '₹₹₹',
    areaServed: [
      { '@type': 'City', name: 'Gurgaon' },
      { '@type': 'AdministrativeArea', name: 'Haryana' },
    ],
    ...(settings.marketStats?.rating && settings.marketStats?.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: settings.marketStats.rating,
        reviewCount: settings.marketStats.reviewCount.replace(/\D/g, '') || '100',
        bestRating: '5',
        worstRating: '1',
      },
    } : {}),
    ...(settings.googleBusinessProfile ? {
      hasMap: settings.googleBusinessProfile,
      sameAs: [...sameAsLinks, settings.googleBusinessProfile].filter(Boolean),
    } : sameAsLinks.length ? { sameAs: sameAsLinks } : {}),
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: settings.siteName,
          url: siteUrl,
          description: "Gurgaon's most trusted real estate advisory. RERA verified new launch projects. Zero brokerage. Free site visit.",
          inLanguage: 'en-IN',
          publisher: { '@id': `${siteUrl}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/new-projects-in-gurgaon?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }) }} />
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{page_path:window.location.pathname});`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <TrackingProvider>
          <UrgencyBanner config={settings.conversion?.urgencyBanner} />
          <Topbar
            phone={settings.phone}
            email={settings.email}
            address={settings.address}
            totalProjects={settings.marketStats?.totalProjects}
          />
          <Header phone={settings.phone} siteName={settings.siteName} />
          <TrustStrip config={settings.conversion?.trustStrip} />
          <main>{children}</main>
          <Footer
            phone={settings.phone}
            email={settings.email}
            whatsapp={settings.whatsapp}
            siteName={settings.siteName}
            address={settings.address}
            openingHours={settings.openingHours}
            social={settings.social}
            reraNumber={settings.reraNumber}
            reraLink={settings.reraLink}
          />
          <MobileBottomCTA phone={settings.phone} whatsapp={settings.whatsapp} />
          <StickyButtons phone={settings.phone} whatsapp={settings.whatsapp} />
          <LiveActivityToast config={settings.conversion?.liveActivity} />
          <BackToTopButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#075B63', color: '#fff', borderRadius: '12px', fontSize: '14px' },
              success: { style: { background: '#065B63' } },
              error: { style: { background: '#c62828' } },
            }}
          />
        </TrackingProvider>
      </body>
    </html>
  );
}
