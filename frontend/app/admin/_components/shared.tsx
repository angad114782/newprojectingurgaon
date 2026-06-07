'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { API } from '../_context';

// ── Page header ────────────────────────────────────────────────────────────
export function PageHeader({
  title, subtitle, action,
}: {
  title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────
export function Btn({
  children, onClick, disabled, variant = 'primary', size = 'md',
  type = 'button', className = '',
}: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; type?: 'button' | 'submit'; className?: string;
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' };
  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 border border-red-100',
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    slate: 'bg-slate-100 text-slate-600',
    purple: 'bg-purple-100 text-purple-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${colors[color] ?? colors.slate}`}>
      {children}
    </span>
  );
}

// ── Image Uploader ─────────────────────────────────────────────────────────
export function ImageUploader({
  label, value, onChange, token, multiple = false,
}: {
  label: string; value: string | string[]; onChange: (v: string | string[]) => void;
  token: string; multiple?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (multiple) {
        Array.from(files).forEach(f => formData.append('images', f));
        const res = await fetch(`${API}/upload/gallery`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const data = await res.json();
        if (data.success) onChange([...(value as string[]), ...data.urls]);
      } else {
        formData.append('image', files[0]);
        const res = await fetch(`${API}/upload/single`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const data = await res.json();
        if (data.success) onChange(data.url);
      }
    } catch { alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    if (multiple) onChange([...(value as string[]), urlInput.trim()]);
    else onChange(urlInput.trim());
    setUrlInput('');
  };

  const imgs = multiple ? (value as string[]) : (value ? [value as string] : []);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 shrink-0">
          {uploading ? '⏳ Uploading…' : `📁 Upload${multiple ? ' Files' : ''}`}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple={multiple} className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)} />
        <div className="flex gap-1 flex-1 min-w-0">
          <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="Or paste image URL…"
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
          <button type="button" onClick={addUrl}
            className="shrink-0 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
            Add
          </button>
        </div>
      </div>
      {imgs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {imgs.map((img, i) => (
            <div key={i} className="relative group shrink-0">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={img} alt={`img-${i}`} fill className="object-cover" onError={() => {}} />
              </div>
              <button type="button"
                onClick={() => multiple
                  ? onChange((value as string[]).filter((_, idx) => idx !== i))
                  : onChange('')}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── List Input ─────────────────────────────────────────────────────────────
export function ListInput({
  label, items, onAdd, onRemove, placeholder,
}: {
  label: string; items: string[]; onAdd: (v: string) => void;
  onRemove: (i: number) => void; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const add = () => { if (!input.trim()) return; onAdd(input.trim()); setInput(''); };
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
        <button type="button" onClick={add}
          className="shrink-0 bg-slate-900 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all">
          + Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs">
              <span className="max-w-[160px] truncate">{item}</span>
              <button type="button" onClick={() => onRemove(i)}
                className="text-slate-400 hover:text-red-500 ml-0.5 font-bold shrink-0">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export function Input({
  value, onChange, placeholder, type = 'text', rows, className = '',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; rows?: number; className?: string;
}) {
  const base = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors placeholder:text-slate-400';
  if (rows) {
    return (
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        className={`${base} resize-none ${className}`} />
    );
  }
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} className={`${base} ${className}`} />
  );
}

export function Select({
  value, onChange, options, className = '',
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors ${className}`}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, title, children, width = 'max-w-2xl',
}: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative bg-white w-full ${width} sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h2 className="font-bold text-slate-900 text-base truncate pr-4">{title}</h2>
          <button onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all text-xl font-bold">
            ×
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ─────────────────────────────────────────────────────────────
export function ScoreRing({ score, label, color = '#10b981', size = 80 }: {
  score: number; label: string; color?: string; size?: number;
}) {
  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, score / 100)) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: size * 0.2, fontWeight: 700, fill: '#0f172a', fontFamily: 'inherit' }}>
          {score}
        </text>
      </svg>
      <span className="text-[11px] text-slate-500 text-center leading-tight max-w-[72px]">{label}</span>
    </div>
  );
}

// ── Floor Plans ────────────────────────────────────────────────────────────
type FloorPlan = { config: string; area: string; price: string };
export function FloorPlansInput({ plans, onChange }: { plans: FloorPlan[]; onChange: (v: FloorPlan[]) => void }) {
  const add = () => onChange([...plans, { config: '', area: '', price: '' }]);
  const update = (i: number, field: keyof FloorPlan, val: string) =>
    onChange(plans.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const remove = (i: number) => onChange(plans.filter((_, idx) => idx !== i));
  const base = 'bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full';
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Floor Plans / Price List</label>
        <Btn size="sm" variant="secondary" onClick={add}>+ Add</Btn>
      </div>
      {plans.length === 0 ? (
        <div className="text-slate-400 text-xs text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          Click "+ Add" to add floor plans
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-400 uppercase px-1">
            <span>Config</span><span>Area</span><span>Price</span>
          </div>
          {plans.map((p, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <input value={p.config} onChange={e => update(i, 'config', e.target.value)} placeholder="3 BHK" className={base} />
              <input value={p.area} onChange={e => update(i, 'area', e.target.value)} placeholder="1,680 sqft" className={base} />
              <div className="flex gap-1">
                <input value={p.price} onChange={e => update(i, 'price', e.target.value)} placeholder="₹1.4 Cr+" className={`${base} flex-1 min-w-0`} />
                <button type="button" onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-600 px-1.5 text-lg font-bold shrink-0">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FAQ Input ──────────────────────────────────────────────────────────────
type FAQ = { q: string; a: string };
export function FAQInput({ faqs, onChange }: { faqs: FAQ[]; onChange: (v: FAQ[]) => void }) {
  const add = () => onChange([...faqs, { q: '', a: '' }]);
  const update = (i: number, field: 'q' | 'a', val: string) =>
    onChange(faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">FAQs</label>
        <Btn size="sm" variant="secondary" onClick={add}>+ Add FAQ</Btn>
      </div>
      {faqs.length === 0 ? (
        <div className="text-slate-400 text-xs text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          No FAQs yet
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Q{i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Remove</button>
              </div>
              <input value={faq.q} onChange={e => update(i, 'q', e.target.value)}
                placeholder="Question…"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
              <textarea value={faq.a} onChange={e => update(i, 'a', e.target.value)}
                placeholder="Answer…" rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-emerald-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ msg, type = 'success', onClose }: {
  msg: string; type?: 'success' | 'error'; onClose: () => void;
}) {
  return (
    <div className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-xs w-full
      ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
      <span className="shrink-0">{type === 'success' ? '✓' : '✗'}</span>
      <span className="flex-1 text-sm">{msg}</span>
      <button onClick={onClose} className="shrink-0 opacity-75 hover:opacity-100 font-bold text-lg leading-none">×</button>
    </div>
  );
}
