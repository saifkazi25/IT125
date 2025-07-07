import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch('https://api.replicate.com/v1/predictions', {
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
    });

    const prediction = await response.json();

    if (!response.ok) {
      console.error('Replicate API error:', prediction);
      return NextResponse.json({ error: prediction.detail || 'Failed to generate image' }, { status: 500 });
    }

    const output = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    return NextResponse.json({ image: output });
  } catch (error: any) {
    console.error('Internal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}





