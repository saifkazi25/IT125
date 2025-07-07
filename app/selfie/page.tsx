'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SelfiePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const answers = [
    searchParams.get('q0'),
    searchParams.get('q1'),
    searchParams.get('q2'),
    searchParams.get('q3'),
    searchParams.get('q4'),
    searchParams.get('q5'),
    searchParams.get('q6'),
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageData) {
      alert('Please upload a selfie first.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_image: imageData,
          answers,
        }),
      });

      const data = await res.json();
      if (data.image) {
        router.push(`/result?img=${encodeURIComponent(data.image)}`);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {imageData && (
        <img src={imageData} alt="Uploaded" className="w-32 h-32 object-cover rounded-full mb-4" />
      )}
      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? 'Generating Fantasy...' : 'See Your Fantasy'}
      </button>
    </div>
  );
}






