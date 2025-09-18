
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { generateNexus } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Network, Sparkles, ChevronRight, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateNexusOutput, NexusNode } from '@/ai/types';
import { LoadingState } from './loading-state';
import { cn } from '@/lib/utils';
import AiLoadingAnimation from './ui/ai-loading-animation';
import { motion, AnimatePresence } from 'framer-motion';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <LoadingState text="Déploiement des idées..." isCompact={true} />
      ) : (
        <>
          Générer la carte mentale
          <Sparkles className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

const NodeComponent = ({ node, level }: { node: NexusNode, level: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const levelStyles = [
        // Level 0 (Root)
        { bg: 'bg-primary/90', text: 'text-primary-foreground', border: 'border-primary-foreground/30', ring: 'ring-primary/40' },
        // Level 1
        { bg: 'bg-background', text: 'text-foreground', border: 'border-primary/40', ring: 'ring-primary/40' },
        // Level 2
        { bg: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-muted-foreground/30', ring: 'ring-muted-foreground/40' },
    ];

    const style = levelStyles[Math.min(level, levelStyles.length - 1)];

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.05 * level }}
            className="relative pl-8"
        >
            {/* Vertical connector line (from parent) */}
            <div className="absolute left-[17px] top-[-1px] h-full w-px bg-border" />
            
            {/* Horizontal connector line */}
            <div className="absolute left-[17px] top-[18px] h-px w-4 bg-border" />

            {/* Node element */}
            <div className="relative flex items-center">
                <div 
                    className={cn(
                        "z-10 flex min-w-32 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:shadow-lg hover:ring-2",
                        style.bg,
                        style.text,
                        style.border,
                        style.ring
                    )}
                    onClick={() => node.children?.length > 0 && setIsExpanded(!isExpanded)}
                >
                    {node.children?.length > 0 ? (
                        <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform', isExpanded && 'rotate-90')} />
                    ) : (
                        <div className="w-4 h-4" /> // Placeholder for alignment
                    )}
                    <p className="font-medium">{node.label}</p>
                </div>
            </div>

            {/* Children container */}
            <AnimatePresence>
                {isExpanded && node.children?.length > 0 && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2 overflow-hidden"
                    >
                        {node.children.map((child) => (
                            <NodeComponent key={child.id} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


function ResultsDisplay({ result, onReset }: { result: GenerateNexusOutput, onReset: () => void }) {
    return (
        <div className="mt-12">
             <Card className="glass-card">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">Votre Carte Mentale Visuelle</CardTitle>
                        <CardDescription>Cliquez sur les nœuds pour déplier ou replier les branches.</CardDescription>
                    </div>
                     <Button onClick={onReset} variant="outline" size="sm">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Nouveau
                    </Button>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                    {result.mindMap ? <NodeComponent node={result.mindMap} level={0} /> : <p>Impossible d'afficher la carte mentale.</p>}
                </CardContent>
            </Card>
        </div>
    );
}

function NexusForm({ state }: {
    state: { result: GenerateNexusOutput | null, error: string | null, prompt: string },
}) {
    const { pending } = useFormStatus();
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Network className="h-7 w-7 text-primary" />
                        <div>
                            <CardTitle>(X)nexus - Cartes Mentales IA</CardTitle>
                            <CardDescription>
                                Entrez une idée centrale et laissez l'IA créer des connexions pour vous.
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    name="prompt"
                    placeholder="Exemple : Lancer un podcast sur l'intelligence artificielle"
                    rows={4}
                    className="bg-transparent text-base"
                    required
                    minLength={10}
                    disabled={pending}
                    defaultValue={state.prompt ?? ''}
                />
            </CardContent>
            <div className="flex justify-center p-6 pt-0">
                <SubmitButton />
            </div>
        </Card>
    )
}

export default function NexusGenerator({ initialResult, prompt }: { initialResult?: GenerateNexusOutput, prompt?: string }) {
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(!initialResult);

    const initialState: { result: GenerateNexusOutput | null, error: string | null, prompt: string } = {
        result: initialResult || null,
        error: null,
        prompt: prompt || ''
    };
    const [state, formAction] = useFormState(generateNexus, initialState);
    const { toast } = useToast();
    const { pending } = useFormStatus();
    
    useEffect(() => {
        if (state.error) {
            setShowForm(true);
            toast({
                variant: 'destructive',
                title: 'Erreur (X)nexus',
                description: state.error,
            });
        }
        if (state.result) {
            setShowForm(false);
        }
    }, [state, toast]);
    
    const handleReset = () => {
        setKey(k => k + 1);
        setShowForm(true);
    };

    return (
        <form action={formAction} key={key}>
             <div className="max-w-4xl mx-auto">
                {showForm && <NexusForm state={initialState} />}
                
                {pending && (
                    <div className="mt-12">
                        <Card className="glass-card min-h-[300px] relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <AiLoadingAnimation isLoading={true} />
                            </div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                               <LoadingState text="(X)nexus déploie vos idées..." />
                            </div>
                        </Card>
                    </div>
                )}

                {!showForm && state.result && <ResultsDisplay result={state.result} onReset={handleReset} />}
            </div>
        </form>
    );
}
