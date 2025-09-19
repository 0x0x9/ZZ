
'use server';

import {
  GenerateFluxInputSchema,
  type GenerateFluxInput,
  FluxAnalysisOutputSchema,
  GenerateFluxOutputSchema,
  type GenerateFluxOutput,
} from '@/ai/types';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { generateSchedule } from './generate-schedule';
import { generatePalette } from './generate-palette';
import { generateTone } from './generate-tone';
import { generatePersona } from './generate-persona';
import { generateContent } from './content-generator';
import { generateDeck } from './generate-deck';
import { generateFrame } from './generate-frame';
import { generateMotion } from './generate-motion';
import { generateNexus } from './generate-nexus';
import { generateCode } from './generate-code';
import { parseEvent } from './parse-event';

export async function generateFlux(input: GenerateFluxInput): Promise<GenerateFluxOutput> {
  return generateFluxFlow(input);
}

const analysisPrompt = ai.definePrompt({
    name: 'fluxAnalysisPrompt',
    inputSchema: z.object({
        prompt: z.string(),
        job: z.string().optional(),
    }),
    output: { schema: FluxAnalysisOutputSchema },
    prompt: `Vous êtes un chef de projet expert et un stratège créatif. Votre rôle est d'analyser la demande d'un utilisateur et de sélectionner la combinaison d'outils la plus pertinente pour réaliser son projet, en tenant compte de son métier.

Demande de l'utilisateur : {{{prompt}}}
Métier de l'utilisateur : {{{job}}}

Voici les outils disponibles et leur fonction :
- projectPlan: Crée un plan de projet détaillé avec un brief créatif et des tâches. **Cet outil est essentiel et doit TOUJOURS être inclus.**
- palette: Génère une palette de couleurs. Essentiel pour les designers, artistes, projets de marque.
- tone: Définit le ton de voix de la marque. Crucial pour les rédacteurs, marketeurs, communicants.
- personas: Crée des profils d'utilisateurs cibles. Utile pour les chefs de produit, UX designers, marketeurs.
- ideas: Propose des idées créatives, des titres, des styles. Utile en début de projet pour l'inspiration.
- deck: Construit une présentation (diapositives). Utile pour les entrepreneurs, consultants, chefs de projet.
- frame: Génère une maquette d'interface utilisateur (HTML/CSS). À utiliser pour les développeurs web, UI/UX designers.
- text: Rédige du contenu textuel. Parfait pour les rédacteurs, journalistes, créateurs de contenu.
- motion: Crée un script de vidéo. Idéal pour les vidéastes, réalisateurs, publicitaires.
- nexus: Bâtit une carte mentale. Utile pour les stratèges, chercheurs, étudiants.
- code: Génère un extrait de code. Pour les développeurs, ingénieurs logiciels.
- agenda: Planifie des événements. Utile si la demande mentionne des dates.

Adaptez votre sélection au métier. Exemples :
- Si l'utilisateur est **Rédactrice mode** et veut "lancer un article sur les tendances estivales", incluez 'projectPlan', 'tone', 'text', 'ideas', et 'nexus'.
- Si l'utilisateur est **Réalisateur** et veut "préparer un court-métrage de science-fiction", incluez 'projectPlan', 'motion', 'deck' (pour le pitch), 'ideas' et 'palette' (pour l'ambiance visuelle).
- Si l'utilisateur est **Développeur** et veut "créer un portfolio en ligne", incluez 'projectPlan', 'frame', 'code', 'text', et 'palette'.

Analysez la demande et le métier pour retourner la liste des ID d'outils les plus pertinents. La réponse DOIT être un objet JSON valide qui respecte le schéma : { "tools": ["tool1", "tool2", ...] }`,
});


const generateFluxFlow = ai.defineFlow(
  {
    name: 'fluxFlow',
    inputSchema: GenerateFluxInputSchema,
    outputSchema: GenerateFluxOutputSchema,
  },
  async (input) => {
    // Phase 1: Analyse de la demande pour choisir les outils
    const { output: analysis } = await analysisPrompt({
        prompt: input.prompt,
        job: input.job || 'non spécifié',
    });

    if (!analysis?.tools) {
      throw new Error(
        "(X)flux n'a pas pu déterminer les outils nécessaires pour votre projet."
      );
    }

    // Phase 2: Génération du plan de projet, qui est la base de tout
    // Nous le faisons en premier pour obtenir le brief créatif
    const projectPlan = await generateSchedule({ prompt: input.prompt });

    const toolsToRun = new Set(analysis.tools);
    const output: Partial<GenerateFluxOutput> = {};
    const toolPromises: { [key: string]: Promise<any> } = {};

    output.projectPlan = projectPlan;

    // Use a fallback if title or brief are not generated
    const projectTitle = projectPlan?.title || input.prompt;
    const projectBrief = projectPlan?.creativeBrief || 'Aucun brief créatif généré.';

    // Construct a more detailed context prompt for sub-generators
    const fullContextPrompt = `Pour un projet avec l'objectif suivant : "${input.prompt}", un plan a été généré. Le titre du projet est "${projectTitle}" et son brief créatif est : "${projectBrief}". Sur cette base, effectue la tâche suivante :`;

    // Phase 3: Préparation des promesses pour les outils sélectionnés
    const toolGeneratorMap: {
      [key: string]: (p: { prompt: string }) => Promise<any>;
    } = {
      palette: (p) =>
        generatePalette({ prompt: `${p.prompt} génère une palette de couleurs.` }),
      tone: (p) =>
        generateTone({ prompt: `${p.prompt} définis la voix de la marque.` }),
      personas: (p) =>
        generatePersona({ prompt: `${p.prompt} crée les personas cibles.` }),
      ideas: (p) =>
        generateContent({
          contentType: 'ideas',
          prompt: `${p.prompt} propose des idées créatives (titres, styles, prompts d'image).`,
        }).then(res => res.data),
      deck: (p) =>
        generateDeck({
          prompt: `${p.prompt} crée une présentation de lancement.`,
        }),
      frame: (p) =>
        generateFrame({ prompt: `${p.prompt} crée une landing page.` }),
      text: (p) =>
        generateContent({
          contentType: 'text',
          prompt: `${p.prompt} rédige un article de blog pour annoncer le lancement.`,
        }).then(res => ({ text: res.data })),
      motion: (p) =>
        generateMotion({ prompt: `${p.prompt} crée une courte vidéo teaser.` }),
      nexus: (p) =>
        generateNexus({ prompt: `${p.prompt} crée une carte mentale.` }),
      code: (p) =>
        generateCode({
          prompt: `Basé sur le projet "${projectTitle}", génère un composant React simple avec TailwindCSS qui affiche le titre et le brief du projet : "${projectBrief}"`,
          language: 'typescript',
        }),
      agenda: (_) =>
        parseEvent({
          prompt: `Planifier une réunion de lancement pour "${projectTitle}" demain à 10h`,
          currentDate: new Date().toISOString(),
        }),
    };

    for (const tool of toolsToRun) {
      const toolKey = tool as string;
      if (toolKey !== 'projectPlan' && toolGeneratorMap[toolKey]) {
        toolPromises[toolKey] = toolGeneratorMap[toolKey]({
          prompt: fullContextPrompt,
        });
      }
    }

    // Phase 4: Exécution des promesses et assemblage des résultats
    const toolNames = Object.keys(toolPromises);
    const results = await Promise.allSettled(Object.values(toolPromises));

    results.forEach((result, index) => {
      const toolName = toolNames[index] as keyof GenerateFluxOutput;
      if (result.status === 'fulfilled') {
        // Special case for agenda which needs to be an array
        if (toolName === 'agenda') {
          output[toolName] = [result.value];
        } else {
          (output as any)[toolName] = result.value;
        }
      } else {
        console.warn(`(X)flux: L'outil '${toolName}' a échoué.`, result.reason);
        // On ne fait rien, le champ restera undefined.
      }
    });

    return output;
  }
);
