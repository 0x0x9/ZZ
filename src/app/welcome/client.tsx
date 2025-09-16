
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Sparkles, Layers, Folder, Download, Users, MonitorPlay, Check, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';

const features = [
    { title: "Un OS, Trois Mondes", description: "Basculez instantanément entre Windows, macOS et Linux. Profitez du meilleur de chaque système, sans redémarrage, sans compromis.", icon: Layers, videoId: 'wLiwRGYaVnw' },
    { title: "IA au Coeur du Système", description: "Oria, notre IA, est intégrée nativement pour optimiser vos workflows, automatiser les tâches et vous suggérer des idées créatives.", icon: Sparkles, videoId: 'crtsXQdtqbw' },
    { title: "Performances Brutes", description: "Grâce à une gestion matérielle de bas niveau, (X)OS exploite la pleine puissance de votre machine pour des rendus et compilations ultra-rapides.", icon: Cpu, videoId: 'YUEb23FQVhA' },
    { title: "Gestion de Fichiers Unifiée", description: "Accédez à tous vos fichiers, quel que soit l'OS, depuis un explorateur unique et intelligent synchronisé avec (X)Cloud.", icon: Folder, videoId: 'ozGQ2q4l4ys' },
];

const whoIsItFor = [
    {
        title: "Pour les Créatifs",
        description: "Une suite d'outils IA qui comprend votre vision et vous aide à la réaliser plus rapidement que jamais.",
        icon: Sparkles,
        image: imageData.features.artist_creative.src,
        imageHint: imageData.features.artist_creative.hint,
    },
    {
        title: "Pour les Technophiles",
        description: "Une architecture ouverte, conçue pour la performance et la personnalisation, sans aucune limite.",
        icon: Cpu,
        image: imageData.features.tech_setup.src,
        imageHint: imageData.features.tech_setup.hint,
    },
    {
        title: "Pour les Équipes",
        description: "Des outils collaboratifs natifs pour travailler en parfaite synchronisation, où que vous soyez.",
        icon: Users,
        image: imageData.features.team_office.src,
        imageHint: imageData.features.team_office.hint,
    },
];

const productRange = [
    {
        greek: "Ω",
        name: "(X)-oméga",
        price: "1 999 €",
        features: ["(X)OS complet", "Dual-OS Windows/macOS", "32 Go RAM", "1 To SSD", "(X)Cloud inclus"]
    },
     {
        greek: "α",
        name: "(X)-alpha",
        price: "2 999 €",
        features: ["(X)OS Pro", "Triple-OS + Linux", "64 Go RAM", "2 To SSD", "(X)AI intégré"]
    },
    {
        greek: "φ",
        name: "(X)-fi",
        price: "4 499 €",
        features: ["(X)OS Studio", "Multi-GPU dédié", "128 Go RAM", "4 To SSD", "Support prioritaire"]
    },
]

// Helper components
const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <section className={cn("py-24 sm:py-32 md:py-40", className)}>
      {children}
    </section>
);

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
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

function StickyScrollSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });

    const cardOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0]);
    const cardScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.9, 0.8]);

    return (
        <div ref={targetRef} className="relative h-[400vh]">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                 <motion.div style={{ opacity: cardOpacity, scale: cardScale }} className="w-full h-full flex items-center justify-center">
                    {features.map((feature, i) => {
                        const start = i / features.length;
                        const end = (i + 1) / features.length;
                        
                        const opacity = useTransform(scrollYProgress, [start - 0.05, start, start + 0.1, end - 0.1, end], [0, 1, 1, 1, 0]);

                        return (
                            <motion.div
                                key={feature.title + i}
                                style={{ opacity }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <div className="absolute inset-0">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${feature.videoId}?autoplay=1&mute=1&loop=1&playlist=${feature.videoId.split('?')[0]}&controls=0&showinfo=0&autohide=1&wmode=transparent`}
                                        title={feature.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full object-cover"
                                    ></iframe>
                                    <div className="absolute inset-0 bg-black/40"></div>
                                </div>
                                <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-6">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]">{feature.title}</h2>
                                    <p className="text-lg md:text-xl text-white/80 max-w-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}


export default function WelcomeClient() {
    return (
        <>
            {/* Hero Section */}
            <div className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <iframe
                        src="https://www.youtube.com/embed/SqJGQ25sc8Q?autoplay=1&mute=1&loop=1&playlist=SqJGQ25sc8Q&controls=0&showinfo=0&autohide=1"
                        title="Hero Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover"
                    ></iframe>
                     <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 px-4 space-y-4">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]">
                        (X)OS
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base md:text-lg text-white/80 max-w-4xl mx-auto [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                        L'interface directe entre votre imagination et la technologie.
                    </motion.p>
                </div>
            </div>

            <StickyScrollSection />

            <Section>
                <AnimatedSection>
                    <div className="text-center container mx-auto px-6 lg:px-8">
                        <h2 className="text-4xl font-bold tracking-tight text-center md:text-6xl">Créer. Vendre. Gérer. Sans limites.</h2>
                        <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto md:text-xl">Un écosystème conçu pour transformer une simple idée en un projet complet et monétisable, sans une seule ligne de code.</p>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-6 lg:px-8">
                        {whoIsItFor.map((item, i) => (
                            <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-card group">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    data-ai-hint={item.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <div className="p-2 bg-white/10 rounded-lg border border-white/20 mb-3 w-fit backdrop-blur-sm">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                    <p className="mt-2 text-white/80">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </Section>
            
            <Section>
            <AnimatedSection>
                <div className="text-center container mx-auto px-6 lg:px-8">
                    <h2 className="text-4xl font-bold tracking-tight text-center md:text-6xl">Un Hardware Iconique</h2>
                    <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto md:text-xl">Des machines conçues en symbiose avec le logiciel, pour une expérience créative totale.</p>
                </div>
            </AnimatedSection>
             <AnimatedSection>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-6 lg:px-8">
                    {productRange.map((product, i) => (
                         <div key={product.name} className="flex flex-col h-full text-center p-8 glass-card hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                            <header className="p-0 mb-6">
                                <div className="mx-auto text-5xl font-light text-muted-foreground mb-4">{product.greek}</div>
                                <h3 className="text-3xl font-bold">{product.name}</h3>
                                <p className="text-primary font-semibold mt-1">{product.price}</p>
                            </header>
                            <div className="p-0 flex-grow">
                                <ul className="space-y-3 text-muted-foreground">
                                    {product.features.map(feat => (
                                        <li key={feat} className="flex items-center justify-center gap-3 text-sm">
                                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                                            <span className="text-left">{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <footer className="p-0 mt-8">
                                <Button asChild className="w-full">
                                    <Link href="/store">Voir le produit</Link>
                                </Button>
                            </footer>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
      </Section>

       <Section>
            <AnimatedSection>
                <div className="text-center container mx-auto px-6 lg:px-8">
                     <h2 className="text-4xl font-bold tracking-tight text-center md:text-6xl">Propulsé par la Communauté</h2>
                    <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto md:text-xl">Chaque utilisateur rend Oria plus intelligente. Chaque création inspire les autres. Rejoignez une économie créative circulaire.</p>
                     <Button asChild size="lg" className="mt-8 rounded-full text-lg">
                        <Link href="/community">
                            Rejoindre la Communauté <Heart className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </AnimatedSection>
      </Section>

            {/* Final CTA Section */}
            <Section>
                <div className="container mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
                    <AnimatedSection className="text-center md:text-left">
                        <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-4">
                            <MonitorPlay className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Essayez (X)OS en ligne.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl md:mx-0 mx-auto">
                            Plongez dans notre environnement web interactif pour tester la puissance de nos outils IA, sans rien installer.
                        </p>
                        <Button size="lg" asChild className="rounded-full text-lg mt-8">
                            <Link href="/xos">
                                Lancer l'expérience web <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </AnimatedSection>

                    <AnimatedSection className="text-center md:text-left">
                         <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-4">
                            <Download className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Passez à la vitesse supérieure.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl md:mx-0 mx-auto">
                           Installez (X)OS sur votre machine pour libérer des performances inégalées et une créativité sans aucune limite.
                        </p>
                        <Button size="lg" variant="outline" asChild className="rounded-full text-lg mt-8">
                            <Link href="/download">
                                Télécharger l'OS <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </AnimatedSection>
                </div>
            </Section>
        </>
    );
}
