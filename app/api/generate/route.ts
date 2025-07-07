import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userImage, templateImage } = body;

  const prediction = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7", // Replace with actual model if needed
      input: {
        user_image: userImage,
        template_image: templateImage
      }
    })
  }).then(res => res.json());

  // Defensive check
  const output = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  return NextResponse.json({ image: output });
}



