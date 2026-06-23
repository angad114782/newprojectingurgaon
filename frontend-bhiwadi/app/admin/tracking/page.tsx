'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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

export default function TrackingPage() {
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

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm">{toast}</div>}
      <PageHeader title="Ads & Pixel Tracking" subtitle="Meta Pixel, Google Ads aur GTM — save hote hi live" />

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <strong>Ads & Pixel Tracking</strong> — Yahan se Meta Pixel, Google Ads aur GTM set karo. Save hote hi live ho jaata hai. Har successful lead pe automatically conversion fire hoti hai.
        </div>

        {/* GTM */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader title="Google Tag Manager (GTM) — Recommended" icon="🏷️" />
          <p className="text-xs text-slate-500 mb-4">GTM ek container hai jisme Meta Pixel, Google Ads, aur sab kuch manage ho jaata hai bina code change kiye. Agar GTM use kar rahe ho to neecha wale fields ki zaroorat nahi.</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">GTM Container ID</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="GTM-XXXXXXX"
              value={settings.gtmId || ''}
              onChange={(e) => setSettings({ ...settings, gtmId: e.target.value.trim() })} />
            <div className="mt-3 bg-gray-50 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-800">GTM kaise setup karo:</p>
              <p>1. <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">tagmanager.google.com</a> → New Account → Container create karo</p>
              <p>2. Container ID copy karo (GTM-XXXXXXX format)</p>
              <p>3. Yahan paste karo → Save</p>
              <p>4. GTM dashboard mein Meta Pixel + Google Ads tags add karo</p>
            </div>
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader title="Meta Pixel (Facebook / Instagram Ads)" icon="📘" />
          <p className="text-xs text-slate-500 mb-4">Meta Pixel se Facebook aur Instagram ads ka conversion track hota hai — kaun sa ad lead bana. PageView automatic fire hoti hai, Lead event form submit pe.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Meta Pixel ID</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="1234567890123456"
                value={settings.metaPixelId || ''}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value.trim() })} />
              <div className="mt-3 bg-gray-50 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
                <p className="font-semibold text-slate-800">Pixel ID kahan se milega:</p>
                <p>1. <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Facebook Events Manager</a> jaao</p>
                <p>2. Connect Data Sources → Web → Facebook Pixel → Create</p>
                <p>3. Pixel ID (15-16 digit number) copy karo → yahan paste karo</p>
                <p>4. Install method mein "Partner Integration" ya "Manual" select karo — code ki zaroorat nahi, hum inject karte hain</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-slate-800 mb-1">Events jo automatically fire honge:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {['PageView (har page)', 'Lead (form submit)', 'CompleteRegistration (OTP verify)'].map((ev) => (
                  <span key={ev} className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full text-slate-500">✅ {ev}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Google Ads */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader title="Google Ads Conversion Tracking" icon="🎯" />
          <p className="text-xs text-slate-500 mb-4">Google Ads ke saath website conversions track karo — kaun sa keyword/ad lead laya. Conversion event lead form submit pe fire hoti hai.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Google Ads Conversion ID</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="AW-XXXXXXXXXX"
                  value={settings.googleAdsId || ''}
                  onChange={(e) => setSettings({ ...settings, googleAdsId: e.target.value.trim() })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Conversion Label</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="AbC1dEfGhIj2KlMnO"
                  value={settings.googleAdsConversionLabel || ''}
                  onChange={(e) => setSettings({ ...settings, googleAdsConversionLabel: e.target.value.trim() })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Conversion Value (INR, optional)</label>
              <input type="number" className="w-40 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="0"
                value={settings.googleAdsConversionValue ?? ''}
                onChange={(e) => setSettings({ ...settings, googleAdsConversionValue: Number(e.target.value) || 0 })} />
              <p className="text-xs text-slate-500 mt-1">Har lead ki estimated value (e.g. 500 for ₹500). Conversion optimize karne mein help karta hai.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-800">Conversion ID + Label kahan se milega:</p>
              <p>1. <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Ads</a> → Tools & Settings → Measurement → Conversions</p>
              <p>2. New conversion action → Website → Category: Lead/Submit lead form</p>
              <p>3. "Use Google Tag" select karo</p>
              <p>4. Conversion ID (AW-XXXXXXXXXX) aur Conversion label copy karo</p>
              <p>5. Yahan paste karo → Save — code ki zaroorat nahi</p>
            </div>
          </div>
        </div>

        {/* GA4 reminder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader title="Google Analytics 4 (GA4)" icon="📊" />
          <p className="text-xs text-slate-500 mb-3">GA4 ID Settings tab mein set hota hai.</p>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">GA4 ID: {settings.ga4Id || <span className="text-slate-500 font-normal">Set nahi hua</span>}</p>
              <Link href="/admin/settings" className="text-xs text-emerald-600 underline mt-0.5">Site Settings mein jaao →</Link>
            </div>
          </div>
        </div>

        {/* Test / Verify */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader title="Test Karo (Verify)" icon="🔍" />
          <div className="space-y-3 text-xs text-slate-500">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-semibold text-slate-800">Meta Pixel verify karo:</p>
              <p>1. Save karo → website open karo</p>
              <p>2. Chrome Extension: <a href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Meta Pixel Helper</a> install karo</p>
              <p>3. Extension icon click karo — Pixel ID aur PageView event dikhega</p>
              <p>4. Events Manager mein Test Events tab mein real-time events dekho</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-semibold text-slate-800">Google Ads conversion verify karo:</p>
              <p>1. Save karo → website pe form submit karo</p>
              <p>2. Google Ads → Conversions → "Unverified" se "Active" ho jaayega</p>
              <p>3. Ya Google Tag Assistant Chrome extension use karo</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-semibold text-slate-800">GTM verify karo:</p>
              <p>1. GTM dashboard → Preview mode enable karo</p>
              <p>2. Apni website open karo — GTM debug panel dikhega</p>
              <p>3. Tags firing aur dataLayer events dekho</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-6">
          <button onClick={save} disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors min-w-[160px]">
            {saving ? '⏳ Saving…' : '✓ Save Tracking Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
