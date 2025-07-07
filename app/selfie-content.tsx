'use client';

export default function SelfieContent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Welcome to Infinite Tsukuyomi</h2>
      <p className="text-center max-w-md">
        Discover your deepest fantasy. Click below to begin the journey.
      </p>
      <a
        href="/selfie"
        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Start Quiz
      </a>
    </div>
  );
}

