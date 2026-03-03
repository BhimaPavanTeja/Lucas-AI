import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, analysis } = await req.json();

    const text = (message || '').toLowerCase();

    let reply = "Thanks for sharing. Tell me more about your goals so I can help with concrete steps.";

    if (text.includes('web') || text.includes('developer') || text.includes('web developer')) {
      reply = `That's a great goal — becoming a web developer. Suggested next steps:\n
1) Learn HTML, CSS, basic JavaScript.\n2) Build small projects (todo app, portfolio).\n3) Learn modern JS frameworks (React / Next.js).\n4) Deploy projects and prepare a portfolio.\n
I can help make a learning plan — what timeframe do you have?`;
    }

    // incorporate simple observation-based advice
    if (analysis?.attention === 'distracted') {
      reply = reply + '\n\nI also notice you seem distracted — try a 25-minute focused session (Pomodoro) and short breaks.';
    }

    // provide interactive choices for simple flows
    const choices = reply.toLowerCase().includes('what timeframe')
      ? ['3 months', '6 months', '1 year']
      : undefined;

    return NextResponse.json({ reply, choices, emotion: analysis?.emotion ?? 'neutral' });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
