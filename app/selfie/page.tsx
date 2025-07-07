"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function promptFromAnswers(ans: string[]) {
  return `Ultra-detailed fantasy of a person in ${ans[1]} in ${ans[0]}, during ${ans[4]}, holding ${ans[6]}, with power of ${ans[5]}, accompanied by ${ans[3]}, mood ${ans[2]}.`;
}

export default function SelfiePage() {
  const router = useRouter();
  const params = useSearchParams();
  const answers = Array.from({ length: 7 }, (_, i) => params.get(`q${i}`) || "");

  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelfieData(await fileToDataUrl(file));
  };

  const generate = async () => {
    if (!selfieData) return alert("Upload a selfie first");
    setLoading(true);
    try {
      const prompt = promptFromAnswers(answers);
      const tmplRes = await fetch("/api/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const tmplJson = await tmplRes.json();
      if (!tmplJson.image) throw new Error();

      const fuseRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_image: selfieData,
          template_image: tmplJson.image,
        }),
      });
      const fuseJson = await fuseRes.json();
      if (!fuseJson.image) throw new Error();

      router.push(`/result?img=${encodeURIComponent(fuseJson.image)}`);
    } catch (e) {
      console.error(e);
      alert("Something failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
      <h1 className="text-2xl font-bold mb-4">Upload selfie & create fantasy!</h1>
      <input type="file" onChange={handleFile} accept="image/*" />
      {selfieData && <img src={selfieData} className="w-40 h-40 rounded-full" />}
      <button
        disabled={loading || !selfieData}
        onClick={generate}
        className="bg-black text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Make Fantasy"}
      </button>
    </div>
  );
}



