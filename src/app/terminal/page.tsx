

import TerminalClient from './client';
import { Terminal, Command, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: Command,
        title: "Interface de Commande",
        description: "Interagissez avec l'écosystème (X)yzz en utilisant des commandes simples et intuitives, comme 'open cloud' ou 'help'."
    },
    {
        icon: Zap,
        title: "Accès Rapide aux Outils",
        description: "Lancez n'importe quelle application de la suite (X)yzz directement depuis le terminal pour un workflow plus rapide et efficace."
    },
    {
        icon: Terminal,
        title: "Assistance Oria Intégrée",
        description: "Discutez directement avec Oria. Posez des questions, demandez-lui de générer du code ou du texte, le tout sans quitter votre ligne de commande."
    }
];

const TerminalPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800 p-3 rounded-full w-fit animate-gradient-x">
                        <Terminal className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800 animate-gradient-x">
                (X)term
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Une interface de ligne de commande pour interagir avec vos outils et vos fichiers.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=terminal">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <TerminalClient />

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

export default TerminalPage;
