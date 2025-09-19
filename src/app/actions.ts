// This file is being deprecated in favor of API routes.
// For now, we are keeping it for non-AI actions or actions that are harder to migrate.

'use server';

import { createFolder as createFolderFlow } from '@/ai/flows/create-folder';
import { deleteDocument as deleteDocumentFlow } from '@/ai/flows/delete-document';
import { deleteFolder as deleteFolderFlow } from '@/ai/flows/delete-folder';
import { getSignedUrl as getSignedUrlFlow } from '@/ai/flows/get-signed-url';
import { listDocuments as listDocumentsFlow } from '@/ai/flows/list-documents';
import { renameDocument as renameDocumentFlow } from '@/ai/flows/rename-document';
import { shareDocument as shareDocumentFlow } from '@/ai/flows/share-document';
import { uploadDocument as uploadDocumentFlow } from '@/ai/flows/upload-document';
import { oria } from '@/ai/flows/oria';

import type { ProjectPlan, OriaChatInput, OriaChatOutput } from '@/ai/types';
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
    const project: ProjectPlan = {
      id: `manual-${Date.now()}`,
      title,
      creativeBrief,
      tasks: [],
      imagePrompts: [],
      events: []
    };
    
    const projectToValidate: ProjectPlan = {
      ...project,
      tasks: project.tasks || [],
      imagePrompts: project.imagePrompts || [],
    };
    
    const validatedProject = ProjectPlanSchema.parse(projectToValidate);

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
