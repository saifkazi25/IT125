// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Replace with actual model version ID from Replicate's API tab
const MODEL_VERSION =
  'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7';

export async function POST(req: NextRequest) {
  try {
    const { user_image, template_image } = await req.json();

    if (!user_image || !template_image) {
      return NextResponse.json(
        { error: 'user_image and template_image are required' },
        { status: 400 }
      );
    }

    const replicateRes = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',
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

    const output = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    if (!output) {
      return NextResponse.json(
        { error: 'No output returned from model' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: output });
  } catch (err: any) {
    console.error('API route error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}


