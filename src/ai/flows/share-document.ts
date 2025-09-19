'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';
import { mockDocs } from '@/lib/mock-db';

const InputSchema = z.object({
  docId: z.string(),
  makePublic: z.boolean(),
});

// In a real app, this would update permissions in a database and return a signed URL.
const shareDocumentFlow = ai.defineFlow(
  {
    name: 'shareDocumentFlow',
    inputSchema: InputSchema,
    outputSchema: z.object({ shareLink: z.string().nullable() }),
  },
  async ({ docId, makePublic }) => {
    console.log(`Setting document ${docId} public status to: ${makePublic}`);
    const doc = mockDocs.find(d => d.id === docId);

    if (!doc) {
        return { shareLink: null };
    }

    if (makePublic) {
      doc.shareId = doc.shareId || `share-${uuidv4()}`;
      return { shareLink: `https://xyzz.ai/share/${doc.shareId}` };
    } else {
      doc.shareId = null;
      return { shareLink: null };
    }
  }
);

export async function shareDocument(input: z.infer<typeof InputSchema>) {
  return shareDocumentFlow(input);
}
