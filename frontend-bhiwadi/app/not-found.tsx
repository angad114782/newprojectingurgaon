import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Property in Bhiwadi',
  description: 'The page you are looking for does not exist. Explore verified new launch and residential projects in Bhiwadi instead.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-mint/20 px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-display font-bold text-brand-border mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-brand-text mb-3">Page Not Found</h1>
        <p className="text-brand-muted leading-relaxed mb-8">
          The page you are looking for doesn't exist or has been moved. Explore our verified Bhiwadi property listings instead.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Go to Homepage</Link>
          <Link href="/residential-property-in-bhiwadi" className="btn-outline">View All Projects</Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          {[
            { label: 'New Launch Bhiwadi', href: '/new-launch-bhiwadi' },
            { label: 'Alwar Bypass Projects', href: '/alwar-bypass-road-projects' },
            { label: 'Residential Property Bhiwadi', href: '/residential-property-in-bhiwadi' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-brand-dark hover:text-brand-accent underline underline-offset-2">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
