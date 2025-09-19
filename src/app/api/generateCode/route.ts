import { generateCode } from '@/genkit/flows/generate-code';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateCode);
