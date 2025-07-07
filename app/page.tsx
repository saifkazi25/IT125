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

        // Redirect to result pa





