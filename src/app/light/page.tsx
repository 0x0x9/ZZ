
import LightClient from './client';
import { Sparkles, Palette, Image as ImageIcon, FileText } from 'lucide-react';

const features = [
    {
        icon: Palette,
        title: "Harmonies de Couleurs",
        description: "(X)light génère des palettes de 5 couleurs harmonieuses à partir de votre thème, prêtes à être utilisées dans vos designs."
    },
    {
        icon: ImageIcon,
        title: "Prompts Visuels Inspirants",
        description: "Obtenez une série de prompts d'images détaillés et créatifs pour alimenter des générateurs d'images IA et visualiser votre concept."
    },
    {
        icon: FileText,
        title: "Mots-Clés Pertinents",
        description: "L'IA extrait les mots-clés essentiels de votre ambiance pour vous aider à affiner votre message et votre référencement."
    }
];

const LightPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-amber-200 via-violet-300 to-sky-300 p-3 rounded-full w-fit animate-gradient-x">
                        <Sparkles className="h-8 w-8 text-background" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-violet-300 to-sky-300 animate-gradient-x">
                (X)light
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre sanctuaire créatif. Explorez des ambiances, des images et des idées pour allumer l'étincelle de votre prochain projet.
                </p>
            </section>
            
            <LightClient />

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

export default LightPage;
