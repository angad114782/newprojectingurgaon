import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Topbar from '@/components/layout/Topbar';
import Footer from '@/components/layout/Footer';
import MobileBottomCTA from '@/components/layout/MobileBottomCTA';
import StickyButtons from '@/components/layout/StickyButtons';
import { TrackingProvider } from '@/components/lead/TrackingProvider';
import { UrgencyBanner, TrustStrip, LiveActivityToast } from '@/components/conversion/PsychTriggers';
import { LocalBusinessSchema } from '@/components/seo/SchemaMarkup';

const SITE_URL = 'https://www.gurgaonrealty.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'New Projects in Gurgaon 2025 | New Launch & Premium Property | GurgaonRealty',
    template: '%s | GurgaonRealty',
  },
  description:
    'GurgaonRealty — Gurgaon\'s most trusted real estate advisory. Verified new launch projects, 2 BHK homes, luxury apartments on Dwarka Expressway, Golf Course Extension Road and SPR Road by DLF, M3M, Godrej, Oberoi. Free site visit. Zero brokerage.',
  keywords: [
    'new projects in Gurgaon 2025',
    'new launch projects in Gurgaon',
    'property in Gurgaon',
    '2 bhk homes in Gurgaon',
    'luxury apartments in Gurgaon',
    'property on Dwarka Expressway',
    'on SPR road gurgaon',
    'on dwarka expressway',
    'property in New Gurgaon',
    'residential property in Gurgaon',
    'DLF projects Gurgaon',
    'M3M projects Gurgaon',
    'Godrej Properties Gurgaon',
    'Oberoi Realty Gurgaon',
    'new project in Gurgaon',
    'buy property Gurgaon',
    'flats in Gurgaon',
    'gurgaon real estate 2025',
  ],
  authors: [{ name: 'GurgaonRealty' }],
  creator: 'GurgaonRealty',
  publisher: 'GurgaonRealty',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'GurgaonRealty',
    title: 'New Projects in Gurgaon 2025 | DLF, M3M, Godrej, Oberoi | GurgaonRealty',
    description: 'Verified new projects in Gurgaon — DLF, M3M, Godrej, Krisumi, Oberoi. New launch to ready-to-move from ₹45 Lakh to ₹18 Cr. Free advisory & site visit.',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: 'New Projects in Gurgaon — GurgaonRealty' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Projects in Gurgaon 2025 | GurgaonRealty',
    description: 'Verified new launch & premium property advisory in Gurgaon. DLF, M3M, Godrej, Oberoi projects.',
    images: [`${SITE_URL}/og-home.jpg`],
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['RealEstateAgent', 'LocalBusiness'],
              name: 'GurgaonRealty',
              description: 'Gurgaon\'s most trusted real estate advisory for new launch projects, luxury apartments and premium residential property. Free advisory. Zero brokerage.',
              url: 'https://www.gurgaonrealty.in',
              alternateName: ['GurgaonRealty.in', 'Gurgaon Realty'],
              telephone: '+91-9999999999',
              email: 'info@gurgaonrealty.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'DLF Cyber City',
                addressLocality: 'Gurgaon',
                addressRegion: 'Haryana',
                postalCode: '122002',
                addressCountry: 'IN',
              },
              geo: { '@type': 'GeoCoordinates', latitude: '28.4595', longitude: '77.0266' },
              openingHours: 'Mo-Su 09:00-20:00',
              priceRange: '₹₹₹',
              areaServed: { '@type': 'City', name: 'Gurgaon' },
              sameAs: ['https://facebook.com/gurgaonrealty', 'https://instagram.com/gurgaonrealty'],
            }),
          }}
        />
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID}',{page_path:window.location.pathname});`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <TrackingProvider>
          <UrgencyBanner />
          <Topbar />
          <Header />
          <TrustStrip />
          <main>{children}</main>
          <Footer />
          <MobileBottomCTA />
          <StickyButtons />
          <LiveActivityToast />
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
