
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Mic, BadgeCheck, BadgeX, Quote, PencilRuler, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateToneOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} size="lg">
      {isLoading ? (
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

function ToneForm({ prompt, onPromptChange, isLoading }: {
    prompt: string;
    onPromptChange: (value: string) => void;
    isLoading: boolean;
}) {
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
                disabled={isLoading}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
            />
            </CardContent>
            <CardFooter className="justify-center">
                <SubmitButton isLoading={isLoading} />
            </CardFooter>
        </Card>
    );
}

export default function ToneGenerator({ initialResult: initialResultFromProps, prompt: promptFromProps }: { initialResult?: GenerateToneOutput, prompt?: string }) {
    const searchParams = useSearchParams();
    const promptFromUrl = searchParams.get('prompt');
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResultFromProps);
    const [result, setResult] = useState<GenerateToneOutput | null>(initialResultFromProps || null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState(promptFromProps || promptFromUrl || '');
    const { toast } = useToast();

    useEffect(() => {
        if (initialResultFromProps) {
            setResult(initialResultFromProps);
            setShowForm(false);
        }
    }, [initialResultFromProps]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast({ variant: 'destructive', description: "Le prompt est requis." });
            return;
        }

        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/generateTone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }
            const data: GenerateToneOutput = await response.json();
            setResult(data);
            setShowForm(false);
        } catch(error: any) {
            toast({ variant: 'destructive', title: 'Erreur (X)tone', description: error.message });
            setShowForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setKey(k => k + 1);
        setResult(null);
        setShowForm(true);
        setPrompt('');
    };

    return (
        <form onSubmit={handleSubmit} key={key}>
            <div className="max-w-4xl mx-auto">
                {showForm && <ToneForm prompt={prompt} onPromptChange={setPrompt} isLoading={isLoading} />}
            
                {isLoading && (
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

                {!showForm && result && <ResultsDisplay result={result} onReset={handleReset} />}
            </div>
        </form>
    );
}
