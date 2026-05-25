'use client';
import { useState } from 'react';
import { useTracking } from '@/components/lead/TrackingProvider';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LeadForm({ compact }: { compact?: boolean }) {
  const { visitorId } = useTracking();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', budget: '', preferredLocation: '',
    buyingPurpose: '', timeline: '', whatsappConsent: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || form.mobile.length < 10) {
      toast.error('Please enter name and valid mobile number');
      return;
    }
    setLoading(true);
    try {
      const utmData = JSON.parse(sessionStorage.getItem('gr_utm') || '{}');
      const res = await fetch(`${API_URL}/leads/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, visitorId, sourcePage: window.location.pathname, utmData }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success('Thank you! Our advisor will contact you shortly.');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div id="lead-form" className="bg-brand-mint rounded-3xl p-10 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-brand-dark mb-2">Thank You, {form.name}! 🏡</h3>
        <p className="text-brand-muted">Our expert property advisor will reach out to you on <strong>{form.mobile}</strong> within 2 hours with the best matched properties.</p>
        {form.whatsappConsent && (
          <p className="text-sm text-brand-muted mt-3">📱 Property details will also be shared on WhatsApp.</p>
        )}
      </div>
    );
  }

  return (
    <div id="lead-form" className="bg-white rounded-3xl shadow-card border border-brand-border/50 p-8 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <span className="badge bg-brand-mint text-brand-dark border border-brand-border mb-3">🏠 Free Advisory</span>
        <h3 className="font-display text-2xl font-bold text-brand-text">Get Expert Property Guidance</h3>
        <p className="text-brand-muted text-sm mt-1.5">Fill in your details and our advisor will share the best options for your budget and preference.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="input-field"
            placeholder="Your Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input-field"
            type="tel"
            placeholder="Mobile Number *"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/, '') })}
            required
          />
          <input
            className="input-field sm:col-span-2"
            type="email"
            placeholder="Email Address (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select className="select-field" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
            <option value="">Budget Range</option>
            <option>Under ₹50 Lakh</option>
            <option>₹50L – ₹1 Cr</option>
            <option>₹1 Cr – ₹2 Cr</option>
            <option>₹2 Cr – ₹5 Cr</option>
            <option>₹5 Cr+</option>
          </select>
          <select className="select-field" value={form.preferredLocation} onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}>
            <option value="">Preferred Location</option>
            <option>Dwarka Expressway</option>
            <option>Golf Course Extension Road</option>
            <option>Golf Course Road</option>
            <option>SPR Road</option>
            <option>Sector 113</option>
            <option>Sector 106</option>
            <option>Sector 102</option>
            <option>New Gurgaon</option>
            <option>Any in Gurgaon</option>
          </select>
          <select className="select-field" value={form.buyingPurpose} onChange={(e) => setForm({ ...form, buyingPurpose: e.target.value })}>
            <option value="">Buying Purpose</option>
            <option>Self Use</option>
            <option>Investment</option>
            <option>Both</option>
          </select>
          <select className="select-field" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
            <option value="">Your Timeline</option>
            <option>Immediately</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>Not Decided</option>
          </select>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={form.whatsappConsent}
            onChange={(e) => setForm({ ...form, whatsappConsent: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-brand-accent"
          />
          <span className="text-xs text-brand-muted leading-relaxed">
            I agree to receive property details, price updates and site visit assistance on WhatsApp/call. I can opt out anytime.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
        >
          {loading ? (
            <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></span>Submitting...</>
          ) : '📅 Get Free Property Guidance →'}
        </button>

        <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          100% Secure · Zero Spam · Expert Guidance
        </p>
      </form>
    </div>
  );
}
