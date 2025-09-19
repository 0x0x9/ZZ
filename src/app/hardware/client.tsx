

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Layers, MemoryStick, CircuitBoard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PerformanceChart from '@/components/ui/performance-chart';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';

function Section({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <section className={cn("relative container mx-auto px-4 md:px-6 py-24 md:py-36", className)}>
            {children}
        </section>
    );
}

function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = useRef(null);
     const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.5"]
    });
    
    return (
        <motion.div ref={ref} style={{ opacity: scrollYProgress, y: useTransform(scrollYProgress, [0, 1], [30, 0])}} className={className}>
            {children}
        </motion.div>
    )
};

const performanceData = [
    { name: '(X)-φ (fi)', 'Rendu 3D': 95, 'Compilation de code': 98, 'Simulation IA': 92 },
    { name: 'Mac Pro (équivalent)', 'Rendu 3D': 75, 'Compilation de code': 80, 'Simulation IA': 70 },
    { name: 'PC Haut de Gamme', 'Rendu 3D': 85, 'Compilation de code': 88, 'Simulation IA': 78 },
];

const features = [
    { icon: Cpu, title: "Processeur Neural X-Core", description: "Une architecture révolutionnaire qui fusionne CPU, GPU et NPU pour une puissance de calcul inégalée, optimisée pour (X)OS." },
    { icon: Layers, title: "Alliance Multi-GPU", description: "Combinez la puissance brute des cartes graphiques NVIDIA et AMD. Accélérez vos rendus 3D et vos calculs IA, et profitez d'une expérience de jeu ultime." },
    { icon: MemoryStick, title: "Mémoire Unifiée Adaptative", description: "Jusqu'à 256 Go de RAM ultra-rapide, allouée dynamiquement là où vous en avez besoin, pour une fluidité sans précédent." },
    { icon: Zap, title: "Connectivité Quantique (simulée)", description: "Ports Thunderbolt 5 et Wi-Fi 7 pour des transferts de données à la vitesse de la lumière. Le futur, c'est maintenant." },
];

export default function HardwareClient() {
    const targetRef = useRef<HTMLDivElement>(null);
    const [isRefReady, setIsRefReady] = useState(false);

    useEffect(() => {
        if (targetRef.current) {
            setIsRefReady(true);
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.8]);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);


    return (
        <div ref={targetRef}>
             {/* Hero Section */}
            <div className="h-[150vh] relative">
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                    <motion.div style={{ scale: imageScale, opacity: imageOpacity }} className="absolute inset-0">
                         <div className="absolute inset-0 w-full h-full">
                            <iframe
                                src="https://www.youtube.com/embed/ozGQ2q4l4ys?autoplay=1&mute=1&loop=1&playlist=ozGQ2q4l4ys&controls=0&showinfo=0&autohide=1"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full scale-[1.5]"
                            ></iframe>
                        </div>
                         <div className="absolute inset-0 bg-black/40"></div>
                    </motion.div>
                   
                    <motion.div 
                         style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
                         className="relative z-10 px-4 space-y-6"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]">
                            Workstations
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                            La puissance n'est que le début. C'est l'ordinateur ultime, où matériel, logiciel et IA ne font qu'un.
                        </p>
                         <div className="pt-4 flex flex-wrap justify-center gap-4">
                            <Button size="lg" asChild className="rounded-full text-lg">
                                <Link href="/store/1">
                                    Découvrir la (X)-φ <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Multi-OS Section */}
            <Section className="text-center">
                <AnimatedSection>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Un Studio. Tous les Mondes.
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Arrêtez de choisir. La (X)-φ est la seule machine capable d'exécuter Windows, macOS et Linux simultanément, en natif. Lancez un jeu AAA sur Windows pendant qu'un rendu 3D tourne sur Linux et que vous montez une vidéo sur macOS. Sans compromis. Sans redémarrage.
                    </p>
                </AnimatedSection>
                <AnimatedSection className="mt-16">
                   <div className="relative aspect-video max-w-5xl mx-auto glass-card p-4">
                       <Image src={imageData.hardware.multi_os.src} alt="Multi-OS demonstration" fill className="object-cover rounded-lg" data-ai-hint={imageData.hardware.multi_os.hint} />
                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                           <p className="text-white text-2xl font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">Votre studio. Unifié.</p>
                       </div>
                   </div>
                </AnimatedSection>
            </Section>

            {/* Performance Section */}
            <Section className="text-center">
                <AnimatedSection>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Des performances qui défient la réalité.
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                       La (X)-φ (fi) a été conçue pour les workflows les plus exigeants. Voyez par vous-même comment elle se mesure à la concurrence.
                    </p>
                </AnimatedSection>
                <AnimatedSection className="mt-16">
                   <PerformanceChart data={performanceData} />
                </AnimatedSection>
            </Section>

             {/* Features Section */}
            <Section>
                 <AnimatedSection className="text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Le Cœur de la Puissance.
                    </h2>
                     <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                      Chaque composant est sélectionné et optimisé pour fonctionner en parfaite symbiose avec (X)OS, créant une machine plus grande que la somme de ses parties.
                    </p>
                </AnimatedSection>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <AnimatedSection key={i} className="h-full">
                           <Card className="glass-card h-full p-8 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </Section>

            {/* Immersive sections */}
            <div className="space-y-8">
                 <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden rounded-3xl mx-auto container">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            scale: useTransform(scrollYProgress, [0.3, 0.6], [1, 1.2])
                        }}
                    >
                         <Image
                            src={imageData.features.cooling_system.src}
                            alt="Système de refroidissement liquide de la (X)-φ (fi)"
                            fill
                            className="object-cover"
                            data-ai-hint={imageData.features.cooling_system.hint}
                        />
                         <div className="absolute inset-0 bg-black/50"></div>
                    </motion.div>
                     <AnimatedSection className="relative z-10 text-white max-w-3xl px-8">
                         <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                           Refroidissement Cryo-Silencieux.
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-white/80">
                            Notre système de refroidissement liquide sub-ambiant maintient des performances maximales dans un silence quasi-absolu. Poussez votre machine à ses limites, elle restera de glace.
                        </p>
                    </AnimatedSection>
                </div>
                
                 <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden rounded-3xl mx-auto container">
                    <motion.div
                        className="absolute inset-0"
                         style={{
                            scale: useTransform(scrollYProgress, [0.6, 0.9], [1, 1.2])
                        }}
                    >
                        <Image
                            src={imageData.features.chassis_open.src}
                            alt="Châssis ouvert de la (X)-φ (fi) montrant l'accès aux composants"
                            fill
                            className="object-cover"
                            data-ai-hint={imageData.features.chassis_open.hint}
                        />
                         <div className="absolute inset-0 bg-black/50"></div>
                    </motion.div>
                    <AnimatedSection className="relative z-10 text-white max-w-3xl px-8">
                         <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                           Conçue pour évoluer.
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-white/80">
                           Accès sans outils. Composants standards. La (X)-φ (fi) est conçue pour être mise à niveau facilement, garantissant que votre investissement dure dans le temps.
                        </p>
                    </AnimatedSection>
                </div>
            </div>

             {/* Final CTA Section */}
             <Section className="text-center mt-16">
                <AnimatedSection>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Explorez toute la gamme.
                    </h2>
                     <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button size="lg" asChild className="rounded-full text-lg">
                            <Link href="/store">
                                Voir la boutique <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </AnimatedSection>
            </Section>
        </div>
    );
}
