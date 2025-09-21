
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
      prompt: `Tu es une version spéciale d'Oria, l'IA de l'écosystème (X)yzz. Dans cet espace d'inspiration, ton rôle n'est pas d'être un chef d'orchestre, mais une muse, une partenaire créative. Adopte un ton très amical, chaleureux, presque comme une amie qui encourage. Tes réponses doivent être concises, poétiques et conçues pour débloquer la créativité de l'utilisateur, le rassurer et l'inspirer.

Utilisateur: "${prompt}"

Ta réponse inspirante :`,
      config: {
        temperature: 0.9,
      }
    });

    return llmResponse.text;
  }
);
