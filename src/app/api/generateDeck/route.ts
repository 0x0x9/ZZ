import { generateDeck } from '@/genkit/flows/generate-deck';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateDeck);
