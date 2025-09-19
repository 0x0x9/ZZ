import { parseEvent } from '@/genkit/flows/parse-event';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(parseEvent);
