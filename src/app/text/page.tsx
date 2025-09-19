
import TextGenerator from '@/components/text-generator';
import { FileText, Type, Sparkles, BookOpen } from 'lucide-react';
import { Suspense } from 'react';

const features = [
    {
        icon: Type,
        title: "Génération Polyvalente",
        description: "Que vous ayez besoin d'un article de blog, d'un script pour une vidéo, d'un poème ou d'une description de produit, (X)texte s'adapte à votre demande."
    },
    {
        icon: Sparkles,
        title: "Inspiration Continue",
        description: "Bloqué sur une page blanche ? Donnez un simple thème ou une idée de départ et laissez l'IA rédiger un premier jet pour stimuler votre créativité."
    },
    {
        icon: BookOpen,
        title: "Adapté à Votre Ton",
        description: "Combinez (X)texte avec (X)tone pour générer du contenu qui respecte parfaitement la voix et le style de votre marque."
    }
];

const TextPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 p-3 rounded-full w-fit animate-gradient-x">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 animate-gradient-x">
                (X)texte
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre rédacteur IA personnel. Générez des articles, des scripts, des poèmes ou tout autre contenu textuel en quelques secondes.
                </p>
            </section>
            
            <Suspense>
                <TextGenerator />
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

export default TextPage;
