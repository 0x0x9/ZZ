

/**
 * @fileOverview Centralized Zod schemas and TypeScript types for all AI flows.
 * This file does not contain the 'use server' directive and can be safely
 * imported by both server-side flows and client-side components.
 */

import { z } from 'zod';

// Shared base for code-related schemas
const CodeInputBaseSchema = z.object({
  language: z.string().describe("Le langage de programmation du code."),
  code: z.string().describe("Le bloc de code à analyser ou modifier."),
});

// From: src/ai/flows/debug-code.ts
export const DebugCodeInputSchema = CodeInputBaseSchema;
export type DebugCodeInput = z.infer<typeof DebugCodeInputSchema>;

export const DebugCodeOutputSchema = z.object({
  fixedCode: z.string().describe("Le code corrigé. S'il n'y a pas de bug, retourne le code original. Doit être formaté dans un bloc markdown."),
  explanation: z.string().describe("Une explication en français du bug trouvé et de la correction appliquée. Si aucun bug n'est trouvé, le mentionner."),
});
export type DebugCodeOutput = z.infer<typeof DebugCodeOutputSchema>;


// From: src/ai/flows/explain-code.ts
export const ExplainCodeInputSchema = CodeInputBaseSchema;
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

export const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe("Une explication claire et concise en français sur le fonctionnement du code et son utilisation."),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;


// From: src/ai/flows/generate-code.ts & refactor-code.ts
export const GenerateCodeInputSchema = z.object({
  prompt: z.string().describe("La requête de l'utilisateur pour un extrait de code."),
  language: z.string().describe("Le langage de programmation pour l'extrait de code (ex: 'typescript', 'python')."),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

export const RefactorCodeInputSchema = CodeInputBaseSchema.extend({
    prompt: z.string().describe("Les instructions pour la refactorisation."),
});
export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

export const GenerateCodeOutputSchema = z.object({
  code: z.string().describe("L'extrait de code généré, formaté dans un bloc markdown."),
  explanation: z.string().describe("Une brève explication sur le fonctionnement et l'utilisation du code."),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;


// From: src/ai/flows/generate-ideas.ts
export const GenerateIdeasInputSchema = z.object({
  prompt: z.string().describe("Une description vague d'une idée ou d'une ambiance."),
});
export type GenerateIdeasInput = z.infer<typeof GenerateIdeasInputSchema>;

export const GenerateIdeasOutputSchema = z.object({
  imagePrompts: z.array(z.string()).describe("Une liste de 3 prompts d'image détaillés et créatifs, en anglais, pour un générateur d'images IA."),
  titles: z.array(z.string()).describe("Une liste de 3 suggestions de titres accrocheurs, en français."),
  styles: z.array(z.string()).describe("Une liste de 3 suggestions de styles artistiques ou de tons (ex: 'Néonoir, 'Aquarelle surréaliste', 'Comédie décalée')."),
});
export type GenerateIdeasOutput = z.infer<typeof GenerateIdeasOutputSchema>;


// From: src/ai/flows/generate-image.ts
export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe("Le prompt à utiliser pour générer l'image."),
  style: z.string().optional().describe("Le style artistique pour l'image (ex: 'Photorealistic', 'Anime', 'Impressionism')."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;


// From: src/ai/flows/generate-moodboard.ts
export const GenerateMoodboardInputSchema = z.object({
  prompts: z.array(z.string()).describe('Une liste de prompts pour générer des images.'),
});
export type GenerateMoodboardInput = z.infer<typeof GenerateMoodboardInputSchema>;

export const GenerateMoodboardOutputSchema = z.object({
    imageDataUris: z.array(z.string()).describe("Les images générées sous forme de data URIs."),
});
export type GenerateMoodboardOutput = z.infer<typeof GenerateMoodboardOutputSchema>;


// From: src/ai/flows/generate-motion.ts
export const GenerateMotionInputSchema = z.object({
  prompt: z.string().describe("Une description de la vidéo à créer."),
});
export type GenerateMotionInput = z.infer<typeof GenerateMotionInputSchema>;

const SceneSchema = z.object({
    narration: z.string().describe("Le texte de la voix off pour cette scène. Doit faire une ou deux phrases."),
});

export const VideoScriptSchema = z.object({
  title: z.string().describe("Un titre court et accrocheur pour la vidéo."),
  scenes: z.array(SceneSchema).min(3).max(6).describe("Un tableau de 3 à 6 scènes qui composent la vidéo."),
  coverImagePrompt: z.string().describe("Un prompt d'image unique et détaillé, en anglais, pour générer une image de couverture pour la vidéo. Il doit capturer l'essence de toute la vidéo."),
});
export type VideoScript = z.infer<typeof VideoScriptSchema>;

export const GenerateMotionOutputSchema = VideoScriptSchema.extend({
  // The motion flow itself only returns the script. Image generation is separate.
});
export type GenerateMotionOutput = z.infer<typeof GenerateMotionOutputSchema>;


// From: src/ai/flows/generate-nexus.ts
export const GenerateNexusInputSchema = z.object({
  prompt: z.string().describe("L'idée centrale pour la carte mentale."),
});
export type GenerateNexusInput = z.infer<typeof GenerateNexusInputSchema>;

// Correctly define recursive schema for NexusNode
type NexusNode = {
    id: string;
    label: string;
    children?: NexusNode[];
};

const baseNexusNodeSchema: z.ZodType<Omit<NexusNode, 'children'>> = z.object({
  id: z.string().describe("Un identifiant unique pour le nœud (ex: 'root.1.2')."),
  label: z.string().describe("Le texte affiché pour ce nœud."),
});

export const NexusNodeSchema: z.ZodType<NexusNode> = baseNexusNodeSchema.extend({
  children: z.lazy(() => NexusNodeSchema.array()).optional(),
});


export const GenerateNexusOutputSchema = z.object({
  mindMap: NexusNodeSchema.describe("Le nœud racine de la carte mentale générée."),
});
export type GenerateNexusOutput = z.infer<typeof GenerateNexusOutputSchema>;
export type Nexus = GenerateNexusOutput; // Alias for component usage


// From: src/ai/flows/generate-palette.ts
export const GeneratePaletteInputSchema = z.object({
  prompt: z.string().describe("Une description d'un thème, d'une ambiance ou d'une scène pour générer une palette de couleurs."),
});
export type GeneratePaletteInput = z.infer<typeof GeneratePaletteInputSchema>;

export const ColorSchema = z.object({
    hex: z.string().describe("Le code couleur HEX, comme '#RRGGBB'."),
    name: z.string().describe("Un nom créatif et descriptif pour la couleur."),
});

export const GeneratePaletteOutputSchema = z.object({
  palette: z.array(ColorSchema).length(6).describe("Un tableau de 6 couleurs formant une palette harmonieuse."),
  paletteName: z.string().describe("Un nom créatif pour la palette entière."),
});
export type GeneratePaletteOutput = z.infer<typeof GeneratePaletteOutputSchema>;


// From: src/ai/flows/generate-persona.ts
export const GeneratePersonaInputSchema = z.object({
  prompt: z.string().describe("Une description du projet pour lequel générer des personas."),
});
export type GeneratePersonaInput = z.infer<typeof GeneratePersonaInputSchema>;

export const PersonaSchema = z.object({
    name: z.string().describe("Un nom et prénom crédible pour le persona (en français)."),
    avatarPrompt: z.string().describe("Un prompt d'image en anglais, très détaillé, pour générer un portrait de ce persona (ex: 'photo realistic portrait of a 35 year old female architect, smiling, natural light')."),
    bio: z.string().describe("Une biographie de 2-3 phrases qui décrit le style de vie et la personnalité du persona (en français)."),
    motivations: z.array(z.string()).describe("Une liste de 2 à 3 motivations clés pour ce persona en lien avec le projet (en français)."),
    frustrations: z.array(z.string()).describe("Une liste de 2 à 3 frustrations ou problèmes que ce persona rencontre (en français)."),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const GeneratePersonaOutputSchema = z.object({
  personas: z.array(PersonaSchema).min(2).max(3).describe("Un tableau de 2 ou 3 personas détaillés. Tous les champs textuels doivent être en français, sauf avatarPrompt."),
});
export type GeneratePersonaOutput = z.infer<typeof GeneratePersonaOutputSchema>;


// From: src/ai/flows/parse-event.ts
export const ParseEventInputSchema = z.object({
  prompt: z.string().describe("La requête en langage naturel pour créer un événement."),
  currentDate: z.string().describe("La date actuelle au format ISO (YYYY-MM-DDTHH:mm:ss.sssZ) pour la référence temporelle."),
});
export type ParseEventInput = z.infer<typeof ParseEventInputSchema>;

export const AgendaEventSchema = z.object({
  title: z.string().describe("Le titre de l'événement."),
  date: z.string().describe("La date de l'événement au format YYYY-MM-DD."),
  time: z.string().describe("L'heure de l'événement au format HH:mm sur 24 heures."),
});
export type AgendaEvent = z.infer<typeof AgendaEventSchema>;


// From: src/ai/flows/generate-schedule.ts
export const GenerateScheduleInputSchema = z.object({
  prompt: z.string().describe("Une description du projet ou de l'idée de l'utilisateur."),
});
export type GenerateScheduleInput = z.infer<typeof GenerateScheduleInputSchema>;

const ChecklistItemSchema = z.object({
  text: z.string().describe("Le texte de l'élément de la checklist."),
  completed: z.boolean().describe("Indique si la tâche est terminée."),
});

export const ProjectPlanSchema = z.object({
  id: z.string().optional().describe("ID unique pour le projet, peut être généré côté client/serveur."),
  title: z
    .string()
    .optional()
    .describe("Un titre créatif et engageant pour le projet. Doit être en français et refléter l'essence de l'idée."),
  creativeBrief: z.string().optional().describe("Un paragraphe de 3-4 phrases qui définit la vision, le ton, le style et le public cible du projet. C'est la direction artistique."),
  tasks: z.array(
    z.object({
      title: z.string().describe('Le titre de la tâche, court et commençant par un verbe d\'action (ex: "Écrire le script").'),
      description: z.string().describe('Une description claire en 1 ou 2 phrases de ce que la tâche implique concrètement.'),
      category: z
        .string()
        .describe(
          'La phase du projet à laquelle la tâche appartient. Utilisez exclusivement une des catégories suivantes : "Stratégie & Recherche", "Pré-production", "Création & Production", "Post-production & Lancement".'
        ),
      duration: z.string().describe("Une estimation de la durée de la tâche (ex: '2 jours', '1 semaine')."),
      checklist: z.array(ChecklistItemSchema).describe("Une checklist de 2 à 4 sous-tâches ou points de vérification très concrets pour accomplir la tâche principale.")
    })
  ).min(5).describe("Une liste d'au moins 5 tâches concrètes et bien définies nécessaires pour réaliser le projet."),
  imagePrompts: z.array(z.string()).min(1).describe("Une liste d'au moins 1 prompt unique et très descriptif, en anglais, pour générer un moodboard visuel sur Midjourney ou DALL-E. Ce prompt doit être directement inspiré du brief créatif."),
  events: z.array(AgendaEventSchema).optional().describe("Une liste d'événements d'agenda extraits de la demande de l'utilisateur, le cas échéant."),
});
export type ProjectPlan = z.infer<typeof ProjectPlanSchema>;


// From: src/ai/flows/generate-text.ts
export const GenerateTextInputSchema = z.object({
  prompt: z.string().describe("Le prompt à utiliser pour générer du contenu textuel."),
});
export type GenerateTextInput = z.infer<typeof GenerateTextInputSchema>;

export const GenerateTextOutputSchema = z.object({
  text: z.string().describe('Le contenu textuel généré.'),
});
export type GenerateTextOutput = z.infer<typeof GenerateTextOutputSchema>;


// From: src/ai/flows/generate-tone.ts
export const GenerateToneInputSchema = z.object({
  prompt: z.string().describe("Une description de la marque ou du projet pour lequel définir le ton."),
});
export type GenerateToneInput = z.infer<typeof GenerateToneInputSchema>;

export const GenerateToneOutputSchema = z.object({
    adjectives: z.array(z.string()).length(3).describe("Une liste de 3 adjectifs clés qui définissent le ton."),
    dos: z.array(z.string()).describe("Une liste de 2 à 3 choses à faire pour respecter ce ton."),
    donts: z.array(z.string()).describe("Une liste de 2 à 3 choses à ne pas faire."),
    examples: z.array(z.string()).describe("Une liste de 1 à 2 exemples de phrases qui illustrent parfaitement le ton."),
});
export type GenerateToneOutput = z.infer<typeof GenerateToneOutputSchema>;


// From: src/ai/flows/generate-voice.ts
export const GenerateVoiceInputSchema = z.object({
  text: z.string().describe('Le texte à convertir en parole.'),
  voice: z.string().describe('La voix pré-construite à utiliser pour la génération. Ex: "Algenib"'),
});
export type GenerateVoiceInput = z.infer<typeof GenerateVoiceInputSchema>;

export const GenerateVoiceOutputSchema = z.object({
  audioDataUri: z.string().describe("L'audio généré sous forme de data URI au format WAV."),
});
export type GenerateVoiceOutput = z.infer<typeof GenerateVoiceOutputSchema>;


// From: src/ai/flows/generate-deck.ts
export const DeckSlideSchema = z.object({
  title: z.string().describe("Le titre de la diapositive."),
  content: z.array(z.string()).describe("Une liste de points clés ou de contenu textuel pour la diapositive."),
  imagePrompt: z.string().describe("Un prompt en anglais pour générer une image d'arrière-plan ou une illustration pour la diapositive."),
  speakerNotes: z.string().describe("Notes pour l'orateur pour cette diapositive."),
});
export type DeckSlide = z.infer<typeof DeckSlideSchema>;

export const GenerateDeckInputSchema = z.object({
  prompt: z.string().describe("Le sujet ou l'objectif de la présentation."),
});
export type GenerateDeckInput = z.infer<typeof GenerateDeckInputSchema>;

export const GenerateDeckOutputSchema = z.object({
  title: z.string().describe("Le titre global de la présentation."),
  slides: z.array(DeckSlideSchema).describe("Une liste de diapositives composant la présentation."),
});
export type GenerateDeckOutput = z.infer<typeof GenerateDeckOutputSchema>;


// From: src/ai/flows/generate-frame.ts
export const GenerateFrameInputSchema = z.object({
  prompt: z.string().optional().describe("Une description de l'interface utilisateur à créer. Peut être vide si une image est fournie."),
  photoDataUri: z.string().optional().describe(
    "Une image d'inspiration optionnelle (data URI) pour le design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateFrameInput = z.infer<typeof GenerateFrameInputSchema>;

export const GenerateFrameOutputSchema = z.object({
  explanation: z.string().describe("Une explication claire du composant, sa structure, ses dépendances (shadcn/ui, lucide-react) et comment l'utiliser."),
  htmlCode: z.string().describe("Le code JSX complet du composant React, incluant les imports nécessaires. Doit utiliser les composants shadcn/ui et Tailwind CSS."),
  cssCode: z.string().describe("Le CSS personnalisé, à utiliser uniquement pour les styles complexes non réalisables avec Tailwind. Souvent vide."),
  jsCode: z.string().describe("Doit être vide. La logique JS est dans le composant `htmlCode`."),
});
export type GenerateFrameOutput = z.infer<typeof GenerateFrameOutputSchema>;
export type Frame = GenerateFrameOutput; // Alias for component usage


// From: src/ai/flows/generate-sound.ts
export const GenerateSoundInputSchema = z.object({
  prompt: z.string().describe("Une description du son ou de la musique à générer."),
});
export type GenerateSoundInput = z.infer<typeof GenerateSoundInputSchema>;

export const GenerateSoundOutputSchema = z.object({
  audioDataUri: z.string().describe("L'audio généré sous forme de data URI au format WAV."),
  description: z.string().describe("La description textuelle du son qui a été vocalisée."),
});
export type GenerateSoundOutput = z.infer<typeof GenerateSoundOutputSchema>;


// From: src/ai/flows/generate-flux.ts
export const GenerateFluxInputSchema = z.object({
  prompt: z.string().describe("L'objectif de haut niveau de l'utilisateur. Ex: 'Je suis musicien et je veux lancer mon nouveau single'"),
  job: z.string().optional().describe("Le métier de l'utilisateur. Ex: 'Réalisateur', 'Développeur'. Aide à mieux choisir les outils."),
});
export type GenerateFluxInput = z.infer<typeof GenerateFluxInputSchema>;

export const FluxAnalysisOutputSchema = z.object({
  tools: z.array(z.string()).describe("La liste des ID d'outils à utiliser (ex: ['projectPlan', 'palette', 'tone']). 'projectPlan' est obligatoire."),
});
export type FluxAnalysisOutput = z.infer<typeof FluxAnalysisOutputSchema>;

export const GenerateFluxOutputSchema = z.object({
    projectPlan: ProjectPlanSchema.optional(),
    palette: GeneratePaletteOutputSchema.optional(),
    tone: GenerateToneOutputSchema.optional(),
    personas: GeneratePersonaOutputSchema.optional(),
    ideas: GenerateIdeasOutputSchema.optional(),
    deck: GenerateDeckOutputSchema.optional(),
    frame: GenerateFrameOutputSchema.optional(),
    text: GenerateTextOutputSchema.optional(),
    motion: VideoScriptSchema.optional(),
    nexus: GenerateNexusOutputSchema.optional(),
    code: GenerateCodeOutputSchema.optional(),
    agenda: z.array(AgendaEventSchema).optional(),
});
export type GenerateFluxOutput = z.infer<typeof GenerateFluxOutputSchema>;


// From: src/ai/flows/generate-muse.ts
export const GenerateMuseInputSchema = z.object({
  theme: z.string().describe("Le thème ou sujet principal du morceau."),
  mood: z.string().describe("L'ambiance ou l'émotion recherchée."),
  tempo: z.string().describe("Le tempo souhaité (lent, modéré, rapide)."),
  references: z.string().optional().describe("Artistes, auteurs ou œuvres de référence (facultatif)."),
});
export type GenerateMuseInput = z.infer<typeof GenerateMuseInputSchema>;

const ArtistSchema = z.object({
  name: z.string().describe("Le nom de l'artiste suggéré."),
  reason: z.string().describe("Une brève explication de la pertinence de cette suggestion."),
});

const SongSuggestionSchema = z.object({
    artist: z.string().describe("L'artiste de la chanson suggérée."),
    songTitle: z.string().describe("Le titre de la chanson suggérée."),
});

export const GenerateMuseOutputSchema = z.object({
  mainStyle: z.string().describe("Le style musical principal recommandé."),
  subGenres: z.array(z.string()).describe("Une liste de 2 à 3 sous-genres ou styles à combiner."),
  similarArtists: z.array(ArtistSchema).length(5).describe("Une liste de 5 artistes similaires ou inspirants."),
  songSuggestions: z.array(SongSuggestionSchema).describe("Une liste de 3 à 5 suggestions de chansons spécifiques qui correspondent au style demandé."),
  initialLyrics: z.string().describe("Un court texte de paroles (ex: un couplet et un refrain) inspiré par la demande de l'utilisateur, pour démarrer la session d'écriture."),
});
export type GenerateMuseOutput = z.infer<typeof GenerateMuseOutputSchema>;


// From: src/ai/flows/copilot-lyrics.ts
export const CopilotLyricsInputSchema = z.object({
  textToEdit: z.string().describe("La partie de texte sélectionnée que l'utilisateur veut modifier."),
  fullText: z.string().describe("L'intégralité du texte pour le contexte."),
  mood: z.string().describe("L'ambiance générale du morceau (ex: 'mélancolique', 'énergique')."),
  action: z.enum(['ENHANCE', 'RHYMES']).describe("L'action à effectuer : 'ENHANCE' pour améliorer le texte, ou 'RHYMES' pour trouver des rimes."),
});
export type CopilotLyricsInput = z.infer<typeof CopilotLyricsInputSchema>;

export const CopilotLyricsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe("Une liste de suggestions, soit des lignes améliorées, soit des rimes."),
});
export type CopilotLyricsOutput = z.infer<typeof CopilotLyricsOutputSchema>;


// From: src/ai/flows/reformat-text-with-prompt.ts
export const ReformatTextWithPromptInputSchema = z.object({
  text: z.string().describe('The text to be reformatted.'),
  prompt: z.string().describe('The prompt to guide the reformatting process.'),
});
export type ReformatTextWithPromptInput = z.infer<typeof ReformatTextWithPromptInputSchema>;

export const ReformatTextWithPromptOutputSchema = z.object({
  reformattedText: z.string().describe('The reformatted text.'),
});
export type ReformatTextWithPromptOutput = z.infer<typeof ReformatTextWithPromptOutputSchema>;


// From: src/ai/flows/convert-image.ts
export const ConvertImageInputSchema = z.object({
    image: z.string().describe("The input image as a data URI."),
    outputFormat: z.enum(['jpeg', 'png', 'webp']).describe("The desired output format."),
    removeTransparency: z.boolean().optional().describe("Whether to remove transparency and fill with a white background."),
});
export type ConvertImageInput = z.infer<typeof ConvertImageInputSchema>;

export const ConvertImageOutputSchema = z.object({
    convertedImageUri: z.string().describe("The converted image as a data URI."),
    originalMimeType: z.string().describe("The MIME type of the original image.")
});
export type ConvertImageOutput = z.infer<typeof ConvertImageOutputSchema>;

// From: src/ai/flows/generate-light-mood.ts
export const GenerateLightMoodInputSchema = z.object({
  prompt: z.string().describe("Une description d'une ambiance, un thème ou une émotion."),
});
export type GenerateLightMoodInput = z.infer<typeof GenerateLightMoodInputSchema>;

export const GenerateLightMoodOutputSchema = z.object({
  title: z.string().describe("Un titre poétique pour l'ambiance."),
  description: z.string().describe("Une courte description de l'ambiance."),
  colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).length(5).describe("Une palette de 5 couleurs en format HEX."),
  keywords: z.array(z.string()).length(5).describe("Une liste de 5 mots-clés pertinents."),
  imagePrompts: z.array(z.string()).length(4).describe("Une liste de 4 prompts d'image détaillés."),
});
export type GenerateLightMoodOutput = z.infer<typeof GenerateLightMoodOutputSchema>;

// From: src/ai/flows/generate-video.ts
export const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe("A text description of the video to generate."),
  photoDataUri: z.string().optional().describe("An optional starting image for image-to-video generation, as a data URI."),
  durationSeconds: z.number().optional().default(5).describe("The duration of the video in seconds."),
  aspectRatio: z.enum(['16:9', '9:16']).optional().default('16:9').describe("The aspect ratio of the video."),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export const GenerateVideoOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a data URI."),
  contentType: z.string().describe("The MIME type of the video, e.g., 'video/mp4'."),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

// From: src/ai/flows/configure-pc.ts
export const ConfigurePcInputSchema = z.object({
    product: z.string().describe("Le nom du produit à configurer (ex: '(X)-fi')"),
    job: z.string().describe("Le métier ou le rôle principal de l'utilisateur (ex: 'Monteur vidéo', 'Développeur 3D')."),
    software: z.string().describe("Les logiciels principaux que l'utilisateur utilise (ex: 'DaVinci Resolve, Unreal Engine 5, Blender')."),
    priority: z.enum(['performance', 'storage', 'balanced']).describe("La priorité de l'utilisateur: performance brute, capacité de stockage, ou un équilibre performance/prix."),
});
export type ConfigurePcInput = z.infer<typeof ConfigurePcInputSchema>;

export const PcConfigurationSchema = z.object({
  cpu: z.string().describe("Le nom exact du processeur recommandé."),
  gpu: z.string().describe("Le nom exact de la carte graphique recommandée."),
  ram: z.string().describe("La quantité de RAM recommandée (ex: '64GB DDR5')."),
  storage: z.string().describe("La configuration de stockage recommandée (ex: '4TB NVMe SSD')."),
});
export type Configuration = z.infer<typeof PcConfigurationSchema>;


export const ConfigurePcOutputSchema = z.object({
  modelName: z.string().describe("Le nom du modèle de base recommandé (ex: '(X)-fi')."),
  configuration: PcConfigurationSchema,
  justification: z.string().describe("Une explication claire et concise des raisons de cette recommandation, en liant les choix de composants aux besoins de l'utilisateur."),
});
export type ConfigurePcOutput = z.infer<typeof ConfigurePcOutputSchema>;


// IMPORTANT: The Oria schemas must be defined LAST, after all the schemas
// they might reference in their `data` union type.

// From: src/ai/flows/oria-chat.ts
export const OriaHistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string().describe("Le contenu textuel du message."),
});
export type OriaHistoryMessage = z.infer<typeof OriaHistoryMessageSchema>;

export const OriaChatInputSchema = z.object({
  prompt: z.string().describe("La requête ou le besoin de l'utilisateur."),
  context: z.enum(['homepage', 'xos', 'dock']).optional().describe("Le contexte d'où la requête est émise (ex: page d'accueil, bureau (X)OS, ou la barre d'outils)."),
  history: z.array(OriaHistoryMessageSchema).optional().describe("L'historique des messages précédents pour maintenir le contexte."),
});
export type OriaChatInput = z.infer<typeof OriaChatInputSchema>;

// Temporary schema for image generation output within Oria
const GenerateImageOutputSchema = z.object({
    imageDataUri: z.string().describe("L'image générée sous forme de data URI."),
});

const OriaToolResponseSchema = z.object({
  type: z.enum(['tool_result']),
  tool: z.enum([
    'text',
    'palette',
    'tone',
    'persona',
    'promptor',
    'motion',
    'voice',
    'code',
    'deck',
    'frame',
    'sound',
    'nexus',
    'image',
    'flux'
  ]),
  response: z
    .string()
    .describe(
      "Une phrase d'introduction courte et amicale de la part d'Oria présentant le résultat. Ex: 'Voici le texte que vous avez demandé :', 'J'ai généré cette palette pour vous.'"
    ),
  promptForTool: z
    .string()
    .optional()
    .describe(
      "Le prompt original de l'utilisateur qui a déclenché ce résultat d'outil."
    ),
  data: z.union([
    GenerateTextOutputSchema,
    GeneratePaletteOutputSchema,
    GenerateToneOutputSchema,
    GeneratePersonaOutputSchema,
    GenerateIdeasOutputSchema,
    VideoScriptSchema,
    GenerateVoiceOutputSchema,
    GenerateCodeOutputSchema,
    GenerateDeckOutputSchema,
    GenerateFrameOutputSchema,
    GenerateSoundOutputSchema,
    GenerateNexusOutputSchema,
    GenerateImageOutputSchema,
    GenerateFluxOutputSchema,
  ]),
});

export const OriaSimpleResponseSchema = z.object({
  type: z.enum(['response']),
  response: z
    .string()
    .describe(
      "Réponse conversationnelle directe d'Oria à l'utilisateur lorsqu'aucun outil n'est utilisé."
    ),
});

const OriaRedirectSchema = z.object({
  type: z.enum(['redirect']),
  tool: z.enum([
    'maestro',
    'fusion',
    'editor',
    'brand-identity',
    'promptor',
    'motion',
    'image',
    'frame',
    'agenda',
    'nexus',
    'voice',
    'sound',
    'deck',
    'text',
    'code',
    'flux',
    'palette',
    'persona',
    'tone',
    'terminal',
    'muse',
  ]),
  response: z
    .string()
    .describe(
      "Une réponse amicale d'Oria suggérant une redirection vers un outil ou une page plus complexe."
    ),
  promptForTool: z
    .string()
    .optional()
    .describe(
      "Si l'outil est 'fusion', c'est une liste d'outils séparés par des virgules. Sinon, c'est le prompt à passer à la page de l'outil."
    ),
  data: GenerateFluxOutputSchema.optional(),
});

export const OriaChatOutputSchema = z.union([
  OriaToolResponseSchema,
  OriaSimpleResponseSchema,
  OriaRedirectSchema,
]);
export type OriaChatOutput = z.infer<typeof OriaChatOutputSchema>;


// (X)cloud types
export const DocSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  mimeType: z.string(),
  size: z.number(),
  createdAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime().nullable(),
  shareId: z.string().nullable(),
});
export type Doc = z.infer<typeof DocSchema>;

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['upload', 'edit', 'share', 'comment']),
  docName: z.string(),
  userName: z.string(),
  timestamp: z.string().datetime(),
});
export type Activity = z.infer<typeof ActivitySchema>;

  
