import { generatePalette } from '@/genkit/flows/generate-palette';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generatePalette);
