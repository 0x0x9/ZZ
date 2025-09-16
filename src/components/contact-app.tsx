
'use client';

import ContactPage from "@/app/contact/client";

export default function ContactApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar">
           {/* As ContactPage includes Header/Footer, we cannot directly reuse it. We need to create a client component */}
           <div className="p-8">
             <h1 className="text-2xl font-bold">Contacter le support</h1>
             <p className="text-muted-foreground">Cette application est en cours de construction.</p>
           </div>
        </div>
    );
}
