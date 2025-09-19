'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';
import { DocSchema } from '@/ai/types';

// In a real application, this would fetch from a database or cloud storage.
// For this prototype, we'll return a static list of mock documents for a demo project.

const mockDocs = [
  // --- Project: "Nébuleuse" ---

  // Main folder
  {
    id: 'folder-nebuleuse',
    name: 'Nébuleuse/',
    path: 'Nébuleuse/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-28T10:00:00Z',
    shareId: null,
  },
  // Sub-folders
  {
    id: 'folder-nebuleuse-scenario',
    name: 'Nébuleuse/Scénario/',
    path: 'Nébuleuse/Scénario/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-20T10:01:00Z',
    updatedAt: '2024-07-28T11:00:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-concept',
    name: 'Nébuleuse/Concept Art/',
    path: 'Nébuleuse/Concept Art/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-21T14:00:00Z',
    updatedAt: '2024-07-27T18:00:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-prod',
    name: 'Nébuleuse/Production/',
    path: 'Nébuleuse/Production/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-22T09:30:00Z',
    updatedAt: '2024-07-26T16:45:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-branding',
    name: 'Nébuleuse/Branding/',
    path: 'Nébuleuse/Branding/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-23T11:00:00Z',
    updatedAt: '2024-07-25T14:00:00Z',
    shareId: null,
  },

  // Files
  {
    id: 'doc-neb-1',
    name: 'Nébuleuse/Scénario/script-v3-final.md',
    path: 'Nébuleuse/Scénario/script-v3-final.md',
    mimeType: 'text/markdown',
    size: 128000,
    createdAt: '2024-07-20T10:05:00Z',
    updatedAt: '2024-07-28T11:00:00Z',
    shareId: 'share-neb-script',
  },
  {
    id: 'doc-neb-2',
    name: 'Nébuleuse/Concept Art/personnage-principal.png',
    path: 'Nébuleuse/Concept Art/personnage-principal.png',
    mimeType: 'image/png',
    size: 1200000,
    createdAt: '2024-07-21T14:30:00Z',
    updatedAt: '2024-07-27T18:00:00Z',
    shareId: null,
  },
  {
    id: 'doc-neb-3',
    name: 'Nébuleuse/Concept Art/vaisseau-eclaireur.jpg',
    path: 'Nébuleuse/Concept Art/vaisseau-eclaireur.jpg',
    mimeType: 'image/jpeg',
    size: 2500000,
    createdAt: '2024-07-24T16:00:00Z',
    updatedAt: '2024-07-26T12:30:00Z',
    shareId: null,
  },
  {
    id: 'doc-neb-4',
    name: 'Nébuleuse/Production/plan-de-tournage.json',
    path: 'Nébuleuse/Production/plan-de-tournage.json',
    mimeType: 'application/json',
    size: 8192,
    createdAt: '2024-07-22T10:00:00Z',
    updatedAt: '2024-07-26T16:45:00Z',
    shareId: null,
  },
   {
    id: 'doc-neb-5',
    name: 'Nébuleuse/Branding/moodboard.png',
    path: 'Nébuleuse/Branding/moodboard.png',
    mimeType: 'image/png',
    size: 3145728,
    createdAt: '2024-07-23T11:15:00Z',
    updatedAt: '2024-07-25T14:00:00Z',
    shareId: null,
  },
  // Previous mock data for compatibility
  { id: 'maestro-projet-nebula.json', name: 'maestro-projet-nebula.json', path: 'maestro-projet-nebula.json', mimeType: 'application/json', size: 8192, createdAt: '2024-07-21T11:20:00Z', updatedAt: '2024-07-22T09:00:00Z', shareId: null },
];

const listDocumentsFlow = ai.defineFlow(
  {
    name: 'listDocumentsFlow',
    inputSchema: z.void(),
    outputSchema: z.array(DocSchema),
  },
  async () => {
    // Here you would add logic to fetch documents from a real data source.
    // For now, we return the mock data.
    return mockDocs;
  }
);

export async function listDocuments() {
    return listDocumentsFlow();
}
