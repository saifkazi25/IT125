
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black flex-col gap-4">
      <h1 className="text-4xl font-bold">✨ Welcome to Infinite Tsukuyomi</h1>
      <Link href="/quiz">
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Start Your Fantasy Quiz</button>
      </Link>
    </main>
  );
}
