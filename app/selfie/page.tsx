"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SelfiePage() {
  const searchParams = useSearchParams();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const generateFantasy = async () => {
    if (!uploadedImage) return alert("Please upload a selfie.");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const user_image = reader.result;

      // STEP 2: Build template_image from quiz answers
      const answers = Array.from({ length: 7 }, (_, i) =>
        searchParams.get(`q${i}`) || "blank"
      );

      const prompt = answers.join(" ");
      const template_image_res = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            Prefer: "wait",
          },
          body: JSON.stringify({
            version: "stability-ai/sdxl:YOUR_VERSION_HERE",
            input: { prompt },
          }),
        }
      );

      const template_json = await template_image_res.json();
      const template_image = Array.isArray(template_json.output)
        ? template_json.output[0]
        : template_json.output;

      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_image, template_image }),
      });

      const data = await res.json();
      setResult(data.image);
      setLoading(false);
    };

    reader.readAsDataURL(uploadedImage);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {preview && <img src={preview} alt="Preview" className="mb-4 w-48 h-48 object-cover" />}
      <button
        onClick={generateFantasy}
        className="bg-black text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "See Your Fantasy"}
      </button>
      {result && <img src={result} alt="Fantasy Result" className="mt-4 max-w-full" />}
    </div>
  );
}


