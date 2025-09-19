
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { uploadDocument as uploadDocumentAction } from '@/app/actions';

const voices = [
  { id: 'Algenib', name: 'Algenib', description: 'Voix masculine, calme et posée' },
  { id: 'Achernar', name: 'Achernar', description: 'Voix masculine, claire et dynamique' },
  { id: 'Capella', name: 'Capella', description: 'Voix féminine, chaleureuse et engageante' },
  { id: 'Spica', name: 'Spica', description: 'Voix féminine, douce et professionnelle' },
  { id: 'Sirius', name: 'Sirius', description: 'Voix masculine, grave et autoritaire' },
];

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
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

function VoiceGeneratorFormBody({ text, setText, voice, setVoice, result, isLoading, isSaving, handleSaveToDrive }: { 
    text: string; setText: (s: string) => void;
    voice: string; setVoice: (s: string) => void;
    result: GenerateVoiceOutput | null;
    isLoading: boolean;
    isSaving: boolean;
    handleSaveToDrive: () => void;
}) {
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
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="voice">Choix de la voix</Label>
                    <Select name="voice" value={voice} onValueChange={setVoice} required disabled={isLoading}>
                      <SelectTrigger id="voice" className="mt-2">
                        <SelectValue placeholder="Sélectionnez une voix" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            <div className="flex flex-col py-1">
                              <span className="font-medium">{v.name}</span>
                              <span className="text-xs text-muted-foreground">{v.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="pt-2">
                       <SubmitButton isLoading={isLoading} />
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
                     {result?.audioDataUri && (
                        <Button onClick={handleSaveToDrive} disabled={isSaving} variant="outline" size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                    )}
                </div>
                <div className="relative flex items-center justify-center w-full min-h-[10rem] bg-black/10 rounded-xl p-4 overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <AiLoadingAnimation isLoading={isLoading} />
                  </div>
                  {isLoading ? (
                    <LoadingState text="Synthèse vocale en cours..." />
                  ) : result?.audioDataUri ? (
                    <audio controls src={result.audioDataUri} className="relative z-10 w-full">
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
  
  const [result, setResult] = useState<GenerateVoiceOutput | null>(initialAudioDataUri ? { audioDataUri: initialAudioDataUri } : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [text, setText] = useState(initialText || prompt || '');
  const [voice, setVoice] = useState('Algenib');

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
        toast({ variant: 'destructive', description: "Le texte ne peut pas être vide." });
        return;
    }

    setIsLoading(true);
    setResult(null);

    try {
        const response = await fetch('/api/generateVoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voice }),
        });
        if (!response.ok) throw new Error((await response.json()).error);
        const data: GenerateVoiceOutput = await response.json();

        setResult(data);
        addNotification({
            icon: AudioLines,
            title: "Voix générée !",
            description: `Votre audio pour "${text.substring(0, 30)}..." est prêt.`,
        });
    } catch(error: any) {
        toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSaveToDrive = async () => {
    if (!result?.audioDataUri) return;
    setIsSaving(true);
    try {
        const fileName = `voice-${Date.now()}.wav`;
        await uploadDocumentAction({ name: fileName, content: result.audioDataUri, mimeType: 'audio/wav' });
        toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)cloud.` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
    } finally {
        setIsSaving(false);
    }
  };


  return (
      <form onSubmit={handleSubmit}>
        <VoiceGeneratorFormBody
            text={text} setText={setText}
            voice={voice} setVoice={setVoice}
            result={result}
            isLoading={isLoading}
            isSaving={isSaving}
            handleSaveToDrive={handleSaveToDrive}
        />
      </form>
  );
}
