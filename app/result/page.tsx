'use client';

import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const params = useSearchParams();
  const image = params.get('img');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1


