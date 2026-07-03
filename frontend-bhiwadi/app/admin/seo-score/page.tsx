'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API } from '../_context';
import { PageHeader, Btn, Toast } from '../_components/shared';

type ScoreItem = { label: string; score: number; max: number; status: 'pass' | 'warn' | 'fail'; hint: string };
type Section = { title: string; icon: string; items: ScoreItem[] };

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-10 text-right">{score}/{max}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <span className="text-emerald-500">✅</span>;
  if (status === 'warn') return <span className="text-amber-500">⚠️</span>;
  return <span className="text-red-500">❌</span>;
}

export default function SeoScorePage() {
  const { authH, token } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalMax, setTotalMax] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const [sr, pr] = await Promise.all([
      fetch(`${API}/admin/settings`, { headers: authH() }).then(r => r.json()),
      fetch(`${API}/projects?limit=5&city=bhiwadi`, { headers: authH() }).then(r => r.json()),
    ]);
    if (sr.success) setSettings(sr.settings);
    if (pr.success) setProjects(pr.data || []);
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const runAudit = useCallback(() => {
    if (!settings) return;
    setLoading(true);
    setTimeout(() => {
      const s = settings;
      const secs: Section[] = [
        {
          title: 'Basic SEO Setup', icon: '🔍',
          items: [
            { label: 'Site Name set', score: s.siteName ? 5 : 0, max: 5, status: s.siteName ? 'pass' : 'fail', hint: 'Settings → General → Site Name' },
            { label: 'SEO Title set', score: s.seoTitle ? 10 : 0, max: 10, status: s.seoTitle ? (s.seoTitle.length <= 60 ? 'pass' : 'warn') : 'fail', hint: `Title: ${s.seoTitle?.length || 0}/60 chars` },
            { label: 'Meta Description set', score: s.seoDescription ? 10 : 0, max: 10, status: s.seoDescription ? (s.seoDescription.length <= 160 ? 'pass' : 'warn') : 'fail', hint: `Desc: ${s.seoDescription?.length || 0}/160 chars` },
            { label: 'SEO Keywords set', score: s.seoKeywords?.length ? 5 : 0, max: 5, status: s.seoKeywords?.length ? 'pass' : 'warn', hint: 'Settings → SEO → Keywords' },
            { label: 'OG Image set', score: s.ogImage ? 5 : 0, max: 5, status: s.ogImage ? 'pass' : 'warn', hint: 'Settings → SEO → OG Image' },
            { label: 'GSC Verified', score: s.googleSearchConsole?.verificationCode ? 10 : 0, max: 10, status: s.googleSearchConsole?.verificationCode ? (s.googleSearchConsole?.siteUrl ? 'pass' : 'warn') : 'fail', hint: 'Admin → Search Console' },
          ],
        },
        {
          title: 'Contact & Local SEO', icon: '📍',
          items: [
            { label: 'Phone number set', score: s.phone ? 5 : 0, max: 5, status: s.phone ? 'pass' : 'fail', hint: 'Settings → General → Phone' },
            { label: 'Email set', score: s.email ? 5 : 0, max: 5, status: s.email ? 'pass' : 'fail', hint: 'Settings → General → Email' },
            { label: 'Address set', score: s.address ? 5 : 0, max: 5, status: s.address ? 'pass' : 'fail', hint: 'Settings → General → Address' },
            { label: 'Geo coordinates set', score: (s.geoLat && s.geoLng) ? 5 : 0, max: 5, status: (s.geoLat && s.geoLng) ? 'pass' : 'warn', hint: 'Settings → General → Lat/Lng' },
          ],
        },
        {
          title: 'Branding & Social', icon: '🏢',
          items: [
            { label: 'Logo uploaded', score: s.logoUrl ? 5 : 0, max: 5, status: s.logoUrl ? 'pass' : 'warn', hint: 'Settings → General → Logo' },
            { label: 'Facebook link set', score: s.social?.facebook ? 3 : 0, max: 3, status: s.social?.facebook ? 'pass' : 'warn', hint: 'Settings → Social → Facebook' },
            { label: 'Instagram link set', score: s.social?.instagram ? 3 : 0, max: 3, status: s.social?.instagram ? 'pass' : 'warn', hint: 'Settings → Social → Instagram' },
            { label: 'YouTube link set', score: s.social?.youtube ? 2 : 0, max: 2, status: s.social?.youtube ? 'pass' : 'warn', hint: 'Settings → Social → YouTube' },
          ],
        },
        {
          title: 'Analytics & Ads', icon: '📊',
          items: [
            { label: 'GA4 ID set', score: s.ga4Id ? 10 : 0, max: 10, status: s.ga4Id ? 'pass' : 'fail', hint: 'Settings → Analytics → GA4 ID' },
            { label: 'Meta Pixel set', score: s.fbPixelId ? 5 : 0, max: 5, status: s.fbPixelId ? 'pass' : 'warn', hint: 'Admin → Meta/Google Ads → Pixel ID' },
            { label: 'GTM set', score: s.gtmId ? 5 : 0, max: 5, status: s.gtmId ? 'pass' : 'warn', hint: 'Admin → Meta/Google Ads → GTM ID' },
          ],
        },
        {
          title: 'WhatsApp & Email', icon: '💬',
          items: [
            { label: 'WA Access Token set', score: s.whatsappCloud?.accessToken ? 10 : 0, max: 10, status: s.whatsappCloud?.accessToken ? 'pass' : 'fail', hint: 'Settings → WhatsApp → Access Token' },
            { label: 'WA Phone Number ID set', score: s.whatsappCloud?.phoneNumberId ? 5 : 0, max: 5, status: s.whatsappCloud?.phoneNumberId ? 'pass' : 'fail', hint: 'Settings → WhatsApp → Phone Number ID' },
            { label: 'WA Templates set', score: s.whatsappCloud?.templates?.welcomeTemplate ? 5 : 0, max: 5, status: s.whatsappCloud?.templates?.welcomeTemplate ? 'pass' : 'warn', hint: 'Settings → WhatsApp → Templates' },
            { label: 'SMTP configured', score: s.smtp?.host ? 5 : 0, max: 5, status: s.smtp?.host ? 'pass' : 'warn', hint: 'Settings → Email/SMTP' },
          ],
        },
        {
          title: 'Projects & Content', icon: '🏗️',
          items: [
            { label: `${projects.length}+ projects listed`, score: projects.length >= 5 ? 10 : projects.length * 2, max: 10, status: projects.length >= 5 ? 'pass' : projects.length > 0 ? 'warn' : 'fail', hint: 'Admin → Projects → Add projects' },
            { label: 'IndexNow key set', score: s.indexNowKey ? 5 : 0, max: 5, status: s.indexNowKey ? 'pass' : 'warn', hint: 'Settings → Integrations → IndexNow' },
            { label: 'Anthropic AI key set', score: s.anthropicApiKey ? 5 : 0, max: 5, status: s.anthropicApiKey ? 'pass' : 'warn', hint: 'Settings → Integrations → Anthropic API Key' },
          ],
        },
      ];
      setSections(secs);
      const tot = secs.flatMap(s => s.items).reduce((a, i) => a + i.score, 0);
      const mx = secs.flatMap(s => s.items).reduce((a, i) => a + i.max, 0);
      setTotalScore(tot);
      setTotalMax(mx);
      setLoading(false);
    }, 800);
  }, [settings, projects]);

  useEffect(() => { if (settings) runAudit(); }, [settings]);

  const pct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 40 ? 'D' : 'F';
  const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="SEO Score" subtitle="Website setup ka complete audit" action={
        <Btn onClick={runAudit} disabled={loading || !settings}>
          {loading ? '⏳ Checking…' : '🔄 Re-run Audit'}
        </Btn>
      } />

      {/* Overall Score Card */}
      {!loading && sections.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="text-center">
            <div className={`text-6xl font-black ${gradeColor}`}>{grade}</div>
            <div className="text-slate-400 text-xs mt-1">Grade</div>
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-white text-4xl font-bold">{pct}%</span>
              <span className="text-slate-400 text-sm mb-1">({totalScore}/{totalMax} points)</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ width: `${pct}%` }} />
            </div>
            <p className="text-slate-400 text-xs mt-2">
              {pct >= 90 ? '🏆 Excellent! Site fully optimized.' : pct >= 70 ? '✅ Good setup. Fix warnings to reach A+.' : pct >= 50 ? '⚠️ Medium. Several important settings missing.' : '❌ Critical settings missing. Fix immediately.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Pass', count: sections.flatMap(s => s.items).filter(i => i.status === 'pass').length, color: 'text-emerald-400' },
              { label: 'Warn', count: sections.flatMap(s => s.items).filter(i => i.status === 'warn').length, color: 'text-amber-400' },
              { label: 'Fail', count: sections.flatMap(s => s.items).filter(i => i.status === 'fail').length, color: 'text-red-400' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className={`text-2xl font-bold ${color}`}>{count}</div>
                <div className="text-slate-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3 animate-pulse">🔍</div>
          <p className="text-slate-500">Auditing your website setup…</p>
        </div>
      )}

      {/* Sections */}
      {!loading && sections.map((sec) => {
        const secScore = sec.items.reduce((a, i) => a + i.score, 0);
        const secMax = sec.items.reduce((a, i) => a + i.max, 0);
        const secPct = Math.round((secScore / secMax) * 100);
        return (
          <div key={sec.title} className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span>{sec.icon}</span> {sec.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${secPct >= 80 ? 'text-emerald-600' : secPct >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {secScore}/{secMax}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {sec.items.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </div>
                    <ScoreBar score={item.score} max={item.max} />
                    {item.status !== 'pass' && (
                      <p className="text-xs text-slate-400 mt-0.5">💡 {item.hint}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {!loading && sections.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 mb-3">🚨 Priority Fixes</h3>
          <div className="space-y-2">
            {sections.flatMap(s => s.items).filter(i => i.status === 'fail').slice(0, 5).map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-amber-800">
                <span>❌</span>
                <span><strong>{item.label}</strong> — {item.hint}</span>
              </div>
            ))}
            {sections.flatMap(s => s.items).filter(i => i.status === 'fail').length === 0 && (
              <p className="text-amber-700 text-sm">✅ No critical failures! Fix warnings to reach 100%.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
