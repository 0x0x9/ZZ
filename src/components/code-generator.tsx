
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Code2, Copy, FileText, TerminalSquare, Save, X } from 'lucide-react';
import type { GenerateCodeOutput } from '@/ai/types';
import Link from 'next/link';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { useNotifications } from '@/hooks/use-notifications';
import { uploadDocument } from '@/app/actions';

const languages = [
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'tsx', name: 'React (TSX)' },
    { id: 'python', name: 'Python' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'sql', name: 'SQL' },
];

const langToFileExtension: { [key: string]: string } = {
    typescript: 'ts',
    javascript: 'js',
    tsx: 'tsx',
    python: 'py',
    html: 'html',
    css: 'css',
    sql: 'sql',
};


function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <LoadingState text="Génération du code..." isCompact={true} />
        </>
      ) : (
        <>
          Générer le code
          <Sparkles className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function ResultsDisplay({ result, language }: { result: GenerateCodeOutput, language: string }) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const extractCodeFromMarkdown = (markdown: string): string => {
        const codeBlockRegex = /```(?:\w+)?\n([\s\S]+)```/;
        const match = markdown.match(codeBlockRegex);
        return match ? match[1].trim() : markdown.trim();
    };
    
    const cleanCode = extractCodeFromMarkdown(result.code);

    const handleCopy = () => {
        navigator.clipboard.writeText(cleanCode).then(() => {
            toast({ description: "Code copié dans le presse-papiers." });
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de copier.' });
        });
    };
    
    const handleSaveToDrive = async () => {
        setIsSaving(true);
        try {
            const fileExtension = langToFileExtension[language] || 'txt';
            const fileName = `code-snippet-${Date.now()}.${fileExtension}`;
            const dataUri = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(cleanCode)))}`;
            
            await uploadDocument({ name: fileName, content: dataUri, mimeType: 'text/plain' });
            toast({ title: 'Succès', description: `"${fileName}" a été enregistré sur (X)drive.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'enregistrement", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const editorUrl = `/editor?language=${encodeURIComponent(language)}&code=${encodeURIComponent(btoa(unescape(encodeURIComponent(cleanCode))))}&encoding=base64`;

    return (
        <div className="mt-8 space-y-8">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Explication</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Code2 className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Code Généré</CardTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleSaveToDrive} variant="outline" size="sm" disabled={isSaving}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
                        <Button asChild variant="outline" size="sm">
                           <Link href={editorUrl}>
                                <TerminalSquare className="h-4 w-4 mr-2" />
                                Tester dans (X).alpha
                           </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copier le code">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto">
                        <code className="text-sm font-code">{cleanCode}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}

function CodeGeneratorFormBody({ prompt, setPrompt, language, setLanguage }: {
    prompt: string; setPrompt: (s:string) => void;
    language: string; setLanguage: (s:string) => void;
}) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Code2 className="h-7 w-7 text-primary" />
                            <div>
                                <CardTitle>Votre requête</CardTitle>
                                <CardDescription>
                                    Décrivez la fonction, le composant ou le snippet que vous souhaitez.
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="prompt">Description</Label>
                            <Textarea
                                id="prompt"
                                name="prompt"
                                placeholder="Exemple : Une fonction qui vérifie si une chaîne est un palindrome."
                                rows={6}
                                required
                                className="mt-2 bg-transparent text-base"
                                minLength={10}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="language">Langage</Label>
                            <Select name="language" value={language} onValueChange={setLanguage} required>
                                <SelectTrigger id="language" className="mt-2">
                                    <SelectValue placeholder="Sélectionnez un langage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.id} value={lang.id}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-2">
                            <SubmitButton />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CodeGenerator({ initialResult, prompt: promptProp, language: langProp }: { initialResult?: GenerateCodeOutput; prompt?: string, language?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const promptFromUrl = searchParams.get('prompt');
    const langFromUrl = searchParams.get('language');

    const [result, setResult] = useState<GenerateCodeOutput | null>(initialResult || null);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState(promptProp || promptFromUrl || '');
    const [language, setLanguage] = useState(langProp || langFromUrl || 'typescript');

    const { toast } = useToast();
    const { addNotification } = useNotifications();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/generateCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, language }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API Error');
            }

            const data: GenerateCodeOutput = await response.json();
            setResult(data);

            const resultId = `code-result-${Math.random()}`;
            localStorage.setItem(resultId, JSON.stringify({ result: data, prompt, language }));
            addNotification({
                icon: Code2,
                title: "Code généré !",
                description: `Votre snippet pour "${prompt.substring(0, 30)}..." est prêt.`,
                onClick: () => router.push(`/code?resultId=${resultId}`),
            });
        } catch(e: any) {
             toast({
                variant: 'destructive',
                title: 'Erreur (X)code',
                description: e.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CodeGeneratorFormBody prompt={prompt} setPrompt={setPrompt} language={language} setLanguage={setLanguage} />

            {isLoading && (
                <div className="mt-8">
                    <Card className="glass-card min-h-[300px] relative overflow-hidden">
                         <div className="absolute inset-0 z-0">
                            <AiLoadingAnimation isLoading={true} />
                        </div>
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <LoadingState text="(X)code écrit votre snippet..." />
                        </div>
                    </Card>
                </div>
            )}

            {!isLoading && result && <ResultsDisplay result={result} language={language} />}
        </form>
    );
}
