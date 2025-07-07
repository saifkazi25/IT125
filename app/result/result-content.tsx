'use client';

import { useSearchParams } from 'next/navigation';

export default function ResultContent() {
  const params = useSearchParams();
  const image = params.get('img');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">🖼️ Your Fantasy Image</h1>
      {image ? (
        <img
          src={image}
          alt="Fantasy Result"
          className="max-w-full max-h-[600px] rounded-lg shadow-lg"
        />
      ) : (
        <p className="text-lg text-gray-600">No image was generated.</p>
      )}
    </main>
  );
}
