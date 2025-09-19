import { generateSchedule } from '@/genkit/flows/generate-schedule';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateSchedule);
