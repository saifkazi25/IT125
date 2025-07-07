'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(7).fill(''));
  const [selfie, setSelfie] = useState<File | null>(null);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (answers.some((a) => !a) || !selfie) {
      alert('Please answer all questions and upload a selfie.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Selfie = reader.result?.toString();
      const query = answers
        .map((ans, i) => `q${i}=${encodeURIComponent(ans)}`)
        .join('&');

      const fullUrl = `/selfie?${query}&selfie=${encodeURIComponent(base64Selfie || '')}`;
      router.push(fullUrl);
    };
    reader.readAsDataURL(selfie);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">🌙 Infinite Tsukuyomi Quiz</h1>
      {answers.map((answer, i) => (
        <input
          key={i}
          type="text"
          value={answer}
          placeholder={`Question ${i + 1}`}
          onChange={(e) => handleInputChange(i, e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full max-w-md"
        />
      ))}
      <input
        type="file"
        accept="image/*"
        onChange={handleSelfieChange}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </main>
  );
}






