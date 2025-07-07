import { NextRequest, NextResponse } from 'next/server';

const SDXL_MODEL = 'stability-ai/sdxl:latest';
const FUSION_MODEL = 'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7';

export async function POST(req: NextRequest) {
  try {
    const { user_image, answers } = await req.json();

    if (!user_image || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'user_image and answers[] are required' },
        { status: 400 }
      );
    }

    // Build prompt using quiz answers
    const prompt = `A fantasy scene of a ${answers[2]} warrior in ${answers[1]} with ${answers[3]}, holding a ${answers[6]}, in a magical ${answers[0]} ${answers[4]}, themed with ${answers[5]}`;

    // Generate background fantasy image
    const templateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: SDXL_MODEL,
        input: { prompt },
      }),
    });

    const templatePrediction = await templateRes.json();

    if (!templateRes.ok || !templatePrediction.output) {
      return NextResponse.json({ error: 'Failed to generate background' }, { status: 500 });
    }

    const template_image = Array.isArray(templatePrediction.output)
      ? templatePrediction.output[0]
      : templatePrediction.output;

    // Merge user selfie with generated fantasy image
    const fusionRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        version: FUSION_MODEL,
        input: { user_image, template_image },
      }),
    });

    const fusionPrediction = await fusionRes.json();

    if (!fusionRes.ok || !fusionPrediction.output) {
      return NextResponse.json(
        { error: 'Failed to generate final image' },
        { status: 500 }
      );
    }

    const finalImage = Array.isArray(fusionPrediction.output)
      ? fusionPrediction.output[0]
      : fusionPrediction.output;

    return NextResponse.json({ image: finalImage });
  } catch (e: any) {
    console.error('Error:', e);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
