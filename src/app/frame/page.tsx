

import FrameGenerator from '@/components/frame-generator';
import { LayoutTemplate, Sparkles, Code, TabletSmartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: Sparkles,
        title: "Du Langage Naturel au Code",
        description: "Décrivez simplement l'interface que vous imaginez. (X)frame la transforme en un composant React fonctionnel, stylisé avec TailwindCSS."
    },
    {
        icon: Code,
        title: "Qualité Production",
        description: "Le code généré n'est pas une simple maquette. Il est propre, utilise les composants shadcn/ui et suit les meilleures pratiques de développement React."
    },
    {
        icon: TabletSmartphone,
        title: "Aperçu en Temps Réel",
        description: "Visualisez instantanément le rendu de votre composant sur différents formats d'écran et ajustez le code en direct dans (X).alpha pour un résultat parfait."
    }
];

const FramePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-3 rounded-full w-fit animate-gradient-x">
                        <LayoutTemplate className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 animate-gradient-x">
                (X)frame
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le designer d'interface qui code. Décrivez une maquette ou fournissez une image, (X)frame la transforme en code React fonctionnel.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=frame">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <FrameGenerator />

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

export default FramePage;
