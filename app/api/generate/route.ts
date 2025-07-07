import { NextRequest, NextResponse } from "next/server";

const MODEL_VERSION = "stability-ai/sdxl:db21e45e5b37f3c7fa00873aaef3b5f13785d52b6ed4769fe15b0d91df35d88c";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait"
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: { prompt }
      })
    });

    const prediction = await res.json();
    if (!res.ok || !prediction.output) {
      return NextResponse.json({ error: prediction.detail || "Generation failed" }, { status: 500 });
    }

    const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    return NextResponse.json({ image: output });
  } catch (e) {
    console.error("Text-to-image error:", e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

