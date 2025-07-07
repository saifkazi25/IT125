// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * FaceFusion model + version ID
 * Source: https://replicate.com/lucataco/modelscope-facefusion ➜ API tab
 */
const MODEL_VERSION =
  'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7';

export async function POST(req: NextRequest) {
  try {
    // ───── 1) Read JSON body ────────────────────────────────────────────────
    const { user_image, template_image } = await req.json();

    if (!user_image || !template_image) {
      return NextResponse.json(
        { error: 'user_image and template_image are required' },
        { status: 400 }
      );
    }

    // ───── 2) Call Replicate Predictions API (sync) ─────────────────────────
    const replicateRes = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          Prefer: 'wait', // block until finished
        },
        body: JSON.stringify({
          version: MODEL_VERSION,
          input: {
            user_image,
            template_image,
          },
        }),
      }
    );

    const prediction = await replicateRes.json();

    if (!replicateRes.ok) {
      console.error('Replicate error:', prediction);
      return NextResponse.json(
        { error: prediction?.detail || 'Generation failed' },
        { status: 500 }
      );
    }

    // Some models return array, some return single URL
    const output = Array.isArray(prediction.output)
      ? predict

