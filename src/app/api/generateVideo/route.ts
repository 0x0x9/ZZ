import { generateVideo } from '@/ai/flows/generate-video';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(generateVideo);
