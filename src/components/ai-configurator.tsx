
'use client';

import { useState, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { configurePc as configurePcAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot, Wand2, RefreshCcw, Cpu, CircuitBoard, MemoryStick, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import type { Product } from '@/lib/products';
import { type Configuration } from './ui/pc-configurator';
import type { ConfigurePcOutput } from '@/ai/types';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const componentIcons = {
    cpu: Cpu,
    gpu: CircuitBoard,
    ram: MemoryStick,
    storage: HardDrive,
};


function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <Button type="submit" disabled={pending} size="lg" className="w-full">
            {pending ? (
                <LoadingState text="Recherche de la configuration..." isCompact={true} />
            ) : (
                <>
                    Obtenir ma recommandation
                    <Wand2 className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    );
}

function ResultsDisplay({ result, onApply, onReset }: { result: ConfigurePcOutput, onApply: (config: Configuration) => void, onReset: () => void }) {
    const configArray = Object.entries(result.configuration);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
        >
            <Card className="glass-card bg-background/50">
                 <CardHeader>
                    <CardTitle className="text-2xl">Configuration Recommandée</CardTitle>
                    <CardDescription>{result.justification}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {configArray.map(([key, value]) => {
                        const Icon = componentIcons[key as keyof typeof componentIcons] || Cpu;
                        return (
                            <div key={key} className="flex items-start gap-3">
                                <Icon className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <p className="text-sm font-semibold uppercase text-muted-foreground">{key}</p>
                                    <p className="font-medium">{value}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
             <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => onApply(result.configuration)} size="lg" className="flex-1">
                    Appliquer cette configuration
                </Button>
                <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Recommencer
                </Button>
            </div>
        </motion.div>
    );
}

export function AiConfigurator({ product, onConfigSelect }: { product: Product, onConfigSelect: (config: Configuration) => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const initialState = { result: null, error: null, product: product.name };
    const [state, formAction] = useFormState(configurePcAction, initialState);
    const { pending } = useFormStatus();

    const handleReset = () => {
        formRef.current?.reset();
        // This is a trick to reset the form state in useFormState
        const resetData = new FormData();
        resetData.set('product', product.name);
        resetData.set('reset', 'true');
        formAction(resetData);
    };

    return (
        <Card className="glass-card">
            <CardHeader className="text-center">
                <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 w-fit mx-auto mb-4">
                    <Bot className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Laissez Oria vous guider</CardTitle>
                <CardDescription className="max-w-2xl mx-auto">
                    Vous n'êtes pas sûr des composants à choisir ? Décrivez simplement vos besoins et laissez notre IA vous proposer la configuration parfaite pour votre workflow.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pending ? (
                     <div className="min-h-[250px] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                        <div className="relative z-10">
                            <LoadingState text="Oria analyse vos besoins..." />
                        </div>
                    </div>
                ) : state.result ? (
                    <ResultsDisplay result={state.result} onApply={onConfigSelect} onReset={handleReset} />
                ) : (
                    <form ref={formRef} action={formAction} className="space-y-6 max-w-xl mx-auto">
                        <input type="hidden" name="product" value={product.name} />
                        <div className="space-y-2">
                            <Label htmlFor="job">Quel est votre métier principal ?</Label>
                            <Input id="job" name="job" placeholder="Ex: Monteur Vidéo, Développeur 3D, Musicien..." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="software">Quels logiciels utilisez-vous le plus ?</Label>
                            <Textarea id="software" name="software" placeholder="Ex: DaVinci Resolve, Unreal Engine 5, Ableton Live, Blender..." required rows={3}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Quelle est votre priorité ?</Label>
                            <RadioGroup name="priority" defaultValue="balanced" className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="performance" id="p-perf" />
                                    <Label htmlFor="p-perf">Performance Brute</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="storage" id="p-storage" />
                                    <Label htmlFor="p-storage">Capacité de Stockage</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="balanced" id="p-balanced" />
                                    <Label htmlFor="p-balanced">Équilibre / Prix</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="pt-4">
                            <SubmitButton pending={pending} />
                        </div>
                        {state.error && <p className="text-sm text-destructive text-center">{state.error}</p>}
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
