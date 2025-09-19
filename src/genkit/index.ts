
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "La variable d'environnement GEMINI_API_KEY est manquante. " +
    "Veuillez la définir dans votre fichier .env. " +
    "Vous pouvez obtenir une clé sur Google AI Studio : https://aistudio.google.com/app/apikey"
  );
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  logSinks: [],
  traceSinks: [],
  enableTracingAndMetrics: true,
});
