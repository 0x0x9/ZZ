
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateContent } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Lightbulb, Copy, Palette, Film, Type, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateIdeasOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Recherche d'inspiration..." isCompact={true} />
      ) : (
        <>
          Générer des idées
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({ description: "Copié dans le presse-papiers." });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de copier.' });
        });
    };

    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            aria-label="Copier"
        >
            <Copy className="h-4 w-4" />
        </Button>
    );
}

function ResultsDisplay({ result, onReset }: { result: GenerateIdeasOutput, onReset: () => void }) {
    return (
        <div className="mt-6 space-y-12">
             <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Explorer une autre idée
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Titles */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Type className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">Idées de Titres</h3>
                    </div>
                    {result.titles.map((title, index) => (
                        <Card key={`title-${index}`} className="group relative bg-background/50 border-white/20">
                            <CardContent className="p-4">
                                <p className="text-muted-foreground">{title}</p>
                                <CopyButton textToCopy={title} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Styles */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Palette className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">Suggestions de Styles</h3>
                    </div>
                     {result.styles.map((style, index) => (
                        <Card key={`style-${index}`} className="group relative bg-background/50 border-white/20">
                            <CardContent className="p-4">
                                <p className="text-muted-foreground">{style}</p>
                                <CopyButton textToCopy={style} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Prompts */}
                <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Film className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">Prompts pour Image</h3>
                    </div>
                    {result.imagePrompts.map((prompt, index) => (
                        <Card key={`prompt-${index}`} className="group relative bg-background/50 border-white/20">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground italic">"{prompt}"</p>
                                <CopyButton textToCopy={prompt} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PromptorForm({ state }: {
    state: { result: GenerateIdeasOutput | null, error: string | null, prompt: string }
}) {
    const { pending } = useFormStatus();
    
    return (
        <Card className="glass-card max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>Quelle est votre étincelle créative ?</CardTitle>
                            <CardDescription>
                                Un mot, une ambiance, une émotion... Lancez-vous !
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <Textarea
                name="prompt"
                placeholder="Exemple : Une forêt la nuit après la pluie, ambiance mystérieuse mais apaisante."
                rows={4}
                required
                minLength={10}
                className="bg-transparent text-base"
                disabled={pending}
                defaultValue={state.prompt ?? ''}
            />
             <input type="hidden" name="contentType" value="ideas" />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton />
            </div>
        </Card>
    );
}

export default function PromptorGenerator({ initialResult, prompt }: { initialResult?: GenerateIdeasOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState: { result: GenerateIdeasOutput | null, error: string | null, prompt: string } = {
        result: initialResult || null,
        error: null,
        prompt: prompt || promptFromUrl || ''
    };
    const [state, formAction] = useFormState(generateContent, initialState);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state?.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)promptor',
                description: state.error,
            });
        }
        if (state?.result) {
            setShowForm(false);
        }
    }, [state, toast]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
    };

    return (
        <form action={formAction} key={key}>
             <div className="max-w-7xl mx-auto">
                {showForm && <PromptorForm state={initialState} />}

                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[300px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <AiLoadingAnimation isLoading={true} />
                            </div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                               <LoadingState text="(X)promptor cherche l'inspiration..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state?.type === 'ideas' && <ResultsDisplay result={state.data as GenerateIdeasOutput} onReset={handleReset} />}
            </div>
        </form>
    );
}
