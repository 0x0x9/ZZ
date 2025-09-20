'use server';

import { ai } from '../genkit';
import { z } from 'genkit';
import { mockDocs } from '@/lib/mock-db';

const InputSchema = z.object({
  oldPath: z.string(),
  newName: z.string(),
  docId: z.string().optional(), // For files
});

const renameDocumentFlow = ai.defineFlow(
  {
    name: 'renameDocumentFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ oldPath, newName, docId }) => {
    if (docId) {
        console.log(`Renaming file ${docId} from ${oldPath} to ${newName}`);
        const doc = mockDocs.find(d => d.id === docId);
        if (doc) {
            const pathParts = doc.path.split('/');
            pathParts[pathParts.length - 1] = newName;
            doc.path = pathParts.join('/');
            doc.name = newName;
            doc.updatedAt = new Date().toISOString();
            return { success: true };
        }
    } else {
        console.log(`Renaming folder from ${oldPath} to ${newName} and moving contents.`);
        // This is a complex operation on a flat list. We'll simulate it by renaming paths.
        mockDocs.forEach(doc => {
            if (doc.path.startsWith(oldPath)) {
                doc.path = doc.path.replace(oldPath, newName);
                doc.updatedAt = new Date().toISOString();
            }
        });
        return { success: true };
    }
    return { success: false };
  }
);

export async function renameDocument(input: z.infer<typeof InputSchema>) {
    return renameDocumentFlow(input);
}

    