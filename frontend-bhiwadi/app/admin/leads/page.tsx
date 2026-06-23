'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAdmin, API } from '../_context';
import { Card, Badge, Btn, PageHeader, Toast } from '../_components/shared';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5007';

type Lead = {
  _id: string; name: string; mobile: string; email?: string;
  score: number; status: string; source?: string; interestedProject?: string;
  budget?: string; buyerType?: string; createdAt: string;
  isVerified?: boolean; sourceURL?: string; projectSlug?: string;
  assignedTo?: { name: string };
};

const STATUS_OPTIONS = ['New', 'Warm', 'Hot', 'Priority', 'Cold', 'Site Visit', 'Converted', 'Not Interested'];
const FILTER_OPTIONS = ['all', 'Priority', 'Hot', 'Warm', 'Cold', 'Site Visit', 'Converted'];

function scoreColor(s: number) {
  if (s >= 60) return 'red';
  if (s >= 31) return 'orange';
  if (s >= 11) return 'yellow';
  return 'blue';
}

function LeadDrawer({ lead, onClose, onUpdate, token, authH }: {
  lead: Lead; onClose: () => void;
  onUpdate: (l: Lead) => void;
  token: string; authH: () => Record<string, string>;
}) {
  const [status, setStatus] = useState(lead.status);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/admin/leads/${lead._id}/notes`, { headers: authH() })
      .then(r => r.json()).then(d => { if (d.success) setNotes(d.data || []); }).catch(() => {});
  }, [lead._id]);

  const saveStatus = async () => {
    setSaving(true);
    const r = await fetch(`${API}/admin/leads/${lead._id}`, {
      method: 'PATCH', headers: authH(), body: JSON.stringify({ status }),
    });
    const d = await r.json();
    if (d.success) onUpdate({ ...lead, status });
    setSaving(false);
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    const r = await fetch(`${API}/admin/leads/${lead._id}/notes`, {
      method: 'POST', headers: authH(), body: JSON.stringify({ note }),
    });
    const d = await r.json();
    if (d.success) { setNotes(d.data || []); setNote(''); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Lead Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 text-lg">×</button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-lg font-bold text-emerald-700">
              {(lead.name || lead.mobile || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900">{lead.name || 'Unknown'}</p>
              <p className="text-sm text-slate-500">{lead.mobile}</p>
              {lead.email && <p className="text-xs text-slate-400">{lead.email}</p>}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Score', value: lead.score },
              { label: 'Source', value: lead.source || '—' },
              { label: 'Budget', value: lead.budget || '—' },
              { label: 'Type', value: lead.buyerType || '—' },
              { label: 'Project', value: lead.interestedProject || '—' },
              { label: 'Created', value: new Date(lead.createdAt).toLocaleDateString('en-IN') },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{String(item.value)}</p>
              </div>
            ))}

            {/* OTP Verified */}
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">OTP Verified</p>
              {lead.isVerified
                ? <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1">✅ Verified</span>
                : <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1">⏳ Not verified</span>
              }
            </div>

            {/* Source URL */}
            {lead.sourceURL && (
              <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Source Page</p>
                <a href={lead.sourceURL} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-emerald-600 underline truncate block mt-0.5 hover:text-emerald-800">
                  {lead.sourceURL}
                </a>
              </div>
            )}
            {lead.projectSlug && (
              <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Project Page</p>
                <a href={`/project/${lead.projectSlug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline truncate block mt-0.5 hover:text-blue-800">
                  /project/{lead.projectSlug}
                </a>
              </div>
            )}
          </div>

          {/* Status update */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Update Status</label>
            <div className="flex gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <Btn onClick={saveStatus} disabled={saving} size="sm">
                {saving ? '…' : 'Save'}
              </Btn>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a href={`tel:${lead.mobile}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
              📞 Call
            </a>
            <a href={`https://wa.me/91${lead.mobile}`} target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
              💬 WhatsApp
            </a>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Notes</label>
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-slate-400 text-xs">No notes yet</p>
              ) : notes.map((n: any, i: number) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700">
                  <p>{n.note}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add a note…"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
              <Btn onClick={addNote} disabled={saving} size="sm" variant="secondary">Add</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const { authH, token } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [liveNotif, setLiveNotif] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const LIMIT = 20;

  const fetchLeads = useCallback(async (pg = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const statusQ = filter !== 'all' ? `&status=${filter}` : '';
      const searchQ = search ? `&search=${encodeURIComponent(search)}` : '';
      const [lr, sr] = await Promise.all([
        fetch(`${API}/admin/leads?page=${pg}&limit=${LIMIT}${statusQ}${searchQ}`, { headers: authH() }),
        fetch(`${API}/admin/dashboard`, { headers: authH() }),
      ]);
      if (lr.status === 401) return;
      const l = await lr.json(); const s = await sr.json();
      if (l.success) { setLeads(l.data || []); setTotal(l.total || 0); setTotalPages(l.pages || 1); }
      if (s.success) {
        const ov = s.data?.overview || {};
        const sc = s.data?.statusCounts || {};
        setStats({ total: ov.totalLeads || 0, today: ov.todayLeads || 0, hot: (sc.Hot || 0) + (sc.Priority || 0), warm: sc.Warm || 0, cold: sc.Cold || 0, siteVisit: ov.siteVisits || 0 });
      }
    } finally { setLoading(false); }
  }, [token, filter, search, authH]);

  useEffect(() => { fetchLeads(1); setPage(1); }, [filter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchLeads(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => { fetchLeads(page); }, [page]);

  // Socket.io
  useEffect(() => {
    if (!token) return;
    const socket = io(WS_URL, { transports: ['websocket', 'polling'], auth: { token } });
    socketRef.current = socket;
    socket.on('lead:new', ({ lead }: { lead: Lead }) => {
      setLeads(prev => [lead, ...prev.filter(l => l._id !== lead._id)]);
      setStats((prev: any) => prev ? { ...prev, total: prev.total + 1, today: prev.today + 1 } : prev);
      setLiveNotif(`New lead: ${lead.name || lead.mobile}`);
      setTimeout(() => setLiveNotif(null), 5000);
    });
    socket.on('lead:updated', ({ lead }: { lead: Lead }) => {
      setLeads(prev => prev.map(l => l._id === lead._id ? lead : l));
    });
    return () => { socket.disconnect(); };
  }, [token]);

  const exportCsv = () => {
    if (!leads.length) return;
    const cols = ['Name', 'Mobile', 'Email', 'Status', 'Score', 'Source', 'Project', 'Budget', 'Date'];
    const rows = leads.map(l => [
      l.name, l.mobile, l.email || '', l.status, l.score, l.source || '', l.interestedProject || '', l.budget || '',
      new Date(l.createdAt).toLocaleDateString('en-IN'),
    ]);
    const csv = [cols, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl">
      <PageHeader title="Leads" subtitle="Real-time lead management"
        action={
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
            </div>
            <Btn variant="secondary" size="sm" onClick={exportCsv}>📤 Export CSV</Btn>
          </div>
        } />

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
          {[
            { label: 'Total', value: stats.total, color: 'bg-slate-50 text-slate-700' },
            { label: 'Today', value: stats.today, color: 'bg-blue-50 text-blue-700' },
            { label: 'Hot', value: stats.hot, color: 'bg-red-50 text-red-700' },
            { label: 'Warm', value: stats.warm, color: 'bg-orange-50 text-orange-700' },
            { label: 'Cold', value: stats.cold, color: 'bg-slate-50 text-slate-500' },
            { label: 'Site Visit', value: stats.siteVisit, color: 'bg-purple-50 text-purple-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <Card>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, project…"
            className="flex-1 min-w-48 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          <div className="flex gap-1 flex-wrap">
            {FILTER_OPTIONS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 ml-auto">{total} leads</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Lead', 'Mobile', 'Project', 'Budget', 'Source', 'Score', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-5 bg-slate-100 rounded animate-pulse" /></td></tr>
                ))
              ) : leads.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} onClick={() => setSelected(lead)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {(lead.name || lead.mobile || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800 truncate max-w-28">{lead.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {lead.mobile}
                      {lead.isVerified && <span title="OTP Verified" className="text-green-600 text-xs">✅</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-32">{lead.interestedProject || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{lead.budget || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{lead.source || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge color={scoreColor(lead.score)}>{lead.score}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={lead.status === 'Hot' || lead.status === 'Priority' ? 'red' : lead.status === 'Warm' ? 'orange' : lead.status === 'Converted' ? 'green' : 'slate'}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Btn size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</Btn>
              <Btn size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Btn>
            </div>
          </div>
        )}
      </Card>

      {/* Lead drawer */}
      {selected && token && (
        <LeadDrawer lead={selected} onClose={() => setSelected(null)}
          onUpdate={(l) => setLeads(prev => prev.map(x => x._id === l._id ? l : x))}
          token={token} authH={authH} />
      )}

      {/* Live notification */}
      {liveNotif && (
        <div className="fixed bottom-6 left-72 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> {liveNotif}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
