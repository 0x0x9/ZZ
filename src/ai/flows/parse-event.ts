
'use server';

/**
 * @fileOverview Un agent IA qui analyse du langage naturel pour créer un événement d'agenda.
 *
 * - parseEvent - Une fonction qui prend une chaîne de caractères et la transforme en données d'événement structurées.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import {
  ParseEventInputSchema,
  AgendaEventSchema as ParseEventOutputSchema,
  type ParseEventInput,
  type AgendaEvent as ParseEventOutput,
} from '@/ai/types';

export async function parseEvent(input: ParseEventInput): Promise<ParseEventOutput> {
  return parseEventFlow(input);
}

const parseEventPrompt = ai.definePrompt({
  name: 'parseEventPrompt',
  input: { schema: ParseEventInputSchema },
  output: { schema: ParseEventOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes un assistant d'agenda intelligent. Votre mission est d'extraire les informations d'une requête en langage naturel pour créer un événement.
La date et l'heure de référence actuelles sont : {{{currentDate}}}.
Vous devez utiliser cette référence pour interpréter des termes comme "demain", "dans 2 heures", "lundi prochain", etc.

La requête est : "{{{prompt}}}"

Vous devez retourner un objet JSON avec les champs suivants :
1.  **title**: Le titre de l'événement.
2.  **date**: La date de l'événement au format YYYY-MM-DD.
3.  **time**: L'heure de l'événement au format HH:mm (24 heures).
`,
});

const parseEventFlow = ai.defineFlow(
  {
    name: 'parseEventFlow',
    inputSchema: ParseEventInputSchema,
    outputSchema: ParseEventOutputSchema,
  },
  async (input) => {
    const { output } = await parseEventPrompt(input);
    if (!output) {
      throw new Error("L'assistant n'a pas pu interpréter votre demande d'événement.");
    }
    return output;
  }
);
