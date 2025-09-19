
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { GenerateFluxOutput } from '@/ai/types';
import { Wand2, BrainCircuit, Zap, Link as LinkIcon, GitBranch, Share2, FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const FluxGenerator = dynamic(() => import('@/components/flux-generator'), {
    ssr: false,
    loading: () => <FluxGeneratorSkeleton />,
});

const features = [
    {
        icon: BrainCircuit,
        title: "Planification Stratégique",
        description: "(X)flux ne se contente pas de créer. Il analyse votre idée pour générer un plan de projet complet avec un brief créatif et des tâches claires, vous donnant une feuille de route dès le départ."
    },
    {
        icon: GitBranch,
        title: "Génération Multi-Outils",
        description: "En une seule requête, (X)flux orchestre plusieurs outils IA spécialisés (palette, tone, personas, etc.) pour produire un ensemble de livrables cohérents et prêts à l'emploi."
    },
    {
        icon: FilePlus,
        title: "Base de Projet Solide",
        description: "Plutôt que de partir de zéro sur plusieurs fronts, vous obtenez une fondation solide pour votre marque, votre contenu et votre stratégie, vous faisant gagner des heures de travail."
    }
];

function FluxGeneratorSkeleton() {
    return (
        <Card className="glass-card max-w-2xl mx-auto w-full">
            <CardHeader className="text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 border-4 border-primary/20">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-8 w-72 mx-auto" />
                <Skeleton className="h-5 w-96 mx-auto mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <Skeleton className="h-12 w-48" />
            </div>
        </Card>
    );
}

export default function FluxClient() {
    const searchParams = useSearchParams();
    const resultId = searchParams.get('resultId');

    const { initialResult, prompt, job } = useMemo(() => {
        if (typeof window === 'undefined' || !resultId) return { initialResult: null, prompt: null, job: null };
        const stored = localStorage.getItem(resultId);
        if (stored) {
            try {
                localStorage.removeItem(resultId);
                const parsedState = JSON.parse(stored);
                return { 
                    initialResult: parsedState.result as GenerateFluxOutput, 
                    prompt: parsedState.prompt,
                    job: parsedState.job
                };
            } catch (e) {
                console.error("Failed to parse stored FluxGenerator result", e);
            }
        }
        return { initialResult: null, prompt: null, job: null };
    }, [resultId]);

    return (
        <div className="w-full space-y-24 md:space-y-32">
            <section className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-3 rounded-full w-fit animate-gradient-x bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                        <Wand2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x">
                (X)flux
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                L’assistant IA qui transforme une pensée en projet complet. Décrivez votre objectif, (X)flux s'occupe du reste.
                </p>
            </section>
            
            <FluxGenerator initialResult={initialResult} prompt={prompt} job={job} />

            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                                <feature.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">{feature.title}</h3>
                            <p className="text-muted-foreground mt-3">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
