import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Vérifie la présence de la clé API.
// Cette vérification est cruciale pour le bon fonctionnement de l'IA.
if (!process.env.GOOGLE_API_KEY) {
  throw new Error(
    "La variable d'environnement GOOGLE_API_KEY est manquante. " +
    "Veuillez la définir dans votre fichier .env.local. " +
    "Vous pouvez obtenir une clé sur Google AI Studio : https://aistudio.google.com/app/apikey"
  );
}

// Initialise l'instance Genkit avec le plugin Google AI.
// C'est le point d'entrée pour toutes les fonctionnalités d'IA.
configureGenkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
  logSinks: [],
  traceSinks: [],
  enableTracingAndMetrics: true,
});

export const ai = genkit();
