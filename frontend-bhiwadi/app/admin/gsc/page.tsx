'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API } from '../_context';
import { PageHeader } from '../_components/shared';

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
  );
}

export default function GscPage() {
  const { authH, token } = useAdmin();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const r = await fetch(`${API}/admin/settings`, { headers: authH() });
    const d = await r.json();
    if (d.success) setSettings(d.settings);
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const r = await fetch(`${API}/admin/settings`, { method: 'PUT', headers: authH(), body: JSON.stringify(settings) });
      const d = await r.json();
      if (d.success) { setSettings(d.settings); setToast('Saved!'); setTimeout(() => setToast(null), 3000); }
    } finally { setSaving(false); }
  };

  if (!settings) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;

  const gsc = settings.googleSearchConsole || {};
  const setGsc = (patch: any) => setSettings({ ...settings, googleSearchConsole: { ...gsc, ...patch } });
  const phase1Done = !!gsc.verificationCode;
  const phase2Done = !!(gsc.siteUrl && gsc.serviceAccountJson);

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm">{toast}</div>}
      <PageHeader title="Google Search Console" subtitle="Domain verify karo aur GSC API connect karo" />

      <div className="space-y-5">
        {/* Overview banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">Google Search Console — 2 step process:</p>
          <div className="flex gap-6 text-xs">
            <span className={phase1Done ? 'text-green-700 font-semibold' : ''}>
              {phase1Done ? '✅' : '⏳'} Phase 1: Domain verify karo
            </span>
            <span className={phase2Done ? 'text-green-700 font-semibold' : 'text-gray-400'}>
              {phase2Done ? '✅' : '🔒'} Phase 2: API connect karo (phase 1 ke baad)
            </span>
          </div>
        </div>

        {/* Phase 1 */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            <div>
              <h3 className="font-semibold text-slate-800">Domain Verify Karo</h3>
              <p className="text-xs text-slate-500">GSC verification code website ke head mein auto-add hoga</p>
            </div>
            {phase1Done && <span className="ml-auto text-green-600 text-sm font-semibold">✅ Code saved</span>}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-slate-500">
            <p>a. <a href="https://search.google.com/search-console/welcome" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">search.google.com/search-console</a> pe jaao</p>
            <p>b. <strong className="text-slate-800">Add Property</strong> → URL prefix → <code className="bg-white border px-1.5 py-0.5 rounded text-xs">https://propertyinbhiwadi.com</code></p>
            <p>c. Verification method: <strong className="text-slate-800">HTML Tag</strong> choose karo</p>
            <p>d. Meta tag milega aise: <code className="bg-white border px-1.5 py-0.5 rounded text-xs">&lt;meta name="google-site-verification" content="<strong>XXXX</strong>"&gt;</code></p>
            <p>e. Sirf <strong className="text-slate-800">content= wali value</strong> copy karo aur neeche paste karo</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Verification Code (content= value only)
            </label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="QhE_Qi0mWkHs8hZaQuqSd7quscJ4mPPnWPf-4NNW0kc"
              value={gsc.verificationCode || ''}
              onChange={(e) => setGsc({ verificationCode: e.target.value.trim() })} />
            {gsc.verificationCode && (
              <p className="text-xs text-slate-500 mt-1">
                Website head mein yeh add hoga: <code className="bg-gray-100 px-1">&lt;meta name="google-site-verification" content="{gsc.verificationCode}"&gt;</code>
              </p>
            )}
          </div>

          <button onClick={save} disabled={saving || !gsc.verificationCode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors text-sm">
            {saving ? '⏳ Saving...' : '✓ Save & Add to Website Head'}
          </button>

          {phase1Done && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 space-y-2">
              <p className="font-semibold">✅ Code website mein add ho gaya!</p>
              <p className="text-xs">Ab GSC dashboard mein jaao → <strong>Verify</strong> button click karo. Verification hone ke baad Phase 2 complete karo.</p>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
                GSC Dashboard Mein Verify Karo →
              </a>
            </div>
          )}
        </div>

        {/* Phase 2 */}
        <div className={`bg-white rounded-2xl border-2 p-6 space-y-4 ${phase1Done ? 'border-slate-200' : 'border-gray-100 opacity-60'}`}>
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${phase1Done ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-400'}`}>2</span>
            <div>
              <h3 className="font-semibold text-slate-800">API Access — Data Admin Mein Dekho</h3>
              <p className="text-xs text-slate-500">{phase1Done ? 'Domain verify hone ke baad yeh step karo' : '⚠️ Phase 1 complete karo pehle'}</p>
            </div>
            {phase2Done && <span className="ml-auto text-green-600 text-sm font-semibold">✅ Connected</span>}
          </div>

          {phase1Done && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-slate-500">
                <p>a. <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">console.cloud.google.com</a> → New Project banao</p>
                <p>b. <strong className="text-slate-800">APIs & Services → Enable APIs → Search Console API</strong> enable karo</p>
                <p>c. <strong className="text-slate-800">Credentials → Service Account</strong> banao → email note karo (xxx@project.iam.gserviceaccount.com)</p>
                <p>d. GSC → Settings → Users & Permissions → <strong className="text-slate-800">Add User</strong> → service account email → <strong>Read</strong> permission</p>
                <p>e. Cloud Console → Service Account → <strong className="text-slate-800">Keys → Add Key → JSON</strong> download karo</p>
                <p>f. JSON neeche paste karo:</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">GSC Property URL</label>
                  <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://propertyinbhiwadi.com"
                    value={gsc.siteUrl || ''}
                    onChange={(e) => setGsc({ siteUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Service Account JSON</label>
                  <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder='{"type":"service_account","project_id":"my-project","private_key_id":"abc","private_key":"-----BEGIN RSA PRIVATE KEY-----\n...","client_email":"gsc@my-project.iam.gserviceaccount.com",...}'
                    value={gsc.serviceAccountJson || ''}
                    onChange={(e) => setGsc({ serviceAccountJson: e.target.value })} />
                  <p className="text-xs text-orange-600 mt-1">⚠️ Sensitive credentials — securely encrypted hoga. Kisi se share mat karo.</p>
                </div>
                <button onClick={save} disabled={saving || !gsc.siteUrl || !gsc.serviceAccountJson}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors text-sm">
                  {saving ? '⏳ Saving...' : '✓ Save & Connect GSC API'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Phase 3 — Sitemap */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <SectionHeader title="Sitemap Submit Karo (once verified)" icon="🗺️" />
          <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-slate-500">
            propertyinbhiwadi.com/sitemap.xml
          </div>
          <p className="text-xs text-slate-500">GSC Dashboard → Sitemaps → Submit. Google 2-3 din mein index karna start karta hai.</p>
          <div className="flex gap-3">
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Open GSC →</a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
              className="border border-slate-300 hover:border-slate-500 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">View Sitemap</a>
          </div>
        </div>

        {phase2Done && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            🎉 GSC fully connected! Analytics tab mein jaao → Search Console data dekhenge.
          </div>
        )}
      </div>
    </div>
  );
}
