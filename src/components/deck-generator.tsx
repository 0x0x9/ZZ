
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateDeckAction, generateImageAction, uploadDocumentAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Presentation, Sparkles, ArrowLeft, ArrowRight, NotebookText, Image as ImageIcon, Download, Loader, Save, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateDeckOutput, DeckSlide } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import Image from 'next/image';
import { useNotifications } from '@/hooks/use-notifications';
import { Skeleton } from './ui/skeleton';


type SlideWithImage = DeckSlide & { imageUrl?: string; isLoadingImage: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Création du Deck..." isCompact={true} />
      ) : (
        <>
          Générer la présentation
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ result, slidesWithImages, onReset }: { result: GenerateDeckOutput, slidesWithImages: SlideWithImage[], onReset: () => void }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const goToNext = () => setCurrentSlide(prev => (prev + 1) % slidesWithImages.length);
    const goToPrev = () => setCurrentSlide(prev => (prev - 1 + slidesWithImages.length) % slidesWithImages.length);

    const activeSlide = slidesWithImages[currentSlide];

    if (!activeSlide) {
        return (
            <div className="mt-6">
                <Card className="glass-card min-h-[400px] relative overflow-hidden">
                    <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <LoadingState text="Préparation des images..." />
                    </div>
                </Card>
            </div>
        );
    }

    const formatDeckAsMarkdown = (deck: GenerateDeckOutput): string => {
        let markdown = `# ${deck.title}\n\n`;
        deck.slides.forEach((slide, index) => {
            markdown += `---\n\n`;
            markdown += `## Slide ${index + 1}: ${slide.title}\n\n`;
            markdown += `### Contenu\n`;
            slide.content.forEach(point => {
                markdown += `- ${point}\n`;
            });
            markdown += `\n### Notes pour l'orateur\n`;
            markdown += `${slide.speakerNotes}\n\n`;
        });
        return markdown;
    };

    const handleDownload = () => {
        const markdown = formatDeckAsMarkdown(result);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `deck-${result.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'presentation'}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

     const handleSaveToDrive = async () => {
        setIsSaving(true);
        try {
            const markdownContent = formatDeckAsMarkdown(result);
            const fileName = `decks/deck-${result.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'presentation'}.md`;
            const dataUri = `data:text/markdown;base64,${btoa(unescape(encodeURIComponent(markdownContent)))}`;
            
            await uploadDocumentAction({ name: fileName, content: dataUri, mimeType: 'text/markdown' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="text-center mb-6">
                 <Button onClick={onReset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Créer une autre présentation
                </Button>
            </div>
            <Card className="glass-card overflow-hidden">
                <CardHeader className="flex-row items-center justify-between p-6">
                    <CardTitle className="text-2xl">{result.title}</CardTitle>
                    <div className="flex items-center gap-2">
                         <Button onClick={handleSaveToDrive} disabled={isSaving} variant="secondary" size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Sauvegarde...' : 'Sur (X)cloud'}
                        </Button>
                        <Button onClick={handleDownload} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exporter (.md)
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="aspect-[16/9] bg-black/20 rounded-lg flex relative p-8 text-white overflow-hidden">
                        {activeSlide.isLoadingImage && (
                             <Skeleton className="absolute inset-0" />
                        )}
                        {activeSlide.imageUrl && (
                            <Image
                                src={activeSlide.imageUrl}
                                alt={`Illustration pour ${activeSlide.title}`}
                                fill
                                className="object-cover opacity-30"
                                data-ai-hint="presentation background"
                            />
                        )}
                        <div className="relative z-10 w-full flex flex-col justify-center">
                            <h3 className="text-4xl font-bold tracking-tight">{activeSlide.title}</h3>
                            <ul className="mt-6 space-y-3 list-disc pl-8 text-xl">
                                {activeSlide.content.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" onClick={goToPrev}><ArrowLeft className="mr-2" />Précédent</Button>
                        <span className="text-sm text-muted-foreground">Diapositive {currentSlide + 1} / {slidesWithImages.length}</span>
                        <Button variant="outline" onClick={goToNext}>Suivant<ArrowRight className="ml-2" /></Button>
                    </div>
                    
                    <div className="mt-8 space-y-4">
                        <Card className="bg-background/30">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Prompt pour l'image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground italic">"{activeSlide.imagePrompt}"</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background/30">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><NotebookText className="h-5 w-5"/> Notes pour l'orateur</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{activeSlide.speakerNotes}</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function DeckGeneratorForm({ state }: {
    state: { message: string, result: GenerateDeckOutput | null, error: string | null, id: number, prompt: string },
}) {
    const { pending } = useFormStatus();

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Presentation className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>De quoi parle votre présentation ?</CardTitle>
                            <CardDescription>
                                Donnez un sujet et (X)deck créera les diapositives pour vous.
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    name="prompt"
                    placeholder="Exemple : L'impact de l'IA sur l'industrie de la musique"
                    rows={4}
                    required
                    minLength={10}
                    className="bg-transparent text-base"
                    disabled={pending}
                    defaultValue={state.prompt ?? ''}
                />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton />
            </div>
        </Card>
    );
}

export default function DeckGenerator({ initialResult, prompt }: { initialResult?: GenerateDeckOutput, prompt?: string }) {
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState = {
        message: initialResult ? 'success' : '',
        result: initialResult || null,
        error: null,
        id: key,
        prompt: prompt || ''
    };
    const [state, formAction] = useFormState(generateDeckAction, initialState);
    const [slidesWithImages, setSlidesWithImages] = useState<SlideWithImage[]>([]);
    const { toast } = useToast();
    const { addNotification } = useNotifications();
    const { pending } = useFormStatus();
    
    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)deck',
                description: state.error,
            });
        }
        if (state.message === 'success' && state.result?.slides) {
            setShowForm(false);
            
            addNotification({
                icon: Presentation,
                title: 'Présentation générée !',
                description: `Votre présentation sur "${state.result.title}" est prête.`,
            });

            const initialSlides = state.result.slides.map(s => ({ ...s, isLoadingImage: true }));
            setSlidesWithImages(initialSlides);

            initialSlides.forEach((slide, index) => {
                const formData = new FormData();
                formData.append('prompt', slide.imagePrompt);
                generateImageAction({ id: Math.random(), message: '', imageDataUri: null, error: null, prompt: '' }, formData)
                    .then(imageResult => {
                        if (imageResult.message === 'success' && imageResult.imageDataUri) {
                            setSlidesWithImages(prev => {
                                const newSlides = [...prev];
                                newSlides[index] = { ...newSlides[index], imageUrl: imageResult.imageDataUri, isLoadingImage: false };
                                return newSlides;
                            });
                        } else {
                             setSlidesWithImages(prev => {
                                const newSlides = [...prev];
                                newSlides[index] = { ...newSlides[index], isLoadingImage: false };
                                return newSlides;
                            });
                        }
                    });
            });
        }
    }, [state, toast, addNotification]);

    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
    };

    return (
        <form action={formAction} key={key}>
            <div className="max-w-4xl mx-auto">
                {showForm && <DeckGeneratorForm state={initialState} />}
                
                {pending && (
                    <div className="mt-6">
                        <Card className="glass-card min-h-[400px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <LoadingState text="(X)deck prépare vos diapositives..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state.result && <ResultsDisplay result={state.result} slidesWithImages={slidesWithImages} onReset={handleReset} />}
            </div>
        </form>
    );
}

    
