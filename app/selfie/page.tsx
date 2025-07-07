'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return;

    setLoading(true);

    const userImageBase64 = await toBase64(uploadedImage);
    const templateImage = 'https://replicate.delivery/pbxt/YourTemplateImageHere.jpg'; // replace with actual template

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_image: userImageBase64,
        template_image: templateImage,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data?.image) {
      router.push(`/result?img=${encodeURIComponent(data.image)}`);
    } else {
      alert('Image generation failed. Try again!');
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {uploadedImage && (
        <img
          src={URL.createObjectURL(uploadedImage)}
          alt="Uploaded"
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || !uploadedImage}
        className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Generate My Fantasy'}
      </button>
    </div>
  );
}




