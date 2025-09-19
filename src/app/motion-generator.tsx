
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Download, ZoomIn, RefreshCcw, Film, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateMotionOutput } from '@/ai/types';
import Image from 'next/image';
import { LoadingState } from './loading-state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import AiLoadingAnimation from './ui/ai-loading-animation';
import { Skeleton } from './ui/skeleton';

type SceneWithVideo = GenerateMotionOutput['scenes'][0] & { videoDataUri?: string; isLoadingVideo: boolean };
type MotionResultWithMedia = GenerateMotionOutput & {
    coverImageDataUri?: string;
    isLoadingCover: boolean;
    scenes: SceneWithVideo[];
};

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} size="lg">
      {isLoading ? (
        <LoadingState text="Création en cours..." isCompact={true} />
      ) : (
        <>
          Générer la vidéo
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ result, onReset }: { result: MotionResultWithMedia, onReset: () => void }) {
    const handleDownload = (uri: string, name: string, type: 'image' | 'video') => {
        const link = document.createElement('a');
        link.href = uri;
        const extension = type === 'image' ? 'png' : 'mp4';
        link.download = `xyzz-ai-motion-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-6 space-y-8">
            <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Créer une autre vidéo
                </Button>
            </div>
            <Card className="glass-card overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{result.title}</CardTitle>
                    <CardDescription>Votre script et visuels générés par (X)motion.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     {result.isLoadingCover ? (
                         <Skeleton className="aspect-video w-full" />
                    ) : result.coverImageDataUri && (
                        <div className="space-y-2">
                             <h3 className="font-semibold text-lg">Image de couverture</h3>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                        <Image src={result.coverImageDataUri} alt={`Image de couverture pour ${result.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <ZoomIn className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-4xl p-2 glass-card">
                                    <div className="relative">
                                        <Image src={result.coverImageDataUri} alt={`Image de couverture pour ${result.title}`} width={1920} height={1080} className="rounded-md w-full h-auto object-contain max-h-[80vh]" />
                                        <Button type="button" size="icon" variant="secondary" className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white" onClick={() => handleDownload(result.coverImageDataUri!, result.title, 'image')} aria-label="Télécharger l'image"><Download className="h-5 w-5" /></Button>
                                    </div>
                                    <AlertDialogFooter className="p-2 sm:justify-end bg-transparent border-t-0"><AlertDialogAction>Fermer</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Scènes Vidéo</h3>
                        <div className="space-y-6">
                             {result.scenes.map((scene, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-background/30 rounded-lg">
                                    <div className="w-full md:w-1/2 aspect-video bg-black rounded-md flex items-center justify-center relative overflow-hidden">
                                        {scene.isLoadingVideo ? (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                <span>Génération...</span>
                                            </div>
                                        ) : scene.videoDataUri ? (
                                            <video src={scene.videoDataUri} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                                        ) : (
                                            <div className="text-center text-xs text-muted-foreground p-2">
                                                <Video className="h-6 w-6 mx-auto mb-2" />
                                                La génération vidéo a échoué.
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm mb-1">Scène {index + 1}</p>
                                        <p className="text-muted-foreground italic">"{scene.narration}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MotionForm({ prompt, onPromptChange, isLoading }: {
    prompt: string;
    onPromptChange: (value: string) => void;
    isLoading: boolean;
}) {
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Film className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>Quelle est votre idée de vidéo ?</CardTitle>
                            <CardDescription>
                                Un script, un pitch, ou même une simple phrase.
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <Textarea
                name="prompt"
                placeholder="Exemple : Une courte vidéo pour une application de méditation, avec une voix douce et une ambiance zen."
                rows={5}
                required
                minLength={15}
                className="bg-transparent text-base"
                disabled={isLoading}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
            />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton isLoading={isLoading} />
            </div>
        </Card>
    );
}

export default function MotionGenerator({ initialResult, prompt: promptProp }: { initialResult?: GenerateMotionOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const [resultWithMedia, setResultWithMedia] = useState<MotionResultWithMedia | null>(initialResult ? { ...initialResult, scenes: initialResult.scenes.map(s => ({...s, isLoadingVideo: true})), isLoadingCover: true } : null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState(promptProp || promptFromUrl || '');
    
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResultWithMedia(null);

        try {
            const scriptResponse = await fetch('/api/generateMotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!scriptResponse.ok) {
                const errorData = await scriptResponse.json();
                throw new Error(errorData.error || 'API Error');
            }

            const scriptData: GenerateMotionOutput = await scriptResponse.json();
            setShowForm(false);
            setResultWithMedia({
                ...scriptData,
                isLoadingCover: true,
                scenes: scriptData.scenes.map(s => ({ ...s, isLoadingVideo: true }))
            });

            // Trigger image and video generation in parallel
            generateContent({ contentType: 'image', prompt: scriptData.coverImagePrompt })
                .then(imageResult => {
                    if (imageResult.type === 'image' && imageResult.data) {
                        setResultWithMedia(prev => prev ? ({ ...prev, coverImageDataUri: imageResult.data as string, isLoadingCover: false }) : null);
                    }
                }).catch(() => {
                    setResultWithMedia(prev => prev ? ({ ...prev, isLoadingCover: false }) : null);
                    toast({ variant: 'destructive', title: "Erreur de l'image de couverture" });
                });

            scriptData.scenes.forEach(async (scene, index) => {
                try {
                    const videoResponse = await fetch('/api/generateVideo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: scene.narration }),
                    });
                    const videoResult = await videoResponse.json();
                    
                     if (!videoResponse.ok) {
                        throw new Error(videoResult.error || 'Video generation failed');
                     }

                    if (videoResult.videoDataUri) {
                        setResultWithMedia(prev => {
                            if (!prev) return null;
                            const newScenes = [...prev.scenes];
                            newScenes[index] = { ...newScenes[index], videoDataUri: videoResult.videoDataUri, isLoadingVideo: false };
                            return { ...prev, scenes: newScenes };
                        });
                    }
                } catch (videoError: any) {
                    console.error(`Failed to generate video for scene ${index}:`, videoError);
                    toast({ variant: 'destructive', title: `Erreur Scène ${index+1}`, description: videoError.message });
                    setResultWithMedia(prev => {
                        if (!prev) return null;
                        const newScenes = [...prev.scenes];
                        newScenes[index] = { ...newScenes[index], isLoadingVideo: false };
                        return { ...prev, scenes: newScenes };
                    });
                }
            });

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur (X)motion', description: error.message });
            setShowForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
        setResultWithMedia(null);
        setPrompt('');
    };

    return (
        <form onSubmit={handleSubmit} key={key}>
             <div className="max-w-4xl mx-auto">
                {showForm && <MotionForm prompt={prompt} onPromptChange={setPrompt} isLoading={isLoading} />}
                
                {isLoading && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[500px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                             <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)motion réalise votre vidéo..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && resultWithMedia && <ResultsDisplay result={resultWithMedia} onReset={handleReset} />}
            </div>
        </form>
    );
}

  