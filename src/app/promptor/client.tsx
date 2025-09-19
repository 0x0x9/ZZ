'use client';

import { Suspense } from 'react';
import PromptorGenerator from '@/components/promptor-generator';

export default function PromptorClient() {
  return (
    <Suspense>
      <PromptorGenerator />
    </Suspense>
  );
}
