import PaletteClient from './client';
import { Palette } from 'lucide-react';
import { Suspense } from 'react';

const PalettePage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Palette className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-600 animate-gradient-x">
                (X)palette
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le coloriste de votre équipe IA. Décrivez une ambiance, (X)palette compose une harmonie de couleurs pour l'incarner.
                </p>
            </section>
            
            <Suspense>
                <PaletteClient />
            </Suspense>
        </>
    );
}

export default PalettePage;
