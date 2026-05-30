'use client';
import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTracking } from './TrackingProvider';
import toast from 'react-hot-toast';
import { fireLeadEvent, fireCompleteRegistrationEvent } from '@/lib/tracking';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5007/api';

interface OTPModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: (leadData: any) => void;
  ctaType?: string;
  projectName?: string;
  prefillData?: {
    name?: string;
    mobile?: string;
    email?: string;
    interestedProject?: string;
    interestedLocation?: string;
  };
}

type Step = 'details' | 'otp' | 'complete';

export default function OTPModal({ isOpen, onClose, onSuccess, ctaType, projectName, prefillData }: OTPModalProps) {
  const { visitorId } = useTracking();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    name: prefillData?.name || '',
    mobile: prefillData?.mobile || '',
    email: prefillData?.email || '',
    budget: '',
    preferredLocation: '',
    buyingPurpose: '',
    timeline: '',
    interestedProject: prefillData?.interestedProject || projectName || '',
    whatsappConsent: true,
  });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset form state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setOtp(['', '', '', '', '', '']);
      setFormData({
        name: prefillData?.name || '',
        mobile: prefillData?.mobile || '',
        email: prefillData?.email || '',
        budget: '',
        preferredLocation: '',
        buyingPurpose: '',
        timeline: '',
        interestedProject: prefillData?.interestedProject || projectName || '',
        whatsappConsent: true,
      });
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, visitorId, name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        const channel = data.channel;
        const msg = data.devMode
          ? 'Dev mode: OTP in backend console'
          : channel === 'whatsapp'
          ? '✅ OTP sent on WhatsApp!'
          : '✅ OTP sent via SMS!';
        toast.success(msg);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, otp: otpString, visitorId, leadData: formData }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gr_lead_token', data.token);
        localStorage.setItem('gr_lead_name', formData.name);
        fireLeadEvent();
        fireCompleteRegistrationEvent();
        setStep('complete');
        setTimeout(() => { onSuccess(data.lead); onClose(); }, 2000);
      } else {
        toast.error(data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch {
      toast.error('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const ctaLabels: Record<string, string> = {
    brochure: '📄 Download Brochure',
    price_list: '💰 Get Price List',
    floor_plan: '📐 View Floor Plans',
    site_visit: '📅 Book Site Visit',
    whatsapp: '💬 WhatsApp Details',
    compare: '🔍 Compare Projects',
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-md mx-auto">
        {/* Header */}
        <div className="bg-brand-dark px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-white text-xl font-semibold">
              {step === 'complete' ? '✅ Verified!' : ctaType ? ctaLabels[ctaType] || 'Get Details' : 'Talk to Expert'}
            </h2>
            {projectName && <p className="text-white/70 text-sm mt-0.5">{projectName}</p>}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step: Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <p className="text-brand-muted text-sm">
                Get instant access to {ctaType === 'price_list' ? 'the latest price list' : ctaType === 'brochure' ? 'the project brochure' : 'project details'}. Quick 30-second verification.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input-field col-span-2"
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="input-field col-span-2"
                  placeholder="Mobile Number *"
                  type="tel"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/, '') })}
                />
                <input
                  className="input-field col-span-2"
                  placeholder="Email (optional)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <select
                  className="select-field"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="">Budget Range</option>
                  <option>Under ₹50 Lakh</option>
                  <option>₹50L – ₹1 Cr</option>
                  <option>₹1 Cr – ₹2 Cr</option>
                  <option>₹2 Cr – ₹5 Cr</option>
                  <option>₹5 Cr+</option>
                </select>
                <select
                  className="select-field"
                  value={formData.buyingPurpose}
                  onChange={(e) => setFormData({ ...formData, buyingPurpose: e.target.value })}
                >
                  <option value="">Purpose</option>
                  <option>Self Use</option>
                  <option>Investment</option>
                  <option>Both</option>
                </select>
              </div>
              {/* Consent */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.whatsappConsent}
                  onChange={(e) => setFormData({ ...formData, whatsappConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-brand-accent"
                />
                <span className="text-xs text-brand-muted leading-relaxed">
                  I agree to receive property details, price updates and site visit assistance on WhatsApp/call. I can opt out anytime.
                </span>
              </label>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {loading ? 'Sending OTP...' : '💬 Get OTP on WhatsApp →'}
              </button>
              <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-brand-accent" />
                Your data is safe and never shared without consent
              </p>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-brand-muted text-sm">OTP sent on <strong>WhatsApp</strong> to <strong>+91-{formData.mobile}</strong></p>
                <p className="text-xs text-brand-muted mt-1">Check your WhatsApp — valid for 10 minutes</p>
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-input"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button onClick={handleVerifyOTP} disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? 'Verifying...' : '✅ Verify & Proceed'}
              </button>
              <button onClick={() => setStep('details')} className="w-full text-center text-sm text-brand-muted hover:text-brand-dark transition-colors">
                ← Change number
              </button>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-brand-mint rounded-full flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-brand-dark">Verified Successfully!</h3>
              <p className="text-brand-muted text-sm">Our property advisor will contact you shortly on WhatsApp & call.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
