'use client';
import { useEffect, useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────
// 1. LIVE ACTIVITY BAR — "47 people viewing now"
// ─────────────────────────────────────────────
const CITIES = ['Delhi', 'Noida', 'Faridabad', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chandigarh'];
const NAMES = ['Rahul S.', 'Priya K.', 'Amit V.', 'Neha G.', 'Vikram M.', 'Sunita R.', 'Rohit B.', 'Anjali T.', 'Deepak A.', 'Kavita P.'];
const ACTIONS = [
  'just requested the price list',
  'booked a free site visit',
  'downloaded the brochure',
  'asked about payment plans',
  'enquired about floor plans',
  'checked unit availability',
];

export function LiveActivityToast() {
  const [visible, setVisible] = useState(false);
  const [activity, setActivity] = useState({ name: '', city: '', action: '', time: '' });

  const showNext = useCallback(() => {
    setActivity({
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
      time: `${Math.floor(Math.random() * 12) + 1} min ago`,
    });
    setVisible(true);
    setTimeout(() => setVisible(false), 4500);
  }, []);

  useEffect(() => {
    const first = setTimeout(showNext, 8000);
    const interval = setInterval(showNext, 22000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [showNext]);

  return (
    <div
      className={`fixed bottom-24 left-4 z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      style={{ maxWidth: 300 }}
    >
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl px-4 py-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-dark to-brand-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {activity.name?.[0]}
        </div>
        <div>
          <p className="text-brand-text text-xs font-semibold leading-snug">
            {activity.name} from {activity.city}
          </p>
          <p className="text-brand-muted text-xs leading-snug">{activity.action}</p>
          <p className="text-brand-accent text-xs font-medium mt-0.5">{activity.time}</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-gray-300 hover:text-gray-500 text-lg leading-none ml-1 flex-shrink-0">×</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. VIEWING COUNT — "43 people viewing this"
// ─────────────────────────────────────────────
export function ViewingCount({ projectName }: { projectName?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Seed a deterministic-ish number based on project name + time-of-day bucket
    const base = projectName
      ? (projectName.charCodeAt(0) + projectName.charCodeAt(1)) % 30 + 18
      : Math.floor(Math.random() * 25) + 22;
    setCount(base);
    const interval = setInterval(() => {
      setCount((c) => c + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 2 : 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [projectName]);

  if (!count) return null;
  return (
    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5 text-xs font-medium text-orange-700">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
      </span>
      <span>{count} people viewing this right now</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. SCARCITY BADGE — "Only 4 units left"
// ─────────────────────────────────────────────
export function ScarcityBadge({ units = 4 }: { units?: number }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 text-xs font-semibold text-red-700 animate-pulse">
      🔴 Only {units} units left at this price
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. PRICE VALIDITY COUNTDOWN
// ─────────────────────────────────────────────
export function PriceCountdown() {
  const getExpiry = () => {
    const now = new Date();
    // expires end of day
    const end = new Date(now);
    end.setHours(23, 59, 59, 0);
    return end;
  };

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = getExpiry().getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl px-4 py-3 text-center">
      <p className="text-xs font-medium mb-1.5 opacity-90">⚡ Current pricing valid for</p>
      <div className="flex items-center justify-center gap-2">
        {[{ v: timeLeft.h, l: 'Hrs' }, { v: timeLeft.m, l: 'Min' }, { v: timeLeft.s, l: 'Sec' }].map(({ v, l }) => (
          <div key={l} className="text-center">
            <div className="bg-white/20 rounded-lg px-3 py-1 font-mono font-bold text-lg min-w-[2.5rem]">{pad(v)}</div>
            <div className="text-xs opacity-80 mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. EXIT INTENT POPUP
// ─────────────────────────────────────────────
export function ExitIntentPopup({ onSubmit }: { onSubmit: (mobile: string) => void }) {
  const [show, setShow] = useState(false);
  const [mobile, setMobile] = useState('');
  const [fired, setFired] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_popup_dismissed')) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 30 && !fired) {
        setFired(true);
        setShow(true);
      }
    };
    // Also fire on 90% scroll
    const scrollHandler = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.88 && !fired) {
        setFired(true);
        setTimeout(() => setShow(true), 1500);
      }
    };
    document.addEventListener('mouseleave', handler);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', handler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [fired]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('exit_popup_dismissed', '1');
  };

  const handleSubmit = () => {
    if (mobile.length < 10) return;
    setSubmitted(true);
    onSubmit(mobile);
    setTimeout(dismiss, 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4" onClick={dismiss}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with urgency */}
        <div className="bg-gradient-to-br from-brand-dark to-[#065B63] p-6 text-white text-center relative">
          <button onClick={dismiss} className="absolute top-3 right-4 text-white/60 hover:text-white text-2xl">×</button>
          <div className="text-4xl mb-2">🎁</div>
          <h2 className="text-2xl font-display font-bold mb-1">Wait! Don't Miss This</h2>
          <p className="text-white/80 text-sm">Get <strong className="text-brand-accent">₹2 Lakh off</strong> on pre-launch booking price — exclusive for today's visitors</p>
        </div>

        {!submitted ? (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-yellow-800 text-sm font-medium text-center mb-5">
              ⏰ This offer expires when you leave this page
            </div>
            <p className="text-brand-muted text-sm text-center mb-4">Enter your WhatsApp number to receive the exclusive pre-launch price</p>
            <div className="flex gap-3">
              <div className="flex items-center bg-brand-mint/40 border border-brand-border rounded-xl px-3 text-brand-muted text-sm font-medium">+91</div>
              <input
                type="tel" value={mobile} maxLength={10}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="WhatsApp Number"
                className="input-field flex-1"
                autoFocus
              />
            </div>
            <button onClick={handleSubmit} disabled={mobile.length < 10} className="btn-primary w-full mt-4 disabled:opacity-50">
              Get ₹2 Lakh Off — Send on WhatsApp 💬
            </button>
            <p className="text-brand-muted text-xs text-center mt-3">🔒 No spam. Only one message with the exclusive price.</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="font-display font-bold text-brand-text text-lg mb-2">Sending to your WhatsApp!</h3>
            <p className="text-brand-muted text-sm">You'll receive the exclusive price within 2 minutes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. ROI CALCULATOR — emotional investment hook
// ─────────────────────────────────────────────
export function ROICalculator() {
  const [investment, setInvestment] = useState(100);
  const [years, setYears] = useState(3);
  const [appreciation, setAppreciation] = useState(15);

  const futureValue = Math.round(investment * Math.pow(1 + appreciation / 100, years));
  const profit = futureValue - investment;
  const roi = Math.round((profit / investment) * 100);

  return (
    <div className="bg-gradient-to-br from-brand-dark to-[#065B63] rounded-2xl p-6 text-white border border-brand-accent/30 mb-6 mt-10">
      <h3 className="font-display font-bold text-lg mb-1">📈 Investment Return Calculator</h3>
      <p className="text-white/70 text-xs mb-5">See how much your Gurgaon property investment can grow</p>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/70">Investment Amount</span>
            <span className="font-bold text-brand-accent">₹{investment} Lakh</span>
          </div>
          <input type="range" min="50" max="500" step="10" value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full accent-brand-accent h-2 rounded-full"
          />
          <div className="flex justify-between text-white/40 text-xs mt-0.5"><span>₹50L</span><span>₹5Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/70">Holding Period</span>
            <span className="font-bold text-brand-accent">{years} Years</span>
          </div>
          <input type="range" min="1" max="7" step="1" value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-brand-accent h-2 rounded-full"
          />
          <div className="flex justify-between text-white/40 text-xs mt-0.5"><span>1yr</span><span>7yrs</span></div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/70">Expected Appreciation/yr</span>
            <span className="font-bold text-brand-accent">{appreciation}%</span>
          </div>
          <input type="range" min="8" max="30" step="1" value={appreciation}
            onChange={(e) => setAppreciation(Number(e.target.value))}
            className="w-full accent-brand-accent h-2 rounded-full"
          />
          <div className="flex justify-between text-white/40 text-xs mt-0.5"><span>8%</span><span>30%</span></div>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center mb-4">
        <div>
          <div className="text-white/60 text-xs mb-1">You Invest</div>
          <div className="text-white font-bold text-base">₹{investment}L</div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">Return in {years}yr</div>
          <div className="text-brand-accent font-bold text-lg">₹{futureValue}L</div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">Total ROI</div>
          <div className="text-green-400 font-bold text-lg">+{roi}%</div>
        </div>
      </div>

      <div className="bg-brand-accent/20 border border-brand-accent/30 rounded-xl px-4 py-2.5 text-center">
        <p className="text-brand-accent text-sm font-semibold">
          💰 Profit of ₹{profit} Lakh in just {years} years
        </p>
        <p className="text-white/60 text-xs mt-0.5">Based on Dwarka Expressway historical data</p>
      </div>

      <a href="#lead-form" className="btn-primary w-full text-center block mt-4">
        Calculate for My Budget →
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. PRICE GATE — blur price until mobile entered
// ─────────────────────────────────────────────
export function PriceGate({ price, onUnlock }: { price: string; onUnlock: (mobile: string) => void }) {
  const [mobile, setMobile] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    if (mobile.length < 10) return;
    setUnlocked(true);
    onUnlock(mobile);
  };

  if (unlocked) {
    return (
      <div className="text-center">
        <div className="text-3xl font-display font-bold text-brand-dark">{price}</div>
        <p className="text-brand-accent text-xs mt-1 font-medium">✓ Price unlocked — advisor will call shortly</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-3xl font-display font-bold text-brand-dark blur-sm select-none">{price}</div>
      <div className="mt-3 bg-brand-mint/60 rounded-xl p-4 border border-brand-border/60">
        <p className="text-brand-text text-xs font-semibold mb-2">🔒 Enter your number to see actual price</p>
        <div className="flex gap-2">
          <input
            type="tel" value={mobile} maxLength={10}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="Mobile number"
            className="input-field text-sm flex-1 py-2"
          />
          <button onClick={handleUnlock} disabled={mobile.length < 10}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 hover:bg-brand-primary transition-colors whitespace-nowrap">
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. SCROLL TRIGGER MODAL — fires at 60% scroll
// ─────────────────────────────────────────────
export function ScrollTriggerModal({ projectName }: { projectName?: string }) {
  const [show, setShow] = useState(false);
  const [fired, setFired] = useState(false);
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('scroll_modal_done')) return;
    const handler = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.6 && !fired) {
        setFired(true);
        setShow(true);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [fired]);

  const handleSubmit = () => {
    if (mobile.length < 10) return;
    setSubmitted(true);
    sessionStorage.setItem('scroll_modal_done', '1');
    setTimeout(() => setShow(false), 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4"
      onClick={() => { setShow(false); sessionStorage.setItem('scroll_modal_done', '1'); }}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-brand-dark px-6 pt-6 pb-4 text-white text-center">
          <div className="text-3xl mb-2">🏠</div>
          <h3 className="font-display font-bold text-xl mb-1">Interested in this project?</h3>
          <p className="text-white/70 text-sm">Get the <strong className="text-brand-accent">exact price list + floor plans</strong> on WhatsApp — right now</p>
        </div>
        {!submitted ? (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              {['✅ RERA Verified', '📋 Full Price List', '🗺️ Floor Plans', '📞 Expert Call Back'].map((f) => (
                <div key={f} className="flex items-center gap-1.5 bg-brand-mint/40 rounded-lg px-3 py-2 text-brand-muted font-medium">{f}</div>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex items-center bg-brand-mint/40 border border-brand-border rounded-xl px-3 text-brand-muted text-sm">+91</div>
              <input type="tel" value={mobile} maxLength={10}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Your WhatsApp number"
                className="input-field flex-1" autoFocus />
            </div>
            <button onClick={handleSubmit} disabled={mobile.length < 10}
              className="btn-primary w-full disabled:opacity-50">
              Send Price List on WhatsApp →
            </button>
            <button onClick={() => { setShow(false); sessionStorage.setItem('scroll_modal_done', '1'); }}
              className="w-full text-center text-brand-muted text-xs mt-3 hover:text-brand-dark">
              No thanks, I'll find out later
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-bold text-brand-text">Sending to +91 {mobile}!</p>
            <p className="text-brand-muted text-sm mt-1">Check WhatsApp in 2 minutes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. URGENCY TOP BANNER
// ─────────────────────────────────────────────
export function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-xs sm:text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <span className="animate-pulse">🔥</span>
      <span>
        <strong>Price hike alert:</strong> Dwarka Expressway projects raising prices by 5–8% in June 2025.
        <a href="#lead-form" className="underline ml-1.5 font-bold hover:text-yellow-200">Lock today's price →</a>
      </span>
      <button onClick={() => setDismissed(true)} className="absolute right-3 text-white/70 hover:text-white text-lg">×</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 10. TRUST SIGNALS STRIP
// ─────────────────────────────────────────────
export function TrustStrip() {
  const signals = [
    { icon: '🏆', text: '4,200+ Families Helped' },
    { icon: '✅', text: 'RERA Verified Projects Only' },
    { icon: '🎓', text: 'Certified Property Advisors' },
    { icon: '💯', text: 'Zero Brokerage for Buyers' },
    { icon: '⚡', text: '2-Hour Response Guarantee' },
    { icon: '🔒', text: 'Your Data is Private' },
  ];
  return (
    <div className="bg-brand-dark border-y border-white/10 py-3 overflow-hidden">
      <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {[...signals, ...signals].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-white/80 text-xs font-medium flex-shrink-0">
            <span>{s.icon}</span><span>{s.text}</span>
            <span className="text-white/20 ml-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
