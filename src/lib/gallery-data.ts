
export type GalleryItem = {
  id: number;
  title: string;
  author: string;
  image: string;
  imageHint: string;
  tool: '(X)image' | '(X)flux' | '(X)frame';
  prompt: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Cité de cristal cosmique",
    author: "ArtExplorer",
    image: "https://picsum.photos/seed/crystal_city/800/600",
    imageHint: "futuristic crystal city",
    tool: "(X)image",
    prompt: "A sprawling cosmic city made of shimmering crystals, floating in a nebula, cinematic lighting, hyperrealistic, 8K."
  },
  {
    id: 2,
    title: "Forêt enchantée au crépuscule",
    author: "PixelWitch",
    image: "https://picsum.photos/seed/enchanted_forest/800/1000",
    imageHint: "enchanted forest twilight",
    tool: "(X)image",
    prompt: "An enchanted forest at twilight, ancient trees with glowing runes, a soft mist on the ground, fireflies everywhere, style of Studio Ghibli."
  },
  {
    id: 3,
    title: "Maquette App Météo",
    author: "UIDesigner",
    image: "https://picsum.photos/seed/weather_app/800/600",
    imageHint: "weather app interface",
    tool: "(X)frame",
    prompt: "A sleek and modern weather app interface, dark mode, with glassmorphism effects and vibrant weather icons."
  },
  {
    id: 4,
    title: "Le Gardien du Temps",
    author: "StoryWeaver",
    image: "https://picsum.photos/seed/time_keeper/800/1200",
    imageHint: "clock steampunk man",
    tool: "(X)flux",
    prompt: "Générer un concept de personnage pour un roman de fantasy steampunk : un vieil horloger qui est en réalité le gardien du temps."
  },
   {
    id: 5,
    title: "Robot jardinier",
    author: "AI_Dreamer",
    image: "https://picsum.photos/seed/robot_gardener/800/900",
    imageHint: "robot futuristic garden",
    tool: "(X)image",
    prompt: "A friendly robot tending to a lush garden on a futuristic balcony overlooking a bustling sci-fi city."
  },
  {
    id: 6,
    title: "Portrait Néo-Pop",
    author: "ColorQueen",
    image: "https://picsum.photos/seed/pop_art/800/800",
    imageHint: "colorful pop art portrait",
    tool: "(X)image",
    prompt: "A vibrant pop art portrait of a woman with colorful geometric patterns in the background, bold colors, style of Andy Warhol."
  },
];
