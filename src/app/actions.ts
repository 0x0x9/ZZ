
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
export { generateContent } from '@/ai/flows/content-generator';
export { generateMotion } from '@/ai/flows/generate-motion';
export { generateVoice } from '@/ai/flows/generate-voice';
export { generateDeck } from '@/ai/flows/generate-deck';
export { generateFrame } from '@/ai/flows/generate-frame';
export { generateSound } from '@/ai/flows/generate-sound';
export { generateNexus } from '@/ai/flows/generate-nexus';
export { convertImage } from '@/ai/flows/convert-image';
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
export { parseEvent } from '@/ai/flows/parse-event';
export { oria } from '@/ai/flows/oria';

// We keep the alias for chat for simplicity in the client
export { oria as oriaChatAction } from '@/ai/flows/oria';

// Specific action that needs a different name or signature can be wrapped.
import { uploadDocument as uploadMuseDoc } from '@/ai/flows/upload-document';
export const uploadMuseDocumentAction = uploadMuseDoc;


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
