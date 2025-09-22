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
      "Dans chaque idée, il y a une promesse. Une étincelle fragile, souvent étouffée par le bruit, les doutes, la complexité. LIGHT existe pour protéger cette étincelle. Pour lui donner la place de grandir, se transformer en projet, puis en réussite. Ici, vos idées ne se perdent plus : elles trouvent leur chemin.",
    ctaPrimary: "Lancer l’environnement",
    ctaSecondary: "En savoir plus",
  },
  friction: {
    title: "Une idée.\nPuis le chaos. Et si tout devenait clair ?",
    text:
      "Fichiers éparpillés, outils dispersés, inspiration qui s’évapore. LIGHT réduit le bruit, aligne les pièces, et vous ramène à l’essentiel : créer.",
  },
  pillars: {
    h2: "De l’étincelle à l’impact",
    cards: [
      {
        title: "Trouver",
        hint: "(Inspiration)",
        desc:
          "Commencez par rien… et repartez avec une vision. Oria, notre IA créative, vous pose les bonnes questions, génère des concepts, des slogans, des ambiances. Un espace immersif (X)Inspire vous plonge dans la lumière créative : sons, images, atmosphères qui stimulent vos sens. Vous n’êtes jamais seul devant la page blanche.",
      },
      {
        title: "Faire",
        hint: "(Création)",
        desc:
          "Une idée n’a de valeur que si elle devient un projet. Avec LIGHT, structurez naturellement : brief vivant, tâches intelligentes, fenêtres XOS translucides, timer focus. Prototypage, rendus visuels, textes, musiques — vos outils IA se combinent, vos ressources se synchronisent. Vous ne perdez pas de temps à organiser. Vous avancez.",
      },
      {
        title: "Vendre",
        hint: "(Monétisation)",
        desc:
          "Créer ne suffit pas. Encore faut-il partager, diffuser, monétiser. LIGHT connecte votre projet au monde réel : Landing page générée automatiquement, pitch deck IA, identité visuelle. Puis, vendez directement via Stripe, Gumroad, Shopify, Patreon, NFT, ou vos propres canaux. De l’idée au marché, sans friction.",
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
    p: "Trouver. Faire. Vendre.\nLIGHT vous accompagne de A à Z, de l’idée au succès, avec la précision d’Oria et la liberté des API.",
    cta: "Lancer l’environnement",
  },
};
