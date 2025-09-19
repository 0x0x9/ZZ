

import DeckClient from './client';
import { Presentation, BrainCircuit, Wand2, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: BrainCircuit,
        title: "Structure Intelligente",
        description: "Fournissez un sujet et (X)deck génère une structure de présentation logique avec un titre, des diapositives, et des points clés pertinents."
    },
    {
        icon: Wand2,
        title: "Contenu Inspiré",
        description: "Chaque diapositive est enrichie avec du contenu, des notes pour l'orateur et des prompts d'image pour illustrer vos propos de manière créative."
    },
    {
        icon: Share2,
        title: "Export & Partage Faciles",
        description: "Exportez votre présentation au format Markdown pour l'intégrer facilement dans d'autres outils ou partagez-la directement avec votre équipe."
    }
];

const DeckPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Presentation className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
                (X)deck
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Transformez vos idées en présentations percutantes. Donnez un sujet, l'IA s'occupe de la structure et du contenu.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=deck">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <DeckClient />

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

export default DeckPage;
