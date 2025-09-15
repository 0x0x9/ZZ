
'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Cpu, Zap, Layers, MemoryStick, CircuitBoard, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/products';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PerformanceChart from "@/components/ui/performance-chart";
import { PCConfigurator, type Configuration } from "@/components/ui/pc-configurator";
import { useCart } from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";


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


export default function ProductClient({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
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
        // Scroll to configurator
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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  
  const performanceData = [
    { name: '(X)-φ (fi)', 'Rendu 3D': 95, 'Compilation de code': 98, 'Simulation IA': 92 },
    { name: 'Mac Pro (équivalent)', 'Rendu 3D': 75, 'Compilation de code': 80, 'Simulation IA': 70 },
    { name: 'PC Haut de Gamme', 'Rendu 3D': 85, 'Compilation de code': 88, 'Simulation IA': 78 },
];

  return (
    <>
      <div ref={heroRef} className="h-[150vh] relative">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center overflow-hidden">
              <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" data-ai-hint={product.hint} priority />
                  <div className="absolute inset-0 bg-black/40"></div>
              </motion.div>
             
              <motion.div 
                   style={{ opacity: contentOpacity, y: contentY }}
                   className="relative z-10 px-4 space-y-6 text-white"
              >
                   <Link href="/store" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4">
                        <ArrowLeft className="h-4 w-4" /> Retour à la boutique
                   </Link>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]">
                      {product.name}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                      {product.description}
                  </p>
                   <div className="pt-4">
                      <Button size="lg" className="rounded-full text-lg" onClick={handleAddToCart}>
                          Ajouter au panier - {totalPrice.toFixed(2)}€
                      </Button>
                  </div>
              </motion.div>
          </div>
      </div>
      
      <div className="space-y-24 md:space-y-36 -mt-12 mb-24 md:mb-36 relative z-10">

        <section className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
                <PerformanceChart data={performanceData} />
            </AnimatedSection>
        </section>
      
        {product.configurable && (
          <section id="configurator" className="container mx-auto px-4 md:px-6">
             <PCConfigurator 
                product={product} 
                basePrice={product.price}
                onConfigChange={handleConfigChange} 
             />
          </section>
        )}

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
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Une connectivité sans limites.</h2>
                </div>
                <div className="relative mt-12 max-w-4xl mx-auto">
                    <Image src="https://picsum.photos/seed/ports/1200/600" width={1200} height={600} alt="Ports de la Station X-1" className="rounded-2xl" data-ai-hint="computer ports"/>
                </div>
             </AnimatedSection>
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
