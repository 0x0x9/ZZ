
'use client';

import { cn } from "@/lib/utils";
import { ALL_APPS_CONFIG } from "@/lib/apps-config";
import { motion } from 'framer-motion';
import { type AppConfig } from "@/lib/apps-config";

const iconGroupCategories: { title: string; ids: string[] }[] = [
    {
        title: "Applications Principales",
        ids: ['pulse', 'cloud', 'fusion']
    },
    {
        title: "Stratégie & Idéation",
        ids: ['flux', 'maestro', 'promptor', 'brand-identity', 'nexus', 'persona', 'agenda', 'light']
    },
    {
        title: "Création de Contenu",
        ids: ['text', 'image', 'motion', 'voice', 'deck', 'muse', 'sound']
    },
    {
        title: "Design & Développement",
        ids: ['editor', 'frame', 'code', 'terminal', 'reality']
    },
    {
        title: "Utilitaires",
        ids: ['format', 'convert']
    },
    {
        title: "Communauté & Boutique",
        ids: ['store', 'gallery', 'collaborations', 'careers']
    },
    {
        title: "Google Suite",
        ids: ['google-drive', 'google-docs', 'google-sheets', 'google-slides']
    }
];

interface DesktopIconsProps {
    isBooting: boolean;
    onOpenApp: (appId: string) => void;
}

const DesktopIcon = ({ app, index, onOpenApp }: { app: AppConfig, index: number, onOpenApp: (appId: string) => void }) => (
     <button
        key={app.id}
        onDoubleClick={() => onOpenApp(app.id)}
        className="flex flex-col items-center justify-start text-center gap-2 p-2 rounded-lg focus:outline-none focus:bg-white/5 dark:focus:bg-black/10 hover:bg-white/5 dark:hover:bg-black/10 transition-colors duration-200 w-24 h-24"
    >
        <app.icon className="w-10 h-10 text-foreground drop-shadow-lg" />
        <span className="text-foreground text-[11px] font-medium leading-tight line-clamp-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)] dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{app.name}</span>
    </button>
);

const DesktopIconGroup = ({ title, ids, onOpenApp, bootDelay }: { title: string, ids: string[], onOpenApp: (appId: string) => void, bootDelay: number }) => {
    const apps = ids.map(id => ALL_APPS_CONFIG.find(app => app.id === id)).filter(Boolean) as AppConfig[];
    
    return (
        <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: bootDelay }}
        >
            <h2 className="text-xs font-semibold text-foreground/80 uppercase tracking-widest px-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">{title}</h2>
            <div className="flex flex-wrap gap-1">
                {apps.map((app, index) => (
                    <DesktopIcon key={app.id} app={app} index={index} onOpenApp={onOpenApp} />
                ))}
            </div>
        </motion.div>
    );
};


export default function DesktopIcons({ isBooting, onOpenApp }: DesktopIconsProps) {
    if (isBooting) return null;

    return (
        <div className="p-4 md:p-8 z-1 relative w-full h-full overflow-y-auto no-scrollbar">
            <div className="flex flex-col flex-wrap items-start gap-y-8">
                {iconGroupCategories.map((group, index) => (
                    <DesktopIconGroup
                        key={group.title}
                        title={group.title}
                        ids={group.ids}
                        onOpenApp={onOpenApp}
                        bootDelay={index * 0.1}
                    />
                ))}
            </div>
        </div>
    );
}

    