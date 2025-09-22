
import {
  Wand2,
  BrainCircuit,
  Palette,
  LayoutTemplate,
  Film,
  CheckCircle,
  Users,
  Cloud,
  Heart,
  Webhook,
  DollarSign,
  Share2,
  FolderKanban
} from 'lucide-react';
import {
  NotionLogo,
  StripeLogo,
  FigmaLogo,
  DiscordLogo,
  SlackLogo,
  ShopifyLogo,
  ZapierLogo,
  GoogleDriveLogo,
  OpenaiLogo,
  GeminiLogo,
  ClaudeLogo
} from '@/components/ui/icons';

export const copy = {
  hero: {
    title: "LIGHT",
    subtitle: "La lumière de vos projets.\nDe l’étincelle à l’impact.",
    paragraph:
      "Un lieu simple et puissant où l’inspiration devient œuvre, et l’œuvre devient valeur.",
    ctaPrimary: "Lancer l’environnement",
    ctaSecondary: "En savoir plus",
  },
  friction: {
    title: "Une idée.\nPuis le bruit. Puis… le silence.",
    text:
      "LIGHT efface la friction. Vous retrouvez l’essentiel : votre vision.\nLe reste s’aligne.",
  },
  pillars: {
    h2: "De l’étincelle à l’impact",
    cards: [
      {
        title: "Trouver",
        hint: "(Inspiration)",
        desc:
          "Oria, ambiances, moodboards, prompts guidés.\nL’étincelle naît, la page blanche disparaît.",
      },
      {
        title: "Faire",
        hint: "(Création)",
        desc:
          "Brief vivant, tâches, timer focus, rendus IA.\nVotre projet avance, naturellement.",
      },
      {
        title: "Vendre",
        hint: "(Monétisation)",
        desc:
          "Landing, pitch, identité, paiements.\nDe l’idée au marché, sans détour.",
      },
    ],
  },
  symphony: {
    h2: "Vos outils se parlent. Vous créez.",
    p: "Oria orchestre (X)palette, (X)frame et (X)motion.\nTout communique. L’interface suit vos intentions.",
    items: [
      { label: "(X)palette", desc: "Couleurs, mood, assets" },
      { label: "(X)frame", desc: "Prototypage, génération" },
      { label: "(X)motion", desc: "Vidéo & audio IA" },
    ],
  },
  advantages: {
    h3: "Tout pour créer. Tout pour concrétiser.",
    points: [
      { icon: Wand2, title: "Oria IA", desc: "Conseils contextuels, auto-brief, génération." },
      { icon: BrainCircuit, title: "Flow sans friction", desc: "Tâches, timer, snapshots. Synchronisés." },
      { icon: Webhook, title: "Ouvert par design", desc: "Notion, Google, Slack, Discord, Webhooks." },
      { icon: DollarSign, title: "Monétisation intégrée", desc: "Stripe, Gumroad, Shopify." },
      { icon: Share2, title: "Diffusion instantanée", desc: "Pages, exports, kits média." },
      { icon: FolderKanban, title: "Dock projets", desc: "Fenêtres XOS, verre & halos. Discret, puissant." },
    ],
  },
  integrations: {
    h3: "Connecté à vos outils.",
    p: "LIGHT n’est pas un silo : c’est un hub.\nBranchez vos workflows, accélérez vos résultats.",
    badges: [
      { name: "OpenAI / Gemini / Claude", icon: Wand2 },
      { name: "Notion", icon: NotionLogo },
      { name: "Google Drive", icon: GoogleDriveLogo },
      { name: "Figma", icon: FigmaLogo },
      { name: "Discord", icon: DiscordLogo },
      { name: "Slack", icon: SlackLogo },
      { name: "Stripe", icon: StripeLogo },
      { name: "Shopify", icon: ShopifyLogo },
      { name: "Gumroad", icon: Users },
      { name: "Zapier / Make", icon: ZapierLogo },
    ],
  },
  credo: {
    h2: "Ce n’est pas une suite d’outils.\nC’est votre orchestre.",
    p: "Trouver. Faire. Vendre.\nLIGHT coordonne tout, avec la précision d’Oria et la liberté de vos APIs.",
    cta: "Lancer l’environnement",
  },
};
