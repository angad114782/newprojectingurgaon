import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';
import SiteShell from '@/components/layout/SiteShell';
import { fetchSettings } from '@/lib/settings';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertyinbhiwadi.com';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = SITE_URL;
  const settings = await fetchSettings();

  const siteName = settings.siteName || 'Property in Bhiwadi';
  const title = settings.seoTitle ||
    `Property in Bhiwadi 2025 | Residential Plots, Flats & New Launch Projects | ${siteName}`;
  const description = settings.seoDescription ||
    `${siteName} — Verified new launch & affordable residential projects in Bhiwadi by Omaxe, Ashiana, GLS, Supertech. 2 BHK & 3 BHK on Alwar Bypass, NH-48 from ₹25 Lakh. Free site visit. Zero brokerage. RERA verified.`;
  const keywords = settings.seoKeywords?.length ? settings.seoKeywords : [
    'property in bhiwadi', 'plots in bhiwadi', 'flats in bhiwadi', 'residential property bhiwadi',
    'bhiwadi real estate', 'bhiwadi new projects 2025', '2 bhk bhiwadi', '3 bhk bhiwadi',
    'alwar bypass road projects', 'nh 48 bhiwadi property', 'neemrana bhiwadi projects',
    'tapukara bhiwadi', 'buy flat bhiwadi', 'rera verified projects bhiwadi', 'bhiwadi investment',
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Property in Bhiwadi 2025 — ${siteName}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage], site: '@propertyinbhiwadi' },
    icons: {
      icon: settings.faviconUrl
        ? [{ url: settings.faviconUrl, sizes: '32x32', type: 'image/png' }]
        : [
            { url: '/favicon.ico', sizes: '48x48' },
            { url: '/icon.svg', type: 'image/svg+xml' },
          ],
      apple: settings.faviconUrl || '/apple-touch-icon.png',
      shortcut: settings.faviconUrl || '/favicon.ico',
    },
    // AIO/GEO: structured signals for AI crawlers
    other: {
      'geo.region': 'IN-RJ',
      'geo.placename': 'Bhiwadi',
      'geo.position': '28.2069;76.8514',
      'ICBM': '28.2069, 76.8514',
      'rating': 'general',
      'revisit-after': '3 days',
      'language': 'en',
      'content-language': 'en-IN',
      // GSC verification — auto-added from admin settings
      ...((settings as any).googleSearchConsole?.verificationCode
        ? { 'google-site-verification': (settings as any).googleSearchConsole.verificationCode }
        : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = SITE_URL;
  const settings = await fetchSettings();
  const ga4Id              = settings.ga4Id              || process.env.NEXT_PUBLIC_GA4_ID || '';
  const metaPixelId        = settings.metaPixelId        || '';
  const googleAdsId        = settings.googleAdsId        || '';
  const googleAdsLabel     = settings.googleAdsConversionLabel || '';
  const googleAdsValue     = settings.googleAdsConversionValue ?? 0;
  const gtmId              = settings.gtmId              || '';
  // Combined gtag src — prefer GA4 ID, fall back to Google Ads ID
  const gtagSrcId = ga4Id || googleAdsId;

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
    alternateName: 'Bhiwadi Realty — Property Advisory',
    description: `${settings.siteName} — Bhiwadi's most trusted real estate advisory for new launch projects, residential plots and affordable property on NH-48. Free advisory. Zero brokerage.`,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 200, height: 60 },
    image: `${siteUrl}/og-home.jpg`,
    telephone: [settings.phone, settings.phone2].filter(Boolean),
    email: settings.email,
    foundingDate: '2020',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Online Transfer, Cheque',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress || 'Bhiwadi Industrial Area, RIICO',
      addressLocality: 'Bhiwadi',
      addressRegion: 'Rajasthan',
      postalCode: settings.postalCode || '301019',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: settings.geoLat || '28.2069', longitude: settings.geoLng || '76.8514' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' },
    ],
    priceRange: '₹₹₹',
    areaServed: [
      { '@type': 'City', name: 'Bhiwadi' },
      { '@type': 'City', name: 'Neemrana' },
      { '@type': 'City', name: 'Tapukara' },
      { '@type': 'AdministrativeArea', name: 'Rajasthan' },
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
        <link rel="manifest" href="/manifest.json" />
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
          description: "Bhiwadi's most trusted real estate advisory. RERA verified residential plots & flats on NH-48. Zero brokerage. Free site visit.",
          inLanguage: 'en-IN',
          publisher: { '@id': `${siteUrl}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/residential-property-in-bhiwadi?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }) }} />
      </head>
      <body>
        <SiteShell settings={settings}>
          {children}
        </SiteShell>
      </body>
      {/* ── Google Tag Manager ─────────────────────────────────── */}
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      )}

      {/* ── GA4 + Google Ads — single gtag.js load ─────────────── */}
      {gtagSrcId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagSrcId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            ${ga4Id       ? `gtag('config','${ga4Id}',{page_path:window.location.pathname});` : ''}
            ${googleAdsId ? `gtag('config','${googleAdsId}');` : ''}
          `}</Script>
        </>
      )}

      {/* ── Meta (Facebook / Instagram) Pixel ──────────────────── */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
          n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
          }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${metaPixelId}');
          fbq('track','PageView');
        `}</Script>
      )}

      {/* ── Tracking config for client-side conversion events ──── */}
      {(googleAdsId || metaPixelId) && (
        <Script id="tracking-config" strategy="afterInteractive">{`
          window.__TRACKING__={googleAdsId:'${googleAdsId}',googleAdsLabel:'${googleAdsLabel}',googleAdsValue:${googleAdsValue}};
        `}</Script>
      )}
    </html>
  );
}
