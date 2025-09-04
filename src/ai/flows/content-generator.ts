
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateIdeasOutputSchema } from '@/ai/types';
import { googleAI } from '@genkit-ai/googleai';

const GenerateContentInputSchema = z.object({
    contentType: z.enum(['text', 'image', 'ideas', 'reformat']),
    prompt: z.string(),
    style: z.string().optional(),
    textToReformat: z.string().optional(),
});
type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
    type: z.enum(['text', 'image', 'ideas']),
    data: z.union([z.string(), GenerateIdeasOutputSchema]),
});
type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

const contentGenerationPrompt = ai.definePrompt({
    name: 'contentGenerationPrompt',
    input: { schema: GenerateContentInputSchema },
    output: { schema: z.object({ result: z.string() }) },
    model: googleAI.model('gemini-1.5-flash-latest'),
    prompt: `Vous êtes un générateur de contenu expert. Votre tâche dépend du 'contentType' fourni.

- Si 'contentType' est 'text': Générez du contenu textuel créatif basé sur le 'prompt'.
- Si 'contentType' est 'image': Créez un prompt d'image très détaillé et descriptif en anglais, basé sur le 'prompt' et le 'style' de l'utilisateur.
- Si 'contentType' est 'ideas': Répondez avec un objet JSON valide qui correspond à ce schéma : { "imagePrompts": ["prompt1", "prompt2", "prompt3"], "titles": ["titre1", "titre2", "titre3"], "styles": ["style1", "style2", "style3"] }. Les prompts d'images doivent être en anglais, le reste en français.
- Si 'contentType' est 'reformat': Reformatez le 'textToReformat' en suivant l'instruction dans 'prompt'. Retournez uniquement le texte transformé.

---
Prompt/Instruction: {{{prompt}}}
{{#if style}}Style: {{{style}}}{{/if}}
{{#if textToReformat}}Texte à reformater: {{{textToReformat}}}{{/if}}
---

Répondez UNIQUEMENT avec le résultat demandé.`,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    if (input.contentType === 'image') {
        let finalPrompt = input.prompt;
        if (input.style && input.style !== 'none') {
            finalPrompt = `${input.prompt}, style ${input.style}`;
        }
        const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: finalPrompt,
        });

        if (!media?.url) {
            throw new Error('Image generation failed to produce an output.');
        }
        return { type: 'image', data: media.url };
    }

    const { output } = await contentGenerationPrompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu générer le contenu.");
    }
    
    if (input.contentType === 'ideas') {
      try {
        const ideasData = JSON.parse(output.result);
        return { type: 'ideas', data: ideasData };
      } catch (e) {
        throw new Error("L'IA a retourné un format d'idées invalide.");
      }
    }

    return { type: 'text', data: output.result };
  }
);


export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
    return generateContentFlow(input);
}
