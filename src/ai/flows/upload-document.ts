'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';
import { mockDocs } from '@/lib/mock-db';
import { v4 as uuidv4 } from 'uuid';
import type { Doc } from '@/ai/types';

// In a real application, this would handle uploading to a cloud storage bucket.
// For this prototype, we'll just log the upload attempt.

const UploadDocumentInputSchema = z.object({
  name: z.string(),
  content: z.string().describe("The file content as a base64 encoded data URI."),
  mimeType: z.string(),
});

const uploadDocumentFlow = ai.defineFlow(
  {
    name: 'uploadDocumentFlow',
    inputSchema: UploadDocumentInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    console.log(`Simulating upload for: ${input.name} (${input.mimeType})`);
    
    const now = new Date().toISOString();
    const existingDocIndex = mockDocs.findIndex(d => d.path === input.name);

    if (existingDocIndex !== -1) {
      // Update existing document
      const doc = mockDocs[existingDocIndex];
      doc.updatedAt = now;
      doc.size = Buffer.from(input.content.split(',')[1], 'base64').length;
      doc.mimeType = input.mimeType;
    } else {
      // Add new document
       const newDoc: Doc = {
        id: uuidv4(),
        name: input.name.split('/').pop() || input.name,
        path: input.name,
        mimeType: input.mimeType,
        size: Buffer.from(input.content.split(',')[1], 'base64').length,
        createdAt: now,
        updatedAt: now,
        shareId: null,
      };
      mockDocs.push(newDoc);
    }
    
    return { success: true };
  }
);

export async function uploadDocument(input: z.infer<typeof UploadDocumentInputSchema>) {
    return uploadDocumentFlow(input);
}
