

import MotionClient from './client';
import { Film, Clapperboard, FileText, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: '(X)motion - Votre Réalisateur IA',
  description: "Transformez vos idées en scripts vidéo complets, avec scènes et narrations, prêts pour la production.",
};

const features = [
    {
        icon: Clapperboard,
        title: "Script Structuré",
        description: "(X)motion transforme votre concept en un script vidéo avec un titre accrocheur et une série de scènes distinctes et logiques."
    },
    {
        icon: FileText,
        title: "Narration Inspirante",
        description: "Chaque scène est accompagnée d'une narration courte et percutante, conçue pour captiver votre audience et servir de base pour votre voix off."
    },
    {
        icon: ImageIcon,
        title: "Visuel de Couverture",
        description: "Obtenez un prompt d'image détaillé pour générer une image de couverture qui capture l'essence de votre vidéo, parfaite pour vos miniatures."
    }
];

const MotionPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Film className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 animate-gradient-x">
                (X)motion
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre réalisateur IA. D'une simple idée, générez un script vidéo complet, scène par scène, avec une voix off inspirante.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=motion">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <Suspense>
                <MotionClient />
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

export default MotionPage;
