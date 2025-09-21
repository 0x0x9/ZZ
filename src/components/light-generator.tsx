
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Sun, Droplets, Wind, Leaf, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateLightMoodOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

const moodThemes = [
    { id: 'serenity', name: 'Sérénité', icon: Leaf, prompt: "Une forêt brumeuse au lever du soleil, avec des tons pastel doux et une lumière diffuse." },
    { id: 'energy', name: 'Énergie', icon: Sun, prompt: "Une explosion de couleurs vives et de formes dynamiques, rappelant un festival de musique électronique." },
    { id: 'melancholy', name: 'Mélancolie', icon: Droplets, prompt: "Une rue de ville sous une pluie battante la nuit, avec des reflets de néons sur le sol mouillé." },
    { id: 'focus', name: 'Concentration', icon: Wind, prompt: "Un bureau minimaliste avec une seule plante, baigné d'une lumière naturelle et douce." },
];

function SubmitButton({ isLoading }: { isLoading: boolean }) {
    return (
        <Button type="submit" disabled={isLoading} size="lg" className="h-12">
        {isLoading ? (
            <LoadingState text="Recherche d'inspiration..." isCompact={true} />
        ) : (
            <>
                <Sparkles className="mr-2 h-4 w-4" />Générer
            </>
        )}
        </Button>
    );
}

function ResultsDisplay({ result, onReset }: { result: GenerateLightMoodOutput & { images: string[], isLoadingImages: boolean }, onReset: () => void }) {
    return (
        <motion.div 
            className="mt-12 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
             <div className="text-center">
                <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Nouvelle Ambiance
                </Button>
            </div>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">{result.title}</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{result.description}</p>
            </div>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Palette & Mots-clés</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <h4 className="font-semibold">Palette de Couleurs</h4>
                        <div className="flex gap-2">
                            {result.colors.map((color, i) => (
                                <motion.div 
                                    key={i} 
                                    className="w-12 h-12 rounded-full border-2 border-white/20" 
                                    style={{ backgroundColor: color }} 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                         <h4 className="font-semibold">Mots-clés</h4>
                         <div className="flex flex-wrap gap-2">
                             {result.keywords.map((keyword, i) => (
                                <motion.div 
                                    key={i} 
                                    className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                                >{keyword}</motion.div>
                            ))}
                         </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="glass-card">
                 <CardHeader>
                    <CardTitle>Inspiration Visuelle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(result.isLoadingImages ? Array(4).fill(null) : result.images).map((img, i) => (
                           <div key={i} className="relative aspect-square rounded-lg overflow-hidden group bg-muted/50">
                               {img ? (
                                   <Image src={img} alt={`Mood image ${i+1}`} fill className="object-cover" />
                               ) : (
                                   <Skeleton className="w-full h-full" />
                               )}
                           </div>
                       ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function LightGenerator() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [resultWithImages, setResultWithImages] = useState<(GenerateLightMoodOutput & { images: string[], isLoadingImages: boolean }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [key, setKey] = useState(0);

    const handleGenerate = async (currentPrompt: string) => {
        setIsLoading(true);
        setResultWithImages(null);
        setShowForm(false);
        try {
            const moodResponse = await fetch('/api/light-mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt })
            });

            if (!moodResponse.ok) {
                const errorData = await moodResponse.json();
                throw new Error(errorData.error || 'Erreur lors de la génération de l\'ambiance.');
            }

            const moodResult: GenerateLightMoodOutput = await moodResponse.json();
            setResultWithImages({ ...moodResult, images: [], isLoadingImages: true });

            // Fetch moodboard images
            const moodboardResponse = await fetch('/api/generateMoodboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompts: moodResult.imagePrompts })
            });

            if (!moodboardResponse.ok) {
                throw new Error("Erreur lors de la génération du moodboard.");
            }

            const imageResult = await moodboardResponse.json();
            if (imageResult.imageDataUris) {
                setResultWithImages(prev => prev ? ({ ...prev, images: imageResult.imageDataUris, isLoadingImages: false }) : null);
            }

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
            setShowForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const safePrompt = prompt.trim();
        if (!safePrompt) {
            toast({ variant: 'destructive', description: "Veuillez décrire une ambiance."});
            return;
        }
        handleGenerate(safePrompt);
    };

    const handleThemeClick = (themePrompt: string) => {
        setPrompt(themePrompt);
        handleGenerate(themePrompt);
    };
    
    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
        setResultWithImages(null);
        setPrompt('');
    };

    return (
        <div className="max-w-4xl mx-auto w-full" key={key}>
            {showForm && (
                <Card className="glass-card">
                    <CardHeader className="text-center">
                        <CardTitle>Quelle est votre humeur créative ?</CardTitle>
                        <CardDescription>Choisissez un thème ou décrivez votre propre ambiance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {moodThemes.map(theme => (
                                    <button
                                        key={theme.id}
                                        type="button"
                                        onClick={() => handleThemeClick(theme.prompt)}
                                        disabled={isLoading}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent bg-background/50 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <theme.icon className="h-6 w-6 text-primary"/>
                                        <span className="text-sm font-medium">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <Input 
                                    name="prompt" 
                                    placeholder="Ou décrivez votre propre ambiance..." 
                                    className="flex-1 h-12 text-base bg-background/50" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button type="submit" disabled={isLoading} size="lg" className="h-12">
                                    {isLoading ? (
                                        <LoadingState text="Génération..." isCompact={true} />
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />Générer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading && (
                <div className="mt-12">
                    <Card className="glass-card min-h-[400px] relative overflow-hidden">
                        <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <LoadingState text="(X)light prépare votre inspiration..." />
                        </div>
                    </Card>
                </div>
            )}
            
            {resultWithImages && !showForm && !isLoading && <ResultsDisplay result={resultWithImages} onReset={handleReset}/>}
        </div>
    );
}
