
import PaletteClient from './client';
import { Palette, Sparkles, Droplets, Copy } from 'lucide-react';
import { Suspense } from 'react';

const features = [
    {
        icon: Sparkles,
        title: "Inspiration Infinie",
        description: "Décrivez n'importe quelle scène, émotion ou concept. (X)palette le traduira en une palette de couleurs harmonieuse et unique."
    },
    {
        icon: Droplets,
        title: "Harmonie des Couleurs",
        description: "Chaque palette générée est composée de 6 couleurs conçues pour fonctionner parfaitement ensemble, avec des teintes de base et d'accentuation."
    },
    {
        icon: Copy,
        title: "Intégration Facile",
        description: "Copiez facilement les codes HEX de chaque couleur pour les utiliser directement dans vos outils de design ou de développement."
    }
];

const PalettePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Palette className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-600 animate-gradient-x">
                (X)palette
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le coloriste de votre équipe IA. Décrivez une ambiance, (X)palette compose une harmonie de couleurs pour l'incarner.
                </p>
            </section>
            
            <Suspense>
                <PaletteClient />
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

export default PalettePage;
