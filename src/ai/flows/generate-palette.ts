
'use server';

/**
 * @fileOverview Un agent IA de génération de palettes de couleurs appelé (X)palette.
 *
 * - generatePalette - Une fonction qui prend une description et génère une palette de couleurs.
 */

import { ai } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  GeneratePaletteInputSchema,
  GeneratePaletteOutputSchema,
  type GeneratePaletteInput,
  type GeneratePaletteOutput,
} from '@/ai/types';

export async function generatePalette(input: GeneratePaletteInput): Promise<GeneratePaletteOutput> {
  return paletteFlow(input);
}

const palettePrompt = ai.definePrompt({
  name: 'palettePrompt',
  input: { schema: GeneratePaletteInputSchema },
  output: { schema: GeneratePaletteOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)palette, un designer expert et coloriste. Votre rôle est de créer des palettes de couleurs harmonieuses et inspirantes à partir d'une description.

À partir de la description de l'utilisateur, vous devez générer :
1.  **Un nom de palette :** Un nom créatif qui capture l'essence de la description.
2.  **Une palette de 6 couleurs :**
    *   Chaque couleur doit avoir un code HEX valide (ex: '#FFFFFF').
    *   Chaque couleur doit avoir un nom évocateur et descriptif en français.
    *   Les couleurs doivent être harmonieuses et bien fonctionner ensemble. Pensez à inclure des couleurs de base, d'accentuation et des nuances.

La réponse doit être au format JSON valide.

Description de l'utilisateur : {{{prompt}}}
`,
});

const paletteFlow = ai.defineFlow(
  {
    name: 'paletteFlow',
    inputSchema: GeneratePaletteInputSchema,
    outputSchema: GeneratePaletteOutputSchema,
  },
  async (input) => {
    const { output } = await palettePrompt(input);
    if (!output) {
      throw new Error("(X)palette n'a pas pu générer de palette. Veuillez reformuler votre demande.");
    }
    return output;
  }
);

    