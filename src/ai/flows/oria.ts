
'use server';

/**
 * @fileOverview Oria, une IA d'orientation qui redirige les utilisateurs vers le bon outil ou donne des conseils.
 *
 * - oria - Une fonction qui analyse la demande d'un utilisateur et recommande un outil ou fournit une réponse directe.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  OriaChatInputSchema,
  type OriaChatInput,
  OriaChatOutputSchema,
  type OriaChatOutput,
  GenerateTextInputSchema,
  GenerateTextOutputSchema,
  GeneratePaletteInputSchema,
  GeneratePaletteOutputSchema,
  GenerateToneInputSchema,
  GenerateToneOutputSchema,
  GeneratePersonaInputSchema,
  GeneratePersonaOutputSchema,
  GenerateIdeasInputSchema,
  GenerateIdeasOutputSchema,
  GenerateMotionInputSchema,
  GenerateMotionOutputSchema,
  VideoScriptSchema,
  GenerateVoiceInputSchema,
  GenerateVoiceOutputSchema,
  GenerateCodeInputSchema,
  GenerateCodeOutputSchema,
  GenerateDeckInputSchema,
  GenerateDeckOutputSchema,
  GenerateFrameInputSchema,
  GenerateFrameOutputSchema,
  GenerateSoundInputSchema,
  GenerateSoundOutputSchema,
  GenerateNexusInputSchema,
  GenerateNexusOutputSchema,
  GenerateFluxOutputSchema
} from '@/ai/types';

import { generateContent } from './content-generator';
import { generatePalette } from './generate-palette';
import { generateTone } from './generate-tone';
import { generatePersona } from './generate-persona';
import { generateMotion } from './generate-motion';
import { generateVoice } from './generate-voice';
import { generateCode } from './generate-code';
import { generateDeck } from './generate-deck';
import { generateFrame } from './generate-frame';
import { generateSound } from './generate-sound';
import { generateNexus } from './generate-nexus';
import { generateFlux } from './generate-flux';

export async function oria(
  input: OriaChatInput
): Promise<OriaChatOutput> {
  return oriaRouterFlow(input);
}

// Tools that the AI can call
const textTool = ai.defineTool(
  {
    name: 'text',
    description:
      "Génère du contenu textuel comme des articles, des poèmes, des scripts ou tout autre contenu textuel. À utiliser pour l'écriture créative ou la génération de contenu.",
    inputSchema: GenerateTextInputSchema,
    outputSchema: GenerateTextOutputSchema,
  },
  async (input) => {
      const result = await generateContent({ contentType: 'text', prompt: input.prompt });
      return { text: result.data as string };
  }
);

const paletteTool = ai.defineTool(
  {
    name: 'palette',
    description:
      "Génère une palette de couleurs harmonieuse à partir d'un thème ou d'une description.",
    inputSchema: GeneratePaletteInputSchema,
    outputSchema: GeneratePaletteOutputSchema,
  },
  async (input) => generatePalette(input)
);

const toneTool = ai.defineTool(
  {
    name: 'tone',
    description: "Définit le ton de voix d'une marque ou d'un projet.",
    inputSchema: GenerateToneInputSchema,
    outputSchema: GenerateToneOutputSchema,
  },
  async (input) => generateTone(input)
);

const personaTool = ai.defineTool(
  {
    name: 'persona',
    description:
      "Crée des profils d'utilisateurs (personas) pour un projet ou un produit donné.",
    inputSchema: GeneratePersonaInputSchema,
    outputSchema: GeneratePersonaOutputSchema,
  },
  async (input) => generatePersona(input)
);

const promptorTool = ai.defineTool(
  {
    name: 'promptor',
    description:
      "Transforme une idée vague ou un concept en plusieurs pistes créatives concrètes, y compris des prompts d'image, des titres et des styles.",
    inputSchema: GenerateIdeasInputSchema,
    outputSchema: GenerateIdeasOutputSchema,
  },
  async (input) => {
      const result = await generateContent({ contentType: 'ideas', prompt: input.prompt });
      return result.data as GenerateIdeasOutput;
  }
);

const motionTool = ai.defineTool(
  {
    name: 'motion',
    description:
      "Crée une courte vidéo (script, images, voix off) à partir d'une idée ou d'une description.",
    inputSchema: GenerateMotionInputSchema,
    outputSchema: GenerateMotionOutputSchema,
  },
  async (input) => generateMotion(input)
);

const voiceTool = ai.defineTool(
  {
    name: 'voice',
    description: 'Convertit du texte en parole (TTS).',
    inputSchema: GenerateVoiceInputSchema,
    outputSchema: GenerateVoiceOutputSchema,
  },
  async (input) => generateVoice(input)
);

const codeTool = ai.defineTool(
  {
    name: 'code',
    description:
      "Génère un extrait de code dans un langage de programmation spécifique. L'utilisateur doit spécifier le langage.",
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async (input) => generateCode(input)
);

const deckTool = ai.defineTool(
  {
    name: 'deck',
    description: 'Génère une présentation complète (diapositives) sur un sujet donné.',
    inputSchema: GenerateDeckInputSchema,
    outputSchema: GenerateDeckOutputSchema,
  },
  async (input) => generateDeck(input)
);

const frameTool = ai.defineTool(
  {
    name: 'frame',
    description: "Génère une maquette (wireframe) HTML et CSS (Tailwind) à partir d'une description.",
    inputSchema: GenerateFrameInputSchema,
    outputSchema: GenerateFrameOutputSchema,
  },
  async (input) => generateFrame(input)
);

const soundTool = ai.defineTool(
  {
    name: 'sound',
    description: "Génère un son, une musique ou un effet sonore à partir d'une description.",
    inputSchema: GenerateSoundInputSchema,
    outputSchema: GenerateSoundOutputSchema,
  },
  async (input) => generateSound(input)
);

const nexusTool = ai.defineTool(
  {
    name: 'nexus',
    description: "Génère une carte mentale hiérarchique à partir d'une idée ou d'un sujet.",
    inputSchema: GenerateNexusInputSchema,
    outputSchema: GenerateNexusOutputSchema,
  },
  async (input) => generateNexus(input)
);

const fluxTool = ai.defineTool(
  {
    name: 'flux',
    description:
      "Génère un projet complexe complet à partir d'une simple idée. À utiliser lorsque l'utilisateur veut 'lancer', 'créer', 'organiser' un projet entier comme une marque, une campagne, etc. Cet outil retourne plusieurs livrables.",
    inputSchema: z.object({ prompt: z.string(), job: z.string().optional() }),
    outputSchema: GenerateFluxOutputSchema,
  },
  async (input) => generateFlux(input)
);

// The main prompt that guides Oria
const oriaRouterSystemPrompt = `Vous êtes Oria, l'IA chef d'orchestre de la plateforme (X)yzz. Votre mission est de comprendre le besoin de l'utilisateur et de mobiliser les outils nécessaires pour y répondre. Votre réponse doit être **exclusivement** un objet JSON valide.

**CONTEXTE ACTUEL : {{{context}}}**

Vous avez 3 options principales :

1.  **UTILISER UN OUTIL (pour une création)** :
    *   **Quand l'utiliser ?**
        *   Pour toute demande de création **simple et directe** (ex: 'génère une image', 'écris un poème', 'donne-moi une palette de couleurs sur le thème de l'océan').
        *   **IMPÉRATIF**: Pour les **projets complexes** (ex: 'lance ma marque', 'crée une campagne publicitaire'), vous devez **utiliser l'outil 'flux'**.
    *   **Action** : Appelez l'outil approprié. Votre réponse doit être de type 'tool_result' ou 'redirect' si la réponse de l'outil est trop complexe pour être affichée directement.
    *   **Si l'outil appelé est 'flux', la réponse doit être un 'redirect' vers 'flux'.**

2.  **REDIRIGER VERS UNE APPLICATION (pour ouvrir une interface)** :
    *   **Quand l'utiliser ?** Quand l'utilisateur demande explicitement d'**ouvrir une application** (ex: 'ouvre l'éditeur de code', 'lance Maestro').
    *   **Action** : Votre réponse doit être de type 'redirect'.
        *   Utilisez le champ 'tool' pour spécifier la destination ('editor', 'flux', etc.).
        *   Utilisez le champ 'promptForTool' pour passer la demande de l'utilisateur à l'application.

3.  **RÉPONDRE (pour une conversation)** :
    *   **Quand l'utiliser ?** Pour les salutations, les questions générales sur vos capacités, ou toute interaction qui n'est ni une création, ni une redirection.
    *   **Action** : Votre réponse doit être de type 'response'.

**RÈGLES IMPORTANTES**:
- **La distinction est cruciale**: Si la demande est de **créer, générer, ou concevoir un projet complexe**, la réponse DOIT être un appel à l'outil 'flux', qui résultera en une redirection vers 'flux'.
- **Fusion**: Si l'utilisateur demande d'ouvrir (X)fusion, redirigez vers 'fusion'. Si l'utilisateur demande de combiner des outils, redirigez vers 'fusion' en listant les IDs des outils dans 'promptForTool'.
- **Spécificités des outils**: Pour 'voice', utilisez la voix par défaut 'Algenib'. Pour 'code', déduisez le 'language' de la demande.
- **Historique**: Tenez compte des messages précédents pour garder le contexte de la conversation.

Requête de l'utilisateur : {{{prompt}}}
`;

const oriaRouterFlow = ai.defineFlow(
  {
    name: 'oriaRouterFlow',
    inputSchema: OriaChatInputSchema,
    outputSchema: OriaChatOutputSchema,
  },
  async (input) => {
    
    // Robust history processing: ensures each message is valid and has string content.
    const history = (input.history ?? [])
        .map(h => {
            if (!h || typeof h !== 'object' || !h.role) return null;
            let content = '';
            if (h.content) {
                 content = typeof h.content === 'string' ? h.content : JSON.stringify(h.content);
            }
            if (content.trim() === '') return null;

            return { role: h.role, content };
        })
        .filter((h): h is { role: 'user' | 'model'; content: string } => h !== null);
    
    const systemPrompt = oriaRouterSystemPrompt
      .replace('{{{prompt}}}', input.prompt)
      .replace('{{{context}}}', input.context || 'non spécifié');

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-pro-latest',
        prompt: input.prompt,
        system: systemPrompt,
        history,
        tools: [
          textTool, paletteTool, toneTool, personaTool, promptorTool, motionTool,
          voiceTool, codeTool, deckTool, frameTool, soundTool, nexusTool, fluxTool,
        ],
        output: {
            schema: OriaChatOutputSchema,
        },
        config: {
          safetySettings: [
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_ONLY_HIGH',
            },
          ],
        },
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("Oria n'a pas pu traiter la demande. Veuillez réessayer.");
    }
    
    // If a flux project was generated, convert the output to a redirect instruction
    if (output.type === 'tool_result' && output.tool === 'flux') {
        return {
            type: 'redirect',
            tool: 'flux',
            response: "Votre projet a été généré ! Je prépare votre espace de travail (X)OS.",
            promptForTool: input.prompt,
            data: output.data,
        };
    }
    
    return output;
  }
);

    