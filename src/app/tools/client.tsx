
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Wand2, BrainCircuit, Layers, Lightbulb, Calendar, Network,
  Film, Image as ImageIconLucide, AudioLines, FileText,
  Guitar, Music, SquareTerminal, LayoutTemplate, Terminal, CodeXml, ArrowRight, View,
  FileKey, FilePenLine, Presentation, Users, Cloud, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import OriaAnimation from '@/components/ui/oria-animation';

const environments = [
  {
    title: '(X)OS',
    description: "L'environnement unifié qui connecte tous vos outils, fichiers et idées. La base de votre créativité.",
    href: '/xos',
    icon: Layers,
    videoSrc: "https://www.youtube.com/embed/SqJGQ25sc8Q?autoplay=1&mute=1&loop=1&playlist=SqJGQ25sc8Q&controls=0&showinfo=0&autohide=1"
  },
  {
    title: '(X)cloud',
    description: "Votre espace de stockage intelligent. Synchronisation, partage et collaboration, de manière transparente.",
    href: '/cloud',
    icon: Cloud,
    videoSrc: "https://www.youtube.com/embed/YUEb23FQVhA?autoplay=1&mute=1&loop=1&playlist=YUEb23FQVhA&controls=0&showinfo=0&autohide=1&wmode=transparent"
  },
  {
    title: 'Pulse',
    description: "Le centre névralgique de vos projets. Suivez vos tâches, gérez vos fichiers et collaborez avec votre équipe et l'IA.",
    href: '/chat',
    icon: Heart,
    videoSrc: "https://www.youtube.com/embed/Qjr954NE46c?autoplay=1&mute=1&loop=1&playlist=Qjr954NE46c&controls=0&showinfo=0&autohide=1&wmode=transparent"
  }
];

const toolCategories = [
  {
    id: 'strategy',
    name: 'Stratégie & Idéation',
    description: 'Posez les fondations solides de votre projet.',
    tools: [
      { title: '(X)flux', description: "Transformez une idée brute en projet complet.", href: '/flux', icon: Wand2 },
      { title: 'Maestro', description: "Orchestrez vos projets de A à Z.", href: '/maestro', icon: BrainCircuit },
      { title: '(X)brand', description: 'Définissez la voix et les couleurs de votre marque.', href: '/brand-identity', icon: Layers },
      { title: '(X)promptor', description: 'Transformez une idée vague en prompts créatifs.', href: '/promptor', icon: Lightbulb },
      { title: '(X)persona', description: "Créez des profils d'utilisateurs pour mieux cibler vos projets.", href: '/persona', icon: Users },
      { title: '(X)agenda', description: "Organisez vos tâches et vos idées avec l'IA.", href: '/agenda', icon: Calendar },
      { title: '(X)nexus', description: 'Déployez vos idées en cartes mentales visuelles.', href: '/nexus', icon: Network },
    ],
  },
  {
    id: 'content',
    name: 'Création de Contenu Visuel & Vidéo',
    description: 'Passez de l\'idée à la réalité.',
    tools: [
       { title: '(X)motion', description: 'Générez des scripts vidéo complets, scène par scène.', href: '/motion', icon: Film },
      { title: 'Image', description: 'Créez des visuels uniques à partir de mots.', href: '/image', icon: ImageIconLucide },
      { title: '(X)deck', description: 'Construisez des présentations percutantes sur un sujet.', href: '/deck', icon: Presentation },
    ],
  },
  {
    id: 'music',
    name: 'Audio, Voix & Musique',
    description: 'Composez, générez et trouvez votre style sonore.',
    tools: [
       { title: '(X)muse', description: "Votre partenaire pour l'écriture de textes et la recherche de styles musicaux.", href: '/muse', icon: Guitar },
       { title: '(X)sound', description: 'Générez des effets sonores et des ambiances sur demande.', href: '/sound', icon: Music },
       { title: '(X)voice', description: 'Donnez une voix de haute qualité à n\'importe quel texte.', href: '/voice', icon: AudioLines },
    ],
  },
  {
    id: 'design',
    name: 'Design, Dev & Code',
    description: 'Peaufinez et construisez des solutions techniques et visuelles.',
    tools: [
      { title: '(X).alpha', description: 'L\'éditeur de code complet, assisté par IA pour générer, expliquer et débugger.', href: '/editor', icon: SquareTerminal },
      { title: '(X)code', description: 'Un générateur de snippets de code rapides pour tous les langages.', href: '/code', icon: CodeXml },
      { title: '(X)frame', description: 'Esquissez des interfaces et des wireframes fonctionnels en code.', href: '/frame', icon: LayoutTemplate },
      { title: '(X)reality', description: 'Prévisualisez vos modèles 3D en réalité augmentée et virtuelle.', href: '/reality', icon: View },
       { title: '(X)term', description: 'Une interface de ligne de commande pour interagir avec vos outils.', href: '/terminal', icon: Terminal },
    ],
  },
   {
    id: 'utilities',
    name: 'Utilitaires IA',
    description: 'Des outils pratiques pour accélérer vos tâches quotidiennes.',
    tools: [
       { title: '(X)format', description: 'Reformatez et réécrivez n\'importe quel texte selon vos instructions.', href: '/format', icon: FilePenLine },
      { title: '(X)change', description: 'Un convertisseur de fichiers universel (images, documents, etc.).', href: '/convert', icon: FileKey },
    ]
  },
];

const EnvironmentCard = ({ env }: { env: typeof environments[0] }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    return (
        <Link href={env.href} className="block group">
            <motion.div
                ref={ref}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden glass-card"
            >
                <motion.div style={{ y }} className="absolute inset-0">
                    <iframe
                        src={env.videoSrc}
                        title={env.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover scale-[1.5]"
                    ></iframe>
                     <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>
                </motion.div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                    <div className="p-2 bg-white/10 rounded-lg border border-white/20 mb-3 w-fit backdrop-blur-sm">
                        <env.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight">{env.title}</h3>
                    <p className="max-w-md text-white/80 mt-1">{env.description}</p>
                </div>
            </motion.div>
        </Link>
    )
}

export default function ToolsClient() {
    const [activeCategory, setActiveCategory] = useState(toolCategories[0].id);
    const activeTools = toolCategories.find(c => c.id === activeCategory)?.tools || [];

    return (
        <div className="py-28 md:py-36 space-y-24 md:space-y-32">
            <section className="container mx-auto px-4 md:px-6 text-center">
                 <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    L'Écosystème (X)yzz.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Explorez les environnements et les outils qui composent notre plateforme unifiée, conçue pour chaque étape de votre processus créatif.
                </p>
            </section>
            
            <section className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Nos Environnements</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Les piliers de votre workflow, où la créativité et la productivité convergent.</p>
                </div>
                <div className="space-y-8">
                     {environments.map(env => <EnvironmentCard key={env.title} env={env} />)}
                </div>
            </section>

             <section className="container mx-auto px-4 md:px-6">
                <div className="relative glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                    <div className="absolute -inset-20 z-0">
                         <OriaAnimation className="w-full h-full opacity-30" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold">Oria, votre chef d'orchestre IA.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                            Oria est l'intelligence qui connecte tous les outils. Discutez avec elle pour lancer des projets, générer des idées, et trouver l'outil parfait pour chaque tâche.
                        </p>
                         <Button asChild size="lg" className="mt-8 rounded-full">
                            <Link href="/features">
                                En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                     <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                         <OriaAnimation className="w-full h-full" />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">La Suite d'Outils IA</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Un arsenal d'experts IA à votre service, prêts à transformer vos idées en réalité.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1 lg:sticky top-28 self-start">
                        <nav className="flex flex-col gap-2">
                             {toolCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={cn(
                                        "p-4 text-left rounded-xl border-2 transition-all duration-300 w-full",
                                        "bg-card/95 hover:bg-card/25 dark:bg-card/80 dark:hover:bg-card/50",
                                        "hover:shadow-2xl hover:shadow-primary/10 hover:backdrop-blur-xl",
                                        activeCategory === category.id
                                            ? "shadow-accent/20 border-accent/50"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <h3 className="text-md font-semibold mb-1 text-foreground">{category.name}</h3>
                                    <p className="text-xs text-muted-foreground">{category.description}</p>
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="lg:col-span-3">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {activeTools.map((tool, index) => (
                                    <Link href={tool.href} className="block group h-full" key={tool.href}>
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="p-8 h-full flex flex-col transition-all duration-300 group rounded-2xl hover:-translate-y-2 glass-card hover:border-primary/30"
                                        >
                                            <div className="bg-primary/10 p-3 rounded-lg mb-4 w-fit border border-primary/20">
                                                <tool.icon className="h-7 w-7 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 text-foreground">{tool.title}</h3>
                                            <p className="text-muted-foreground flex-grow mb-4">{tool.description}</p>
                                            <div className="flex items-center text-sm font-medium text-primary mt-auto">
                                                Lancer l'outil <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </section>
        </div>
    );
}
