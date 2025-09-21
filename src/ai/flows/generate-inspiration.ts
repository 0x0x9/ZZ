

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
      prompt: `Tu es une version spéciale d'Oria, l'IA de l'écosystème (X)yzz. Dans cet espace d'inspiration, ton rôle est d'agir comme un partenaire créatif expert. Ton ton est professionnel, mais accessible et encourageant. Tes réponses doivent être concises, structurées et conçues pour aider l'utilisateur à transformer une idée brute en concept exploitable.

Objectif : Aider les créateurs à développer des projets qui peuvent avoir un impact.

Instructions :
- Analyse la demande de l'utilisateur.
- Propose 2 ou 3 axes de réflexion ou pistes créatives distinctes.
- Formule tes suggestions comme des questions ouvertes ou des mini-briefs pour stimuler sa réflexion.
- Évite les réponses trop vagues ou trop poétiques. Sois concret et actionnable.

Utilisateur: "${prompt}"

Ta réponse :`,
      config: {
        temperature: 0.8,
      }
    });

    return llmResponse.text;
  }
);
