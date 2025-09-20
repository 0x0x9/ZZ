
'use server';
/**
 * @fileOverview Un agent IA qui génère du son, (X)sound.
 *
 * - generateSound - Une fonction qui prend une description et génère un son.
 * NOTE: Ce flow est une simulation. Le modèle de génération de musique n'étant pas disponible,
 * l'IA décrit le son demandé et cette description est convertie en parole.
 */

import { ai } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';
import {
  GenerateSoundInputSchema,
  GenerateSoundOutputSchema,
  type GenerateSoundInput,
  type GenerateSoundOutput,
} from '@/ai/types';
import { z } from 'zod';


export async function generateSound(input: GenerateSoundInput): Promise<GenerateSoundOutput> {
  return soundFlow(input);
}

const SoundDescriptionSchema = z.object({
  description: z.string().describe("Une description onomatopéique et textuelle du son demandé, qui sera lue à voix haute. Par exemple, pour 'un laser', la description pourrait être 'Piiouuu ! Un son de laser aigu et rapide.'"),
});

const descriptionPrompt = ai.definePrompt({
  name: 'soundDescriptionPrompt',
  input: { schema: GenerateSoundInputSchema },
  output: { schema: SoundDescriptionSchema, format: 'json' },
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `Vous êtes un bruiteur expert. Un utilisateur vous demande de créer un son. Comme vous ne pouvez pas créer le son directement, vous allez le décrire de la manière la plus vivante possible, en utilisant des onomatopées.

La demande est : {{{prompt}}}

Votre réponse doit être au format JSON.
`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) { bufs.push(d); });
    writer.on('end', function () { resolve(Buffer.concat(bufs).toString('base64')); });

    writer.write(pcmData);
    writer.end();
  });
}

const soundFlow = ai.defineFlow(
  {
    name: 'soundFlow',
    inputSchema: GenerateSoundInputSchema,
    outputSchema: GenerateSoundOutputSchema,
  },
  async (input) => {
    // 1. Generate a text description of the sound
    const { output: descriptionOutput } = await descriptionPrompt(input);
    if (!descriptionOutput) {
      throw new Error("(X)sound n'a pas pu générer de description sonore.");
    }

    // 2. Convert the description to speech
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Achernar' },
                },
            },
        },
        prompt: descriptionOutput.description,
    });
    
    if (!media) {
        throw new Error('La génération de la voix a échoué.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavAudioBase64 = await toWav(audioBuffer);
    const audioDataUri = 'data:audio/wav;base64,' + wavAudioBase64;
    
    return {
      audioDataUri,
      description: descriptionOutput.description,
    };
  }
);

    