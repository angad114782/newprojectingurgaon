'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Types ──────────────────────────────────────────────────
type Lead = {
  _id: string; name: string; mobile: string; email?: string;
  score: number; status: string; source?: string; interestedProject?: string;
  budget?: string; buyerType?: string; createdAt: string;
  assignedTo?: { name: string };
};
type Stats = { total: number; new: number; hot: number; warm: number; cold: number; siteVisit: number };

type FloorPlan = { config: string; area: string; price: string };
type FAQ = { q: string; a: string };

type ProjectForm = {
  _id?: string;
  name: string; slug: string;
  builder: { name: string; logo?: string; website?: string; reraId?: string };
  location: string; sector: string; corridor: string; pincode: string; googleMapsUrl: string;
  status: string;
  priceDisplay: string; pricePerSqft: string; priceMin: string; priceMax: string; priceOnRequest: boolean;
  configurations: string[];
  floorPlans: FloorPlan[];
  possession: string; totalUnits: string; totalTowers: string; totalArea: string; floors: string;
  rera: { number: string; link?: string; expiryDate?: string };
  shortDescription: string; description: string;
  highlights: string[]; amenities: string[]; connectivity: string[];
  nearbyLandmarks: string[]; whyBuy: string[]; tags: string[];
  heroImage: string; gallery: string[]; amenityImages: string[]; floorPlanImages: string[];
  appreciationRate: string; rentalYield: string;
  faqs: FAQ[];
  isVerified: boolean; isFeatured: boolean; isNew: boolean; isActive: boolean; isCommercial: boolean;
  metaTitle: string; metaDescription: string; metaKeywords: string;
};

const EMPTY_FORM: ProjectForm = {
  name: '', slug: '', builder: { name: '', logo: '', website: '', reraId: '' },
  location: '', sector: '', corridor: '', pincode: '', googleMapsUrl: '',
  status: 'New Launch',
  priceDisplay: '', pricePerSqft: '', priceMin: '', priceMax: '', priceOnRequest: false,
  configurations: [], floorPlans: [], possession: '', totalUnits: '', totalTowers: '', totalArea: '', floors: '',
  rera: { number: '', link: '', expiryDate: '' },
  shortDescription: '', description: '',
  highlights: [], amenities: [], connectivity: [], nearbyLandmarks: [], whyBuy: [], tags: [],
  heroImage: '', gallery: [], amenityImages: [], floorPlanImages: [],
  appreciationRate: '', rentalYield: '',
  faqs: [],
  isVerified: true, isFeatured: false, isNew: false, isActive: true, isCommercial: false,
  metaTitle: '', metaDescription: '', metaKeywords: '',
};

const CORRIDORS = ['Dwarka Expressway', 'Golf Course Road', 'Golf Course Extension Road', 'SPR Road', 'Sohna Road', 'New Gurgaon', 'MG Road', 'Other'];
const STATUSES = ['New Launch', 'Pre Launch', 'Under Construction', 'Ready To Move'];

const scoreColor = (s: number) => s >= 60 ? 'bg-red-100 text-red-800' : s >= 31 ? 'bg-orange-100 text-orange-800' : s >= 11 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
const scoreLabel = (s: number) => s >= 60 ? 'Priority' : s >= 31 ? 'Hot' : s >= 11 ? 'Warm' : 'Cold';
const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

// ── Image Upload Component ─────────────────────────────────
function ImageUploader({
  label, value, onChange, token, multiple = false, maxFiles = 10,
}: {
  label: string; value: string | string[]; onChange: (v: string | string[]) => void;
  token: string; multiple?: boolean; maxFiles?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [preview, setPreview] = useState(false);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (multiple) {
        Array.from(files).forEach((f) => formData.append('images', f));
        const res = await fetch(`${API}/upload/gallery`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const data = await res.json();
        if (data.success) onChange(multiple ? [...(value as string[]), ...data.urls] : data.urls[0]);
      } else {
        formData.append('image', files[0]);
        const res = await fetch(`${API}/upload/single`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const data = await res.json();
        if (data.success) onChange(data.url);
      }
    } catch { alert('Upload failed. Check backend connection.'); }
    finally { setUploading(false); }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    if (multiple) onChange([...(value as string[]), urlInput.trim()]);
    else onChange(urlInput.trim());
    setUrlInput('');
  };

  const removeImg = (idx: number) => {
    const arr = value as string[];
    onChange(arr.filter((_, i) => i !== idx));
  };

  const imgs = multiple ? (value as string[]) : (value ? [value as string] : []);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide">{label}</label>
      
      {/* Upload buttons */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-all disabled:opacity-50"
          disabled={uploading}>
          {uploading ? '⏳ Uploading…' : `📁 Choose File${multiple ? 's' : ''}`}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        
        {/* URL input */}
        <div className="flex gap-1.5 flex-1 min-w-0">
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="Or paste image URL (Unsplash, etc)"
            className="input-field text-xs flex-1 py-2" />
          <button type="button" onClick={addUrl}
            className="bg-brand-mint border border-brand-border text-brand-dark text-xs font-semibold px-3 py-2 rounded-xl hover:bg-brand-accent hover:text-white transition-all">
            Add URL
          </button>
        </div>
      </div>

      {/* Image previews */}
      {imgs.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {imgs.map((img, i) => (
            <div key={i} className="relative group">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-brand-border">
                <Image src={img} alt={`preview ${i}`} fill className="object-cover" onError={() => {}} />
              </div>
              <button type="button" onClick={() => multiple ? removeImg(i) : onChange('')}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {!multiple && !value && (
        <div className="w-24 h-20 rounded-xl border-2 border-dashed border-brand-border/60 flex items-center justify-center text-brand-muted text-xs text-center p-2">
          No image
        </div>
      )}
    </div>
  );
}

// ── List Input Component (highlights, amenities, etc.) ──────
function ListInput({
  label, items, onAdd, onRemove, placeholder,
}: {
  label: string; items: string[]; onAdd: (v: string) => void;
  onRemove: (i: number) => void; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const add = () => { if (!input.trim()) return; onAdd(input.trim()); setInput(''); };
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder} className="input-field flex-1 text-sm py-2" />
        <button type="button" onClick={add}
          className="bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-accent hover:text-brand-dark transition-all">
          + Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-brand-mint/40 rounded-xl px-3 py-2 text-sm">
              <span className="flex-1 text-brand-muted">{item}</span>
              <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 font-bold flex-shrink-0">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Floor Plans Input ────────────────────────────────────────
function FloorPlansInput({ plans, onChange }: { plans: FloorPlan[]; onChange: (v: FloorPlan[]) => void }) {
  const add = () => onChange([...plans, { config: '', area: '', price: '' }]);
  const update = (i: number, field: keyof FloorPlan, val: string) => {
    const updated = plans.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    onChange(updated);
  };
  const remove = (i: number) => onChange(plans.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Floor Plans / Price List</label>
        <button type="button" onClick={add} className="text-xs bg-brand-dark text-white px-3 py-1.5 rounded-lg hover:bg-brand-accent hover:text-brand-dark transition-all">
          + Add Row
        </button>
      </div>
      {plans.length === 0 ? (
        <div className="text-brand-muted text-xs text-center py-4 bg-brand-mint/20 rounded-xl border border-dashed border-brand-border">Click "+ Add Row" to add configurations with pricing</div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-brand-muted px-1">
            <span>Config</span><span>Area</span><span>Price</span>
          </div>
          {plans.map((p, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <input value={p.config} onChange={(e) => update(i, 'config', e.target.value)} placeholder="3 BHK" className="input-field text-sm py-2" />
              <input value={p.area} onChange={(e) => update(i, 'area', e.target.value)} placeholder="1,680 sqft" className="input-field text-sm py-2" />
              <div className="flex gap-1">
                <input value={p.price} onChange={(e) => update(i, 'price', e.target.value)} placeholder="₹1.4 Cr+" className="input-field text-sm py-2 flex-1" />
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-2 text-lg font-bold">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FAQ Input ───────────────────────────────────────────────
function FAQInput({ faqs, onChange }: { faqs: FAQ[]; onChange: (v: FAQ[]) => void }) {
  const add = () => onChange([...faqs, { q: '', a: '' }]);
  const update = (i: number, field: 'q' | 'a', val: string) => {
    onChange(faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  };
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">FAQs</label>
        <button type="button" onClick={add} className="text-xs bg-brand-dark text-white px-3 py-1.5 rounded-lg hover:bg-brand-accent hover:text-brand-dark transition-all">+ Add FAQ</button>
      </div>
      {faqs.length === 0 ? (
        <div className="text-brand-muted text-xs text-center py-4 bg-brand-mint/20 rounded-xl border border-dashed border-brand-border">No FAQs yet. Add common buyer questions about this project.</div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-brand-mint/20 rounded-xl border border-brand-border/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-brand-muted">Q{i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="ml-auto text-red-400 hover:text-red-600 text-sm font-bold">Remove</button>
              </div>
              <input value={faq.q} onChange={(e) => update(i, 'q', e.target.value)}
                placeholder="Question (e.g. What is the price of 3 BHK?)"
                className="input-field text-sm w-full" />
              <textarea value={faq.a} onChange={(e) => update(i, 'a', e.target.value)}
                placeholder="Answer (2-3 lines, include price/possession details)"
                rows={2} className="input-field text-sm w-full resize-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="font-display font-semibold text-brand-text text-sm uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ── Main Admin Page Component ────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'projects' | 'settings'>('leads');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leadFilter, setLeadFilter] = useState('all');
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // CSV Import state
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);
  const [csvSkipImages, setCsvSkipImages] = useState(false);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<ProjectForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => { const t = localStorage.getItem('admin_token'); if (t) setToken(t); }, []);

  const authH = useCallback(() => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }), [token]);

  const fetchLeads = useCallback(async () => {
    if (!token) return; setLoadingLeads(true);
    try {
      const [lr, sr] = await Promise.all([
        fetch(`${API}/admin/leads?status=${leadFilter !== 'all' ? leadFilter : ''}`, { headers: authH() }),
        fetch(`${API}/admin/dashboard`, { headers: authH() }),
      ]);
      if (lr.status === 401) { localStorage.removeItem('admin_token'); setToken(null); return; }
      const l = await lr.json(); const s = await sr.json();
      if (l.success) setLeads(l.data || []);
      if (s.success) {
        const ov = s.data?.overview || {};
        const sc = s.data?.statusCounts || {};
        setStats({
          total: ov.totalLeads || 0,
          new: ov.todayLeads || 0,
          hot: (sc.Hot || 0) + (sc.Priority || 0),
          warm: sc.Warm || 0,
          cold: sc.Cold || 0,
          siteVisit: ov.siteVisits || 0,
        });
      }
    } finally { setLoadingLeads(false); }
  }, [token, leadFilter, authH]);

  const fetchProjects = useCallback(async () => {
    if (!token) return; setLoadingProjects(true);
    try {
      const r = await fetch(`${API}/admin/projects`, { headers: authH() });
      const d = await r.json();
      if (d.success) setProjects(d.data || []);
    } finally { setLoadingProjects(false); }
  }, [token, authH]);

  const fetchSiteSettings = useCallback(async () => {
    if (!token) return;
    const r = await fetch(`${API}/admin/settings`, { headers: authH() });
    const d = await r.json();
    if (d.success) setSiteSettings(d.settings);
  }, [token, authH]);

  const saveSiteSettings = async () => {
    if (!siteSettings) return;
    setSettingsSaving(true);
    try {
      const r = await fetch(`${API}/admin/settings`, { method: 'PUT', headers: authH(), body: JSON.stringify(siteSettings) });
      const d = await r.json();
      if (d.success) { setSiteSettings(d.settings); alert('Settings saved!'); }
      else alert(d.message || 'Save failed');
    } catch { alert('Network error'); }
    finally { setSettingsSaving(false); }
  };

  const testSmtp = async () => {
    try {
      const r = await fetch(`${API}/admin/settings/test-smtp`, {
        method: 'POST', headers: authH(),
        body: JSON.stringify(siteSettings?.smtp || {}),
      });
      const d = await r.json();
      alert(d.message || (d.success ? 'SMTP OK' : 'SMTP Failed'));
    } catch { alert('Network error'); }
  };

  const testWhatsApp = async () => {
    try {
      const r = await fetch(`${API}/admin/settings/test-whatsapp`, {
        method: 'POST', headers: authH(),
        body: JSON.stringify(siteSettings?.whatsappCloud || {}),
      });
      const d = await r.json();
      alert(d.message || (d.success ? 'WhatsApp OK' : 'WhatsApp Failed'));
    } catch { alert('Network error'); }
  };

  useEffect(() => { if (token) { fetchLeads(); fetchProjects(); fetchSiteSettings(); } }, [token]);
  useEffect(() => { if (token) fetchLeads(); }, [leadFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch(`${API}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
      const d = await res.json();
      if (d.success && d.token) { localStorage.setItem('admin_token', d.token); setToken(d.token); }
      else setLoginError(d.message || 'Login failed. Check credentials.');
    } catch { setLoginError('Cannot connect to server. Is backend running?'); }
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM }); setModalMode('add'); setActiveSection('basic'); setModalOpen(true);
  };
  const openEdit = (p: any) => {
    setForm({
      ...EMPTY_FORM, ...p,
      builder: p.builder || { name: '' },
      rera: p.rera || { number: '', link: '', expiryDate: '' },
      configurations: p.configurations || [],
      floorPlans: p.floorPlans || [],
      highlights: p.highlights || [],
      amenities: p.amenities || [],
      connectivity: p.connectivity || [],
      nearbyLandmarks: p.nearbyLandmarks || [],
      whyBuy: p.whyBuy || [],
      tags: p.tags || [],
      gallery: p.gallery || [],
      amenityImages: p.amenityImages || [],
      floorPlanImages: p.floorPlanImages || [],
      faqs: p.faqs || [],
      priceMin: String(p.priceMin || ''),
      priceMax: String(p.priceMax || ''),
      totalUnits: String(p.totalUnits || ''),
      totalTowers: String(p.totalTowers || ''),
    });
    setModalMode('edit'); setActiveSection('basic'); setModalOpen(true);
  };

  const setF = (key: keyof ProjectForm, val: any) => setForm((f) => ({ ...f, [key]: val }));
  const setBuilder = (key: string, val: string) => setForm((f) => ({ ...f, builder: { ...f.builder, [key]: val } }));
  const setRera = (key: string, val: string) => setForm((f) => ({ ...f, rera: { ...f.rera, [key]: val } }));

  const save = async () => {
    if (!form.name || !form.slug || !form.builder.name || !form.location) {
      alert('Please fill required fields: Name, Slug, Builder, Location'); return;
    }
    setSaving(true);
    try {
      const { _id, ...body } = form;
      const payload = { ...body, priceMin: Number(form.priceMin) || 0, priceMax: Number(form.priceMax) || 0, totalUnits: Number(form.totalUnits) || 0, totalTowers: Number(form.totalTowers) || 0 };
      const url = modalMode === 'edit' ? `${API}/admin/projects/${_id}` : `${API}/admin/projects`;
      const r = await fetch(url, { method: modalMode === 'edit' ? 'PUT' : 'POST', headers: authH(), body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { setModalOpen(false); fetchProjects(); }
      else alert(d.message || 'Save failed. Check required fields.');
    } catch { alert('Network error. Check backend connection.'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (p: any) => {
    await fetch(`${API}/admin/projects/${p._id}`, { method: 'PUT', headers: authH(), body: JSON.stringify({ isActive: !p.isActive }) });
    fetchProjects();
  };
  const deleteP = async (p: any) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await fetch(`${API}/admin/projects/${p._id}`, { method: 'DELETE', headers: authH() });
    fetchProjects();
  };

  const downloadCsvTemplate = async () => {
    const res = await fetch(`${API}/admin/projects/csv-template`, { headers: authH() });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'gurgaonrealty-projects-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async () => {
    if (!csvFile) return;
    setCsvImporting(true); setCsvResult(null);
    try {
      const fd = new FormData();
      fd.append('csv', csvFile);
      fd.append('skipImages', String(csvSkipImages));
      const res = await fetch(`${API}/admin/projects/import/csv`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await res.json();
      setCsvResult(d);
      if (d.success) fetchProjects();
    } catch { setCsvResult({ success: false, message: 'Network error. Check backend connection.' }); }
    finally { setCsvImporting(false); }
  };

  const filtered = leads.filter((l) => leadSearch
    ? (l.name || '').toLowerCase().includes(leadSearch.toLowerCase()) || (l.mobile || '').includes(leadSearch) : true);

  const LEAD_TABS = [
    { label: 'All', value: 'all', count: stats?.total },
    { label: 'New', value: 'new', count: stats?.new },
    { label: '🔥 Hot', value: 'Hot', count: stats?.hot },
    { label: 'Warm', value: 'Warm', count: stats?.warm },
    { label: 'Cold', value: 'Cold', count: stats?.cold },
    { label: 'Site Visit', value: 'Site Visit Scheduled', count: stats?.siteVisit },
  ];

  const FORM_SECTIONS = [
    { id: 'basic', label: '📋 Basic', icon: '📋' },
    { id: 'pricing', label: '💰 Pricing', icon: '💰' },
    { id: 'details', label: '🏢 Details', icon: '🏢' },
    { id: 'images', label: '🖼️ Images', icon: '🖼️' },
    { id: 'lists', label: '📝 Content', icon: '📝' },
    { id: 'floorplans', label: '📐 Plans', icon: '📐' },
    { id: 'faqs', label: '❓ FAQs', icon: '❓' },
    { id: 'seo', label: '🔍 SEO', icon: '🔍' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  // ── LOGIN ──────────────────────────────────────────────────
  if (!token) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">GR</div>
          <h1 className="text-xl font-display font-bold text-brand-text">GurgaonRealty CRM</h1>
          <p className="text-brand-muted text-sm mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-xs font-medium text-brand-muted mb-1">Email</label>
            <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="input-field" placeholder="admin@gurgaonrealty.com" required /></div>
          <div><label className="block text-xs font-medium text-brand-muted mb-1">Password</label>
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="input-field" required /></div>
          {loginError && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{loginError}</p>}
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <p className="text-brand-muted text-xs text-center mt-4">Default: admin@gurgaonrealty.com / Admin@123</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-brand-dark text-white px-5 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-display font-semibold text-sm flex items-center gap-2">
            <span className="bg-brand-accent text-brand-dark w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center">GR</span>
            GurgaonRealty CRM
          </span>
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'leads' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
              📋 Leads{stats ? ` (${stats.total})` : ''}
            </button>
            <button onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
              🏢 Projects ({projects.length})
            </button>
            <button onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'settings' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
              ⚙️ Site Settings
            </button>
          </div>
        </div>
        <div className="flex gap-3 text-xs">
          <Link href="/" target="_blank" className="text-white/60 hover:text-white">← Live Site</Link>
          <button onClick={() => { localStorage.removeItem('admin_token'); setToken(null); }} className="text-white/60 hover:text-white">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {[{ l: 'Total Leads', v: stats.total, bg: 'bg-white' }, { l: 'New Today', v: stats.new, bg: 'bg-green-50' }, { l: '🔥 Hot', v: stats.hot, bg: 'bg-orange-50' }, { l: 'Warm', v: stats.warm, bg: 'bg-yellow-50' }, { l: 'Cold', v: stats.cold, bg: 'bg-blue-50' }, { l: 'Site Visit', v: stats.siteVisit, bg: 'bg-purple-50' }].map((s) => (
              <div key={s.l} className={`${s.bg} rounded-xl p-3 border border-gray-200 text-center`}>
                <div className="text-xl font-bold text-brand-text">{s.v ?? '—'}</div>
                <div className="text-brand-muted text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── LEADS ── */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
              <div className="flex flex-wrap gap-1.5">
                {LEAD_TABS.map((t) => (
                  <button key={t.value} onClick={() => setLeadFilter(t.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${leadFilter === t.value ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t.label} {t.count !== undefined ? `(${t.count})` : ''}
                  </button>
                ))}
              </div>
              <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search name / mobile…"
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-56 focus:outline-none focus:border-brand-accent" />
            </div>
            {loadingLeads ? <div className="p-8 text-center text-sm text-brand-muted">Loading…</div> :
              filtered.length === 0 ? (
                <div className="p-10 text-center"><div className="text-4xl mb-3">📋</div><p className="text-brand-muted text-sm">No leads yet. Backend must be running at <code className="bg-gray-100 px-1 rounded text-xs">{API}</code></p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide text-left">
                      {['Lead', 'Contact', 'Score', 'Source', 'Budget', 'Project', 'Assigned', 'Date', ''].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {filtered.map((lead, i) => (
                        <tr key={lead._id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                          <td className="px-4 py-3"><div className="font-medium text-brand-text text-sm">{lead.name || '—'}</div><div className="text-brand-muted text-xs">{lead.buyerType || 'Unknown'}</div></td>
                          <td className="px-4 py-3"><div>{lead.mobile || '—'}</div>{lead.email && <div className="text-brand-muted text-xs truncate max-w-[120px]">{lead.email}</div>}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreColor(lead.score)}`}>{scoreLabel(lead.score)} · {lead.score}</span></td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{lead.source || 'Direct'}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{lead.budget || '—'}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs truncate max-w-[100px]">{lead.interestedProject || '—'}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{lead.assignedTo?.name || '—'}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3"><button onClick={() => setSelectedLead(lead)} className="text-brand-dark text-xs font-semibold hover:text-brand-accent">View →</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div><h2 className="font-display font-semibold text-brand-text">Projects ({projects.length})</h2>
                <p className="text-brand-muted text-xs">Manage all property listings</p></div>
              <div className="flex gap-2">
                <button onClick={() => { setCsvFile(null); setCsvResult(null); setCsvModalOpen(true); }}
                  className="bg-brand-mint border border-brand-border text-brand-dark text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-accent hover:text-white transition-all">
                  📥 Import CSV
                </button>
                <button onClick={openAdd} className="btn-primary text-sm">+ Add Project</button>
              </div>
            </div>

            {/* CSV Import Modal */}
            {csvModalOpen && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setCsvModalOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-brand-text text-lg">📥 Import Projects via CSV</h3>
                    <button onClick={() => setCsvModalOpen(false)} className="text-brand-muted hover:text-brand-dark text-2xl font-light leading-none">×</button>
                  </div>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="bg-brand-mint/30 rounded-xl p-4 border border-brand-border/40">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 bg-brand-dark text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                        <span className="font-semibold text-brand-text text-sm">Download CSV Template</span>
                      </div>
                      <p className="text-brand-muted text-xs mb-3">Download the template, fill in your project data. Use <code className="bg-white px-1 rounded">|</code> to separate multiple values (amenities, gallery URLs, etc.)</p>
                      <button onClick={downloadCsvTemplate}
                        className="bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-all">
                        ⬇️ Download Template CSV
                      </button>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white rounded-xl p-4 border border-brand-border/40">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-5 bg-brand-dark text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                        <span className="font-semibold text-brand-text text-sm">Upload Your CSV File</span>
                      </div>

                      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${csvFile ? 'border-brand-accent bg-brand-mint/20' : 'border-brand-border hover:border-brand-accent'}`}>
                        <input type="file" accept=".csv,text/csv" className="hidden"
                          onChange={(e) => { if (e.target.files?.[0]) { setCsvFile(e.target.files[0]); setCsvResult(null); } }} />
                        {csvFile ? (
                          <><div className="text-2xl mb-1">✅</div><span className="font-semibold text-brand-dark text-sm">{csvFile.name}</span><span className="text-brand-muted text-xs">{(csvFile.size / 1024).toFixed(1)} KB</span></>
                        ) : (
                          <><div className="text-3xl mb-2">📄</div><span className="text-brand-muted text-sm">Click to select CSV file</span></>
                        )}
                      </label>

                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input type="checkbox" checked={csvSkipImages} onChange={(e) => setCsvSkipImages(e.target.checked)} className="rounded" />
                        <span className="text-xs text-brand-muted">Skip image download (keep original URLs, faster import)</span>
                      </label>
                    </div>

                    {/* Results */}
                    {csvResult && (
                      <div className={`rounded-xl p-4 border text-sm ${csvResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <p className="font-semibold mb-1">{csvResult.success ? '✅' : '❌'} {csvResult.message}</p>
                        {csvResult.results?.errors?.length > 0 && (
                          <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                            {csvResult.results.errors.map((e: any, i: number) => (
                              <div key={i} className="text-xs"><span className="font-medium">{e.row}:</span> {e.error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setCsvModalOpen(false)} className="btn-outline flex-1">Cancel</button>
                    <button onClick={importCsv} disabled={!csvFile || csvImporting}
                      className="btn-primary flex-1 disabled:opacity-50">
                      {csvImporting ? '⏳ Importing…' : '🚀 Import Now'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loadingProjects ? <div className="p-8 text-center text-sm text-brand-muted">Loading…</div> :
              projects.length === 0 ? (
                <div className="p-10 text-center"><div className="text-4xl mb-3">🏢</div>
                  <p className="text-brand-muted text-sm mb-4">No projects yet. Add manually or import via CSV.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setCsvModalOpen(true)} className="btn-outline text-sm">📥 Import CSV</button>
                    <button onClick={openAdd} className="btn-primary text-sm">+ Add First Project</button>
                  </div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide text-left">
                      {['Project', 'Builder', 'Location', 'Status', 'Price', 'Units', 'Flags', 'Active', 'Actions'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {projects.map((p, i) => (
                        <tr key={p._id || i} className={`border-t border-gray-100 hover:bg-gray-50 ${p.isActive === false ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3">
                            {p.heroImage && <div className="relative w-10 h-8 rounded overflow-hidden mb-1 float-left mr-2"><Image src={p.heroImage} alt="" fill className="object-cover" /></div>}
                            <div className="font-medium text-brand-text text-sm">{p.name}</div>
                            <div className="text-brand-muted text-xs">/{p.slug}</div>
                          </td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{p.builder?.name || '—'}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{p.location || p.sector || '—'}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'New Launch' ? 'bg-green-100 text-green-700' : p.status === 'Ready To Move' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span></td>
                          <td className="px-4 py-3 text-brand-dark text-xs font-medium">{p.priceDisplay}</td>
                          <td className="px-4 py-3 text-brand-muted text-xs">{p.totalUnits || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {p.isVerified && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">✓ RERA</span>}
                              {p.isFeatured && <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded">⭐</span>}
                              {p.isNew && <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">NEW</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleActive(p)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.isActive !== false ? 'bg-brand-accent' : 'bg-gray-300'}`}>
                              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${p.isActive !== false ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Link href={`/project/${p.slug}`} target="_blank" className="text-brand-muted text-xs hover:text-brand-dark">View</Link>
                              <button onClick={() => openEdit(p)} className="text-brand-dark text-xs font-semibold hover:text-brand-accent">Edit</button>
                              <button onClick={() => deleteP(p)} className="text-red-500 text-xs font-semibold hover:text-red-700">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ── SITE SETTINGS ── */}
        {activeTab === 'settings' && siteSettings && (
          <div className="space-y-6">

            {/* Email Notifications (Hostinger SMTP) */}
            <div className="card p-5">
              <SectionHeader title="Email Notifications — Hostinger SMTP" icon="📧" />
              <p className="text-xs text-brand-muted mb-4">Jab bhi koi lead form submit kare, admin ko email aayegi. Hostinger ka SMTP use karo.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">SMTP Host</label>
                  <input className="input-field text-sm" placeholder="smtp.hostinger.com"
                    value={siteSettings.smtp?.host || 'smtp.hostinger.com'}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, host: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">SMTP Port</label>
                  <input className="input-field text-sm" placeholder="587" type="number"
                    value={siteSettings.smtp?.port || 587}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, port: parseInt(e.target.value) || 587 } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Email (Username)</label>
                  <input className="input-field text-sm" placeholder="info@yourdomain.com" type="email"
                    value={siteSettings.smtp?.user || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, user: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Password</label>
                  <input className="input-field text-sm" placeholder="Hostinger email password" type="password"
                    value={siteSettings.smtp?.pass || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, pass: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">From Email</label>
                  <input className="input-field text-sm" placeholder="info@yourdomain.com"
                    value={siteSettings.smtp?.from || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, from: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Admin Notification Email</label>
                  <input className="input-field text-sm" placeholder="your@email.com — lead alerts yahan aayenge" type="email"
                    value={siteSettings.notificationEmail || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, notificationEmail: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer">
                  <input type="checkbox" checked={siteSettings.smtp?.secure || false}
                    onChange={(e) => setSiteSettings({ ...siteSettings, smtp: { ...siteSettings.smtp, secure: e.target.checked } })}
                    className="accent-brand-accent" />
                  SSL/TLS (port 465)
                </label>
                <button onClick={testSmtp}
                  className="ml-auto text-xs bg-brand-mint text-brand-dark border border-brand-border font-semibold px-4 py-2 rounded-xl hover:bg-brand-accent hover:text-white transition-colors">
                  🔌 Test SMTP Connection
                </button>
              </div>
            </div>

            {/* WhatsApp Cloud API */}
            <div className="card p-5">
              <SectionHeader title="WhatsApp Cloud API (Meta Business)" icon="💬" />
              <p className="text-xs text-brand-muted mb-4">Lead aate hi admin ke WhatsApp pe message aayega. Meta Business Manager se credentials lo.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1 block">Phone Number ID</label>
                  <input className="input-field text-sm" placeholder="1234567890123 (Meta Business Manager se milega)"
                    value={siteSettings.whatsappCloud?.phoneNumberId || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappCloud: { ...siteSettings.whatsappCloud, phoneNumberId: e.target.value } })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1 block">Access Token (Permanent)</label>
                  <input className="input-field text-sm" placeholder="EAAxxxxxxxx... (System User token)" type="password"
                    value={siteSettings.whatsappCloud?.accessToken || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappCloud: { ...siteSettings.whatsappCloud, accessToken: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Admin WhatsApp Number</label>
                  <input className="input-field text-sm" placeholder="919999999999 (country code + number, no +)"
                    value={siteSettings.whatsappCloud?.adminNumber || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappCloud: { ...siteSettings.whatsappCloud, adminNumber: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Lead Notification Template</label>
                  <input className="input-field text-sm" placeholder="lead_notification"
                    value={siteSettings.whatsappCloud?.templateName || 'lead_notification'}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappCloud: { ...siteSettings.whatsappCloud, templateName: e.target.value } })} />
                  <p className="text-xs text-brand-muted mt-1">Jab lead aaye — admin ko alert jaata hai.</p>
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">OTP Template Name</label>
                  <input className="input-field text-sm" placeholder="otp_verification"
                    value={siteSettings.whatsappCloud?.otpTemplateName || 'otp_verification'}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappCloud: { ...siteSettings.whatsappCloud, otpTemplateName: e.target.value } })} />
                  <p className="text-xs text-brand-muted mt-1">User ko OTP is template se jaata hai.</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={testWhatsApp}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 font-semibold px-4 py-2 rounded-xl hover:bg-green-500 hover:text-white transition-colors">
                  🔌 Test WhatsApp Connection
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionHeader title="Hero Section (Home Page Banner)" icon="🖼️" />
              <p className="text-brand-muted text-xs mb-4">Ye sab kuch home page ke bade banner me show hoga. Sab kuch admin se control hoga.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">Background Image URL (hero ka main photo)</label>
                  <input className="input-field" value={siteSettings.heroImageUrl || ''} placeholder="https://images.unsplash.com/..." onChange={(e) => setSiteSettings({ ...siteSettings, heroImageUrl: e.target.value })} />
                  {siteSettings.heroImageUrl && (
                    <div className="mt-2 relative h-24 rounded-xl overflow-hidden border border-brand-border">
                      <Image src={siteSettings.heroImageUrl} alt="hero preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Tagline (chota badge text)</label>
                    <input className="input-field" value={siteSettings.heroTagline || ''} placeholder="Gurgaon's #1 Real Estate Advisory" onChange={(e) => setSiteSettings({ ...siteSettings, heroTagline: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Hero Title (bada heading)</label>
                    <input className="input-field" value={siteSettings.heroTitle || ''} placeholder="New Projects in Gurgaon 2025" onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Title Accent (highlight line, optional)</label>
                    <input className="input-field" value={siteSettings.heroTitleAccent || ''} placeholder="Luxury Homes from ₹2 Cr+" onChange={(e) => setSiteSettings({ ...siteSettings, heroTitleAccent: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">CTA Button 1 Text</label>
                    <input className="input-field" value={siteSettings.heroCTAPrimary || ''} placeholder="🏠 Book Free Site Visit" onChange={(e) => setSiteSettings({ ...siteSettings, heroCTAPrimary: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">CTA Button 2 Text</label>
                    <input className="input-field" value={siteSettings.heroCTASecondary || ''} placeholder="View New Launches →" onChange={(e) => setSiteSettings({ ...siteSettings, heroCTASecondary: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">Hero Subtitle (description text)</label>
                  <textarea rows={2} className="input-field resize-none" value={siteSettings.heroSubtitle || ''} placeholder="150+ verified new launch, pre-launch and ready-to-move properties..." onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionHeader title="Contact & Identity" icon="📞" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'siteName', label: 'Site Name' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'whatsapp', label: 'WhatsApp Number (with country code)' },
                  { key: 'email', label: 'Email' },
                  { key: 'address', label: 'Full Address' },
                  { key: 'streetAddress', label: 'Street Address (for schema)' },
                  { key: 'postalCode', label: 'Postal Code' },
                  { key: 'openingHours', label: 'Opening Hours' },
                  { key: 'geoLat', label: 'Latitude' },
                  { key: 'geoLng', label: 'Longitude' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-brand-muted mb-1">{label}</label>
                    <input className="input-field" value={siteSettings[key] || ''} onChange={(e) => setSiteSettings({ ...siteSettings, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionHeader title="SEO Defaults" icon="🔍" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">Default SEO Title (60 chars max)</label>
                  <input className="input-field" value={siteSettings.seoTitle || ''} onChange={(e) => setSiteSettings({ ...siteSettings, seoTitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">Default SEO Description</label>
                  <textarea rows={2} className="input-field resize-none" value={siteSettings.seoDescription || ''} onChange={(e) => setSiteSettings({ ...siteSettings, seoDescription: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">OG Image URL</label>
                  <input className="input-field" value={siteSettings.ogImage || ''} onChange={(e) => setSiteSettings({ ...siteSettings, ogImage: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-muted mb-1">Google Analytics GA4 ID</label>
                  <input className="input-field" value={siteSettings.ga4Id || ''} placeholder="G-XXXXXXXXXX" onChange={(e) => setSiteSettings({ ...siteSettings, ga4Id: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionHeader title="Market Stats (Hero Section)" icon="📊" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(siteSettings.marketStats || {}).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-brand-muted mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input className="input-field" value={String(val || '')} onChange={(e) => setSiteSettings({ ...siteSettings, marketStats: { ...siteSettings.marketStats, [key]: e.target.value } })} />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionHeader title="Social Media Links" icon="🔗" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['facebook', 'instagram', 'youtube', 'linkedin', 'twitter'].map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-brand-muted mb-1 capitalize">{key}</label>
                    <input className="input-field" value={siteSettings.social?.[key] || ''} onChange={(e) => setSiteSettings({ ...siteSettings, social: { ...siteSettings.social, [key]: e.target.value } })} />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Testimonials" icon="⭐" />
                <button onClick={() => setSiteSettings({ ...siteSettings, testimonials: [...(siteSettings.testimonials || []), { name: '', city: '', role: '', review: '', rating: 5, avatar: '', project: '' }] })}
                  className="btn-primary text-xs py-1.5 px-3">+ Add</button>
              </div>
              <div className="space-y-4">
                {(siteSettings.testimonials || []).map((t: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                    <button onClick={() => setSiteSettings({ ...siteSettings, testimonials: siteSettings.testimonials.filter((_: any, idx: number) => idx !== i) })}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                    <div className="grid grid-cols-2 gap-3">
                      {['name', 'city', 'role', 'project', 'avatar'].map((key) => (
                        <div key={key}>
                          <label className="block text-xs text-brand-muted mb-0.5 capitalize">{key}</label>
                          <input className="input-field text-sm py-1.5" value={t[key] || ''} onChange={(e) => { const ts = [...siteSettings.testimonials]; ts[i] = { ...ts[i], [key]: e.target.value }; setSiteSettings({ ...siteSettings, testimonials: ts }); }} />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs text-brand-muted mb-0.5">Rating (1–5)</label>
                        <input type="number" min={1} max={5} className="input-field text-sm py-1.5" value={t.rating || 5} onChange={(e) => { const ts = [...siteSettings.testimonials]; ts[i] = { ...ts[i], rating: Number(e.target.value) }; setSiteSettings({ ...siteSettings, testimonials: ts }); }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-brand-muted mb-0.5">Review</label>
                      <textarea rows={2} className="input-field resize-none text-sm" value={t.review || ''} onChange={(e) => { const ts = [...siteSettings.testimonials]; ts[i] = { ...ts[i], review: e.target.value }; setSiteSettings({ ...siteSettings, testimonials: ts }); }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Location Cards (Homepage)" icon="📍" />
                <button onClick={() => setSiteSettings({ ...siteSettings, locations: [...(siteSettings.locations || []), { name: '', projects: '10+', icon: '🏙️', href: '/', highlight: 'Popular', img: '', color: 'from-blue-900/80' }] })}
                  className="btn-primary text-xs py-1.5 px-3">+ Add</button>
              </div>
              <div className="space-y-4">
                {(siteSettings.locations || []).map((loc: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                    <button onClick={() => setSiteSettings({ ...siteSettings, locations: siteSettings.locations.filter((_: any, idx: number) => idx !== i) })}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[{ k: 'name', l: 'Name' }, { k: 'projects', l: 'Projects Count' }, { k: 'icon', l: 'Icon (emoji)' }, { k: 'href', l: 'Link (/path)' }, { k: 'highlight', l: 'Highlight Tag' }, { k: 'img', l: 'Image URL' }, { k: 'color', l: 'Gradient Class' }].map(({ k, l }) => (
                        <div key={k}>
                          <label className="block text-xs text-brand-muted mb-0.5">{l}</label>
                          <input className="input-field text-sm py-1.5" value={loc[k] || ''} onChange={(e) => { const ls = [...siteSettings.locations]; ls[i] = { ...ls[i], [k]: e.target.value }; setSiteSettings({ ...siteSettings, locations: ls }); }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Builders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Builder Logos" icon="🏗️" />
                <button onClick={() => setSiteSettings({ ...siteSettings, builders: [...(siteSettings.builders || []), { name: '', img: '', website: '' }] })}
                  className="btn-primary text-xs py-1.5 px-3">+ Add</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(siteSettings.builders || []).map((b: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 relative">
                    <button onClick={() => setSiteSettings({ ...siteSettings, builders: siteSettings.builders.filter((_: any, idx: number) => idx !== i) })}
                      className="absolute top-2 right-2 text-red-400 text-sm font-bold">×</button>
                    {['name', 'img', 'website'].map((k) => (
                      <div key={k} className="mb-1">
                        <label className="block text-xs text-brand-muted mb-0.5 capitalize">{k}</label>
                        <input className="input-field text-xs py-1" value={b[k] || ''} onChange={(e) => { const bs = [...siteSettings.builders]; bs[i] = { ...bs[i], [k]: e.target.value }; setSiteSettings({ ...siteSettings, builders: bs }); }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Site-wide FAQs (Homepage)" icon="❓" />
                <button onClick={() => setSiteSettings({ ...siteSettings, faqs: [...(siteSettings.faqs || []), { q: '', a: '' }] })}
                  className="btn-primary text-xs py-1.5 px-3">+ Add</button>
              </div>
              <div className="space-y-3">
                {(siteSettings.faqs || []).map((faq: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                    <button onClick={() => setSiteSettings({ ...siteSettings, faqs: siteSettings.faqs.filter((_: any, idx: number) => idx !== i) })}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                    <div>
                      <label className="block text-xs text-brand-muted mb-0.5">Question</label>
                      <input className="input-field text-sm mb-2" value={faq.q || ''} onChange={(e) => { const fs = [...siteSettings.faqs]; fs[i] = { ...fs[i], q: e.target.value }; setSiteSettings({ ...siteSettings, faqs: fs }); }} />
                      <label className="block text-xs text-brand-muted mb-0.5">Answer</label>
                      <textarea rows={2} className="input-field resize-none text-sm" value={faq.a || ''} onChange={(e) => { const fs = [...siteSettings.faqs]; fs[i] = { ...fs[i], a: e.target.value }; setSiteSettings({ ...siteSettings, faqs: fs }); }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pb-6">
              <button onClick={saveSiteSettings} disabled={settingsSaving}
                className="btn-primary min-w-[160px] disabled:opacity-50">
                {settingsSaving ? '⏳ Saving…' : '✓ Save All Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── LEAD DRAWER ── */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-brand-dark text-white p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-bold text-lg">{selectedLead.name || 'Unknown'}</h2>
                <button onClick={() => setSelectedLead(null)} className="text-white/70 hover:text-white text-2xl">×</button>
              </div>
              <span className={`badge text-xs ${scoreColor(selectedLead.score)}`}>{scoreLabel(selectedLead.score)} · {selectedLead.score} pts</span>
            </div>
            <div className="p-5 space-y-3">
              {[['Mobile', selectedLead.mobile], ['Email', selectedLead.email || '—'], ['Budget', selectedLead.budget || '—'], ['Buyer Type', selectedLead.buyerType || '—'], ['Project Interest', selectedLead.interestedProject || '—'], ['Source', selectedLead.source || 'Direct'], ['Assigned', selectedLead.assignedTo?.name || 'Unassigned'], ['Created', new Date(selectedLead.createdAt).toLocaleString('en-IN')]].map(([l, v]) => (
                <div key={l} className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-brand-muted text-sm">{l}</span>
                  <span className="text-brand-text text-sm font-medium text-right max-w-[55%]">{v}</span>
                </div>
              ))}
              <div className="pt-3 space-y-2">
                <a href={`tel:${selectedLead.mobile || ''}`} className="btn-primary w-full text-center block">📞 Call Lead</a>
                <a href={`https://wa.me/91${(selectedLead.mobile || '').replace(/\D/g, '')}?text=Hi ${selectedLead.name || 'there'}, this is GurgaonRealty. Following up on your property enquiry.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-green-600 transition-colors">
                  💬 WhatsApp Lead
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT FORM MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center px-2 py-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
              <div>
                <h2 className="font-display font-bold text-lg">{modalMode === 'add' ? '+ Add New Project' : `✏️ Edit: ${form.name}`}</h2>
                <p className="text-white/60 text-xs">Fill all sections for best SEO results</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white text-2xl ml-4">×</button>
            </div>

            {/* Section Nav */}
            <div className="border-b border-gray-100 px-6 py-2 flex gap-1 overflow-x-auto">
              {FORM_SECTIONS.map((s) => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark hover:bg-brand-mint'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">

              {/* ── BASIC INFO ── */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <SectionHeader title="Basic Information" icon="📋" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-brand-muted mb-1">Project Name *</label>
                      <input className="input-field" value={form.name}
                        onChange={(e) => { const name = e.target.value; setF('name', name); if (modalMode === 'add') setF('slug', autoSlug(name)); }}
                        placeholder="e.g. Sobha Altus" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">URL Slug * (auto-generated)</label>
                      <input className="input-field font-mono text-sm" value={form.slug}
                        onChange={(e) => setF('slug', e.target.value)} placeholder="sobha-altus-sector-106-gurgaon" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Status</label>
                      <select className="select-field" value={form.status} onChange={(e) => setF('status', e.target.value)}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Builder Name *</label>
                      <input className="input-field" value={form.builder.name}
                        onChange={(e) => setBuilder('name', e.target.value)} placeholder="e.g. Sobha Limited" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Builder Website</label>
                      <input className="input-field" value={form.builder.website || ''}
                        onChange={(e) => setBuilder('website', e.target.value)} placeholder="https://sobhaltd.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Builder RERA ID</label>
                      <input className="input-field" value={form.builder.reraId || ''}
                        onChange={(e) => setBuilder('reraId', e.target.value)} placeholder="HRERA-PKL-XXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-brand-muted mb-1">Full Location Address *</label>
                      <input className="input-field" value={form.location}
                        onChange={(e) => setF('location', e.target.value)} placeholder="e.g. Sector 106, Dwarka Expressway, Gurgaon" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Sector</label>
                      <input className="input-field" value={form.sector}
                        onChange={(e) => setF('sector', e.target.value)} placeholder="Sector 106" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Corridor / Area</label>
                      <select className="select-field" value={form.corridor} onChange={(e) => setF('corridor', e.target.value)}>
                        <option value="">-- Select Corridor --</option>
                        {CORRIDORS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Pincode</label>
                      <input className="input-field" value={form.pincode}
                        onChange={(e) => setF('pincode', e.target.value)} placeholder="122001" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Google Maps URL</label>
                      <input className="input-field" value={form.googleMapsUrl}
                        onChange={(e) => setF('googleMapsUrl', e.target.value)} placeholder="https://goo.gl/maps/..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Short Description (shown on card)</label>
                    <input className="input-field" value={form.shortDescription}
                      onChange={(e) => setF('shortDescription', e.target.value)} placeholder="One-line headline description" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Full Description (shown on project page)</label>
                    <textarea rows={4} className="input-field resize-none" value={form.description}
                      onChange={(e) => setF('description', e.target.value)} placeholder="Detailed 2-3 paragraph description of the project..." />
                  </div>
                </div>
              )}

              {/* ── PRICING ── */}
              {activeSection === 'pricing' && (
                <div className="space-y-4">
                  <SectionHeader title="Pricing & Configurations" icon="💰" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-brand-muted mb-1">Price Display String</label>
                      <input className="input-field" value={form.priceDisplay}
                        onChange={(e) => setF('priceDisplay', e.target.value)} placeholder="₹1.2 Cr – ₹3.5 Cr" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Price Per Sqft</label>
                      <input className="input-field" value={form.pricePerSqft}
                        onChange={(e) => setF('pricePerSqft', e.target.value)} placeholder="₹8,500 – ₹9,800" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Possession Date</label>
                      <input className="input-field" value={form.possession}
                        onChange={(e) => setF('possession', e.target.value)} placeholder="Dec 2027 / Ready" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Min Price (Lakhs, for filtering)</label>
                      <input type="number" className="input-field" value={form.priceMin}
                        onChange={(e) => setF('priceMin', e.target.value)} placeholder="120" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Max Price (Lakhs, for filtering)</label>
                      <input type="number" className="input-field" value={form.priceMax}
                        onChange={(e) => setF('priceMax', e.target.value)} placeholder="350" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Expected Appreciation (3Y)</label>
                      <input className="input-field" value={form.appreciationRate}
                        onChange={(e) => setF('appreciationRate', e.target.value)} placeholder="30–40% (3Y)" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Expected Rental Yield</label>
                      <input className="input-field" value={form.rentalYield}
                        onChange={(e) => setF('rentalYield', e.target.value)} placeholder="3.5%" />
                    </div>
                    <label className="flex items-center gap-2 col-span-2 cursor-pointer">
                      <input type="checkbox" checked={form.priceOnRequest}
                        onChange={(e) => setF('priceOnRequest', e.target.checked)} className="w-4 h-4 rounded accent-brand-dark" />
                      <span className="text-sm text-brand-muted">Price on Request (hide price, show enquiry only)</span>
                    </label>
                  </div>
                  <ListInput label="Configurations (e.g. 3 BHK (1,680 sqft))"
                    items={form.configurations} placeholder="3 BHK (1,680 sqft)"
                    onAdd={(v) => setF('configurations', [...form.configurations, v])}
                    onRemove={(i) => setF('configurations', form.configurations.filter((_, idx) => idx !== i))} />
                </div>
              )}

              {/* ── DETAILS ── */}
              {activeSection === 'details' && (
                <div className="space-y-4">
                  <SectionHeader title="Project Details" icon="🏢" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Total Units</label>
                      <input type="number" className="input-field" value={form.totalUnits}
                        onChange={(e) => setF('totalUnits', e.target.value)} placeholder="500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Total Towers</label>
                      <input type="number" className="input-field" value={form.totalTowers}
                        onChange={(e) => setF('totalTowers', e.target.value)} placeholder="5" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Total Area</label>
                      <input className="input-field" value={form.totalArea}
                        onChange={(e) => setF('totalArea', e.target.value)} placeholder="15 Acres" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">Floors</label>
                      <input className="input-field" value={form.floors}
                        onChange={(e) => setF('floors', e.target.value)} placeholder="G+38" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">RERA Number *</label>
                      <input className="input-field font-mono text-sm" value={form.rera.number}
                        onChange={(e) => setRera('number', e.target.value)} placeholder="RERA/GGM/2024/XXX" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">RERA Link</label>
                      <input className="input-field text-sm" value={form.rera.link || ''}
                        onChange={(e) => setRera('link', e.target.value)} placeholder="https://haryanarera.gov.in/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1">RERA Expiry Date</label>
                      <input className="input-field" value={form.rera.expiryDate || ''}
                        onChange={(e) => setRera('expiryDate', e.target.value)} placeholder="Dec 2029" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── IMAGES ── */}
              {activeSection === 'images' && (
                <div className="space-y-6">
                  <SectionHeader title="Images" icon="🖼️" />
                  <ImageUploader label="Hero Image (main project photo)" value={form.heroImage}
                    onChange={(v) => setF('heroImage', v as string)} token={token!} />
                  <ImageUploader label="Gallery Images (project exterior & interior — max 10)" value={form.gallery}
                    onChange={(v) => setF('gallery', v)} token={token!} multiple maxFiles={10} />
                  <ImageUploader label="Amenity Images (pool, gym, clubhouse — max 6)" value={form.amenityImages}
                    onChange={(v) => setF('amenityImages', v)} token={token!} multiple maxFiles={6} />
                  <ImageUploader label="Floor Plan Images (PDF screenshot or image)" value={form.floorPlanImages}
                    onChange={(v) => setF('floorPlanImages', v)} token={token!} multiple maxFiles={6} />
                </div>
              )}

              {/* ── LISTS / CONTENT ── */}
              {activeSection === 'lists' && (
                <div className="space-y-5">
                  <SectionHeader title="Content Lists" icon="📝" />
                  <ListInput label="Project Highlights (key selling points)"
                    items={form.highlights} placeholder="e.g. Sobha quality construction — in-house, no outsourcing"
                    onAdd={(v) => setF('highlights', [...form.highlights, v])}
                    onRemove={(i) => setF('highlights', form.highlights.filter((_, idx) => idx !== i))} />
                  <ListInput label="Why Buy Here (investment reasons)"
                    items={form.whyBuy} placeholder="e.g. Airport zone — 5 min to IGI"
                    onAdd={(v) => setF('whyBuy', [...form.whyBuy, v])}
                    onRemove={(i) => setF('whyBuy', form.whyBuy.filter((_, idx) => idx !== i))} />
                  <ListInput label="Amenities (facilities in the project)"
                    items={form.amenities} placeholder="e.g. Clubhouse (50,000 sqft)"
                    onAdd={(v) => setF('amenities', [...form.amenities, v])}
                    onRemove={(i) => setF('amenities', form.amenities.filter((_, idx) => idx !== i))} />
                  <ListInput label="Connectivity (distances to key landmarks)"
                    items={form.connectivity} placeholder="e.g. IGI Airport — 15 minutes"
                    onAdd={(v) => setF('connectivity', [...form.connectivity, v])}
                    onRemove={(i) => setF('connectivity', form.connectivity.filter((_, idx) => idx !== i))} />
                  <ListInput label="Nearby Landmarks (schools, hospitals, malls)"
                    items={form.nearbyLandmarks} placeholder="e.g. DPS Dwarka — 8 km"
                    onAdd={(v) => setF('nearbyLandmarks', [...form.nearbyLandmarks, v])}
                    onRemove={(i) => setF('nearbyLandmarks', form.nearbyLandmarks.filter((_, idx) => idx !== i))} />
                  <ListInput label="Tags (for search filtering)"
                    items={form.tags} placeholder="e.g. luxury, new-launch, dwarka-expressway"
                    onAdd={(v) => setF('tags', [...form.tags, v])}
                    onRemove={(i) => setF('tags', form.tags.filter((_, idx) => idx !== i))} />
                </div>
              )}

              {/* ── FLOOR PLANS ── */}
              {activeSection === 'floorplans' && (
                <div className="space-y-4">
                  <SectionHeader title="Floor Plans & Price Table" icon="📐" />
                  <p className="text-brand-muted text-xs">This shows as a price table on the project detail page. Add one row per configuration.</p>
                  <FloorPlansInput plans={form.floorPlans} onChange={(v) => setF('floorPlans', v)} />
                </div>
              )}

              {/* ── FAQs ── */}
              {activeSection === 'faqs' && (
                <div className="space-y-4">
                  <SectionHeader title="Frequently Asked Questions" icon="❓" />
                  <p className="text-brand-muted text-xs">FAQs appear on the project detail page and generate FAQ rich snippets in Google Search. Add buyer-intent questions.</p>
                  <FAQInput faqs={form.faqs} onChange={(v) => setF('faqs', v)} />
                </div>
              )}

              {/* ── SEO ── */}
              {activeSection === 'seo' && (
                <div className="space-y-4">
                  <SectionHeader title="SEO Settings" icon="🔍" />
                  <p className="text-brand-muted text-xs">Leave blank to auto-generate from project name and location.</p>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Meta Title (max 60 chars)</label>
                    <input className="input-field" value={form.metaTitle} onChange={(e) => setF('metaTitle', e.target.value)}
                      placeholder={`${form.name} — Price, Floor Plans & Details | GurgaonRealty`} />
                    <p className="text-brand-muted text-xs mt-1">{(form.metaTitle || '').length}/60</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Meta Description (max 155 chars)</label>
                    <textarea rows={2} className="input-field resize-none" value={form.metaDescription}
                      onChange={(e) => setF('metaDescription', e.target.value)}
                      placeholder={`${form.name} by ${form.builder.name || '[Builder]'} in ${form.location || '[Location]'}. ${form.priceDisplay || 'Price on request'}. Get floor plans, brochure & free site visit.`} />
                    <p className="text-brand-muted text-xs mt-1">{(form.metaDescription || '').length}/155</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1">Meta Keywords (comma separated)</label>
                    <input className="input-field" value={form.metaKeywords} onChange={(e) => setF('metaKeywords', e.target.value)}
                      placeholder={`${form.name?.toLowerCase()}, ${form.builder.name?.toLowerCase()} gurgaon, ${form.sector?.toLowerCase()} gurgaon property`} />
                  </div>
                </div>
              )}

              {/* ── SETTINGS ── */}
              {activeSection === 'settings' && (
                <div className="space-y-4">
                  <SectionHeader title="Project Settings & Flags" icon="⚙️" />
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'isVerified', label: '✅ RERA Verified', desc: 'Show verified badge on project card' },
                      { key: 'isFeatured', label: '⭐ Featured on Homepage', desc: 'Show in featured projects section' },
                      { key: 'isNew', label: '🔴 New Launch Badge', desc: 'Show NEW badge on project card' },
                      { key: 'isActive', label: '👁️ Active (visible on site)', desc: 'Uncheck to hide from website' },
                      { key: 'isCommercial', label: '🏬 Commercial Project', desc: 'Tag as commercial property' },
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-start gap-3 p-4 rounded-xl border border-brand-border/40 cursor-pointer hover:bg-brand-mint/20 transition-colors col-span-1">
                        <input type="checkbox" checked={!!(form as any)[key]}
                          onChange={(e) => setF(key as keyof ProjectForm, e.target.checked)}
                          className="w-4 h-4 rounded accent-brand-dark mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-brand-text">{label}</div>
                          <div className="text-brand-muted text-xs mt-0.5">{desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
              <div className="flex gap-2">
                {FORM_SECTIONS.map((s, i) => (
                  <button key={s.id} onClick={() => setActiveSection(s.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeSection === s.id ? 'bg-brand-dark scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="btn-outline text-sm">Cancel</button>
                <button onClick={save} disabled={saving || !form.name || !form.slug}
                  className="btn-primary text-sm disabled:opacity-50 min-w-[120px]">
                  {saving ? '⏳ Saving…' : modalMode === 'add' ? '+ Add Project' : '✓ Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
