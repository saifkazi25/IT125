"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function generateFantasyImagePrompt(answers: string[]) {
  return `A highly detailed fantasy artwork of a person in ${answers[1]} in ${answers[0]} during the ${answers[4]}, holding a ${answers[6]}, with the power of ${answers[5]}, beside ${answers[3]}. Mood is ${answers[2]}.`;
}

export default function SelfieUpload() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const answers = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`) || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!uploadedImage) {
      alert("Please upload a selfie first.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create prompt from answers
      const prompt = generateFantasyImagePrompt(answers);

      // 2. Get fantasy background (template)
      const templateRes = await fetch("/api/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const templateData = await templateRes.json();
      const templateImage = templateData.image;
      if (!templateImage) throw new Error("No template image returned");

      // 3. Generate final image with selfie
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_image: uploadedImage,
          template_image: templateImage,
        }),
      });

      const data = await res.json();
      if (data.image) {
        router.push(`/result?img=${encodeURIComponent(data.image)}`);
      } else {
        alert("Failed to generate image.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Upload a Selfie</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="w-48 h-48 object-cover mb-4 rounded-full" />}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Create My Fantasy Image"}
      </button>
    </div>
  );
}

