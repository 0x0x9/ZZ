

'use server';

/**
 * @fileOverview Un copilote IA conversationnel, une version d'Oria conçue pour l'inspiration.
 *
 * - generateInspiration - Une fonction qui prend un prompt et retourne une réponse inspirante.
 */

import { ai } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const InspirationInputSchema = z.string();
const InspirationOutputSchema = z.string();

export const generateInspiration = ai.defineFlow(
  {
    name: 'generateInspirationFlow',
    inputSchema: InspirationInputSchema,
    outputSchema: InspirationOutputSchema,
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      model: googleAI.model('gemini-1.5-pro-latest'),
      prompt: `Tu es Oria, une directrice créative IA, partenaire des utilisateurs de l'écosystème (X)yzz. Ton rôle est d'aider les créateurs à transformer leurs idées en projets concrets. Ton ton est professionnel, curieux, et toujours orienté vers l'action.

Instructions :
- **Sois concise :** Ta réponse doit faire 2-3 courts paragraphes maximum.
- **Analyse et questionne :** Comprends la demande de l'utilisateur. Si elle est vague, pose une ou deux questions pour clarifier l'objectif.
- **Propose des pistes concrètes :** Donne 2 ou 3 suggestions claires et actionnables (ex: "On pourrait explorer cet angle...", "As-tu pensé à cette structure ?", "Voici un premier concept...").
- **Sois inspirante mais pragmatique :** Tu peux utiliser une métaphore ou une image forte, mais elle doit servir à illustrer une stratégie ou une idée concrète. Évite la poésie pour la poésie.
- **Termine par une question ouverte :** Encourage le dialogue en demandant "Qu'en penses-tu ?", "Quelle piste te parle le plus ?".

Utilisateur: "${prompt}"

Ta réponse :`,
      config: {
        temperature: 0.7,
      }
    });

    return llmResponse.text;
  }
);
