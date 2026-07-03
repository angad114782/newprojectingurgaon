'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAdmin, API } from '../_context';
import { Card, PageHeader, Btn, Badge, Modal, Field, Input, ListInput, ImageUploader, Toast } from '../_components/shared';

const EMPTY: any = {
  title: '', slug: '', excerpt: '', heroImage: '', category: 'Investment Guide',
  status: 'published', authorId: '',
  date: new Date().toISOString().split('T')[0], readTime: '5 min', keywords: '',
  intro: '',
  sections: [{ heading: '', content: '', link: '', linkText: '' }],
  relatedLinks: [{ label: '', href: '' }],
};

const CATEGORIES = ['Investment Guide', 'Market Trends', 'Locality Guide', 'Legal & Finance', 'Buyer Tips', 'News', 'Project Review'];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function BlogPage() {
  const { authH, token } = useAdmin();
  const [posts, setPosts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const loadPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const [postsRes, authorsRes] = await Promise.all([
      fetch(`${API}/blogs/all`, { headers: authH() }),
      fetch(`${API}/authors?all=true`, { headers: authH() }),
    ]);
    const pd = await postsRes.json();
    const ad = await authorsRes.json();
    if (pd.success) setPosts(pd.data || []);
    if (ad.success) setAuthors(ad.data || []);
    setLoading(false);
  }, [token, authH]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const openAdd = () => {
    setMode('add');
    setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] });
    setActiveSection('basic');
    setModalOpen(true);
  };
  const openEdit = (post: any) => {
    setMode('edit');
    setForm({ ...post, keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : post.keywords || '' });
    setActiveSection('basic');
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) return setToast({ msg: 'Title and Slug required', type: 'error' });
    setSaving(true);
    try {
      const payload = {
        ...form,
        keywords: typeof form.keywords === 'string'
          ? form.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
          : form.keywords,
        sections: form.sections.filter((s: any) => s.heading || s.content),
        relatedLinks: form.relatedLinks.filter((l: any) => l.label && l.href),
      };
      const url = mode === 'edit' ? `${API}/blogs/${form._id}` : `${API}/blogs`;
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: authH(), body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) {
        await loadPosts();
        setModalOpen(false);
        setToast({ msg: `Blog ${mode === 'edit' ? 'updated' : 'published'}!`, type: 'success' });
      } else setToast({ msg: d.message || 'Save failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`${API}/blogs/${id}`, { method: 'DELETE', headers: authH() });
    setPosts(prev => prev.filter(p => p._id !== id));
    setToast({ msg: 'Deleted', type: 'success' });
  };

  const toggleStatus = async (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const r = await fetch(`${API}/blogs/${post._id}`, {
      method: 'PUT', headers: authH(), body: JSON.stringify({ ...post, status: newStatus }),
    });
    const d = await r.json();
    if (d.success) setPosts(prev => prev.map(p => p._id === post._id ? { ...p, status: newStatus } : p));
  };

  const f = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));
  const updateSection = (i: number, key: string, val: string) =>
    setForm((p: any) => ({ ...p, sections: p.sections.map((s: any, idx: number) => idx === i ? { ...s, [key]: val } : s) }));
  const addSection = () => setForm((p: any) => ({ ...p, sections: [...p.sections, { heading: '', content: '', link: '', linkText: '' }] }));
  const removeSection = (i: number) => setForm((p: any) => ({ ...p, sections: p.sections.filter((_: any, idx: number) => idx !== i) }));

  const SECTIONS = [
    { key: 'basic', label: 'Basic' },
    { key: 'content', label: 'Content' },
    { key: 'seo', label: 'SEO' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl">
      <PageHeader title="Blog" subtitle={`${posts.length} posts`}
        action={<Btn onClick={openAdd}>+ New Post</Btn>} />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card><p className="text-center text-slate-400 py-16">No blog posts yet.</p></Card>
      ) : (
        <Card>
          <div className="divide-y divide-slate-100">
            {posts.map(post => (
              <div key={post._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                {post.heroImage && (
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <Image src={post.heroImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color="slate">{post.category || 'General'}</Badge>
                    <span className="text-xs text-slate-400">{post.readTime}</span>
                    <span className="text-xs text-slate-400">{new Date(post.date || post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleStatus(post)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>
                    {post.status === 'published' ? '● Published' : '○ Draft'}
                  </button>
                  <Btn size="sm" variant="ghost" onClick={() => openEdit(post)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deletePost(post._id)}>Delete</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={mode === 'add' ? 'New Blog Post' : 'Edit Blog Post'}
        width="max-w-3xl">
        {/* Section tabs */}
        <div className="flex gap-1 mb-5 border-b border-slate-100 pb-3">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeSection === s.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* BASIC */}
          {activeSection === 'basic' && (
            <>
              {token && (
                <ImageUploader label="Hero Image" value={form.heroImage} onChange={(v) => f('heroImage', v as string)} token={token} />
              )}
              <Field label="Title *">
                <Input value={form.title} onChange={(v) => { f('title', v); if (mode === 'add') f('slug', slugify(v)); }} placeholder="5 Best Apartments in Bhiwadi 2025" />
              </Field>
              <Field label="URL Slug *">
                <Input value={form.slug} onChange={(v) => f('slug', v)} placeholder="apartments-bhiwadi-2025" />
              </Field>
              <Field label="Excerpt">
                <Input value={form.excerpt} onChange={(v) => f('excerpt', v)} placeholder="Brief summary shown in blog cards..." rows={2} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={(e) => f('category', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => f('status', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </Field>
                <Field label="Read Time">
                  <Input value={form.readTime} onChange={(v) => f('readTime', v)} placeholder="5 min" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Publish Date">
                  <Input type="date" value={form.date} onChange={(v) => f('date', v)} />
                </Field>
                <Field label="Author">
                  <select value={form.authorId || ''} onChange={(e) => f('authorId', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                    <option value="">-- Select Author --</option>
                    {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </Field>
              </div>
            </>
          )}

          {/* CONTENT */}
          {activeSection === 'content' && (
            <>
              <Field label="Introduction">
                <Input value={form.intro} onChange={(v) => f('intro', v)} placeholder="Opening paragraph..." rows={4} />
              </Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Content Sections</label>
                  <Btn size="sm" variant="secondary" onClick={addSection}>+ Add Section</Btn>
                </div>
                {form.sections.map((section: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Section {i + 1}</span>
                      {i > 0 && (
                        <button onClick={() => removeSection(i)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Remove</button>
                      )}
                    </div>
                    <Input value={section.heading} onChange={(v) => updateSection(i, 'heading', v)} placeholder="Section Heading" />
                    <Input value={section.content} onChange={(v) => updateSection(i, 'content', v)} placeholder="Section content (supports line breaks)..." rows={4} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={section.link || ''} onChange={(v) => updateSection(i, 'link', v)} placeholder="Optional link URL" />
                      <Input value={section.linkText || ''} onChange={(v) => updateSection(i, 'linkText', v)} placeholder="Link text" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SEO */}
          {activeSection === 'seo' && (
            <>
              <Field label="Meta Keywords (comma-separated)">
                <Input value={form.keywords} onChange={(v) => f('keywords', v)} placeholder="apartments bhiwadi, 2 bhk nh-48 bhiwadi..." rows={2} />
              </Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Related Links (Internal Linking)</label>
                  <Btn size="sm" variant="secondary" onClick={() => f('relatedLinks', [...(form.relatedLinks || []), { label: '', href: '' }])}>+ Add Link</Btn>
                </div>
                {(form.relatedLinks || []).map((link: any, i: number) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <Input value={link.label} onChange={(v) => {
                      const links = [...form.relatedLinks];
                      links[i] = { ...links[i], label: v };
                      f('relatedLinks', links);
                    }} placeholder="Link text" />
                    <div className="flex gap-1">
                      <Input value={link.href} onChange={(v) => {
                        const links = [...form.relatedLinks];
                        links[i] = { ...links[i], href: v };
                        f('relatedLinks', links);
                      }} placeholder="/page-slug" />
                      {i > 0 && (
                        <button type="button" onClick={() => f('relatedLinks', form.relatedLinks.filter((_: any, idx: number) => idx !== i))}
                          className="text-red-400 hover:text-red-600 px-2 text-lg font-bold">×</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : mode === 'add' ? 'Publish Post' : 'Save Changes'}</Btn>
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
