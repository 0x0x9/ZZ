
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Copy, Send, Save, FileText as FileTextIcon } from 'lucide-react';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { useNotifications } from '@/hooks/use-notifications';
import type { GenerateTextOutput } from '@/ai/types';
import { runFlow } from '@genkit-ai/next/client';
import { generateContent } from '@/app/api/content-generator/route';
import { uploadDocument } from '@/app/actions';

function SubmitButton() {
    const [isLoading, setIsLoading] = useState(false);
  return (
    <Button type="submit" size="icon" disabled={isLoading} aria-label="Générer le texte" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full">
        <Send className="h-5 w-5" />
    </Button>
  );
}

export default function TextGenerator({ initialResult, prompt: promptProp }: { initialResult?: GenerateTextOutput, prompt?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptFromUrl = searchParams.get('prompt');
  
  const [result, setResult] = useState<GenerateTextOutput | null>(initialResult || null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(promptProp || promptFromUrl || '');
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (initialResult) {
        setResult(initialResult);
    }
  }, [initialResult]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
        toast({ variant: 'destructive', description: "Veuillez entrer un prompt." });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
        const response = await runFlow(generateContent, { contentType: 'text', prompt });
        if (response.type === 'text') {
            const textResult = { text: response.data as string };
            setResult(textResult);
            const resultId = `text-result-${Date.now()}`;
            localStorage.setItem(resultId, JSON.stringify({ result: textResult, prompt }));
            addNotification({
                icon: FileTextIcon,
                title: "Texte généré !",
                description: `Votre texte pour "${prompt.substring(0, 30)}..." est prêt.`,
                onClick: () => router.push(`/text?resultId=${resultId}`)
            });
            formRef.current?.reset();
        } else {
            throw new Error("L'IA n'a pas retourné de texte valide.");
        }
    } catch(error: any) {
        toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } finally {
        setIsLoading(false);
    }
  }


  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text).then(() => {
      toast({
        description: "Texte copié dans le presse-papiers.",
      });
    }).catch(err => {
      console.error('Échec de la copie :', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de copier le texte.',
      });
    });
  };
  
  const handleSaveToDrive = async () => {
        if (!result?.text) return;
        try {
            const fileName = `texte-${prompt.substring(0, 25).replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'ia'}-${Date.now()}.txt`;
            const dataUri = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(result.text)))}`;
            
            await uploadDocument({ name: fileName, content: dataUri, mimeType: 'text/plain' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        }
    };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="glass-card w-full max-w-4xl min-h-[70vh] mx-auto overflow-hidden p-0 flex flex-col">
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <AiLoadingAnimation isLoading={isLoading} />
                </div>
                <div className="h-full p-6 pt-0 space-y-4 overflow-y-auto relative z-10 no-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <LoadingState text="Rédaction en cours..." />
                        </div>
                    ) : result?.text ? (
                        <div className="w-full pt-6">
                            <div className="w-full max-w-full mr-auto">
                                <div className="group relative p-4 rounded-2xl leading-relaxed break-words bg-muted text-foreground rounded-bl-none">
                                    <p className="whitespace-pre-wrap">{result.text}</p>
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={handleSaveToDrive} aria-label="Sauvegarder sur (X)drive"><Save className="h-4 w-4" /></Button>
                                        <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={handleCopy} aria-label="Copier le texte"><Copy className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full text-center">
                            <Bot className="mx-auto h-16 w-16 text-muted-foreground/30" />
                            <p className="mt-4 text-lg text-muted-foreground">Le texte que vous allez générer apparaîtra ici.</p>
                        </div>
                    )}
                </div>
            </div>
          
            <div className="relative z-10 p-4 md:p-6 border-t border-white/10 shrink-0">
                <div className="relative">
                    <Textarea
                        name="prompt"
                        placeholder="Ex : Écrivez une nouvelle sur un robot qui découvre la musique..."
                        rows={1}
                        required
                        className="flex-1 h-14 pl-6 pr-16 text-base rounded-full bg-background/50 border-border focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
                        minLength={10}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                    />
                    <SubmitButton />
                </div>
            </div>
        </div>
    </form>
  );
}
