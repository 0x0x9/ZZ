'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const MuseGenerator = dynamic(() => import('@/components/muse-generator'), {
    ssr: false,
    loading: () => <MuseGeneratorSkeleton />,
});

function MuseGeneratorSkeleton() {
    return (
        <Card className="glass-card w-full">
            <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
}

export default function MuseClient() {
    return (
        <Suspense>
            <MuseGenerator />
        </Suspense>
    );
}
