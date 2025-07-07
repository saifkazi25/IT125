'use client';

import React, { Suspense } from 'react';
import ResultContent from './result-content';

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading your fantasy result...</div>}>
      <ResultContent />
    </Suspense>
  );
}




