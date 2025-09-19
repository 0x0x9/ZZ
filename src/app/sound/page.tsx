

import SoundClient from './client';
import { Music, Sparkles, Waves, Download, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: Sparkles,
        title: "Génération sur Mesure",
        description: "Décrivez n'importe quel son, du plus réaliste au plus fantastique. (X)sound utilise l'IA pour interpréter votre demande et générer un résultat audio."
    },
    {
        icon: Waves,
        title: "Simulation Vocale",
        description: "Actuellement en version expérimentale, (X)sound décrit le son avec une voix IA, vous donnant une interprétation auditive de votre idée."
    },
    {
        icon: Download,
        title: "Export Facile",
        description: "Téléchargez les sons générés au format WAV pour les intégrer facilement dans vos projets vidéo, jeux, ou applications."
    }
];

const SoundPage = () => {
    return (
        <div className="w-full space-y-24">
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
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=sound">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <Suspense>
                <SoundClient />
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

export default SoundPage;
