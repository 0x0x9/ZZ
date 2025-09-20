'use server';

import { ai } from '../genkit';
import { z } from 'genkit';
import { mockDocs } from '@/lib/mock-db';

const InputSchema = z.object({
  folderPath: z.string(),
});

// In a real app, this would list and delete all files within the specified path.
const deleteFolderFlow = ai.defineFlow(
  {
    name: 'deleteFolderFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ folderPath }) => {
    console.log(`Deleting folder and its contents: ${folderPath}`);
    const initialCount = mockDocs.length;
    const filteredDocs = mockDocs.filter(doc => !doc.path.startsWith(folderPath));
    
    mockDocs.length = 0; // Clear original array
    mockDocs.push(...filteredDocs); // Push back filtered items

    return { success: mockDocs.length < initialCount };
  }
);

export async function deleteFolder(input: z.infer<typeof InputSchema>) {
    return deleteFolderFlow(input);
}

    