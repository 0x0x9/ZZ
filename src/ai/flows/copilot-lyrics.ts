
'use server';

/**
 * @fileOverview Un copilote IA pour l'écriture de paroles.
 *
 * - copilotLyrics - Une fonction qui analyse une sélection de texte et suggère des améliorations ou des rimes.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  CopilotLyricsInputSchema,
  CopilotLyricsOutputSchema,
  type CopilotLyricsInput,
  type CopilotLyricsOutput,
} from '@/ai/types';

export async function copilotLyrics(input: CopilotLyricsInput): Promise<CopilotLyricsOutput> {
  return copilotLyricsFlow(input);
}

const copilotPrompt = ai.definePrompt({
  name: 'copilotLyricsPrompt',
  input: { schema: CopilotLyricsInputSchema },
  output: { schema: CopilotLyricsOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)muse, un parolier expert et un poète. Votre rôle est d'assister un artiste dans son processus d'écriture. L'ambiance générale du morceau est : **{{{mood}}}**.

Voici le texte complet sur lequel il travaille :
---
{{{fullText}}}
---

L'artiste a sélectionné la portion de texte suivante : "{{{textToEdit}}}"

La tâche demandée est : **{{{action}}}**.

- Si la tâche est 'ENHANCE', proposez 3 à 5 manières alternatives et améliorées de cette sélection. Les suggestions doivent respecter l'ambiance et le style du texte. Pensez à varier le vocabulaire, utiliser des métaphores, améliorer le rythme ou la fluidité. Ne vous contentez pas de reformuler, enrichissez le propos.
- Si la tâche est 'RHYMES', proposez une liste de 5 à 10 rimes (mots ou courtes expressions) pour le dernier mot de la sélection. Les rimes doivent être pertinentes par rapport au thème et à l'ambiance. Proposez des rimes riches, suffisantes et pauvres pour donner un maximum de choix.

Répondez **uniquement** avec un objet JSON valide qui respecte ce schéma : { "suggestions": ["suggestion 1", "suggestion 2", ...] }.`,
});

const copilotLyricsFlow = ai.defineFlow(
  {
    name: 'copilotLyricsFlow',
    inputSchema: CopilotLyricsInputSchema,
    outputSchema: CopilotLyricsOutputSchema,
  },
  async (input) => {
    const { output } = await copilotPrompt(input);

    if (!output) {
      throw new Error("(X)muse n'a pas pu traiter votre demande. Veuillez réessayer.");
    }

    return output;
  },
);
