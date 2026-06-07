'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAdmin, API } from '../_context';
import { Card, PageHeader, Btn, Badge, Modal, Field, Input, ListInput, ImageUploader, Toast } from '../_components/shared';

const EMPTY: any = {
  name: '', slug: '', photo: '', designation: 'Property Advisor', experience: '',
  specializations: [], credentials: '', reraAgentId: '', bio: '', fullBio: '',
  education: '', languages: [], dealsCount: '', awards: [],
  socialLinkedIn: '', socialTwitter: '', email: '', phone: '',
  isActive: true, isFeatured: false, sortOrder: 0,
};

const autoSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

export default function TeamPage() {
  const { authH, token } = useAdmin();
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const r = await fetch(`${API}/authors?all=true`, { headers: authH() });
    const d = await r.json();
    if (d.success) setAuthors(d.data || []);
    setLoading(false);
  }, [token, authH]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setMode('add'); setForm({ ...EMPTY }); setModalOpen(true); };
  const openEdit = (a: any) => { setMode('edit'); setForm({ ...a }); setModalOpen(true); };

  const save = async () => {
    if (!form.name || !form.slug) return setToast({ msg: 'Name and Slug are required', type: 'error' });
    setSaving(true);
    try {
      const url = mode === 'edit' ? `${API}/authors/${form._id}` : `${API}/authors`;
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const { _id, ...body } = form;
      const r = await fetch(url, { method, headers: authH(), body: JSON.stringify(mode === 'edit' ? form : body) });
      const d = await r.json();
      if (d.success) {
        await load();
        setModalOpen(false);
        setToast({ msg: `Team member ${mode === 'edit' ? 'updated' : 'added'}!`, type: 'success' });
      } else setToast({ msg: d.message || 'Save failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deleteAuthor = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await fetch(`${API}/authors/${id}`, { method: 'DELETE', headers: authH() });
    setAuthors(prev => prev.filter(a => a._id !== id));
    setToast({ msg: 'Deleted', type: 'success' });
  };

  const f = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));

  return (
    <div className="p-4 sm:p-6 max-w-6xl">
      <PageHeader title="Team" subtitle="Manage team members and property advisors"
        action={<Btn onClick={openAdd}>+ Add Member</Btn>} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-48" />)}
        </div>
      ) : authors.length === 0 ? (
        <Card><p className="text-center text-slate-400 py-16">No team members yet. Click "+ Add Member" to start.</p></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map(a => (
            <Card key={a._id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                  {a.photo ? (
                    <Image src={a.photo} alt={a.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
                      {a.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.designation}</p>
                  {a.experience && <p className="text-xs text-slate-400">{a.experience} exp</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {a.isActive && <Badge color="green">Active</Badge>}
                {a.isFeatured && <Badge color="emerald">Featured</Badge>}
                {a.reraAgentId && <Badge color="blue">RERA</Badge>}
              </div>
              {a.bio && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{a.bio}</p>}
              <div className="flex gap-2">
                <Btn size="sm" variant="secondary" onClick={() => openEdit(a)} className="flex-1 justify-center">Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => deleteAuthor(a._id)}>Delete</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={mode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
        width="max-w-2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {token && (
            <ImageUploader label="Photo" value={form.photo} onChange={(v) => f('photo', v)} token={token} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name *">
              <Input value={form.name} onChange={(v) => { f('name', v); if (mode === 'add') f('slug', autoSlug(v)); }} placeholder="Rajesh Kumar" />
            </Field>
            <Field label="URL Slug *">
              <Input value={form.slug} onChange={(v) => f('slug', v)} placeholder="rajesh-kumar" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Designation">
              <Input value={form.designation} onChange={(v) => f('designation', v)} placeholder="Property Advisor" />
            </Field>
            <Field label="Experience">
              <Input value={form.experience} onChange={(v) => f('experience', v)} placeholder="8 years" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <Input value={form.email} onChange={(v) => f('email', v)} placeholder="rajesh@example.com" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(v) => f('phone', v)} placeholder="+91 9876543210" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="RERA Agent ID">
              <Input value={form.reraAgentId} onChange={(v) => f('reraAgentId', v)} placeholder="HRERA/ENF/R..." />
            </Field>
            <Field label="Deals Closed">
              <Input value={form.dealsCount} onChange={(v) => f('dealsCount', v)} placeholder="150+" />
            </Field>
          </div>

          <Field label="Short Bio">
            <Input value={form.bio} onChange={(v) => f('bio', v)} placeholder="One-line intro..." rows={2} />
          </Field>

          <Field label="Full Bio">
            <Input value={form.fullBio} onChange={(v) => f('fullBio', v)} placeholder="Detailed background..." rows={4} />
          </Field>

          <Field label="Credentials / Certifications">
            <Input value={form.credentials} onChange={(v) => f('credentials', v)} placeholder="MBA, Certified Realtor..." />
          </Field>

          <ListInput label="Specializations" items={form.specializations}
            onAdd={(v) => f('specializations', [...form.specializations, v])}
            onRemove={(i) => f('specializations', form.specializations.filter((_: any, idx: number) => idx !== i))}
            placeholder="Luxury Apartments, Dwarka Expressway..." />

          <ListInput label="Languages" items={form.languages}
            onAdd={(v) => f('languages', [...form.languages, v])}
            onRemove={(i) => f('languages', form.languages.filter((_: any, idx: number) => idx !== i))}
            placeholder="Hindi, English..." />

          <div className="grid grid-cols-2 gap-4">
            <Field label="LinkedIn URL">
              <Input value={form.socialLinkedIn} onChange={(v) => f('socialLinkedIn', v)} placeholder="linkedin.com/in/..." />
            </Field>
            <Field label="Twitter URL">
              <Input value={form.socialTwitter} onChange={(v) => f('socialTwitter', v)} placeholder="twitter.com/..." />
            </Field>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500" />
              <span className="text-sm text-slate-700 font-medium">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => f('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500" />
              <span className="text-sm text-slate-700 font-medium">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : mode === 'add' ? 'Add Member' : 'Save Changes'}</Btn>
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
