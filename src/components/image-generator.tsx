
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Download, ZoomIn, Send, Save, RefreshCcw } from 'lucide-react';
import { LoadingState } from './loading-state';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import AiLoadingAnimation from './ui/ai-loading-animation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { uploadDocument } from '@/app/actions';

const imageStyles = [
  { value: 'none', label: 'Aucun' },
  { value: 'photorealistic', label: 'Photorealiste' },
  { value: 'cinematic', label: 'Cinématographique' },
  { value: 'anime', label: 'Anime' },
  { value: 'watercolor', label: 'Aquarelle' },
  { value: 'illustration', label: 'Illustration' },
  { value: '3d-render', label: 'Rendu 3D' },
  { value: 'pixel-art', label: 'Pixel Art' },
];

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" size="icon" disabled={isLoading} aria-label="Générer l'image" className="w-14 h-14 rounded-full flex-shrink-0">
        <Send className="h-5 w-5" />
    </Button>
  );
}

export default function ImageGenerator() {
    const [key, setKey] = useState(0);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('none');
    
    const { toast } = useToast();
    const { addNotification } = useNotifications();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast({ variant: 'destructive', description: "Veuillez entrer un prompt."});
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/content-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentType: 'image', prompt, style }),
            });
            if (!response.ok) throw new Error((await response.json()).error);
            const data = await response.json();

            if (data.type === 'image' && typeof data.data === 'string') {
                setResult(data.data);
                addNotification({
                    icon: ImageIcon,
                    title: "Image générée !",
                    description: `Votre image pour "${prompt.substring(0, 30)}..." est prête.`
                });
            } else {
                 throw new Error("L'IA n'a pas retourné une image valide.");
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setKey(k => k + 1);
        setResult(null);
        setPrompt('');
    };

    const handleDownload = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result;
        link.download = `xyzz-ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSaveToDrive = async () => {
        if (!result) return;
        try {
            const fileName = `image-${Date.now()}.png`;
            await uploadDocument({ name: fileName, content: result, mimeType: 'image/png' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        }
    };

    return (
        <form onSubmit={handleSubmit} key={key} className="w-full">
            <div className="glass-card w-full max-w-4xl min-h-[70vh] mx-auto overflow-hidden p-0 flex flex-col">
                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <AiLoadingAnimation isLoading={isLoading} />
                    </div>
                    <div className="h-full p-6 flex items-center justify-center relative z-10 overflow-y-auto">
                        {isLoading ? (
                            <LoadingState text="Génération de l'image en cours..." />
                        ) : result ? (
                            <div className="w-full max-w-lg space-y-4">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="relative group aspect-square w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                            <Image src={result} alt="Image générée par l'IA" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ZoomIn className="h-12 w-12 text-white" />
                                            </div>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-4xl p-2 glass-card">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="sr-only">Image Agrandie</AlertDialogTitle>
                                            <AlertDialogDescription className="sr-only">
                                                Voici une version agrandie de l'image. Vous pouvez la télécharger ou fermer cette vue.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="relative">
                                            <Image src={result} alt="Image générée par l'IA" width={1024} height={1024} className="rounded-md w-full h-auto object-contain max-h-[80vh]" />
                                            <Button type="button" size="icon" variant="secondary" className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white" onClick={handleDownload} aria-label="Télécharger l'image"><Download className="h-5 w-5" /></Button>
                                        </div>
                                        <AlertDialogFooter className="p-2 sm:justify-end bg-transparent border-t-0">
                                            <AlertDialogAction>Fermer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <div className="flex justify-center gap-2">
                                    <Button onClick={handleReset} variant="outline"><RefreshCcw className="mr-2 h-4 w-4" /> Nouvelle image</Button>
                                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Télécharger</Button>
                                    <Button onClick={handleSaveToDrive} variant="secondary"><Save className="mr-2 h-4 w-4" /> Sur (X)cloud</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center relative z-10">
                                <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground/30" />
                                <p className="mt-4 text-lg text-muted-foreground">L'image que vous allez créer apparaîtra ici.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="relative z-10 p-4 md:p-6 border-t border-white/10 shrink-0">
                    <div className="flex items-start gap-4">
                        <Textarea
                            name="prompt"
                            placeholder="Ex: Un astronaute surfant sur une vague cosmique..."
                            rows={1}
                            required
                            className="flex-1 h-14 px-6 text-base rounded-full bg-background/50 border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
                            minLength={10}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                        <div>
                             <Label htmlFor="style" className="sr-only">Style</Label>
                             <Select name="style" value={style} onValueChange={setStyle} disabled={isLoading}>
                                <SelectTrigger id="style" className="h-14 w-48 rounded-full bg-background/50 border-border text-foreground">
                                    <SelectValue placeholder="Style" />
                                </SelectTrigger>
                                <SelectContent className="glass-card">
                                    {imageStyles.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                             </Select>
                        </div>
                        <SubmitButton isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </form>
    );
}
