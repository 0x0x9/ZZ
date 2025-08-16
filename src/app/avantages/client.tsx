
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers, Zap, Cpu, Sparkles, ArrowRight, Cloud, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PerformanceChart from '@/components/ui/performance-chart';
import { Card, CardContent } from '@/components/ui/card';

const advantages = [
    {
        icon: Layers,
        title: "Un écosystème qui s’efface devant vos idées",
        description: "Windows, macOS, Linux — tout se parle, tout s’harmonise. Vous restez concentré·e sur votre inspiration.",
    },
    {
        icon: Cpu,
        title: "Une alchimie matérielle et logicielle",
        description: "De la courbe d’un châssis usiné à la microseconde d’animation dans l’UI, chaque élément dialogue en silence.",
    },
     {
        icon: Cloud,
        title: "Le nuage invisible",
        description: "La donnée voyage à la vitesse de votre pensée. Pas de transfert, pas d’attente, juste la continuité.",
    },
    {
        icon: Sparkles,
        title: "IA augmentée, pas assistée",
        description: "Nos outils devinent, adaptent, complètent — sans jamais prendre votre place dans la création.",
    },
    {
        icon: Users,
        title: "Une communauté qui pulse",
        description: "Des créateurs partout sur la planète, reliés par un réseau vivant d’idées, d’outils et de collaborations.",
    },
];

const comparisonData = [
    {
        feature: "Gestion des OS",
        xyzz: "Fusion de Windows, macOS & Linux sans redémarrage.",
        competitors: "Un seul OS par machine ou dual-boot complexe."
    },
    {
        feature: "Rôle de l'IA",
        xyzz: "Chef d'orchestre intégré au cœur du système.",
        competitors: "Ensemble d'outils IA séparés et non connectés."
    },
    {
        feature: "Flexibilité Matérielle",
        xyzz: "Support natif des GPU NVIDIA et AMD.",
        competitors: "Écosystème matériel fermé (ex: puces Apple Silicon)."
    },
    {
        feature: "Workflow de Projet",
        xyzz: "Génération de projet complet à partir d'une seule idée.",
        competitors: "Assemblage manuel de multiples services et logiciels."
    },
];

const performanceData = [
    { name: '(X)-φ (fi)', 'Rendu 3D (Cycles)': 142, 'Compilation de code (LLVM)': 135, 'Simulation IA (PyTorch)': 155 },
    { name: 'Mac Pro (M4 Ultra)', 'Rendu 3D (Cycles)': 100, 'Compilation de code (LLVM)': 110, 'Simulation IA (PyTorch)': 95 },
    { name: 'PC Haut de Gamme (RTX 4090)', 'Rendu 3D (Cycles)': 115, 'Compilation de code (LLVM)': 100, 'Simulation IA (PyTorch)': 110 },
];

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

export default function AvantegesClient() {

    return (
        <div className="space-y-24 md:space-y-36 pt-24">
            <section className="h-[80vh] flex flex-col items-center justify-center text-center container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10"
                >
                    <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-4 animate-pulse">
                        <Zap className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        (X)yzz.ai — Quand l’excellence devient expérience
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                        Immergez-vous dans un univers où <strong>matériaux premium</strong>, <strong>interfaces fluides</strong> et <strong>intelligence prédictive</strong> fusionnent en une expérience qui transcende la technologie. Chez (X)yzz.ai, tout est pensé pour que la puissance se sente… mais ne se voie pas.
                    </p>
                </motion.div>
            </section>

            <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                     <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Les Piliers de l'Innovation
                        </h2>
                    </div>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {advantages.map((advantage, index) => (
                       <AnimatedSection key={advantage.title}>
                            <Card className="glass-card h-full flex flex-col text-center items-center p-8 transition-all duration-300 hover:border-primary/30 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                                    <advantage.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{advantage.title}</h3>
                                <p className="mt-2 flex-grow text-muted-foreground">{advantage.description}</p>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </section>

             <section className="container mx-auto px-4 md:px-6">
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Des performances qui défient la réalité.
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                        Grâce à notre synergie matériel-logiciel, la (X)-φ (fi) surpasse les configurations les plus puissantes du marché.
                        </p>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <PerformanceChart data={performanceData} />
                </AnimatedSection>
            </section>
            
            <section className="container mx-auto px-4 md:px-6">
                 <AnimatedSection>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Face à Face : (X)yzz vs. Le Reste
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                            Voici un aperçu de la manière dont notre approche intégrée surpasse les workflows traditionnels et fragmentés.
                        </p>
                    </div>
                </AnimatedSection>
                
                 <div className="max-w-4xl mx-auto space-y-4">
                    {comparisonData.map((item, index) => (
                         <AnimatedSection key={index}>
                            <Card className="glass-card overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                                            <h4 className="font-semibold text-primary mb-2">{item.feature}</h4>
                                            <p className="text-muted-foreground">{item.xyzz}</p>
                                        </div>
                                        <div className="p-6 bg-black/10">
                                            <h4 className="font-semibold text-muted-foreground/80 mb-2">Les Autres Solutions</h4>
                                            <p className="text-muted-foreground/70">{item.competitors}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </section>
            
            <section className="container mx-auto px-4 md:px-6 text-center">
                 <AnimatedSection>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Vivez l’expérience (X)yzz.ai
                    </h2>
                     <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                        Arrêtez de jongler entre les outils. Unifiez votre créativité et découvrez ce qu'il est possible de faire quand tout devient possible.
                    </p>
                     <Button asChild size="lg" className="mt-8 rounded-full">
                        <Link href="/features">
                            Explorer l'écosystème
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                 </AnimatedSection>
            </section>
        </div>
    );
}
