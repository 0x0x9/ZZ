
'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { EditorView } from '@codemirror/view';
import { useFormState, useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';
import DocManager from './doc-manager';
import type { Doc, Frame } from '@/ai/types';
import { getLanguageExtension } from '@/lib/language-map';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/hooks/use-toast';
import { Loader, Wand2, Bug, BrainCircuit, Save, TerminalSquare, FileText, AppWindow, Upload, Image as ImageIconLucide, PanelLeftOpen, PanelLeftClose, LayoutTemplate, X, Sparkles } from 'lucide-react';
import { refactorCodeAction, debugCodeAction, explainCodeAction } from '@/app/actions';
import { generateFrameAction } from '@/app/actions';
import { uploadDocumentAction } from '@/app/actions';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { LoadingState } from './loading-state';
import AiLoadingAnimation from './ui/ai-loading-animation';


type AiAction = 'explain' | 'refactor' | 'debug';

const makeTransparent = EditorView.theme({
    '&': {
      backgroundColor: 'transparent !important',
      height: '100%',
    },
    '.cm-scroller': {
      backgroundColor: 'transparent !important',
      overflow: 'auto',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent !important',
      borderRight: '1px solid hsla(var(--border) / 0.1)',
    },
});

const FrameGeneratorPanel = ({ onProjectGenerated }: { onProjectGenerated: (codes: { html: string; css: string; js: string }) => void }) => {
    const { toast } = useToast();
    const initialState = { message: '', error: '', id: 0, result: null };
    const [state, formAction] = useFormState(generateFrameAction, initialState);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <LoadingState text="Construction..." isCompact={true} />
            ) : (
              <>
                Générer la maquette
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        );
    }
    
    useEffect(() => {
        if (state.id > 0 && state.result) {
            onProjectGenerated({ html: state.result.htmlCode, css: state.result.cssCode, js: state.result.jsCode || '' });
            formRef.current?.reset();
            setImageDataUri(null);
            toast({ title: "Maquette générée !", description: "Le projet a été chargé dans l'éditeur." });
        } else if (state.id > 0 && state.error) {
            toast({ variant: 'destructive', title: 'Erreur (X)frame', description: state.error });
        }
    }, [state, onProjectGenerated, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageDataUri(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const { pending } = useFormStatus();

    return (
        <form ref={formRef} action={formAction} className="p-4 flex flex-col h-full space-y-4">
            <input type="hidden" name="photoDataUri" value={imageDataUri || ''} />
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                <Textarea
                    name="prompt"
                    placeholder="Ex: Une carte de profil utilisateur avec un avatar, un nom, et un bouton 'Suivre'."
                    rows={6}
                    minLength={10}
                    className="bg-transparent text-sm"
                    disabled={pending}
                />
                <div className="space-y-2">
                    <span className="text-sm font-medium">Inspiration (Optionnel)</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                    {imageDataUri ? (
                        <div className="relative group w-full h-32 rounded-lg border border-dashed border-border flex items-center justify-center">
                            <Image src={imageDataUri} alt="Aperçu de l'image" fill objectFit="contain" className="p-2"/>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setImageDataUri(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-accent hover:border-primary transition-colors"
                            disabled={pending}
                        >
                            <Upload className="h-6 w-6 mb-2" />
                            <span>Déposer une image</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0">
                <SubmitButton />
            </div>
        </form>
    );
};


const FileBasedEditor = ({
    onProjectGenerated,
    initialCode,
    initialLanguage
}: {
    onProjectGenerated: (codes: { html: string; css: string; js: string }) => void,
    initialCode?: string,
    initialLanguage?: string
}) => {
    const [activeFile, setActiveFile] = useState<Doc | null>(null);
    const [code, setCode] = useState<string>(initialCode || '// Sélectionnez un fichier ou générez une maquette...');
    const [isDirty, setIsDirty] = useState(!!initialCode);
    const [isSaving, setIsSaving] = useState(false);
    const [docManagerKey, setDocManagerKey] = useState(0);

    const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
    const [explanation, setExplanation] = useState<string>('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [isRefactorDialogOpen, setIsRefactorDialogOpen] = useState(false);
    const [refactorPrompt, setRefactorPrompt] = useState('');
    const [isPreviewVisible, setIsPreviewVisible] = useState(true);
    const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
    const [activeExplorerTab, setActiveExplorerTab] = useState('files');

    const [isSaveAsDialogOpen, setIsSaveAsDialogOpen] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const { theme } = useTheme();
    const { toast } = useToast();
    
    const [refactorState, refactorFormAction] = useFormState(refactorCodeAction, { id: 0, result: null, error: null });
    const [debugState, debugFormAction] = useFormState(debugCodeAction, { id: 0, result: null, error: null });
    const [explainState, explainFormAction] = useFormState(explainCodeAction, { id: 0, result: null, error: null });
    
    const language = useMemo(() => {
        if (activeFile) {
            return activeFile.name.split('.').pop()?.toLowerCase() || 'plaintext';
        }
        return initialLanguage || 'plaintext';
    }, [activeFile, initialLanguage]);

    const handleOpenFile = async (doc: Doc) => {
        if (isDirty) {
            toast({ variant: 'destructive', title: 'Modifications non enregistrées', description: "Veuillez enregistrer ou annuler vos modifications avant d'ouvrir un autre fichier." });
            return;
        }
        if (doc.mimeType.startsWith('image/') || doc.mimeType.startsWith('video/') || doc.mimeType.startsWith('audio/') || doc.mimeType === 'application/x-directory' || doc.mimeType.startsWith('application/pdf')) {
            toast({ description: "Seuls les fichiers texte peuvent être ouverts dans l'éditeur."});
            return;
        }

        setActiveFile(doc);
        setCode('Chargement du fichier...');
        try {
            // In a real app, this would fetch from a signed URL. We'll use a mock for now.
             const content = `// Contenu du fichier ${doc.name}...\n\n// Pour le test, voici du code :\nfunction hello() {\n  console.log("Hello from ${doc.name}");\n}`;
             setCode(content);
             setIsDirty(false);
        } catch (error: any) {
            setCode(`// Erreur lors du chargement de ${doc.name}\n${error.message}`);
            toast({ variant: 'destructive', title: 'Erreur de chargement', description: error.message });
        }
    };
    
    const handleCodeChange = useCallback((newCode: string) => {
        setCode(newCode);
        setIsDirty(true);
    }, []);

    const handleSave = async () => {
        if (!isDirty) return;
        if (activeFile) {
            setIsSaving(true);
            try {
                // await updateDocument({ docId: activeFile.id, content: code });
                toast({ title: "Fichier sauvegardé !", description: `"${activeFile.name.split('/').pop()}" a été mis à jour.`});
                setIsDirty(false);
                setDocManagerKey(k => k + 1); // Trigger a refresh in DocManager
            } catch (error: any) {
                toast({ variant: 'destructive', title: "Erreur de sauvegarde", description: error.message });
            } finally {
                setIsSaving(false);
            }
        } else {
            setNewFileName(`nouveau-fichier.${language}`);
            setIsSaveAsDialogOpen(true);
        }
    };
    
    const handleSaveAs = async () => {
        if (!newFileName.trim()) {
            toast({ variant: "destructive", description: "Le nom du fichier est requis." });
            return;
        }
        setIsSaving(true);
        try {
            const dataUri = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(code)))}`;
            await uploadDocumentAction({ name: newFileName.trim(), content: dataUri, mimeType: 'text/plain' });
            toast({ title: 'Fichier sauvegardé !', description: `"${newFileName.trim()}" a été sauvegardé sur votre cloud.` });
            
            setDocManagerKey(k => k + 1);
            setIsSaveAsDialogOpen(false);
            setNewFileName('');
            setIsDirty(false);
            toast({ description: "Ouvrez le nouveau fichier depuis l'explorateur pour continuer."});
            
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erreur de sauvegarde", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };


    const extractCodeFromMarkdown = (markdown: string): string => {
        const codeBlockRegex = /```(?:\w+)?\n([\s\S]+)```/;
        const match = markdown.match(codeBlockRegex);
        return match ? match[1].trim() : markdown.trim();
    };
    
    const handleAiAction = (action: AiAction) => {
        const formData = new FormData();
        formData.append('code', code);
        formData.append('language', language);
    
        setIsLoadingAi(true);

        if (action === 'explain') {
            (explainFormAction as (payload: FormData) => void)(formData);
        } else if (action === 'debug') {
            (debugFormAction as (payload: FormData) => void)(formData);
        } else if (action === 'refactor') {
            if (!refactorPrompt.trim()) {
                toast({ variant: 'destructive', description: "Veuillez fournir une instruction pour améliorer le code." });
                setIsLoadingAi(false);
                return;
            }
            formData.append('prompt', refactorPrompt);
            (refactorFormAction as (payload: FormData) => void)(formData);
            setIsRefactorDialogOpen(false);
        }
    };
    
     useEffect(() => {
        if (explainState.id > 0 && explainState.result) {
            setDialogTitle("Explication du code");
            setExplanation(explainState.result.explanation);
        }
        if (explainState.id > 0 && explainState.error) toast({ variant: 'destructive', title: `Erreur d'explication`, description: explainState.error });
        if (explainState.id > 0) setIsLoadingAi(false);
    }, [explainState, toast]);

    useEffect(() => {
        if (debugState.id > 0 && debugState.result) {
            setCode(extractCodeFromMarkdown(debugState.result.fixedCode));
            setIsDirty(true);
            setDialogTitle("Rapport de débogage");
            setExplanation(debugState.result.explanation);
        }
        if (debugState.id > 0 && debugState.error) toast({ variant: 'destructive', title: `Erreur de débogage`, description: debugState.error });
        if (debugState.id > 0) setIsLoadingAi(false);
    }, [debugState, toast]);

    useEffect(() => {
        if (refactorState.id > 0 && refactorState.result) {
            setCode(extractCodeFromMarkdown(refactorState.result.code));
            setIsDirty(true);
            setDialogTitle("Code amélioré");
            setExplanation(refactorState.result.explanation);
            setRefactorPrompt('');
        }
        if (refactorState.id > 0 && refactorState.error) toast({ variant: 'destructive', title: `Erreur d'amélioration`, description: refactorState.error });
        if (refactorState.id > 0) setIsLoadingAi(false);
    }, [refactorState, toast]);

    
    const languageExtension = getLanguageExtension(`file.${language}`);
    const codeMirrorOptions = {
        theme: theme === 'dark' ? githubDark : githubLight,
        extensions: [makeTransparent, EditorView.lineWrapping, languageExtension].flat(),
    };

    const previewSrcDoc = useMemo(() => {
        const placeholderStyle = "display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;color:grey;";
        if (!code) {
          return `<div style="${placeholderStyle}"><p>Sélectionnez un fichier HTML ou générez du code pour voir l'aperçu.</p></div>`;
        }
    
        if (language === 'html') {
            const tailwindScript = '<script src="https://cdn.tailwindcss.com"></script>';
            if (code.includes('cdn.tailwindcss.com')) {
                return code;
            }
            const headEndIndex = code.toLowerCase().indexOf('</head>');
            if (headEndIndex !== -1) {
                return `${code.slice(0, headEndIndex)}${tailwindScript}${code.slice(headEndIndex)}`;
            }
            return `<!DOCTYPE html><html><head>${tailwindScript}</head><body>${code}</body></html>`;
        }
    
        return `<div style="${placeholderStyle}"><p>L'aperçu en direct est disponible uniquement pour les fichiers HTML.</p></div>`;
    }, [code, language]);

    return (
        <>
            <div className="grid lg:grid-cols-12 flex-1 min-h-0 h-full">
                 {isFileExplorerVisible && (
                    <div className="lg:col-span-3 h-full flex flex-col bg-black/5 dark:bg-black/10 border-r border-white/10">
                         <Tabs defaultValue="files" value={activeExplorerTab} onValueChange={setActiveExplorerTab} className="h-full flex flex-col">
                            <TabsList className="m-2">
                                <TabsTrigger value="files">Fichiers</TabsTrigger>
                                <TabsTrigger value="frame">Générer</TabsTrigger>
                            </TabsList>
                            <TabsContent value="files" className="flex-1 min-h-0 -mt-2">
                                <DocManager onFileSelect={handleOpenFile} key={docManagerKey} />
                            </TabsContent>
                            <TabsContent value="frame" className="flex-1 min-h-0 -mt-2">
                                <FrameGeneratorPanel onProjectGenerated={onProjectGenerated} />
                            </TabsContent>
                        </Tabs>
                    </div>
                 )}
                <div className={cn(
                    "h-full flex flex-col",
                    isFileExplorerVisible ? "lg:col-span-9" : "lg:col-span-12"
                )}>
                    <header className="flex-row items-center justify-between p-3 border-b border-t lg:border-t-0 border-white/10 flex-shrink-0 flex">
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" onClick={() => setIsFileExplorerVisible(!isFileExplorerVisible)} className="h-7 w-7 mr-1">
                                {isFileExplorerVisible ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                            </Button>
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-mono text-sm truncate">{activeFile?.name.split('/').pop() || `nouveau-fichier.${language}`}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleAiAction('explain')} disabled={!code || isLoadingAi}>
                                {isLoadingAi ? <Loader className="animate-spin" /> : <BrainCircuit />}<span className="ml-2 hidden sm:inline">Expliquer</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsRefactorDialogOpen(true)} disabled={!code || isLoadingAi}>
                                {isLoadingAi ? <Loader className="animate-spin" /> : <Wand2 />}<span className="ml-2 hidden sm:inline">Améliorer</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleAiAction('debug')} disabled={!code || isLoadingAi}>
                                {isLoadingAi ? <Loader className="animate-spin" /> : <Bug />}<span className="ml-2 hidden sm:inline">Analyser</span>
                            </Button>
                             <Button variant="ghost" size="sm" onClick={() => setIsPreviewVisible(!isPreviewVisible)}><AppWindow /><span className="ml-2 hidden sm:inline">Aperçu</span></Button>
                            <Button onClick={handleSave} disabled={!isDirty || isSaving} size="sm">
                                {isSaving ? <Loader className="animate-spin" /> : <Save />}<span className="ml-2 hidden sm:inline">Sauvegarder</span>
                            </Button>
                        </div>
                    </header>
                    <div className={cn("grid flex-1 min-h-0", isPreviewVisible ? "grid-cols-2 gap-px bg-border/20" : "grid-cols-1")}>
                        <div className="bg-background relative">
                            <CodeMirror
                                value={code}
                                onChange={handleCodeChange}
                                height="100%"
                                {...codeMirrorOptions}
                            />
                        </div>
                        {isPreviewVisible && (
                            <div className="bg-white dark:bg-gray-800">
                                <iframe
                                    srcDoc={previewSrcDoc}
                                    title="Live Preview"
                                    className="w-full h-full border-0"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
            <AlertDialog open={!!explanation} onOpenChange={(open) => !open && setExplanation('')}>
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription className="text-foreground max-h-[60vh] overflow-y-auto whitespace-pre-wrap py-4 no-scrollbar">
                            {explanation}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setExplanation('')}>Fermer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        
            <Dialog open={isRefactorDialogOpen} onOpenChange={setIsRefactorDialogOpen}>
                <DialogContent className="glass-card">
                    <DialogHeader>
                        <DialogTitle>Améliorer le code</DialogTitle>
                        <DialogDescription>
                            Décrivez les modifications que vous souhaitez apporter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Ex : 'Renomme les variables pour plus de clarté', 'transforme en fonction fléchée'."
                            value={refactorPrompt}
                            onChange={(e) => setRefactorPrompt(e.target.value)}
                            rows={4}
                            className="bg-transparent"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
                        <Button type="button" onClick={() => handleAiAction('refactor')} disabled={!refactorPrompt.trim()}>Lancer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isSaveAsDialogOpen} onOpenChange={setIsSaveAsDialogOpen}>
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sauvegarder un nouveau fichier</AlertDialogTitle>
                        <AlertDialogDescription>Entrez un nom pour votre nouveau fichier.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="nom-du-fichier.tsx"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveAs} disabled={isSaving}>
                           {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const ProjectViewEditor = ({ initialCodes, onBack }: { initialCodes: { html: string; css: string; js: string }, onBack: () => void }) => {
    const { theme } = useTheme();
    const { toast } = useToast();

    const [htmlCode, setHtmlCode] = useState(initialCodes.html);
    const [cssCode, setCssCode] = useState(initialCodes.css);
    const [jsCode, setJsCode] = useState(initialCodes.js);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [projectName, setProjectName] = useState('mon-projet');
    const [isPreviewVisible, setIsPreviewVisible] = useState(true);

    const codeMirrorOptions = {
        theme: theme === 'dark' ? githubDark : githubLight,
        extensions: [makeTransparent, EditorView.lineWrapping],
    };

    const handleSaveProject = async () => {
        if (!projectName.trim()) {
            toast({ variant: "destructive", title: "Nom de projet requis" });
            return;
        }
        setIsSaving(true);
        try {
            const filesToSave = [
                { name: `${projectName}.html`, content: htmlCode, mime: 'text/html' },
                { name: `${projectName}.css`, content: cssCode, mime: 'text/css' },
                { name: `${projectName}.js`, content: jsCode, mime: 'text/javascript' },
            ];
            
            for (const file of filesToSave) {
                if (file.content.trim()) {
                    const dataUri = `data:${file.mime};base64,${btoa(unescape(encodeURIComponent(file.content)))}`;
                    await uploadDocumentAction({ name: `frame-projects/${projectName.trim()}/${file.name}`, content: dataUri, mimeType: file.mime });
                }
            }
            toast({ title: 'Projet sauvegardé !', description: `Les fichiers ont été enregistrés dans votre (X)cloud sous "frame-projects".` });
            setIsSaveDialogOpen(false);
            onBack();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erreur de sauvegarde", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const srcDoc = useMemo(() => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssCode}</style>
                 <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${htmlCode}
                <script>
                    try {
                        ${jsCode}
                    } catch (e) {
                        console.error(e);
                    }
                </script>
            </body>
            </html>
        `;
    }, [htmlCode, cssCode, jsCode]);


    return (
        <>
            <header className="flex-row items-center justify-between p-3 border-b border-t lg:border-t-0 border-white/10 flex-shrink-0 flex">
                <div className="flex items-center gap-2">
                    <TerminalSquare className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-mono text-sm truncate">Projet de (X)frame</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsPreviewVisible(!isPreviewVisible)}><AppWindow /><span className="ml-2 hidden sm:inline">Aperçu</span></Button>
                    <Button onClick={() => setIsSaveDialogOpen(true)} disabled={isSaving} size="sm">
                        {isSaving ? <Loader className="animate-spin" /> : <Save />}<span className="ml-2 hidden sm:inline">Sauvegarder le Projet</span>
                    </Button>
                </div>
            </header>
            <div className={cn("grid flex-1 min-h-0", isPreviewVisible ? "grid-cols-2 gap-px bg-border/20" : "grid-cols-1")}>
                <div className="bg-background">
                     <Tabs defaultValue="html" className="h-full flex flex-col">
                        <TabsList className="m-2">
                            <TabsTrigger value="html">HTML</TabsTrigger>
                            <TabsTrigger value="css">CSS</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                        </TabsList>
                        <TabsContent value="html" className="flex-1 min-h-0 -mt-2">
                            <CodeMirror value={htmlCode} onChange={setHtmlCode} height="100%" {...codeMirrorOptions} extensions={[html(), ...codeMirrorOptions.extensions]} theme={codeMirrorOptions.theme} />
                        </TabsContent>
                        <TabsContent value="css" className="flex-1 min-h-0 -mt-2">
                            <CodeMirror value={cssCode} onChange={setCssCode} height="100%" {...codeMirrorOptions} extensions={[css(), ...codeMirrorOptions.extensions]} theme={codeMirrorOptions.theme} />
                        </TabsContent>
                        <TabsContent value="js" className="flex-1 min-h-0 -mt-2">
                            <CodeMirror value={jsCode} onChange={setJsCode} height="100%" {...codeMirrorOptions} extensions={[javascript(), ...codeMirrorOptions.extensions]} theme={codeMirrorOptions.theme} />
                        </TabsContent>
                    </Tabs>
                </div>
                {isPreviewVisible && (
                    <div className="bg-white dark:bg-gray-800">
                         <iframe
                            srcDoc={srcDoc}
                            title="Live Preview"
                            className="w-full h-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                )}
            </div>

            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent className="glass-card">
                    <DialogHeader>
                        <DialogTitle>Sauvegarder le projet</DialogTitle>
                        <DialogDescription>
                            Entrez un nom pour votre projet. Un dossier sera créé dans "frame-projects" sur votre (X)cloud.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="nom-du-projet"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                        <Button onClick={handleSaveProject} disabled={isSaving}>
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function CodeEditor({ initialProjectCodes: initialProjectCodesProp, initialFile: initialFileProp }: { initialProjectCodes?: {html: string, css: string, js: string}, initialFile?: {code: string, language: string} }) {
    const searchParams = useSearchParams();
    
    const decodeB64 = (str: string | null) => {
        if (!str) return '';
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            console.error("Failed to decode base64 string:", e);
            return '';
        }
    };
    
    const initialProjectCodesFromUrl = useMemo(() => {
        const html = decodeB64(searchParams.get('htmlCode'));
        const css = decodeB64(searchParams.get('cssCode'));
        const js = decodeB64(searchParams.get('jsCode'));
        
        if (html || css || js) {
            return { html, css, js };
        }
        return null;
    }, [searchParams]);

    const initialFileFromUrl = useMemo(() => {
        const code = searchParams.get('code');
        const language = searchParams.get('language');
        const encoding = searchParams.get('encoding');

        if (code && language) {
            return {
                code: encoding === 'base64' ? decodeB64(code) : code,
                language: language
            }
        }
        return null;
    }, [searchParams]);

    const finalInitialProjectCodes = initialProjectCodesProp || initialProjectCodesFromUrl;
    const finalInitialFile = initialFileProp || initialFileFromUrl;

    const [viewMode, setViewMode] = useState<'file' | 'project'>(finalInitialProjectCodes ? 'project' : 'file');
    const [projectCode, setProjectCode] = useState<{html: string, css: string, js: string} | null>(finalInitialProjectCodes);

    const handleProjectGenerated = (codes: { html: string, css: string, js: string }) => {
        setProjectCode(codes);
        setViewMode('project');
    };
    
    return (
        <Card className="glass-card h-full min-h-[70vh] flex flex-col overflow-hidden">
            {viewMode === 'project' && projectCode ? (
                <ProjectViewEditor 
                    initialCodes={projectCode} 
                    onBack={() => {
                        setViewMode('file');
                        setProjectCode(null);
                    }}
                />
            ) : (
                <FileBasedEditor 
                    onProjectGenerated={handleProjectGenerated}
                    initialCode={finalInitialFile?.code}
                    initialLanguage={finalInitialFile?.language}
                />
            )}
        </Card>
    );
}
