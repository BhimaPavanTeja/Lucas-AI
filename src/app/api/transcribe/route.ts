import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { audio } = await req.json();
    // audio is a data URL. In a real app, you'd run a speech-to-text model or call an API.
    // This stub returns a simulated transcript based on length.
    if (!audio || typeof audio !== 'string') {
      return NextResponse.json({ error: 'no audio' }, { status: 400 });
    }

    const size = audio.length;
    // heuristic: if very short, return small transcript
    const transcript = size < 2000 ? 'hello' : 'i want to become web developer';

    return NextResponse.json({ transcript });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
