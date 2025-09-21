
'use server';

import { ai } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  GenerateScheduleInputSchema,
  ProjectPlanSchema,
  type GenerateScheduleInput,
  type ProjectPlan,
} from '@/ai/types';
import { z } from 'zod';

export async function createPulseProject(
  input: GenerateScheduleInput
): Promise<ProjectPlan> {
  return pulseProjectFlow(input);
}

const associatedToolsPrompt = `
- "Stratégie & Recherche": 'maestro', 'nexus', 'promptor'
- "Pré-production": 'persona', 'brand-identity', 'muse'
- "Création & Production": 'text', 'image', 'motion', 'sound', 'code', 'frame'
- "Post-production & Lancement": 'deck', 'format', 'convert', 'chat'
`;

const pulseProjectPrompt = ai.definePrompt({
    name: 'pulseProjectPrompt',
    inputSchema: GenerateScheduleInputSchema.extend({
        currentDate: z.string(),
    }),
    output: { schema: ProjectPlanSchema, format: 'json' },
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes Pulse, un chef de projet IA expert en stratégie et en organisation de projets créatifs.
Votre mission est de transformer une simple description de projet en un plan d'action complet et structuré.

**L'intégralité de la réponse, à l'exception des 'imagePrompts', doit être rédigée en français.**

Le plan doit être réaliste, cohérent et inspirant. Il doit donner une vision claire des étapes à suivre.

1.  **Générez un plan de projet** contenant au moins 5 tâches, bien réparties dans des phases logiques (Stratégie, Pré-production, etc.).
2.  **Pour chaque tâche, associez un 'toolId' pertinent**. Le 'toolId' doit être l'identifiant de l'outil (X)OS le plus approprié pour accomplir cette tâche.
    Voici la liste des associations possibles entre les catégories de tâches et les 'toolId' :
    ${associatedToolsPrompt}
    Par exemple, une tâche "Créer les visuels du site" devrait avoir le toolId 'image' ou 'frame'. Une tâche "Écrire l'article de blog" devrait avoir 'text'. Une tâche "Définir l'identité de marque" devrait avoir 'brand-identity'.
3.  Si la description du projet contient des informations sur une date ou une heure, extrayez ces informations et créez des événements d'agenda correspondants. Utilisez la date actuelle comme référence temporelle : {{{currentDate}}}.

Description du projet de l'utilisateur : {{{prompt}}}

Votre réponse DOIT être un objet JSON valide qui respecte le schéma de sortie, incluant le champ 'toolId' pour chaque tâche.`,
});


const pulseProjectFlow = ai.defineFlow(
  {
    name: 'pulseProjectFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: ProjectPlanSchema,
  },
  async (input) => {
    
    const { output } = await pulseProjectPrompt({
        ...input,
        currentDate: new Date().toISOString(),
    });

    if (!output) {
      throw new Error("Pulse n'a pas pu générer de plan de projet.");
    }
    return output;
  }
);
