
'use server';
/**
 * @fileOverview Un agent IA qui transforme du texte en parole (TTS), (X)voice.
 *
 * - generateVoice - Une fonction qui prend du texte et retourne des données audio.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';
import {
  GenerateVoiceInputSchema,
  GenerateVoiceOutputSchema,
  type GenerateVoiceInput,
  type GenerateVoiceOutput,
} from '@/ai/types';

export async function generateVoice(input: GenerateVoiceInput): Promise<GenerateVoiceOutput> {
  return voiceFlow(input);
}

// Helper function to convert PCM audio buffer to WAV format
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

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => bufs.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const voiceFlow = ai.defineFlow(
  {
    name: 'voiceFlow',
    inputSchema: GenerateVoiceInputSchema,
    outputSchema: GenerateVoiceOutputSchema,
  },
  async ({ text, voice }) => {
    // Generate speech using the specified voice
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('La génération de la voix a échoué.');
    }

    // The audio is returned as a base64 encoded PCM data URI. We need to convert it to WAV.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavAudioBase64 = await toWav(audioBuffer);
    const audioDataUri = 'data:audio/wav;base64,' + wavAudioBase64;

    return { audioDataUri };
  }
);
