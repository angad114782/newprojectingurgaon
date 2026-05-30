// Client-side tracking helpers — fire Meta Pixel, Google Ads, GTM events
// IDs are injected into window.__TRACKING__ by layout.tsx at page load

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    __TRACKING__?: {
      googleAdsId?: string;
      googleAdsLabel?: string;
      googleAdsValue?: number;
    };
  }
}

// Fire on any successful lead (form submit, OTP verify)
export function fireLeadEvent() {
  if (typeof window === 'undefined') return;

  // Meta Pixel — Lead standard event
  window.fbq?.('track', 'Lead');

  // Google Ads — conversion
  const t = window.__TRACKING__ || {};
  if (window.gtag && t.googleAdsId && t.googleAdsLabel) {
    window.gtag('event', 'conversion', {
      send_to: `${t.googleAdsId}/${t.googleAdsLabel}`,
      value: t.googleAdsValue || 1,
      currency: 'INR',
    });
  }

  // GTM dataLayer push
  window.dataLayer?.push({ event: 'lead_generated', event_category: 'Lead', event_label: 'form_submit' });
}

// Fire when a project page is viewed
export function fireViewContentEvent(projectName: string, value?: number) {
  if (typeof window === 'undefined') return;

  window.fbq?.('track', 'ViewContent', { content_name: projectName, currency: 'INR', value: value || 0 });
  window.dataLayer?.push({ event: 'view_project', project_name: projectName });
}

// Fire when OTP is verified (higher-intent than raw form submit)
export function fireCompleteRegistrationEvent() {
  if (typeof window === 'undefined') return;

  window.fbq?.('track', 'CompleteRegistration');
  window.dataLayer?.push({ event: 'otp_verified', event_category: 'Lead' });
}
