
'use client';

import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Zap, Link as LinkIcon, MessageSquare, ArrowRight, Palette, Film, Users, LayoutTemplate, BookOpen, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import OriaAnimation from '@/components/ui/oria-animation';
import HomepageOriaChat from '@/components/homepage-oria';
import { Card } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';

const features = [
    {
        icon: BrainCircuit,
        title: "Orchestration Intelligente",
        description: "Oria ne se contente pas de répondre. Elle comprend votre objectif final, sélectionne les bons outils et les fait travailler ensemble pour concrétiser votre vision. D'une simple phrase, elle peut générer un plan de projet complet."
    },
    {
        icon: LinkIcon,
        title: "Conscience Contextuelle",
        description: "Que vous soyez sur votre bureau, dans une application ou en train de naviguer, Oria conserve le contexte. Elle sait sur quel projet vous travaillez et peut vous offrir une assistance pertinente et proactive, sans que vous ayez à répéter."
    },
    {
        icon: Zap,
        title: "Catalyseur de Créativité",
        description: "Bloqué sur une page blanche ? Oria est votre partenaire de brainstorming ultime. Demandez-lui des idées, des variations, des palettes de couleurs ou des concepts, et laissez-vous surprendre par sa capacité à débloquer votre inspiration."
    }
];

const oriaInActionItems = [
    { icon: Wand2, title: 'Votre Idée', description: 'Une simple phrase pour lancer un projet de court-métrage SF.' },
    { icon: BookOpen, title: 'Plan de Projet', description: 'Généré par Maestro pour structurer la production.' },
    { icon: Film, title: 'Script & Scènes', description: 'Créé par (X)motion pour la narration visuelle.' },
    { icon: Users, title: 'Personas Cibles', description: 'Définis par (X)persona pour affiner le message.' },
    { icon: Palette, title: 'Palette Visuelle', description: 'Composée par (X)palette pour l\'ambiance colorimétrique.' },
    { icon: LayoutTemplate, title: 'Maquette du Site', description: 'Designé par (X)frame pour la promotion en ligne.' },
];


export default function OriaClient() {
    const { ref: actionRef, inView: actionInView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

  return (
    <div className="py-28 md:py-36 space-y-24 md:space-y-36 overflow-hidden">
        
        <section className="container mx-auto px-4 md:px-6">
            <HomepageOriaChat />
        </section>

        <section className="relative flex flex-col items-center justify-center text-center container mx-auto px-4 md:px-6">
            <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="w-48 h-48 md:w-64 md:h-64"
            >
                <OriaAnimation />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="relative z-10 mt-8"
            >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    Oria. Votre symphonie créative.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Oria n'est pas un assistant. C'est le chef d'orchestre de votre créativité, l'intelligence qui unifie l'écosystème (X)yzz et transforme vos idées en réalité.
                </p>
            </motion.div>
        </section>

        <section className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center"
                    >
                         <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                            <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground mt-3">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>

         <section className="container mx-auto px-4 md:px-6" ref={actionRef}>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    Oria en action.
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    D'une idée à un projet complet, en une seule conversation.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {oriaInActionItems.map((item, index) => (
                    <motion.div
                        key={item.title}
                        custom={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={actionInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                    >
                        <Card className="glass-card text-center p-6 h-full transition-all duration-300 hover:border-primary/30 hover:-translate-y-2">
                             <div className="inline-block bg-primary/10 p-3 rounded-xl border border-primary/20 mb-4">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
        
        <section className="container mx-auto px-4 md:px-6">
            <div className="glass-card max-w-5xl mx-auto p-8 md:p-12 text-center">
                 <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                    <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Essayez Oria maintenant.</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    La meilleure façon de comprendre Oria est de lui parler. Lancez une conversation et découvrez comment elle peut transformer votre workflow.
                </p>
                <Button size="lg" asChild className="rounded-full text-lg mt-8">
                    <Link href="/xos?open=oria">
                        Discuter avec Oria
                    </Link>
                </Button>
            </div>
        </section>
    </div>
  );
}
