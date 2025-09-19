
import PulseClient from './client';
import { Heart } from 'lucide-react';
import { Suspense } from 'react';

const PulsePage = () => {
    return (
        <>
             <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-red-400 via-pink-500 to-fuchsia-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Heart className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-500 to-fuchsia-600 animate-gradient-x">
                Pulse
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le centre névralgique de vos projets. Suivez vos tâches, gérez vos fichiers et collaborez avec votre équipe et l'IA.
                </p>
            </section>
            <div className="w-full h-[70vh]">
                 <Suspense fallback={<div className="h-full w-full glass-card animate-pulse" />}>
                    <PulseClient />
                </Suspense>
            </div>
        </>
    );
}

export default PulsePage;
