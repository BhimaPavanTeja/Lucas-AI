import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export async function POST(request: NextRequest) {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}