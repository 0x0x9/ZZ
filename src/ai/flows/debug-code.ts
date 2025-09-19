
'use server';

/**
 * @fileOverview Un agent IA qui débugge des extraits de code.
 *
 * - debugCode - Une fonction qui prend un code et son langage, puis retourne le code corrigé et une explication.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  DebugCodeInputSchema,
  DebugCodeOutputSchema,
  type DebugCodeInput,
  type DebugCodeOutput,
} from '@/ai/types';

export async function debugCode(input: DebugCodeInput): Promise<DebugCodeOutput> {
  return debugFlow(input);
}

const debugPrompt = ai.definePrompt({
  name: 'debugCodePrompt',
  input: { schema: DebugCodeInputSchema },
  output: { schema: DebugCodeOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)code, un expert en débogage de code. Votre rôle est de trouver et corriger les erreurs dans le code fourni par l'utilisateur.

L'utilisateur a fourni le code suivant en **{{{language}}}** :
\`\`\`
{{{code}}}
\`\`\`

Analysez ce code, identifiez les erreurs logiques ou de syntaxe.
Si vous trouvez un bug, corrigez-le directement dans le code.
Si le code est déjà correct et fonctionnel, retournez le code original sans modification et mentionnez-le dans l'explication.

Votre réponse doit être au format JSON et inclure :
1.  **fixedCode**: Le bloc de code corrigé. S'il n'y a pas de bug, retournez le code original. Il est absolument essentiel que le code soit encapsulé dans un bloc markdown avec l'identifiant de langage correct (par exemple, \`\`\`typescript ... \`\`\`).
2.  **explanation**: Une explication claire et concise en **français** du bug trouvé et de la correction appliquée. Si aucun bug n'est trouvé, expliquez pourquoi le code est correct.`,
});

const debugFlow = ai.defineFlow(
  {
    name: 'debugFlow',
    inputSchema: DebugCodeInputSchema,
    outputSchema: DebugCodeOutputSchema,
  },
  async (input) => {
    const { output } = await debugPrompt(input);
    if (!output) {
      throw new Error("(X)code n'a pas pu analyser le code. Veuillez réessayer.");
    }
    return output;
  }
);
