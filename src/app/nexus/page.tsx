

import NexusClient from './client';
import { Network, BrainCircuit, GitBranch, Share2, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: BrainCircuit,
        title: "Brainstorming Structuré",
        description: "(X)nexus prend votre idée centrale et la décompose en thèmes principaux et sous-branches, créant une structure logique pour votre pensée."
    },
    {
        icon: GitBranch,
        title: "Visualisation Hiérarchique",
        description: "Explorez vos idées de manière interactive. Dépliez et repliez les branches pour vous concentrer sur des aspects spécifiques ou pour avoir une vue d'ensemble."
    },
    {
        icon: Share2,
        title: "Support à la Décision",
        description: "Utilisez la carte mentale générée comme un outil stratégique pour planifier des projets, organiser des présentations ou prendre des décisions complexes."
    }
];

const NexusPage = () => {
    return (
        <div className="w-full space-y-24">
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
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=nexus">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <Suspense>
                <NexusClient />
            </Suspense>

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

export default NexusPage;
