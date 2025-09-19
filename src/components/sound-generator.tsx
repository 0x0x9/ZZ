
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { uploadDocument as uploadDocumentAction } from '@/app/actions';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} size="lg">
      {isLoading ? (
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
            await uploadDocumentAction({ name: fileName, content: result.audioDataUri, mimeType: 'audio/wav' });
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

function SoundForm({ prompt, onPromptChange, isLoading }: {
    prompt: string;
    onPromptChange: (value: string) => void;
    isLoading: boolean;
}) {
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
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    disabled={isLoading}
                />
            </CardContent>
            <CardFooter className="justify-center">
                <SubmitButton isLoading={isLoading} />
            </CardFooter>
        </Card>
    );
}

export default function SoundGenerator({ initialResult: initialResultFromProps, prompt: promptFromProps }: { initialResult?: GenerateSoundOutput, prompt?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [result, setResult] = useState<GenerateSoundOutput | null>(initialResultFromProps || null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState(promptFromProps || promptFromUrl || '');
    const [showForm, setShowForm] = useState(!initialResultFromProps);
    const [key, setKey] = useState(0);

    const { toast } = useToast();
    const { addNotification } = useNotifications();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast({ variant: 'destructive', description: "Le prompt est requis." });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/generateSound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) throw new Error((await response.json()).error);
            const data: GenerateSoundOutput = await response.json();
            
            setResult(data);
            setShowForm(false);
            const resultId = `sound-result-${Math.random()}`;
            localStorage.setItem(resultId, JSON.stringify({ result: data, prompt }));
            addNotification({
                icon: Music,
                title: "Son généré !",
                description: `Votre son pour "${prompt.substring(0, 30)}..." est prêt.`,
            });
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'Erreur (X)sound', description: error.message });
            setShowForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialResultFromProps) {
            setResult(initialResultFromProps);
            setShowForm(false);
        }
    }, [initialResultFromProps]);

    const handleReset = () => {
        setKey(k => k + 1);
        setResult(null);
        setShowForm(true);
        setPrompt('');
    };

    return (
        <form onSubmit={handleSubmit} key={key}>
             <div className="max-w-2xl mx-auto">
                {showForm && <SoundForm prompt={prompt} onPromptChange={setPrompt} isLoading={isLoading} />}

                {isLoading && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[200px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)sound compose votre audio..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && result && <ResultsDisplay result={result} onReset={handleReset} />}
            </div>
        </form>
    );
}
