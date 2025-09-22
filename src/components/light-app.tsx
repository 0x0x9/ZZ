
'use client';

import LightClient from "@/app/light/client";

export default function LightApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar">
           <LightClient />
        </div>
    );
}
