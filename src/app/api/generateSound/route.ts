import { generateSound } from '@/genkit/flows/generate-sound';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateSound);
