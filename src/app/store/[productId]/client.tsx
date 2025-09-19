

'use client';

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CheckCircle, Layers, Check, ShoppingCart, ChevronRight, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/products';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PerformanceChart from "@/components/ui/performance-chart";
import { PCConfigurator, type Configuration } from "@/components/ui/pc-configurator";
import { AiConfigurator } from "@/components/ai-configurator";
import { useCart } from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import OriaAnimation from "@/components/ui/oria-animation";
import { useRouter } from "next/navigation";


function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.5"]
    });
    
    return (
        <motion.div 
            ref={ref} 
            style={{ opacity: scrollYProgress, y: useTransform(scrollYProgress, [0, 1], [30, 0])}} 
            className={className}
        >
            {children}
        </motion.div>
    )
};


export default function ProductClient({ product: initialProduct }: { product: Product }) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [pcConfiguratorKey, setPcConfiguratorKey] = useState(Date.now());


  const handleConfigChange = (newConfig: Configuration, newPrice: number) => {
    setConfiguration(newConfig);
    setTotalPrice(newPrice);
  };
  
  const handleAiConfigSelect = (newConfig: Configuration, modelName: string) => {
    if (!modelName.toLowerCase().includes(product.name.toLowerCase().split(' ')[0].replace('(x)-', ''))) {
        router.push(`/store/${product.id}`); // This is a mock, ideally it would go to the right product
        toast({
            title: `Redirection vers ${modelName}`,
            description: "Ce modèle semble plus adapté à vos besoins.",
        });
        return;
    }
    setConfiguration(newConfig);
    setPcConfiguratorKey(Date.now()); // Force re-render of PCConfigurator with new initial values
    const configuratorElement = document.getElementById('configurator');
    if (configuratorElement) {
        configuratorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleAddToCart = () => {
    if (product.configurable && !configuration) {
        toast({
            variant: "destructive",
            title: "Configuration requise",
            description: "Veuillez configurer votre station avant de l'ajouter au panier.",
        });
        const configuratorElement = document.getElementById('configurator');
        if (configuratorElement) {
            configuratorElement.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }
    const itemToAdd = {
        ...product,
        price: totalPrice,
        configuration,
        image: product.images[0],
    };
    addItem(itemToAdd);
    toast({
        title: "Ajouté au panier !",
        description: `"${product.name}" a été ajouté à votre panier.`,
    });
  };
  
  const performanceData = [
    { name: '(X)-φ (fi)', 'Rendu 3D': 95, 'Compilation de code': 98, 'Simulation IA': 92 },
    { name: 'Mac Pro (équivalent)', 'Rendu 3D': 75, 'Compilation de code': 80, 'Simulation IA': 70 },
    { name: 'PC Haut de Gamme', 'Rendu 3D': 85, 'Compilation de code': 88, 'Simulation IA': 78 },
];

    if (product.category === 'Logiciel') {
    return (
      <>
        <section className="container mx-auto px-4 md:px-6 py-28 md:py-36 text-center">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Link href="/store" className="hover:text-primary transition-colors">Boutique</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">{product.category}</span>
                </div>
                <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                    <Layers className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{product.name}</h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground">{product.tagline}</p>
                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-4xl font-bold">{product.price.toFixed(2)}€</p>
                    <Button size="lg" className="rounded-full text-lg h-14 px-10" onClick={handleAddToCart}>
                       <ShoppingCart className="mr-2 h-5 w-5" />
                       {product.name.toLowerCase().includes('abonnement') ? "S'abonner" : "Acheter maintenant"}
                    </Button>
                </div>
            </div>
        </section>
        <section className="container mx-auto px-4 md:px-6 pb-24 md:pb-36">
            <div className="max-w-4xl mx-auto p-8 md:p-12 glass-card">
                 <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Ce qui est inclus</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {(product.features ?? []).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
                                <Check className="h-5 w-5 text-green-400" />
                            </div>
                            <span className="text-md text-foreground/90">{feature}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </section>
      </>
    );
  }

  // Default Hardware Layout
  return (
    <>
        <section className="container mx-auto px-4 md:px-6 pt-28 md:pt-36 pb-12 md:pb-24">
            <div className="flex justify-between items-start mb-8">
                 <div className="flex-1">
                    <Link href="/store" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2">
                        <ArrowLeft className="h-4 w-4" /> Voir tous les produits
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold">{product.name}</h1>
                    <p className="text-muted-foreground text-lg">{product.tagline}</p>
                </div>
                <div className="text-right flex-shrink-0 pl-4">
                    <p className="text-muted-foreground text-sm">À partir de</p>
                    <p className="text-3xl font-bold">{product.price.toFixed(2)}€</p>
                </div>
            </div>
            
             <Card className="glass-card">
                <Carousel>
                    <CarouselContent>
                        {product.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative rounded-lg overflow-hidden">
                                     <Image 
                                        src={img} 
                                        alt={`${product.name} - vue ${index + 1}`} 
                                        fill 
                                        className="object-contain p-4 md:p-8" 
                                        sizes="(max-width: 768px) 100vw, 75vw"
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </Card>
        </section>
      
        <section className="container mx-auto px-4 md:px-6 my-12 md:my-24">
             <div className="glass-card grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-3xl overflow-hidden">
                <div className="relative w-full h-64 md:h-full flex items-center justify-center">
                    <OriaAnimation className="w-64 h-64" />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Plus qu'une machine, un partenaire créatif.</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl md:mx-0 mx-auto">
                        Chaque machine (X)yzz est livrée avec <strong>(X)OS</strong>, notre système d'exploitation unifié. Animé par l'IA <strong>Oria</strong>, il transforme votre ordinateur en un écosystème intelligent qui anticipe vos besoins et fluidifie votre processus créatif.
                    </p>
                    <Button size="lg" asChild className="rounded-full text-lg mt-8">
                        <Link href="/features">
                            Découvrir l'écosystème <Sparkles className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <div className="space-y-24 md:space-y-36 my-24 md:my-36">
            <section className="container mx-auto px-4 md:px-6">
                 <AiConfigurator product={product} onConfigSelect={handleAiConfigSelect} />
            </section>
            <section id="configurator" className="container mx-auto px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
                    <div className="md:col-span-1">
                        <PCConfigurator 
                            key={pcConfiguratorKey}
                            product={product} 
                            onConfigChange={handleConfigChange} 
                        />
                    </div>
                    <div className="md:col-span-1 md:sticky top-28">
                        <div className="glass-card p-4">
                            <div className="relative aspect-square">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                         <div className="mt-6 p-6 glass-card">
                            <h3 className="text-xl font-bold">Total de votre configuration</h3>
                            <p className="text-4xl font-extrabold my-2">{totalPrice.toFixed(2)}€</p>
                            <Button size="lg" className="w-full mt-4" onClick={handleAddToCart}>
                                Ajouter au panier
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

             {product.hasPerformanceChart && (
                <section className="container mx-auto px-4 md:px-6">
                    <AnimatedSection>
                        <PerformanceChart data={performanceData} />
                    </AnimatedSection>
                </section>
            )}

            <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Conçu pour l'extrême.</h2>
                        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-md md:text-lg">Chaque détail de la {product.name} a été pensé pour les créatifs qui ne font aucun compromis.</p>
                    </div>
                </AnimatedSection>
                 <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
                    <AnimatedSection>
                         <div className="relative aspect-square rounded-2xl overflow-hidden glass-card p-4">
                            <Image src="https://picsum.photos/seed/cooling/800/800" alt="Système de refroidissement" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                         </div>
                    </AnimatedSection>
                    <AnimatedSection>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Refroidissement Cryo-Silencieux</h3>
                            <p className="text-muted-foreground">Notre système de refroidissement liquide sub-ambiant maintient des performances maximales dans un silence quasi-absolu. Poussez votre machine à ses limites, elle restera de glace.</p>
                            <ul className="space-y-2 pt-2">
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Pompe à double chambre</span></li>
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Ventilateurs à lévitation magnétique</span></li>
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>
                 <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
                     <AnimatedSection className="md:order-2">
                         <div className="relative aspect-square rounded-2xl overflow-hidden glass-card p-4">
                            <Image src="https://picsum.photos/seed/chassis/800/800" alt="Châssis modulaire" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                         </div>
                    </AnimatedSection>
                    <AnimatedSection className="md:order-1">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Modulable à l'infini</h3>
                            <p className="text-muted-foreground">Accès sans outils. Composants standards. La {product.name} est conçue pour être mise à niveau facilement, garantissant que votre investissement dure dans le temps.</p>
                            <ul className="space-y-2 pt-2">
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Slots PCIe 5.0</span></li>
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Baies de stockage échangeables à chaud</span></li>
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
            
            <section className="container mx-auto px-4 md:px-6 py-12">
                <div className="glass-card grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-3xl">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Prêt à créer sans limites ?</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl md:mx-0 mx-auto">
                           Ajoutez la {product.name} à votre panier et entrez dans une nouvelle ère de la création.
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <Button size="lg" className="rounded-full text-lg h-16 px-10" onClick={handleAddToCart}>
                            Ajouter au panier - {totalPrice.toFixed(2)}€
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    </>
  );
}
