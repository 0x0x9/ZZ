import { generateContent } from '@/genkit/flows/content-generator';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateContent);
