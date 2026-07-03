'use client';
import LeadCTA from '@/components/lead/LeadCTA';

interface StickyProps {
  phone?: string;
  whatsapp?: string;
}

export default function StickyButtons({
  phone = '+91-8619930583',
  whatsapp = '918619930583',
}: StickyProps) {
  const ph = phone.replace(/[^+\d]/g, '');
  const wa = whatsapp.replace(/[^+\d]/g, '');

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-0.5">
      <a href={`tel:${ph}`}
        className="group flex items-center bg-brand-dark text-white px-3 py-3 rounded-l-xl hover:bg-brand-accent transition-colors shadow-lg"
        title="Call Us">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-0 group-hover:ml-2 text-sm font-semibold">
          {phone}
        </span>
      </a>

      <a href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi, I want to know about new projects in Bhiwadi.')}`}
        target="_blank" rel="noopener noreferrer"
        className="group flex items-center bg-green-500 text-white px-3 py-3 rounded-l-xl hover:bg-green-600 transition-colors shadow-lg"
        title="WhatsApp">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-0 group-hover:ml-2 text-sm font-semibold">
          WhatsApp
        </span>
      </a>

      <LeadCTA ctaType="site_visit_request" as="a"
        className="group flex items-center bg-brand-accent text-white px-3 py-3 rounded-l-xl hover:opacity-90 transition-opacity shadow-lg"
        title="Book Site Visit">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-0 group-hover:ml-2 text-sm font-semibold">
          Site Visit
        </span>
      </LeadCTA>
    </div>
  );
}
