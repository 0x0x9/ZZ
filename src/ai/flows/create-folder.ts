'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';
import { mockDocs } from './list-documents';
import { v4 as uuidv4 } from 'uuid';
import type { Doc } from '@/ai/types';


const InputSchema = z.object({
  currentPath: z.string(),
  folderName: z.string(),
});

// In a real app, this might create a placeholder file in storage to represent a folder.
const createFolderFlow = ai.defineFlow(
  {
    name: 'createFolderFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ currentPath, folderName }) => {
    console.log(`Creating folder "${folderName}" in path: "${currentPath}"`);
    const now = new Date().toISOString();
    const newPath = `${currentPath}${folderName}/`;

    if (mockDocs.some(d => d.path === newPath)) {
      return { success: false }; // Folder already exists
    }

    const newFolder: Doc = {
        id: uuidv4(),
        name: folderName,
        path: newPath,
        mimeType: 'application/x-directory',
        size: 0,
        createdAt: now,
        updatedAt: now,
        shareId: null
    };
    mockDocs.push(newFolder);
    return { success: true };
  }
);

export async function createFolder(input: z.infer<typeof InputSchema>) {
    return createFolderFlow(input);
}
