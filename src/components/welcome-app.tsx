
'use client';

import WelcomeClient from "@/app/welcome/page";

export default function WelcomeApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar">
            {/* The Header and Footer from the original page are omitted here 
                as this component is meant to be displayed inside a window. */}
            <main>
                <WelcomeClient />
            </main>
        </div>
    );
}
