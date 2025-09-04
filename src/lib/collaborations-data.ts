
export type CollaborationPost = {
  id: number;
  author: string;
  avatar: string;
  imageHint: string;
  title: string;
  description: string;
  skills: string[];
  type: 'Recherche de projet' | 'Offre de service' | 'Portfolio';
};

export const collaborationPosts: CollaborationPost[] = [
  {
    id: 1,
    author: "Alice Martin",
    avatar: "https://picsum.photos/seed/alice/256/256",
    imageHint: "woman portrait professional",
    title: "Développeuse Frontend React",
    description: "Disponible pour des missions freelance. J'aide les startups à construire des interfaces rapides et élégantes.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    type: "Offre de service",
  },
  {
    id: 2,
    author: "Bob Dupont",
    avatar: "https://picsum.photos/seed/bob/256/256",
    imageHint: "man portrait creative",
    title: "Musicien & Sound Designer",
    description: "Je compose des bandes sonores originales et des effets sonores pour des jeux vidéo et des films. Ouvert aux collaborations.",
    skills: ["Composition", "Ableton Live", "Sound Design", "Mixage"],
    type: "Offre de service",
  },
  {
    id: 3,
    author: "Studio Nebula",
    avatar: "https://picsum.photos/seed/nebula_logo/800/800",
    imageHint: "abstract space logo",
    title: "Recherche Motion Designer pour un court-métrage",
    description: "Nous recherchons un motion designer talentueux pour créer les animations de titre et les effets visuels de notre prochain court-métrage de science-fiction.",
    skills: ["After Effects", "Motion Graphics", "Animation 2D"],
    type: "Recherche de projet",
  },
  {
    id: 4,
    author: "Clara Garcia",
    avatar: "https://picsum.photos/seed/clara/256/256",
    imageHint: "woman portrait design",
    title: "Mon Portfolio de Design UI/UX",
    description: "Découvrez mes derniers projets, de la recherche utilisateur à la maquette haute-fidélité. Construit avec (X)frame.",
    skills: ["UI/UX", "Figma", "Design System", "Recherche Utilisateur"],
    type: "Portfolio",
  },
   {
    id: 5,
    author: "David Moreau",
    avatar: "https://picsum.photos/seed/david/256/256",
    imageHint: "man portrait tech",
    title: "Expert en IA Générative",
    description: "Je conçois et j'intègre des solutions d'IA sur mesure pour automatiser vos workflows créatifs. Consultant disponible.",
    skills: ["IA Générative", "Genkit", "Python", "API"],
    type: "Offre de service",
  },
  {
    id: 6,
    author: "E-commerce Vision",
    avatar: "https://picsum.photos/seed/ecom_logo/800/800",
    imageHint: "modern startup logo",
    title: "Besoin d'un logo pour notre nouvelle marque",
    description: "Nous sommes une nouvelle marque de vêtements durables et nous cherchons un designer pour créer un logo percutant et mémorable.",
    skills: ["Branding", "Logo Design", "Illustration"],
    type: "Recherche de projet",
  },
];
