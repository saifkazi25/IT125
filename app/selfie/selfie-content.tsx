'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelfieContent() {
  const params = useSearchParams();
  const router = useRouter();

  const q0 = params.get('q0');
  const q1 = params.get('q1');
  const q2 = params.get('q2');
  const q3 = params.get('q3');
  const q4 = params.get('q4');
  const q5 = params.get('q5');
  const q6 = params.get('q6');

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(',')[1];

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: [q0, q1, q2, q3, q4, q5, q6],
          image: base64,
        }),
      });

      const data = await res.json();
      if (data?.output) {
        router.push(`/result?img=${encodeURIComponent(data.output)}`);
      } else {
        alert('Image generation failed.');
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-black text-white rounded"
        disabled={loading}
      >
        {loading ? 'Creating Your Fantasy...' : 'Generate Fantasy Image'}
      </button>
    </div>
  );
}


