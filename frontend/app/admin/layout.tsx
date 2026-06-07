'use client';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin, API } from './_context';
import clsx from 'clsx';

// ── Sidebar nav items ──────────────────────────────────────────────────────
const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/admin/leads', label: 'Leads', icon: '👥', badge: 'live' },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/seo-intel', label: 'SEO Intelligence', icon: '🧠', accent: true },
];

const BOTTOM_NAV = [
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/team', label: 'Team', icon: '👤' },
];

function Sidebar({ siteName, collapsed, setCollapsed }: {
  siteName: string; collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const link = (item: typeof NAV[0]) => (
    <Link key={item.href} href={item.href}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
        isActive(item.href, item.exact)
          ? item.accent
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : 'bg-white/15 text-white'
          : 'text-slate-400 hover:text-white hover:bg-white/8'
      )}>
      <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge === 'live' && (
        <span className="ml-auto flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />LIVE
        </span>
      )}
      {collapsed && (
        <div className="absolute left-14 z-50 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
          {item.label}
        </div>
      )}
    </Link>
  );

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen flex flex-col bg-slate-900 border-r border-slate-800 z-40 transition-all duration-300',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
          {(siteName || 'A')[0].toUpperCase()}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate leading-tight">Admin Panel</p>
            <p className="text-slate-500 text-[10px] truncate">{siteName || 'Gurgaon Realty'}</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-white transition-colors text-xs shrink-0 ml-auto">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(link)}

        <div className="my-3 border-t border-slate-800" />

        {BOTTOM_NAV.map(link)}
      </nav>

      {/* View site + logout */}
      <div className="border-t border-slate-800 p-2 space-y-1">
        <a href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/8 transition-all">
          <span className="w-5 text-center">🔗</span>
          {!collapsed && 'View Live Site'}
        </a>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <span className="w-5 text-center">→</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

// ── Login form ─────────────────────────────────────────────────────────────
function LoginGate() {
  const { setToken } = useAdmin();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (mobile.length !== 10) return setError('Enter a valid 10-digit mobile number');
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/admin/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const d = await r.json();
      if (d.success) setStep('otp');
      else setError(d.message || 'Failed to send OTP');
    } catch { setError('Server error. Try again.'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return setError('Enter the OTP');
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/admin/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });
      const d = await r.json();
      if (d.success && d.token) setToken(d.token);
      else setError(d.message || 'Invalid OTP');
    } catch { setError('Server error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <span className="text-white text-3xl font-bold">G</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">Gurgaon Realestate Dashboard</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {step === 'mobile' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Mobile Number</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-400 text-sm">+91</span>
                  <input
                    type="tel" value={mobile} maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-r-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="10-digit number" autoFocus />
                </div>
              </div>
              <button onClick={sendOtp} disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? '⏳ Sending OTP…' : 'Send OTP →'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">OTP sent to +91 {mobile}</label>
                <input
                  type="text" value={otp} maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm text-center tracking-[0.5em] text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="• • • • • •" autoFocus />
              </div>
              <button onClick={verifyOtp} disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? '⏳ Verifying…' : 'Login →'}
              </button>
              <button onClick={() => { setStep('mobile'); setOtp(''); setError(''); }}
                className="w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors">
                ← Change number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Inner layout (after auth) ──────────────────────────────────────────────
function AdminShell({ children }: { children: ReactNode }) {
  const { token, ready, authH } = useAdmin();
  const [siteName, setSiteName] = useState('Gurgaon Realty');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/admin/settings`, { headers: authH() })
      .then(r => r.json())
      .then(d => { if (d.success && d.settings?.siteName) setSiteName(d.settings.siteName); })
      .catch(() => {});
  }, [token]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!token) return <LoginGate />;

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar siteName={siteName} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`min-h-screen transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
