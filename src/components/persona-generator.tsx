
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generatePersonaAction, generateImageAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Users, User, Heart, ThumbsDown, Download, ZoomIn, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeneratePersonaOutput } from '@/ai/types';
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

type PersonaWithImage = GeneratePersonaOutput['personas'][0] & { imageUrl?: string; isLoadingImage: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Analyse en cours..." isCompact={true} />
      ) : (
        <>
          Générer les Personas
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ personas, onReset }: { personas: PersonaWithImage[], onReset: () => void }) {
    const handleDownload = (imageUri: string, name: string) => {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `xyzz-ai-persona-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-6 space-y-12">
             <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Créer d'autres personas
                </Button>
            </div>
            {personas.map((persona, index) => (
                <Card key={index} className="glass-card overflow-hidden">
                    <CardContent className="p-6 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 flex flex-col items-center text-center">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-muted/30 mb-4 group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                        {persona.isLoadingImage ? (
                                            <Skeleton className="w-full h-full" />
                                        ) : persona.imageUrl ? (
                                            <>
                                                <Image
                                                    src={persona.imageUrl}
                                                    alt={`Avatar de ${persona.name}`}
                                                    fill
                                                    sizes="(max-width: 768px) 128px, 160px"
                                                    className="object-cover"
                                                    data-ai-hint="portrait face"
                                                />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <ZoomIn className="h-8 w-8 text-white" />
                                                </div>
                                            </>
                                        ) : <User className="w-20 h-20 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                    </div>
                                </AlertDialogTrigger>
                                {persona.imageUrl && (
                                    <AlertDialogContent className="max-w-2xl p-2 glass-card">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="sr-only">Avatar de {persona.name}</AlertDialogTitle>
                                            <AlertDialogDescription className="sr-only">
                                                Voici une version agrandie de l'avatar. Vous pouvez le télécharger ou fermer cette vue.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="relative">
                                            <Image
                                                src={persona.imageUrl}
                                                alt={`Avatar de ${persona.name}`}
                                                width={800}
                                                height={800}
                                                className="rounded-md w-full h-auto object-contain max-h-[80vh]"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
                                                onClick={() => handleDownload(persona.imageUrl!, persona.name)}
                                                aria-label="Télécharger l'avatar"
                                            >
                                                <Download className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <AlertDialogFooter className="p-2 sm:justify-end bg-transparent border-t-0">
                                            <AlertDialogAction>Fermer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>
                            <h3 className="text-xl font-bold">{persona.name}</h3>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <p className="text-muted-foreground italic">"{persona.bio}"</p>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><Heart className="h-4 w-4 text-green-500" /> Motivations</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {persona.motivations.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><ThumbsDown className="h-4 w-4 text-red-500" /> Frustrations</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {persona.frustrations.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


function PersonaForm({ state }: {
    state: { message: string, result: GeneratePersonaOutput | null, error: string | null, id: number, prompt: string }
}) {
    const { pending } = useFormStatus();

    return (
        <Card className="glass-card">
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>Quel est votre projet ?</CardTitle>
                            <CardDescription>
                                Décrivez votre idée pour que l'IA puisse imaginer votre public.
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    name="prompt"
                    placeholder="Exemple : Une application mobile pour apprendre à jardiner sur son balcon."
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

export default function PersonaGenerator({ initialResult, prompt }: { initialResult?: GeneratePersonaOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState = { 
        message: initialResult ? 'success' : '', 
        result: initialResult || null, 
        error: null, 
        id: key, 
        prompt: prompt || promptFromUrl || '' 
    };
    const [state, formAction] = useFormState(generatePersonaAction, initialState);
    const [personasWithImages, setPersonasWithImages] = useState<PersonaWithImage[]>([]);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)persona',
                description: state.error,
            });
        }

        if (state.result?.personas) {
            setShowForm(false);
            const initialPersonas = state.result.personas.map(p => ({ ...p, isLoadingImage: true }));
            setPersonasWithImages(initialPersonas);

            initialPersonas.forEach((persona, index) => {
                const formData = new FormData();
                formData.append('prompt', persona.avatarPrompt);
                
                generateImageAction({ id: Math.random(), message: '', imageDataUri: null, error: null, prompt: '' }, formData)
                    .then(imageResult => {
                        if (imageResult.message === 'success' && imageResult.imageDataUri) {
                            setPersonasWithImages(prev => {
                                const newPersonas = [...prev];
                                newPersonas[index] = { ...newPersonas[index], imageUrl: imageResult.imageDataUri, isLoadingImage: false };
                                return newPersonas;
                            });
                        } else {
                             setPersonasWithImages(prev => {
                                const newPersonas = [...prev];
                                newPersonas[index] = { ...newPersonas[index], isLoadingImage: false };
                                return newPersonas;
                            });
                        }
                    })
                    .catch(() => {
                        setPersonasWithImages(prev => {
                            const newPersonas = [...prev];
                            newPersonas[index] = { ...newPersonas[index], isLoadingImage: false };
                            return newPersonas;
                        });
                    });
            });
        }
    }, [state, toast]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
        setPersonasWithImages([]);
    };

    return (
        <form action={formAction} key={key}>
            <div className="max-w-4xl mx-auto">
                {showForm && <PersonaForm state={initialState} />}
            
                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[400px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)persona imagine votre audience..." />
                            </div>
                        </Card>
                    </div>
                )}
                
                {!showForm && personasWithImages.length > 0 && <ResultsDisplay personas={personasWithImages} onReset={handleReset} />}
            </div>
        </form>
    );
}
