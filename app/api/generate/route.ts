import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { selfieUrl, fantasyPrompt } = await req.json();

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '8a60bdf7e359c59d90dad33f9ed6fd812faa93861821d6324a7a4e4db0f4c1f5', // ← FaceFusion model version
        input: {
          target_image: selfieUrl,
          prompt: fantasyPrompt,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || 'Image generation failed' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}


