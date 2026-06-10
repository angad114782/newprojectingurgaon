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

export default function ProfilePage() {
  const { authH, token } = useAdmin();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const r = await fetch(`${API}/admin/profile`, { headers: authH() });
    const d = await r.json();
    if (d.success && d.data) {
      setForm(f => ({ ...f, name: d.data.name || '', email: d.data.email || '', mobile: d.data.mobile || '' }));
    }
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match' }); return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters' }); return;
    }
    setSaving(true); setMsg(null);
    try {
      const payload: any = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.mobile) payload.mobile = form.mobile;
      if (form.newPassword) { payload.currentPassword = form.currentPassword; payload.newPassword = form.newPassword; }
      const r = await fetch(`${API}/admin/profile`, { method: 'PUT', headers: authH(), body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) {
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
        setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        setMsg({ type: 'error', text: d.message || 'Update failed' });
      }
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg">
      <PageHeader title="My Profile" subtitle="Account details aur password change karo" />

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <SectionHeader title="My Profile" icon="👤" />

        {msg && (
          <div className={`rounded-xl px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {msg.type === 'success' ? '✅' : '❌'} {msg.text}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
            <input type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Mobile Number</label>
            <input type="tel" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
              placeholder="10-digit mobile" maxLength={10} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Change Password</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
              <input type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="Current password" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
              <input type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="New password (min 6 chars)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Confirm New Password</label>
              <input type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat new password" />
            </div>
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors">
          {saving ? '⏳ Saving…' : '✓ Save Profile'}
        </button>
      </div>
    </div>
  );
}
