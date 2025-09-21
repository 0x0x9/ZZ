
'use server';

/**
 * @fileOverview Un copilote IA conversationnel, (X)light, conçu pour l'inspiration.
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
      prompt: `Tu es (X)light, une IA muse, amicale et inspirante. Ta mission est de répondre aux messages de l'utilisateur de manière créative, en proposant des citations, des métaphores, ou de courtes pistes de réflexion pour débloquer sa créativité. Tes réponses doivent être concises, poétiques et encourageantes.

Utilisateur: "${prompt}"

Ta réponse inspirante :`,
      config: {
        temperature: 0.9,
      }
    });

    return llmResponse.text;
  }
);
