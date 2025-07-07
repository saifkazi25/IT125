import React, { Suspense } from 'react';
import SelfieContent from '../selfie-content';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black">
      <Suspense fallback={<p>Loading form...</p>}>
        <SelfieContent />
      </Suspense>
    </main>
  );
}



