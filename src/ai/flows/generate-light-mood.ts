
'use server';

/**
 * @fileOverview Un agent IA qui génère une ambiance créative (mood).
 *
 * - generateLightMood - Une fonction qui prend un prompt et génère une ambiance complète.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GenerateLightMoodInputSchema, GenerateLightMoodOutputSchema, type GenerateLightMoodInput, type GenerateLightMoodOutput } from '@/ai/types';

export async function generateLightMood(input: GenerateLightMoodInput): Promise<GenerateLightMoodOutput> {
  return generateLightMoodFlow(input);
}

const moodPrompt = ai.definePrompt({
    name: 'generateLightMoodPrompt',
    input: { schema: GenerateLightMoodInputSchema },
    output: { schema: GenerateLightMoodOutputSchema, format: 'json' },
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes (X)light, une IA conçue pour inspirer la créativité. Votre rôle est de transformer une idée ou une ambiance en un concept créatif complet.

Le thème donné est : {{{prompt}}}

Générez une réponse JSON qui correspond au schéma de sortie. Pour cela, remplissez les champs suivants :
1.  **title**: Un titre poétique et évocateur pour l'ambiance, en français.
2.  **description**: Une courte description (2-3 phrases) qui capture l'essence de l'ambiance, en français.
3.  **colors**: Une liste de 5 codes couleurs HEX qui forment une palette harmonieuse.
4.  **keywords**: Une liste de 5 mots-clés pertinents (en français) qui décrivent le mood.
5.  **imagePrompts**: Une liste de 4 prompts d'images très détaillés et descriptifs, en anglais, pour un générateur d'images IA.`,
});

const generateLightMoodFlow = ai.defineFlow(
  {
    name: 'generateLightMoodFlow',
    inputSchema: GenerateLightMoodInputSchema,
    outputSchema: GenerateLightMoodOutputSchema,
  },
  async (input) => {
    const { output } = await moodPrompt(input);
    if (!output) {
      throw new Error("(X)light n'a pas pu générer d'ambiance. Veuillez réessayer.");
    }
    return output;
  }
);
