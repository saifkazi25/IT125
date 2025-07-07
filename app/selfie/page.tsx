'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SelfiePage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <SelfiePageContent />
    </Suspense>
  );
}

function SelfiePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const answers = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`));
        const selfie = searchParams.get('selfie'); // This should be base64 encoded string

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            selfie,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || 'Image generation failed');

        // Redirect to result page with image URL
        router.push(`/result?img=${encodeURIComponent(data.image)}`);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    generateImage();
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-red-600 bg-white">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Generating Your Fantasy Image...</h1>
      <p className="text-gray-600">Hang tight, this may take a few seconds.</p>
    </main>
  );
}
