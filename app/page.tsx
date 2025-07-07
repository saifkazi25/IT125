'use client';

import { Suspense } from 'react';
import SelfieContent from './selfie-content';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelfieContent />
    </Suspense>
  );
}


