// components/capture/CaptureSources.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  CAPTURE_SOURCES,
  STREAMS,
  STRUCTURAL_HEADER,
  STRUCTURAL_HEADER_TEXT,
  formatDate,
  type CaptureSourceId,
  type IconName,
} from '@/lib/triangulation';

interface CaptureSourcesProps {
  /** Called when an option is chosen. If omitted, navigates to /capture/{id}. */
  onSelect?: (id: CaptureSourceId) => void;
  /** Optional last-used dates (Date or ISO string), rendered as dd/mm/yyyy. */
  lastUsedById?: Partial<Record<CaptureSourceId, Date | string>>;
  className?: string;
}

function SourceIcon({ name }: { name: IconName }) {
  const size = 22;
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (name) {
    case 'video':
      return (
        <svg {...props}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m16 10 6-3v10l-6-3" />
        </svg>
      );
    case 'form':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case 'document':
      return (
        <svg {...props}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case 'screen':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case 'log':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M9 4v16" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CaptureSources({
  onSelect,
  lastUsedById,
  className,
}: CaptureSourcesProps) {
  const router = useRouter();

  const handleSelect = (id: CaptureSourceId) => {
    if (onSelect) onSelect(id);
    else router.push(`/capture/${id}`);
  };

  return (
    <div className={`flex flex-col gap-3.5 ${className ?? ''}`}>
      <div
        className="rounded-xl px-5 py-4"
        style={{ backgroundColor: STRUCTURAL_HEADER, color: STRUCTURAL_HEADER_TEXT }}
      >
        <h2 className="text-lg font-medium">Capture process evidence</h2>
        <p className="mt-1 text-sm">
          Every source feeds one of the three evidence streams. Pick how you want to add it.
        </p>
      </div>

      {STREAMS.map((stream) => {
        const sources = CAPTURE_SOURCES.filter((s) => s.stream === stream.id);
        const headingId = `capture-stream-${stream.id}`;

        return (
          <section
            key={stream.id}
            aria-labelledby={headingId}
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: stream.bg }}
          >
            <div className="mb-3 flex flex-wrap items-baseline gap-2.5">
              <h3 id={headingId} className="text-base font-medium" style={{ color: stream.text }}>
                {stream.label}
              </h3>
              <p className="text-sm" style={{ color: stream.text, opacity: 0.85 }}>
                {stream.blurb}
              </p>
            </div>

            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              {sources.map((source) => {
                const used = lastUsedById?.[source.id];

                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => handleSelect(source.id)}
                    aria-label={`${source.title}: ${source.description}`}
                    className="flex h-full flex-col gap-1.5 rounded-xl border border-black/10 bg-white p-3.5 text-left transition-colors duration-150 hover:border-[#8EACCD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1b3a6b] motion-reduce:transition-none"
                  >
                    <span className="text-[#14304f]" aria-hidden="true">
                      <SourceIcon name={source.icon} />
                    </span>
                    <span className="text-[15px] font-medium text-slate-900">{source.title}</span>
                    <span className="text-[13px] leading-snug text-slate-600">{source.description}</span>
                    {used ? (
                      <span className="mt-0.5 text-xs text-slate-400">
                        {source.metaLabel} {formatDate(used)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
