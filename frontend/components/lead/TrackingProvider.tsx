'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TrackingContextType {
  visitorId: string;
  trackEvent: (event: string, data?: Record<string, any>) => void;
  trackCTA: (ctaType: string, projectSlug?: string, extraData?: Record<string, any>) => void;
}

const TrackingContext = createContext<TrackingContextType>({
  visitorId: '',
  trackEvent: () => {},
  trackCTA: () => {},
});

export const useTracking = () => useContext(TrackingContext);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [visitorId, setVisitorId] = useState('');

  useEffect(() => {
    // Get or create visitor ID
    let vid = localStorage.getItem('gr_visitor_id');
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem('gr_visitor_id', vid);
    }
    setVisitorId(vid);

    // Track UTM parameters
    const params = new URLSearchParams(window.location.search);
    const utmData = {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmKeyword: params.get('utm_keyword') || '',
      referrer: document.referrer,
    };
    if (Object.values(utmData).some(Boolean)) {
      sessionStorage.setItem('gr_utm', JSON.stringify(utmData));
    }
  }, []);

  const trackEvent = useCallback(
    async (event: string, data: Record<string, any> = {}) => {
      const vid = visitorId || localStorage.getItem('gr_visitor_id') || '';
      if (!vid) return;

      const utmData = JSON.parse(sessionStorage.getItem('gr_utm') || '{}');

      try {
        await fetch(`${API_URL}/leads/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: vid,
            event,
            page: window.location.pathname,
            utmData,
            device: {
              type: window.innerWidth < 768 ? 'mobile' : 'desktop',
              browser: navigator.userAgent.slice(0, 50),
            },
            ...data,
          }),
        });
      } catch (err) {
        // Silently fail - tracking should not break UX
      }
    },
    [visitorId]
  );

  const trackCTA = useCallback(
    async (ctaType: string, projectSlug?: string, extraData: Record<string, any> = {}) => {
      const vid = visitorId || localStorage.getItem('gr_visitor_id') || '';
      if (!vid) return;

      try {
        const res = await fetch(`${API_URL}/leads/cta`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: vid, ctaType, projectSlug, ...extraData }),
        });
        return await res.json();
      } catch (err) {
        return null;
      }
    },
    [visitorId]
  );

  // Track page view
  useEffect(() => {
    if (visitorId) {
      trackEvent('page_visit');
    }
  }, [visitorId, trackEvent]);

  return (
    <TrackingContext.Provider value={{ visitorId, trackEvent, trackCTA }}>
      {children}
    </TrackingContext.Provider>
  );
}
