

import ToneClient from './client';
import { Mic, Pencil, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: Pencil,
        title: "Personnalité de Marque",
        description: "(X)tone vous aide à capturer l'essence de votre marque en 3 adjectifs clés, formant la base de votre communication."
    },
    {
        icon: ThumbsUp,
        title: "Guide Pratique",
        description: "Recevez des recommandations claires sur le style d'écriture à adopter (Dos) et les écueils à éviter (Don'ts) pour rester cohérent."
    },
    {
        icon: ThumbsDown,
        title: "Exemples Concrets",
        description: "Visualisez votre ton en action avec des exemples de phrases qui incarnent parfaitement la voix de votre marque, vous donnant un modèle à suivre."
    }
];

const TonePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Mic className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-gradient-x">
                (X)tone
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Trouvez la bonne voix pour votre marque. Décrivez votre projet et obtenez un guide de style pour communiquer avec impact et cohérence.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=tone">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <ToneClient />

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

export default TonePage;
