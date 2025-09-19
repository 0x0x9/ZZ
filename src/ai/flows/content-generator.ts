'use server';

import { ai } from '@/genkit';
import { z } from 'zod';
import { GenerateIdeasOutputSchema, ReformatTextWithPromptOutputSchema } from '@/ai/types';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateContentInputSchema = z.object({
    contentType: z.enum(['text', 'image', 'ideas', 'reformat']),
    prompt: z.string(),
    style: z.string().optional(),
    textToReformat: z.string().optional(),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
    type: z.enum(['text', 'image', 'ideas']),
    data: z.any(),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

const contentGenerationPrompt = ai.definePrompt({
    name: 'contentGenerationPrompt',
    inputSchema: z.object({
        contentType: z.enum(['text', 'image', 'ideas', 'reformat']),
        prompt: z.string(),
        style: z.string().optional(),
        textToReformat: z.string().optional(),
    }),
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
    output: {
        format: 'json',
    }
});


export const generateContent = ai.defineFlow(
  {
    name: 'generateContent',
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
            model: googleAI.model('imagen-4.0-fast-generate-001'),
            prompt: finalPrompt,
        });

        if (!media?.url) {
            throw new Error('Image generation failed to produce an output.');
        }
        return { type: 'image', data: media.url };
    }
        
    const llmResponse = await contentGenerationPrompt(input);
    const resultText = llmResponse.text;
    
    if (input.contentType === 'ideas') {
      try {
        const ideasData = JSON.parse(resultText);
        return { type: 'ideas', data: ideasData };
      } catch (e) {
        throw new Error("L'IA a retourné un format d'idées invalide.");
      }
    }
    
    if (input.contentType === 'reformat') {
      return { type: 'text', data: { reformattedText: resultText } };
    }

    return { type: 'text', data: resultText };
  }
);
