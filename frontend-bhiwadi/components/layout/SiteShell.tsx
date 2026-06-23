'use client';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Topbar from './Topbar';
import Footer from './Footer';
import MobileBottomCTA from './MobileBottomCTA';
import StickyButtons from './StickyButtons';
import { TrackingProvider } from '@/components/lead/TrackingProvider';
import { UrgencyBanner, TrustStrip, LiveActivityToast, BackToTopButton } from '@/components/conversion/PsychTriggers';

interface SiteShellProps {
  children: React.ReactNode;
  settings: {
    phone?: string;
    phone2?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
    siteName?: string;
    logoUrl?: string;
    footerLogoUrl?: string;
    openingHours?: string;
    reraNumber?: string;
    reraLink?: string;
    social?: any;
    marketStats?: any;
    conversion?: any;
  };
}

export default function SiteShell({ children, settings }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <TrackingProvider>
      <UrgencyBanner config={settings.conversion?.urgencyBanner} />
      <Topbar
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        totalProjects={settings.marketStats?.totalProjects}
      />
      <Header phone={settings.phone} siteName={settings.siteName} logoUrl={settings.logoUrl} />
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
        logoUrl={settings.footerLogoUrl || settings.logoUrl}
      />
      <MobileBottomCTA phone={settings.phone} whatsapp={settings.whatsapp} />
      <StickyButtons phone={settings.phone} whatsapp={settings.whatsapp} />
      <LiveActivityToast config={settings.conversion?.liveActivity} />
      <BackToTopButton />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3000, style: { background: '#1a1a2e', color: '#fff', border: '1px solid #2d2d4e' } }}
      />
    </TrackingProvider>
  );
}
