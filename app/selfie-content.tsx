'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SelfieContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fantasyPrompt = `
    A person in ${searchParams.get('q1')} with a ${searchParams.get('q6')},
    looking ${searchParams.get('q2')} beside ${searchParams.get('q3')},
    in ${searchParams.get('q0')} during the ${searchParams.get('q4')},
    with powers of ${searchParams.get('q5')}
  `;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) return alert('Please upload your selfie!');
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const templateRes = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fantasyPrompt }),
      });

      const { output: templateImage } = await templateRes.json();

      const mergeRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_image: base64Image,
          template_image: templateImage,
        }),
      });

      const { output: finalImage } = await mergeRes.json();
      router.push(`/result?img=${encodeURIComponent(finalImage)}`);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Your Selfie</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'See My Fantasy!'}
      </button>
    </div>
  );
}
