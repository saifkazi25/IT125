
'use client';

import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const params = useSearchParams();
  const img = params.get('img');

  return (
    <main className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Here’s Your Fantasy Image</h2>
      {img ? (
        <img src={img} alt="Fantasy Result" className="rounded w-full max-w-md mx-auto" />
      ) : (
        <p>No image found.</p>
      )}
    </main>
  );
}
