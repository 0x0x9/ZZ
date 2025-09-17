
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { listDocumentsAction } from '@/app/actions';
import type { Doc } from '@/ai/types';

// Use dynamic imports to code-split each tab's content
const SharingClient = dynamic(() => import('@/app/cloud/sharing/client'));
const DocManager = dynamic(() => import('@/components/doc-manager'));
const ActivityClient = dynamic(() => import('@/app/cloud/activity/client'));
const CloudDashboard = dynamic(() => import('@/components/cloud-dashboard')); // Corrected import path

function CloudPageContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'dashboard';

    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchDocs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await listDocumentsAction();
            setDocs(result || []);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
            setDocs([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);
    
    if (loading) {
         return (
            <div className="flex-1 p-6 pt-0 flex flex-col h-full space-y-8">
                <Skeleton className="h-10 w-72" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                </div>
                <Skeleton className="flex-1 w-full" />
            </div>
        );
    }

    const renderContent = () => {
        switch (tab) {
            case 'files':
                return <DocManager onDataChange={fetchDocs} />;
            case 'sharing':
                return <div className="overflow-y-auto h-full no-scrollbar"><SharingClient docs={docs} onDataChange={fetchDocs} /></div>;
            case 'activity':
                return <div className="overflow-y-auto h-full no-scrollbar"><ActivityClient docs={docs} loading={loading} /></div>;
            case 'dashboard':
            default:
                return <div className="overflow-y-auto h-full no-scrollbar"><CloudDashboard docs={docs} loading={loading} onDataChange={fetchDocs} /></div>;
        }
    }

    return (
        <div className="flex-1 pt-0 flex flex-col h-full">
            {renderContent()}
        </div>
    );
}

const CloudPage = () => {
    return (
        <Suspense>
            <CloudPageContent />
        </Suspense>
    );
}

export default CloudPage;
