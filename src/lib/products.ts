
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
    name: "(X)-φ (fi)",
    description: "Le summum de la puissance créative. Pour celles et ceux qui repoussent les limites de ce qu’une machine peut faire… et de ce qu’un esprit peut créer. Ce n'est pas qu'un ordinateur. C’est un studio, une galerie, une scène, un lab.",
    price: 4499.00,
    images: [
        "/images/store/x-phi-1.webp",
        "/images/store/x-phi-2.webp",
        "/images/store/x-phi-3.webp",
        "/images/store/x-phi-4.webp"
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
      "Processeur (CPU)": "Intel® Core i9-14900K (24 cœurs, jusqu'à 6.0 GHz) ou AMD Ryzen 9 7950X3D",
      "Graphiques (GPU)": "Jusqu'à 2x NVIDIA RTX 5090 ou 2x AMD Radeon RX 7900 XTX via (X)bridge",
      "Mémoire": "96 Go DDR5 (ext. 192 Go)",
      "Stockage": "8 To NVMe Gen5 + 12 To HDD (RAID en option)",
      "Réseau": "10 GbE, Wi-Fi 7, Bluetooth 5.4",
      "Connectivité": "Avant: 2x USB-C (Thunderbolt 5), 2x USB-A, Lecteur SD | Arrière: Multiples ports USB-C, USB-A, DisplayPort 2.1, HDMI 2.1",
      "Alimentation": "1600W 80+ Titanium",
      "Thermique & acoustique": "Refroidissement liquide sur mesure, ~22 dB en charge",
      "Châssis": "Boîtier sur mesure, flux d’air optimisé, halo LED discret",
      "Dimensions & poids": "210mm × 450mm × 480mm, ~18 kg",
      "Système": "(X)OS (Windows modifié) + Linux + macOS (via Mac Bridge), multi-boot xBoot"
    }
  },
  {
    id: 10,
    name: "(X)-α (alpha)",
    tagline: "Un petit format pour les grands projets.",
    description: "α (alpha), c’est la réponse à celles et ceux qui veulent tout : performance, design et la  mobilité d’un studio transportable.",
    price: 2499.00,
    images: [
        "/images/store/x-alpha.webp",
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
    name: "(X)-π (pi)",
    tagline: "La puissance d'une station de travail, l'élégance en plus.",
    description: "La puissance d'une station de travail dans un format portable et élégant, pour créer n'importe où.",
    price: 2899.00,
    images: ["/images/store/x-pi.webp"],
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
    id: 11,
    name: "(X)-Σ (sigma)",
    tagline: "La puissance créative accessible.",
    description: "Un design compact, élégant et optimisé par (X)OS pour libérer vos idées. La porte d'entrée parfaite vers notre écosystème.",
    price: 899.00,
    images: ["/images/store/x-sigma.webp"],
    hint: "compact elegant computer",
    category: "Matériel",
    isFeatured: true,
    configurable: false,
    hasPerformanceChart: true,
    features: [
      "Processeur Intel i5-10400",
      "Graphiques Intel UHD intégrés",
      "16 Go de RAM DDR4 (extensible à 32 Go)",
      "SSD NVMe 512 Go ultra-rapide",
      "(X)OS inclus avec accès aux outils IA"
    ],
    specs: {
      "Processeur": "Intel Core i5-10400",
      "Carte graphique": "Intel UHD Graphics 630",
      "Mémoire": "16 Go DDR4",
      "Stockage": "512 Go SSD NVMe",
      "Connectique": "USB-C, USB 3.2, HDMI, Ethernet",
      "Boîtier": "Compact en aluminium recyclé",
      "OS Inclus": "(X)OS avec compatibilité Windows/macOS via (X)SYNC"
    }
  },
  {
    id: 9,
    name: "(X)-Ω (oméga)",
    tagline: "Le choix logique pour créer sans se ruiner.",
    description: "Le choix logique des créatifs qui veulent créer vite, bien, et sans se ruiner. Un prix contenu, une vision ambitieuse, des performances solides.",
    price: 1999.00,
    images: [
        "/images/store/x-omega.webp",
    ],
    hint: "sleek modern desktop computer",
    category: 'Matériel',
    isFeatured: false,
    configurable: true,
    hasPerformanceChart: true,
    features: [
        "Processeur Intel Core i7-12400KF",
        "(X)OS préinstallé avec compatibilité Windows/macOS",
        "32 Go de RAM DDR5 (extensible)",
        "Stockage SSD NVMe et HDD rapide",
        "Technologie GPU (X)bridge AMD"
    ],
    specs: {
        "Processeur": "Intel Core i7-12400KF",
        "Carte graphique": "(X)bridge (AMD) 8Go VRAM",
        "Mémoire": "32 Go DDR5",
        "Stockage": "2To SSD NVMe + 2To HDD",
        "Connectique": "USB-C 10 Gbps, HDMI 2.1, DisplayPort 1.4, Ethernet 2.5 GbE",
        "Boîtier": "Moyen-tour compact, aluminium brossé",
        "Refroidissement": "Watercooling"
    }
  },
  {
    id: 2,
    name: "Abonnement XOS Pro",
    description: "Accès illimité à la suite d'outils IA (X)yzz et 1 To de stockage cloud.",
    price: 299.00,
    images: ["/images/store/xos-pro.webp"],
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
    images: ["/images/store/x-pen.webp"],
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
    images: ["/images/store/x-sound.webp"],
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
    images: ["/images/store/x-vision.webp"],
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
    images: ["/images/store/x-flux-plugin.webp"],
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
    images: ["/images/store/x-type.webp"],
    hint: "mechanical keyboard",
    category: 'Accessoire',
    isFeatured: false,
    configurable: false,
  },
];

    