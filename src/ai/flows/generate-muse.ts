
'use server';

/**
 * @fileOverview Un agent IA, (X)muse, pour trouver un style musical et lyrique.
 *
 * - generateMuse - Une fonction qui analyse les inspirations d'un utilisateur et suggère des directions artistiques.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  GenerateMuseInputSchema,
  GenerateMuseOutputSchema,
  type GenerateMuseInput,
  type GenerateMuseOutput,
} from '@/ai/types';

export async function generateMuse(input: GenerateMuseInput): Promise<GenerateMuseOutput> {
  return museFlow(input);
}

const musePrompt = ai.definePrompt({
  name: 'musePrompt',
  input: { schema: GenerateMuseInputSchema },
  output: { schema: GenerateMuseOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)muse, un producteur de musique et expert en tendances culturelles. Votre rôle est d'aider les artistes à définir leur identité sonore et lyrique.
À partir d'un questionnaire, analysez les mots-clés, le champ lexical des émotions et les références pour générer des suggestions artistiques pertinentes et créatives.
Toutes les réponses doivent être en français.

Questionnaire de l'utilisateur :
- Thème du texte : {{{theme}}}
- Ambiance émotionnelle : {{{mood}}}
- Rythme/BPM : {{{tempo}}}
- Références textuelles/littéraires : {{#if references}}{{{references}}}{{else}}Aucune{{/if}}

Votre réponse doit être au format JSON et inclure :
1.  **mainStyle**: Le style musical principal qui correspond le mieux à la demande. Soyez précis (ex: "Pop alternative", "Trap mélancolique", "Électro cinématique").
2.  **subGenres**: Une liste de 2-3 sous-genres ou styles à combiner pour créer une sonorité unique.
3.  **similarArtists**: Une liste de 5 artistes, connus ou émergents. Pour chaque artiste, fournissez :
    *   **name**: Le nom de l'artiste.
    *   **reason**: Une courte justification expliquant en quoi cet artiste est pertinent par rapport à la demande de l'utilisateur.
4.  **songSuggestions**: Une liste de 3 à 5 suggestions de morceaux spécifiques (titre et artiste) qui incarnent parfaitement le style et l'ambiance décrits. Ces suggestions serviront d'inspiration directe pour l'utilisateur.
5.  **initialLyrics**: Un court texte de paroles (par exemple, un couplet et un refrain) pour démarrer l'écriture. Ce texte doit être fortement inspiré par le thème, l'ambiance, et le style des artistes suggérés. Il doit être créatif, poétique et donner une première direction tangible à l'utilisateur.
`,
});

const museFlow = ai.defineFlow(
  {
    name: 'museFlow',
    inputSchema: GenerateMuseInputSchema,
    outputSchema: GenerateMuseOutputSchema,
  },
  async (input) => {
    const { output } = await musePrompt(input);
    if (!output) {
      throw new Error("(X)muse n'a pas pu trouver l'inspiration. Essayez de reformuler votre idée.");
    }
    return output;
  }
);
