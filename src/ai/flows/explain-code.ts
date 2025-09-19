
'use server';

/**
 * @fileOverview Un agent IA qui explique des extraits de code.
 *
 * - explainCode - Une fonction qui prend un code et son langage, puis retourne une explication claire.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  ExplainCodeInputSchema,
  ExplainCodeOutputSchema,
  type ExplainCodeInput,
  type ExplainCodeOutput,
} from '@/ai/types';

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainFlow(input);
}

const explainPrompt = ai.definePrompt({
    name: 'explainCodePrompt',
    input: { schema: ExplainCodeInputSchema },
    output: { schema: ExplainCodeOutputSchema, format: 'json' },
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes (X)code, un excellent pédagogue et expert en programmation. Votre mission est d'expliquer un extrait de code de manière simple, claire et concise.

L'utilisateur a fourni le code suivant en **{{{language}}}** :
\`\`\`
{{{code}}}
\`\`\`

Rédigez une explication en **français** qui couvre :
1.  Le but principal du code.
2.  Le fonctionnement de chaque partie importante.
3.  Comment l'utiliser avec un exemple simple si pertinent.

L'explication doit être facile à comprendre pour un développeur débutant.
Votre réponse doit être au format JSON et inclure **uniquement** le champ "explanation".`,
});


const explainFlow = ai.defineFlow(
  {
    name: 'explainFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async (input) => {
    const { output } = await explainPrompt(input);
    if (!output) {
      throw new Error("(X)code n'a pas pu analyser le code. Veuillez réessayer.");
    }
    return output;
  }
);
