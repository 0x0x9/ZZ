
'use server';

/**
 * @fileOverview Un agent IA pour les développeurs qui génère des extraits de code.
 *
 * - generateCode - Une fonction qui prend une requête et génère du code et une explication.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  GenerateCodeInputSchema,
  GenerateCodeOutputSchema,
  type GenerateCodeInput,
  type GenerateCodeOutput,
} from '@/ai/types';

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const codeGenerationPrompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: { schema: GenerateCodeInputSchema },
  output: { schema: GenerateCodeOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)code, un assistant développeur IA expert. Votre tâche est de générer un extrait de code de haute qualité, prêt à l'emploi, basé sur la demande de l'utilisateur, accompagné d'une explication claire.

L'utilisateur souhaite un snippet en **{{{language}}}**.

Demande de l'utilisateur : {{{prompt}}}

Votre réponse doit être au format JSON et inclure :
1.  **explanation**: Une explication claire et concise en **français** de ce que fait le code et de toute considération importante.
2.  **code**: Le bloc de code généré. Il est absolument essentiel que le code soit encapsulé dans un bloc markdown avec l'identifiant de langage correct (par exemple, \`\`\`typescript ... \`\`\`).`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async (input) => {
    const { output } = await codeGenerationPrompt(input);
    if (!output) {
      throw new Error("(X)code n'a pas pu générer le code. Veuillez réessayer.");
    }
    return output;
  }
);
