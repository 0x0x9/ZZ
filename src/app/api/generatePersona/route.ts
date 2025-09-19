import { generatePersona } from '@/genkit/flows/generate-persona';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generatePersona);
