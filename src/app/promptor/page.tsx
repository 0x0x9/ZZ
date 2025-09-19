
import PromptorClient from './client';
import { Lightbulb, Palette, Film, Type } from 'lucide-react';

const features = [
    {
        icon: Type,
        title: "Titres Accrocheurs",
        description: "Obtenez une liste de titres percutants et créatifs pour vos articles, vidéos ou projets, parfaitement adaptés à votre idée de base."
    },
    {
        icon: Palette,
        title: "Styles Artistiques",
        description: "Explorez des directions visuelles et des tons uniques. (X)promptor vous suggère des styles comme 'Néonoir' ou 'Aquarelle surréaliste' pour guider votre création."
    },
    {
        icon: Film,
        title: "Prompts d'Image Détaillés",
        description: "Générez des prompts prêts à l'emploi pour les IA de génération d'images, transformant votre concept en descriptions riches et évocatrices."
    }
];

const PromptorPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x">
                (X)promptor
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre muse créative. Transformez une idée vague en un univers de possibilités : titres, styles, et prompts visuels.
                </p>
            </section>
            
            <PromptorClient />

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

export default PromptorPage;
