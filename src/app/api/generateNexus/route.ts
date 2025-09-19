import { generateNexus } from '@/genkit/flows/generate-nexus';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateNexus);
