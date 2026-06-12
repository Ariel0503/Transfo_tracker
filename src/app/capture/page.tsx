// app/capture/page.tsx  (or src/app/capture/page.tsx)
'use client';

import { useState } from 'react';
import CaptureSources from '@/components/capture/CaptureSources';
import type { CaptureSourceId } from '@/lib/triangulation';

export default function CapturePage() {
  const [selected, setSelected] = useState<CaptureSourceId | null>(null);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <CaptureSources
        onSelect={setSelected}
        lastUsedById={{
          video: '2026-06-06',
          form: '2026-06-05',
          documents: '2026-06-03',
          screen: '2026-06-06',
          'event-log': '2026-06-02',
        }}
      />

      {selected === 'video' && <div>{/* your video upload + transcription mode */}</div>}
      {selected === 'form' && <div>{/* your structured form */}</div>}
      {selected === 'documents' && <div>{/* your document ingestion */}</div>}
      {selected === 'screen' && <div>{/* your screen capture mode */}</div>}
      {selected === 'event-log' && <div>{/* your event-log import */}</div>}
    </main>
  );
}