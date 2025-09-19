
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, isSameDay, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Sparkles, Trash2, Loader, Send, Brain, Link as LinkIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { type AgendaEvent } from '@/ai/types';

type Event = {
    id: string; 
    date: string; // 'yyyy-MM-dd'
    time: string; // 'HH:mm'
    title:string;
};

// This is a mock function. In a real app, this would be an API call.
const mockApi = {
    listEvents: async (): Promise<Event[]> => {
        // Simulate API delay
        await new Promise(res => setTimeout(res, 500));
        // Return some mock data if localStorage is empty
        const stored = localStorage.getItem('x-agenda-events');
        if (stored) return JSON.parse(stored);
        const today = format(new Date(), 'yyyy-MM-dd');
        return [
            { id: '1', title: 'Réunion de lancement projet', date: today, time: '10:00' },
            { id: '2', title: 'Brainstorming (X)flux', date: today, time: '14:30' },
        ];
    },
    createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
        await new Promise(res => setTimeout(res, 300));
        const newEvent = { ...event, id: Date.now().toString() };
        const stored = localStorage.getItem('x-agenda-events');
        const events = stored ? JSON.parse(stored) : [];
        const updatedEvents = [...events, newEvent];
        localStorage.setItem('x-agenda-events', JSON.stringify(updatedEvents));
        return newEvent;
    },
    deleteEvent: async (eventId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 300));
        const stored = localStorage.getItem('x-agenda-events');
        const events = stored ? JSON.parse(stored) : [];
        const updatedEvents = events.filter((e: Event) => e.id !== eventId);
        localStorage.setItem('x-agenda-events', JSON.stringify(updatedEvents));
    }
};

function SmartAddButton({ isPending }: { isPending: boolean }) {
    return (
        <Button type="submit" disabled={isPending} className="absolute top-1/2 right-3 -translate-y-1/2 h-10 px-4 rounded-full">
            {isPending ? (
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Ajouter
        </Button>
    );
}

function ManualAddButton({ isPending }: { isPending: boolean }) {
    return (
        <Button type="submit" disabled={isPending}>
            {isPending ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Send className="mr-2 h-4 w-4" />
            )}
            Enregistrer
        </Button>
    )
}

const SkeletonLoader = () => (
    <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
    </div>
);

const features = [
    {
        icon: Brain,
        title: "Analyse Intelligente",
        description: "(X)agenda comprend le langage naturel. Décrivez simplement vos rendez-vous et laissez l'IA les placer correctement dans votre emploi du temps."
    },
    {
        icon: LinkIcon,
        title: "Synchronisation Connectée",
        description: "Intégré à l'écosystème (X)yzz, votre agenda se synchronise avec les échéances de vos projets Maestro et les événements de votre équipe."
    },
    {
        icon: Eye,
        title: "Vue Claire et Épurée",
        description: "Une interface minimaliste qui vous permet de visualiser vos journées, semaines et mois en un clin d'œil, sans distractions."
    }
];

export default function AgendaClient() {
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const { toast } = useToast();

    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    // AI "Smart Add" form state
    const [isSmartAddPending, setIsSmartAddPending] = useState(false);
    const smartAddFormRef = useRef<HTMLFormElement>(null);
    const [smartAddPrompt, setSmartAddPrompt] = useState('');
    
    // Manual Add form state
    const manualAddFormRef = useRef<HTMLFormElement>(null);
    const [isManualAddPending, setIsManualAddPending] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const result = await mockApi.listEvents();
            setEvents(result);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de charger les événements." });
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCreateEvent = useCallback(async (eventData: Omit<Event, 'id'>) => {
        try {
            await mockApi.createEvent(eventData);
            toast({ title: 'Événement ajouté', description: `"${eventData.title}" a été ajouté à votre agenda.` });
            fetchEvents();
            const parsedDate = parse(eventData.date, 'yyyy-MM-dd', new Date());
            if (isValid(parsedDate)) {
                setSelectedDate(parsedDate);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        }
    }, [fetchEvents, toast]);

    const handleSmartAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smartAddPrompt.trim()) return;

        setIsSmartAddPending(true);
        try {
            const response = await fetch('/api/parseEvent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: smartAddPrompt, currentDate: new Date().toISOString() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }

            const result: AgendaEvent = await response.json();
            handleCreateEvent(result);
            setSmartAddPrompt('');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erreur IA', description: error.message });
        } finally {
            setIsSmartAddPending(false);
        }
    };


    const handleAddEventManually = async (formData: FormData) => {
        const title = formData.get('title') as string;
        const time = formData.get('time') as string;

        if (!title.trim() || !time.trim() || !selectedDate) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs.' });
            return;
        }

        const eventData = {
            title: title.trim(),
            date: format(selectedDate, 'yyyy-MM-dd'),
            time,
        };
        
        setIsManualAddPending(true);
        await handleCreateEvent(eventData);
        setIsManualAddPending(false);
        manualAddFormRef.current?.reset();
        document.getElementById('close-manual-add-dialog')?.click();
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        try {
            await mockApi.deleteEvent(eventToDelete.id);
            toast({ title: 'Événement supprimé' });
            fetchEvents();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setEventToDelete(null);
        }
    };

    const dailyEvents = events
        .filter(event => selectedDate && isValid(parse(event.date, 'yyyy-MM-dd', new Date())) && isSameDay(parse(event.date, 'yyyy-MM-dd', new Date()), selectedDate))
        .sort((a,b) => a.time.localeCompare(b.time));

    return (
        <div className="w-full space-y-16">
            <div className="grid md:grid-cols-3 gap-8 items-start w-full max-w-6xl mx-auto">
                <div className="md:col-span-2">
                    <Card className="glass-card min-h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                {selectedDate ? format(selectedDate, "eeee dd MMMM", { locale: fr }) : "Aucune date sélectionnée"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-4 md:p-6 pt-0">
                            {loading ? (
                                <SkeletonLoader />
                            ) : dailyEvents.length > 0 ? (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {dailyEvents.map((event) => (
                                            <motion.div
                                                key={event.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="group relative flex items-center gap-4 rounded-2xl p-4 bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                                                    <div className="flex flex-col items-center justify-center text-center w-16 p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                                                        <span className="text-3xl font-bold text-primary tracking-tighter">{event.time.split(':')[0]}</span>
                                                        <span className="text-sm font-medium text-primary/80 -mt-1">{event.time.split(':')[1]}</span>
                                                    </div>
                                                    <p className="font-semibold text-foreground flex-1">{event.title}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => setEventToDelete(event)}
                                                        aria-label="Supprimer l'événement"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center text-center py-16 h-full">
                                    <CalendarIcon className="h-16 w-16 text-muted-foreground/30" />
                                    <p className="mt-4 text-muted-foreground">Aucun événement pour ce jour.</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">Utilisez l'ajout intelligent ci-dessous ou le bouton manuel.</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-4 border-t border-white/10 mt-auto">
                            <form ref={smartAddFormRef} onSubmit={handleSmartAdd} className="relative w-full">
                                <Textarea
                                    name="prompt"
                                    placeholder="Ajout intelligent : “Rendez-vous dentiste demain 10h30”"
                                    rows={1}
                                    className="bg-transparent pr-[140px] resize-none py-3 text-base rounded-full"
                                    required
                                    value={smartAddPrompt}
                                    onChange={(e) => setSmartAddPrompt(e.target.value)}
                                />
                                <SmartAddButton isPending={isSmartAddPending} />
                            </form>
                        </CardFooter>
                    </Card>
                </div>

                <div className="md:col-span-1 space-y-4">
                    <Card className="glass-card p-0 md:p-2">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="w-full"
                            locale={fr}
                        />
                    </Card>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter un événement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card">
                            <form action={handleAddEventManually} ref={manualAddFormRef}>
                                <DialogHeader>
                                    <DialogTitle>Nouvel événement pour le {selectedDate ? format(selectedDate, "dd MMMM", { locale: fr }) : ''}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Input name="title" placeholder="Titre de l'événement" required />
                                    <Input name="time" type="time" required />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button id="close-manual-add-dialog" type="button" variant="ghost">Annuler</Button></DialogClose>
                                    <ManualAddButton isPending={isManualAddPending} />
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
                    <AlertDialogContent className="glass-card">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'événement "{eventToDelete?.title}" ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteEvent}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
