'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';
import { mockDocs } from '@/lib/mock-db';

const InputSchema = z.object({
  docId: z.string(),
});

const deleteDocumentFlow = ai.defineFlow(
  {
    name: 'deleteDocumentFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ docId }) => {
    console.log(`Deleting document: ${docId}`);
    const index = mockDocs.findIndex(d => d.id === docId);
    if (index !== -1) {
      mockDocs.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }
);

export async function deleteDocument(input: z.infer<typeof InputSchema>) {
    return deleteDocumentFlow(input);
}
