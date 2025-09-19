'use server';

import { ai } from '@/genkit';
import { z } from 'genkit';

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
    // Simulate success
    return { success: true };
  }
);

export async function deleteFolder(input: z.infer<typeof InputSchema>) {
    return deleteFolderFlow(input);
}
