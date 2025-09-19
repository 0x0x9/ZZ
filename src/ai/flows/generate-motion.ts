

'use server';

/**
 * @fileOverview Un agent IA de création de vidéo appelé (X)motion.
 *
 * - generateMotion - Une fonction qui prend un prompt et génère un script, des images et une voix off.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GenerateMotionInputSchema, GenerateMotionOutputSchema, type GenerateMotionInput, type GenerateMotionOutput } from '@/ai/types';

export async function generateMotion(input: GenerateMotionInput): Promise<GenerateMotionOutput> {
  return generateMotionFlow(input);
}

const motionPrompt = ai.definePrompt({
    name: 'motionPrompt',
    inputSchema: GenerateMotionInputSchema,
    outputSchema: GenerateMotionOutputSchema,
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes (X)motion, un réalisateur IA. Votre tâche est de transformer l'idée d'un utilisateur en un court script vidéo.
Le script doit avoir un titre et entre 3 et 6 scènes distinctes.
Le titre et la narration doivent être en **français**.

Vous devez générer :
1.  Un titre pour la vidéo.
2.  Un 'coverImagePrompt': un prompt d'image unique et détaillé, **en anglais**, pour générer une image de couverture pour la vidéo. Ce prompt doit capturer l'essence de toute la vidéo.
3.  Une liste de scènes. Pour chaque scène, écrivez uniquement une narration courte (1-2 phrases).

La réponse complète doit être au format JSON valide.

Idée de l'utilisateur : {{{prompt}}}`,
    output: {
        format: 'json',
    },
});

const generateMotionFlow = ai.defineFlow(
  {
    name: 'generateMotionFlow',
    inputSchema: GenerateMotionInputSchema,
    outputSchema: GenerateMotionOutputSchema,
  },
  async (input) => {
    const { output } = await motionPrompt(input);
    if (!output) {
      throw new Error("(X)motion n'a pas pu générer de script. Veuillez réessayer.");
    }
    return output;
  }
);
