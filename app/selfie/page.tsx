
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SelfiePage() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('selfie', image);
    formData.append('questions', JSON.stringify(Object.fromEntries(params.entries())));

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    router.push(\`/result?img=\${data.image}\`);
  };

  return (
    <main className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Upload a Selfie</h2>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Create My Fantasy'}
      </button>
    </main>
  );
}
