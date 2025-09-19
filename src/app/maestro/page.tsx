import MaestroClient from './client';
import { BrainCircuit } from 'lucide-react';
import { Suspense } from 'react';

const MaestroPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-600 p-3 rounded-full w-fit animate-gradient-x">
                        <BrainCircuit className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-600 animate-gradient-x">
                Maestro
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre chef de projet IA. Décrivez une idée, Maestro la transforme en un plan d'action détaillé.
                </p>
            </section>
            
            <Suspense>
                <MaestroClient />
            </Suspense>
        </>
    );
}

export default MaestroPage;
