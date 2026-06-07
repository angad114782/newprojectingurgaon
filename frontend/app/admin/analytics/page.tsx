'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API } from '../_context';
import { Card, PageHeader, Badge, ScoreRing } from '../_components/shared';

function BarChart({ data, max, color }: { data: { label: string; value: number }[]; max: number; color: string }) {
  return (
    <div className="space-y-2">
      {data.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-28 truncate shrink-0">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${color}`}
              style={{ width: max > 0 ? `${(item.value / max) * 100}%` : '0%' }} />
          </div>
          <span className="text-xs font-semibold text-slate-700 w-8 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { authH, token } = useAdmin();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dash, analytics] = await Promise.all([
        fetch(`${API}/admin/dashboard`, { headers: authH() }).then(r => r.json()),
        fetch(`${API}/admin/analytics`, { headers: authH() }).then(r => r.json()).catch(() => ({ success: false })),
      ]);
      setData({ dash: dash.data, analytics: analytics.data });
    } finally { setLoading(false); }
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <PageHeader title="Analytics" subtitle="Lead intelligence & performance" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-48" />
          ))}
        </div>
      </div>
    );
  }

  const overview = data?.dash?.overview || {};
  const statusCounts = data?.dash?.statusCounts || {};
  const sourceCounts = data?.dash?.sourceCounts || {};
  const corridorCounts = data?.dash?.corridorLeads || {};
  const analytics = data?.analytics || {};

  const statusData = Object.entries(statusCounts)
    .map(([label, value]) => ({ label, value: value as number }))
    .sort((a, b) => b.value - a.value);
  const maxStatus = Math.max(...statusData.map(d => d.value), 1);

  const sourceData = Object.entries(sourceCounts)
    .map(([label, value]) => ({ label, value: value as number }))
    .sort((a, b) => b.value - a.value);
  const maxSource = Math.max(...sourceData.map(d => d.value), 1);

  const corridorData = Object.entries(corridorCounts)
    .map(([label, value]) => ({ label, value: value as number }))
    .sort((a, b) => b.value - a.value);
  const maxCorridor = Math.max(...corridorData.map(d => d.value), 1);

  const conversionRate = overview.totalLeads > 0
    ? Math.round(((statusCounts['Converted'] || 0) / overview.totalLeads) * 100)
    : 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl">
      <PageHeader title="Analytics" subtitle="Lead intelligence & performance" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: overview.totalLeads || 0, sub: `${overview.todayLeads || 0} today`, icon: '👥', bg: 'bg-blue-50 text-blue-600' },
          { label: 'Hot + Priority', value: (statusCounts.Hot || 0) + (statusCounts.Priority || 0), sub: 'Need attention', icon: '🔥', bg: 'bg-red-50 text-red-600' },
          { label: 'Converted', value: statusCounts.Converted || 0, sub: `${conversionRate}% rate`, icon: '✅', bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Site Visits', value: overview.siteVisits || 0, sub: 'Scheduled', icon: '🏠', bg: 'bg-purple-50 text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.bg}`}>{card.icon}</div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm font-medium text-slate-500 mt-0.5">{card.label}</p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Status breakdown */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Leads by Status</h2>
          </div>
          <div className="p-5">
            {statusData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No data</p>
            ) : (
              <BarChart data={statusData} max={maxStatus} color="bg-slate-700" />
            )}
          </div>
        </Card>

        {/* Lead Source breakdown */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Leads by Source</h2>
          </div>
          <div className="p-5">
            {sourceData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No data</p>
            ) : (
              <BarChart data={sourceData} max={maxSource} color="bg-emerald-500" />
            )}
          </div>
        </Card>

        {/* Corridor interest */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Interest by Corridor</h2>
          </div>
          <div className="p-5">
            {corridorData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No corridor data</p>
            ) : (
              <BarChart data={corridorData} max={maxCorridor} color="bg-blue-500" />
            )}
          </div>
        </Card>

        {/* Conversion funnel */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Conversion Funnel</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {[
                { label: 'Total Leads', value: overview.totalLeads || 0, color: 'bg-slate-200', text: 'text-slate-700' },
                { label: 'Engaged (Hot + Priority)', value: (statusCounts.Hot || 0) + (statusCounts.Priority || 0), color: 'bg-orange-200', text: 'text-orange-700' },
                { label: 'Site Visits', value: overview.siteVisits || 0, color: 'bg-blue-200', text: 'text-blue-700' },
                { label: 'Converted', value: statusCounts.Converted || 0, color: 'bg-emerald-400', text: 'text-emerald-800' },
              ].map((stage, i) => {
                const total = overview.totalLeads || 1;
                const pct = Math.round((stage.value / total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${stage.text}`}>{stage.label}</span>
                      <span className="text-xs font-bold text-slate-600">{stage.value} ({pct}%)</span>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-xl overflow-hidden">
                      <div className={`h-6 ${stage.color} rounded-xl flex items-center px-2 transition-all`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Top projects by lead interest */}
      {analytics.topProjectsByLeads?.length > 0 && (
        <div className="mt-6">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Top Projects by Lead Interest</h2>
            </div>
            <div className="p-5">
              <BarChart
                data={analytics.topProjectsByLeads.map((p: any) => ({ label: p._id || 'Unknown', value: p.count }))}
                max={analytics.topProjectsByLeads[0]?.count || 1}
                color="bg-purple-400" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
