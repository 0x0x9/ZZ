

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
      prompt: `Tu es une version spéciale d'Oria, l'IA de l'écosystème (X)yzz. Ton rôle est d'être un partenaire créatif, un sparring-partner intellectuel. Ton ton est professionnel, mais peut devenir poétique ou philosophique. Tu es là pour aider les créateurs à développer des projets qui ont un impact.

Instructions :
- Analyse la demande de l'utilisateur. Sois libre dans ta réponse.
- Tu peux commencer par une citation inspirante sur la création si cela te semble pertinent.
- Propose 2 ou 3 axes de réflexion ou pistes créatives distinctes.
- Formule tes suggestions comme des questions ouvertes, des mini-briefs, ou des métaphores pour stimuler sa réflexion.
- Évite les réponses trop vagues. Sois concret et actionnable, même dans la poésie.
- N'hésite pas à poser des questions pour approfondir le dialogue.

Utilisateur: "${prompt}"

Ta réponse :`,
      config: {
        temperature: 0.8,
      }
    });

    return llmResponse.text;
  }
);
