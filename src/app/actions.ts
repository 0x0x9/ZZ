
'use server';

import { z } from 'zod';
import type {
  GenerateCodeOutput, ExplainCodeOutput, DebugCodeOutput, GenerateFluxOutput,
  ProjectPlan, GeneratePaletteOutput, GenerateToneOutput, GeneratePersonaOutput,
  GenerateIdeasOutput, GenerateMotionOutput, GenerateVoiceOutput, GenerateDeckOutput,
  GenerateFrameOutput, GenerateSoundOutput, GenerateNexusOutput, ConvertImageOutput,
  GenerateLightMoodOutput, GenerateMoodboardOutput, CopilotLyricsOutput, GenerateMuseOutput,
  OriaChatOutput, AgendaEvent, ReformatTextWithPromptOutput,
  GenerateTextInput, GenerateTextOutput, GenerateImageOutput
} from '@/ai/types';

import {
  GenerateCodeInputSchema, ExplainCodeInputSchema, DebugCodeInputSchema,
  RefactorCodeInputSchema, GenerateFluxInputSchema, GenerateScheduleInputSchema,
  GeneratePaletteInputSchema, GenerateToneInputSchema, GeneratePersonaInputSchema,
  GenerateIdeasInputSchema, GenerateMotionInputSchema, GenerateVoiceInputSchema,
  GenerateDeckInputSchema, GenerateFrameInputSchema, GenerateSoundInputSchema,
  GenerateNexusInputSchema, ConvertImageInputSchema, GenerateLightMoodInputSchema,
  CopilotLyricsInputSchema, GenerateMuseInputSchema, OriaChatInputSchema,
  ParseEventInputSchema, ReformatTextWithPromptInputSchema, GenerateTextInputSchema, GenerateImageInputSchema
} from '@/ai/types';

import { generateCode } from '@/ai/flows/generate-code';
import { explainCode } from '@/ai/flows/explain-code';
import { debugCode } from '@/ai/flows/debug-code';
import { refactorCode } from '@/ai/flows/refactor-code';
import { generateFlux } from '@/ai/flows/generate-flux';
import { generateSchedule } from '@/ai/flows/generate-schedule';
import { generatePalette } from '@/ai/flows/generate-palette';
import { generateTone } from '@/ai/flows/generate-tone';
import { generatePersona } from '@/ai/flows/generate-persona';
import { generateContent } from '@/ai/flows/content-generator';
import { generateMotion } from '@/ai/flows/generate-motion';
import { generateVoice } from '@/ai/flows/generate-voice';
import { generateDeck } from '@/ai/flows/generate-deck';
import { generateFrame } from '@/ai/flows/generate-frame';
import { generateSound } from '@/ai/flows/generate-sound';
import { generateNexus } from '@/ai/flows/generate-nexus';
import { convertImage } from '@/ai/flows/convert-image';
import { generateLightMood } from '@/ai/flows/generate-light-mood';
import { generateMoodboard } from '@/ai/flows/generate-moodboard';
import { copilotLyrics } from '@/ai/flows/copilot-lyrics';
import { generateMuse } from '@/ai/flows/generate-muse';
import { createFolder } from '@/ai/flows/create-folder';
import { deleteDocument } from '@/ai/flows/delete-document';
import { deleteFolder } from '@/ai/flows/delete-folder';
import { getSignedUrl } from '@/ai/flows/get-signed-url';
import { listDocuments } from '@/ai/flows/list-documents';
import { renameDocument } from '@/ai/flows/rename-document';
import { shareDocument } from '@/ai/flows/share-document';
import { uploadDocument } from '@/ai/flows/upload-document';
import { parseEvent } from '@/ai/flows/parse-event';
import { oria } from '@/ai/flows/oria';
import { createManualProject } from '@/ai/flows/client-actions';


const createErrorResponse = (e: any, id: number, message: string) => {
  const errorMessage = e.message || 'An unknown error occurred.';
  console.error(`AI Action Error (${message}):`, errorMessage);
  return { id: id + 1, result: null, error: errorMessage };
};

// Generic function to create server actions
function createAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  flow: (input: TInput) => Promise<TOutput>,
  actionName: string
) {
  return async (
    prevState: any,
    formData: FormData
  ): Promise<{ id: number; result: TOutput | null; error: string | null; message?: string, prompt?: string, [key: string]: any }> => {
    const rawData = Object.fromEntries(formData);
    
    // This will hold the data that was actually passed to the schema
    let parsedDataForState: Record<string, any> = {};

    // Specific handling for checkbox
    if (actionName === 'convertImage' && !(rawData as any).removeTransparency) {
        (rawData as any).removeTransparency = false;
    }

    const parseResult = schema.safeParse(rawData);
    if (!parseResult.success) {
        console.error("Zod validation failed for:", actionName, parseResult.error.issues);
        const error = parseResult.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return { id: prevState.id + 1, result: null, error, message: "error" };
    }
    
    parsedDataForState = parseResult.data;

    try {
      const result = await flow(parseResult.data);
      return { id: prevState.id + 1, result, error: null, message: 'success', ...parsedDataForState };
    } catch (e: any) {
      return { ...createErrorResponse(e, prevState.id, actionName), message: 'error', ...parsedDataForState };
    }
  };
}


export const generateCodeAction = createAction(GenerateCodeInputSchema, generateCode, 'generateCode');
export const explainCodeAction = createAction(ExplainCodeInputSchema, explainCode, 'explainCode');
export const debugCodeAction = createAction(DebugCodeInputSchema, debugCode, 'debugCode');
export const refactorCodeAction = createAction(RefactorCodeInputSchema, refactorCode, 'refactorCode');
export const fluxAction = createAction(GenerateFluxInputSchema, generateFlux, 'flux');
export const generateScheduleAction = createAction(GenerateScheduleInputSchema, generateSchedule, 'generateSchedule');
export const generatePaletteAction = createAction(GeneratePaletteInputSchema, generatePalette, 'generatePalette');
export const generateToneAction = createAction(GenerateToneInputSchema, generateTone, 'generateTone');
export const generatePersonaAction = createAction(GeneratePersonaInputSchema, generatePersona, 'generatePersona');
export const generateIdeasAction = createAction(GenerateIdeasInputSchema, (input) => generateContent({contentType: 'ideas', ...input}), 'generateIdeas');
export const generateMotionAction = createAction(GenerateMotionInputSchema, generateMotion, 'generateMotion');
export const generateVoiceAction = createAction(GenerateVoiceInputSchema, generateVoice, 'generateVoice');
export const generateDeckAction = createAction(GenerateDeckInputSchema, generateDeck, 'generateDeck');
export const generateFrameAction = createAction(GenerateFrameInputSchema, generateFrame, 'generateFrame');
export const generateSoundAction = createAction(GenerateSoundInputSchema, generateSound, 'generateSound');
export const generateNexusAction = createAction(GenerateNexusInputSchema, generateNexus, 'generateNexus');
export const generateLightMoodAction = createAction(GenerateLightMoodInputSchema, generateLightMood, 'generateLightMood');
export const copilotLyricsAction = createAction(CopilotLyricsInputSchema, copilotLyrics, 'copilotLyrics');
export const generateMuseAction = createAction(GenerateMuseInputSchema, generateMuse, 'generateMuse');
export const createFolderAction = createAction(createFolder.inputSchema, createFolder, 'createFolder');
export const deleteDocumentAction = createAction(deleteDocument.inputSchema, deleteDocument, 'deleteDocument');
export const deleteFolderAction = createAction(deleteFolder.inputSchema, deleteFolder, 'deleteFolder');
export const getSignedUrlAction = createAction(getSignedUrl.inputSchema, getSignedUrl, 'getSignedUrl');
export const renameDocumentAction = createAction(renameDocument.inputSchema, renameDocument, 'renameDocument');
export const shareDocumentAction = createAction(shareDocument.inputSchema, shareDocument, 'shareDocument');
export const uploadDocumentAction = createAction(uploadDocument.inputSchema, uploadDocument, 'uploadDocument');
export const uploadMuseDocumentAction = uploadDocumentAction;
export const oriaChatAction = createAction(OriaChatInputSchema, oria, 'oriaChat');
export const generateTextAction = createAction(GenerateTextInputSchema, (input: GenerateTextInput) => generateContent({ contentType: 'text', prompt: input.prompt }).then((res): GenerateTextOutput => ({ text: res.data as string })), 'generateText');
export const generateImageAction = createAction(GenerateImageInputSchema, (input) => generateContent({contentType: 'image', ...input}).then(res => ({imageDataUri: res.data as string})), 'generateImage');


export const reformatTextAction = createAction(ReformatTextWithPromptInputSchema, (input) => generateContent({
    contentType: 'reformat',
    prompt: input.prompt,
    textToReformat: input.text,
}).then(res => ({ reformattedText: res.data as string })), 'reformatText');


// Custom Actions that don't fit the generic pattern

export async function createManualProjectAction(prevState: any, formData: FormData): Promise<{ success: boolean; project: ProjectPlan | null; error: string | null; }> {
    return createManualProject(prevState, formData);
}


export const convertImageAction = async (prevState: any, formData: FormData): Promise<{ id: number; result: ConvertImageOutput | null; error: string | null; }> => {
    const rawData = {
        imageFile: formData.get('imageFile') as File | null,
        image: formData.get('image') as string,
        outputFormat: formData.get('outputFormat') as 'jpeg' | 'png' | 'webp',
        removeTransparency: formData.get('removeTransparency') === 'on',
    };

    if (!rawData.imageFile?.size && !rawData.image) {
        return { id: prevState.id + 1, result: null, error: 'Aucune image fournie.' };
    }
    
    let imageAsDataUri = rawData.image;
    if (rawData.imageFile?.size) {
         try {
            const buffer = await rawData.imageFile.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            imageAsDataUri = `data:${rawData.imageFile.type};base64,${base64}`;
        } catch (e) {
            return createErrorResponse(e, prevState.id, 'imageRead');
        }
    }

    try {
        const result = await convertImage({ image: imageAsDataUri, outputFormat: rawData.outputFormat, removeTransparency: rawData.removeTransparency });
        return { id: prevState.id + 1, result, error: null };
    } catch (e: any) {
      return createErrorResponse(e, prevState.id, 'convertImage');
    }
};

export async function generateMoodboardAction(prompts: string[]): Promise<{ message: 'success' | 'error', imageDataUris: string[] | null, error: string | null }> {
    try {
        const imagePromises = prompts.map(prompt => generateContent({
            prompt,
            style: 'photorealistic',
            contentType: 'image'
        }));
        const imageResults = await Promise.all(imagePromises);
        const imageDataUris = imageResults.map(result => result.data as string);
        return { message: 'success', imageDataUris, error: null };
    } catch(e: any) {
        return { message: 'error', imageDataUris: null, error: e.message };
    }
}


export const parseEventAction = async (prevState: any, formData: FormData): Promise<{ id: number, success: boolean, event: AgendaEvent | null, error: string | null }> => {
    const prompt = formData.get('prompt') as string;
    if (!prompt) return { id: prevState.id + 1, success: false, event: null, error: 'Prompt is required.' };
    
    try {
        const event = await parseEvent({ prompt, currentDate: new Date().toISOString() });
        return { id: prevState.id + 1, success: true, event, error: null };
    } catch (e: any) {
        return { id: prevState.id + 1, success: false, event: null, error: e.message };
    }
};

export async function listDocumentsAction() {
  return listDocuments();
}

export async function getActionResult(resultId: string): Promise<{ result: any; prompt?: string } | null> {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(resultId);
    if (stored) {
        try {
            localStorage.removeItem(resultId);
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse stored result", e);
            return null;
        }
    }
    return null;
}
