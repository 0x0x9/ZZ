import { generateLightMood } from '@/genkit/flows/generate-light-mood';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateLightMood);
