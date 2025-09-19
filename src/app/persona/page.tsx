import PersonaClient from './client';
import { Users } from 'lucide-react';
import { Suspense } from 'react';

const PersonaPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 animate-gradient-x">
                (X)persona
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre stratège IA. Décrivez votre projet pour générer des profils d'audience détaillés et pertinents.
                </p>
            </section>
            
            <Suspense>
                <PersonaClient />
            </Suspense>
        </>
    );
}

export default PersonaPage;
