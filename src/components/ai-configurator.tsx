
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
        
        const priceModifier = Object.values(result.configuration).reduce((acc, compValue) => {
            const componentType = Object.keys(optionsMap[recommendedProduct.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ','fi')]).find(key => 
                optionsMap[recommendedProduct.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ','fi')][key as keyof Configuration].some(opt => opt.name === compValue)
            ) as keyof Configuration | undefined;
            
            if (componentType) {
                 const option = optionsMap[recommendedProduct.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ','fi')][componentType].find(opt => opt.name === compValue);
                 return acc + (option?.priceModifier || 0);
            }
            return acc;

        }, 0);
        
        const finalPrice = recommendedProduct.price + priceModifier;

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
                    <Button onClick={() => onApply(result.configuration, result.modelName)} size="lg" className="flex-1">
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

export function AiConfigurator({ product, onConfigSelect }: { product: Product, onConfigSelect: (config: Configuration, modelName: string) => void }) {
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
            </div>
        </div>
    );
}

// This needs to be here because it's used in handleAddToCart, even if it's also in pc-configurator.tsx
// It's a bit of a code smell to duplicate, but for this specific architecture it's needed.
const optionsMap: Record<string, Record<ComponentType, {name: string, priceModifier: number}[]>> = {
  'x-alpha': {
    cpu: [
        { name: 'AMD Ryzen 9 7950X3D', priceModifier: 0 },
        { name: 'Intel Core i9-14900K', priceModifier: -100 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5080 (16Go VRAM)', priceModifier: 0 },
        { name: 'Technologie (X)bridge (AMD) 32Go VRAM', priceModifier: 400 },
    ],
    ram: [
        { name: '64GB DDR5', priceModifier: 0 },
        { name: '128GB DDR5', priceModifier: 350 },
    ],
    storage: [
        { name: '2TB NVMe SSD', priceModifier: 0 },
        { name: '4TB NVMe SSD', priceModifier: 200 },
    ],
  },
  'x-omega': {
     cpu: [
        { name: 'Intel Core i7-14700K', priceModifier: 0 },
        { name: 'AMD Ryzen 7 7800X3D', priceModifier: 50 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5070 (12Go VRAM)', priceModifier: 0 },
        { name: 'Technologie (X)bridge (AMD) 24Go VRAM', priceModifier: 250 },
    ],
    ram: [
        { name: '32GB DDR5', priceModifier: 0 },
        { name: '64GB DDR5', priceModifier: 200 },
    ],
    storage: [
        { name: '2TB SSD + 8TB HDD', priceModifier: 0 },
        { name: '4TB SSD + 12TB HDD', priceModifier: 250 },
    ],
  },
   'x-fi': {
    cpu: [
        { name: 'Intel Core i9-14900K', priceModifier: 0 },
        { name: 'AMD Ryzen 9 7950X3D', priceModifier: 150 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5080 (16Go VRAM)', priceModifier: 0 },
        { name: 'NVIDIA RTX 5090 (24Go VRAM)', priceModifier: 700 },
        { name: 'Technologie (X)bridge (AMD) 24Go VRAM', priceModifier: 900 },
        { name: 'Technologie (X)bridge (AMD) 32Go VRAM', priceModifier: 1200 },
    ],
    ram: [
        { name: '96GB DDR5', priceModifier: 0 },
        { name: '128GB DDR5', priceModifier: 250 },
        { name: '192GB DDR5', priceModifier: 600 },
    ],
    storage: [
        { name: '8TB SSD + 12TB HDD', priceModifier: 0 },
        { name: '16TB SSD + 24TB HDD', priceModifier: 800 },
    ],
  },
};
