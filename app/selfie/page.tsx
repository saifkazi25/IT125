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
    const file = e.target.files?.[0]





