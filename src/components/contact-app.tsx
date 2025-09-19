
'use client';

import ContactClient from "@/app/contact/client";

export default function ContactApp() {
    return (
        <div className="h-full w-full bg-background overflow-y-auto no-scrollbar">
           {/* As ContactPage includes Header/Footer, we cannot directly reuse it. We need to create a client component */}
           <div className="p-8">
             <ContactClient />
           </div>
        </div>
    );
}
