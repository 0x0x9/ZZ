
'use server';

/**
 * @fileOverview An AI flow for converting image formats.
 *
 * - convertImage - A function that handles image conversion.
 * - ConvertImageInput - The input type for the convertImage function.
 * - ConvertImageOutput - The return type for the convertImage function.
 */

import { ai } from '@/ai/genkit';
import { ConvertImageInputSchema, ConvertImageOutputSchema, type ConvertImageInput, type ConvertImageOutput } from '@/ai/types';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

export async function convertImage(input: ConvertImageInput): Promise<ConvertImageOutput> {
  return convertImageFlow(input);
}

const conversionPrompt = ai.definePrompt({
    name: 'convertImagePrompt',
    input: { schema: ConvertImageInputSchema },
    output: { schema: z.object({
        imageDataUri: z.string().describe("The converted image as a data URI.")
    }) },
    prompt: `You are an expert image processor.
Convert the following image to the format: {{{outputFormat}}}.
{{#if removeTransparency}}The transparency must be removed and replaced with a solid white background.{{/if}}
Return ONLY the data URI of the converted image.

Image: {{media url=image}}
`,
});

const convertImageFlow = ai.defineFlow(
  {
    name: 'convertImageFlow',
    inputSchema: ConvertImageInputSchema,
    outputSchema: ConvertImageOutputSchema,
  },
  async (input) => {
    // In a real implementation, we would use a library like Sharp or a dedicated image processing API.
    // For this prototype, we will simulate the conversion by calling an LLM,
    // which can surprisingly handle basic image transformations.
    // Note: This is not a recommended production approach for performance and cost reasons.
    
    const llmResponse = await ai.generate({
        prompt: `Convert the following image to ${input.outputFormat}. ${input.removeTransparency ? 'Remove transparency and use a white background.' : ''}`,
        model: googleAI.model('gemini-1.5-pro-latest'),
        input: {
            media: {
                url: input.image
            }
        },
        output: {
            format: 'media'
        }
    });
    
    const media = llmResponse.output?.media;
    if (!media || media.length === 0) {
      throw new Error("L'IA n'a pas pu convertir l'image.");
    }

    const convertedImage = media[0];

    return {
        convertedImageUri: convertedImage.url,
        originalMimeType: convertedImage.contentType || `image/${input.outputFormat}`
    };
  }
);
