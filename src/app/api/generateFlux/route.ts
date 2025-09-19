import { generateFlux } from '@/genkit/flows/generate-flux';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateFlux);
