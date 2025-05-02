import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "This image is going to be analyzed by a 'Is it Pizza?' app. Your ONLY job is to determine if the image contains pizza. Respond with ONLY 'yes' if the image contains pizza, or 'no' if it does not contain pizza. No explanation, just 'yes' or 'no'." },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 10,
      temperature: 0.5,
    });

    // Extract the answer from the response
    const answer = response.choices[0]?.message?.content?.trim().toLowerCase() || '';
    
    // Determine if the image contains pizza
    const isPizza = answer.includes('yes');

    return NextResponse.json({ 
      isPizza,
      confidence: 'high', // We're using GPT-4V so confidence is assumed high
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}

// Reject non-POST requests
export function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 