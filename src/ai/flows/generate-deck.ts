
'use server';
/**
 * @fileOverview Un agent IA qui génère des présentations, (X)deck.
 *
 * - generateDeck - Une fonction qui prend un sujet et génère une présentation complète.
 */

import { ai } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GenerateDeckInputSchema, GenerateDeckOutputSchema, type GenerateDeckInput, type GenerateDeckOutput } from '@/ai/types';

export async function generateDeck(input: GenerateDeckInput): Promise<GenerateDeckOutput> {
  return generateDeckFlow(input);
}

const deckPrompt = ai.definePrompt({
    name: 'deckPrompt',
    input: { schema: GenerateDeckInputSchema },
    output: { schema: GenerateDeckOutputSchema, format: 'json' },
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes (X)deck, un concepteur de présentations expert. Votre mission est de transformer un sujet en une présentation structurée, claire et visuellement inspirante.

Le sujet est : {{{prompt}}}

Vous devez générer :
1.  Un titre de présentation percutant.
2.  Une série de 5 à 8 diapositives. Chaque diapositive doit inclure :
    *   Un titre clair et concis.
    *   Du contenu sous forme d'une liste de 2 à 4 points clés.
    *   Un prompt d'image (imagePrompt) détaillé, en anglais, pour illustrer la diapositive.
    *   Des notes pour l'orateur (speakerNotes) qui développent les points clés.

La réponse doit être en français (sauf pour imagePrompt) et au format JSON.`,
});

const generateDeckFlow = ai.defineFlow(
  {
    name: 'generateDeckFlow',
    inputSchema: GenerateDeckInputSchema,
    outputSchema: GenerateDeckOutputSchema,
  },
  async (input) => {
    const { output } = await deckPrompt(input);
    if (!output) {
      throw new Error("(X)deck n'a pas pu générer de présentation. Veuillez réessayer.");
    }
    return output;
  }
);

    