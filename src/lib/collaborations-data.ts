

import imageData from '@/lib/placeholder-images.json';

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
    avatar: imageData.collaborations.alice.src,
    imageHint: imageData.collaborations.alice.hint,
    title: "Développeuse Frontend React",
    description: "Disponible pour des missions freelance. J'aide les startups à construire des interfaces rapides et élégantes.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    type: "Offre de service",
  },
  {
    id: 2,
    author: "Bob Dupont",
    avatar: imageData.collaborations.bob.src,
    imageHint: imageData.collaborations.bob.hint,
    title: "Musicien & Sound Designer",
    description: "Je compose des bandes sonores originales et des effets sonores pour des jeux vidéo et des films. Ouvert aux collaborations.",
    skills: ["Composition", "Ableton Live", "Sound Design", "Mixage"],
    type: "Offre de service",
  },
  {
    id: 3,
    author: "Studio Nebula",
    avatar: imageData.collaborations.nebula_logo.src,
    imageHint: imageData.collaborations.nebula_logo.hint,
    title: "Recherche Motion Designer pour un court-métrage",
    description: "Nous recherchons un motion designer talentueux pour créer les animations de titre et les effets visuels de notre prochain court-métrage de science-fiction.",
    skills: ["After Effects", "Motion Graphics", "Animation 2D"],
    type: "Recherche de projet",
  },
  {
    id: 4,
    author: "Clara Garcia",
    avatar: imageData.collaborations.clara.src,
    imageHint: imageData.collaborations.clara.hint,
    title: "Mon Portfolio de Design UI/UX",
    description: "Découvrez mes derniers projets, de la recherche utilisateur à la maquette haute-fidélité. Construit avec (X)frame.",
    skills: ["UI/UX", "Figma", "Design System", "Recherche Utilisateur"],
    type: "Portfolio",
  },
   {
    id: 5,
    author: "David Moreau",
    avatar: imageData.collaborations.david.src,
    imageHint: imageData.collaborations.david.hint,
    title: "Expert en IA Générative",
    description: "Je conçois et j'intègre des solutions d'IA sur mesure pour automatiser vos workflows créatifs. Consultant disponible.",
    skills: ["IA Générative", "Genkit", "Python", "API"],
    type: "Offre de service",
  },
  {
    id: 6,
    author: "E-commerce Vision",
    avatar: imageData.collaborations.ecom_logo.src,
    imageHint: imageData.collaborations.ecom_logo.hint,
    title: "Besoin d'un logo pour notre nouvelle marque",
    description: "Nous sommes une nouvelle marque de vêtements durables et nous cherchons un designer pour créer un logo percutant et mémorable.",
    skills: ["Branding", "Logo Design", "Illustration"],
    type: "Recherche de projet",
  },
];
