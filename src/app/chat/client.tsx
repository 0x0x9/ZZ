

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, ArrowLeft, MessageSquare, BrainCircuit, Trash2, Edit, PanelLeftOpen, FolderOpen, PanelRightClose, PanelLeftClose, Sparkles, Loader, GitBranch, Share2, UploadCloud, Pencil, Plus, Presentation, FilePlus, Save, ChevronsRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OriaHistoryMessage, ProjectPlan, Doc, GenerateFluxOutput } from '@/ai/types';
import { AnimatePresence, motion } from 'framer-motion';
import { oriaChatAction, deleteDocumentAction, listDocumentsAction, fluxAction, createManualProjectAction } from '@/app/actions';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import DocManager from '@/components/doc-manager';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { useTheme } from 'next-themes';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/components/auth-component';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';


// Types
type ChatPartner = {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
};

const generationPatterns: Record<string, { icon: React.ElementType, text: string }> = {
    'maestro': { icon: BrainCircuit, text: 'a généré le plan' },
    'deck-': { icon: Presentation, text: 'a créé la présentation' },
};

const getGenerationInfo = (docName: string): { icon: React.ElementType; text: string } | null => {
    for (const key in generationPatterns) {
        if (docName.startsWith(key)) {
            return generationPatterns[key];
        }
    }
    return null;
};

type ActivityType = 'CREATED' | 'UPDATED' | 'SHARED' | 'DELETED' | 'GENERATED';

type Activity = {
    id: string;
    type: ActivityType;
    doc: Doc;
    timestamp: Date;
    generationInfo?: { icon: React.ElementType; text: string } | null;
};

type Project = {
    id: string;
    name: string;
    path: string;
    plan: ProjectPlan | null;
};

const actionInfoMap = {
    GENERATED: { text: 'génération', icon: Sparkles, color: 'text-purple-400' },
    CREATED: { text: 'création', icon: UploadCloud, color: 'text-green-400' },
    UPDATED: { text: 'modification', icon: Pencil, color: 'text-blue-400' },
    SHARED: { text: 'partage', icon: Share2, color: 'text-indigo-400' },
    DELETED: { text: 'suppression', icon: Trash2, color: 'text-red-400' }
};

const RecentActivityFeed = ({ docs, loading }: { docs: Doc[], loading: boolean }) => {
    const activities = useMemo((): Activity[] => {
        if (!docs) return [];
        return docs
            .filter(doc => doc.updatedAt)
            .map(doc => {
                const generationInfo = getGenerationInfo(doc.name.split('/').pop() || '');
                const isCreation = doc.createdAt && doc.updatedAt ? (new Date(doc.updatedAt).getTime() - new Date(doc.createdAt).getTime() < 2000) : false;
                
                let type: ActivityType = 'UPDATED';
                if (isCreation) {
                    type = generationInfo ? 'GENERATED' : 'CREATED';
                }
                
                return {
                    id: doc.id, type, doc, timestamp: new Date(doc.updatedAt!), generationInfo,
                };
            })
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5); // Limit to 5 recent activities
    }, [docs]);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-4/5" /><Skeleton className="h-2 w-1/3" /></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-2 space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground mb-1">Activité Récente</h3>
            {activities.length > 0 ? (
                activities.map(activity => {
                    const action = actionInfoMap[activity.type] || actionInfoMap.UPDATED;
                    const Icon = action.icon;
                    return (
                        <div key={activity.id} className="p-3 rounded-xl flex items-start gap-3 text-sm">
                            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", action.color)} />
                            <div>
                                <p className="text-foreground/90 leading-tight">
                                    <span className="font-semibold">{activity.doc.name.split('/').pop()}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {action.text} • {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: fr })}
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-xs text-muted-foreground p-4">Aucune activité récente.</p>
            )}
        </div>
    );
};


// Sub-components
function ProjectTracker({ activeProject, setActiveProject, onProjectDeleted, projects, loading, onCreateNew }: { activeProject: Project | null, setActiveProject: (project: Project | null) => void, onProjectDeleted: (deletedId: string) => void, projects: Project[], loading: boolean, onCreateNew: () => void }) {
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const { toast } = useToast();

    const calculateProgress = useCallback((tasks?: ProjectPlan['tasks']) => {
        if (!tasks || tasks.length === 0) return 0;
        const allChecklistItems = tasks.flatMap(task => task.checklist);
        if (allChecklistItems.length === 0) return 0;
        const completedItems = allChecklistItems.filter(item => item.completed).length;
        return (completedItems / allChecklistItems.length) * 100;
    }, []);

    const handleDeleteProject = async () => {
        if (!projectToDelete || !projectToDelete.id) return;
        
        try {
            // This is a mock action. In a real app, this would delete from a database.
            // await deleteDocumentAction({ docId: projectToDelete.id });
             toast({ title: "Projet supprimé", description: `"${projectToDelete.name}" a été supprimé. (Simulation)` });
            const deletedId = projectToDelete.id;
            setProjectToDelete(null);
            onProjectDeleted(deletedId);
        } catch (error) {
            toast({ variant: 'destructive', title: "Erreur", description: "La suppression du projet a échoué."})
        }
    };

    return (
        <div className="p-2 space-y-2">
            <div className="flex justify-between items-center px-3 mb-1">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Projets</h3>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCreateNew}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                ))
            ) : projects.length > 0 ? (
                projects.map(proj => (
                    <div key={proj.id} className="group relative">
                        <button
                            onClick={() => setActiveProject(proj)}
                            className={cn(
                                "w-full text-left p-3 rounded-xl transition-colors flex items-center gap-3",
                                activeProject?.id === proj.id ? "bg-primary/10" : "hover:bg-muted/50"
                            )}
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <BrainCircuit className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate text-sm">{proj.name}</p>
                                <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                                    <Progress value={calculateProgress(proj.plan?.tasks)} className="h-1.5" />
                                </div>
                            </div>
                        </button>
                         <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); setProjectToDelete(proj); }}
                            className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Supprimer le projet"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))
            ) : (
                <p className="text-center text-xs text-muted-foreground p-4">Aucun projet Maestro trouvé.</p>
            )}

            <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Êtes-vous sûr de vouloir supprimer le projet "{projectToDelete?.name}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function ManualProjectForm({ onProjectCreated, onCancel }: { onProjectCreated: (project: ProjectPlan) => void, onCancel: () => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, setIsPending] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData(e.currentTarget);
        const result = await createManualProjectAction(null, formData);
        if (result.success && result.project) {
            onProjectCreated(result.project);
        } else if (result.error) {
            alert(`Erreur: ${result.error}`);
        }
        setIsPending(false);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-lg mt-8 space-y-4 text-left">
            <div className="space-y-2">
                <Label htmlFor="title">Titre du projet</Label>
                <Input id="title" name="title" placeholder="Ex: Lancement de ma chaîne YouTube" required disabled={isPending} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="creativeBrief">Description / Brief Créatif</Label>
                <Textarea id="creativeBrief" name="creativeBrief" placeholder="Décrivez l'objectif principal et la vision de votre projet." rows={4} required disabled={isPending} />
            </div>
            <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>Annuler</Button>
                <Button type="submit" disabled={isPending} className="flex-1">
                    {isPending ? <Loader className="animate-spin mr-2"/> : <FilePlus className="mr-2 h-4 w-4"/>}
                    {isPending ? 'Création...' : 'Créer le projet'}
                </Button>
            </div>
        </form>
    );
}

function NewProjectView({ onProjectCreated, onCancel }: { onProjectCreated: (result: any) => void, onCancel: () => void}) {
    const initialState = { message: '', result: null, error: null, id: 0, prompt: '', job: '' };
    const [state, formAction] = useFormState(fluxAction, initialState);
    const [view, setView] = useState<'ai' | 'manual'>('ai');
    const { toast } = useToast();
    const { pending } = useFormStatus();

    useEffect(() => {
        if(state.result) {
            onProjectCreated(state.result);
        }
        if(state.error) {
            toast({variant: 'destructive', title: 'Erreur (X)flux', description: state.error});
        }
    }, [state, onProjectCreated, toast]);

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full flex flex-col items-center"
                >
                    {view === 'ai' ? (
                        <>
                            <Sparkles className="mx-auto h-20 w-20 text-muted-foreground/30" />
                            <h2 className="mt-6 text-xl font-semibold text-foreground">Créer un nouveau projet avec l'IA</h2>
                            <p className="mt-2 text-muted-foreground">Décrivez votre objectif et laissez (X)flux générer tous les livrables de départ.</p>
                            <form action={formAction} className="w-full max-w-lg mt-8 space-y-4">
                                <Textarea name="prompt" placeholder="Exemple : Je suis une artiste et je veux lancer une collection de NFT sur le thème de l'espace." rows={3} required minLength={15} className="bg-background/50 text-base text-center" disabled={pending} />
                                <Input name="job" placeholder="Votre métier ? (ex: Développeur, Artiste...) - Optionnel" className="bg-background/50 text-base text-center" disabled={pending} />
                                <Button type="submit" size="lg" disabled={pending} className="w-full">
                                    {pending ? <Loader className="animate-spin mr-2"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                    {pending ? 'Génération en cours...' : 'Lancer (X)flux'}
                                </Button>
                                <Button type="button" variant="link" onClick={() => setView('manual')} disabled={pending}>Ou créer manuellement</Button>
                            </form>
                        </>
                    ) : (
                         <>
                            <FilePlus className="mx-auto h-20 w-20 text-muted-foreground/30" />
                            <h2 className="mt-6 text-xl font-semibold text-foreground">Créer un projet manuellement</h2>
                            <p className="mt-2 text-muted-foreground">Définissez vous-même les bases de votre projet.</p>
                            <ManualProjectForm onProjectCreated={onProjectCreated} onCancel={() => setView('ai')} />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
            <Button variant="ghost" onClick={onCancel} disabled={pending} className="mt-8">Retour</Button>
        </div>
    )
}

function OriaChatWindow({ partner, onBack, activeProject }: { partner: ChatPartner, onBack: () => void, activeProject: Project | null }) {
    const formRef = useRef<HTMLFormElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<OriaHistoryMessage[]>([]);
    
    const clientAction = async (prevState: any, formData: FormData) => {
        const prompt = formData.get('prompt') as string;
        if (!prompt.trim()) return { ...prevState, error: "Le message ne peut être vide." };
        
        const newHistory = [...messages, { role: 'user', content: prompt }] as OriaHistoryMessage[];
        setMessages(newHistory);
        
        // Don't stringify, pass the object directly
        formData.set('history', newHistory as any);
        
        const result = await oriaChatAction(prevState, formData);
        
        if (result.message === 'success' && result.result) {
            setMessages(prev => [...prev, { role: 'model', content: result.result as any }]);
        } else {
            setMessages(prev => [...prev, { role: 'model', content: { type: 'response', response: result.error || "Désolée, une erreur est survenue." } }]);
        }
        formRef.current?.reset();
        return result;
    }
    
    const [state, formAction] = useFormState(clientAction, { id: 0, result: null, error: null, message: '' });
    const { pending } = useFormStatus();

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, pending]);
    
    const getProjectContext = () => {
        if (!activeProject?.plan) return 'aucun';
        
        const tasksSummary = activeProject.plan.tasks.map(task => 
            `- ${task.title} (${task.category}): ${task.checklist.filter(c => c.completed).length}/${task.checklist.length} complétées. Description: ${task.description}`
        ).join('\n');

        return `L'utilisateur travaille sur le projet "${activeProject.name}".
        Brief créatif : "${activeProject.plan.creativeBrief}".
        Liste des tâches :
        ${tasksSummary}`;
    };

    return (
        <div className="glass-card h-full flex flex-col">
            <header className="p-4 border-b border-white/10 flex items-center gap-4 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shrink-0">
                    <Sparkles className="text-white h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold">{partner.displayName}</h3>
                    {activeProject && <p className="text-xs text-muted-foreground truncate max-w-xs">Contexte : {activeProject.name}</p>}
                </div>
            </header>
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                 <div className="space-y-6">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                layout
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={cn("flex items-end gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                            >
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 self-end rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shrink-0">
                                        <Sparkles className="text-white h-4 w-4" />
                                    </div>
                                )}
                                <div className={cn(
                                    "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md text-sm whitespace-pre-wrap",
                                    msg.role === 'user'
                                        ? "bg-primary/80 text-primary-foreground rounded-br-none"
                                        : "bg-background/50 rounded-bl-none"
                                )}>
                                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                                </div>
                            </motion.div>
                        ))}
                         {pending && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="flex items-end gap-2 justify-start"
                            >
                                 <div className="w-8 h-8 self-end rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shrink-0">
                                    <Sparkles className="text-white h-4 w-4 animate-pulse" />
                                </div>
                                <div className="max-w-xs p-3 rounded-2xl shadow-md bg-background/50 rounded-bl-none">
                                    <Loader className="animate-spin h-5 w-5 text-muted-foreground" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>
             <div className="p-4 border-t border-white/10 shrink-0">
                <form ref={formRef} action={formAction} className="flex gap-4">
                    <input type="hidden" name="context" value={getProjectContext()} />
                    <Input
                        name="prompt"
                        placeholder="Discutez avec Oria..."
                        className="h-11 text-base bg-background/50 rounded-full"
                        autoComplete="off"
                        disabled={pending}
                    />
                    <Button type="submit" size="icon" disabled={pending} aria-label="Envoyer le message" className="rounded-full">
                        {pending ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}

function ProjectPlanView({ project, setProject }: { project: Project, setProject: (p: Project) => void }) {
    if (!project.plan) {
         return (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <BrainCircuit className="mx-auto h-20 w-20 text-muted-foreground/30" />
                <p className="mt-6 text-xl font-semibold text-foreground">Aucun plan de projet (Maestro) trouvé.</p>
                <p className="mt-2">Générez un plan pour ce projet en discutant avec Oria.</p>
            </div>
        );
    }
    const categories = [...new Set(project.plan.tasks.map(task => task.category))];

    const handleChecklistChange = (taskIndex: number, itemIndex: number, checked: boolean) => {
        const updatedProject = JSON.parse(JSON.stringify(project));
        if (updatedProject.plan) {
            updatedProject.plan.tasks[taskIndex].checklist[itemIndex].completed = checked;
            setProject(updatedProject);
        }
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 md:p-6 space-y-8">
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <blockquote className="border-l-4 border-primary pl-4 text-muted-foreground italic">
                    {project.plan.creativeBrief}
                </blockquote>
                <div className="space-y-8">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <div className="space-y-4">
                                {project.plan!.tasks.filter(t => t.category === category).map((task, taskIndex) => (
                                    <div key={taskIndex} className="p-4 rounded-lg bg-background/50 border border-white/10">
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                                        <div className="space-y-2">
                                            {task.checklist.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex items-center gap-3">
                                                    <Checkbox
                                                        id={`task-${taskIndex}-item-${itemIndex}`}
                                                        checked={item.completed}
                                                        onCheckedChange={(checked) => handleChecklistChange(project.plan!.tasks.findIndex(t => t.title === task.title), itemIndex, !!checked)}
                                                    />
                                                    <label htmlFor={`task-${taskIndex}-item-${itemIndex}`} className="text-sm text-foreground/90 has-[:checked]:line-through has-[:checked]:text-muted-foreground cursor-pointer">
                                                        {item.text}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    )
}

function TopMenuBar({ activeProject, onCreateNew, onProjectDeleted, onSaveProject, toggleSidebar, isSidebarVisible }: { activeProject: Project | null, onCreateNew: () => void, onProjectDeleted: (id: string) => void, onSaveProject: () => void, toggleSidebar: () => void, isSidebarVisible: boolean }) {
    const { theme, setTheme } = useTheme();

    const handleDeleteProject = async () => {
        if (!activeProject || !activeProject.id) return;
        onProjectDeleted(activeProject.id);
    };
    
    return (
        <Menubar className="rounded-none border-x-0 border-t-0 px-2 lg:px-4 bg-muted/30 backdrop-blur-md">
            <MenubarMenu>
                <MenubarTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 mr-1">
                        {isSidebarVisible ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                    </Button>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                 <MenubarTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Accueil
                    </Button>
                </MenubarTrigger>
                <MenubarContent className="glass-card">
                    <MenubarItem asChild>
                        <Link href="/">Retour au site (X)yzz</Link>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
             <MenubarMenu>
                <MenubarTrigger>Projet</MenubarTrigger>
                 <MenubarContent className="glass-card">
                    <MenubarItem onClick={onCreateNew}>Nouveau Projet <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled={!activeProject}>Renommer le projet...</MenubarItem>
                    <MenubarItem disabled={!activeProject} onClick={onSaveProject}>Sauvegarder les changements<MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled={!activeProject} onClick={handleDeleteProject} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        Supprimer le projet
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Affichage</MenubarTrigger>
                <MenubarContent className="glass-card">
                    <MenubarItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        Changer le thème
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

// Main Component
export default function MessengerClient() {
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<Doc[]>([]);
        
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [view, setView] = useState<'welcome' | 'newProject'>('welcome');
    
    const oriaPartner: ChatPartner = {
        uid: 'oria-chat-bot',
        displayName: 'Oria (Assistante Projet)',
        photoURL: null,
    };

    const fetchDocs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await listDocumentsAction();
            setDocs(result || []);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les projets.'});
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    const projects = useMemo(() => {
        const projectFolders = docs.filter(doc => doc.mimeType === 'application/x-directory');
        return projectFolders.map(folder => {
            const planDoc = docs.find(d => d.path.startsWith(folder.path) && d.name.endsWith('.json') && d.name.includes('maestro'));
            let plan = null;
            // In a real app, you'd fetch and parse the content of planDoc.
            // Here, we just simulate finding it.
            if (planDoc) {
                plan = {
                    id: planDoc.id,
                    title: folder.name.replace('/', ''),
                    creativeBrief: 'Un brief créatif inspirant pour ce projet génial.',
                    tasks: [
                         { title: 'Définir la vision', description: 'Clarifier les objectifs', category: 'Stratégie & Recherche', duration: '1 jour', checklist: [{text: 'Faire un brainstorming', completed: Math.random() > 0.5}, {text: 'Valider le concept', completed: Math.random() > 0.5}]},
                         { title: 'Créer le contenu', description: 'Produire les livrables', category: 'Création & Production', duration: '5 jours', checklist: [{text: 'Rédiger les textes', completed: false}, {text: 'Créer les visuels', completed: false}]}
                    ],
                    events: [],
                    imagePrompts: []
                };
            }
            return { id: folder.id, name: folder.name.replace('/', ''), path: folder.path, plan };
        });
    }, [docs]);
    
    const onProjectDeleted = (deletedId: string) => {
        if (activeProject && activeProject.id === deletedId) {
            setActiveProject(null);
            setView('welcome');
        }
        setDocs(prev => prev.filter(p => p.id !== deletedId));
    };

    const handleProjectCreated = (result: GenerateFluxOutput | ProjectPlan) => {
        fetchDocs(); // Re-fetch all documents to include the new project
        setActiveProject(null); // Deselect active project
        setView('welcome'); // Go back to project view
        toast({ title: "Projet créé !", description: `Le projet a bien été initialisé.`})
    };
    
    const updateActiveProject = (updatedProject: Project) => {
        setActiveProject(updatedProject);
        // This part is for local state update. A real app would persist this.
    }

    const MainContent = () => {
        if (view === 'newProject') {
            return <NewProjectView onProjectCreated={handleProjectCreated} onCancel={() => setView('welcome')} />
        }

        if (!activeProject) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <BrainCircuit className="mx-auto h-20 w-20 text-muted-foreground/30" />
                    <p className="mt-6 text-xl font-semibold text-foreground">Bienvenue sur Pulse</p>
                    <p className="mt-2">Sélectionnez un projet pour commencer ou créez-en un nouveau.</p>
                </div>
            );
        }

        return (
            <Tabs defaultValue="project" className="h-full flex flex-col">
                <div className="p-2 border-b border-border">
                    <TabsList className="mx-auto">
                        <TabsTrigger value="project">
                            <BrainCircuit className="h-4 w-4 mr-2"/>
                            Plan du Projet
                        </TabsTrigger>
                        <TabsTrigger value="chat">
                            <Sparkles className="h-4 w-4 mr-2"/>
                            Discuter avec Oria
                        </TabsTrigger>
                        <TabsTrigger value="files">
                            <FolderOpen className="h-4 w-4 mr-2"/>
                            Fichiers du projet
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="project" className="flex-1 min-h-0 -mt-2">
                    <ProjectPlanView project={activeProject} setProject={updateActiveProject} />
                </TabsContent>
                <TabsContent value="files" className="flex-1 min-h-0 -mt-2 p-1">
                    <DocManager onDataChange={fetchDocs} initialPath={activeProject.path} />
                </TabsContent>
                <TabsContent value="chat" className="flex-1 min-h-0 -mt-2">
                    <OriaChatWindow partner={oriaPartner} onBack={() => {setActiveProject(null); setView('welcome')}} activeProject={activeProject} />
                </TabsContent>
            </Tabs>
        );
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col glass-card p-0">
                <TopMenuBar 
                    activeProject={activeProject} 
                    onCreateNew={() => setView('newProject')}
                    onProjectDeleted={onProjectDeleted} 
                    onSaveProject={() => toast({ title: "Simulation", description: "La sauvegarde des modifications n'est pas encore implémentée." })}
                    toggleSidebar={() => setShowSidebar(!showSidebar)}
                    isSidebarVisible={showSidebar}
                />
                <div className="flex-1 flex min-h-0">
                    <AnimatePresence>
                        {showSidebar && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'clamp(250px, 30%, 320px)', opacity: 1 }}
                                exit={{ width: 0, opacity: 0, padding: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="flex-shrink-0 flex flex-col border-r border-white/10 overflow-hidden"
                            >
                                <ScrollArea className="flex-1">
                                    <div className="p-4 flex items-center gap-3 border-b border-border">
                                        <Avatar>
                                            <AvatarFallback>{user?.displayName?.substring(0,2) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <p className="font-semibold truncate text-sm">{user?.displayName || 'Utilisateur'}</p>
                                            <p className="text-xs text-muted-foreground">Pulse</p>
                                        </div>
                                    </div>
                                    <ProjectTracker 
                                        activeProject={activeProject} 
                                        setActiveProject={(p) => {setActiveProject(p); setView('welcome');}} 
                                        onProjectDeleted={onProjectDeleted} 
                                        projects={projects} 
                                        loading={loading}
                                        onCreateNew={() => {setActiveProject(null); setView('newProject');}}
                                     />
                                    <div className="my-2 h-px bg-border"/>
                                    <RecentActivityFeed docs={docs} loading={loading} />
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 min-w-0">
                       <MainContent />
                    </div>
                </div>
            </div>
        </div>
    );
}
