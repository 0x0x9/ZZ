
'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, LayoutTemplate, Upload, X } from 'lucide-react';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import Image from 'next/image';
import { runFlow } from '@genkit-ai/next/client';
import { generateFrame } from '@/app/api/generateFrame/route';


export default function FrameGenerator() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!prompt && !imageDataUri) {
            toast({ variant: 'destructive', description: "Veuillez fournir une description ou une image." });
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await runFlow(generateFrame, { prompt, photoDataUri: imageDataUri || undefined });
            const params = new URLSearchParams();
            params.set('htmlCode', btoa(unescape(encodeURIComponent(result.htmlCode || ''))));
            params.set('cssCode', btoa(unescape(encodeURIComponent(result.cssCode || ''))));
            params.set('jsCode', btoa(unescape(encodeURIComponent(result.jsCode || ''))));
            router.push(`/editor?${params.toString()}`);
        } catch(e: any) {
            toast({ variant: 'destructive', title: 'Erreur (X)frame', description: e.message });
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageDataUri(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="glass-card max-w-xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <LayoutTemplate className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Créez une maquette web</CardTitle>
                            <CardDescription>
                                Décrivez l'interface ou fournissez une image.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        name="prompt"
                        placeholder="Exemple : Une carte de profil utilisateur avec un avatar, un nom, et un bouton 'Suivre'."
                        rows={6}
                        minLength={10}
                        className="bg-transparent text-base"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                    />
                    
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Inspiration (Optionnel)</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        {imageDataUri ? (
                            <div className="relative group w-full h-32 rounded-lg border border-dashed border-border flex items-center justify-center">
                                <Image src={imageDataUri} alt="Aperçu de l'image" fill objectFit="contain" className="p-2"/>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setImageDataUri(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-accent hover:border-primary transition-colors"
                                disabled={isLoading}
                            >
                                <Upload className="h-6 w-6 mb-2" />
                                <span>Déposer une image</span>
                            </button>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                     {isLoading ? (
                        <div className="mt-8 w-full">
                            <Card className="glass-card min-h-[150px] relative overflow-hidden">
                                <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                                <div className="relative z-10 h-full flex items-center justify-center">
                                    <LoadingState text="(X)frame code votre maquette..." />
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Button type="submit" disabled={isLoading} className="w-full">
                            Générer la maquette
                            <Sparkles className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </form>
    );
}
