'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateContent, uploadDocument } from '@/app/actions';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Générer l'image" className="w-14 h-14 rounded-full flex-shrink-0">
        <Send className="h-5 w-5" />
    </Button>
  );
}

function ImageGeneratorFormBody({ state, onReset }: { 
    state: { type: 'image', data: string | null } | { error: string } | null,
    onReset: () => void;
}) {
    const { pending } = useFormStatus();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    const getAiHint = (prompt: string | undefined) => {
        if (!prompt) return 'creative';
        return prompt.split(' ').slice(0, 2).join(' ');
    };

    const handleDownload = (imageDataUri: string) => {
        const link = document.createElement('a');
        link.href = imageDataUri;
        link.download = `xyzz-ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleSaveToDrive = async () => {
        if (!state || state.type !== 'image' || !state.data) return;
        setIsSaving(true);
        try {
            const fileName = `image-${Date.now()}.png`;
            await uploadDocument({ name: fileName, content: state.data, mimeType: 'image/png' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)drive.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="glass-card w-full max-w-4xl min-h-[70vh] mx-auto overflow-hidden p-0 flex flex-col">
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <AiLoadingAnimation isLoading={pending} />
                </div>
                <div className="h-full p-6 flex items-center justify-center relative z-10 overflow-y-auto">
                    {pending ? (
                        <LoadingState text="Génération de l'image en cours..." />
                    ) : state?.type === 'image' && state.data ? (
                        <div className="w-full max-w-lg space-y-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div className="relative group aspect-square w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                        <Image
                                            src={state.data}
                                            alt="Image générée par l'IA"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                            data-ai-hint="ai generated"
                                        />
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
                                        <Image
                                            src={state.data}
                                            alt="Image générée par l'IA"
                                            width={1024}
                                            height={1024}
                                            className="rounded-md w-full h-auto object-contain max-h-[80vh]"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="secondary"
                                            className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
                                            onClick={() => handleDownload(state.data!)}
                                            aria-label="Télécharger l'image"
                                        >
                                            <Download className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <AlertDialogFooter className="p-2 sm:justify-end bg-transparent border-t-0">
                                        <AlertDialogAction>Fermer</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className="flex justify-center gap-2">
                                <Button onClick={onReset} variant="outline"><RefreshCcw className="mr-2" /> Nouvelle image</Button>
                                <Button onClick={() => handleDownload(state.data!)}><Download className="mr-2" /> Télécharger</Button>
                                <Button onClick={handleSaveToDrive} disabled={isSaving} variant="secondary">
                                    <Save className="mr-2" />
                                    {isSaving ? 'Sauvegarde...' : 'Sur (X)drive'}
                                </Button>
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
                     <input type="hidden" name="contentType" value="image" />
                    <Textarea
                        name="prompt"
                        placeholder="Ex: Un astronaute surfant sur une vague cosmique..."
                        rows={1}
                        required
                        className="flex-1 h-14 px-6 text-base rounded-full bg-background/50 border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
                        minLength={10}
                        disabled={pending}
                        onInput={(e) => {
                            const textarea = e.currentTarget;
                            textarea.style.height = 'auto';
                            if (textarea.scrollHeight > 56) {
                                textarea.style.height = `${textarea.scrollHeight}px`;
                            } else {
                                textarea.style.height = '56px';
                            }
                        }}
                    />
                    <div>
                         <Label htmlFor="style" className="sr-only">Style</Label>
                         <Select name="style" defaultValue={'none'} disabled={pending}>
                            <SelectTrigger id="style" className="h-14 w-48 rounded-full bg-background/50 border-border text-foreground">
                                <SelectValue placeholder="Style" />
                            </SelectTrigger>
                            <SelectContent className="glass-card">
                                {imageStyles.map(style => (
                                    <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                                ))}
                            </SelectContent>
                         </Select>
                    </div>
                    <SubmitButton />
                </div>
            </div>
        </div>
    );
}

export default function ImageGenerator() {
    const [key, setKey] = useState(0);
    const initialState = null;
    const [state, formAction] = useFormState(generateContent, initialState);
    const { toast } = useToast();
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: state.error,
            });
        }
        if (state?.type === 'image' && state.data) {
            addNotification({
                icon: ImageIcon,
                title: "Image générée !",
                description: `Votre image est prête.`
            });
        }
    }, [state, toast, addNotification]);

    return <form action={formAction} key={key}><ImageGeneratorFormBody state={state} onReset={() => setKey(k => k + 1)}/></form>;
}
