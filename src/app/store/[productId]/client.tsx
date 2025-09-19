

'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CheckCircle, Layers, Check, ShoppingCart, ChevronRight, Sparkles, Cpu, HardDrive, MemoryStick, CircuitBoard, MonitorPlay, Video, BrainCircuit, ArrowRight, Fan, Box, Scaling, Link as LinkIcon, Zap } from 'lucide-react';
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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import OriaAnimation from "@/components/ui/oria-animation";


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

const SpecsSection = ({ specs }: { specs: Record<string, string> }) => {
    return (
        <section id="specs" className="container mx-auto px-4 md:px-6 my-24 md:my-36">
            <AnimatedSection>
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Caractéristiques techniques</h2>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-md md:text-lg">Pensée pour des charges extrêmes, optimisée pour le silence et la fluidité créative.</p>
                </div>
            </AnimatedSection>
            <AnimatedSection className="mt-16 max-w-4xl mx-auto">
                <Card className="glass-card">
                    <CardContent className="p-2">
                        <Table>
                            <TableBody>
                                {Object.entries(specs).map(([key, value]) => (
                                    <TableRow key={key} className="border-b border-white/10">
                                        <TableCell className="font-semibold text-foreground/90 w-1/3 py-3 px-4">{key}</TableCell>
                                        <TableCell className="text-muted-foreground py-3 px-4">{value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="text-center mt-4 text-xs text-muted-foreground space-y-1">
                    <p>Compatibilité GPU AMD prioritaire. (X)bridge: multi-GPU unifié, mix AMD+NVIDIA possible sous Windows/Linux.</p>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default function ProductClient({ product: initialProduct }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(initialProduct);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const { toast } = useToast();

  const getInitialConfig = () => {
    const cpu = searchParams.get('cpu');
    const gpu = searchParams.get('gpu');
    const ram = searchParams.get('ram');
    const storage = searchParams.get('storage');

    if (cpu && gpu && ram && storage) {
      return { cpu, gpu, ram, storage };
    }
    return null;
  };
  
  const [configuration, setConfiguration] = useState<Configuration | null>(getInitialConfig());
  const [pcConfiguratorKey, setPcConfiguratorKey] = useState(Date.now());
  const { addItem } = useCart();

  const handleConfigChange = (newConfig: Configuration, newPrice: number) => {
    setConfiguration(newConfig);
    setTotalPrice(newPrice);
  };
  
    const handleAiConfigSelect = (newConfig: Configuration, modelName: string, modelId: number) => {
        const params = new URLSearchParams({
            cpu: newConfig.cpu,
            gpu: newConfig.gpu,
            ram: newConfig.ram,
            storage: newConfig.storage,
        });
        
        toast({
            title: `Redirection vers ${modelName}`,
            description: "Nous vous redirigeons vers la page du produit recommandé avec votre configuration.",
        });

        router.push(`/store/${modelId}?${params.toString()}`);
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
    { name: '(X)-fi', 'Rendu 3D': 95, 'Compilation de code': 98, 'Simulation IA': 92 },
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
             <div className="text-center mb-16">
                 <Link href="/store" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
                    <ArrowLeft className="h-4 w-4" /> Voir tous les produits
                </Link>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">{product.name}</h1>
                <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">{product.tagline}</p>
                 <p className="mt-6 text-2xl font-semibold">À partir de {totalPrice.toFixed(2)}€</p>
                 <div className="mt-8 flex items-center justify-center gap-4">
                     <Button size="lg" className="rounded-full h-14 px-10 text-lg" onClick={handleAddToCart}>
                       Acheter
                    </Button>
                </div>
            </div>
        </section>
      
        <div className="space-y-24 md:space-y-36 my-24 md:my-36">
             <section id="configurator" className="container mx-auto px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
                    <div className="md:col-span-1">
                        <PCConfigurator 
                            key={pcConfiguratorKey}
                            product={product} 
                            onConfigChange={handleConfigChange}
                            initialConfig={configuration}
                        />
                    </div>
                    <div className="md:col-span-1 md:sticky top-28">
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
            
            <section className="container mx-auto px-4 md:px-6 my-12 md:my-24">
                 <div className="relative isolate overflow-hidden rounded-3xl h-[80vh] flex items-center justify-center text-center">
                    <div className="absolute inset-0 -z-10 h-full w-full">
                         <iframe
                            src="https://www.youtube.com/embed/YUEb23FQVhA?autoplay=1&mute=1&loop=1&playlist=YUEb23FQVhA&controls=0&showinfo=0&autohide=1&wmode=transparent"
                            title="Hero Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover scale-150"
                        ></iframe>
                         <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                    <div className="text-center py-20 md:py-32 px-6">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white [text-shadow:0_2px_15px_rgba(0,0,0,0.4)]">
                           Un Studio. Tous les Mondes.
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
                            Arrêtez de choisir. (X)OS est le seul système capable d'exécuter Windows, macOS et Linux simultanément, en natif. Lancez un jeu sur Windows pendant qu'un rendu tourne sur Linux. Sans compromis. Sans redémarrage.
                        </p>
                    </div>
                </div>
            </section>
            
             <section className="container mx-auto px-4 md:px-6 my-24 md:my-36">
                 <AnimatedSection className="text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Pensée pour vos créations extrêmes.</h2>
                </AnimatedSection>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <AnimatedSection>
                        <Card className="glass-card h-full text-center p-8">
                            <Video className="h-10 w-10 mx-auto text-primary mb-4"/>
                            <h3 className="text-xl font-bold">Post-production 8K</h3>
                            <p className="text-muted-foreground mt-2">Montez, étalonnez et exportez vos projets les plus lourds sans la moindre latence.</p>
                        </Card>
                     </AnimatedSection>
                     <AnimatedSection>
                        <Card className="glass-card h-full text-center p-8">
                            <Cpu className="h-10 w-10 mx-auto text-primary mb-4"/>
                            <h3 className="text-xl font-bold">Rendu 3D & Animation</h3>
                            <p className="text-muted-foreground mt-2">Plus de rendu, moins d’attente. Profitez de la puissance du multi-GPU pour des itérations quasi-instantanées.</p>
                        </Card>
                     </AnimatedSection>
                     <AnimatedSection>
                        <Card className="glass-card h-full text-center p-8">
                            <BrainCircuit className="h-10 w-10 mx-auto text-primary mb-4"/>
                            <h3 className="text-xl font-bold">IA & Data Science</h3>
                            <p className="text-muted-foreground mt-2">Entraînez des modèles complexes et manipulez des datasets massifs avec une puissance de calcul phénoménale.</p>
                        </Card>
                     </AnimatedSection>
                </div>
            </section>

             <section className="container mx-auto px-4 md:px-6">
                <Carousel className="w-full">
                    <CarouselContent>
                        {product.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative rounded-lg overflow-hidden glass-card">
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
            </section>

             <section className="container mx-auto px-4 md:px-6 my-24 md:my-36">
                 <AnimatedSection className="text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Conçu pour l'extrême.
                    </h2>
                     <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                      Chaque détail de la {product.name} a été pensé pour les créatifs qui ne font aucun compromis.
                    </p>
                </AnimatedSection>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatedSection>
                       <Card className="glass-card h-full p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                                <Fan className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Silence de Studio</h3>
                            <p className="text-muted-foreground text-sm flex-grow">Même en pleine charge, le système de refroidissement liquide sur mesure maintient un environnement de travail calme, vous laissant vous concentrer sur votre création.</p>
                        </Card>
                    </AnimatedSection>
                    <AnimatedSection>
                       <Card className="glass-card h-full p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                                <Box className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Design Iconique</h3>
                            <p className="text-muted-foreground text-sm flex-grow">Un boîtier sur mesure en aluminium, un halo LED discret. Un objet d'ingénierie aussi inspirant que fonctionnel qui sublime votre espace de travail.</p>
                        </Card>
                    </AnimatedSection>
                    <AnimatedSection>
                       <Card className="glass-card h-full p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                                <Scaling className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Évolutivité Sans Limite</h3>
                            <p className="text-muted-foreground text-sm flex-grow">Ajoutez un GPU, étendez votre stockage. Le châssis modulaire est conçu pour que votre station grandisse avec l'ampleur de vos projets.</p>
                        </Card>
                    </AnimatedSection>
                </div>
            </section>
            
            {product.specs && <SpecsSection specs={product.specs} />}


             {product.hasPerformanceChart && (
                <section className="container mx-auto px-4 md:px-6">
                    <AnimatedSection>
                        <PerformanceChart data={performanceData} />
                    </AnimatedSection>
                </section>
            )}

            <section className="container mx-auto px-4 md:px-6">
                <div className="relative glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                    <div className="absolute -inset-20 z-0">
                         <OriaAnimation className="w-full h-full opacity-30" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold">Oria, votre chef d'orchestre IA.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                            Oria est l'intelligence qui connecte tous les outils. Discutez avec elle pour lancer des projets, générer des idées, et trouver l'outil parfait pour chaque tâche.
                        </p>
                         <Button asChild size="lg" className="mt-8 rounded-full">
                            <Link href="/oria">
                                En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                     <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                         <OriaAnimation className="w-full h-full" />
                    </div>
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

