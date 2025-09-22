
'use client';

import LightEnvClient from "@/app/lightenv/client";

export default function LightEnvApp() {
    return (
        <div className="h-full w-full bg-background overflow-hidden">
           <LightEnvClient />
        </div>
    );
}
