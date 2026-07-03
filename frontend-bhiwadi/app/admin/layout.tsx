'use client';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin, API } from './_context';
import clsx from 'clsx';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/admin/leads', label: 'Lead CMS', icon: '👥', badge: 'live' },
  { href: '/admin/projects', label: 'Projects', icon: '🏗️' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/seo-intel', label: 'SEO Intelligence', icon: '🧠', accent: true },
  { href: '/admin/seo-score', label: 'SEO Score', icon: '🎯' },
  { href: '/admin/gsc', label: 'Search Console', icon: '🔍' },
  { href: '/admin/indexing', label: 'Instant Indexing', icon: '⚡' },
  { href: '/admin/tracking', label: 'Meta / Google Ads', icon: '📈' },
  { href: '/admin/conversion', label: 'Psych Triggers', icon: '🔮' },
  { href: '/admin/branding', label: 'Branding', icon: '🏢' },
];
const BOTTOM_NAV = [
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/team', label: 'Team', icon: '👤' },
  { href: '/admin/profile', label: 'My Profile', icon: '👤' },
];

function NavLink({
  item, collapsed, onClick,
}: {
  item: (typeof NAV)[0]; collapsed: boolean; onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group',
        active
          ? item.accent
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
            : 'bg-white/[0.15] text-white'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
      )}
    >
      <span className="text-base w-5 text-center shrink-0 leading-none">{item.icon}</span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge === 'live' && (
            <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
              LIVE
            </span>
          )}
        </>
      )}

      {/* Tooltip when collapsed — desktop only */}
      {collapsed && (
        <span className="pointer-events-none absolute left-14 z-50 hidden group-hover:block bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
          {item.label}
        </span>
      )}
    </Link>
  );
}

function Sidebar({
  siteName, collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  siteName: string;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const { logout } = useAdmin();

  const inner = (
    <aside
      className={clsx(
        'flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 overflow-hidden',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo row */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
          {(siteName || 'G')[0].toUpperCase()}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate leading-tight">Admin Panel</p>
            <p className="text-slate-500 text-[10px] truncate">{siteName}</p>
          </div>
        )}
        {/* Collapse toggle — hidden on mobile */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto w-6 h-6 items-center justify-center text-slate-500 hover:text-white transition-colors text-xs shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white text-lg"
        >
          ×
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
        ))}
        <div className="my-3 border-t border-slate-800" />
        {BOTTOM_NAV.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-2 space-y-0.5 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <span className="w-5 text-center shrink-0">🔗</span>
          {!collapsed && <span>View Live Site</span>}
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="w-5 text-center shrink-0">⎋</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className={clsx(
        'hidden lg:flex fixed left-0 top-0 h-screen z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {inner}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div className={clsx(
        'lg:hidden fixed left-0 top-0 h-screen z-50 w-64 transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* force w-60 on mobile */}
        <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64">
          <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(siteName || 'G')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">Admin Panel</p>
              <p className="text-slate-500 text-[10px] truncate">{siteName}</p>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white text-xl w-7 h-7 flex items-center justify-center">×</button>
          </div>
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {NAV.map(item => (
              <NavLink key={item.href} item={item} collapsed={false} onClick={() => setMobileOpen(false)} />
            ))}
            <div className="my-3 border-t border-slate-800" />
            {BOTTOM_NAV.map(item => (
              <NavLink key={item.href} item={item} collapsed={false} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
          <div className="border-t border-slate-800 p-2 space-y-0.5 shrink-0">
            <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
              <span>🔗</span> View Live Site
            </a>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <span>⎋</span> Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

// ── Top bar (mobile) ───────────────────────────────────────────────────────
function TopBar({ siteName, onMenu }: { siteName: string; onMenu: () => void }) {
  const pathname = usePathname();
  const current = [...NAV, ...BOTTOM_NAV].find((n: any) =>
    n.exact ? pathname === n.href : pathname.startsWith(n.href)
  );
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-slate-200 px-4 h-14 shrink-0">
      <button
        onClick={onMenu}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-lg font-bold"
        aria-label="Open menu"
      >
        ☰
      </button>
      <span className="font-semibold text-slate-900 text-sm truncate">
        {current?.icon} {current?.label || 'Admin'}
      </span>
    </header>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────
function LoginGate() {
  const { setToken } = useAdmin();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (mobile.length !== 10) return setError('Valid 10-digit number enter karo');
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/admin/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const d = await r.json();
      if (d.success) setStep('otp');
      else setError(d.message || 'OTP send failed');
    } catch { setError('Server error. Try again.'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return setError('OTP enter karo');
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <span className="text-white text-3xl font-bold select-none">P</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">Bhiwadi Property Dashboard</p>
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
                  <span className="flex items-center px-3 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-400 text-sm shrink-0">+91</span>
                  <input type="tel" value={mobile} maxLength={10}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-r-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="10-digit number" autoFocus />
                </div>
              </div>
              <button onClick={sendOtp} disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? '⏳ Sending…' : 'Send OTP →'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">OTP sent to +91 {mobile}</label>
                <input type="text" value={otp} maxLength={6}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white text-center tracking-[0.4em] text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="——————" autoFocus />
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

// ── Shell ──────────────────────────────────────────────────────────────────
function AdminShell({ children }: { children: ReactNode }) {
  const { token, ready, authH } = useAdmin();
  const [siteName, setSiteName] = useState('Property in Bhiwadi');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!token) return <LoginGate />;

  const sidebarW = collapsed ? 'lg:pl-16' : 'lg:pl-60';

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        siteName={siteName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Content area */}
      <div className={`${sidebarW} transition-all duration-300 min-h-screen flex flex-col`}>
        <TopBar siteName={siteName} onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
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
