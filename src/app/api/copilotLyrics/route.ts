import { copilotLyrics } from '@/genkit/flows/copilot-lyrics';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(copilotLyrics);
