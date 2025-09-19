
'use client';

import PulseClient from "@/app/pulse/client";

export default function PulseApp() {
    return (
        <div className="h-full w-full bg-background overflow-hidden">
           <PulseClient />
        </div>
    );
}
