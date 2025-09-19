
'use server';

/**
 * @fileOverview Un agent IA qui génère des personas d'utilisateurs.
 *
 * - generatePersona - Une fonction qui prend une description de projet et génère des personas d'utilisateurs.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  GeneratePersonaInputSchema,
  GeneratePersonaOutputSchema,
  type GeneratePersonaInput,
  type GeneratePersonaOutput,
} from '@/ai/types';

export async function generatePersona(input: GeneratePersonaInput): Promise<GeneratePersonaOutput> {
  return personaFlow(input);
}

const personaPrompt = ai.definePrompt({
  name: 'personaPrompt',
  input: { schema: GeneratePersonaInputSchema },
  output: { schema: GeneratePersonaOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)persona, un expert en stratégie marketing et en design d'expérience utilisateur. Votre rôle est de créer des personas d'utilisateurs réalistes et exploitables pour guider la création d'un projet. L'intégralité de la réponse doit être en **français**, à l'exception du champ "avatarPrompt" qui doit être en **anglais**.

À partir de la description du projet de l'utilisateur, vous devez générer 2 ou 3 personas. Pour chaque persona, fournissez :
1.  **Nom :** Un nom complet (en français).
2.  **Bio :** Une courte biographie de 2-3 phrases (en français).
3.  **Avatar Prompt :** Un prompt détaillé **en anglais** pour un générateur d'image, décrivant un portrait réaliste du persona.
4.  **Motivations :** 2-3 motivations principales (en français).
5.  **Frustrations :** 2-3 points de friction ou problèmes (en français).

Description du projet : {{{prompt}}}
`,
});

const personaFlow = ai.defineFlow(
  {
    name: 'personaFlow',
    inputSchema: GeneratePersonaInputSchema,
    outputSchema: GeneratePersonaOutputSchema,
  },
  async (input) => {
    const { output } = await personaPrompt(input);
    if (!output) {
      throw new Error("(X)persona n'a pas pu générer de profils. Veuillez reformuler votre demande.");
    }
    return output;
  }
);
