import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body.image is a data URL from the client. In a real app we'd run CV/ML here.

    // Simple stubbed analysis: random or deterministic response for demo
    const attention = Math.random() > 0.3 ? 'focused' : 'distracted';
    const emotions = ['neutral', 'happy', 'sad', 'surprised'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];

    return NextResponse.json({ attention, emotion, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
