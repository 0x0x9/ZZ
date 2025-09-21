
'use server';

import {
  generateSchedule,
} from '@/ai/flows/generate-schedule';
import { generateContent } from '@/ai/flows/content-generator';
import { generateMoodboard as generateMoodboardFlow } from '@/ai/flows/generate-moodboard';
import { generateCode } from '@/ai/flows/generate-code';
import { debugCode } from '@/ai/flows/debug-code';
import { explainCode } from '@/ai/flows/explain-code';
import { refactorCode } from '@/ai/flows/refactor-code';
import { createPulseProject } from '@/ai/flows/create-pulse-project';

import { createFolder as createFolderFlow } from '@/ai/flows/create-folder';
import { deleteDocument as deleteDocumentFlow } from '@/ai/flows/delete-document';
import { deleteFolder as deleteFolderFlow } from '@/ai/flows/delete-folder';
import { getSignedUrl as getSignedUrlFlow } from '@/ai/flows/get-signed-url';
import { listDocuments as listDocumentsFlow } from '@/ai/flows/list-documents';
import { renameDocument as renameDocumentFlow } from '@/ai/flows/rename-document';
import { shareDocument as shareDocumentFlow } from '@/ai/flows/share-document';
import { uploadDocument as uploadDocumentFlow } from '@/ai/flows/upload-document';
import { oria } from '@/ai/flows/oria';
import { generateFlux } from '@/ai/flows/generate-flux';
import { generateMotion } from '@/ai/flows/generate-motion';
import { generateDeck } from '@/ai/flows/generate-deck';
import { generateLightMood } from '@/ai/flows/generate-light-mood';
import { generateMuse } from '@/ai/flows/generate-muse';
import { generateNexus } from '@/ai/flows/generate-nexus';
import { generatePalette } from '@/ai/flows/generate-palette';
import { generatePersona } from '@/ai/flows/generate-persona';
import { generateSound } from '@/ai/flows/generate-sound';
import { generateTone } from '@/ai/flows/generate-tone';
import { copilotLyrics } from '@/ai/flows/copilot-lyrics';
import { convertImage } from '@/ai/flows/convert-image';
import { configurePc } from '@/ai/flows/configure-pc';


import type { ProjectPlan, OriaChatInput, OriaChatOutput, GenerateFluxInput, ConfigurePcInput, ConfigurePcOutput, GenerateFluxOutput } from '@/ai/types';
import { ProjectPlanSchema } from '@/ai/types';
import { z } from 'zod';

// Re-exporting flows as server actions
export const createFolder = createFolderFlow;
export const deleteDocument = deleteDocumentFlow;
export const deleteFolder = deleteFolderFlow;
export const getSignedUrl = getSignedUrlFlow;
export const listDocuments = listDocumentsFlow;
export const renameDocument = renameDocumentFlow;
export const shareDocument = shareDocumentFlow;
export const uploadDocument = uploadDocumentFlow;

// Alias original flow names to "Action" for clarity if needed, or just use them directly
export const listDocumentsAction = listDocuments;
export const uploadDocumentAction = uploadDocument;
export const shareDocumentAction = shareDocument;
export const deleteDocumentAction = deleteDocument;
export const createFolderAction = createFolder;
export const deleteFolderAction = deleteFolder;
export const getSignedUrlAction = getSignedUrl;
export const renameDocumentAction = renameDocument;

// AI Actions
export { generateSchedule, generateContent, generateCode, debugCode, explainCode, refactorCode, copilotLyrics, convertImage, generateFlux, generateMotion, generateDeck, generateLightMood, generateMuse, generateNexus, generatePalette, generatePersona, generateSound, generateTone, configurePc, createPulseProject };

export const generateMoodboard = generateMoodboardFlow;

// Specific action wrappers
export async function getActionResult(resultId: string): Promise<{ result: any; prompt?: string } | null> {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(resultId);
    if (stored) {
        try {
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
    // We create a minimal but valid ProjectPlan
    const projectToValidate: ProjectPlan = {
      id: `manual-${Date.now()}`,
      title,
      creativeBrief,
      tasks: [],
      imagePrompts: [],
      events: []
    };
    
    const project: ProjectPlan = projectToValidate;
    
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-').toLowerCase();
    const fileName = `maestro-projets/${sanitizedTitle}.json`;

    const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(project))))}`;
    
    await uploadDocument({ name: fileName, content: dataUri, mimeType: 'application/json' });

    return { success: true, project: project };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: `Erreur de validation: ${error.errors.map(e => e.message).join(', ')}` };
    }
    console.error("Error in createManualProjectAction", error);
    return { success: false, error: (error as Error).message };
  }
}

// Oria chat action remains as it has complex state management with useFormState
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

export async function pulseProjectAction(prevState: any, formData: FormData): Promise<{ success: boolean; result: ProjectPlan | null; error: string | null; prompt: string }> {
  const prompt = formData.get('prompt') as string;
  
  try {
    const result = await createPulseProject({ prompt });

    if (result?.title) {
        const sanitizedTitle = result.title.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-').toLowerCase();
        const fileName = `maestro-projets/${sanitizedTitle}.json`;

        const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(result))))}`;
    
        await uploadDocument({ name: fileName, content: dataUri, mimeType: 'application/json' });
    }

    return { success: true, result, error: null, prompt };
  } catch (e: any) {
    return { success: false, result: null, error: e.message || 'An error occurred', prompt };
  }
}
