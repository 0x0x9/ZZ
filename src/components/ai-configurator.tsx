
'use client';

import { useState, useRef } from 'react';
import { configurePc as configurePcAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot, Wand2, RefreshCcw, Cpu, CircuitBoard, MemoryStick, HardDrive, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import type { Product } from '@/lib/products';
import { type Configuration } from './ui/pc-configurator';
import type { ConfigurePcOutput } from '@/ai/types';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import Link from 'next/link';

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

function ResultsDisplay({ result, onApply, onReset }: { result: ConfigurePcOutput, onApply: (config: Configuration, modelName: string) => void, onReset: () => void }) {
    const configArray = Object.entries(result.configuration);
    const recommendedProductId = result.modelName.includes("fi") ? 1 : result.modelName.includes("alpha") ? 10 : 9;


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
        >
            <Card className="glass-card bg-background/50 text-center">
                 <CardHeader>
                    <CardTitle className="text-2xl">Configuration Recommandée : {result.modelName}</CardTitle>
                    <CardDescription className="max-w-2xl mx-auto">{result.justification}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    {configArray.map(([key, value]) => {
                        const Icon = componentIcons[key as keyof typeof componentIcons] || Cpu;
                        return (
                            <div key={key} className="flex items-center gap-4 text-left p-4 rounded-xl bg-background/30 border border-border/50">
                                <Icon className="h-8 w-8 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold uppercase text-muted-foreground">{key}</p>
                                    <p className="font-semibold">{value}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
             <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Recommencer
                </Button>
                <Button onClick={() => onApply(result.configuration, result.modelName)} size="lg" className="flex-1">
                    Appliquer & Configurer
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
             {result.modelName !== '(X)-book' && (
                <p className="text-center text-xs text-muted-foreground">Vous pouvez aussi <Link href={`/store/${recommendedProductId}`} className="underline hover:text-primary">voir la page du produit {result.modelName}</Link> pour plus de détails.</p>
             )}
        </motion.div>
    );
}

export function AiConfigurator({ product, onConfigSelect }: { product: Product, onConfigSelect: (config: Configuration, modelName: string) => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    
    const [result, setResult] = useState<ConfigurePcOutput | null>(null);
    const [isPending, setIsPending] = useState(false);
    
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData(event.currentTarget);
        
        try {
            const res = await configurePcAction({
                product: formData.get('product') as string,
                job: formData.get('job') as string,
                software: formData.get('software') as string,
                priority: formData.get('priority') as 'performance' | 'storage' | 'balanced',
            });
            setResult(res);
        } catch (e: any) {
            setResult(null);
            toast({ variant: 'destructive', title: 'Erreur', description: e.message });
        } finally {
            setIsPending(false);
        }
    };

    const handleReset = () => {
        formRef.current?.reset();
        setResult(null);
    };

    return (
        <Card className="glass-card overflow-hidden">
            <div className="relative p-8 md:p-12">
                 <div className="absolute inset-0 -z-10 opacity-20">
                    <AiLoadingAnimation isLoading={true} />
                </div>
                <CardHeader className="text-center p-0">
                    <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 w-fit mx-auto mb-4">
                        <Bot className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">Laissez Oria vous guider</CardTitle>
                    <CardDescription className="max-w-2xl mx-auto">
                        Vous n'êtes pas sûr des composants à choisir ? Décrivez simplement vos besoins et laissez notre IA vous proposer la configuration parfaite pour votre workflow.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-8">
                    {isPending ? (
                        <div className="min-h-[250px] relative overflow-hidden flex items-center justify-center">
                            <LoadingState text="Oria analyse vos besoins..." />
                        </div>
                    ) : result ? (
                        <ResultsDisplay result={result} onApply={onConfigSelect} onReset={handleReset} />
                    ) : (
                        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6 max-w-xl mx-auto">
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
                                <RadioGroup name="priority" defaultValue="balanced" className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
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
                                <SubmitButton pending={isPending} />
                            </div>
                        </form>
                    )}
                </CardContent>
            </div>
        </Card>
    );
}
