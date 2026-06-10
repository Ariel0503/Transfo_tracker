// app/capture/page.tsx
// Server component — passes only serialisable props, so no 'use client' needed here.
// With no onSelect prop, CaptureSources navigates to /capture/{id} on click.
// Dates are ISO here and rendered as dd/mm/yyyy by the component.

import CaptureSources from '@/components/capture/CaptureSources';

export default function CapturePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <CaptureSources
        lastUsedById={{
          video: '2026-06-06',
          form: '2026-06-05',
          documents: '2026-06-03',
          screen: '2026-06-06',
          'event-log': '2026-06-02',
        }}
      />
    </main>
  );
}

/*
  Need custom handling instead of routing? Wrap it in a client component:

  // app/capture/CaptureClient.tsx
  'use client';
  import CaptureSources from '@/components/capture/CaptureSources';
  import type { CaptureSourceId } from '@/lib/triangulation';

  export default function CaptureClient() {
    return (
      <CaptureSources
        onSelect={(id: CaptureSourceId) => {
          // open the matching intake mode, set state, etc.
        }}
      />
    );
  }
*/
