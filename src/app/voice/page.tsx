
import VoiceClient from './client';
import { AudioLines, Sparkles, SlidersHorizontal, Download } from 'lucide-react';
import { Suspense } from 'react';

const features = [
    {
        icon: Sparkles,
        title: "Synthèse Haute Fidélité",
        description: "Transformez n'importe quel texte en une voix off claire, naturelle et de qualité studio grâce à nos modèles de synthèse vocale de pointe."
    },
    {
        icon: SlidersHorizontal,
        title: "Sélection de Voix",
        description: "Choisissez parmi une gamme de voix professionnelles, masculines et féminines, pour trouver celle qui correspond parfaitement à votre projet."
    },
    {
        icon: Download,
        title: "Export Facile",
        description: "Téléchargez vos fichiers audio au format WAV pour une intégration transparente dans vos montages vidéo, podcasts ou applications."
    }
];

const VoicePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 p-3 rounded-full w-fit animate-gradient-x">
                        <AudioLines className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-600 animate-gradient-x">
                (X)voice
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre studio de doublage IA. Donnez une voix professionnelle et naturelle à vos textes en choisissant parmi une sélection de voix de haute qualité.
                </p>
            </section>
            
            <Suspense>
                <VoiceClient />
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

export default VoicePage;
