import { generateVoice } from '@/genkit/flows/generate-voice';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateVoice);
