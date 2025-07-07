'use client';

import { Suspense } from 'react';
import ResultContent from './result-content';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading your fantasy image…</div>}>
      <ResultContent />
    </Suspense>
  );
}





