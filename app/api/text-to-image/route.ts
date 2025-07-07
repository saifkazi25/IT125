import { NextRequest, NextResponse } from "next/server";
const MODEL_VERSION = "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          width: 768,
          height: 768,
          prompt,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          prompt_strength: 0.8,
          num_inference_steps: 25,
        },
      }),
    });
    const prediction = await res.json();
    if (!res.ok || !prediction.output) {
      return NextResponse.json({ error: prediction.detail || "Generation failed" }, { status: 500 });
    }
    const image = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    return NextResponse.json({ image });
  } catch (e) {
    console.error("text-to-image error:", e);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
