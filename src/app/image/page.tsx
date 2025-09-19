

import ImageGenerator from '@/components/image-generator';
import { Image as ImageIcon, Sparkles, Brush, Layers, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: Sparkles,
        title: "Génération par Texte",
        description: "Transformez vos descriptions les plus folles en images spectaculaires. Décrivez une scène, un personnage ou un concept, et laissez l'IA lui donner vie."
    },
    {
        icon: Brush,
        title: "Styles Artistiques Variés",
        description: "Explorez une multitude de styles : photoréaliste, cinématique, aquarelle, 3D, pixel art... Adaptez le rendu à votre vision créative."
    },
    {
        icon: Layers,
        title: "Itération Rapide",
        description: "Ne vous contentez pas de la première version. Modifiez, affinez et régénérez vos images en quelques secondes pour atteindre le résultat parfait."
    }
];

const ImagePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-3 rounded-full w-fit animate-gradient-x">
                        <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                (X)image
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre studio de création visuelle. Transformez vos mots en images spectaculaires avec la puissance de l'IA.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=image">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <Suspense>
                <ImageGenerator />
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

export default ImagePage;
