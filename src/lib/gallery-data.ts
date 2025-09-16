
import imageData from '@/lib/placeholder-images.json';

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
    image: imageData.gallery.crystal_city.src,
    imageHint: imageData.gallery.crystal_city.hint,
    tool: "(X)image",
    prompt: "A sprawling cosmic city made of shimmering crystals, floating in a nebula, cinematic lighting, hyperrealistic, 8K."
  },
  {
    id: 2,
    title: "Forêt enchantée au crépuscule",
    author: "PixelWitch",
    image: imageData.gallery.enchanted_forest.src,
    imageHint: imageData.gallery.enchanted_forest.hint,
    tool: "(X)image",
    prompt: "An enchanted forest at twilight, ancient trees with glowing runes, a soft mist on the ground, fireflies everywhere, style of Studio Ghibli."
  },
  {
    id: 3,
    title: "Maquette App Météo",
    author: "UIDesigner",
    image: imageData.gallery.weather_app.src,
    imageHint: imageData.gallery.weather_app.hint,
    tool: "(X)frame",
    prompt: "A sleek and modern weather app interface, dark mode, with glassmorphism effects and vibrant weather icons."
  },
  {
    id: 4,
    title: "Le Gardien du Temps",
    author: "StoryWeaver",
    image: imageData.gallery.time_keeper.src,
    imageHint: imageData.gallery.time_keeper.hint,
    tool: "(X)flux",
    prompt: "Générer un concept de personnage pour un roman de fantasy steampunk : un vieil horloger qui est en réalité le gardien du temps."
  },
   {
    id: 5,
    title: "Robot jardinier",
    author: "AI_Dreamer",
    image: imageData.gallery.robot_gardener.src,
    imageHint: imageData.gallery.robot_gardener.hint,
    tool: "(X)image",
    prompt: "A friendly robot tending to a lush garden on a futuristic balcony overlooking a bustling sci-fi city."
  },
  {
    id: 6,
    title: "Portrait Néo-Pop",
    author: "ColorQueen",
    image: imageData.gallery.pop_art.src,
    imageHint: imageData.gallery.pop_art.hint,
    tool: "(X)image",
    prompt: "A vibrant pop art portrait of a woman with colorful geometric patterns in the background, bold colors, style of Andy Warhol."
  },
];
