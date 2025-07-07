'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelfieContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedImage(file);
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert('Please upload a selfie.');

    const formData = new FormData();
    formData.append('file', uploadedImage);

    // Generate fantasy prompt from query params
    const prompt = Array.from(params.entries())
      .map(([key, value]) => value)
      .join(', ');

    // First: generate a fantasy template image
    const templateRes = await fetch('/api/generate-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const templateData = await templateRes.json();
    const templateImage = templateData.image;

    // Then: send selfie + template to face fusion model
    const base64Image = await toBase64(uploadedImage);
    const fusionRes = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_image: base64Image,
        template_image: templateImage,
      }),
    });

    const result = await fusionRes.json();
    router.push(`/result?img=${encodeURIComponent(result.image)}`);
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-black text-center">
      <h1 className="text-2xl font-bold mb-4">📸 Upload Your Selfie</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Generate Fantasy Image
      </button>
    </main>
  );
}
