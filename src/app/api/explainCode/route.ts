import { explainCode } from '@/genkit/flows/explain-code';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(explainCode);
