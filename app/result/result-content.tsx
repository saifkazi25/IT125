'use client';

import { useSearchParams } from 'next/navigation';

export default function ResultContent() {
  const params = useSearchParams();
  const img = params.get('img');          // final image URL

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">✨ Your Infinite Tsukuyomi ✨</h1>

      {img ? (
        <img
          src={img}
          alt="Fantasy Result"
          className="max-w-full max-h-[600px] rounded-lg shadow-lg"
        />
      ) : (
        <p className="text-lg text-gray-600">No image found. Please generate one first.</p>
      )}

      <a
        href="/"
        className="mt-6 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Start Over
      </a>
    </main>
  );
}

