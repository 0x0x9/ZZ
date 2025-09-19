import { generateFrame } from '@/genkit/flows/generate-frame';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateFrame);
