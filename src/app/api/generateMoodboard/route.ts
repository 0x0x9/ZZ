import { generateMoodboard } from '@/genkit/flows/generate-moodboard';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateMoodboard);
