

'use client';

import { useState, useEffect, useCallback } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CloudDashboard from '@/components/cloud-dashboard';
import SharingClient from '@/app/cloud/sharing/client';
import DocManager from '@/components/doc-manager';
import ActivityClient from '@/app/cloud/activity/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutDashboard, Folder, Share2, History } from 'lucide-react';
import { listDocumentsAction } from '@/app/actions';
import type { Doc } from '@/ai/types';

export default function CloudApp() {
    const [tab, setTab] = useState('dashboard');
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

    const tabs = [
        { value: 'dashboard', label: 'Tableau de bord', description: 'Aperçu de votre espace cloud.', icon: LayoutDashboard },
        { value: 'files', label: 'Fichiers', description: 'Gérez tous vos documents.', icon: Folder },
        { value: 'sharing', label: 'Partage', description: 'Gérez vos liens de partage.', icon: Share2 },
        { value: 'activity', label: 'Activité', description: 'Consultez les dernières modifications.', icon: History },
    ];
    
    const currentTabInfo = tabs.find(t => t.value === tab) || tabs[0];

    if (loading) {
         return (
            <div className="flex-1 p-4 flex flex-col h-full space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
                <Skeleton className="flex-1 w-full" />
            </div>
        );
    }

    return (
        <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="flex-1 p-2 flex flex-col h-full bg-transparent">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold">{currentTabInfo.label}</h2>
                    <p className="text-sm text-muted-foreground">{currentTabInfo.description}</p>
                </div>
                <TabsList className="hidden md:inline-flex bg-black/10 dark:bg-white/10 gap-1 p-1">
                    {tabs.map((t) => (
                        <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=inactive]:bg-transparent">
                           <t.icon className="h-4 w-4"/>
                           {t.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            
            <div className="flex-1 min-h-0">
                <TabsContent value="dashboard" className="w-full h-full mt-0 data-[state=inactive]:hidden flex flex-col">
                    <div className="overflow-y-auto h-full no-scrollbar">
                        <CloudDashboard docs={docs} loading={loading} onDataChange={fetchDocs} />
                    </div>
                </TabsContent>
                <TabsContent value="files" className="w-full h-full mt-0 data-[state=inactive]:hidden flex flex-col">
                    <DocManager onDataChange={fetchDocs} />
                </TabsContent>
                <TabsContent value="sharing" className="w-full h-full mt-0 data-[state=inactive]:hidden flex flex-col">
                    <div className="overflow-y-auto h-full no-scrollbar">
                        <SharingClient docs={docs} onDataChange={fetchDocs} />
                    </div>
                </TabsContent>
                <TabsContent value="activity" className="w-full h-full mt-0 data-[state=inactive]:hidden flex flex-col">
                    <div className="overflow-y-auto h-full no-scrollbar">
                        <ActivityClient docs={docs} loading={loading} />
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    );
}
