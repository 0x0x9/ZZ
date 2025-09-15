
'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HardDrive, FileCheck2, Users, Signal, UploadCloud, Zap, CheckCircle, Clock, Loader, File, FileImage, FileText, Folder } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { uploadDocumentAction } from '@/app/actions';
import type { Doc } from '@/ai/types';

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Octets';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/x-directory') return <Folder className="h-6 w-6 text-yellow-500" />;
    if (mimeType.startsWith('image/')) return <FileImage className="h-6 w-6 text-blue-400" />;
    if (mimeType.startsWith('text/')) return <FileText className="h-6 w-6 text-green-400" />;
    return <File className="h-6 w-6 text-gray-400" />;
}

const StatCard = ({ icon, value, title, subtitle, progress, colorClass }: any) => (
  <Card className="glass-card p-4">
    <CardContent className="p-0">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        {progress !== undefined && <p className="text-sm font-bold">{Math.round(progress)}%</p>}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {progress !== undefined && <Progress value={progress} className="h-1 mt-3" />}
    </CardContent>
  </Card>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="glass-card">
        <CardContent className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20 text-blue-300">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </CardContent>
    </Card>
);


const DashboardSkeleton = () => (
    <div className="space-y-8 h-full flex flex-col">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
    </div>
);

export default function CloudDashboard({ docs, loading, onDataChange }: { docs: Doc[], loading: boolean, onDataChange: () => void }) {
    const { usedStorage, totalStorage, storagePercentage } = useMemo(() => {
        const used = docs.reduce((acc, doc) => acc + (doc.size || 0), 0);
        const total = 15 * 1024 * 1024 * 1024;
        return {
            usedStorage: used,
            totalStorage: total,
            storagePercentage: total > 0 ? (used / total) * 100 : 0,
        };
    }, [docs]);

    const recentDocs = useMemo(() => {
        return [...docs]
            .filter(doc => doc.updatedAt && !doc.name.endsWith('/.placeholder'))
            .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
            .slice(0, 4);
    }, [docs]);


    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    
    const handleFile = async (file: File) => {
        setIsUploading(true);
        setIsDragging(false);
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string); // data:mimetype;base64,data
            try {
                await uploadDocumentAction({ name: file.name, content: base64, mimeType: file.type });
                toast({ title: 'Succès', description: `"${file.name}" a été envoyé.` });
                onDataChange();
            } catch (error: any) {
                toast({ variant: 'destructive', title: "Échec de l'envoi", description: error.message });
            } finally {
                setIsUploading(false);
            }
        };
        reader.onerror = () => {
             toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de lire le fichier.' });
             setIsUploading(false);
        }
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };
    
    const handleUploadClick = () => {
        if (isUploading) return;
        fileInputRef.current?.click();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUploading) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isUploading) return;
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    };
    
    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex flex-col space-y-8">
            <div>
                <h2 className="text-3xl font-bold">Tableau de bord</h2>
                <p className="text-gray-400">Aperçu de votre espace cloud en temps réel.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<HardDrive className="h-5 w-5" />} value={formatBytes(usedStorage)} title="Stockage Utilisé" subtitle={`sur ${formatBytes(totalStorage, 0)}`} progress={storagePercentage} colorClass="bg-blue-500/20 text-blue-300" />
                <StatCard icon={<FileCheck2 className="h-5 w-5" />} value={docs.length} title="Fichiers Synchronisés" subtitle="+23 cette semaine" colorClass="bg-purple-500/20 text-purple-300" />
                <StatCard icon={<Users className="h-5 w-5" />} value="8" title="Collaborateurs Actifs" subtitle="en ligne maintenant" colorClass="bg-green-500/20 text-green-300" />
                <StatCard icon={<Signal className="h-5 w-5" />} value="156 MB/s" title="Bande Passante" subtitle="vitesse moyenne" colorClass="bg-orange-500/20 text-orange-300" />
            </div>

            <div
                className={cn(
                    "glass-card text-center p-8 border-2 border-dashed border-white/20 transition-all duration-300 ease-in-out cursor-pointer",
                    isDragging && "border-primary/80 bg-primary/10 scale-105",
                    isUploading && "border-amber-500/80 bg-amber-500/10 cursor-not-allowed"
                )}
                onClick={handleUploadClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} disabled={isUploading} />
                {isUploading ? (
                     <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-300 mb-4">
                            <Loader className="h-8 w-8 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold">Envoi en cours...</h3>
                        <p className="text-gray-400 mt-2 text-sm">Veuillez patienter.</p>
                    </div>
                ) : isDragging ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/20 text-primary mb-4">
                            <UploadCloud className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">Relâchez pour envoyer</h3>
                        <p className="text-gray-400 mt-2 text-sm">Le fichier sera ajouté à votre Cloud.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-300">
                                <UploadCloud className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold">Téléchargement Intelligent</h3>
                        <p className="text-gray-400 mt-2 text-sm">Glissez-déposez vos fichiers ou cliquez pour parcourir</p>
                        <p className="text-gray-500 mt-1 text-xs">Formats supportés: Images, Documents, Vidéos, Audio, Modèles 3D et plus</p>
                    </>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold">Fichiers Récents</h3>
                {recentDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentDocs.map(doc => (
                            <Card key={doc.id} className="glass-card">
                                <CardContent className="p-4 flex items-center gap-4">
                                    {getFileIcon(doc.mimeType)}
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-sm truncate">{doc.name.split('/').pop()}</p>
                                        <p className="text-xs text-muted-foreground">{formatBytes(doc.size)} &bull; Modifié {formatDistanceToNow(new Date(doc.updatedAt!), { addSuffix: true, locale: fr })}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <Card className="glass-card">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <p>Les documents récemment modifiés apparaîtront ici.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
