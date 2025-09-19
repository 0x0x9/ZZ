
'use server';

import { ai } from '@/genkit';
import { z } from 'zod';
import { DocSchema } from '@/ai/types';

// In a real application, this would fetch from a database or cloud storage.
// For this prototype, we'll return a static list of mock documents for a demo project.

export const mockDocs: Doc[] = [
  // --- Project: "Nébuleuse" ---

  // Main folder
  {
    id: 'folder-nebuleuse',
    name: 'Nébuleuse',
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
    name: 'Scénario',
    path: 'Nébuleuse/Scénario/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-20T10:01:00Z',
    updatedAt: '2024-07-28T11:00:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-concept',
    name: 'Concept Art',
    path: 'Nébuleuse/Concept Art/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-21T14:00:00Z',
    updatedAt: '2024-07-27T18:00:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-prod',
    name: 'Production',
    path: 'Nébuleuse/Production/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-22T09:30:00Z',
    updatedAt: '2024-07-26T16:45:00Z',
    shareId: null,
  },
  {
    id: 'folder-nebuleuse-branding',
    name: 'Branding',
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
    name: 'script-v3-final.md',
    path: 'Nébuleuse/Scénario/script-v3-final.md',
    mimeType: 'text/markdown',
    size: 128000,
    createdAt: '2024-07-20T10:05:00Z',
    updatedAt: '2024-07-28T11:00:00Z',
    shareId: 'share-neb-script',
  },
  {
    id: 'doc-neb-2',
    name: 'personnage-principal.png',
    path: 'Nébuleuse/Concept Art/personnage-principal.png',
    mimeType: 'image/png',
    size: 1200000,
    createdAt: '2024-07-21T14:30:00Z',
    updatedAt: '2024-07-27T18:00:00Z',
    shareId: null,
  },
  {
    id: 'doc-neb-3',
    name: 'vaisseau-eclaireur.jpg',
    path: 'Nébuleuse/Concept Art/vaisseau-eclaireur.jpg',
    mimeType: 'image/jpeg',
    size: 2500000,
    createdAt: '2024-07-24T16:00:00Z',
    updatedAt: '2024-07-26T12:30:00Z',
    shareId: null,
  },
  {
    id: 'doc-neb-4',
    name: 'plan-de-tournage.json',
    path: 'Nébuleuse/Production/plan-de-tournage.json',
    mimeType: 'application/json',
    size: 8192,
    createdAt: '2024-07-22T10:00:00Z',
    updatedAt: '2024-07-26T16:45:00Z',
    shareId: null,
  },
   {
    id: 'doc-neb-5',
    name: 'moodboard.png',
    path: 'Nébuleuse/Branding/moodboard.png',
    mimeType: 'image/png',
    size: 3145728,
    createdAt: '2024-07-23T11:15:00Z',
    updatedAt: '2024-07-25T14:00:00Z',
    shareId: null,
  },
  // --- Maestro Projects Folder ---
  {
    id: 'folder-maestro',
    name: 'maestro-projets',
    path: 'maestro-projets/',
    mimeType: 'application/x-directory',
    size: 0,
    createdAt: '2024-07-29T09:00:00Z',
    updatedAt: '2024-07-29T09:00:00Z',
    shareId: null,
  },
  // --- Maestro Project 1 ---
  {
    id: 'maestro-proj-1',
    name: 'Lancement-de-marque-de-vêtements.json',
    path: 'maestro-projets/Lancement-de-marque-de-vêtements.json',
    mimeType: 'application/json',
    size: 12345,
    createdAt: '2024-07-29T09:01:00Z',
    updatedAt: '2024-07-29T09:01:00Z',
    shareId: null,
  },
    // --- Maestro Project 2 ---
  {
    id: 'maestro-proj-2',
    name: 'Court-métrage-de-science-fiction.json',
    path: 'maestro-projets/Court-métrage-de-science-fiction.json',
    mimeType: 'application/json',
    size: 23456,
    createdAt: '2024-07-28T15:00:00Z',
    updatedAt: '2024-07-29T10:30:00Z',
    shareId: null,
  },
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
