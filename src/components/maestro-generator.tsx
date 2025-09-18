
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateSchedule, generateMoodboard, uploadDocument } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Sparkles, Image as ImageIconLucide, BookOpen, Clock, CheckSquare, Download, ZoomIn, Save, Calendar, CalendarPlus, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProjectPlan } from '@/ai/types';
import Image from 'next/image';
import { LoadingState } from './loading-state';
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
import { motion } from 'framer-motion';
import { useNotifications } from '@/hooks/use-notifications';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Orchestration..." isCompact={true} />
      ) : (
        <>
          Générer le plan de projet
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ plan, moodboard, isLoadingMoodboard, onReset }: { plan: ProjectPlan, moodboard: string[], isLoadingMoodboard: boolean, onReset: () => void }) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const categories = [...new Set(plan.tasks.map(task => task.category))];

    const handleDownloadImage = (imageUri: string) => {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `xyzz-ai-maestro-moodboard-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const formatPlanAsMarkdown = (plan: ProjectPlan): string => {
        let markdown = `# ${plan.title}\n\n`;
        markdown += `## Brief Créatif\n\n${plan.creativeBrief}\n\n`;
        markdown += `## Plan d'Action\n\n`;
        categories.forEach(category => {
            markdown += `### ${category}\n\n`;
            plan.tasks.filter(t => t.category === category).forEach(task => {
                markdown += `#### ${task.title}\n`;
                markdown += `${task.description}\n\n`;
                markdown += `**Checklist:**\n`;
                task.checklist.forEach(item => {
                    markdown += `- [ ] ${item.text}\n`;
                });
                markdown += `\n`;
            });
        });
        if(plan.events && plan.events.length > 0) {
            markdown += `## Événements Planifiés\n\n`;
            plan.events.forEach(event => {
                 markdown += `- ${event.title}: ${event.date} à ${event.time}\n`;
            });
            markdown += `\n`;
        }
        if (plan.imagePrompts) {
            markdown += `## Prompts pour Moodboard\n\n`;
            plan.imagePrompts.forEach(prompt => markdown += `- ${prompt}\n`);
        }
        return markdown;
    };

    const handleDownloadMarkdown = () => {
        const markdown = formatPlanAsMarkdown(plan);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `maestro-${plan.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'plan'}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Téléchargé', description: 'Le plan de projet a été téléchargé en Markdown.' });
    };

    const handleSaveToDrive = async () => {
        setIsSaving(true);
        try {
            const fileName = `maestro-projets/maestro-${plan.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'plan'}.json`;
            const contentToSave = JSON.stringify(plan);
            const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(contentToSave)))}`;
            
            await uploadDocument({ name: fileName, content: dataUri, mimeType: 'application/json' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    // This is now a mock since we can't call the action directly.
    // In a real app with a proper API, this would be a server action call.
    const handleSyncAgenda = async () => {
        if (!plan.events || plan.events.length === 0) return;
        setIsSyncing(true);
        toast({ description: `Synchronisation de ${plan.events.length} événement(s) avec (X)agenda... (simulation)` });
        await new Promise(res => setTimeout(res, 1000));
        toast({ title: "Synchronisation simulée !", description: "Consultez (X)agenda pour voir les événements." });
        setIsSyncing(false);
    };


    return (
        <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <Card className="glass-card overflow-hidden">
                 <CardHeader className="flex-row items-center justify-between p-6">
                    <div>
                        <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                        <CardDescription>Votre plan de projet généré par Maestro.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button onClick={onReset} variant="outline" size="sm">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Nouveau
                        </Button>
                        <Button onClick={handleSaveToDrive} disabled={isSaving} variant="secondary" size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Sauvegarde...' : 'Sur (X)cloud'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-1 space-y-8">
                        <div>
                             <h3 className="font-semibold flex items-center gap-2 mb-3 text-lg"><BookOpen className="h-5 w-5 text-primary" /> Brief Créatif</h3>
                             <p className="text-muted-foreground text-sm bg-background/30 p-4 rounded-lg">{plan.creativeBrief}</p>
                        </div>
                        {plan.events && plan.events.length > 0 && (
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-3 text-lg"><Calendar className="h-5 w-5 text-primary" /> Événements Planifiés</h3>
                                <div className="space-y-2">
                                    {plan.events.map((event, i) => (
                                        <div key={i} className="text-sm p-3 bg-background/50 rounded-lg flex justify-between items-center">
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.date} à {event.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={handleSyncAgenda} disabled={isSyncing} variant="outline" size="sm" className="w-full mt-3">
                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                    {isSyncing ? 'Synchro...' : 'Ajouter à (X)agenda'}
                                </Button>
                            </div>
                        )}
                         <div>
                             <h3 className="font-semibold flex items-center gap-2 mb-3 text-lg"><ImageIconLucide className="h-5 w-5 text-primary" /> Moodboard</h3>
                             {isLoadingMoodboard ? (
                                 <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="aspect-square w-full rounded-lg" />
                                    <Skeleton className="aspect-square w-full rounded-lg" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {moodboard.slice(0, 4).map((imageUri, index) => (
                                        <AlertDialog key={index}>
                                            <AlertDialogTrigger asChild>
                                                <div className="aspect-square relative overflow-hidden rounded-lg group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                                    <Image
                                                        src={imageUri}
                                                        alt={`Moodboard image ${index + 1}`}
                                                        fill
                                                        sizes="(max-width: 768px) 30vw, 15vw"
                                                        className="object-cover"
                                                        data-ai-hint="creative abstract"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <ZoomIn className="h-6 w-6 text-white" />
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
                                                        src={imageUri}
                                                        alt={`Moodboard image ${index + 1}`}
                                                        width={1024}
                                                        height={1024}
                                                        className="rounded-md w-full h-auto object-contain max-h-[80vh]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute top-4 right-4 h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
                                                        onClick={() => handleDownloadImage(imageUri)}
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-8">
                         <h3 className="font-semibold flex items-center gap-2 text-lg"><CheckSquare className="h-5 w-5 text-primary" /> Plan d'Action</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categories.map((category) => (
                                <div key={category} className="space-y-4">
                                    <h4 className="font-semibold tracking-tight">{category}</h4>
                                    <div className="space-y-4">
                                        {plan.tasks
                                            .filter((task) => task.category === category)
                                            .map((task, index) => (
                                                <Card key={index} className="glass-card bg-background/50 border-white/20 flex flex-col">
                                                    <CardHeader className="p-4">
                                                        <CardTitle className="text-base">{task.title}</CardTitle>
                                                        <CardDescription className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Durée : {task.duration || 'N/A'}</span>
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-0 flex-grow">
                                                        <ul className="space-y-1.5 pl-1 text-sm text-muted-foreground">
                                                            {task.checklist.map((item, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-primary mt-1.5">&bull;</span>
                                                                    <span>{item.text}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function MaestroForm({ state }: {
    state: { result: ProjectPlan | null; error: string | null; prompt: string }
}) {
    const { pending } = useFormStatus();
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BrainCircuit className="h-7 w-7 text-primary" />
                    <div>
                        <CardTitle>Quel est votre projet ?</CardTitle>
                        <CardDescription>
                            Soyez aussi bref ou détaillé que vous le souhaitez. Mentionnez une date pour la planifier !
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    name="prompt"
                    placeholder="Exemple : Je veux créer une courte vidéo animée pour présenter mon nouveau produit, avec un style cartoon et une musique entraînante. La réunion de lancement sera mardi prochain à 14h."
                    rows={5}
                    required
                    minLength={15}
                    className="bg-transparent text-base"
                    disabled={pending}
                    defaultValue={state.prompt ?? ''}
                />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton />
            </div>
        </Card>
    )
}

export default function MaestroGenerator({ initialResult, prompt }: { initialResult?: ProjectPlan, prompt?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const promptFromUrl = searchParams.get('prompt');
  
  const [key, setKey] = useState(0); // To reset the form
  const [showForm, setShowForm] = useState(!initialResult);

  const initialState: { result: ProjectPlan | null, error: string | null, prompt: string } = { 
    result: initialResult || null, 
    error: null, 
    prompt: prompt || promptFromUrl || '' 
  };
  const [state, formAction] = useFormState(generateSchedule, initialState);

  const [moodboard, setMoodboard] = useState<string[]>([]);
  const [isLoadingMoodboard, setIsLoadingMoodboard] = useState(false);
  const { toast } = useToast();
  const plan = state.result;
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.error) {
      setShowForm(true);
      toast({
        variant: 'destructive',
        title: 'Erreur de Maestro',
        description: state.error,
      });
    }

    if (state.result) {
        setShowForm(false);
        const resultId = `maestro-result-${Math.random()}`;
        
        if (addNotification) {
            addNotification({
                icon: BrainCircuit,
                title: 'Plan de projet prêt !',
                description: `Votre plan pour "${state.result.title}" a été généré.`,
                onClick: () => { console.log("Notification clicked for project", state.result?.title)},
            });
        }
    }
  }, [state, toast, addNotification, router]);

  useEffect(() => {
    if (plan?.imagePrompts && plan.imagePrompts.length > 0) {
      const fetchMoodboard = async () => {
        setIsLoadingMoodboard(true);
        setMoodboard([]);
        const result = await generateMoodboard({ prompts: plan.imagePrompts });
        if (result.imageDataUris) {
          setMoodboard(result.imageDataUris);
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur Moodboard',
            description: "Une erreur est survenue lors de la génération du moodboard.",
          });
        }
        setIsLoadingMoodboard(false);
      };
      fetchMoodboard();
    } else {
      setMoodboard([]);
    }
  }, [plan, toast]);
  
  const handleReset = () => {
      setKey(k => k + 1);
      setShowForm(true);
  }

  return (
    <form ref={formRef} action={formAction} key={key}>
        <div className="max-w-7xl mx-auto">
            {showForm && (
                <MaestroForm state={initialState} />
            )}
            
            {pending && (
                <div className="mt-8">
                   <Card className="glass-card min-h-[400px] relative overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <AiLoadingAnimation isLoading={true} />
                        </div>
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <LoadingState text="Maestro orchestre votre plan..." />
                        </div>
                    </Card>
                </div>
            )}

            {!showForm && state.result && (
                <ResultsDisplay 
                    plan={state.result} 
                    moodboard={moodboard} 
                    isLoadingMoodboard={isLoadingMoodboard}
                    onReset={handleReset}
                />
            )}
        </div>
    </form>
  );
}
