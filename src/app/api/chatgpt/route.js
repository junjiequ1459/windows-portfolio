// app/api/chatgpt/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1) Basic env check
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // 2) Validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { messages } = body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid "messages" array.' },
        { status: 400 }
      );
    }

    // 3) Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 2048,        // reasonable limit
        temperature: 0.7,
      }),
    });

    // 4) Handle non-OK responses robustly
    if (!openaiRes.ok) {
      const raw = await openaiRes.text(); // read once
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { error: { message: raw } };
      }

      console.error('OpenAI API Error:', parsed);

      if (openaiRes.status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded. Please wait before making another request.',
            retryAfter: openaiRes.headers.get('retry-after') || 60,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `OpenAI API Error: ${parsed.error?.message || 'Unknown error'}` },
        { status: openaiRes.status }
      );
    }

    // 5) Parse success
    const data = await openaiRes.json();
    const choice = data?.choices?.[0]?.message;
    if (!choice) {
      console.error('Invalid OpenAI response format:', data);
      return NextResponse.json(
        { error: 'Invalid response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ assistantMessage: choice });
  } catch (err) {
    console.error('[ChatGPT API ERROR]', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
