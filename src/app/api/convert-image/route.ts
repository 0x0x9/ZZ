import { convertImage } from '@/genkit/flows/convert-image';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(convertImage);
