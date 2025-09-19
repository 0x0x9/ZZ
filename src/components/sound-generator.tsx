'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateSound, uploadDocument } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Music, Waves, Info, Save, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateSoundOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNotifications } from '@/hooks/use-notifications';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Composition en cours..." isCompact={true} />
      ) : (
        <>
          Générer le son
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ result, onReset }: { result: GenerateSoundOutput, onReset: () => void }) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveToDrive = async () => {
        if (!result.audioDataUri) return;
        setIsSaving(true);
        try {
            const fileName = `sounds/sound-${Date.now()}.wav`;
            await uploadDocument({ name: fileName, content: result.audioDataUri, mimeType: 'audio/wav' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6 space-y-4">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl flex items-center gap-2"><Waves className="h-6 w-6" /> Son Généré</CardTitle>
                         <div className="flex items-center gap-2">
                             <Button onClick={onReset} variant="outline" size="sm">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Nouveau
                            </Button>
                            <Button onClick={handleSaveToDrive} disabled={isSaving} variant="secondary" size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground italic mb-4">"{result.description}"</p>
                    <audio controls src={result.audioDataUri} className="w-full">
                        Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                </CardContent>
            </Card>
        </div>
    );
}

function SoundForm({ state }: {
    state: { result: GenerateSoundOutput | null, error: string | null, prompt: string }
}) {
    const { pending } = useFormStatus();

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Music className="h-7 w-7 text-primary" />
                    <div>
                        <CardTitle>Quel son souhaitez-vous créer ?</CardTitle>
                        <CardDescription>
                            Décrivez une musique, un bruitage ou une ambiance sonore.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-200">
                    <Info className="h-4 w-4 !text-blue-400" />
                    <AlertTitle>Note du développeur</AlertTitle>
                    <AlertDescription>
                    La génération de musique est expérimentale. (X)sound va décrire le son demandé avec une voix IA.
                    </AlertDescription>
                </Alert>
                <Textarea
                    name="prompt"
                    placeholder="Exemple : Le bruit d'une épée laser qui s'allume"
                    rows={3}
                    required
                    minLength={5}
                    className="bg-transparent text-base"
                    disabled={pending}
                    defaultValue={state.prompt ?? ''}
                />
            </CardContent>
            <CardFooter className="justify-center">
                <SubmitButton />
            </CardFooter>
        </Card>
    );
}

export default function SoundGenerator({ initialResult, prompt }: { initialResult?: GenerateSoundOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);
    
    const initialState = {
        result: initialResult || null,
        error: null,
        prompt: prompt || promptFromUrl || ''
    };
    const [state, formAction] = useFormState(generateSound, initialState);
    const { toast } = useToast();
    const { addNotification } = useNotifications();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)sound',
                description: state.error,
            });
        }
         if (state.result) {
            setShowForm(false);
            const resultId = `sound-result-${Math.random()}`;
            const handleClick = () => {
                localStorage.setItem(resultId, JSON.stringify(state));
                router.push(`/xos?open=sound&resultId=${resultId}`);
            };
            addNotification({
                icon: Music,
                title: "Son généré !",
                description: `Votre son pour "${state.prompt.substring(0, 30)}..." est prêt.`,
                onClick: handleClick,
            });
        }
    }, [state, toast, addNotification, router]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
    }

    return (
        <form action={formAction} key={key}>
             <div className="max-w-2xl mx-auto">
                {showForm && <SoundForm state={initialState} />}

                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[200px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)sound compose votre audio..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state.result && <ResultsDisplay result={state.result} onReset={handleReset} />}
            </div>
        </form>
    );
}
