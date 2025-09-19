
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  hint: string;
  category: 'Matériel' | 'Logiciel' | 'Accessoire';
  isFeatured: boolean;
  configurable?: boolean;
  hasPerformanceChart?: boolean;
  features?: string[];
  specs?: Record<string, string>;
  tagline?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "(X)-fi",
    description: "Le summum de la puissance créative. Pour celles et ceux qui repoussent les limites de ce qu’une machine peut faire… et de ce qu’un esprit peut créer. Ce n'est pas qu'un ordinateur. C’est un studio, une galerie, une scène, un lab.",
    price: 4499.00,
    images: [
        "https://picsum.photos/seed/xphi1/800/800",
        "https://picsum.photos/seed/xphi2/800/800",
        "https://picsum.photos/seed/xphi3/800/800",
        "https://picsum.photos/seed/xphi4/800/800"
    ],
    hint: "powerful desktop computer",
    category: 'Matériel',
    isFeatured: true,
    configurable: true,
    hasPerformanceChart: true,
    tagline: "La Station Ultime.",
    features: [
      "Puissance de calcul extrême pour la 3D, le dev et le montage 8K.",
      "Flexibilité totale avec la double compatibilité GPU (NVIDIA/AMD).",
      "Multitâche ultra-fluide grâce à 96 Go de RAM DDR5 extensible.",
      "Châssis premium en aluminium, silencieux et évolutif."
    ],
    specs: {
      "Système": "(X) OS – Studio Edition, avec support natif Windows/macOS via partitions intelligentes (X) SYNC Bridge.",
      "Processeur": "Intel® Core i9-14900K ou AMD Ryzen 9 7950X — 24 cœurs / 32 threads.",
      "Carte graphique": "NVIDIA RTX 4080 Super ou AMD Radeon RX 7900 XTX (Autres GPU disponibles).",
      "Mémoire vive": "96 Go DDR5 (extensible à 192Go).",
      "Stockage": "8TB SSD + 12TB HDD",
      "Refroidissement": "Système hybride silencieux (air/liquide) avec ventilation adaptative.",
      "Boîtier": "Moyen-tour compact en alliage d’aluminium noir satiné, éclairage sobre configurable.",
      "Connectique": "4×USB-C, 4×USB 3.2, 2×DisplayPort 2.1, HDMI 2.1, Ethernet 2.5 GbE, SD Express, Wi-Fi 6E.",
      "Audio": "DAC intégré 32 bits haute fidélité, prises audio jack pro isolées.",
      "Inclus": "1 an d'abonnement (X) SYNC et accès (X)OS Bêta",
      "Garantie": "2 ans (extensible) + support prioritaire pour les créatifs pro."
    }
  },
  {
    id: 10,
    name: "(X)-alpha",
    tagline: "Un petit format pour les grands projets.",
    description: "α (alpha), c’est la réponse à celles et ceux qui veulent tout : performance, design et la  mobilité d’un studio transportable.",
    price: 2499.00,
    images: [
        "https://picsum.photos/seed/xalpha/800/800",
    ],
    hint: "compact powerful desktop",
    category: 'Matériel',
    isFeatured: true,
    configurable: true,
    hasPerformanceChart: true,
    features: [
      "Processeur haute fréquence pour les charges créatives lourdes.",
      "GPU puissant pour le rendu 3D et le montage 8K.",
      "64 Go de RAM DDR5 pour une productivité sans faille.",
      "Châssis compact en aluminium avec option de portabilité."
    ],
    specs: {
        "Processeur": "AMD Ryzen 9 7950X3D ou Intel Core i9-14900K",
        "Carte graphique": "NVIDIA RTX 4080 Super FE (compacte) ou AMD Radeon RX 7900 XT",
        "Mémoire vive": "64 Go DDR5 (extensible à 128 Go)",
        "Stockage": "SSD M.2 NVMe Gen4 – 2 To, + baie secondaire libre",
        "Refroidissement": "Watercooling compact et airflow intelligent optimisé pour le silence",
        "Carte mère": "Micro-ATX haut de gamme (PCIe 5.0, Wi-Fi 6E, Bluetooth 5.3)",
        "Boîtier": "Châssis aluminium, sobre et modulaire (option poignées)",
        "Alimentation": "850W modulaire 80+ Platinum, silencieuse",
        "OS Inclus": "(X)OS avec compatibilité Windows/macOS via (X)SYNC",
        "Accès": "(X) Bêta pour tester les futures versions de (X)OS"
    }
  },
   {
    id: 8,
    name: "(X)-book",
    tagline: "La puissance d'une station de travail, l'élégance en plus.",
    description: "La puissance d'une station de travail dans un format portable et élégant, pour créer n'importe où.",
    price: 2899.00,
    images: ["https://picsum.photos/seed/xbook/800/800"],
    hint: "sleek laptop",
    category: 'Matériel',
    isFeatured: true,
    configurable: false,
    hasPerformanceChart: true,
    features: ["Écran Liquid Retina XDR 14 pouces", "Puce (X)OS Fusion A1 avec Neural Engine", "Jusqu'à 18h d'autonomie", "Clavier Magique rétroéclairé", "Châssis unibody en aluminium recyclé"],
    specs: {
        "Processeur": "Puce (X)OS Fusion A1",
        "Mémoire": "32 Go de mémoire unifiée",
        "Stockage": "1 To SSD",
        "Écran": "Écran Liquid Retina XDR 14,2 pouces",
        "Batterie": "Jusqu'à 18 heures d'autonomie"
    }
  },
  {
    id: 9,
    name: "(X)-oméga",
    tagline: "Le choix logique pour créer sans se ruiner.",
    description: "Le choix logique des créatifs qui veulent créer vite, bien, et sans se ruiner. Un prix contenu, une vision ambitieuse, des performances solides.",
    price: 1999.00,
    images: [
        "https://picsum.photos/seed/xomega/800/800",
    ],
    hint: "sleek modern desktop computer",
    category: 'Matériel',
    isFeatured: false,
    configurable: true,
    hasPerformanceChart: true,
    features: [
        "Processeur Intel Core i7 ou AMD Ryzen 7", 
        "(X)OS préinstallé avec compatibilité Windows/macOS", 
        "32 Go de RAM DDR5 (extensible)", 
        "Stockage SSD NVMe Gen4 ultra-rapide", 
        "Carte graphique NVIDIA RTX série 40"
    ],
    specs: {
        "Processeur": "Intel Core i7-14700K ou AMD Ryzen 7 7800X3D",
        "Carte graphique": "NVIDIA GeForce RTX 4070 Ti Super",
        "Mémoire": "32 Go DDR5",
        "Stockage": "2 To SSD NVMe Gen4 + 8To HDD",
        "Connectique": "USB-C 10 Gbps, HDMI 2.1, DisplayPort 1.4, Ethernet 2.5 GbE",
        "Boîtier": "Moyen-tour compact, aluminium brossé",
        "Refroidissement": "Ventirad haute performance silencieux"
    }
  },
  {
    id: 2,
    name: "Abonnement XOS Pro",
    description: "Accès illimité à la suite d'outils IA (X)yzz et 1 To de stockage cloud.",
    price: 299.00,
    images: ["https://picsum.photos/seed/xospro/800/800"],
    hint: "software box interface",
    category: 'Logiciel',
    isFeatured: true,
    configurable: false,
    tagline: "L'écosystème créatif complet.",
    features: ["Suite complète d'outils IA", "1 To de stockage (X)cloud", "Support prioritaire 24/7", "Accès aux bêtas"],
  },
  {
    id: 3,
    name: "Tablette Graphique X-Pen",
    description: "Précision et sensibilité inégalées pour donner vie à vos créations numériques.",
    price: 499.00,
    images: ["https://picsum.photos/seed/xpen/800/800"],
    hint: "graphics tablet",
    category: 'Accessoire',
    isFeatured: true,
    configurable: false,
    features: ["8192 niveaux de pression", "Détection de l'inclinaison à 60°", "Pointe de précision interchangeable", "Connexion magnétique au X-Book"],
  },
  {
    id: 4,
    name: "Casque Audio Studio X-Sound",
    description: "Un son neutre et détaillé pour le mixage et le mastering. Confort longue durée.",
    price: 349.00,
    images: ["https://picsum.photos/seed/xsound/800/800"],
    hint: "studio headphones",
    category: 'Accessoire',
    isFeatured: false,
    configurable: false,
    features: ["Audio spatial avec suivi dynamique de la tête", "Transducteurs haute-fidélité de 40mm", "Réduction de bruit active de pointe", "Mode Transparence adaptatif"],
  },
  {
    id: 5,
    name: "Moniteur (X)-Vision Pro",
    description: "Un écran 4K tactile Mini LED de 27 pouces qui redéfinit l'interaction créative. Conçu pour les professionnels de l'image, il offre une fidélité des couleurs et une luminosité exceptionnelles.",
    price: 1499.00,
    images: ["https://picsum.photos/seed/xvision/800/800"],
    hint: "computer monitor touch screen",
    category: 'Matériel',
    isFeatured: false,
    configurable: false,
    hasPerformanceChart: false,
    features: [
      "Dalle 27 pouces 4K (163 DPI) pour une netteté absolue.",
      "Technologie Mini LED pour des noirs profonds et un contraste spectaculaire.",
      "Luminosité de pointe HDR de 1600 nits.",
      "Hub USB-C avec Power Delivery de 96W pour connecter et charger votre laptop.",
      "Calibrage d'usine Delta E < 1 pour une précision des couleurs parfaite."
    ],
    specs: {
      "Taille de l'écran": "27 pouces (diagonale)",
      "Technologie de la dalle": "Mini LED avec Full-Array Local Dimming",
      "Résolution": "4K UHD (3840 x 2160 pixels) à 120Hz",
      "Densité de pixels": "163 DPI (points par pouce)",
      "Luminosité": "1000 nits (SDR), 1600 nits (HDR en pointe)",
      "Couleurs": "Profondeur de couleur 10-bit, 99% DCI-P3, 100% sRGB",
      "Connectique": "1x USB-C / Thunderbolt 4 (96W PD), 1x DisplayPort 1.4, 2x HDMI 2.1, 3x USB-A 3.2",
      "Fonctionnalités": "Capteur de luminosité ambiante, mode KVM intégré, support ergonomique réglable"
    }
  },
  {
    id: 6,
    name: "Plugin (X)flux pour FCPX",
    description: "Intégrez la puissance de l'orchestration IA directement dans Final Cut Pro X pour transformer vos idées en plans de montage structurés en quelques secondes.",
    price: 99.00,
    images: ["https://picsum.photos/seed/xfluxplugin/800/800"],
    hint: "software plugin interface",
    category: 'Logiciel',
    isFeatured: false,
    configurable: false,
    tagline: "Votre chef de projet IA dans FCPX.",
    features: ["Analyse de brief de projet", "Génération de plans de montage", "Suggestions de séquences et de rythmes", "Intégration transparente à FCPX"],
  },
   {
    id: 7,
    name: "Clavier Mécanique X-Type",
    description: "Conçu pour le confort et la rapidité, avec des raccourcis pour tous les logiciels créatifs.",
    price: 179.00,
    images: ["https://picsum.photos/seed/xtype/800/800"],
    hint: "mechanical keyboard",
    category: 'Accessoire',
    isFeatured: false,
    configurable: false,
  },
];
