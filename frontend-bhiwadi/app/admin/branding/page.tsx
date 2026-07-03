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

export default function BrandingPage() {
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

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData(); fd.append('image', file);
    const r = await fetch(`${API}/upload/single`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    const d = await r.json();
    return d.success ? d.url : null;
  };

  if (!settings) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm">{toast}</div>}
      <PageHeader title="Branding" subtitle="Logo, Favicon aur Social Share Image" />

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          Logo aur Favicon website ki pehchaan hain — browser tab, bookmarks, social share sab jagah dikhte hain.
        </div>

        {/* Logo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <SectionHeader title="Website Logo" icon="🏢" />
          <p className="text-xs text-slate-500">Recommended: PNG transparent background, min 200×60 px. Header mein dikhega.</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Logo Upload karo (PNG/SVG)</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
              <input type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setSettings({ ...settings, logoUrl: url });
                  else alert('Upload failed');
                }} />
              <span className="text-2xl">📁</span>
              <div>
                <p className="text-sm font-medium text-slate-700">Choose File</p>
                <p className="text-xs text-slate-500">PNG, SVG, JPEG, WEBP</p>
              </div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Ya URL paste karo</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="https://yourdomain.com/logo.png"
              value={settings.logoUrl || ''}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} />
          </div>
          {settings.logoUrl && (
            <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3">
              <img src={settings.logoUrl} alt="Logo preview" className="h-10 object-contain max-w-[200px]" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
              <p className="text-white/60 text-xs">Header preview (dark bg)</p>
            </div>
          )}
        </div>

        {/* Footer Logo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <SectionHeader title="Footer Logo (alag design)" icon="🦶" />
          <p className="text-xs text-slate-500">Footer dark background pe alag logo. Agar khali chhodoge to Header wala logo use hoga.</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Footer Logo Upload (PNG/SVG — white/light version recommended)</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
              <input type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setSettings({ ...settings, footerLogoUrl: url });
                  else alert('Upload failed');
                }} />
              <span className="text-2xl">📁</span>
              <div>
                <p className="text-sm font-medium text-slate-700">Choose Footer Logo</p>
                <p className="text-xs text-slate-500">White/light PNG for dark footer background</p>
              </div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Ya URL paste karo</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="https://yourdomain.com/footer-logo.png"
              value={settings.footerLogoUrl || ''}
              onChange={(e) => setSettings({ ...settings, footerLogoUrl: e.target.value })} />
          </div>
          {settings.footerLogoUrl && (
            <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3">
              <img src={settings.footerLogoUrl} alt="Footer Logo preview" className="h-10 object-contain max-w-[200px]" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
              <p className="text-white/60 text-xs">Footer preview (dark bg)</p>
            </div>
          )}
        </div>

        {/* Favicon */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <SectionHeader title="Favicon (Browser Tab Icon)" icon="⭐" />
          <p className="text-xs text-slate-500">Recommended: 32×32 px PNG/ICO. Browser tab, bookmarks aur mobile homescreen mein dikhta hai.</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Favicon Upload (PNG/ICO — 32×32 px)</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
              <input type="file" accept="image/png,image/x-icon,image/ico,image/jpeg" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setSettings({ ...settings, faviconUrl: url });
                  else alert('Upload failed');
                }} />
              <span className="text-2xl">📁</span>
              <div>
                <p className="text-sm font-medium text-slate-700">Choose Favicon File</p>
                <p className="text-xs text-slate-500">PNG ya ICO format, 32×32 px</p>
              </div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Ya Favicon URL</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="https://yourdomain.com/favicon.ico"
              value={settings.faviconUrl || ''}
              onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })} />
          </div>
          {settings.faviconUrl && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <img src={settings.faviconUrl} alt="Favicon preview" className="w-8 h-8 object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
              <p className="text-xs text-slate-500">Favicon preview (browser tab mein aisa dikhega)</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-800">Manual favicon upload (VPS se):</p>
            <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
              <li><a href="https://favicon.io/favicon-generator/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">favicon.io</a> pe jaao → Text ya Image se generate karo</li>
              <li>Download → <code className="bg-white border px-1 rounded">favicon.ico</code> aur <code className="bg-white border px-1 rounded">apple-touch-icon.png</code></li>
              <li>VPS upload: <code className="bg-white border px-1 rounded">/var/www/bhiwadi-realestate/frontend/public/</code></li>
              <li>PM2 restart karo</li>
            </ol>
          </div>
        </div>

        {/* OG Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <SectionHeader title="Social Share Image (OG Image)" icon="📸" />
          <p className="text-xs text-slate-500">Jab koi WhatsApp/Facebook/Twitter pe website link share kare toh yeh image dikhti hai. 1200×630 px recommended.</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">OG Image URL</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="https://yourdomain.com/og-image.jpg"
              value={settings.ogImage || ''}
              onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })} />
          </div>
          {settings.ogImage && settings.ogImage.startsWith('http') && (
            <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200">
              <img src={settings.ogImage} alt="OG preview" className="w-full h-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
            </div>
          )}
        </div>

        <div className="flex justify-end pb-6">
          <button onClick={save} disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors min-w-[160px]">
            {saving ? '⏳ Saving…' : '✓ Save Branding'}
          </button>
        </div>
      </div>
    </div>
  );
}
