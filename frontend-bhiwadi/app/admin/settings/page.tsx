'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API, SITE_KEY } from '../_context';
import { Card, PageHeader, Btn, Field, Input, ImageUploader, Toast } from '../_components/shared';

const TABS = [
  { key: 'general', label: '🏢 General' },
  { key: 'seo', label: '🔍 SEO' },
  { key: 'social', label: '📱 Social' },
  { key: 'analytics', label: '📊 Analytics' },
  { key: 'integrations', label: '🔗 Integrations' },
  { key: 'whatsapp', label: '💬 WhatsApp' },
  { key: 'email', label: '📧 Email / SMTP' },
];

export default function SettingsPage() {
  const { authH, token } = useAdmin();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testingWa, setTestingWa] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    const r = await fetch(`${API}/admin/settings?siteKey=${SITE_KEY}`, { headers: authH() });
    const d = await r.json();
    if (d.success) setSettings(d.settings);
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const r = await fetch(`${API}/admin/settings?siteKey=${SITE_KEY}`, {
        method: 'PUT', headers: authH(), body: JSON.stringify({ ...settings, siteKey: SITE_KEY }),
      });
      const d = await r.json();
      if (d.success) { setSettings(d.settings); setToast({ msg: 'Settings saved!', type: 'success' }); }
      else setToast({ msg: d.message || 'Save failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setSaving(false); }
  };

  const testSmtp = async () => {
    setTestingSmtp(true);
    const r = await fetch(`${API}/admin/settings/test-smtp`, {
      method: 'POST', headers: authH(), body: JSON.stringify(settings?.smtp || {}),
    });
    const d = await r.json();
    setToast({ msg: d.message || (d.success ? 'SMTP OK ✓' : 'SMTP Failed ✗'), type: d.success ? 'success' : 'error' });
    setTestingSmtp(false);
  };

  const testWhatsApp = async () => {
    setTestingWa(true);
    const r = await fetch(`${API}/admin/settings/test-whatsapp`, {
      method: 'POST', headers: authH(), body: JSON.stringify(settings?.whatsappCloud || {}),
    });
    const d = await r.json();
    setToast({ msg: d.message || (d.success ? 'WhatsApp OK ✓' : 'WhatsApp Failed ✗'), type: d.success ? 'success' : 'error' });
    setTestingWa(false);
  };

  const s = (path: string, val: any) => {
    if (!settings) return;
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(settings));
    let cur = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = val;
    setSettings(updated);
  };
  const g = (path: string, def: any = '') => {
    if (!settings) return def;
    const keys = path.split('.');
    let cur = settings;
    for (const k of keys) { if (cur == null) return def; cur = cur[k]; }
    return cur ?? def;
  };

  if (!settings) {
    return (
      <div className="p-4 sm:p-6">
        <PageHeader title="Settings" />
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 border border-slate-200" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      <PageHeader title="Settings" subtitle="Site configuration, SEO, integrations"
        action={
          <Btn onClick={save} disabled={saving}>
            {saving ? '⏳ Saving…' : '💾 Save All Settings'}
          </Btn>
        } />

      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === t.key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card className="p-4 sm:p-6">
        {/* GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Site Name">
                <Input value={g('siteName')} onChange={(v) => s('siteName', v)} placeholder="New Projects in Gurgaon" />
              </Field>
              <Field label="Tag Line">
                <Input value={g('tagline')} onChange={(v) => s('tagline', v)} placeholder="Find Your Dream Home..." />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone">
                <Input value={g('phone')} onChange={(v) => s('phone', v)} placeholder="+91 9999999999" />
              </Field>
              <Field label="Email">
                <Input value={g('email')} onChange={(v) => s('email', v)} placeholder="info@example.com" />
              </Field>
            </div>
            <Field label="Address">
              <Input value={g('address')} onChange={(v) => s('address', v)} placeholder="Sector 50, Gurgaon, Haryana 122018" rows={2} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Street Address">
                <Input value={g('streetAddress')} onChange={(v) => s('streetAddress', v)} placeholder="SCO 123, Sector 50" />
              </Field>
              <Field label="Postal Code">
                <Input value={g('postalCode')} onChange={(v) => s('postalCode', v)} placeholder="122018" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="RERA Number">
                <Input value={g('reraNumber')} onChange={(v) => s('reraNumber', v)} placeholder="HRERA/..." />
              </Field>
              <Field label="Google Business Profile URL">
                <Input value={g('googleBusinessProfile')} onChange={(v) => s('googleBusinessProfile', v)} placeholder="maps.google.com/..." />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude (for GEO)">
                <Input value={g('geoLat')} onChange={(v) => s('geoLat', v)} placeholder="28.4595" />
              </Field>
              <Field label="Longitude (for GEO)">
                <Input value={g('geoLng')} onChange={(v) => s('geoLng', v)} placeholder="77.0266" />
              </Field>
            </div>
            {token && (
              <div className="grid grid-cols-2 gap-6">
                <ImageUploader label="Logo" value={g('logoUrl')} onChange={(v) => s('logoUrl', v as string)} token={token} />
                <ImageUploader label="Favicon" value={g('faviconUrl')} onChange={(v) => s('faviconUrl', v as string)} token={token} />
              </div>
            )}
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">SEO & Meta</h3>
            <Field label="SEO Title" hint="Shown in Google search results. 50-60 characters.">
              <Input value={g('seoTitle')} onChange={(v) => s('seoTitle', v)} placeholder="New Projects in Gurgaon | Best Properties 2025" />
              <p className="text-[10px] text-slate-400 mt-1">{g('seoTitle').length}/60 chars</p>
            </Field>
            <Field label="Meta Description" hint="Google snippet. 155-160 characters.">
              <Input value={g('seoDescription')} onChange={(v) => s('seoDescription', v)} placeholder="Find new launch & ready-to-move projects in Gurgaon..." rows={3} />
              <p className="text-[10px] text-slate-400 mt-1">{g('seoDescription').length}/160 chars</p>
            </Field>
            <Field label="SEO Keywords (comma-separated)">
              <Input value={Array.isArray(g('seoKeywords', [])) ? g('seoKeywords', []).join(', ') : g('seoKeywords')}
                onChange={(v) => s('seoKeywords', v.split(',').map((k: string) => k.trim()).filter(Boolean))}
                placeholder="new projects gurgaon, 3 bhk dwarka expressway, luxury apartments..." rows={2} />
            </Field>
            {token && (
              <ImageUploader label="OG Image (Social Share Image)" value={g('ogImage')} onChange={(v) => s('ogImage', v as string)} token={token} />
            )}
            <Field label="Google Search Console Verification Code">
              <Input value={g('googleSearchConsole.verificationCode')} onChange={(v) => s('googleSearchConsole.verificationCode', v)} placeholder="google-site-verification=XXXXXX" />
            </Field>
          </div>
        )}

        {/* SOCIAL */}
        {activeTab === 'social' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">Social Media</h3>
            {[
              { key: 'social.facebook', label: 'Facebook', placeholder: 'facebook.com/...' },
              { key: 'social.instagram', label: 'Instagram', placeholder: 'instagram.com/...' },
              { key: 'social.youtube', label: 'YouTube', placeholder: 'youtube.com/@...' },
              { key: 'social.linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/...' },
              { key: 'social.twitter', label: 'Twitter / X', placeholder: 'twitter.com/...' },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <Input value={g(key)} onChange={(v) => s(key, v)} placeholder={placeholder} />
              </Field>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">Tracking & Analytics</h3>
            <Field label="Google Analytics 4 Measurement ID" hint="Format: G-XXXXXXXXXX">
              <Input value={g('ga4Id')} onChange={(v) => s('ga4Id', v)} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Google Tag Manager ID" hint="Format: GTM-XXXXXXX">
              <Input value={g('gtmId')} onChange={(v) => s('gtmId', v)} placeholder="GTM-XXXXXXX" />
            </Field>
            <Field label="Facebook Pixel ID">
              <Input value={g('fbPixelId')} onChange={(v) => s('fbPixelId', v)} placeholder="1234567890123456" />
            </Field>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">API Integrations</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              ⚠️ Keys are encrypted in DB. Save karne ke baad reload karo — asterisks show hoga agar set hai.
            </div>

            {/* Anthropic / Claude */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Anthropic API Key (Claude AI)</p>
                  <p className="text-xs text-slate-500">SEO Intelligence → AI Advisor ke liye required. console.anthropic.com se lo.</p>
                </div>
                {g('anthropicApiKey') && (
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">✓ Set</span>
                )}
              </div>
              <Input
                type="password"
                value={g('anthropicApiKey')}
                onChange={(v) => s('anthropicApiKey', v)}
                placeholder="sk-ant-api03-..."
              />
            </div>

            {/* IndexNow */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">IndexNow API Key (Bing / Yandex / DuckDuckGo)</p>
                  <p className="text-xs text-slate-500">Koi bhi random GUID dalo (e.g. uuidgenerator.net). Bing pe instant indexing ke liye.</p>
                </div>
                {g('indexNowKey') && (
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">✓ Set</span>
                )}
              </div>
              <Input
                value={g('indexNowKey')}
                onChange={(v) => s('indexNowKey', v)}
                placeholder="550e8400-e29b-41d4-a716-446655440000"
              />
            </div>

            <Field label="99acres API Key (optional)">
              <Input value={g('integrations.99acres')} onChange={(v) => s('integrations.99acres', v)} placeholder="api_key_..." />
            </Field>
            <Field label="MagicBricks API Key (optional)">
              <Input value={g('integrations.magicbricks')} onChange={(v) => s('integrations.magicbricks', v)} placeholder="mb_api_..." />
            </Field>
          </div>
        )}

        {/* WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">WhatsApp Cloud API</h3>
            {[
              { key: 'whatsappCloud.accessToken', label: 'Access Token', placeholder: 'EAAx...' },
              { key: 'whatsappCloud.phoneNumberId', label: 'Phone Number ID', placeholder: '123456789...' },
              { key: 'whatsappCloud.businessAccountId', label: 'Business Account ID', placeholder: '987654321...' },
              { key: 'whatsappCloud.templateName', label: 'Template Name', placeholder: 'new_lead_notification' },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <Input value={g(key)} onChange={(v) => s(key, v)} placeholder={placeholder} />
              </Field>
            ))}
            <Btn onClick={testWhatsApp} disabled={testingWa} variant="secondary">
              {testingWa ? '⏳ Testing…' : '🧪 Test WhatsApp'}
            </Btn>
          </div>
        )}

        {/* EMAIL SMTP */}
        {activeTab === 'email' && (
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100">SMTP Email</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="SMTP Host">
                <Input value={g('smtp.host')} onChange={(v) => s('smtp.host', v)} placeholder="smtp.gmail.com" />
              </Field>
              <Field label="SMTP Port">
                <Input value={g('smtp.port')} onChange={(v) => s('smtp.port', v)} placeholder="587" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="SMTP User">
                <Input value={g('smtp.user')} onChange={(v) => s('smtp.user', v)} placeholder="you@gmail.com" />
              </Field>
              <Field label="SMTP Password">
                <Input type="password" value={g('smtp.pass')} onChange={(v) => s('smtp.pass', v)} placeholder="App password" />
              </Field>
            </div>
            <Field label="From Name">
              <Input value={g('smtp.fromName')} onChange={(v) => s('smtp.fromName', v)} placeholder="New Projects Gurgaon" />
            </Field>
            <Field label="Notify Email (Lead notifications go here)">
              <Input value={g('notifyEmail')} onChange={(v) => s('notifyEmail', v)} placeholder="leads@example.com" />
            </Field>
            <Btn onClick={testSmtp} disabled={testingSmtp} variant="secondary">
              {testingSmtp ? '⏳ Testing…' : '🧪 Test SMTP Connection'}
            </Btn>
          </div>
        )}
      </Card>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 -mx-6 px-6 py-3 flex justify-end mt-6">
        <Btn onClick={save} disabled={saving}>
          {saving ? '⏳ Saving…' : '💾 Save All Settings'}
        </Btn>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
