import NexusClient from './client';
import { Network } from 'lucide-react';
import { Suspense } from 'react';

const NexusPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Network className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600 animate-gradient-x">
                (X)nexus
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre stratège visuel. Transformez une idée complexe en une carte mentale claire et interactive.
                </p>
            </section>
            
            <Suspense>
                <NexusClient />
            </Suspense>
        </>
    );
}

export default NexusPage;
