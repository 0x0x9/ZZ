
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateMotionAction, generateImageAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Download, ZoomIn, RefreshCcw, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { VideoScript } from '@/ai/types';
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

type MotionResultWithImage = VideoScript & { coverImageDataUri?: string; isLoadingCover: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
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

function ResultsDisplay({ result, onReset }: { result: MotionResultWithImage, onReset: () => void }) {
    const handleDownload = (imageUri: string, name: string) => {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `xyzz-ai-motion-cover-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
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
                    <CardDescription>Votre script et visuel de couverture générés par (X)motion.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {result.isLoadingCover ? (
                         <Skeleton className="aspect-video w-full" />
                    ) : result.coverImageDataUri ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                    <Image
                                        src={result.coverImageDataUri}
                                        alt={`Image de couverture pour ${result.title}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        data-ai-hint="video cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <ZoomIn className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-4xl p-2 glass-card">
                                 <AlertDialogHeader>
                                    <AlertDialogTitle className="sr-only">Image Agrandie</AlertDialogTitle>
                                    <AlertDialogDescription className="sr-only">
                                        Voici une version agrandie de l'image. Vous pouvez la télécharger ou fermer cette vue.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="relative">
                                    <Image
                                        src={result.coverImageDataUri}
                                        alt={`Image de couverture pour ${result.title}`}
                                        width={1024}
                                        height={576}
                                        className="rounded-md w-full h-auto object-contain max-h-[80vh]"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
                                        onClick={() => handleDownload(result.coverImageDataUri!, result.title)}
                                        aria-label="Télécharger l'image"
                                    >
                                        <Download className="h-5 w-5" />
                                    </Button>
                                </div>
                                <AlertDialogFooter className="p-2 sm:justify-end bg-transparent border-t-0">
                                    <AlertDialogAction>Fermer</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : null}

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Scènes &amp; Narrations</h3>
                        <div className="space-y-4">
                             {result.scenes.map((scene, index) => (
                                <div key={index} className="flex gap-4 items-start p-3 bg-background/30 rounded-lg">
                                    <div className="flex-shrink-0 bg-primary/10 text-primary font-bold w-10 h-10 flex items-center justify-center rounded-full">
                                        {index + 1}
                                    </div>
                                    <p className="text-muted-foreground italic pt-2">"{scene.narration}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MotionForm({ state }: {
    state: { message: string, result: VideoScript | null, error: string | null, id: number, prompt: string }
}) {
    const { pending } = useFormStatus();
    
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
                disabled={pending}
                defaultValue={state.prompt ?? ''}
            />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton />
            </div>
        </Card>
    );
}

export default function MotionGenerator({ initialResult, prompt }: { initialResult?: VideoScript, prompt?: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const [resultWithImage, setResultWithImage] = useState<MotionResultWithImage | null>(initialResult ? { ...initialResult, isLoadingCover: true } : null);
    
    const initialState = {
        message: initialResult ? 'success' : '',
        result: initialResult || null,
        error: '',
        id: key,
        prompt: prompt || promptFromUrl || ''
    };

    const [state, formAction] = useFormState(generateMotionAction, initialState);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.message === 'error' && state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)motion',
                description: state.error,
            });
        }
        if (state.message === 'success' && state.result) {
            setShowForm(false);
            const script = state.result;
            const newResult: MotionResultWithImage = { ...script, isLoadingCover: true };
            setResultWithImage(newResult);

            const imagePrompt = `Image de couverture cinématographique pour une vidéo intitulée "${script.title}". La première scène est : "${script.scenes[0].narration}".`;
            
            const formData = new FormData();
            formData.append('prompt', imagePrompt);
            generateImageAction({ id: Math.random(), message: '', imageDataUri: null, error: null, prompt: '' }, formData)
                .then(imageResult => {
                    if (imageResult.message === 'success' && imageResult.imageDataUri) {
                        setResultWithImage(prev => prev ? ({ ...prev, coverImageDataUri: imageResult.imageDataUri, isLoadingCover: false }) : null);
                    } else {
                         setResultWithImage(prev => prev ? ({ ...prev, isLoadingCover: false }) : null);
                         toast({ variant: 'destructive', title: "Erreur de l'image de couverture", description: imageResult.error });
                    }
                });
        }
    }, [state, toast]);
    
    useEffect(() => {
        if (prompt && !initialResult && !state.result && !state.error) {
            const timer = setTimeout(() => {
                formRef.current?.requestSubmit();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [prompt, initialResult, state.result, state.error]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
        setResultWithImage(null);
    };

    return (
        <form ref={formRef} action={formAction} key={key}>
             <div className="max-w-4xl mx-auto">
                {showForm && <MotionForm state={initialState} />}

                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[500px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <AiLoadingAnimation isLoading={true} />
                            </div>
                             <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)motion réalise votre vidéo..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && resultWithImage && <ResultsDisplay result={resultWithImage} onReset={handleReset} />}
            </div>
        </form>
    );
}
