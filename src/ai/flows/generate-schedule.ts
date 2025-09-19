
'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  GenerateScheduleInputSchema,
  ProjectPlanSchema,
  type GenerateScheduleInput,
  type ProjectPlan,
} from '@/ai/types';
import { z } from 'zod';

export async function generateSchedule(
  input: GenerateScheduleInput
): Promise<ProjectPlan> {
  return scheduleFlow(input);
}

const schedulePrompt = ai.definePrompt({
    name: 'schedulePrompt',
    inputSchema: GenerateScheduleInputSchema.extend({
        currentDate: z.string(),
    }),
    output: { schema: ProjectPlanSchema, format: 'json' },
    prompt: `Vous êtes Maestro, un chef de projet IA expert en stratégie et en organisation de projets créatifs.
Votre mission est de transformer une simple description de projet en un plan d'action complet, structuré et prêt à être exécuté.

**L'intégralité de la réponse, à l'exception des 'imagePrompts', doit être rédigée en français.**

Le plan doit être réaliste, cohérent et inspirant. Il doit donner une vision claire des étapes à suivre.

Si la description du projet contient des informations sur une date ou une heure (par exemple, "pour la semaine prochaine", "une réunion de lancement demain"), vous devez extraire ces informations et créer des événements d'agenda correspondants dans le champ \`events\`. Utilisez la date actuelle comme référence temporelle : {{{currentDate}}}.
Chaque événement doit avoir un titre, une date (YYYY-MM-DD) et une heure (HH:mm).

À partir de la description du projet fournie, vous devez générer un plan complet. Le plan doit contenir au moins 5 tâches, bien réparties dans des phases logiques du projet.

Description du projet de l'utilisateur : {{{prompt}}}

Votre réponse DOIT être un objet JSON valide qui respecte le schéma de sortie.`,
});


const scheduleFlow = ai.defineFlow(
  {
    name: 'scheduleFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: ProjectPlanSchema,
  },
  async (input) => {
    
    const { output } = await schedulePrompt({
        ...input,
        currentDate: new Date().toISOString(),
    });

    if (!output) {
      throw new Error("Maestro n'a pas pu générer de plan de projet.");
    }
    return output;
  }
);
