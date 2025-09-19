
import MaestroClient from './client';
import { BrainCircuit, BookOpen, CheckSquare, CalendarPlus } from 'lucide-react';
import { Suspense } from 'react';

const features = [
    {
        icon: BookOpen,
        title: "Brief Créatif Automatisé",
        description: "Maestro ne se contente pas de lister des tâches. Il synthétise votre idée en un brief créatif qui définit la vision, le ton et le public de votre projet."
    },
    {
        icon: CheckSquare,
        title: "Plan d'Action Structuré",
        description: "Recevez un plan détaillé avec des phases claires (Recherche, Création, Lancement) et des tâches concrètes, chacune avec sa propre checklist."
    },
    {
        icon: CalendarPlus,
        title: "Planification Intelligente",
        description: "Mentionnez une date dans votre description, et Maestro extraira l'information pour créer automatiquement des événements dans votre agenda."
    }
];

const MaestroPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-600 p-3 rounded-full w-fit animate-gradient-x">
                        <BrainCircuit className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-600 animate-gradient-x">
                Maestro
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre chef de projet IA. Décrivez une idée, Maestro la transforme en un plan d'action détaillé.
                </p>
            </section>
            
            <Suspense>
                <MaestroClient />
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

export default MaestroPage;
