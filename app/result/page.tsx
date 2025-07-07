'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const image = searchParams.get('img');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">🌟 Your Ultimate Fantasy 🌟</h1>
      {image ? (
        <img src={image} alt="Fantasy Result" className="max-w-full rounded-lg shadow-lg" />
      ) : (
        <p>No image found</p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}

