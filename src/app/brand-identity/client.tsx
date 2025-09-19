'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Palette, Mic, Wand2, GitBranch, Share2 } from 'lucide-react';
import type { GeneratePaletteOutput, GenerateToneOutput } from '@/ai/types';
import { motion } from 'framer-motion';

const ToolSkeleton = ({title, description, icon: Icon}: {title: string, description: string, icon: React.ElementType}) => (
    <Card className="glass-card w-full h-full min-h-[400px]">
        <CardHeader>
             <div className="flex items-center gap-3">
                <Icon className="h-7 w-7 text-primary" />
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-28 w-full" />
            <div className="flex justify-center mt-6">
                <Skeleton className="h-12 w-48" />
            </div>
        </CardContent>
    </Card>
);

const ToneGenerator = dynamic(() => import('@/components/tone-generator'), { ssr: false, loading: () => <ToolSkeleton title="(X)tone" description="Définissez la voix de votre marque." icon={Mic} /> });
const PaletteGenerator = dynamic(() => import('@/components/palette-generator'), { ssr: false, loading: () => <ToolSkeleton title="(X)palette" description="Composez des palettes de couleurs." icon={Palette} /> });

const features = [
    {
        icon: Wand2,
        title: "Fondations Instantanées",
        description: "(X)brand génère une palette de couleurs et une voix de marque cohérentes en quelques secondes, vous donnant une base solide pour votre identité visuelle et textuelle."
    },
    {
        icon: GitBranch,
        title: "Cohérence Garantie",
        description: "En définissant ces piliers dès le départ, vous assurez une image de marque uniforme sur tous vos supports, des réseaux sociaux à votre site web."
    },
    {
        icon: Share2,
        title: "Partageable & Intégrable",
        description: "Exportez facilement votre guide de style et votre palette pour les partager avec votre équipe ou les intégrer directement dans vos autres outils (X)yzz."
    }
];

export default function BrandIdentityClient({ initialPalette, initialTone, prompt }: { initialPalette?: GeneratePaletteOutput, initialTone?: GenerateToneOutput, prompt?: string }) {
    return (
        <div className="w-full space-y-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full">
                <ToneGenerator initialResult={initialTone} prompt={prompt} />
                <PaletteGenerator initialResult={initialPalette} prompt={prompt} />
            </div>

            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
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
        </div>
    );
}
