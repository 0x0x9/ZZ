
import { NextRequest, NextResponse } from 'next/server';
import { generateLightMood } from '@/ai/flows/generate-light-mood';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt =
      typeof body?.prompt === "string" && body.prompt.trim().length > 0
        ? body.prompt.trim()
        : null;

    if (!prompt) {
      return NextResponse.json(
        { error: "Le champ 'prompt' est manquant ou vide." },
        { status: 400 }
      );
    }

    const result = await generateLightMood({ prompt });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/light-mood:", error);
    return NextResponse.json({ error: error.message || 'Une erreur inconnue est survenue' }, { status: 500 });
  }
}
