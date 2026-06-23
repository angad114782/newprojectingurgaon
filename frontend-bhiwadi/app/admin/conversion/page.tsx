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

export default function ConversionPage() {
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

  const conv = settings.conversion || {};
  const setConv = (key: string, val: any) => setSettings({ ...settings, conversion: { ...conv, [key]: { ...conv[key], ...val } } });

  const Toggle = ({ label, desc, ck, fk }: { label: string; desc: string; ck: string; fk?: string }) => (
    <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <div className="relative ml-3 flex-shrink-0">
        <input type="checkbox" className="sr-only" checked={!!(conv[ck]?.[fk || 'enabled'] ?? true)}
          onChange={(e) => setConv(ck, { [fk || 'enabled']: e.target.checked })} />
        <div className={`w-10 h-5 rounded-full transition-colors ${conv[ck]?.[fk || 'enabled'] !== false ? 'bg-emerald-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${conv[ck]?.[fk || 'enabled'] !== false ? 'translate-x-5' : ''}`} />
        </div>
      </div>
    </label>
  );

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm">{toast}</div>}
      <PageHeader title="Conversion Tools" subtitle="Psychological triggers — save hone ke baad live ho jaate hain" />

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 mb-6">
        <strong>Conversion Tools</strong> — Yahan se sabhi psychological triggers control karo. Changes save hote hi live ho jaate hain.
      </div>

      <div className="space-y-5">
        {/* Urgency Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Urgency Banner (top of page)" icon="🔥" />
          <div className="space-y-3">
            <Toggle ck="urgencyBanner" label="Enable Urgency Banner" desc="Page ke top pe red banner dikhta hai" />
            <div>
              <label className="text-xs text-slate-500 block mb-1">Message</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={conv.urgencyBanner?.message || ''}
                onChange={(e) => setConv('urgencyBanner', { message: e.target.value })}
                placeholder="Price hike alert: Dwarka Expressway..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Link Text</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.urgencyBanner?.linkText || ''}
                  onChange={(e) => setConv('urgencyBanner', { linkText: e.target.value })} placeholder="Lock today's price →" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Link URL</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.urgencyBanner?.linkHref || ''}
                  onChange={(e) => setConv('urgencyBanner', { linkHref: e.target.value })} placeholder="#lead-form" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Toast */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Live Activity Toast (bottom-left popup)" icon="👥" />
          <div className="space-y-3">
            <Toggle ck="liveActivity" label="Enable Live Activity Toast" desc="'Rahul S. from Delhi just requested price list' popup" />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">First Delay (ms)</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.liveActivity?.firstDelay ?? 8000}
                  onChange={(e) => setConv('liveActivity', { firstDelay: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Interval (ms)</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.liveActivity?.interval ?? 22000}
                  onChange={(e) => setConv('liveActivity', { interval: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Show Duration (ms)</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.liveActivity?.duration ?? 4500}
                  onChange={(e) => setConv('liveActivity', { duration: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Cities (comma separated)</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={(conv.liveActivity?.cities || []).join(', ')}
                onChange={(e) => setConv('liveActivity', { cities: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                placeholder="Delhi, Noida, Mumbai, Bangalore..." />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Names (comma separated)</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={(conv.liveActivity?.names || []).join(', ')}
                onChange={(e) => setConv('liveActivity', { names: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                placeholder="Rahul S., Priya K., Amit V...." />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Actions (comma separated)</label>
              <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                value={(conv.liveActivity?.actions || []).join(', ')}
                onChange={(e) => setConv('liveActivity', { actions: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                placeholder="just requested the price list, booked a free site visit..." />
            </div>
          </div>
        </div>

        {/* Viewing Count */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Live Viewing Count (project pages)" icon="👁️" />
          <div className="space-y-3">
            <Toggle ck="viewingCount" label="Enable Viewing Count" desc="'43 people viewing this right now' badge" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Min Count</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.viewingCount?.minCount ?? 18}
                  onChange={(e) => setConv('viewingCount', { minCount: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Max Count</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={conv.viewingCount?.maxCount ?? 55}
                  onChange={(e) => setConv('viewingCount', { maxCount: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        </div>

        {/* Scarcity Badge */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Scarcity Badge" icon="🔴" />
          <div className="space-y-3">
            <Toggle ck="scarcityBadge" label="Enable Scarcity Badge" desc="'Only 4 units left at this price' badge" />
            <div>
              <label className="text-xs text-slate-500 block mb-1">Default Units Left</label>
              <input type="number" className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={conv.scarcityBadge?.units ?? 4}
                onChange={(e) => setConv('scarcityBadge', { units: Number(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Price Countdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Price Countdown Timer" icon="⏱️" />
          <Toggle ck="priceCountdown" label="Enable Price Countdown" desc="'Current pricing valid for HH:MM:SS' timer — expires end of day" />
        </div>

        {/* Exit Popup */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Exit Intent Popup" icon="🎁" />
          <div className="space-y-3">
            <Toggle ck="exitPopup" label="Enable Exit Intent Popup" desc="User mouse top pe jaaye ya 88% scroll kare toh popup aata hai" />
            <div>
              <label className="text-xs text-slate-500 block mb-1">Popup Title</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={conv.exitPopup?.title || ''}
                onChange={(e) => setConv('exitPopup', { title: e.target.value })} placeholder="Wait! Don't Miss This" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Offer Text</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={conv.exitPopup?.offerText || ''}
                onChange={(e) => setConv('exitPopup', { offerText: e.target.value })} placeholder="Get ₹2 Lakh off on pre-launch..." />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">CTA Button Text</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={conv.exitPopup?.ctaText || ''}
                onChange={(e) => setConv('exitPopup', { ctaText: e.target.value })} placeholder="Get ₹2 Lakh Off — Send on WhatsApp 💬" />
            </div>
          </div>
        </div>

        {/* Scroll Modal */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Scroll Trigger Modal" icon="📜" />
          <div className="space-y-3">
            <Toggle ck="scrollModal" label="Enable Scroll Modal" desc="User X% scroll kare toh bottom sheet popup aata hai" />
            <div>
              <label className="text-xs text-slate-500 block mb-1">Trigger at Scroll % (default: 60)</label>
              <input type="number" className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                min={10} max={95} value={conv.scrollModal?.triggerPercent ?? 60}
                onChange={(e) => setConv('scrollModal', { triggerPercent: Number(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Trust Signals Strip (marquee bar)" icon="✅" />
          <div className="space-y-3">
            <Toggle ck="trustStrip" label="Enable Trust Strip" desc="Header ke neeche scrolling trust signals bar" />
            <div>
              <label className="text-xs text-slate-500 block mb-2">Signals</label>
              <div className="space-y-2">
                {(conv.trustStrip?.signals || []).map((s: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      value={s.icon || ''} placeholder="🏆"
                      onChange={(e) => { const arr = [...(conv.trustStrip?.signals || [])]; arr[i] = { ...arr[i], icon: e.target.value }; setConv('trustStrip', { signals: arr }); }} />
                    <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      value={s.text || ''} placeholder="4,200+ Families Helped"
                      onChange={(e) => { const arr = [...(conv.trustStrip?.signals || [])]; arr[i] = { ...arr[i], text: e.target.value }; setConv('trustStrip', { signals: arr }); }} />
                    <button onClick={() => { const arr = (conv.trustStrip?.signals || []).filter((_: any, idx: number) => idx !== i); setConv('trustStrip', { signals: arr }); }}
                      className="text-red-400 hover:text-red-600 font-bold text-lg px-1">×</button>
                  </div>
                ))}
                <button onClick={() => { const arr = [...(conv.trustStrip?.signals || []), { icon: '⭐', text: 'New Signal' }]; setConv('trustStrip', { signals: arr }); }}
                  className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-all">+ Add Signal</button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <SectionHeader title="Other Features" icon="🔧" />
          <div className="space-y-2">
            <Toggle ck="roiCalculator" label="ROI Calculator" desc="Investment return calculator on project pages" />
            <Toggle ck="priceGate" label="Price Gate" desc="Price blur karke mobile number maango phir dikhaao" />
          </div>
        </div>

        <div className="flex justify-end pb-6">
          <button onClick={save} disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors min-w-[160px]">
            {saving ? '⏳ Saving…' : '✓ Save Conversion Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
