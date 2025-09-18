
'use server';

import { ai } from '@/ai/genkit';
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

const schedulePrompt = `Vous êtes Maestro, un chef de projet IA expert en stratégie et en organisation de projets créatifs.
Votre mission est de transformer une simple description de projet en un plan d'action complet, structuré et prêt à être exécuté.

**L'intégralité de la réponse, à l'exception des 'imagePrompts', doit être rédigée en français.**

Le plan doit être réaliste, cohérent et inspirant. Il doit donner une vision claire des étapes à suivre.

Si la description du projet contient des informations sur une date ou une heure (par exemple, "pour la semaine prochaine", "une réunion de lancement demain"), vous devez extraire ces informations et créer des événements d'agenda correspondants dans le champ \`events\`. Utilisez la date actuelle comme référence temporelle : {{{currentDate}}}.
Chaque événement doit avoir un titre, une date (YYYY-MM-DD) et une heure (HH:mm).

À partir de la description du projet fournie, vous devez générer un plan complet. Le plan doit contenir au moins 5 tâches, bien réparties dans des phases logiques du projet.

Description du projet de l'utilisateur : {{{prompt}}}

Votre réponse DOIT être un objet JSON valide qui respecte le schéma suivant :
{
  "title": "Un titre créatif et engageant pour le projet.",
  "creativeBrief": "Un paragraphe de 3-4 phrases qui définit la vision, le ton, le style et le public cible du projet.",
  "tasks": [
    {
      "title": "Le titre de la tâche, court et commençant par un verbe d'action.",
      "description": "Une description claire en 1 ou 2 phrases de ce que la tâche implique.",
      "category": "Stratégie & Recherche | Pré-production | Création & Production | Post-production & Lancement",
      "duration": "Une estimation de la durée (ex: '2 jours', '1 semaine').",
      "checklist": [
        { "text": "Sous-tâche 1", "completed": false },
        { "text": "Sous-tâche 2", "completed": false }
      ]
    }
  ],
  "imagePrompts": ["Un prompt d'image en anglais pour le moodboard."],
  "events": [{ "title": "...", "date": "...", "time": "..." }]
}
`;

const scheduleFlow = ai.defineFlow(
  {
    name: 'scheduleFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: ProjectPlanSchema,
  },
  async (input) => {
    
    const finalPrompt = schedulePrompt
      .replace('{{{prompt}}}', input.prompt)
      .replace('{{{currentDate}}}', new Date().toISOString());
      
    const llmResponse = await ai.generate({
      prompt: finalPrompt,
      model: 'googleai/gemini-1.5-pro-latest',
      config: {
        response_mime_type: 'application/json',
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
        ],
      }
    });
    
    const parsed = JSON.parse(llmResponse.text);
    const output = ProjectPlanSchema.parse(parsed);

    if (!output) {
      throw new Error("Maestro n'a pas pu générer de plan de projet.");
    }
    return output;
  }
);
