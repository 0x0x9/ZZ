
'use server';

/**
 * @fileOverview Un agent IA qui définit le ton de voix d'une marque.
 *
 * - generateTone - Une fonction qui prend une description de projet et génère un guide de ton.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GenerateToneInputSchema,
  GenerateToneOutputSchema,
  type GenerateToneInput,
  type GenerateToneOutput,
} from '@/ai/types';

export async function generateTone(input: GenerateToneInput): Promise<GenerateToneOutput> {
  return toneFlow(input);
}

const tonePrompt = ai.definePrompt({
  name: 'tonePrompt',
  input: { schema: GenerateToneInputSchema },
  output: { schema: GenerateToneOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)tone, un expert en branding et en stratégie de contenu. Votre mission est de définir une voix de marque (tone of voice) claire, cohérente et percutante. La réponse doit être en français.

À partir de la description du projet ou de la marque, vous devez générer un mini-guide de style :
1.  **3 adjectifs clés :** Qui capturent l'essence de la personnalité de la marque.
2.  **À faire (Dos) :** 2-3 recommandations concrètes sur le style d'écriture à adopter.
3.  **À ne pas faire (Don'ts) :** 2-3 écueils à éviter pour ne pas trahir le ton.
4.  **Exemples :** 1 ou 2 exemples de phrases qui incarnent parfaitement le ton défini.

Description du projet : {{{prompt}}}
`,
});

const toneFlow = ai.defineFlow(
  {
    name: 'toneFlow',
    inputSchema: GenerateToneInputSchema,
    outputSchema: GenerateToneOutputSchema,
  },
  async (input) => {
    const { output } = await tonePrompt(input);
    if (!output) {
      throw new Error("(X)tone n'a pas pu générer de guide. Veuillez reformuler votre demande.");
    }
    return output;
  }
);
