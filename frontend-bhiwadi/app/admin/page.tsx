'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdmin, API } from './_context';
import { Card, Badge, ScoreRing } from './_components/shared';

function StatCard({ label, value, sub, icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: string; color: string; href: string;
}) {
  return (
    <Link href={href}>
      <div className={`bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
          <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">View →</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { authH, token } = useAdmin();
  const [overview, setOverview] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [seoScore, setSeoScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dash, leads, projects, score] = await Promise.all([
        fetch(`${API}/admin/dashboard`, { headers: authH() }).then(r => r.json()),
        fetch(`${API}/admin/leads?page=1&limit=5`, { headers: authH() }).then(r => r.json()),
        fetch(`${API}/admin/projects?limit=5`, { headers: authH() }).then(r => r.json()),
        fetch(`${API}/ai/seo-score`, { headers: authH() }).then(r => r.json()).catch(() => null),
      ]);
      if (dash.success) setOverview(dash.data?.overview);
      if (leads.success) setRecentLeads(leads.data?.slice(0, 5) || []);
      if (projects.success) setRecentProjects(projects.data?.slice(0, 5) || []);
      if (score?.success) setSeoScore(score.data);
    } finally { setLoading(false); }
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

  const leadStatusColor: Record<string, string> = {
    Priority: 'red', Hot: 'orange', Warm: 'yellow', Cold: 'blue', 'Site Visit': 'purple',
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back — here's your site at a glance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Leads" value={overview?.totalLeads ?? 0}
            sub={`${overview?.todayLeads ?? 0} today`}
            icon="👥" color="bg-blue-50" href="/admin/leads" />
          <StatCard label="Hot / Priority" value={(overview?.hotLeads ?? 0) + (overview?.priorityLeads ?? 0)}
            sub="Need attention"
            icon="🔥" color="bg-red-50" href="/admin/leads?filter=Hot" />
          <StatCard label="Active Projects" value={overview?.activeProjects ?? 0}
            sub="Live listings"
            icon="🏗️" color="bg-emerald-50" href="/admin/projects" />
          <StatCard label="Published Blogs" value={overview?.publishedBlogs ?? 0}
            sub="Live articles"
            icon="✍️" color="bg-purple-50" href="/admin/blog" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Recent Leads</h2>
              <Link href="/admin/leads" className="text-xs text-emerald-600 font-medium hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentLeads.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No leads yet</p>
              ) : recentLeads.map((lead: any) => (
                <div key={lead._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                    {(lead.name || lead.mobile || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{lead.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-400 truncate">{lead.mobile} · {lead.interestedProject || 'General'}</p>
                  </div>
                  <Badge color={leadStatusColor[lead.status] || 'slate'}>{lead.status || 'New'}</Badge>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* SEO Scores */}
          {seoScore && (
            <Card>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">SEO Health</h2>
                <Link href="/admin/seo-intel" className="text-xs text-emerald-600 font-medium hover:underline">Details →</Link>
              </div>
              <div className="p-5 flex flex-wrap gap-4 justify-around">
                <ScoreRing score={seoScore.overall} label="Overall" color={scoreColor(seoScore.overall)} />
                <ScoreRing score={seoScore.technical} label="Technical" color={scoreColor(seoScore.technical)} />
                <ScoreRing score={seoScore.local} label="Local" color={scoreColor(seoScore.local)} />
                <ScoreRing score={seoScore.content} label="Content" color={scoreColor(seoScore.content)} />
              </div>
            </Card>
          )}

          {/* Recent Projects */}
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Recent Projects</h2>
              <Link href="/admin/projects" className="text-xs text-emerald-600 font-medium hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentProjects.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No projects</p>
              ) : recentProjects.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.corridor} · {p.status}</p>
                  </div>
                  <Badge color={p.isActive ? 'green' : 'slate'}>{p.isActive ? 'Active' : 'Off'}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { href: '/admin/projects', icon: '🏗️', label: 'Add Project' },
                { href: '/admin/blog', icon: '✍️', label: 'New Blog' },
                { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
                { href: '/admin/seo-intel', icon: '🧠', label: 'SEO AI' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
