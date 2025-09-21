
'use client';

import LightGenerator from "@/components/light-generator";

export default function LightApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar p-6">
           <LightGenerator />
        </div>
    );
}

