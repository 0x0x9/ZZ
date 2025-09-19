import SoundClient from './client';
import { Music } from 'lucide-react';
import { Suspense } from 'react';

const SoundPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Music className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 animate-gradient-x">
                (X)sound
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le sound designer de votre équipe IA. Décrivez n'importe quel son, du bruit d'un vaisseau spatial à une ambiance de forêt, et écoutez le résultat.
                </p>
            </section>
            
            <Suspense>
                <SoundClient />
            </Suspense>
        </>
    );
}

export default SoundPage;
