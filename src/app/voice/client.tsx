
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const VoiceGenerator = dynamic(() => import('@/components/voice-generator'), {
    ssr: false,
    loading: () => <VoiceGeneratorSkeleton />,
});

function VoiceGeneratorSkeleton() {
    return (
        <Card className="glass-card max-w-4xl mx-auto w-full">
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
                <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-32 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="mt-8">
                     <Skeleton className="h-24 w-full" />
                 </div>
            </CardContent>
        </Card>
    );
}

export default function VoiceClient() {
    return <VoiceGenerator />;
}
