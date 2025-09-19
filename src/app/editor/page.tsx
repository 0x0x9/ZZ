
import AlphaClient from './client';
import { TerminalSquare, Bug, BrainCircuit, Wand2 } from 'lucide-react';
import { Suspense } from 'react';

const features = [
    {
        icon: Wand2,
        title: "Génération & Amélioration",
        description: "Générez du code à partir de zéro avec un prompt, ou améliorez votre code existant pour le rendre plus performant et lisible grâce aux suggestions de l'IA."
    },
    {
        icon: BrainCircuit,
        title: "Compréhension Instantanée",
        description: "Ne perdez plus de temps à déchiffrer du code complexe. (X).alpha peut vous expliquer n'importe quel snippet de code en langage clair et simple."
    },
    {
        icon: Bug,
        title: "Débogage Assisté par IA",
        description: "Confronté à un bug ? L'IA analyse votre code, identifie les erreurs potentielles et vous propose des corrections précises pour vous remettre sur les rails rapidement."
    }
];


const AlphaPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-3 rounded-full w-fit animate-gradient-x">
                        <TerminalSquare className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 animate-gradient-x">
                (X).alpha
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                L'éditeur de code intelligent. Générez, éditez et prévisualisez vos projets et fichiers, assisté par l'IA.
                </p>
            </section>
            
            <AlphaClient />

            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {features.map((feature, index) => (
                        <div key={feature.title}>
                            <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                                <feature.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground mt-3">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

export default AlphaPage;
