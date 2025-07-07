'use client';

import React, { Suspense } from 'react';
import SelfieContent from './selfie-content';

export default function SelfiePage() {
  return (
    <Suspense fallback={<div>Loading selfie page...</div>}>
      <SelfieContent />
    </Suspense>
  );
}

