// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MODEL_VERSION = 'fofr/facefusion:YOUR_VERSION_ID_HERE';

async function uploadSelfie(base64: string, token: string) {
  const res = await fetch('https://api.replicate.com/v1/upload', {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: base64,
      content_type: 'image/png',
    }),
  });

  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const { url } = await res.json();
  return url as string;
}

export async function POST(req: NextRequest) {
  try {
    // ---- 1. Parse multipart/form-data --------------------
    const form = await req.formData();
    const selfieFile = form.get('selfie') as File;
    const answersRaw = form.get('questions') as string;

    if (!selfieFile) return NextResponse.json({ error: 'No selfie' }, { status: 400 });

    // ---- 2. Convert selfie to base64 --------------------
    const buffer = Buffer.from(await selfieFile.arrayBuffer());
    const base64Selfie = `data:${selfieFile.type};base64,${buffer.toString('base64')}`;

    // ---- 3. Upload selfie to Replicate ------------------
    const token = process.env.REPLICATE_API_TOKEN!;
    const s

