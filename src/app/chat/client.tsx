
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, ArrowLeft, BrainCircuit, Trash2, PanelLeftOpen, PanelLeftClose, Sparkles, Loader, GitBranch, Share2, UploadCloud, Pencil, Plus, Presentation, FilePlus, Save, Home, CheckSquare, MessageCircle, Folder as FolderIcon, BookOpen, Layers, Lightbulb, Film, AudioLines, FileText, Music, LayoutTemplate, Code2, Network, Calendar, Guitar, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OriaHistoryMessage, ProjectPlan, Doc, GenerateFluxOutput } from '@/ai/types';
import { AnimatePresence, motion } from 'framer-motion';
import { oriaChatAction, deleteDocument, listDocuments, createManualProjectAction, pulseProjectAction, getSignedUrlAction, uploadDocumentAction } from '@/app/actions';
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
import OriaXOS from '@/components/oria-xos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProjectPlanSchema } from '@/ai/types';
import { ALL_APPS_CONFIG } from '@/lib/apps-config';
import { mockDocs } from '@/lib/mock-db';


type ActivityType = 'CREATED' | 'UPDATED' | 'SHARED' | 'DELETED' | 'GENERATED';

const actionInfoMap: Record<ActivityType, { text: string; icon: React.ElementType; color: string }> = {
    GENERATED: { text: 'génération', icon: Sparkles, color: 'text-purple-400' },
    CREATED: { text: 'création', icon: UploadCloud, color: 'text-green-400' },
    UPDATED: { text: 'modification', icon: Pencil, color: 'text-blue-400' },
    SHARED: { text: 'partage', icon: Share2, color: 'text-indigo-400' },
    DELETED: { text: 'suppression', icon: Trash2, color: 'text-red-400' }
};

type Activity = {
    id: string;
    type: ActivityType;
    doc: Doc;
    timestamp: Date;
};

type Project = {
    id: string;
    name: string;
    plan: ProjectPlan;
    path: string;
};


const RecentActivityFeed = ({ docs, loading }: { docs: Doc[], loading: boolean }) => {
    const activities = useMemo((): Activity[] => {
        if (!docs) return [];
        return docs
            .filter(doc => doc.updatedAt && !doc.mimeType.includes('directory'))
            .map(doc => {
                const isCreation = doc.createdAt && doc.updatedAt ? (new Date(doc.updatedAt).getTime() - new Date(doc.createdAt).getTime() < 2000) : false;
                const type: ActivityType = isCreation ? 'CREATED' : 'UPDATED';
                return { id: doc.id, type, doc, timestamp: new Date(doc.updatedAt!) };
            })
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);
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
        );
    }

    return (
        <div className="p-2 space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground mb-1">Activité Récente</h3>
            {activities.length > 0 ? (
                activities.map(activity => {
                    const action = actionInfoMap[activity.type];
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
            await deleteDocument({ docId: projectToDelete.id });
            toast({ title: "Projet supprimé", description: `"${projectToDelete.name}" a été supprimé.` });
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

function ManualProjectForm({ onProjectCreated, onCancel }: { onProjectCreated: () => void, onCancel: () => void }) {
    const { toast } = useToast();
    const [pending, setPending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        const formData = new FormData(e.currentTarget);
        const response = await createManualProjectAction({ success: false }, formData);

        if (response.success && response.project) {
            onProjectCreated();
        } else if (response.error) {
            toast({ variant: 'destructive', title: "Erreur", description: response.error });
        }
        setPending(false);
    };
    
    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-lg mt-8 space-y-4 text-left">
            <div className="space-y-2">
                <Label htmlFor="title">Titre du projet</Label>
                <Input id="title" name="title" placeholder="Ex: Lancement de ma chaîne YouTube" required disabled={pending} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="creativeBrief">Description / Brief Créatif</Label>
                <Textarea id="creativeBrief" name="creativeBrief" placeholder="Décrivez l'objectif principal et la vision de votre projet." rows={4} required disabled={pending} />
            </div>
            <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>Annuler</Button>
                <Button type="submit" disabled={pending} className="flex-1">
                    {pending ? <Loader className="animate-spin mr-2"/> : <FilePlus className="mr-2 h-4 w-4"/>}
                    {pending ? 'Création...' : 'Créer le projet'}
                </Button>
            </div>
        </form>
    );
}


function NewProjectView({ onProjectCreated, onCancel }: { onProjectCreated: () => void, onCancel: () => void}) {
    const [view, setView] = useState<'ai' | 'manual'>('ai');
    const { toast } = useToast();
    const [state, formAction] = useFormState(pulseProjectAction, { success: false, result: null, error: null, prompt: '' });
    const { pending } = useFormStatus();
    
    useEffect(() => {
        if (state.success) {
            onProjectCreated();
        } else if (state.error) {
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
                            <p className="mt-2 text-muted-foreground">Décrivez votre objectif et laissez Pulse générer un plan d'action.</p>
                            <form action={formAction} className="w-full max-w-lg mt-8 space-y-4">
                                <Textarea name="prompt" placeholder="Exemple : Je suis une artiste et je veux lancer une collection de NFT sur le thème de l'espace." rows={3} required minLength={15} className="bg-background/50 text-base text-center" disabled={pending} />
                                <Button type="submit" size="lg" disabled={pending} className="w-full">
                                    {pending ? <Loader className="animate-spin mr-2"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                    {pending ? 'Génération en cours...' : 'Lancer Pulse'}
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

function ProjectPlanView({ project, setProject }: { project: Project, setProject: (p: Project) => void }) {
    const categories = [...new Set(project.plan.tasks.map(task => task.category))];

    const handleChecklistChange = (taskIndex: number, itemIndex: number, checked: boolean) => {
        const updatedProject = JSON.parse(JSON.stringify(project)); // Deep copy
        updatedProject.plan.tasks[taskIndex].checklist[itemIndex].completed = checked;
        setProject(updatedProject);
    };
    
    const getToolIcon = (toolId?: string) => {
        if (!toolId) return Layers;
        const app = ALL_APPS_CONFIG.find(a => a.id === toolId);
        return app ? app.icon : Layers;
    };
    
    return (
        <ScrollArea className="h-full">
            <div className="p-4 md:p-6 space-y-8">
                {project.plan.creativeBrief && (
                     <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Brief Créatif
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                {project.plan.creativeBrief}
                            </blockquote>
                        </CardContent>
                    </Card>
                )}
                
                <div className="space-y-8">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <div className="space-y-4">
                                {project.plan.tasks.filter(t => t.category === category).map((task, taskIndex) => {
                                    const realTaskIndex = project.plan.tasks.findIndex(t => t.title === task.title && t.description === task.description);
                                    const ToolIcon = getToolIcon(task.toolId);
                                    return (
                                        <Card key={realTaskIndex} className="glass-card bg-background/30">
                                            <CardHeader className="flex flex-row items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-base">{task.title}</CardTitle>
                                                    <CardDescription>{task.description}</CardDescription>
                                                </div>
                                                 {task.toolId && (
                                                     <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                                                    <ToolIcon className="h-5 w-5 text-accent" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Lancer {task.toolId}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                 )}
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                {task.checklist.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                        <Checkbox
                                                            id={`task-${realTaskIndex}-item-${itemIndex}`}
                                                            checked={item.completed}
                                                            onCheckedChange={(checked) => handleChecklistChange(realTaskIndex, itemIndex, !!checked)}
                                                        />
                                                        <label htmlFor={`task-${realTaskIndex}-item-${itemIndex}`} className="text-sm text-foreground/90 has-[:checked]:line-through has-[:checked]:text-muted-foreground cursor-pointer flex-1">
                                                            {item.text}
                                                        </label>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    )
                                })}
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
    const { toast } = useToast();

    const handleDeleteProject = async () => {
        if (!activeProject || !activeProject.id) return;
        try {
            await deleteDocument({ docId: activeProject.id });
            toast({ title: "Projet supprimé", description: `"${activeProject.name}" a été supprimé.` });
            onProjectDeleted(activeProject.id);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erreur', description: 'La suppression du projet a échoué.' });
        }
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
                    <Link href="/" className="flex items-center">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Accueil
                        </Button>
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
             <MenubarMenu>
                <MenubarTrigger>Projet</MenubarTrigger>
                 <MenubarContent className="glass-card">
                    <MenubarItem onClick={onCreateNew}>Nouveau Projet <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
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

export default function PulseClient() {
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<Doc[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
        
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [view, setView] = useState<'welcome' | 'newProject'>('welcome');
    const [activeTab, setActiveTab] = useState('plan');
    
    const fetchDocsAndProjects = useCallback(async () => {
        setLoading(true);
        try {
            // Using mock data for now to ensure functionality
            const allDocs = mockDocs;
            setDocs(allDocs || []);

            const maestroDocs = allDocs.filter(doc => doc.mimeType === 'application/json' && doc.path.startsWith('maestro-projets/'));
            
            const parsedProjects: Project[] = [];
            for (const doc of maestroDocs) {
                try {
                    // This is a mock implementation. A real one would fetch the file content.
                    const mockPlan: ProjectPlan = {
                        id: doc.id,
                        title: doc.name.replace('.json', '').replace(/-/g, ' '),
                        creativeBrief: 'Ceci est un brief créatif simulé pour le projet ' + doc.name,
                        tasks: [],
                        imagePrompts: []
                    };
                    const validation = ProjectPlanSchema.safeParse(mockPlan);

                    if (validation.success) {
                       parsedProjects.push({
                           id: doc.id,
                           name: validation.data.title || doc.name.replace('.json', '').replace(/-/g, ' '),
                           plan: validation.data,
                           path: doc.path,
                       });
                    }
                } catch (e) {
                    console.error("Failed to parse project file:", doc.path, e);
                }
            }

            setProjects(parsedProjects);

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les projets.'});
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchDocsAndProjects();
    }, [fetchDocsAndProjects]);

    const onProjectDeleted = (deletedId: string) => {
        if (activeProject && activeProject.id === deletedId) {
            setActiveProject(null);
            setView('welcome');
        }
        fetchDocsAndProjects();
    };

    const handleProjectCreated = () => {
        fetchDocsAndProjects();
        setView('welcome');
        toast({ title: "Projet créé !", description: `Le projet a bien été initialisé dans (X)cloud.`})
    };
    
    const updateActiveProject = (updatedProject: Project) => {
        setActiveProject(updatedProject);
        setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
    }

    const handleSaveProject = async () => {
        if (!activeProject || !activeProject.plan) return;
        
        try {
            const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(activeProject.plan))))}`;
            await uploadDocumentAction({ name: activeProject.path, content: dataUri, mimeType: 'application/json' });
            toast({ title: 'Projet sauvegardé !', description: `Les modifications de "${activeProject.name}" ont été enregistrées.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur de sauvegarde", description: error.message });
        }
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
             <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-2xl font-bold truncate pr-4">{activeProject.name}</h2>
                    <TabsList>
                        <TabsTrigger value="plan"><CheckSquare className="mr-2 h-4 w-4" />Plan</TabsTrigger>
                        <TabsTrigger value="oria"><MessageCircle className="mr-2 h-4 w-4" />Oria</TabsTrigger>
                        <TabsTrigger value="files"><FolderIcon className="mr-2 h-4 w-4" />Fichiers</TabsTrigger>
                    </TabsList>
                </div>
                 <TabsContent value="plan" className="flex-1 min-h-0 mt-0">
                    <ProjectPlanView project={activeProject} setProject={updateActiveProject} />
                </TabsContent>
                <TabsContent value="oria" className="flex-1 min-h-0 mt-0">
                    <div className="h-full p-4">
                        <OriaXOS 
                          context={`Projet Actif: ${activeProject.name}\nBrief: ${activeProject.plan.creativeBrief}`}
                          openApp={() => {}} 
                        />
                    </div>
                </TabsContent>
                <TabsContent value="files" className="flex-1 min-h-0 mt-0">
                    <DocManager onDataChange={fetchDocsAndProjects} initialPath={`maestro-projets/${activeProject.name.replace(/\s+/g, '-')}/`} />
                </TabsContent>
            </Tabs>
        )
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col glass-card p-0">
                <TopMenuBar 
                    activeProject={activeProject} 
                    onCreateNew={() => {setActiveProject(null); setView('newProject');}}
                    onProjectDeleted={onProjectDeleted} 
                    onSaveProject={handleSaveProject}
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
                                        setActiveProject={(p) => {setActiveProject(p); setView('welcome'); setActiveTab('plan');}} 
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

    