'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAdmin, API } from '../_context';
import {
  Card, PageHeader, Btn, Badge, Modal, Field, Input, Select,
  ListInput, ImageUploader, FloorPlansInput, FAQInput, Toast,
} from '../_components/shared';

const DEFAULT_CORRIDORS = ['Alwar Bypass Road', 'NH-48 Highway', 'Bhiwadi Extension', 'Tapukara', 'Khushkhera', 'Neemrana', 'Chopanki', 'RIICO Industrial Area'];
const STATUSES = ['New Launch', 'Pre Launch', 'Under Construction', 'Ready To Move'];
const SECTIONS = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'price', label: 'Pricing' },
  { key: 'details', label: 'Details' },
  { key: 'media', label: 'Media' },
  { key: 'features', label: 'Features' },
  { key: 'seo', label: 'SEO & FAQs' },
];

const autoSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const EMPTY: any = {
  name: '', slug: '', builder: { name: '', logo: '', website: '', reraId: '' },
  location: '', sector: '', corridor: 'Alwar Bypass Road', pincode: '', googleMapsUrl: '',
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

export default function ProjectsPage() {
  const { authH, token } = useAdmin();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [corridorFilter, setCorridorFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [corridors, setCorridors] = useState<{ name: string; slug: string; city?: string }[]>([]);
  const [newCorridorName, setNewCorridorName] = useState('');
  const [newCorridorIcon, setNewCorridorIcon] = useState('🛣️');
  const [newCorridorCity, setNewCorridorCity] = useState('Bhiwadi');
  const [corridorModalOpen, setCorridorModalOpen] = useState(false);
  const [corridorSaving, setCorridorSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const r = await fetch(`${API}/admin/projects`, { headers: authH() });
    const d = await r.json();
    if (d.success) setProjects(d.data || []);
    setLoading(false);
  }, [token, authH]);

  const loadCorridors = useCallback(async () => {
    try {
      const r = await fetch(`${API}/settings/corridors`);
      const d = await r.json();
      if (d.success) setCorridors(d.data || []);
      else setCorridors(DEFAULT_CORRIDORS.map(n => ({ name: n, slug: n.toLowerCase().replace(/\s+/g, '-') })));
    } catch { setCorridors(DEFAULT_CORRIDORS.map(n => ({ name: n, slug: n.toLowerCase().replace(/\s+/g, '-') }))); }
  }, []);

  const addCorridor = async () => {
    if (!newCorridorName.trim()) return;
    setCorridorSaving(true);
    try {
      const r = await fetch(`${API}/settings/corridors`, {
        method: 'POST', headers: authH(), body: JSON.stringify({ name: newCorridorName.trim(), icon: newCorridorIcon, city: newCorridorCity }),
      });
      const d = await r.json();
      if (d.success) {
        setCorridors(d.data);
        f('corridor', newCorridorName.trim()); // auto-select the new corridor in form
        setNewCorridorName('');
        setNewCorridorIcon('🛣️');
        setNewCorridorCity('Bhiwadi');
        setToast({ msg: 'Corridor added!', type: 'success' });
      } else setToast({ msg: d.message || 'Failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setCorridorSaving(false); }
  };

  const deleteCorridor = async (slug: string) => {
    if (!confirm('Delete this corridor? Projects using it won\'t be deleted.')) return;
    const deletedName = corridors.find(c => c.slug === slug)?.name;
    try {
      const r = await fetch(`${API}/settings/corridors/${slug}`, { method: 'DELETE', headers: authH() });
      const d = await r.json();
      if (d.success) {
        setCorridors(d.data);
        if (deletedName && form.corridor === deletedName) f('corridor', 'Alwar Bypass Road');
        setToast({ msg: 'Corridor deleted', type: 'success' });
      } else setToast({ msg: d.message || 'Failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
  };

  useEffect(() => { load(); loadCorridors(); }, [load, loadCorridors]);

  const allCorridorNames = corridors.length ? corridors.map(c => c.name) : DEFAULT_CORRIDORS;

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.builder?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCorridor = corridorFilter === 'all' || p.corridor === corridorFilter;
    return matchSearch && matchCorridor;
  });

  const openAdd = () => { setMode('add'); setForm({ ...EMPTY }); setActiveSection('basic'); setModalOpen(true); };
  const openEdit = (p: any) => { setMode('edit'); setForm({ ...p }); setActiveSection('basic'); setModalOpen(true); };

  const save = async () => {
    if (!form.name || !form.slug) return setToast({ msg: 'Name and Slug required', type: 'error' });
    setSaving(true);
    try {
      const url = mode === 'edit' ? `${API}/admin/projects/${form._id}` : `${API}/admin/projects`;
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: authH(), body: JSON.stringify(form) });
      const d = await r.json();
      if (d.success) {
        await load();
        setModalOpen(false);
        setToast({ msg: `Project ${mode === 'edit' ? 'updated' : 'created'}!`, type: 'success' });
      } else setToast({ msg: d.message || 'Save failed', type: 'error' });
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const r = await fetch(`${API}/admin/projects/${id}`, { method: 'DELETE', headers: authH() });
    const d = await r.json();
    if (d.success) { setProjects(prev => prev.filter(p => p._id !== id)); setToast({ msg: 'Deleted', type: 'success' }); }
  };

  const toggleField = async (id: string, field: string, val: boolean) => {
    const r = await fetch(`${API}/admin/projects/${id}`, {
      method: 'PATCH', headers: authH(), body: JSON.stringify({ [field]: val }),
    });
    const d = await r.json();
    if (d.success) setProjects(prev => prev.map(p => p._id === id ? { ...p, [field]: val } : p));
  };

  const importCsv = async () => {
    if (!csvFile) return;
    setCsvImporting(true);
    const fd = new FormData();
    fd.append('file', csvFile);
    const r = await fetch(`${API}/admin/projects/import-csv`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
    });
    const d = await r.json();
    setCsvResult(d);
    if (d.success) await load();
    setCsvImporting(false);
  };

  const f = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));
  const fb = (key: string, val: any) => setForm((p: any) => ({ ...p, builder: { ...p.builder, [key]: val } }));
  const fr = (key: string, val: any) => setForm((p: any) => ({ ...p, rera: { ...p.rera, [key]: val } }));

  const toggleTag = (config: string) => {
    const cfgs = form.configurations || [];
    f('configurations', cfgs.includes(config) ? cfgs.filter((c: string) => c !== config) : [...cfgs, config]);
  };

  const BHKS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse', 'Studio', 'Plot', 'Villa', 'Duplex', 'Shop', 'Office'];

  const statusColor: Record<string, string> = {
    'New Launch': 'blue', 'Pre Launch': 'purple', 'Under Construction': 'orange', 'Ready To Move': 'green',
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl">
      <PageHeader title="Projects" subtitle={`${projects.length} total projects`}
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" onClick={() => setCsvModalOpen(true)}>📤 Import CSV</Btn>
            <Btn onClick={openAdd}>+ Add Project</Btn>
          </div>
        } />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search project or builder…"
          className="flex-1 min-w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 shadow-sm" />
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setCorridorFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${corridorFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            All
          </button>
          {allCorridorNames.slice(0, 6).map(c => (
            <button key={c} onClick={() => setCorridorFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${corridorFilter === c ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {c.replace('Expressway', 'Exp.').replace('Extension', 'Ext.')}
            </button>
          ))}
          <button onClick={() => setCorridorModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all whitespace-nowrap">
            ⚙️ Corridors
          </button>
        </div>
        <p className="text-xs text-slate-400 ml-auto">{filtered.length} shown</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-slate-200 animate-pulse h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><p className="text-center text-slate-400 py-16">No projects found</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div key={project._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Hero image */}
              <div className="relative h-36 bg-slate-100">
                {project.heroImage ? (
                  <Image src={project.heroImage} alt={project.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">🏗️</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge color={statusColor[project.status] || 'slate'}>{project.status}</Badge>
                  {project.isFeatured && <Badge color="purple">Featured</Badge>}
                </div>
                {!project.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded-lg">INACTIVE</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900 truncate">{project.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{project.builder?.name} · {project.corridor}</p>
                <p className="text-sm font-semibold text-emerald-600 mt-1">{project.priceDisplay || '—'}</p>
                {project.configurations?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.configurations.slice(0, 4).map((c: string, i: number) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                )}

                {/* Toggle switches */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                  {[
                    { key: 'isActive', label: 'Active' },
                    { key: 'isFeatured', label: 'Featured' },
                    { key: 'isVerified', label: 'Verified' },
                  ].map(toggle => (
                    <label key={toggle.key} className="flex items-center gap-1 cursor-pointer">
                      <div className={`relative w-7 h-4 rounded-full transition-colors ${project[toggle.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        onClick={() => toggleField(project._id, toggle.key, !project[toggle.key])}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${project[toggle.key] ? 'translate-x-3' : ''}`} />
                      </div>
                      <span className="text-[10px] text-slate-500">{toggle.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <Btn size="sm" variant="secondary" onClick={() => openEdit(project)} className="flex-1 justify-center">Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteProject(project._id)}>Delete</Btn>
                  <a href={`/project/${project.slug}`} target="_blank"
                    className="flex items-center justify-center px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-colors text-xs">
                    🔗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={mode === 'add' ? 'Add New Project' : `Edit: ${form.name}`}
        width="max-w-4xl">
        {/* Section tabs */}
        <div className="flex gap-1 flex-wrap border-b border-slate-100 pb-3 mb-5 -mx-1">
          {SECTIONS.map(sec => (
            <button key={sec.key} onClick={() => setActiveSection(sec.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSection === sec.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {sec.label}
            </button>
          ))}
        </div>

        <div className="max-h-[65vh] overflow-y-auto pr-1 space-y-4">
          {/* BASIC */}
          {activeSection === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Project Name *">
                  <Input value={form.name} onChange={(v) => { f('name', v); if (mode === 'add') f('slug', autoSlug(v)); }} placeholder="Godrej Meridien" />
                </Field>
                <Field label="URL Slug *">
                  <Input value={form.slug} onChange={(v) => f('slug', v)} placeholder="godrej-meridien" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Builder Name">
                  <Input value={form.builder?.name || ''} onChange={(v) => fb('name', v)} placeholder="Godrej Properties" />
                </Field>
                <Field label="Builder RERA ID">
                  <Input value={form.builder?.reraId || ''} onChange={(v) => fb('reraId', v)} placeholder="HRERA/..." />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Corridor">
                  <div className="space-y-2">
                    {/* Select + delete btn */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select value={form.corridor} onChange={(v) => f('corridor', v)}
                          options={allCorridorNames.map(c => ({ value: c, label: c }))} />
                      </div>
                      <button type="button"
                        onClick={() => {
                          const slug = corridors.find(c => c.name === form.corridor)?.slug;
                          if (slug) deleteCorridor(slug);
                        }}
                        title={`Delete "${form.corridor}"`}
                        className="px-2.5 py-2 bg-red-50 text-red-500 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-sm shrink-0">
                        🗑️
                      </button>
                    </div>
                    {/* Inline add new corridor */}
                    <div className="flex gap-1.5 flex-wrap">
                      <input type="text" value={newCorridorName} onChange={e => setNewCorridorName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCorridor()}
                        placeholder="New corridor name…"
                        className="flex-1 text-xs px-3 py-2 border border-dashed border-emerald-300 rounded-xl bg-emerald-50/30 focus:outline-none focus:border-emerald-500 placeholder:text-slate-400 min-w-0" />
                      <select value={newCorridorCity} onChange={e => setNewCorridorCity(e.target.value)}
                        className="text-xs px-2 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 shrink-0">
                        <option value="Bhiwadi">Bhiwadi</option>
                        <option value="Neemrana">Neemrana</option>
                        <option value="Tapukara">Tapukara</option>
                        <option value="Alwar">Alwar</option>
                        <option value="NCR">NCR</option>
                      </select>
                      <input type="text" value={newCorridorIcon} onChange={e => setNewCorridorIcon(e.target.value)}
                        className="w-9 text-center text-base border border-slate-200 rounded-xl bg-white shrink-0" />
                      <button type="button" onClick={addCorridor} disabled={corridorSaving || !newCorridorName.trim()}
                        className="px-2.5 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-40 transition-colors shrink-0">
                        {corridorSaving ? '…' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onChange={(v) => f('status', v)}
                    options={STATUSES.map(s => ({ value: s, label: s }))} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Sector">
                  <Input value={form.sector} onChange={(v) => f('sector', v)} placeholder="Sector 79" />
                </Field>
                <Field label="Location">
                  <Input value={form.location} onChange={(v) => f('location', v)} placeholder="Near Hero Honda Chowk" />
                </Field>
                <Field label="Pincode">
                  <Input value={form.pincode} onChange={(v) => f('pincode', v)} placeholder="122004" />
                </Field>
              </div>
              <Field label="Google Maps URL">
                <Input value={form.googleMapsUrl} onChange={(v) => f('googleMapsUrl', v)} placeholder="https://maps.google.com/..." />
              </Field>
              <Field label="Short Description (shown in cards)">
                <Input value={form.shortDescription} onChange={(v) => f('shortDescription', v)} placeholder="Premium 3 & 4 BHK apartments..." rows={2} />
              </Field>
              <Field label="Full Description">
                <Input value={form.description} onChange={(v) => f('description', v)} placeholder="Detailed project description..." rows={5} />
              </Field>
              <div className="flex gap-6 flex-wrap">
                {[
                  { key: 'isActive', label: 'Active (Show on site)' },
                  { key: 'isVerified', label: 'RERA Verified' },
                  { key: 'isFeatured', label: 'Featured' },
                  { key: 'isNew', label: 'New Badge' },
                  { key: 'isCommercial', label: 'Commercial' },
                ].map(toggle => (
                  <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[toggle.key]} onChange={(e) => f(toggle.key, e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500" />
                    <span className="text-sm text-slate-700">{toggle.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* PRICE */}
          {activeSection === 'price' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price Display (shown to users)">
                  <Input value={form.priceDisplay} onChange={(v) => f('priceDisplay', v)} placeholder="₹1.2 Cr - ₹3.5 Cr" />
                </Field>
                <Field label="Price Per Sqft">
                  <Input value={form.pricePerSqft} onChange={(v) => f('pricePerSqft', v)} placeholder="₹8,500/sqft" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Min Price (in Lakhs, for filter)">
                  <Input value={form.priceMin} onChange={(v) => f('priceMin', v)} placeholder="120" />
                </Field>
                <Field label="Max Price (in Lakhs, for filter)">
                  <Input value={form.priceMax} onChange={(v) => f('priceMax', v)} placeholder="350" />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.priceOnRequest} onChange={(e) => f('priceOnRequest', e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500" />
                <span className="text-sm text-slate-700">Price on Request</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">BHK / Configurations</label>
                <div className="flex flex-wrap gap-2">
                  {BHKS.map(bhk => (
                    <button key={bhk} type="button" onClick={() => toggleTag(bhk)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        (form.configurations || []).includes(bhk)
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}>
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              <FloorPlansInput plans={form.floorPlans || []} onChange={(v) => f('floorPlans', v)} />
            </>
          )}

          {/* DETAILS */}
          {activeSection === 'details' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Possession Date">
                  <Input value={form.possession} onChange={(v) => f('possession', v)} placeholder="Dec 2026" />
                </Field>
                <Field label="Total Units">
                  <Input value={form.totalUnits} onChange={(v) => f('totalUnits', v)} placeholder="450" />
                </Field>
                <Field label="Total Towers">
                  <Input value={form.totalTowers} onChange={(v) => f('totalTowers', v)} placeholder="6" />
                </Field>
                <Field label="Total Area (acres)">
                  <Input value={form.totalArea} onChange={(v) => f('totalArea', v)} placeholder="25 acres" />
                </Field>
                <Field label="Floors">
                  <Input value={form.floors} onChange={(v) => f('floors', v)} placeholder="30" />
                </Field>
                <Field label="Appreciation Rate">
                  <Input value={form.appreciationRate} onChange={(v) => f('appreciationRate', v)} placeholder="12% YoY" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="RERA Number">
                  <Input value={form.rera?.number || ''} onChange={(v) => fr('number', v)} placeholder="HRERA/..." />
                </Field>
                <Field label="RERA Expiry">
                  <Input type="date" value={form.rera?.expiryDate || ''} onChange={(v) => fr('expiryDate', v)} />
                </Field>
                <Field label="RERA Link">
                  <Input value={form.rera?.link || ''} onChange={(v) => fr('link', v)} placeholder="rera.gov.in/..." />
                </Field>
              </div>
              <Field label="Builder Website">
                <Input value={form.builder?.website || ''} onChange={(v) => fb('website', v)} placeholder="https://godrejproperties.com" />
              </Field>
            </>
          )}

          {/* MEDIA */}
          {activeSection === 'media' && token && (
            <>
              <ImageUploader label="Hero Image (main project photo)" value={form.heroImage}
                onChange={(v) => f('heroImage', v as string)} token={token} />
              <ImageUploader label="Builder Logo" value={form.builder?.logo || ''}
                onChange={(v) => fb('logo', v as string)} token={token} />
              <ImageUploader label="Gallery Images" value={form.gallery || []}
                onChange={(v) => f('gallery', v)} token={token} multiple />
              <ImageUploader label="Floor Plan Images" value={form.floorPlanImages || []}
                onChange={(v) => f('floorPlanImages', v)} token={token} multiple />
              <ImageUploader label="Amenity Images" value={form.amenityImages || []}
                onChange={(v) => f('amenityImages', v)} token={token} multiple />
            </>
          )}

          {/* FEATURES */}
          {activeSection === 'features' && (
            <>
              <ListInput label="Highlights" items={form.highlights || []}
                onAdd={(v) => f('highlights', [...(form.highlights || []), v])}
                onRemove={(i) => f('highlights', (form.highlights || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="e.g. 80% open space, Olympic-size pool..." />
              <ListInput label="Amenities" items={form.amenities || []}
                onAdd={(v) => f('amenities', [...(form.amenities || []), v])}
                onRemove={(i) => f('amenities', (form.amenities || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="Gymnasium, Clubhouse..." />
              <ListInput label="Connectivity" items={form.connectivity || []}
                onAdd={(v) => f('connectivity', [...(form.connectivity || []), v])}
                onRemove={(i) => f('connectivity', (form.connectivity || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="5 mins to NH48, Delhi Metro nearby..." />
              <ListInput label="Nearby Landmarks" items={form.nearbyLandmarks || []}
                onAdd={(v) => f('nearbyLandmarks', [...(form.nearbyLandmarks || []), v])}
                onRemove={(i) => f('nearbyLandmarks', (form.nearbyLandmarks || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="RIICO Industrial Area, Bhiwadi Extension..." />
              <ListInput label="Why Buy" items={form.whyBuy || []}
                onAdd={(v) => f('whyBuy', [...(form.whyBuy || []), v])}
                onRemove={(i) => f('whyBuy', (form.whyBuy || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="Top rated builder, DDJAY scheme..." />
              <ListInput label="Tags" items={form.tags || []}
                onAdd={(v) => f('tags', [...(form.tags || []), v])}
                onRemove={(i) => f('tags', (form.tags || []).filter((_: any, idx: number) => idx !== i))}
                placeholder="luxury, gated, pet-friendly..." />
            </>
          )}

          {/* SEO & FAQs */}
          {activeSection === 'seo' && (
            <>
              <Field label="Meta Title" hint="~60 chars. Leave blank to auto-generate.">
                <Input value={form.metaTitle} onChange={(v) => f('metaTitle', v)} placeholder="Ashiana Bhiwadi — 2 BHK Flats on Alwar Bypass Road" />
                <p className="text-[10px] text-slate-400 mt-1">{form.metaTitle?.length || 0}/60</p>
              </Field>
              <Field label="Meta Description" hint="~155 chars.">
                <Input value={form.metaDescription} onChange={(v) => f('metaDescription', v)} placeholder="Explore Godrej Meridien…" rows={3} />
                <p className="text-[10px] text-slate-400 mt-1">{form.metaDescription?.length || 0}/155</p>
              </Field>
              <Field label="Meta Keywords">
                <Input value={form.metaKeywords} onChange={(v) => f('metaKeywords', v)} placeholder="godrej meridien, 3 bhk dwarka expressway..." />
              </Field>
              <FAQInput faqs={form.faqs || []} onChange={(v) => f('faqs', v)} />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : mode === 'add' ? 'Create Project' : 'Save Changes'}</Btn>
        </div>
      </Modal>

      {/* CSV Import Modal */}
      <Modal open={csvModalOpen} onClose={() => { setCsvModalOpen(false); setCsvResult(null); setCsvFile(null); }}
        title="Import Projects from CSV" width="max-w-lg">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            CSV must have headers: <code className="font-mono text-xs bg-blue-100 px-1 rounded">name, slug, corridor, status, priceDisplay, builder, location, sector</code>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm text-slate-600">{csvFile ? csvFile.name : 'Click to select CSV file'}</p>
            </label>
          </div>
          {csvResult && (
            <div className={`rounded-xl p-4 text-sm ${csvResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {csvResult.success
                ? `✓ ${csvResult.imported} projects imported, ${csvResult.skipped} skipped`
                : `✗ ${csvResult.message || 'Import failed'}`
              }
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Btn variant="secondary" onClick={() => { setCsvModalOpen(false); setCsvResult(null); setCsvFile(null); }}>Cancel</Btn>
            <Btn onClick={importCsv} disabled={!csvFile || csvImporting}>
              {csvImporting ? '⏳ Importing…' : 'Import CSV'}
            </Btn>
          </div>
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Corridor Management Modal */}
      <Modal open={corridorModalOpen} onClose={() => setCorridorModalOpen(false)} title="Corridors Manager" width="max-w-lg">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
            Corridor add karo → automatically header nav aur homepage mein show hoga. New corridors ka page <code>/corridor/[slug]</code> pe banta hai.
          </div>

          {/* Add new */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Add New Corridor</p>
            <div className="flex gap-2">
              <input className="w-12 border border-slate-200 rounded-xl px-2 py-2 text-center text-lg focus:outline-none"
                value={newCorridorIcon} onChange={(e) => setNewCorridorIcon(e.target.value)} placeholder="🛣️" />
              <input className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                value={newCorridorName} onChange={(e) => setNewCorridorName(e.target.value)}
                placeholder="e.g. Palam Vihar Road" onKeyDown={(e) => e.key === 'Enter' && addCorridor()} />
              <select value={newCorridorCity} onChange={(e) => setNewCorridorCity(e.target.value)}
                className="border border-slate-200 rounded-xl px-2 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:border-emerald-500">
                <option value="Bhiwadi">Bhiwadi</option>
                <option value="Bhiwadi">Bhiwadi</option>
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
                <option value="Faridabad">Faridabad</option>
                <option value="NCR">NCR</option>
              </select>
              <button onClick={addCorridor} disabled={corridorSaving || !newCorridorName.trim()}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                {corridorSaving ? '…' : '+ Add'}
              </button>
            </div>
          </div>

          {/* Existing corridors */}
          <div className="divide-y divide-slate-100">
            {corridors.map(c => (
              <div key={c.slug} className="flex items-center justify-between py-2.5 px-1">
                <div>
                  <p className="text-sm font-medium text-slate-800">{(c as any).icon || '🛣️'} {c.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {c.city && <span className="mr-2 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-semibold">{c.city}</span>}
                    {(c as any).href || `/corridor/${c.slug}`}
                  </p>
                </div>
                <button onClick={() => deleteCorridor(c.slug)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
