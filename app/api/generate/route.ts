
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const selfie = form.get('selfie') as File;
  const questions = form.get('questions');

  const selfieBlob = await selfie.arrayBuffer();
  const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "REPLACE_WITH_MODEL_VERSION",
      input: {
        image: `data:image/jpeg;base64,${Buffer.from(selfieBlob).toString('base64')}`,
        prompt: questions,
      },
    }),
  });

  const result = await replicateResponse.json();
  return NextResponse.json({ image: result.output });
}
