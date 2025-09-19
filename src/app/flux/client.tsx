'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { GenerateFluxOutput } from '@/ai/types';
import { Wand2 } from 'lucide-react';

const FluxGenerator = dynamic(() => import('@/components/flux-generator'), {
    ssr: false,
    loading: () => <FluxGeneratorSkeleton />,
});

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

    const { initialResult, prompt } = useMemo(() => {
        if (typeof window === 'undefined' || !resultId) return { initialResult: null, prompt: null };
        const stored = localStorage.getItem(resultId);
        if (stored) {
            try {
                localStorage.removeItem(resultId);
                const parsedState = JSON.parse(stored);
                return { initialResult: parsedState.result as GenerateFluxOutput, prompt: parsedState.prompt };
            } catch (e) {
                console.error("Failed to parse stored FluxGenerator result", e);
            }
        }
        return { initialResult: null, prompt: null };
    }, [resultId]);

    return (
        <>
            <section className="text-center mb-12">
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
            
            <FluxGenerator initialResult={initialResult} prompt={prompt} />
        </>
    );
}
