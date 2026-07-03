import Link from 'next/link';

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const CORRIDORS = [
  'Alwar Bypass Road', 'NH-48 Highway', 'Bhiwadi Extension',
  'Tapukara', 'Khushkhera', 'Neemrana', 'Chopanki', 'RIICO Industrial Area',
];
const STATUSES = ['New Launch', 'Under Construction', 'Ready To Move'];
const CONFIGS  = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Plot'];
const BUDGETS  = [
  { label: 'Under ₹30L', value: '30' },
  { label: 'Under ₹50L', value: '50' },
  { label: 'Under ₹75L', value: '75' },
  { label: 'Under ₹1 Cr', value: '100' },
];

interface Props {
  basePath: string;
  active: { location: string; status: string; config: string; maxPrice: string };
  totalCount: number;
}

function buildUrl(basePath: string, active: Props['active'], key: string, value: string) {
  const next = { ...active, [key]: active[key as keyof typeof active] === value ? '' : value };
  const qs = Object.entries(next)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function ProjectFilterBar({ basePath, active, totalCount }: Props) {
  const hasFilters = Object.values(active).some(Boolean);

  return (
    <div className="bg-white border-b border-brand-border/40 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">

        {/* Row 1: Status + BHK */}
        <div className="flex flex-wrap gap-2 items-center">
          {STATUSES.map(s => (
            <Link key={s} href={buildUrl(basePath, active, 'status', s)} scroll={false}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active.status === s
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-dark hover:text-brand-dark'
              }`}>
              {s}
            </Link>
          ))}
          <span className="text-brand-border text-sm">|</span>
          {CONFIGS.map(c => (
            <Link key={c} href={buildUrl(basePath, active, 'config', c)} scroll={false}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active.config === c
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-dark hover:text-brand-dark'
              }`}>
              {c}
            </Link>
          ))}
        </div>

        {/* Row 2: Corridor */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-brand-muted font-medium shrink-0">Corridor:</span>
          {CORRIDORS.map(c => (
            <Link key={c} href={buildUrl(basePath, active, 'location', c)} scroll={false}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active.location === c
                  ? 'bg-brand-accent text-brand-dark border-brand-accent'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-accent hover:text-brand-dark'
              }`}>
              {c}
            </Link>
          ))}
        </div>

        {/* Row 3: Budget + count + clear */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-brand-muted font-medium shrink-0">Budget:</span>
            {BUDGETS.map(b => (
              <Link key={b.value} href={buildUrl(basePath, active, 'maxPrice', b.value)} scroll={false}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active.maxPrice === b.value
                    ? 'bg-brand-accent text-brand-dark border-brand-accent'
                    : 'bg-white text-brand-muted border-brand-border hover:border-brand-accent hover:text-brand-dark'
                }`}>
                {b.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-brand-muted font-medium">
              {totalCount} project{totalCount !== 1 ? 's' : ''}
            </span>
            {hasFilters && (
              <Link href={basePath} scroll={false}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
                <XIcon />
                Clear
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
