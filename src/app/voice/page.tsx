import VoiceClient from './client';
import { AudioLines } from 'lucide-react';
import { Suspense } from 'react';

const VoicePage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 p-3 rounded-full w-fit animate-gradient-x">
                        <AudioLines className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 animate-gradient-x">
                (X)voice
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre studio de doublage IA. Donnez une voix professionnelle et naturelle à vos textes en choisissant parmi une sélection de voix de haute qualité.
                </p>
            </section>
            
            <Suspense>
                <VoiceClient />
            </Suspense>
        </>
    );
}

export default VoicePage;
