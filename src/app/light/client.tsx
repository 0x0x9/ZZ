'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { copy } from './copy';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.5"]
    });

    return (
        <motion.div ref={ref} style={{ opacity: scrollYProgress, y: useTransform(scrollYProgress, [0, 1], [30, 0]) }} className={className}>
            {children}
        </motion.div>
    );
};

const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <section className={cn("py-24 sm:py-32 md:py-40 container mx-auto px-6 lg:px-8", className)}>
        {children}
    </section>
);

const HeroSection = () => (
    <section className="h-[80vh] flex flex-col items-center justify-center text-center container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">{copy.hero.title}</h1>
            <h2 className="mt-4 text-4xl md:text-6xl font-medium tracking-tight whitespace-pre-line">{copy.hero.subtitle}</h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">{copy.hero.paragraph}</p>
            <div className="mt-10 flex gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/xos?open=light">{copy.hero.ctaPrimary}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="#features">{copy.hero.ctaSecondary}</Link>
                </Button>
            </div>
        </motion.div>
    </section>
);

const FrictionSection = () => (
    <Section className="text-center max-w-4xl mx-auto">
        <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight whitespace-pre-line">{copy.friction.title}</h2>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground whitespace-pre-line">{copy.friction.text}</p>
        </AnimatedSection>
    </Section>
);

const PillarsSection = () => (
    <Section id="features">
        <AnimatedSection>
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold">{copy.pillars.h2}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {copy.pillars.cards.map((card, i) => (
                    <div key={i} className="text-center">
                        <h3 className="text-3xl font-bold">{card.title} <span className="text-muted-foreground">{card.hint}</span></h3>
                        <p className="mt-4 text-muted-foreground whitespace-pre-line text-lg">{card.desc}</p>
                    </div>
                ))}
            </div>
        </AnimatedSection>
    </Section>
);

const SymphonySection = () => (
     <Section className="max-w-4xl mx-auto">
        <AnimatedSection>
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold">{copy.symphony.h2}</h2>
                <p className="mt-6 text-xl md:text-2xl text-muted-foreground whitespace-pre-line">{copy.symphony.p}</p>
                 <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    {copy.symphony.items.map(item => (
                        <div key={item.label} className="py-2 px-4 rounded-full border border-border bg-background/50">
                            <span className="font-semibold">{item.label}</span>
                            <span className="text-muted-foreground"> — {item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    </Section>
);

const AdvantagesSection = () => (
    <Section>
        <AnimatedSection>
            <div className="text-center mb-16">
                <h3 className="text-4xl md:text-5xl font-bold">{copy.advantages.h3}</h3>
            </div>
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {copy.advantages.points.map(point => (
                    <div key={point.title} className="relative pl-12">
                        <div className="absolute left-0 top-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                                <point.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                        </div>
                        <dt className="text-lg font-semibold leading-7 text-foreground">{point.title}</dt>
                        <dd className="mt-1 text-base leading-7 text-muted-foreground">{point.desc}</dd>
                    </div>
                ))}
            </div>
        </AnimatedSection>
    </Section>
);

const IntegrationsSection = () => (
    <Section className="max-w-4xl mx-auto">
         <AnimatedSection>
             <div className="text-center">
                <h3 className="text-3xl font-bold">{copy.integrations.h3}</h3>
                <p className="mt-4 text-lg text-muted-foreground whitespace-pre-line">{copy.integrations.p}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {copy.integrations.badges.map(badge => (
                        <div key={badge.name} className="flex items-center gap-2 rounded-full border border-border bg-background/50 py-2 px-4">
                            {badge.icon && <badge.icon className="h-4 w-4 text-muted-foreground" />}
                            <span className="text-sm font-medium">{badge.name}</span>
                        </div>
                    ))}
                </div>
             </div>
        </AnimatedSection>
    </Section>
)


const CredoSection = () => (
    <Section className="text-center max-w-3xl mx-auto">
        <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight whitespace-pre-line">{copy.credo.h2}</h2>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground whitespace-pre-line">{copy.credo.p}</p>
            <div className="mt-10">
                <Button size="lg" asChild>
                    <Link href="/xos?open=light">{copy.credo.cta}</Link>
                </Button>
            </div>
        </AnimatedSection>
    </Section>
);


export default function LightClient() {
    return (
        <div className="space-y-12">
            <HeroSection />
            <FrictionSection />
            <PillarsSection />
            <SymphonySection />
            <AdvantagesSection />
            <IntegrationsSection />
            <CredoSection />
        </div>
    );
}
