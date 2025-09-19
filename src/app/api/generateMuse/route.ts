import { generateMuse } from '@/ai/flows/generate-muse';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await generateMuse(body);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
    }
}
