import { generateTone } from '@/genkit/flows/generate-tone';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateTone);
