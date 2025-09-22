
'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Cpu, Palette, Code, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Section 1: La Friction
const FrictionSection = () => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.9, 1]);

    return (
        <section ref={ref} className="h-screen flex items-center justify-center text-center text-white relative">
            <div className="absolute inset-0 bg-black -z-10" />
            <motion.div style={{ opacity, scale }}>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Une idée.</h1>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-muted-foreground mt-2">Puis... le bruit. Le chaos.</h2>
            </motion.div>
        </section>
    );
}

// Section 2: L'introduction d'Oria
const OriaIntroductionSection = () => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const opacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);

    return (
        <section ref={ref} className="h-screen flex items-center justify-center text-center text-white relative">
            <div className="absolute inset-0 bg-black -z-10" />
            <motion.div style={{ opacity, y }}>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                    Et si... le silence se faisait.
                </h2>
                <p className="text-3xl md:text-5xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                    Pour que votre voix soit la seule entendue.
                </p>
            </motion.div>
        </section>
    );
}

// Section 3: La Symphonie en action
const SymphonySection = () => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"]});

    const items = [
        { icon: Palette, text: '(X)palette' },
        { icon: Code, text: '(X)frame' },
        { icon: Film, text: '(X)motion' },
    ];
    
    return (
        <section ref={ref} className="h-screen flex flex-col items-center justify-center text-center text-white relative">
            <div className="absolute inset-0 bg-black -z-10" />
            <motion.div 
                style={{
                    opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
                    y: useTransform(scrollYProgress, [0.3, 0.5], [50, 0])
                }}
            >
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                    Où chaque outil est une conversation.
                </h2>
                <p className="text-3xl md:text-5xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                    Chaque idée trouve son écho.
                </p>
            </motion.div>
            <div className="flex items-center justify-center gap-8 md:gap-16 mt-16">
                {items.map((item, index) => {
                     const opacity = useTransform(scrollYProgress, [0.5 + index * 0.1, 0.6 + index * 0.1], [0, 1]);
                     const y = useTransform(scrollYProgress, [0.5 + index * 0.1, 0.6 + index * 0.1], [30, 0]);
                    return (
                        <motion.div key={item.text} style={{ opacity, y }} className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                <item.icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                            </div>
                            <span className="text-sm md:text-base font-semibold text-muted-foreground">{item.text}</span>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    );
};

// Section 4: Le Credo
const CredoSection = () => {
     const ref = React.useRef(null);
     const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
     const opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

    return (
        <section ref={ref} className="h-screen flex items-center justify-center text-center text-white relative">
            <div className="absolute inset-0 bg-black -z-10" />
            <motion.div style={{ opacity }} className="space-y-12">
                <div>
                     <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                        Ce ne sont pas des outils.
                    </h2>
                    <p className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mt-4">
                        C'est votre orchestre.
                    </p>
                </div>

                <div>
                    <h3 className="text-3xl font-bold tracking-tight">(X)yzz.ai</h3>
                    <p className="text-2xl text-muted-foreground">La création, unifiée.</p>
                </div>
                 <Button size="lg" asChild className="rounded-full text-lg">
                    <Link href="/welcome">
                        Découvrir l'écosystème <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </motion.div>
        </section>
    );
};


export default function LightClient() {
  return (
    <div>
        <FrictionSection />
        <OriaIntroductionSection />
        <SymphonySection />
        <CredoSection />
    </div>
  );
}
