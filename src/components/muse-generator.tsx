
'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateMuse, copilotLyrics, uploadDocument } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Guitar, Music, Disc, Mic, User, ListMusic, Youtube, FilePenLine, Download, Save, Loader, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateMuseOutput } from '@/ai/types';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const moods = ['Mélancolique', 'Planant', 'Sombre', 'Festif', 'Épique', 'Intimiste'];
const tempos = ['Lent', 'Modéré', 'Rapide'];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <LoadingState text="Analyse en cours..." isCompact={true} />
      ) : (
        <>
          Trouver l'inspiration
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

function InspirationPanel({ result }: { result: GenerateMuseOutput }) {
    const handleYouTubeSearch = (query: string) => {
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.open(youtubeUrl, '_blank');
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card bg-background/50">
                <CardHeader>
                    <CardTitle className="text-xl">Votre Univers Musical</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2 text-primary"><Music className="h-5 w-5" /> Style Principal</h3>
                            <p className="text-xl font-bold">{result.mainStyle}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2 text-primary"><Disc className="h-5 w-5" /> Sous-genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.subGenres.map((genre, i) => (
                                    <div key={i} className="bg-primary/10 text-primary font-medium px-3 py-1 text-sm rounded-full">{genre}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-primary"><Mic className="h-5 w-5" /> Artistes Similaires</h3>
                        <div className="space-y-2">
                            {result.similarArtists.map((artist, i) => (
                                <div key={i} className="p-3 rounded-lg bg-background/30">
                                    <p className="font-bold flex items-center gap-2 text-sm"><User className="h-4 w-4"/> {artist.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1 italic">"{artist.reason}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {result.songSuggestions && result.songSuggestions.length > 0 && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-3 text-primary"><ListMusic className="h-5 w-5" /> Morceaux d'Inspiration</h3>
                            <div className="space-y-2">
                                {result.songSuggestions.map((song, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                                        <div>
                                            <p className="font-bold text-sm">{song.songTitle}</p>
                                            <p className="text-xs text-muted-foreground">{song.artist}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleYouTubeSearch(`${song.artist} ${song.songTitle}`)} title={`Rechercher ${song.songTitle} sur YouTube`}>
                                            <Youtube className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function WriterPanel({ 
    title, onTitleChange, 
    content, onContentChange,
    onCopilotRequest,
    isCopilotLoading,
    selection,
    onSelectionChange
}: { 
    title: string, onTitleChange: (t: string) => void,
    content: string, onContentChange: (c: string) => void,
    onCopilotRequest: (action: 'ENHANCE' | 'RHYMES') => void,
    isCopilotLoading: boolean,
    selection: { text: string; start: number; end: number } | null,
    onSelectionChange: (selection: { text: string; start: number; end: number } | null) => void
}) {
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const stats = useMemo(() => {
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const characters = content.length;
        return { words, characters };
    }, [content]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast({ variant: "destructive", description: "Le titre et le contenu sont requis." });
            return;
        }
        setIsSaving(true);
        try {
            const fileName = `${title.trim()}.txt`;
            const dataUri = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(content)))}`;
            await uploadDocument({ name: `muse-sessions/${fileName}`, content: dataUri, mimeType: 'text/plain' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erreur", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDownload = useCallback(() => {
        if (!content) {
            toast({ variant: "destructive", description: "Le document est vide." });
            return;
        }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_') || 'document'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [content, title, toast]);

    const handleMouseUp = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const { selectionStart, selectionEnd } = textarea;
            if (selectionStart !== selectionEnd) {
                const selectedText = textarea.value.substring(selectionStart, selectionEnd);
                onSelectionChange({ text: selectedText, start: selectionStart, end: selectionEnd });
            } else {
                onSelectionChange(null);
            }
        }
    };


    return (
        <Card className="glass-card h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <FilePenLine className="h-5 w-5 text-muted-foreground" />
                    <Input 
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="text-lg font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-1 h-auto"
                        placeholder="Titre de votre texte"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Télécharger (.txt)"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} aria-label="Enregistrer sur (X)cloud">
                        {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 relative">
                 {selection && (
                    <div className="absolute top-2 right-4 z-10 bg-background/80 backdrop-blur-md rounded-lg p-1 flex items-center gap-1 border border-border">
                        <Button variant="ghost" size="sm" onClick={() => onCopilotRequest('ENHANCE')} disabled={isCopilotLoading} className="flex items-center gap-2"><Wand2 className="h-4 w-4" />Améliorer</Button>
                        <Button variant="ghost" size="sm" onClick={() => onCopilotRequest('RHYMES')} disabled={isCopilotLoading} className="flex items-center gap-2"><ListMusic className="h-4 w-4" />Rimes</Button>
                    </div>
                 )}
                <Textarea
                    ref={textareaRef}
                    placeholder="Écrivez vos paroles, vos notes, vos idées..."
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    onMouseUp={handleMouseUp}
                    className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg p-6 md:p-8 font-serif leading-relaxed"
                />
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground justify-end gap-4">
                <span>Mots: {stats.words}</span>
                <span>Caractères: {stats.characters}</span>
            </CardFooter>
        </Card>
    );
}

function SuggestionDialog({ open, title, suggestions, onSelect, onOpenChange }: { open: boolean, title: string, suggestions: string[], onSelect: (suggestion: string) => void, onOpenChange: (open: boolean) => void }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass-card">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cliquez sur une suggestion pour l'insérer dans votre texte.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <ScrollArea className="max-h-[50vh] pr-4 -mr-4">
                    <div className="space-y-2 py-4">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => onSelect(suggestion)}
                                className="w-full text-left p-3 rounded-md bg-background/50 hover:bg-primary/10 transition-colors"
                            >
                                <p className="text-sm text-foreground">{suggestion}</p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function MuseGenerator() {
    const initialState = { result: null, error: null, theme: '', mood: 'Mélancolique', tempo: 'Modéré', references: '' };
    const [state, formAction] = useFormState(generateMuse, initialState);

    const initialCopilotState = { suggestions: [], error: null, action: undefined as ('ENHANCE' | 'RHYMES' | undefined) };
    const [copilotState, copilotAction] = useFormState(copilotLyrics, initialCopilotState);

    const [isCopilotLoading, setIsCopilotLoading] = useState(false);
    const [suggestionDialog, setSuggestionDialog] = useState<{ open: boolean, title: string, suggestions: string[] }>({ open: false, title: '', suggestions: [] });
    const [selection, setSelection] = useState<{ text: string; start: number; end: number} | null>(null);

    const [writerTitle, setWriterTitle] = useState('Nouveau Texte');
    const [writerContent, setWriterContent] = useState('');

    const formRef = useRef<HTMLFormElement>(null);

    const { toast } = useToast();
    const { pending: isMuseLoading } = useFormStatus();

    useEffect(() => {
        if (state.error) {
            toast({
                variant: 'destructive',
                title: 'Erreur (X)muse',
                description: state.error,
            });
        }
        if (state.result?.initialLyrics) {
            setWriterContent(state.result.initialLyrics);
            const newTitle = state.result.mainStyle ? `Texte - ${state.result.mainStyle}` : 'Nouveau Texte Inspiré';
            setWriterTitle(newTitle);
        }
    }, [state, toast]);

    useEffect(() => {
        setIsCopilotLoading(false);
        if (copilotState.suggestions && copilotState.suggestions.length > 0) {
            setSuggestionDialog({
                open: true,
                title: copilotState.action === 'ENHANCE' ? "Suggestions d'amélioration" : 'Suggestions de rimes',
                suggestions: copilotState.suggestions
            });
        } else if (copilotState.error) {
            toast({ variant: 'destructive', title: 'Erreur du copilote', description: copilotState.error });
        }
    }, [copilotState, toast]);

    const handleCopilotRequest = (action: 'ENHANCE' | 'RHYMES') => {
        if (!selection) {
            toast({ variant: "destructive", description: "Veuillez sélectionner du texte à modifier." });
            return;
        }
        
        setIsCopilotLoading(true);
        const formData = new FormData(formRef.current!);
        const copilotFormData = new FormData();
        copilotFormData.append('textToEdit', selection.text);
        copilotFormData.append('fullText', writerContent);
        copilotFormData.append('mood', formData.get('mood') as string || 'neutre');
        copilotFormData.append('action', action);
        
        copilotAction(copilotFormData);
    };

    const handleSuggestionSelect = (suggestion: string) => {
        if (!selection) return;
        const newContent = writerContent.substring(0, selection.start) + suggestion + writerContent.substring(selection.end);
        setWriterContent(newContent);
        setSuggestionDialog({ open: false, title: '', suggestions: [] });
        setSelection(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                <form ref={formRef} action={formAction}>
                     <Accordion type="single" collapsible defaultValue="inspiration-engine">
                        <AccordionItem value="inspiration-engine" className="border-none">
                            <Card className="glass-card">
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <Guitar className="h-7 w-7 text-primary" />
                                        <div>
                                            <CardTitle>Moteur d'Inspiration</CardTitle>
                                            <CardDescription>Décrivez votre vision artistique.</CardDescription>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-0">
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <div>
                                            <Label htmlFor="theme">Thème principal</Label>
                                            <Textarea id="theme" name="theme" placeholder="Ex: La solitude dans une grande ville..." rows={2} required className="mt-2 bg-transparent" minLength={5} disabled={isMuseLoading} defaultValue={state.theme ?? ''} />
                                        </div>
                                        <div>
                                            <Label>Ambiance souhaitée</Label>
                                            <RadioGroup name="mood" defaultValue={state.mood ?? "Mélancolique"} className="mt-2 grid grid-cols-2 gap-2">
                                                {moods.map(mood => (
                                                    <div key={mood} className="flex items-center space-x-2"><RadioGroupItem value={mood} id={`mood-${mood}`} /><Label htmlFor={`mood-${mood}`} className="font-normal text-sm">{mood}</Label></div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <Label>Tempo</Label>
                                            <RadioGroup name="tempo" defaultValue={state.tempo ?? "Modéré"} className="mt-2 flex gap-4">
                                                {tempos.map(tempo => (
                                                    <div key={tempo} className="flex items-center space-x-2"><RadioGroupItem value={tempo} id={`tempo-${tempo}`} /><Label htmlFor={`tempo-${tempo}`} className="font-normal text-sm">{tempo}</Label></div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <Label htmlFor="references">Références (Facultatif)</Label>
                                            <Input id="references" name="references" placeholder="Ex: L'univers de Blade Runner..." className="mt-2 bg-transparent" disabled={isMuseLoading} defaultValue={state.references ?? ''}/>
                                        </div>
                                    </div>
                                     <CardFooter className="px-0 pt-6"><SubmitButton /></CardFooter>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    </Accordion>
                </form>

                {isMuseLoading && (
                     <Card className="glass-card min-h-[300px] relative overflow-hidden">
                        <div className="absolute inset-0 z-0"><AiLoadingAnimation isLoading={true} /></div>
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <LoadingState text="(X)muse accorde sa guitare..." />
                        </div>
                    </Card>
                )}

                {!isMuseLoading && state.result && <InspirationPanel result={state.result} />}
            </div>

            <div className="lg:col-span-3 h-[85vh] sticky top-24">
                <WriterPanel
                    title={writerTitle}
                    onTitleChange={setWriterTitle}
                    content={writerContent}
                    onContentChange={setWriterContent}
                    onCopilotRequest={handleCopilotRequest}
                    isCopilotLoading={isCopilotLoading}
                    selection={selection}
                    onSelectionChange={setSelection}
                />
            </div>
             <SuggestionDialog 
                open={suggestionDialog.open}
                title={suggestionDialog.title}
                suggestions={suggestionDialog.suggestions}
                onSelect={handleSuggestionSelect}
                onOpenChange={(open) => setSuggestionDialog(prev => ({ ...prev, open }))}
            />
        </div>
    );
}
