

import PersonaClient from './client';
import { Users, User, Heart, ThumbsDown, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
        icon: User,
        title: "Profils Détaillés",
        description: "Générez 2 à 3 personas complets avec nom, biographie et un avatar visuel unique pour incarner votre audience cible."
    },
    {
        icon: Heart,
        title: "Motivations Clés",
        description: "Comprenez ce qui anime vos utilisateurs. (X)persona identifie leurs motivations profondes en lien avec votre projet pour affiner votre message."
    },
    {
        icon: ThumbsDown,
        title: "Points de Friction",
        description: "Anticipez les problèmes. L'IA met en lumière les frustrations et les obstacles que vos personas rencontrent, vous aidant à concevoir une meilleure expérience."
    }
];

const PersonaPage = () => {
    return (
        <div className="w-full space-y-24">
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 animate-gradient-x">
                (X)persona
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre stratège IA. Décrivez votre projet pour générer des profils d'audience détaillés et pertinents.
                </p>
                 <div className="mt-8">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/xos?open=persona">
                            Ouvrir dans (X)OS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
            
            <Suspense>
                <PersonaClient />
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

export default PersonaPage;
