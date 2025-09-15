
'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cpu, Zap, Layers, MemoryStick, CircuitBoard, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/products';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PerformanceChart from "@/components/ui/performance-chart";
import { PCConfigurator, type Configuration } from "@/components/ui/pc-configurator";
import { useCart } from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = useRef(null);
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


export default function ProductClient({ product }: { product: Product }) {
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleConfigChange = (newConfig: Configuration, newPrice: number) => {
    setConfiguration(newConfig);
    setTotalPrice(newPrice);
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

  return (
    <>
        <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{product.name}</h1>
                    <p className="text-muted-foreground text-lg">{product.tagline}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold">À partir de {totalPrice.toFixed(2)}€</p>
                    <Link href="/store" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Voir tous les produits
                    </Link>
                </div>
            </div>
            
             <Card className="glass-card p-4 md:p-8">
                <Carousel>
                    <CarouselContent>
                        {product.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative bg-muted/20 rounded-lg overflow-hidden">
                                     <Image 
                                        src={img} 
                                        alt={`${product.name} - vue ${index + 1}`} 
                                        fill 
                                        className="object-contain p-4 md:p-8" 
                                        sizes="(max-width: 768px) 100vw, 75vw"
                                        priority={index === 0}
                                        data-ai-hint={product.hint}
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
      
        <div className="space-y-24 md:space-y-36 my-24 md:my-36">
            <section id="configurator" className="container mx-auto px-4 md:px-6">
                 <PCConfigurator 
                    product={product} 
                    basePrice={product.price}
                    onConfigChange={handleConfigChange} 
                 />
            </section>

            <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                    <PerformanceChart data={performanceData} />
                </AnimatedSection>
            </section>

            <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Conçu pour l'extrême.</h2>
                        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-md md:text-lg">Chaque détail de la (X)-φ a été pensé pour les créatifs qui ne font aucun compromis.</p>
                    </div>
                </AnimatedSection>
                 <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
                    <AnimatedSection>
                         <div className="relative aspect-square rounded-2xl overflow-hidden glass-card p-4">
                            <Image src="https://picsum.photos/seed/cooling/800/800" alt="Système de refroidissement" fill className="object-cover" data-ai-hint="liquid cooling computer"/>
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
                            <Image src="https://picsum.photos/seed/chassis/800/800" alt="Châssis modulaire" fill className="object-cover" data-ai-hint="open computer case"/>
                         </div>
                    </AnimatedSection>
                    <AnimatedSection className="md:order-1">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Modulable à l'infini</h3>
                            <p className="text-muted-foreground">Accès sans outils. Composants standards. La (X)-φ est conçue pour être mise à niveau facilement, garantissant que votre investissement dure dans le temps.</p>
                            <ul className="space-y-2 pt-2">
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Slots PCIe 5.0</span></li>
                              <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span>Baies de stockage échangeables à chaud</span></li>
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                    <div className="glass-card bg-primary/10 grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-3xl">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Prêt à créer sans limites ?</h2>
                            <p className="mt-4 text-lg text-muted-foreground max-w-xl md:mx-0 mx-auto">
                               Ajoutez la (X)-φ à votre panier et entrez dans une nouvelle ère de la création.
                            </p>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <Button size="lg" className="rounded-full text-lg h-16 px-10" onClick={handleAddToCart}>
                                Ajouter au panier - {totalPrice.toFixed(2)}€
                            </Button>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

        </div>
    </>
  );
}
