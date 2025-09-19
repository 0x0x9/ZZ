import { generateMotion } from '@/genkit/flows/generate-motion';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateMotion);
