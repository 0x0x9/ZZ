
'use client';

import dynamic from 'next/dynamic';
import { Layers, BrainCircuit, Lightbulb, Users, Mic, Film, AudioLines, Palette, CodeXml, SquareTerminal, Zap, FileText, Image as ImageIconLucide, Sparkles, FilePenLine, Folder, Presentation, LayoutTemplate, Music, Terminal, Calendar, Network, Wand2, Cloud, Guitar, Star, ShoppingCart, Paintbrush, Briefcase, Phone, Cpu, MessageSquare, FileKey, View, Heart } from "lucide-react";
import OriaIconAnimation from '@/components/ui/oria-animation';

// App Components (Dynamically Imported)
const LazyWelcomeApp = dynamic(() => import('@/components/welcome-app'));
const LazyOria = dynamic(() => import('@/components/oria-xos'));
const LazyCloud = dynamic(() => import('@/components/cloud-app'));
const LazyExplorer = dynamic(() => import('@/components/explorer'));
const LazyFusion = dynamic(() => import('@/app/fusion/client'));
const LazyFlux = dynamic(() => import('@/components/flux-generator'));
const LazyMaestro = dynamic(() => import('@/components/maestro-generator'));
const LazyImage = dynamic(() => import('@/components/image-generator'));
const LazyBrandIdentity = dynamic(() => import('@/app/brand-identity/client'));
const LazyPromptor = dynamic(() => import('@/components/promptor-generator'));
const LazyMotion = dynamic(() => import('@/components/motion-generator'));
const LazyVoice = dynamic(() => import('@/components/voice-generator'));
const LazyText = dynamic(() => import('@/components/text-generator'));
const LazyEditor = dynamic(() => import('@/components/code-editor'));
const LazyFrame = dynamic(() => import('@/components/frame-generator'));
const LazyTerminal = dynamic(() => import('@/components/terminal'));
const LazyAgenda = dynamic(() => import('@/app/agenda/client'));
const LazyNexus = dynamic(() => import('@/components/nexus-generator'));
const LazyMuse = dynamic(() => import('@/components/muse-generator'));
const LazySound = dynamic(() => import('@/components/sound-generator'));
const LazyPalette = dynamic(() => import('@/components/palette-generator'));
const LazyTone = dynamic(() => import('@/components/tone-generator'));
const LazyPersona = dynamic(() => import('@/components/persona-generator'));
const LazyDeck = dynamic(() => import('@/components/deck-generator'));
const LazyCode = dynamic(() => import('@/components/code-generator'));
const LazyStoreApp = dynamic(() => import('@/components/store-app'));
const LazyCheckoutApp = dynamic(() => import('@/components/checkout-app'));
const LazyGalleryApp = dynamic(() => import('@/components/gallery-app'));
const LazyCollaborationsApp = dynamic(() => import('@/components/collaborations-app'));
const LazyCareersApp = dynamic(() => import('@/components/careers-app'));
const LazyContactApp = dynamic(() => import('@/components/contact-app'));
const LazyFormatApp = dynamic(() => import('@/components/format-app'));
const LazyConvertApp = dynamic(() => import('@/components/convert-app'));
const LazyPulseApp = dynamic(() => import('@/components/pulse-app'));
const LazyRealityApp = dynamic(() => import('@/components/reality-app'));
const LazyLightApp = dynamic(() => import('@/components/light-app'));
const LazyGoogleDriveApp = dynamic(() => import('@/components/google/drive-app'));
const LazyGoogleDocsApp = dynamic(() => import('@/components/google/docs-app'));
const LazyGoogleSheetsApp = dynamic(() => import('@/components/google/sheets-app'));
const LazyGoogleSlidesApp = dynamic(() => import('@/components/google/slides-app'));


// Google Suite Icons
const GoogleDriveIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.7451 22.2498L15.4902 9.74976L23.2353 22.2498L15.4902 22.2498L7.7451 22.2498Z" fill="#34A853"/>
    <path d="M0.764707 7.74976L8.50981 7.74976L16.2549 20.2498L8.50981 20.2498C4.34314 20.2498 0.764707 16.6713 0.764707 12.4998C0.764707 10.6664 1.45098 9.00957 2.60784 7.74976H0.764707Z" fill="#188038"/>
    <path d="M16.2549 20.2498L24 7.74976H8.50977L16.2549 20.2498Z" fill="#FFC107"/>
    <path d="M12.3725 1.75L2.60781 18.2547C1.45095 16.9949 0.764677 15.338 0.764677 13.5047C0.764677 9.33303 4.34311 5.75466 8.50977 5.75466H21.2941L12.3725 1.75Z" fill="#4285F4"/>
    <path d="M21.2941 5.75466H8.50978C8.50978 5.75466 17.647 5.75466 17.647 5.75466L21.2941 5.75466L24 1.75H12.3725L8.50978 7.74976H22.902L21.2941 5.75466Z" fill="#EA4335"/>
    <path d="M12.3725 1.75L21.2941 5.75466L17.647 5.75466L12.3725 1.75Z" fill="#1E88E5"/>
  </svg>
);

const GoogleDocsIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4285F4"/>
    <path d="M13 9H18L13 3V9Z" fill="#1967D2"/>
    <path d="M16 13H8V15H16V13Z" fill="white"/>
    <path d="M16 17H8V19H16V17Z" fill="white"/>
    <path d="M12 9H8V11H12V9Z" fill="white"/>
  </svg>
);

const GoogleSheetsIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#34A853"/>
    <path d="M13 9H18L13 3V9Z" fill="#1E8E3E"/>
    <path d="M15 13H12V16H9V13H6V11H9V8H12V11H15V13Z" fill="white"/>
  </svg>
);

const GoogleSlidesIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#FFC107"/>
    <path d="M13 9H18L13 3V9Z" fill="#F9AB00"/>
    <rect x="7" y="12" width="10" height="6" rx="1" fill="white"/>
  </svg>
);



export const ALL_APPS_CONFIG = [
    { id: 'welcome', name: 'Bienvenue', icon: Star, component: (props: any) => <LazyWelcomeApp {...props} />, defaultPos: { x: 80, y: 20 }, defaultSize: { width: 1000, height: 750 } },
    { id: 'pulse', name: 'Pulse', icon: Heart, component: (props: any) => <LazyPulseApp {...props} />, defaultPos: { x: 50, y: 50}, defaultSize: { width: 1200, height: 800 } },
    { id: 'cloud', name: '(X)cloud', icon: Cloud, component: (props: any) => <LazyCloud {...props} />, defaultPos: { x: 150, y: 50}, defaultSize: { width: 1200, height: 750 } },
    { id: 'explorer', name: '(X)plorer', icon: Folder, component: (props: any) => <LazyExplorer {...props} />, defaultPos: { x: 170, y: 50}, defaultSize: { width: 800, height: 550 } },
    { id: 'fusion', name: '(X)fusion', icon: Zap, component: (props: any) => <LazyFusion isPanel={true} {...props} />, defaultPos: { x: 290, y: 50}, defaultSize: { width: 1000, height: 750 } },
    { id: 'flux', name: '(X)flux', icon: Wand2, component: (props: any) => <LazyFlux {...props} />, defaultPos: { x: 530, y: 50 }, defaultSize: { width: 1000, height: 750 } },
    { id: 'maestro', name: 'Maestro', icon: BrainCircuit, component: (props: any) => <LazyMaestro {...props} />, defaultPos: { x: 650, y: 50 }, defaultSize: { width: 950, height: 700 } },
    { id: 'image', name: 'Image', icon: ImageIconLucide, component: (props: any) => <LazyImage {...props} />, defaultPos: { x: 770, y: 50 }, defaultSize: { width: 850, height: 650 } },
    { id: 'brand-identity', name: '(X)brand', icon: Layers, component: (props: any) => <LazyBrandIdentity {...props} />, defaultPos: { x: 890, y: 50 }, defaultSize: { width: 900, height: 600 } },
    { id: 'promptor', name: '(X)promptor', icon: Lightbulb, component: (props: any) => <LazyPromptor {...props} />, defaultPos: { x: 290, y: 170 }, defaultSize: { width: 900, height: 550 } },
    { id: 'motion', name: '(X)motion', icon: Film, component: (props: any) => <LazyMotion {...props} />, defaultPos: { x: 410, y: 170 }, defaultSize: { width: 850, height: 750 } },
    { id: 'voice', name: '(X)voice', icon: AudioLines, component: (props: any) => <LazyVoice {...props} />, defaultPos: { x: 530, y: 170 }, defaultSize: { width: 700, height: 500 } },
    { id: 'text', name: 'Texte', icon: FileText, component: (props: any) => <LazyText {...props} />, defaultPos: { x: 650, y: 170 }, defaultSize: { width: 700, height: 600 } },
    { id: 'editor', name: '(X).alpha', icon: SquareTerminal, component: (props: any) => <LazyEditor {...props} />, defaultPos: { x: 890, y: 170 }, defaultSize: { width: 1200, height: 800 } },
    { id: 'frame', name: '(X)frame', icon: LayoutTemplate, component: (props: any) => <LazyFrame {...props} />, defaultPos: { x: 170, y: 290 }, defaultSize: { width: 1100, height: 800 } },
    { id: 'terminal', name: '(X)term', icon: Terminal, component: (props: any) => <LazyTerminal {...props} />, defaultPos: { x: 410, y: 290 }, defaultSize: { width: 800, height: 500 } },
    { id: 'agenda', name: '(X)agenda', icon: Calendar, component: (props: any) => <LazyAgenda {...props} />, defaultPos: { x: 530, y: 290 }, defaultSize: { width: 950, height: 700 } },
    { id: 'nexus', name: '(X)nexus', icon: Network, component: (props: any) => <LazyNexus {...props} />, defaultPos: { x: 770, y: 290 }, defaultSize: { width: 700, height: 700 } },
    { id: 'muse', name: '(X)muse', icon: Guitar, component: (props: any) => <LazyMuse {...props} />, defaultPos: { x: 410, y: 50}, defaultSize: { width: 1200, height: 800 } },
    { id: 'sound', name: '(X)sound', icon: Music, component: (props: any) => <LazySound {...props} />, defaultPos: { x: 200, y: 200}, defaultSize: { width: 700, height: 550 } },
    { id: 'palette', name: '(X)palette', icon: Palette, component: (props: any) => <LazyPalette {...props} />, defaultPos: { x: 220, y: 220}, defaultSize: { width: 600, height: 500 } },
    { id: 'tone', name: '(X)tone', icon: Mic, component: (props: any) => <LazyTone {...props} />, defaultPos: { x: 240, y: 240}, defaultSize: { width: 600, height: 600 } },
    { id: 'persona', name: '(X)persona', icon: Users, component: (props: any) => <LazyPersona {...props} />, defaultPos: { x: 260, y: 260}, defaultSize: { width: 800, height: 700 } },
    { id: 'deck', name: 'Présentation', icon: Presentation, component: (props: any) => <LazyDeck {...props} />, defaultPos: { x: 280, y: 280}, defaultSize: { width: 900, height: 700 } },
    { id: 'code', name: '(X)code', icon: CodeXml, component: (props: any) => <LazyCode {...props} />, defaultPos: { x: 300, y: 300}, defaultSize: { width: 800, height: 700 } },
    { id: 'reality', name: '(X)reality', icon: View, component: (props: any) => <LazyRealityApp {...props} />, defaultPos: { x: 320, y: 320}, defaultSize: { width: 900, height: 600 } },
    { id: 'light', name: '(X)light', icon: Sparkles, component: (props: any) => <LazyLightApp {...props} />, defaultPos: { x: 100, y: 150 }, defaultSize: { width: 900, height: 700 } },
    { id: 'store', name: 'Boutique', icon: ShoppingCart, component: (props: any) => <LazyStoreApp {...props} />, defaultPos: { x: 100, y: 100 }, defaultSize: { width: 1200, height: 800 } },
    { id: 'checkout', name: 'Panier', icon: ShoppingCart, component: (props: any) => <LazyCheckoutApp {...props} />, defaultPos: { x: 120, y: 120 }, defaultSize: { width: 1000, height: 750 } },
    { id: 'gallery', name: 'Galerie', icon: Paintbrush, component: (props: any) => <LazyGalleryApp {...props} />, defaultPos: { x: 140, y: 140 }, defaultSize: { width: 1100, height: 800 } },
    { id: 'collaborations', name: 'Collaborations', icon: Users, component: (props: any) => <LazyCollaborationsApp {...props} />, defaultPos: { x: 160, y: 160 }, defaultSize: { width: 1000, height: 700 } },
    { id: 'careers', name: 'Carrières', icon: Briefcase, component: (props: any) => <LazyCareersApp {...props} />, defaultPos: { x: 180, y: 180 }, defaultSize: { width: 1000, height: 800 } },
    { id: 'contact', name: 'Contact', icon: Phone, component: (props: any) => <LazyContactApp {...props} />, defaultPos: { x: 200, y: 200 }, defaultSize: { width: 800, height: 600 } },
    { id: 'format', name: '(X)format', icon: FilePenLine, component: (props: any) => <LazyFormatApp {...props} />, defaultPos: { x: 220, y: 220 }, defaultSize: { width: 900, height: 700 } },
    { id: 'convert', name: '(X)change', icon: FileKey, component: (props: any) => <LazyConvertApp {...props} />, defaultPos: { x: 240, y: 240 }, defaultSize: { width: 900, height: 700 } },
    { id: 'oria', name: 'Oria', icon: OriaIconAnimation, component: (props: any) => <LazyOria {...props} />, defaultPos: { x: 300, y: 100 }, defaultSize: { width: 500, height: 650 } },
    // Google Suite Apps
    { id: 'google-drive', name: 'Google Drive', icon: GoogleDriveIcon, component: (props: any) => <LazyGoogleDriveApp {...props} />, defaultPos: { x: 300, y: 100 }, defaultSize: { width: 1000, height: 700 } },
    { id: 'google-docs', name: 'Google Docs', icon: GoogleDocsIcon, component: (props: any) => <LazyGoogleDocsApp {...props} />, defaultPos: { x: 320, y: 120 }, defaultSize: { width: 900, height: 700 } },
    { id: 'google-sheets', name: 'Google Sheets', icon: GoogleSheetsIcon, component: (props: any) => <LazyGoogleSheetsApp {...props} />, defaultPos: { x: 340, y: 140 }, defaultSize: { width: 900, height: 700 } },
    { id: 'google-slides', name: 'Google Slides', icon: GoogleSlidesIcon, component: (props: any) => <LazyGoogleSlidesApp {...props} />, defaultPos: { x: 360, y: 160 }, defaultSize: { width: 900, height: 700 } },
];
export type AppConfig = typeof ALL_APPS_CONFIG[0];

    