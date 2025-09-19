
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
    return (
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Transformation...
                </>
            ) : (
                <>
                    Lancer la magie <Sparkles className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    )
}

export default function FormatClient() {
    const [originalText, setOriginalText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [reformattedText, setReformattedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
             const response = await fetch('/api/content-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentType: 'reformat',
                    textToReformat: originalText,
                    prompt: prompt
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Une erreur est survenue.");
            }

            const result = await response.json();

             if (result.type === 'text' && typeof result.data === 'object' && result.data && 'reformattedText' in result.data) {
                setReformattedText((result.data as { reformattedText: string }).reformattedText);
            } else if (result.type === 'text' && typeof result.data === 'string') {
                // Handle older format for safety
                 setReformattedText(result.data);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!reformattedText) return;
        navigator.clipboard.writeText(reformattedText);
        toast({
            title: 'Copié !',
            description: 'Le texte transformé a été copié dans le presse-papiers.',
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>1. Votre Texte Original</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            name="text"
                            placeholder="Collez ou écrivez votre texte ici..."
                            rows={15}
                            className="bg-background/50 text-base"
                            required
                            value={originalText}
                            onChange={(e) => setOriginalText(e.target.value)}
                        />
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>2. Votre Instruction</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            name="prompt"
                            placeholder="Ex: Transforme ce texte en une liste à puces. / Résume en 3 points clés. / Adopte un ton plus professionnel."
                            rows={5}
                            className="bg-background/50 text-base"
                            required
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <SubmitButton isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>

            {(isLoading || reformattedText) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass-card bg-background/30">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>3. Résultat Transformé</CardTitle>
                            {reformattedText && (
                                <Button variant="outline" size="icon" onClick={handleCopy}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="min-h-[200px]">
                             {isLoading ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary" />
                                    L'IA est en train de réécrire...
                                </div>
                             ) : (
                                <Textarea
                                    readOnly
                                    value={reformattedText}
                                    rows={15}
                                    className="bg-background/50 text-base"
                                />
                             )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </form>
    );
}
