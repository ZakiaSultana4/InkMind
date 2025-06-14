// src/app/api/ai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // 👈 use OpenRouter base URL
});


export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.choices[0].message?.content || '';
    return NextResponse.json({ result });
  } catch (err) {
    console.error('AI Error:', err);
    return NextResponse.json({ result: 'AI failed to respond' }, { status: 500 });
  }
}
