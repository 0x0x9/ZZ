
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateTextAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Copy, Send, Save, FileText as FileTextIcon } from 'lucide-react';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { uploadDocumentAction } from '@/app/actions';
import { useNotifications } from '@/hooks/use-notifications';
import type { GenerateTextOutput } from '@/ai/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Générer le texte" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full">
        <Send className="h-5 w-5" />
    </Button>
  );
}

function TextGeneratorFormBody({ state }: { 
    state: { message: string, result: GenerateTextOutput | null, error: string | null, id: number, prompt: string }
}) {
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [state.result, pending]);

  const handleCopy = () => {
    if (!state.result?.text) return;
    navigator.clipboard.writeText(state.result.text).then(() => {
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
        if (!state.result?.text) return;
        setIsSaving(true);
        try {
            const fileName = `texte-${state.prompt.substring(0, 25).replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'ia'}-${Date.now()}.txt`;
            const dataUri = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(state.result.text)))}`;
            
            await uploadDocumentAction({ name: fileName, content: dataUri, mimeType: 'text/plain' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
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
            <div ref={scrollAreaRef} className="h-full p-6 pt-0 space-y-4 overflow-y-auto relative z-10 no-scrollbar">
                {pending ? (
                    <div className="flex justify-center items-center h-full">
                        <LoadingState text="Rédaction en cours..." />
                    </div>
                ) : state.result?.text ? (
                    <div className="w-full">
                        <div className="w-fit max-w-[85%] mr-auto">
                            <div className="group relative p-4 rounded-2xl leading-relaxed break-words bg-muted text-foreground rounded-bl-none">
                                <p className="whitespace-pre-wrap">{state.result.text}</p>
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8"
                                        onClick={handleSaveToDrive}
                                        disabled={isSaving}
                                        aria-label="Sauvegarder sur (X)drive"
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8"
                                        onClick={handleCopy}
                                        aria-label="Copier le texte"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
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
                    defaultValue={state.prompt ?? ''}
                    disabled={pending}
                    onInput={(e) => {
                        const textarea = e.currentTarget;
                        textarea.style.height = 'auto';
                        textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                />
                <SubmitButton />
            </div>
        </div>
    </div>
  )
}

export default function TextGenerator({ initialResult, prompt }: { initialResult?: GenerateTextOutput, prompt?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptFromUrl = searchParams.get('prompt');
  
  const initialState = {
      message: initialResult ? 'success' : '',
      result: initialResult || null,
      error: null,
      id: 0,
      prompt: prompt || promptFromUrl || ''
  };
  
  const [state, formAction] = useFormState(generateTextAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: state.error,
      });
    }
    if (state.message === 'success' && state.result) {
        const resultId = `text-result-${state.id}`;
        const handleClick = () => {
            localStorage.setItem(resultId, JSON.stringify(state));
            router.push(`/text?resultId=${resultId}`);
        };
        addNotification({
            icon: FileTextIcon,
            title: "Texte généré !",
            description: `Votre texte pour "${state.prompt.substring(0, 30)}..." est prêt.`,
            onClick: handleClick
        });
        formRef.current?.reset();
    }
  }, [state, toast, addNotification, router]);

  return (
      <form ref={formRef} action={formAction} key={state.id}>
        <TextGeneratorFormBody state={state} />
      </form>
  );
}

    
