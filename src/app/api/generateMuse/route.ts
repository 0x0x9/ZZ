import { generateMuse } from '@/genkit/flows/generate-muse';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateMuse);
