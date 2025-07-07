'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What is your dream location?',
  'What would you wear in that fantasy?',
  'What emotion do you feel there?',
  'Who is with you (if anyone)?',
  'What era or time is it?',
  'What power or ability do you have?',
  'What object is in your hand?',
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleNext = () => {
    const newAnswers = [...answers, input];
    setInput('');

    if (current + 1 === questions.length) {
      const query = newAnswers
        .map((a, i) => `q${i}=${encodeURIComponent(a)}`)
        .join('&');
      router.push(`/selfie?${query}`);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">🌌 Question {current + 1}</h1>
      <p className="mb-2">{questions[current]}</p>
      <input
        type="text"
        className="border p-2 rounded w-full max-w-md mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer..."
      />
      <button
        onClick={handleNext}
        disabled={!input.trim()}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </main>
  );
}

