
// This file re-exports all the server actions for the client components.
// It simplifies the import paths and provides a single entry point for all server-side logic.

export { generateCode } from '@/ai/flows/generate-code';
export { explainCode } from '@/ai/flows/explain-code';
export { debugCode } from '@/ai/flows/debug-code';
export { refactorCode } from '@/ai/flows/refactor-code';
export { generateFlux } from '@/ai/flows/generate-flux';
export { generateSchedule } from '@/ai/flows/generate-schedule';
export { generatePalette } from '@/ai/flows/generate-palette';
export { generateTone } from '@/ai/flows/generate-tone';
export { generatePersona } from '@/ai/flows/generate-persona';
export { generateMotion } from '@/ai/flows/generate-motion';
export { generateVoice } from '@/ai/flows/generate-voice';
export { generateDeck } from '@/ai/flows/generate-deck';
export { generateFrame } from '@/ai/flows/generate-frame';
export { generateSound } from '@/ai/flows/generate-sound';
export { generateNexus } from '@/ai/flows/generate-nexus';
export { generateLightMood } from '@/ai/flows/generate-light-mood';
export { generateMoodboard } from '@/ai/flows/generate-moodboard';
export { copilotLyrics } from '@/ai/flows/copilot-lyrics';
export { generateMuse } from '@/ai/flows/generate-muse';
export { createFolder } from '@/ai/flows/create-folder';
export { deleteDocument } from '@/ai/flows/delete-document';
export { deleteFolder } from '@/ai/flows/delete-folder';
export { getSignedUrl } from '@/ai/flows/get-signed-url';
export { listDocuments } from '@/ai/flows/list-documents';
export { renameDocument } from '@/ai/flows/rename-document';
export { shareDocument } from '@/ai/flows/share-document';
export { uploadDocument } from '@/ai/flows/upload-document';
export { oria } from '@/ai/flows/oria';

// Specific action wrappers
import { generateContent as generateContentFlow } from '@/ai/flows/content-generator';
import type { GenerateContentOutput, ReformatTextWithPromptOutput } from '@/ai/types';

export async function generateContent(prevState: any, formData: FormData): Promise<{ id: number, type: string, data: string | GenerateContentOutput['data'] | null, error: string | null }> {
  try {
    const contentType = formData.get('contentType') as 'text' | 'image' | 'ideas' | 'reformat';
    const prompt = formData.get('prompt') as string;
    const style = formData.get('style') as string | undefined;
    const textToReformat = formData.get('textToReformat') as string | undefined;
    
    const result = await generateContentFlow({ contentType, prompt, style, textToReformat });
    return { id: Date.now(), type: result.type, data: result.data, error: null };
  } catch (error: any) {
    return { id: Date.now(), type: 'error', data: null, error: error.message };
  }
}

import { convertImage as convertImageFlow } from '@/ai/flows/convert-image';
import type { ConvertImageOutput } from '@/ai/types';

export async function convertImage(prevState: any, formData: FormData): Promise<{id: number, result: ConvertImageOutput | null, error: string | null}> {
    try {
        const image = formData.get('image') as string;
        const outputFormat = formData.get('outputFormat') as 'jpeg' | 'png' | 'webp';
        const removeTransparency = formData.get('removeTransparency') === 'on';

        if (!image) throw new Error("Image non fournie.");
        if (!outputFormat) throw new Error("Format de sortie non spécifié.");

        const result = await convertImageFlow({ image, outputFormat, removeTransparency });
        return { id: Date.now(), result, error: null };
    } catch(e: any) {
        return { id: Date.now(), result: null, error: e.message };
    }
}


// We keep the alias for chat for simplicity in the client
export { oria as oriaChatAction } from '@/ai/flows/oria';

// Specific action that needs a different name or signature can be wrapped.
import { uploadDocument as uploadMuseDoc } from '@/ai/flows/upload-document';
export const uploadMuseDocumentAction = uploadMuseDoc;

import { generateSchedule as genSchedule } from '@/ai/flows/generate-schedule';
import { ProjectPlanSchema, type ProjectPlan } from '@/ai/types';
import { z } from 'zod';
// Wrapper for manual project creation
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
    await uploadMuseDoc({ name: `maestro-projets/${validatedProject.title}.json`, content: dataUri, mimeType: 'application/json' });

    return { success: true, project: validatedProject };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: `Erreur de validation: ${error.errors.map(e => e.message).join(', ')}` };
    }
    return { success: false, error: (error as Error).message };
  }
}

import { parseEvent } from '@/ai/flows/parse-event';
import type { AgendaEvent } from '@/ai/types';
// Wrapper for parseEvent
export async function parseEventAction(prevState: any, formData: FormData): Promise<{ id: number; success: boolean; event: AgendaEvent | null; error: string | null }> {
  const prompt = formData.get('prompt') as string;
  try {
    const event = await parseEvent({ prompt, currentDate: new Date().toISOString() });
    return { id: Date.now(), success: true, event, error: null };
  } catch (error: any) {
    return { id: Date.now(), success: false, event: null, error: error.message };
  }
}

import { generateCode as genCode } from '@/ai/flows/generate-code';
export const generateCodeAction = genCode;
import { debugCode as dbgCode } from '@/ai/flows/debug-code';
export const debugCodeAction = dbgCode;
import { explainCode as explCode } from '@/ai/flows/explain-code';
export const explainCodeAction = explCode;
import { refactorCode as refacCode } from '@/ai/flows/refactor-code';
export const refactorCodeAction = refacCode;

import { generateFrame as genFrame } from '@/ai/flows/generate-frame';
import type { GenerateFrameOutput } from '@/ai/types';

export async function generateFrameAction(prevState: any, formData: FormData): Promise<{ id: number; result: GenerateFrameOutput | null; error: string | null; message: string; }> {
  try {
    const prompt = formData.get('prompt') as string;
    const photoDataUri = formData.get('photoDataUri') as string;
    
    const result = await genFrame({ prompt, photoDataUri });
    return { id: Date.now(), result, error: null, message: 'success' };
  } catch (error: any) {
    return { id: Date.now(), result: null, error: error.message, message: 'error' };
  }
}

export const generateScheduleAction = genSchedule;

import { listDocuments as listDocs } from '@/ai/flows/list-documents';
export const listDocumentsAction = listDocs;

import { uploadDocument as uploadDoc } from '@/ai/flows/upload-document';
export const uploadDocumentAction = uploadDoc;

import { shareDocument as shareDoc } from '@/ai/flows/share-document';
export const shareDocumentAction = shareDoc;

import { deleteDocument as delDoc } from '@/ai/flows/delete-document';
export const deleteDocumentAction = delDoc;

import { createFolder as createFold } from '@/ai/flows/create-folder';
export const createFolderAction = createFold;

import { deleteFolder as delFold } from '@/ai/flows/delete-folder';
export const deleteFolderAction = delFold;

import { getSignedUrl as getUrl } from '@/ai/flows/get-signed-url';
export const getSignedUrlAction = getUrl;

import { renameDocument as renDoc } from '@/ai/flows/rename-document';
export const renameDocumentAction = renDoc;

import { generateFlux as genFlux } from '@/ai/flows/generate-flux';
import type { GenerateFluxOutput } from '@/ai/types';
export async function fluxAction(prevState: any, formData: FormData): Promise<{ id: number, result: GenerateFluxOutput | null, error: string | null, prompt: string, job: string }> {
  const prompt = formData.get('prompt') as string;
  const job = formData.get('job') as string;
  try {
    const result = await genFlux({ prompt, job });
    return { id: Date.now(), result, error: null, prompt, job };
  } catch (error: any) {
    return { id: Date.now(), result: null, error: error.message, prompt, job };
  }
}

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

export async function reformatTextAction(prevState: any, formData: FormData): Promise<{ message: string; error: string | null, result: ReformatTextWithPromptOutput | null, id: number }> {
    const text = formData.get('text') as string;
    const prompt = formData.get('prompt') as string;
    try {
        const result = await generateContentFlow({ contentType: 'reformat', prompt, textToReformat: text });
        return { message: 'success', error: null, result: result.data as ReformatTextWithPromptOutput, id: Date.now() };
    } catch (e: any) {
        return { message: 'error', error: e.message, result: null, id: Date.now() };
    }
}
