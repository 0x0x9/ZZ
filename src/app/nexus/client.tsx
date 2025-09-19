
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const NexusGenerator = dynamic(() => import('@/components/nexus-generator'), {
    ssr: false,
    loading: () => <NexusGeneratorSkeleton />,
});

function NexusGeneratorSkeleton() {
    return (
        <Card className="glass-card max-w-4xl mx-auto">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div>
                        <Skeleton className="h-7 w-64" />
                        <Skeleton className="h-5 w-72 mt-2" />
                    </div>
                </div>
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

export default function NexusClient() {
    return <NexusGenerator />;
}
