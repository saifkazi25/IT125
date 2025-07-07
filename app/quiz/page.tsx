
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import questions from './questions';

export default function Quiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  const handleNext = (answer: string) => {
    const newAnswers = [...answers, answer];
    if (current + 1 === questions.length) {
      const query = newAnswers.map((a, i) => \`q\${i}=\${encodeURIComponent(a)}\`).join('&');
      router.push(\`/selfie?\${query}\`);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    }
  };

  return (
    <main className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">{questions[current].question}</h2>
      <div className="flex flex-col gap-2">
        {questions[current].options.map((opt) => (
          <button
            key={opt}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleNext(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </main>
  );
}
