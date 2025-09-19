'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';

const InputSchema = z.object({
  docId: z.string(),
});

// In a real app, this would delete the document from storage and its metadata from a database.
const deleteDocumentFlow = ai.defineFlow(
  {
    name: 'deleteDocumentFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ docId }) => {
    console.log(`Deleting document: ${docId}`);
    // Simulate success
    return { success: true };
  }
);

export async function deleteDocument(input: z.infer<typeof InputSchema>) {
    return deleteDocumentFlow(input);
}
