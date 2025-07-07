// app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userImage, templateImage } = body;

    if (!userImage || !templateImage) {
      return NextResponse.json({ error: 'Missing images' }, { status: 400 });
    }

    const prediction = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          user_image: userImage,
          template_image: templateImage,
        },
      }
    );

    return NextResponse.json({ output: prediction });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: 500 });
  }
}
