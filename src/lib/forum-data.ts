

import imageData from '@/lib/placeholder-images.json';

export type Topic = {
  id: number;
  title: string;
  author: string;
  avatar: string;
  hint: string;
  category: "Matériel" | "Logiciel" | "Accessoire" | "Collaborations" | "Discussions";
  replies: number;
  views: number;
  lastActivity: string;
};

export const mockPosts: Topic[] = [
  {
    id: 1,
    title: "Comment optimiser le rendu 3D sur la Station X-1 ?",
    author: "Alexandre D.",
    avatar: imageData.general.user_avatar.src,
    hint: imageData.general.user_avatar.hint,
    category: "Matériel",
    replies: 12,
    views: 120,
    lastActivity: "il y a 2 heures",
  },
  {
    id: 2,
    title: "Partage : Mes premiers essais avec le plugin (X)flux",
    author: "Juliette L.",
    avatar: imageData.general.user_avatar.src,
    hint: imageData.general.user_avatar.hint,
    category: "Logiciel",
    replies: 5,
    views: 89,
    lastActivity: "il y a 5 heures",
  },
  {
    id: 3,
    title: "Recherche coloriste pour un projet d'animation",
    author: "Studio Anima",
    avatar: imageData.collaborations.nebula_logo.src,
    hint: imageData.collaborations.nebula_logo.hint,
    category: "Collaborations",
    replies: 2,
    views: 45,
    lastActivity: "il y a 1 jour",
  },
  {
    id: 4,
    title: "Avis sur la tablette X-Pen pour l'illustration ?",
    author: "Clara M.",
    avatar: imageData.general.user_avatar.src,
    hint: imageData.general.user_avatar.hint,
    category: "Accessoire",
    replies: 23,
    views: 250,
    lastActivity: "il y a 2 jours",
  },
];

export type Reply = {
  id: number;
  author: string;
  avatar: string;
  hint: string;
  timestamp: string;
  content: string;
  likes: number;
};

export const mockReplies: Record<number, Reply[]> = {
  1: [
    {
      id: 101,
      author: "Juliette L.",
      avatar: imageData.general.user_avatar.src,
      hint: imageData.general.user_avatar.hint,
      timestamp: "il y a 2 heures",
      content: "Salut Alexandre ! Perso, je suis passé sur le dernier driver NVIDIA Studio, ça a bien aidé. Tu as vérifié si tes drivers sont à jour ?",
      likes: 15,
    },
    {
      id: 102,
      author: "Thomas G.",
      avatar: imageData.general.user_avatar.src,
      hint: imageData.general.user_avatar.hint,
      timestamp: "il y a 1 heure",
      content: "Bonne question. Je baisse souvent le nombre de samples pour les previews et je l'augmente uniquement pour le rendu final. C'est basique mais ça change la vie.",
      likes: 8,
    },
     {
      id: 103,
      author: "Alexandre D.",
      avatar: imageData.general.user_avatar.src,
      hint: imageData.general.user_avatar.hint,
      timestamp: "il y a 30 minutes",
      content: "Merci pour vos retours ! @Juliette, je vais checker les drivers, bonne idée. @Thomas, oui je fais ça aussi, mais même le rendu final est très long sur ma scène actuelle.",
      likes: 2,
    },
  ],
  2: [
     {
      id: 201,
      author: "Alexandre D.",
      avatar: imageData.general.user_avatar.src,
      hint: imageData.general.user_avatar.hint,
      timestamp: "il y a 4 heures",
      content: "Super intéressant ton retour ! Je n'ai pas encore osé me lancer avec (X)flux, ça a l'air puissant mais un peu intimidant.",
      likes: 5,
    },
  ],
};
