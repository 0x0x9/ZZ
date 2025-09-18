
'use server';

import { oria } from './oria';
import { type OriaChatInput, type OriaChatOutput } from '@/ai/types';

export async function oriaChat(input: OriaChatInput): Promise<OriaChatOutput> {
  return oria(input);
}
