
'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reformatTextAction } from '@/app/actions';
import { motion } from 'framer-motion';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
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
    const initialState = { message: '', error: null, result: null, id: 0 };
    const [state, formAction] = useFormState(reformatTextAction, initialState);
    const { toast } = useToast();

    const handleCopy = () => {
        if (!state.result?.reformattedText) return;
        navigator.clipboard.writeText(state.result.reformattedText);
        toast({
            title: 'Copié !',
            description: 'Le texte transformé a été copié dans le presse-papiers.',
        });
    };
    
    return (
        <form action={formAction} className="space-y-8">
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
                        />
                        <SubmitButton />
                    </CardContent>
                </Card>
            </div>

            {(state.id > 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass-card bg-background/30">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>3. Résultat Transformé</CardTitle>
                            {state.result && (
                                <Button variant="outline" size="icon" onClick={handleCopy}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="min-h-[200px]">
                             {state.result ? (
                                <Textarea
                                    readOnly
                                    value={state.result?.reformattedText || ''}
                                    rows={15}
                                    className="bg-background/50 text-base"
                                />
                             ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary" />
                                    L'IA est en train de réécrire...
                                </div>
                             )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </form>
    );
}
