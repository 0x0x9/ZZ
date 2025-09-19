
'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowRight, Copy, ZoomIn, Download, BadgeCheck, BadgeX, TerminalSquare, RotateCcw, Presentation, LayoutTemplate, Music, Wand2, Users, Film, Network, Lightbulb, FileText, Palette, Mic, AudioLines, Code2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import AiLoadingAnimation from '@/components/ui/ai-loading-animation';
import { useFusionDock } from '@/hooks/use-fusion-dock';
import type { OriaChatOutput, GenerateImageOutput, GeneratePaletteOutput, GenerateToneOutput, GenerateCodeOutput, GenerateTextOutput, GenerateVoiceOutput, GenerateDeckOutput, GenerateFrameOutput, GenerateSoundOutput, GenerateFluxOutput, GenerateMotionOutput, GenerateNexusOutput, GenerateIdeasOutput, GeneratePersonaOutput, OriaHistoryMessage } from '@/ai/types';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription } from './ui/alert-dialog';
import OriaAnimation from './ui/oria-animation';
import { runFlow } from '@genkit-ai/next/client';
import { oria } from '@/app/api/oria/route';

type Message = {
    id: number;
    type: 'user' | 'oria';
    text?: string;
    result?: OriaChatOutput;
};

const toolInfoMap = {
    text: { icon: FileText, name: 'Générateur de Texte' },
    palette: { icon: Palette, name: '(X)palette' },
    tone: { icon: Mic, name: '(X)tone' },
    persona: { icon: Users, name: '(X)persona' },
    promptor: { icon: Lightbulb, name: '(X)promptor' },
    motion: { icon: Film, name: '(X)motion' },
    voice: { icon: AudioLines, name: '(X)voice' },
    code: { icon: Code2, name: '(X)code' },
    deck: { icon: Presentation, name: '(X)deck' },
    frame: { icon: LayoutTemplate, name: '(X)frame' },
    sound: { icon: Music, name: '(X)sound' },
    flux: { icon: Wand2, name: '(X)flux' },
    nexus: { icon: Network, name: '(X)nexus' },
};

// Component to render specific tool results
const OriaResultDisplay = ({ result }: { result: OriaChatOutput }) => {
    const router = useRouter();
    const { loadTools } = useFusionDock();
    const { toast } = useToast();
    const [showToolCard, setShowToolCard] = useState(result.type === 'tool_result');

    useEffect(() => {
        if (result.type === 'tool_result') {
            setShowToolCard(true);
            const timer = setTimeout(() => {
                setShowToolCard(false);
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [result]);

    if (showToolCard && result.type === 'tool_result') {
        const tool = toolInfoMap[result.tool as keyof typeof toolInfoMap];
        return (
            <div className="p-4 glass-card bg-background/80 border-border/50 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                    {tool?.icon && <tool.icon className="h-6 w-6 text-primary" />}
                    <div>
                        <p className="text-sm text-muted-foreground">Oria utilise l'outil...</p>
                        <p className="font-semibold">{tool?.name || result.tool}</p>
                    </div>
                </div>
                <div className="relative h-1 w-full bg-primary/20 rounded-full mt-3 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary animate-tool-progress"></div>
                </div>
            </div>
        );
    }

    const handleRedirection = (tool: string, promptForTool?: string, data?: any) => {
        const params = new URLSearchParams();
        
        if (tool === 'flux' && data) {
             const resultId = `flux-result-${Date.now()}`;
             const dataToStore = { result: data, prompt: promptForTool };
             localStorage.setItem(resultId, JSON.stringify(dataToStore));
             params.set('resultId', resultId);
             router.push(`/flux?${params.toString()}`);
        } else if (data) {
             const resultId = `result-${Date.now()}`;
             localStorage.setItem(resultId, JSON.stringify({ result: data, prompt: promptForTool }));
             params.set('resultId', resultId);
             router.push(`/${tool}?${params.toString()}`);
        } else if (tool === 'fusion') {
            loadTools(promptForTool || '');
        } else {
             if (promptForTool) params.set('prompt', promptForTool);
             router.push(`/${tool}?${params.toString()}`);
        }
    };
    
    const handleCopy = (textToCopy: string, description: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({ description: `${description} copié.` });
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de copier.' });
        });
    };
    
    const handleDownload = (dataUri: string, filename: string) => {
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    switch (result.type) {
        case 'response':
            return <p>{result.response}</p>;

        case 'redirect':
            return (
                <div className='space-y-3'>
                    <p>{result.response}</p>
                    <Button
                        onClick={() => handleRedirection(result.tool, result.promptForTool, result.data)}
                        variant="ghost"
                        className={cn("w-full h-auto justify-start p-3 rounded-lg text-left text-foreground", result.tool === 'fusion' ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x font-semibold text-primary-foreground hover:opacity-95" : "bg-background/80 hover:bg-accent border")}
                    >
                        <span className="flex-1">{result.tool === 'fusion' ? 'Préparer mon espace (X)fusion' : `Lancer l'outil : ${result.tool}`}</span>
                        <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                </div>
            );

        case 'tool_result':
            const { tool, data } = result;
            return (
                <div className='space-y-3'>
                    <p>{result.response}</p>
                    <div className="p-4 rounded-xl bg-background/50 dark:bg-black/50 backdrop-blur-2xl border border-white/20 shadow-inner">
                    {(() => {
                        if (tool === 'flux') {
                            const fluxData = data as GenerateFluxOutput;
                            return (
                                <div className="space-y-2 text-sm">
                                    <h4 className="font-semibold flex items-center gap-2"><Wand2 className="h-4 w-4" /> Projet complexe généré</h4>
                                    <p className="text-muted-foreground">Plusieurs livrables ont été créés pour votre projet.</p>
                                    <Button onClick={() => handleRedirection('flux', result.promptForTool, fluxData)} size="sm" className="w-full !mt-3 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x font-semibold text-white hover:opacity-95">
                                        Voir le projet complet
                                        <ArrowRight className="ml-auto h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        }

                        switch (tool) {
                            case 'image':
                                const imageData = data as GenerateImageOutput;
                                return (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <div className="relative group aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                                <Image src={imageData.imageDataUri} alt="Image générée par Oria" fill sizes="100vw" className="object-cover" />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn className="h-10 w-10 text-white" /></div>
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-3xl p-2 glass-card">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Image Agrandie</AlertDialogTitle>
                                                <AlertDialogDescription className="sr-only">
                                                    Version agrandie de l'image générée. Vous pouvez la télécharger ou fermer cette vue.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="relative">
                                                <Image src={imageData.imageDataUri} alt="Image générée par Oria" width={1024} height={1024} className="rounded-md w-full h-auto object-contain max-h-[80vh]" />
                                                <Button type="button" size="icon" variant="secondary" className="absolute top-4 right-4" onClick={() => handleDownload(imageData.imageDataUri, `oria-image-${Date.now()}.png`)}><Download/></Button>
                                            </div>
                                            <AlertDialogFooter className="p-2 border-t-0"><AlertDialogAction>Fermer</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            case 'text':
                                const textData = data as GenerateTextOutput;
                                return <p className="whitespace-pre-wrap">{textData.text}</p>;
                            case 'palette':
                                const paletteData = data as GeneratePaletteOutput;
                                return (<div className="space-y-3">
                                    <h4 className="font-semibold">{paletteData.paletteName}</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {paletteData.palette.map((c, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <div 
                                                    className="aspect-square rounded-md w-full border border-white/10" 
                                                    style={{backgroundColor: c.hex}} 
                                                />
                                                <div className="group relative text-center">
                                                    <p className="text-xs font-medium truncate">{c.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{c.hex}</p>
                                                    <Button 
                                                        type="button"
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="absolute top-1/2 -right-2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40" 
                                                        onClick={() => handleCopy(c.hex, 'Code couleur')}>
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>);
                            case 'tone':
                                const toneData = data as GenerateToneOutput;
                                return (<div className="space-y-4 text-sm">
                                    <div className="flex flex-wrap gap-2">{toneData.adjectives.map((adj, i) => <div key={i} className="bg-primary/20 text-primary font-medium px-3 py-1 rounded-full text-xs">{adj}</div>)}</div>
                                    <div><h5 className="font-semibold flex items-center gap-2 mb-1"><BadgeCheck className="h-4 w-4 text-green-400" /> À faire</h5><ul className="list-disc list-inside space-y-1"> {toneData.dos.map((d,i) => <li key={i}>{d}</li>)}</ul></div>
                                    <div><h5 className="font-semibold flex items-center gap-2 mb-1"><BadgeX className="h-4 w-4 text-red-400" /> À ne pas faire</h5><ul className="list-disc list-inside space-y-1"> {toneData.donts.map((d,i) => <li key={i}>{d}</li>)}</ul></div>
                                </div>);
                            case 'voice':
                                const voiceData = data as GenerateVoiceOutput;
                                return <audio controls src={voiceData.audioDataUri} className="w-full" />;
                            case 'sound':
                                const soundData = data as GenerateSoundOutput;
                                return (
                                    <div className="space-y-2">
                                        <p className="text-sm italic text-muted-foreground">"{soundData.description}"</p>
                                        <audio controls src={soundData.audioDataUri} className="w-full" />
                                    </div>
                                );
                            case 'code':
                                const codeData = data as GenerateCodeOutput;
                                const parseCodeFromMarkdown = (markdown: string): { language: string | null; code: string } => {
                                    const codeBlockRegex = /```(\w*)\n([\s\S]+)```/;
                                    const match = markdown.match(codeBlockRegex);
                                    if (match) {
                                        return { language: match[1] || 'plaintext', code: match[2].trim() };
                                    }
                                    return { language: 'plaintext', code: markdown.trim() };
                                };
                            
                                const { language, code: cleanCode } = parseCodeFromMarkdown(codeData.code);
                                const editorUrl = language && language !== 'plaintext' ? `/editor?language=${encodeURIComponent(language)}&code=${encodeURIComponent(btoa(unescape(encodeURIComponent(cleanCode))))}&encoding=base64` : null;
                                
                                return (<div className="space-y-2 text-xs">
                                    <p className="text-muted-foreground">{codeData.explanation}</p>
                                    <div className="relative group">
                                      <pre className="bg-black/50 p-3 rounded-md overflow-x-auto text-foreground"><code>{cleanCode}</code></pre>
                                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editorUrl && (
                                            <Button asChild variant="ghost" size="icon" className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white" title="Ouvrir dans (X).alpha">
                                                <Link href={editorUrl}><TerminalSquare className="h-4 w-4" /></Link>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/40 hover:bg-black/60 text-white" onClick={() => handleCopy(cleanCode, 'Code')} title="Copier le code">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                </div>);
                            default:
                                return <p className='text-sm italic'>Le résultat de cet outil ne peut pas être affiché ici.</p>;
                        }
                    })()}
                    </div>
                </div>
            );
        default:
             return <p>Désolé, une erreur est survenue.</p>;
    }
}

function OriaChatUI({ messages, handleReset, formRef }: { messages: Message[], handleReset: () => void, formRef: React.RefObject<HTMLFormElement> }) {
    const [pending, setPending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const showWelcomeOverlay = !pending && messages.length === 0;

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, pending]);

    return (
        <div className="relative glass-card w-full max-w-4xl min-h-[60vh] mx-auto overflow-hidden p-0 flex flex-col">
            <div className="absolute inset-0 z-0">
                 <AiLoadingAnimation isLoading={pending} />
            </div>
            
             <div
                className={cn(
                "absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 transition-opacity duration-500",
                !showWelcomeOverlay && "opacity-0 pointer-events-none"
                )}
            >
                <OriaAnimation className="w-24 h-24 mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-br dark:from-white/90 dark:to-white/40">
                    Bonjour, je suis Oria.
                </h1>
                <p className="mt-2 max-w-xl text-base md:text-lg text-muted-foreground">
                    Que souhaitez-vous créer aujourd'hui ?
                </p>
            </div>
    
            <div
                ref={scrollAreaRef}
                className="flex-1 p-6 space-y-4 overflow-y-auto relative z-10 no-scrollbar"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                        "w-fit max-w-[90%] md:max-w-[80%] animate-in fade-in slide-in-from-bottom-4 duration-300",
                        msg.type === 'user' ? 'ml-auto' : 'mr-auto'
                    )}>
                        <div className={cn("p-3 rounded-2xl leading-relaxed break-words", msg.type === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-background/80 dark:bg-muted backdrop-blur-xl border border-border/30 text-foreground rounded-bl-none")}>
                            {msg.type === 'user' && msg.text}
                            {msg.type === 'oria' && (msg.result ? <OriaResultDisplay result={msg.result} /> : <p>{msg.text}</p>)}
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="relative z-10 p-4 border-t border-white/10 shrink-0">
                <div className="relative">
                    <Textarea
                        name="prompt"
                        placeholder="Décrivez votre idée, demandez un conseil..."
                        className="w-full bg-background/50 dark:bg-black/20 border-white/20 focus-visible:ring-primary/50 text-sm placeholder:text-muted-foreground resize-none rounded-2xl pl-4 pr-24 py-3 min-h-[48px] no-scrollbar max-h-40"
                        autoComplete="off"
                        disabled={pending}
                        required
                        rows={1}
                        onInput={(e) => {
                            const textarea = e.currentTarget;
                            textarea.style.height = 'auto';
                            textarea.style.height = `${textarea.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (e.currentTarget.value.trim()) {
                                    formRef.current?.requestSubmit();
                                }
                            }
                        }}
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleReset}
                            aria-label="Réinitialiser la conversation"
                            className={cn(
                                "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-opacity duration-300 ease-in-out",
                                (messages.length === 0 || pending) && "opacity-0 pointer-events-none"
                            )}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button type="submit" size="icon" disabled={pending} aria-label="Envoyer" className="w-8 h-8 rounded-full shrink-0">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomepageOriaChat() {
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleReset = () => {
    setMessages([]);
  };

  const handleSubmit = async (formData: FormData) => {
      const prompt = formData.get('prompt') as string;
      if (!prompt.trim()) return;

      setIsLoading(true);
      const userMessage: Message = { id: Date.now(), type: 'user', text: prompt };
      setMessages(prev => [...prev, userMessage]);
      formRef.current?.reset();
      
      try {
          const history: OriaHistoryMessage[] = [...messages, userMessage]
            .slice(-10)
            .map(msg => ({
                role: msg.type === 'user' ? 'user' : 'model',
                content: msg.type === 'user' ? (msg.text || '') : (msg.result ? JSON.stringify(msg.result) : (msg.text || '')),
            }))
            .filter(msg => msg.content && msg.content.trim() !== '');

        const result = await runFlow(oria, { prompt, history, context: 'homepage' });

        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'oria', result }]);
      } catch (e: any) {
        let errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
        if (e.message && (e.message.includes('quota') || e.message.includes('rate-limit'))) {
            errorMessage = "Désolé, le quota de l'API a été atteint. Veuillez réessayer plus tard ou vérifier votre clé d'API Google.";
        }
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'oria', text: errorMessage }]);
        toast({variant: 'destructive', title: 'Erreur Oria', description: errorMessage})
      } finally {
        setIsLoading(false);
      }
  };


  return (
    <form ref={formRef} action={handleSubmit}>
        <OriaChatUI messages={messages} handleReset={handleReset} formRef={formRef} />
    </form>
  );
}
