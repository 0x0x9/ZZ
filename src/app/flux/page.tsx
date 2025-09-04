import { Suspense } from 'react';
import FluxClient from './client';
import { Wand2 } from 'lucide-react';

const FluxPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="p-3 rounded-full w-fit animate-gradient-x bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                        <Wand2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x">
                (X)flux
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                L’assistant IA qui transforme une pensée en projet complet. Décrivez votre objectif, (X)flux s'occupe du reste.
                </p>
            </section>
            
            <Suspense fallback={<div>Chargement...</div>}>
                <FluxClient />
            </Suspense>
        </>
    );
}

export default FluxPage;
