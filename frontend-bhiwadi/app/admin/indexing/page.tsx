'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API } from '../_context';
import { Card, PageHeader, Btn, Badge, Toast } from '../_components/shared';

type LogEntry = {
  _id: string;
  url: string;
  engine: 'google' | 'indexnow' | 'bing';
  action: string;
  status: 'success' | 'error' | 'pending';
  statusCode?: number;
  message: string;
  triggeredBy: 'auto' | 'manual' | 'bulk';
  createdAt: string;
};

type Stats = {
  total: number;
  success: number;
  errors: number;
  today: number;
  byEngine: { _id: string; count: number; success: number }[];
};

const ENGINE_LABELS: Record<string, string> = {
  google: '🔵 Google',
  indexnow: '⚡ IndexNow',
  bing: '🟠 Bing',
};

const STATUS_COLOR: Record<string, string> = {
  success: 'green',
  error: 'red',
  pending: 'yellow',
};

export default function IndexingPage() {
  const { authH, token } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [engineFilter, setEngineFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'submit' | 'history'>('dashboard');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Manual submit state
  const [urlInput, setUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') =>
    setToast({ msg, type });

  const loadStats = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);
    try {
      const r = await fetch(`${API}/indexing/stats`, { headers: authH() });
      const d = await r.json();
      if (d.success) setStats(d.stats);
    } finally { setLoadingStats(false); }
  }, [token, authH]);

  const loadLogs = useCallback(async () => {
    if (!token) return;
    setLoadingLogs(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (engineFilter) params.set('engine', engineFilter);
      if (statusFilter) params.set('status', statusFilter);
      const r = await fetch(`${API}/indexing/history?${params}`, { headers: authH() });
      const d = await r.json();
      if (d.success) { setLogs(d.data); setTotal(d.total); }
    } finally { setLoadingLogs(false); }
  }, [token, authH, page, engineFilter, statusFilter]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (tab === 'history') loadLogs(); }, [tab, loadLogs]);

  const submitUrls = async () => {
    const urls = urlInput.split('\n').map(u => u.trim()).filter(Boolean);
    if (!urls.length) return showToast('Enter at least one URL', 'error');
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/indexing/submit`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const d = await r.json();
      if (d.success) {
        setUrlInput('');
        showToast(`Submitted ${urls.length} URL(s) to search engines`);
        loadStats();
      } else showToast(d.message || 'Submission failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setSubmitting(false); }
  };

  const bulkSubmit = async () => {
    setBulkSubmitting(true);
    try {
      const r = await fetch(`${API}/indexing/bulk-sitemap`, {
        method: 'POST',
        headers: authH(),
      });
      const d = await r.json();
      if (d.success) {
        showToast(`${d.message} (${d.total} URLs)`);
        setTimeout(loadStats, 3000);
      } else showToast(d.message || 'Bulk submit failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setBulkSubmitting(false); }
  };

  const writeKeyFile = async () => {
    try {
      const r = await fetch(`${API}/indexing/write-key`, { method: 'POST', headers: authH() });
      const d = await r.json();
      showToast(d.message, d.success ? 'success' : 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const testGoogle = async () => {
    setTesting(true);
    try {
      const r = await fetch(`${API}/indexing/test-google`, { method: 'POST', headers: authH() });
      const d = await r.json();
      showToast(d.message, d.success ? 'success' : 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setTesting(false); }
  };

  const clearHistory = async () => {
    if (!confirm('Clear all indexing history?')) return;
    try {
      await fetch(`${API}/indexing/history`, { method: 'DELETE', headers: authH() });
      setLogs([]);
      setTotal(0);
      showToast('History cleared');
    } catch { showToast('Error', 'error'); }
  };

  const successRate = stats && stats.total > 0
    ? Math.round((stats.success / stats.total) * 100)
    : 0;

  const TABS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'submit', label: 'Submit URLs' },
    { key: 'history', label: 'History' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      <PageHeader
        title="Instant Indexing"
        subtitle="WordPress-style instant URL submission to Google & Bing when content is published"
        action={
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={writeKeyFile}>Write Key File</Btn>
            <Btn size="sm" onClick={bulkSubmit} disabled={bulkSubmitting}>
              {bulkSubmitting ? 'Submitting…' : '⚡ Bulk Submit All'}
            </Btn>
          </div>
        }
      />

      {/* Setup guide */}
      <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 space-y-2">
        <p className="font-bold">⚠️ Common Errors aur Fix:</p>
        <div className="space-y-1.5 text-xs leading-relaxed">
          <p><strong className="text-red-600">❌ "Service account missing private_key"</strong> — incomplete JSON paste hua. Google Cloud Console → IAM → Service Accounts → Keys → Add Key → JSON download karo. Poora file content paste karo.</p>
          <p><strong className="text-red-600">❌ "sc-domain:..." URLs wrong</strong> — Settings → SEO → GSC Site URL mein <code className="bg-amber-100 px-1 rounded font-mono">https://propertyinbhiwadi.com</code> hona chahiye, <strong>sc-domain: nahi</strong>.</p>
          <p><strong className="text-amber-700">ℹ️ Google Indexing API setup:</strong> Service account banao → Google Search Console property mein Owner add karo → Indexing API enable karo (Google Cloud Console → APIs).</p>
        </div>
        <div className="flex gap-2 pt-1">
          <Btn size="sm" onClick={testGoogle} disabled={testing} variant="secondary">
            {testing ? 'Testing…' : '🔍 Test Google Connection'}
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Dashboard ── */}
      {tab === 'dashboard' && (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Submitted', value: stats?.total ?? '—', color: 'text-slate-900' },
              { label: 'Successful', value: stats?.success ?? '—', color: 'text-emerald-600' },
              { label: 'Errors', value: stats?.errors ?? '—', color: 'text-red-500' },
              { label: 'Today', value: stats?.today ?? '—', color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <Card key={label} className="p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{loadingStats ? '…' : value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </Card>
            ))}
          </div>

          {/* Success rate + by engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">Success Rate</p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={successRate >= 80 ? '#10b981' : successRate >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3"
                      strokeDasharray={`${successRate} ${100 - successRate}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
                    {stats ? `${successRate}%` : '—'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>{stats?.success ?? 0} successful</p>
                  <p>{stats?.errors ?? 0} errors</p>
                  <p>{stats?.total ?? 0} total</p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">By Search Engine</p>
              {!stats || stats.byEngine.length === 0 ? (
                <p className="text-sm text-slate-400">No submissions yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.byEngine.map(e => (
                    <div key={e._id} className="flex items-center justify-between text-sm">
                      <span>{ENGINE_LABELS[e._id] || e._id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-medium">{e.success} ✓</span>
                        <span className="text-slate-400">/ {e.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* How it works */}
          <Card className="p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">Auto-Submit kab hota hai?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
              {[
                { icon: '🏗️', title: 'Project Create/Update', desc: 'Jab bhi admin koi naya project add kare ya update kare, URL auto-submit ho jaata hai' },
                { icon: '✍️', title: 'Blog Publish', desc: 'Naya blog publish hone par ya existing blog update hone par auto-submit' },
                { icon: '⚡', title: 'Manual / Bulk', desc: 'Koi bhi URL manually submit karo ya saari site ek baar mein bulk submit karo' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-slate-50 rounded-xl p-3">
                  <p className="font-medium mb-1">{icon} {title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Submit URLs ── */}
      {tab === 'submit' && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">Manual URL Submission</p>
            <p className="text-xs text-slate-500 mb-3">Ek ya multiple URLs enter karo (ek per line). Google Indexing API + IndexNow dono ko submit hoga.</p>
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              rows={6}
              placeholder={`https://propertyinbhiwadi.com/projects/ashiana-anmol-bhiwadi\nhttps://propertyinbhiwadi.com/blog/best-areas-to-invest-in-bhiwadi`}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-400">
                {urlInput.split('\n').filter(u => u.trim()).length} URL(s) entered
              </p>
              <Btn onClick={submitUrls} disabled={submitting}>
                {submitting ? 'Submitting…' : '⚡ Submit to Google & Bing'}
              </Btn>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Bulk Submit — Entire Site</p>
                <p className="text-xs text-slate-500 mt-1">Saari projects, blogs, and static pages ek saath submit karo. Background mein chalta hai.</p>
              </div>
              <Btn onClick={bulkSubmit} disabled={bulkSubmitting} variant="secondary">
                {bulkSubmitting ? 'Starting…' : '🚀 Submit All Pages'}
              </Btn>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Write IndexNow Key File</p>
                <p className="text-xs text-slate-500 mt-1">
                  Settings mein save ki gayi IndexNow key ko <code className="bg-slate-100 px-1 rounded">/{'{key}'}.txt</code> pe write karta hai.
                  Bing verify karne ke liye yeh file publicly accessible honi chahiye.
                </p>
              </div>
              <Btn onClick={writeKeyFile} variant="secondary">Write Key File</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── History ── */}
      {tab === 'history' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={engineFilter}
              onChange={(e) => { setEngineFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Engines</option>
              <option value="google">Google</option>
              <option value="indexnow">IndexNow</option>
              <option value="bing">Bing</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="pending">Pending</option>
            </select>
            <span className="text-xs text-slate-400 ml-auto">{total} entries</span>
            <Btn size="sm" variant="danger" onClick={clearHistory}>Clear History</Btn>
          </div>

          {/* Log table */}
          {loadingLogs ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <Card>
              <p className="text-center text-slate-400 py-16">No submissions yet. Auto-submit will log entries here when projects/blogs are published.</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">URL</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">Engine</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">By</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 max-w-[200px]">
                        <p className="truncate text-slate-700 font-mono text-xs" title={log.url}>{log.url}</p>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-xs">{ENGINE_LABELS[log.engine] || log.engine}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge color={STATUS_COLOR[log.status] as any}>{log.status}</Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs text-slate-500 capitalize">{log.triggeredBy}</span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-slate-400">
                          {new Date(log.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs text-slate-500 truncate max-w-[150px] block" title={log.message}>{log.message || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 50 && (
            <div className="flex justify-center gap-2 pt-2">
              <Btn size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</Btn>
              <span className="text-sm text-slate-500 self-center">Page {page} of {Math.ceil(total / 50)}</span>
              <Btn size="sm" variant="secondary" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)}>Next →</Btn>
            </div>
          )}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
