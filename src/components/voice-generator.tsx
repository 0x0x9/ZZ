
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateVoice, uploadDocument } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Mic, Volume2, Save, AudioLines } from 'lucide-react';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { useNotifications } from '@/hooks/use-notifications';
import type { GenerateVoiceOutput } from '@/ai/types';

const voices = [
  { id: 'Algenib', name: 'Algenib', description: 'Voix masculine, calme et posée' },
  { id: 'Achernar', name: 'Achernar', description: 'Voix masculine, claire et dynamique' },
  { id: 'Capella', name: 'Capella', description: 'Voix féminine, chaleureuse et engageante' },
  { id: 'Spica', name: 'Spica', description: 'Voix féminine, douce et professionnelle' },
  { id: 'Sirius', name: 'Sirius', description: 'Voix masculine, grave et autoritaire' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <LoadingState text="Génération en cours..." isCompact={true} />
      ) : (
        <>
          Générer la voix
          <Sparkles className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function VoiceGeneratorFormBody({ state }: { state: { result: GenerateVoiceOutput | null, error: string | null, text: string, voice: string } }) {
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveToDrive = async () => {
    if (!state.result?.audioDataUri) return;
    setIsSaving(true);
    try {
        const fileName = `voice-${Date.now()}.wav`;
        await uploadDocument({ name: fileName, content: state.result.audioDataUri, mimeType: 'audio/wav' });
        toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mic className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Configuration de la Voix</CardTitle>
                <CardDescription>
                  Entrez votre texte, choisissez une voix, et écoutez la magie.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="text">Texte à transformer</Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Écrivez votre texte ici..."
                    rows={8}
                    required
                    className="mt-2 bg-transparent text-base"
                    minLength={1}
                    defaultValue={state.text ?? ""}
                    disabled={pending}
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="voice">Choix de la voix</Label>
                    <Select name="voice" defaultValue={state.voice ?? 'Algenib'} required disabled={pending}>
                      <SelectTrigger id="voice" className="mt-2">
                        <SelectValue placeholder="Sélectionnez une voix" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex flex-col py-1">
                              <span className="font-medium">{voice.name}</span>
                              <span className="text-xs text-muted-foreground">{voice.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="pt-2">
                       <SubmitButton />
                   </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">Résultat Audio</h3>
                      </div>
                    </div>
                     {state.result?.audioDataUri && (
                        <Button onClick={handleSaveToDrive} disabled={isSaving} variant="outline" size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                    )}
                </div>
                <div className="relative flex items-center justify-center w-full min-h-[10rem] bg-black/10 rounded-xl p-4 overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <AiLoadingAnimation isLoading={pending} />
                  </div>
                  {pending ? (
                    <LoadingState text="Synthèse vocale en cours..." />
                  ) : state.result?.audioDataUri ? (
                    <audio controls src={state.result.audioDataUri} className="relative z-10 w-full">
                      Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center h-full text-muted-foreground text-center">
                      <p>Votre audio généré attend.</p>
                    </div>
                  )}
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
  );
}


export default function VoiceGenerator({ initialText, initialAudioDataUri, prompt }: { initialText?: string, initialAudioDataUri?: string, prompt?: string }) {
  const router = useRouter();
  const initialState: { result: GenerateVoiceOutput | null, error: string | null, text: string, voice: string } = {
      result: initialAudioDataUri ? { audioDataUri: initialAudioDataUri } : null,
      error: null,
      text: initialText || prompt || '',
      voice: 'Algenib'
  };
  
  const [state, formAction] = useFormState(generateVoice, initialState);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: state.error,
      });
    }
     if (state.result?.audioDataUri) {
        const resultId = `voice-result-${Math.random()}`;
        const handleClick = () => {
            localStorage.setItem(resultId, JSON.stringify(state));
            router.push(`/xos?open=voice&resultId=${resultId}`);
        };
        addNotification({
            icon: AudioLines,
            title: "Voix générée !",
            description: `Votre audio pour "${state.text.substring(0, 30)}..." est prêt.`,
        });
    }
  }, [state, toast, addNotification, router]);

  return (
      <form action={formAction}>
        <VoiceGeneratorFormBody state={state} />
      </form>
  );
}
