'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { ProjectPlan } from '@/ai/types';

const MaestroGenerator = dynamic(() => import('@/components/maestro-generator'), {
    ssr: false,
    loading: () => <MaestroGeneratorSkeleton />,
});

function MaestroGeneratorSkeleton() {
    return (
        <Card className="glass-card max-w-4xl mx-auto w-full">
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

export default function MaestroClient() {
    const searchParams = useSearchParams();
    const resultId = searchParams.get('resultId');

    const { initialResult, prompt } = useMemo(() => {
        if (typeof window === 'undefined' || !resultId) return { initialResult: null, prompt: null };
        const stored = localStorage.getItem(resultId);
        if (stored) {
            try {
                localStorage.removeItem(resultId);
                const parsedState = JSON.parse(stored);
                return { initialResult: parsedState.result as ProjectPlan, prompt: parsedState.prompt };
            } catch (e) {
                console.error("Failed to parse stored MaestroGenerator result", e);
            }
        }
        return { initialResult: null, prompt: null };
    }, [resultId]);

    return <MaestroGenerator initialResult={initialResult} prompt={prompt} />;
}
