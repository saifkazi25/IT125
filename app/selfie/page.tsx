'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SelfieUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image || !uploadedImage) return;

    setLoading(true);

    const answers = [];
    for (let i = 0; i < 10; i++) {
      const val = searchParams.get(`q${i}`);
      if (val) answers.push(val);
    }

    console.log("Sending image and answers to API:", { answers });

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: uploadedImage,
        answers,
      }),
    });

    const data = await res.json();
    console.log("Response from /api/generate:", data);

    router.push(`/result?img=${encodeURIComponent(data.image || '')}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {uploadedImage && (
        <img src={uploadedImage} alt="Preview" className="w-32 h-32 rounded-full object-cover mb-4" />
      )}
      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-blue-500 text-white px-6 py-2 roun



