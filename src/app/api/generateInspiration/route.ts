
import { generateInspiration } from '@/ai/flows/generate-inspiration';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateInspiration(body.prompt);
    return NextResponse.json({ inspiration: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
