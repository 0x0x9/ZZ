'use server';

/**
 * @fileOverview Génère un moodboard d'images à partir d'une liste de prompts.
 *
 * - generateMoodboard - Une fonction qui prend une liste de prompts et retourne les données d'image pour chacun.
 */


import type { GenerateMoodboardInput, GenerateMoodboardOutput } from '@/ai/types';
import { generateContent } from './content-generator';
import { ai } from '@/genkit';
import { z } from 'zod';

export const generateMoodboard = ai.defineFlow(
  {
    name: 'generateMoodboard',
    inputSchema: z.object({ prompts: z.array(z.string()) }),
    outputSchema: z.object({ imageDataUris: z.array(z.string()) }),
  },
  async (input) => {
    const imagePromises = input.prompts.map(prompt => generateContent({
      prompt,
      style: 'photorealistic',
      contentType: 'image'
    }));
    const imageResults = await Promise.all(imagePromises);
    const imageDataUris = imageResults.map(result => result.data as string);
    return { imageDataUris };
  }
);
