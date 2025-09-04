import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Vérification de la présence de la clé API
if (!process.env.GOOGLE_API_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "La variable d'environnement GOOGLE_API_KEY est manquante. Le serveur ne peut pas démarrer."
    );
  } else {
    // En développement, on affiche un message plus amical.
    console.warn(`
      ********************************************************************************
      * ATTENTION: La variable d'environnement GOOGLE_API_KEY n'est pas configurée. *
      *                                                                              *
      * Les fonctionnalités IA ne fonctionneront pas.                                *
      * 1. Copiez .env.local.example en .env.local                                   *
      * 2. Ajoutez votre clé d'API Google dans le nouveau fichier .env.local         *
      * 3. Redémarrez le serveur de développement.                                   *
      ********************************************************************************
    `);
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  logSinks: [],
  traceSinks: [],
  enableTracingAndMetrics: true,
});
