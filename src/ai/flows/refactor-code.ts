
'use server';

/**
 * @fileOverview Un agent IA qui refactorise des extraits de code.
 *
 * - refactorCode - Une fonction qui prend un code et des instructions, puis retourne le code amélioré.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  RefactorCodeInputSchema,
  GenerateCodeOutputSchema as RefactorCodeOutputSchema,
  type RefactorCodeInput,
  type GenerateCodeOutput as RefactorCodeOutput,
} from '@/ai/types';

export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  return refactorFlow(input);
}

const refactorPrompt = ai.definePrompt({
  name: 'refactorCodePrompt',
  input: { schema: RefactorCodeInputSchema },
  output: { schema: RefactorCodeOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)code, un développeur senior expert en bonnes pratiques de programmation. Votre mission est de refactoriser et d'améliorer le code fourni par l'utilisateur en suivant ses instructions.

L'utilisateur a fourni le code suivant en **{{{language}}}** :
\`\`\`
{{{code}}}
\`\`\`

Les instructions de refactorisation sont : **{{{prompt}}}**

Améliorez le code en termes de lisibilité, de performance, de maintenabilité et de respect des conventions.

Votre réponse doit être au format JSON et inclure :
1.  **code**: Le bloc de code refactorisé. Il est absolument essentiel que le code soit encapsulé dans un bloc markdown avec l'identifiant de langage correct (par exemple, \`\`\`typescript ... \`\`\`).
2.  **explanation**: Une explication claire et concise en **français** des changements apportés et des raisons de ces améliorations.`,
});

const refactorFlow = ai.defineFlow(
  {
    name: 'refactorFlow',
    inputSchema: RefactorCodeInputSchema,
    outputSchema: RefactorCodeOutputSchema,
  },
  async (input) => {
    const { output } = await refactorPrompt(input);
    if (!output) {
      throw new Error("(X)code n'a pas pu refactoriser le code. Veuillez réessayer.");
    }
    return output;
  }
);
