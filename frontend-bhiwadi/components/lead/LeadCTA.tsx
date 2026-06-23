'use client';
import { useTracking } from './TrackingProvider';

interface LeadCTAProps {
  children: React.ReactNode;
  className?: string;
  ctaType?: string;
  projectName?: string;
  as?: 'button' | 'a';
  title?: string;
  [key: string]: any;
}

// Drop-in replacement for <a href="#lead-form"> and <Link href="#lead-form">
// Renders as a button that opens the global OTP lead modal
export default function LeadCTA({ children, className, ctaType = 'site_visit_request', projectName, as: Tag = 'button' }: LeadCTAProps) {
  const { openLeadModal } = useTracking();
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={(e: React.MouseEvent) => { e.preventDefault(); openLeadModal({ ctaType, projectName }); }}
      className={className}
      href={Tag === 'a' ? '#' : undefined}
    >
      {children}
    </Tag>
  );
}
