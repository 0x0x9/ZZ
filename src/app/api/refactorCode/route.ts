import { refactorCode } from '@/genkit/flows/refactor-code';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(refactorCode);
