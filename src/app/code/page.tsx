
import CodeGenerator from '@/components/code-generator';
import { CodeXml, Bug, BrainCircuit, Wand2 } from 'lucide-react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Wand2,
        title: "Génération Intelligente",
        description: "Décrivez ce que vous voulez en langage naturel et laissez (X)code générer un code propre et fonctionnel dans le langage de votre choix."
    },
    {
        icon: BrainCircuit,
        title: "Explication de Code",
        description: "Collez un snippet de code complexe et demandez à (X)code de vous l'expliquer ligne par ligne, de manière simple et claire."
    },
    {
        icon: Bug,
        title: "Débogage Assisté",
        description: "Votre code ne fonctionne pas ? (X)code peut analyser votre code, identifier les bugs potentiels et vous proposer des corrections."
    }
];

const CodePage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-400 via-cyan-500 to-green-400 p-3 rounded-full w-fit animate-gradient-x">
                        <CodeXml className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-500 to-green-400 animate-gradient-x">
                (X)code
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre partenaire de code IA. Générez des snippets, des fonctions ou des composants dans n'importe quel langage, à partir d'une simple description.
                </p>
            </section>
            
            <Suspense>
                <CodeGenerator />
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

export default CodePage;
