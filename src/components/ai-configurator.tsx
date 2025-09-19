
'use client';

import { useState, useRef } from 'react';
import { configurePc as configurePcAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot, Wand2, RefreshCcw, Cpu, CircuitBoard, MemoryStick, HardDrive, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import type { Product } from '@/lib/products';
import { products } from '@/lib/products';
import { type Configuration } from './ui/pc-configurator';
import type { ConfigurePcOutput } from '@/ai/types';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart-store';


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
                <LoadingState text="Recherche..." isCompact={true} />
            ) : (
                <>
                    Recommander
                    <Wand2 className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    );
}

function ResultsDisplay({ result, onApply, onReset }: { result: ConfigurePcOutput, onApply: (config: Configuration, modelName: string, modelId: number) => void, onReset: () => void }) {
    const { toast } = useToast();
    const { addItem } = useCart();
    
    const recommendedProduct = products.find(p => result.modelName.toLowerCase().includes(p.name.toLowerCase().replace(/\(x\)\-/, '')));
    
    const handleAddToCart = () => {
        if (!recommendedProduct) {
            toast({
                variant: "destructive",
                title: "Produit non trouvé",
                description: "Le produit recommandé n'a pas pu être ajouté au panier.",
            });
            return;
        }
        
        // This is a simplified price calculation. A real implementation would be more robust.
        const finalPrice = recommendedProduct.price; // Simplified for demo

        const itemToAdd = {
            ...recommendedProduct,
            price: finalPrice,
            configuration: result.configuration,
            image: recommendedProduct.images[0],
        };
        addItem(itemToAdd);
        toast({
            title: "Ajouté au panier !",
            description: `"${recommendedProduct.name}" configuré a été ajouté à votre panier.`,
        });
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h3 className="text-2xl font-bold">Configuration Recommandée</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                 <div className="space-y-4">
                    {recommendedProduct && (
                        <div className="glass-card p-4 mb-4">
                            <div className="relative aspect-square">
                                <Image 
                                    src={recommendedProduct.images[0]} 
                                    alt={recommendedProduct.name}
                                    fill
                                    className="object-contain"
                                    data-ai-hint={recommendedProduct.hint}
                                />
                            </div>
                            <h4 className="text-center font-bold text-xl mt-2">{recommendedProduct.name}</h4>
                        </div>
                    )}
                    <p className="text-muted-foreground text-sm italic text-center">"{result.justification}"</p>
                </div>

                <div className="space-y-3">
                    {Object.entries(result.configuration).map(([key, value]) => {
                        const Icon = componentIcons[key as keyof typeof componentIcons] || Cpu;
                        return (
                            <div key={key} className="flex items-center gap-4 text-left p-3 rounded-xl bg-background/50 border border-border/50">
                                <Icon className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">{key}</p>
                                    <p className="font-medium text-sm">{value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Recommencer
                </Button>
                {recommendedProduct?.configurable ? (
                    <Button onClick={() => onApply(result.configuration, result.modelName, recommendedProduct.id)} size="lg" className="flex-1">
                        Personnaliser <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                ) : (
                    <Button onClick={handleAddToCart} size="lg" className="flex-1">
                        <ShoppingCart className="mr-2 h-4 w-4"/> Ajouter au panier
                    </Button>
                )}
            </div>
        </motion.div>
    );
}

export function AiConfigurator({ product, onConfigSelect }: { product: Product, onConfigSelect: (config: Configuration, modelName: string, modelId: number) => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    
    const [result, setResult] = useState<ConfigurePcOutput | null>(null);
    const [isPending, setIsPending] = useState(false);
    
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        setResult(null);

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
        if (formRef.current) {
            formRef.current.reset();
        }
        setResult(null);
    };

    return (
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
             <div className="absolute inset-0 -z-10 opacity-20">
                <AiLoadingAnimation isLoading={true} />
            </div>
            <div className="text-center">
                <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 w-fit mx-auto mb-4">
                    <Bot className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Laissez Oria vous guider</h2>
                <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
                    Décrivez simplement vos besoins et laissez notre IA vous proposer la configuration parfaite pour votre workflow.
                </p>
            </div>
            <div className="mt-8">
                {isPending ? (
                    <div className="min-h-[250px] relative overflow-hidden flex items-center justify-center">
                        <LoadingState text="Oria analyse vos besoins..." />
                    </div>
                ) : result ? (
                    <ResultsDisplay result={result} onApply={onConfigSelect} onReset={handleReset} />
                ) : (
                    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6 max-w-3xl mx-auto">
                        <input type="hidden" name="product" value={product.name} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="job">Votre métier ?</Label>
                                <Input id="job" name="job" placeholder="Ex: Monteur Vidéo, Développeur 3D..." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="software">Vos logiciels principaux ?</Label>
                                <Input id="software" name="software" placeholder="Ex: DaVinci Resolve, Blender..." required />
                            </div>
                        </div>
                        <div className="space-y-3 text-center">
                            <Label>Quelle est votre priorité ?</Label>
                            <RadioGroup name="priority" defaultValue="balanced" className="flex flex-wrap gap-x-4 gap-y-2 justify-center pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="performance" id="p-perf" />
                                    <Label htmlFor="p-perf" className="font-normal">Performance</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="storage" id="p-storage" />
                                    <Label htmlFor="p-storage">Stockage</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="balanced" id="p-balanced" />
                                    <Label htmlFor="p-balanced" className="font-normal">Équilibre</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="pt-4 flex justify-center">
                            <SubmitButton pending={isPending} />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
