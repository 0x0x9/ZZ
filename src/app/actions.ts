// This file is being deprecated in favor of API routes using @genkit-ai/next.
// For now, we are keeping it for non-AI actions or actions that are harder to migrate.

'use server';

import { createFolder } from '@/ai/flows/create-folder';
import { deleteDocument } from '@/ai/flows/delete-document';
import { deleteFolder } from '@/ai/flows/delete-folder';
import { getSignedUrl } from '@/ai/flows/get-signed-url';
import { listDocuments } from '@/ai/flows/list-documents';
import { renameDocument } from '@/ai/flows/rename-document';
import { shareDocument } from '@/ai/flows/share-document';
import { uploadDocument } from '@/ai/flows/upload-document';
import { parseEvent } from '@/ai/flows/parse-event';
import { generateFlux } from '@/ai/flows/generate-flux';
import { generateSchedule } from '@/ai/flows/generate-schedule';
import { generateCode } from '@/ai/flows/generate-code';
import { generateMotion } from '@/ai/flows/generate-motion';
import { generateContent } from '@/ai/flows/content-generator';
import { generateDeck } from '@/ai/flows/generate-deck';
import { generateLightMood } from '@/ai/flows/generate-light-mood';
import { generateMoodboard } from '@/ai/flows/generate-moodboard';
import { generateMuse } from '@/ai/flows/generate-muse';
import { generateNexus } from '@/ai/flows/generate-nexus';
import { generatePalette } from '@/ai/flows/generate-palette';
import { generatePersona } from '@/ai/flows/generate-persona';
import { generateSound } from '@/ai/flows/generate-sound';
import { generateTone } from '@/ai/flows/generate-tone';
import { generateVoice } from '@/ai/flows/generate-voice';
import { copilotLyrics } from '@/ai/flows/copilot-lyrics';
import { oria } from '@/ai/flows/oria';

import type { ProjectPlan, GenerateFluxOutput, OriaChatInput, OriaChatOutput } from '@/ai/types';
import { ProjectPlanSchema } from '@/ai/types';
import { z } from 'zod';


// AI Actions
export { generateCode, generateSchedule, generateMotion, generateContent, generateDeck, generateLightMood, generateMoodboard, generateMuse, generateNexus, generatePalette, generatePersona, generateSound, generateTone, generateVoice, copilotLyrics };

// Cloud Storage Actions
export { createFolder, deleteDocument, deleteFolder, getSignedUrl, listDocuments, renameDocument, shareDocument, uploadDocument };


// Specific action wrappers
export async function getActionResult(resultId: string): Promise<{ result: any; prompt?: string } | null> {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(resultId);
    if (stored) {
        try {
            // We don't remove it anymore, to allow re-opening the same result
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse stored result", e);
            return null;
        }
    }
    return null;
}

export async function createManualProjectAction(prevState: any, formData: FormData): Promise<{ success: boolean; project?: ProjectPlan; error?: string }> {
  const title = formData.get('title') as string;
  const creativeBrief = formData.get('creativeBrief') as string;

  if (!title || !creativeBrief) {
    return { success: false, error: "Le titre et le brief sont requis." };
  }
  
  try {
    const project: ProjectPlan = {
      id: `manual-${Date.now()}`,
      title,
      creativeBrief,
      tasks: [],
      imagePrompts: [],
      events: []
    };
    
    // This will fail because tasks and imagePrompts might be empty, but the schema requires them.
    // Let's adjust the object to satisfy the schema for validation purposes, even if fields are empty.
    const projectToValidate: ProjectPlan = {
      ...project,
      tasks: project.tasks || [],
      imagePrompts: project.imagePrompts || [],
    };
    
    const validatedProject = ProjectPlanSchema.parse(projectToValidate);

    // Simulate saving the project
    const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(validatedProject))))}`;
    await uploadDocument({ name: `maestro-projets/${validatedProject.title}.json`, content: dataUri, mimeType: 'application/json' });

    return { success: true, project: validatedProject };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: `Erreur de validation: ${error.errors.map(e => e.message).join(', ')}` };
    }
    return { success: false, error: (error as Error).message };
  }
}

export async function oriaChatAction(prevState: any, formData: FormData): Promise<{ id: number, result: OriaChatOutput | null, error: string | null, message: 'success' | 'error' }> {
  const prompt = formData.get('prompt') as string;
  const context = formData.get('context') as OriaChatInput['context'];
  const historyString = formData.get('history') as string;

  let history: OriaChatInput['history'] = [];
  try {
    if (historyString) {
      history = JSON.parse(historyString);
    }
  } catch (e) {
    console.error("Failed to parse chat history", e);
    return { id: prevState.id + 1, result: null, error: "L'historique de la conversation est invalide.", message: 'error' };
  }
  
  try {
    const result = await oria({ prompt, context, history });
    return { id: prevState.id + 1, result, error: null, message: 'success' };
  } catch (e: any) {
    console.error("Oria chat action failed:", e);
    return { id: prevState.id + 1, result: null, error: e.message || "Une erreur est survenue lors de l'appel à Oria.", message: 'error' };
  }
}


// Re-exporting for client components that might still use them, but these should be migrated.
export const listDocumentsAction = listDocuments;
export const uploadDocumentAction = uploadDocument;
export const shareDocumentAction = shareDocument;
export const deleteDocumentAction = deleteDocument;
export const createFolderAction = createFolder;
export const deleteFolderAction = deleteFolder;
export const getSignedUrlAction = getSignedUrl;
export const renameDocumentAction = renameDocument;
export const parseEventAction = parseEvent;


// Flux Action - An example of how to handle more complex state with useFormState
// We return the full state to be able to use it on the client
export async function fluxAction(prevState: any, formData: FormData): Promise<{
    id: number,
    result: GenerateFluxOutput | null,
    error: string | null,
    prompt: string,
    job: string
}> {
    const prompt = formData.get('prompt') as string;
    const job = formData.get('job') as string;

    if (!prompt) {
        return { ...prevState, error: 'Le prompt est requis.' };
    }
    
    try {
        const result = await generateFlux({ prompt, job });
        return { id: prevState.id + 1, result, error: null, prompt, job };
    } catch (e: any) {
        console.error(e);
        return { id: prevState.id + 1, result: null, error: e.message || "Une erreur est survenue.", prompt, job };
    }
}
