
'use server';

import { ai } from '@/genkit';
import { z } from 'zod';
import { DocSchema } from '@/ai/types';
import { mockDocs } from '@/lib/mock-db';


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
