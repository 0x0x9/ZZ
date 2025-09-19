'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateTone } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Mic, BadgeCheck, BadgeX, Quote, PencilRuler, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateToneOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Définition en cours..." isCompact={true} />
      ) : (
        <>
          Définir le ton
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ result, onReset }: { result: GenerateToneOutput, onReset: () => void }) {
    return (
        <div className="mt-6 space-y-8">
            <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Définir un autre ton
                </Button>
            </div>
             <Card className="glass-card">
                 <CardHeader>
                    <CardTitle className="text-2xl">Votre Voix de Marque</CardTitle>
                    <CardDescription>Un guide pour une communication cohérente et percutante.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div>
                        <h3 className="font-semibold flex items-center gap-3 mb-3"><PencilRuler className="h-5 w-5 text-primary" /> Adjectifs Clés</h3>
                        <div className="flex flex-wrap gap-3">
                            {result.adjectives.map((adj, i) => (
                                <div key={i} className="bg-primary/10 text-primary font-medium px-4 py-2 rounded-full">{adj}</div>
                            ))}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold flex items-center gap-3 mb-3"><BadgeCheck className="h-5 w-5 text-green-500" /> À Faire</h3>
                             <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {result.dos.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                             <h3 className="font-semibold flex items-center gap-3 mb-3"><BadgeX className="h-5 w-5 text-red-500" /> À Ne Pas Faire</h3>
                             <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {result.donts.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-3 mb-3"><Quote className="h-5 w-5 text-primary" /> Exemples</h3>
                         <div className="space-y-4">
                            {result.examples.map((item, i) => (
                                <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "{item}"
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </CardContent>
             </Card>
        </div>
    );
}

function ToneForm({ state }: {
    state: { result: GenerateToneOutput | null, error: string | null, prompt: string }
}) {
    const { pending } = useFormStatus();
    
    return (
        <Card className="glass-card">
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <Mic className="h-7 w-7 text-primary" />
                    <div>
                        <CardTitle>Comment sonne votre projet ?</CardTitle>
                        <CardDescription>
                            Décrivez sa personnalité, ses valeurs, son public...
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <Textarea
                name="prompt"
                placeholder="Exemple : Une marque de café pour les créatifs, qui se veut inspirante, un peu décalée mais experte."
                rows={4}
                required
                minLength={10}
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

export default function ToneGenerator({ initialResult, prompt }: { initialResult?: GenerateToneOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState: { result: GenerateToneOutput | null, error: string | null, prompt: string } = { 
        result: initialResult || null, 
        error: null,
        prompt: prompt || promptFromUrl || '' 
    };
    const [state, formAction] = useFormState(generateTone, initialState);
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)tone',
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
                {showForm && <ToneForm state={initialState} />}
            
                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[400px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <AiLoadingAnimation isLoading={true} />
                            </div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)tone définit votre voix..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state.result && <ResultsDisplay result={state.result} onReset={handleReset} />}
            </div>
        </form>
    );
}
