import { NextRequest, NextResponse } from 'next/server';
import { generateQuestsForUser } from '@/lib/quest-generator';

export async function POST(request: NextRequest) {
  try {
    const { career, level, experience } = await request.json();
    
    if (!career || level === undefined) {
      return NextResponse.json(
        { success: false, error: 'Career and level are required' },
        { status: 400 }
      );
    }

    await generateQuestsForUser(career, level, experience || 'beginner');
    
    return NextResponse.json({ 
      success: true, 
      message: `Generated daily and weekly quests for ${career}` 
    });
  } catch (error) {
    console.error('Quest generation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate quests', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Quest Generation API',
    usage: 'POST with { career, level, experience } to generate quests'
  });
}