
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generatePalette } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Palette, Copy, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePaletteOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Composition en cours..." isCompact={true} />
      ) : (
        <>
          Générer la palette
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function CopyButton({ textToCopy, description }: { textToCopy: string, description: string }) {
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({ description: `${description} copié.` });
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
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            aria-label="Copier"
        >
            <Copy className="h-4 w-4" />
        </Button>
    );
}

function ResultsDisplay({ result, onReset }: { result: GeneratePaletteOutput, onReset: () => void }) {
    return (
        <div className="mt-6 space-y-8">
            <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Créer une autre palette
                </Button>
            </div>
             <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-2xl">{result.paletteName}</CardTitle>
                    <CardDescription>Votre palette de couleurs générée par l'IA.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {result.palette.map((color, index) => (
                         <div key={index} className="space-y-2">
                             <div className="aspect-square rounded-lg w-full shadow-inner" style={{ backgroundColor: color.hex }}></div>
                             <div className="group relative text-center">
                                 <p className="font-semibold text-sm truncate">{color.name}</p>
                                 <p className="text-xs text-muted-foreground uppercase">{color.hex}</p>
                                 <div className="absolute top-1/2 -right-1 -translate-y-1/2">
                                    <CopyButton textToCopy={color.hex} description="Code HEX" />
                                 </div>
                             </div>
                         </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function PaletteForm({ state }: {
    state: { result: GeneratePaletteOutput | null, error: string | null, prompt: string }
}) {
    const { pending } = useFormStatus();
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Palette className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>Quelle est votre inspiration ?</CardTitle>
                            <CardDescription>
                                Décrivez un thème, une émotion, un paysage...
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <Textarea
                name="prompt"
                placeholder="Exemple : Une bibliothèque ancienne un soir d'orage."
                rows={4}
                required
                minLength={10}
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

export default function PaletteGenerator({ initialResult, prompt }: { initialResult?: GeneratePaletteOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState: { result: GeneratePaletteOutput | null, error: string | null, prompt: string } = { 
        result: initialResult || null, 
        error: null,
        prompt: prompt || promptFromUrl || '' 
    };
    const [state, formAction] = useFormState(generatePalette, initialState);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)palette',
                description: state.error,
            });
        }
        if (state.result) {
            setShowForm(false);
        }
    }, [state, toast]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
    };

    return (
        <form action={formAction} key={key}>
             <div className="max-w-4xl mx-auto">
                {showForm && <PaletteForm state={initialState} />}
                
                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[300px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <AiLoadingAnimation isLoading={true} />
                            </div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)palette compose vos couleurs..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state.result && <ResultsDisplay result={state.result} onReset={handleReset} />}
            </div>
        </form>
    );
}
