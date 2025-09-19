
'use client';

import { Suspense } from 'react';
import FormatClient from "@/app/format/client";

export default function FormatApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar p-6">
          <Suspense>
            <FormatClient />
          </Suspense>
        </div>
    );
}
