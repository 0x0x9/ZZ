
"use server";
/**
 * @fileOverview Un agent IA qui génère des maquettes (wireframes), (X)frame.
 *
 * - generateFrame - Une fonction qui prend une description d'UI et génère du code React pour un composant.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GenerateFrameInputSchema, GenerateFrameOutputSchema, type GenerateFrameInput, type GenerateFrameOutput } from '@/ai/types';

export async function generateFrame(input: GenerateFrameInput): Promise<GenerateFrameOutput> {
  return generateFrameFlow(input);
}

const framePrompt = ai.definePrompt({
  name: 'generateFramePrompt',
  input: { schema: GenerateFrameInputSchema },
  output: { schema: GenerateFrameOutputSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes (X)frame, un développeur frontend expert spécialisé dans l'écosystème Next.js, React, Tailwind CSS et shadcn/ui. Votre mission est de transformer une description ou une image en un **composant React fonctionnel, interactif et esthétique de qualité production**.

Instructions impératives :
1.  Structure du Composant React :
    *   Le code généré doit être un composant React unique et complet.
    *   Utilisez les hooks React (useState, useCallback, etc.) pour toute logique interactive. L'interactivité doit être significative (ex: gestion d'état, validation de formulaire), pas un simple compteur.
    *   Le code doit être propre, bien formaté et prêt à être utilisé.
2.  Styling & Composants :
    *   Utilisez en priorité les composants shadcn/ui disponibles (ex: <Button>, <Card>, <Input>, etc.).
    *   Utilisez les classes Tailwind CSS pour tout le style (disposition, couleurs, typographie, etc.).
    *   N'utilisez PAS de CSS personnalisé dans le champ \`cssCode\` à moins que ce soit absolument indispensable pour un effet complexe (ex: animation custom). La plupart du temps, ce champ doit rester vide.
    *   Utilisez des icônes de la bibliothèque lucide-react lorsque c'est pertinent.
3.  Code de sortie :
    *   \`htmlCode\` (JSX) : Doit contenir le code JSX complet du composant React. Incluez les imports nécessaires (React, hooks, shadcn/ui, lucide-react).
    *   \`jsCode\` : Doit être vide. Toute la logique JavaScript doit être intégrée dans le composant React du champ \`htmlCode\`.
    *   \`cssCode\` : Doit être vide, sauf si un style complexe est nécessaire.
4.  Qualité et Esthétique :
    *   Le design doit être moderne, épuré, professionnel et responsive.
    *   Inspirez-vous du style "glassmorphism" si possible.
    *   Utilisez des textes de remplissage pertinents en **français**.
5.  Explication :
    *   Fournissez une explication claire et concise du composant, de sa structure, de son fonctionnement et de ses dépendances (ex: "Ce composant utilise le composant Card de shadcn/ui et l'icône User de lucide-react").

Contexte de la demande :
Description: {{{prompt}}}
{{#if photoDataUri}}Inspiration Visuelle: {{media url=photoDataUri}}{{/if}}
`,
});

const generateFrameFlow = ai.defineFlow(
  {
    name: 'generateFrameFlow',
    inputSchema: GenerateFrameInputSchema,
    outputSchema: GenerateFrameOutputSchema,
  },
  async (input) => {
    const { output } = await framePrompt(input);
    if (!output) {
      throw new Error("(X)frame n'a pas pu générer de maquette. Veuillez réessayer.");
    }
    return output;
  }
);
