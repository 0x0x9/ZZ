
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Upload, X, FileKey, Sparkles, Download, Image as ImageIcon, Loader2, FileText, Music, Copy, Replace, Layers, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { ConvertImageOutput } from '@/ai/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

function SubmitButton({ pending, text = "Lancer la conversion"}: { pending: boolean, text?: string }) {
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Conversion...</>
            ) : (
                <>{text} <Sparkles className="ml-2 h-5 w-5" /></>
            )}
        </Button>
    )
}

function ImageConverter() {
    const [imagePreview, setImagePreview] = useState<string |null>(null);
    const [result, setResult] = useState<ConvertImageOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setImagePreview(loadEvent.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const image = formData.get('image') as string;
        const outputFormat = formData.get('outputFormat') as 'jpeg' | 'png' | 'webp';
        const removeTransparency = !!formData.get('removeTransparency');
        
        if (!image) {
            toast({ variant: 'destructive', description: "Veuillez choisir une image." });
            return;
        }

        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/convert-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image, outputFormat, removeTransparency }),
            });
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }
            const responseData = await response.json();
            setResult(responseData);
            toast({ title: 'Conversion réussie !'});
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!result) return;
        const format = result.convertedImageUri.split(';')[0].split('/')[1];
        const link = document.createElement("a");
        link.href = result.convertedImageUri;
        link.download = `converted-image.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <input type="hidden" name="image" value={imagePreview || ''} />

                    {imagePreview ? (
                        <div className="relative group w-full aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                            <Image src={imagePreview} alt="Aperçu de l'image" layout="fill" objectFit="contain" className="p-2"/>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setImagePreview(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/10 hover:border-primary/50 transition-colors"
                        >
                            <Upload className="h-10 w-10 mb-2" />
                            <span>Cliquez pour choisir une image</span>
                        </button>
                    )}
                </div>
                
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="outputFormat">Format de sortie</Label>
                        <Select name="outputFormat" defaultValue="jpeg" required>
                            <SelectTrigger id="outputFormat" className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="webp">WEBP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Checkbox id="removeTransparency" name="removeTransparency" />
                       <Label htmlFor="removeTransparency">Supprimer la transparence (fond blanc)</Label>
                    </div>
                     <SubmitButton pending={isLoading} />
                </div>
            </div>

            {result && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8">
                    <h3 className="text-lg font-semibold mb-4">Résultat de la Conversion</h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-sm aspect-square rounded-lg border-2 border-dashed bg-muted/20">
                             <Image src={result.convertedImageUri} alt="Image convertie" layout="fill" objectFit="contain" className="p-2"/>
                        </div>
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger l'image convertie
                        </Button>
                    </div>
                </motion.div>
            )}
        </form>
    )
}

function DocumentConverter() {
    const { toast } = useToast();
    const [originalText, setOriginalText] = useState('');
    const [prompt, setPromptText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultText, setResultText] = useState('');

     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResultText('');
        try {
            const response = await fetch('/api/content-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentType: 'reformat', textToReformat: originalText, prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }
            
            const result = await response.json();
            if (result.type === 'text' && typeof result.data === 'object' && result.data && 'reformattedText' in result.data) {
                setResultText((result.data as { reformattedText: string }).reformattedText);
            } else {
                throw new Error("L'IA n'a pas retourné de texte valide.");
            }
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!resultText) return;
        navigator.clipboard.writeText(resultText);
        toast({
            title: 'Copié !',
            description: 'Le texte transformé a été copié dans le presse-papiers.',
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                    <Label htmlFor="textToReformat">Texte Original</Label>
                    <Textarea
                        id="textToReformat"
                        name="textToReformat"
                        placeholder="Collez ou écrivez votre texte ici..."
                        rows={15}
                        className="bg-background/50 text-base"
                        required
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="prompt-input">Instruction de Transformation</Label>
                        <Textarea
                            id="prompt-input"
                            name="prompt"
                            placeholder="Ex: Transforme ce texte en une liste à puces. / Résume en 3 points clés. / Traduis en anglais."
                            rows={5}
                            className="bg-background/50 text-base"
                            required
                             value={prompt}
                            onChange={(e) => setPromptText(e.target.value)}
                        />
                    </div>
                    <SubmitButton pending={isLoading} text="Transformer le texte" />
                </div>
            </div>
             {resultText && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass-card bg-background/30">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Résultat Transformé</CardTitle>
                             <Button variant="outline" size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="min-h-[200px]">
                            <Textarea
                                readOnly
                                value={resultText}
                                rows={10}
                                className="bg-background/50 text-base"
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </form>
    );
}

const PlaceholderConverter = ({ title, comingSoon = true }: { title: string, comingSoon?: boolean }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-muted-foreground p-8">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        {comingSoon && (
            <>
                <p>Ce convertisseur arrive bientôt dans (X)change.</p>
                <div className="mt-4 px-4 py-1 text-xs bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20">Prochainement</div>
            </>
        )}
    </div>
);

const features = [
    {
        icon: Replace,
        title: "Conversion Intelligente",
        description: "Utilise l'IA pour des conversions de haute qualité, préservant les détails de vos images et la mise en forme de vos textes."
    },
    {
        icon: Layers,
        title: "Formats Multiples",
        description: "Passez d'un format d'image à un autre (JPEG, PNG, WEBP) ou transformez n'importe quel texte selon vos besoins (listes, résumés, traductions)."
    },
    {
        icon: Zap,
        title: "Workflow Accéléré",
        description: "Ne perdez plus de temps avec des outils externes. Convertissez et transformez vos fichiers directement dans l'écosystème (X)yzz."
    }
];

export default function ConvertClient() {
  return (
    <div className="w-full space-y-16">
        <Card className="glass-card max-w-5xl mx-auto">
        <CardHeader>
            <CardTitle>Convertisseur Universel</CardTitle>
            <CardDescription>
            Choisissez un type de fichier pour commencer la conversion.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="image" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4"/>Image</TabsTrigger>
                    <TabsTrigger value="document"><FileText className="mr-2 h-4 w-4"/>Document</TabsTrigger>
                    <TabsTrigger value="audio" disabled><Music className="mr-2 h-4 w-4"/>Audio</TabsTrigger>
                    <TabsTrigger value="3d" disabled><FileKey className="mr-2 h-4 w-4"/>3D</TabsTrigger>
                </TabsList>
                <TabsContent value="image" className="py-6">
                    <ImageConverter />
                </TabsContent>
                <TabsContent value="document" className="py-6">
                    <DocumentConverter />
                </TabsContent>
                <TabsContent value="audio" className="py-6">
                    <PlaceholderConverter title="Convertisseur Audio" />
                </TabsContent>
                <TabsContent value="3d" className="py-6">
                    <PlaceholderConverter title="Convertisseur 3D" />
                </TabsContent>
            </Tabs>
        </CardContent>
        </Card>

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
