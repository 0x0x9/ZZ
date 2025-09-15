# (X)yzz.ai - Plateforme Créative IA

Ce projet est une application web Next.js 14+ conçue comme un écosystème créatif complet, intégrant une suite d'outils d'intelligence artificielle avec Genkit.

## Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript
- **Style**: Tailwind CSS & shadcn/ui
- **IA**: Google Genkit (avec Gemini)
- **Déploiement**: Prêt pour Vercel

## Démarrage Rapide

Pour lancer le projet en local, suivez ces étapes.

### 1. Prérequis

- Node.js (v18 ou supérieure)
- npm ou pnpm (recommandé)

### 2. Installation

Clonez le dépôt, puis installez les dépendances :
```bash
npm install
```

### 3. Configuration de l'IA (Très Important)

L'application utilise l'IA de Google (Gemini) via Genkit. Vous avez besoin d'une clé d'API pour que les fonctionnalités IA fonctionnent.

1.  **Créez une clé d'API** sur [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Copiez le fichier d'exemple d'environnement :**
    ```bash
    cp .env.local.example .env.local
    ```
3.  **Ajoutez votre clé :** Ouvrez le fichier `.env.local` et collez votre clé à la place de `VOTRE_CLE_API_GOOGLE_GEMINI`.

### 4. Lancer le Projet

Exécutez la commande suivante pour démarrer le serveur de développement Next.js et l'inspecteur de Genkit :
```bash
npm run dev
```

-   Votre site sera accessible sur [http://localhost:9002](http://localhost:9002).
-   L'**inspecteur de Genkit** sera sur [http://localhost:4000](http://localhost:4000). **Cet outil est essentiel** pour voir les traces, les flux et les appels à l'IA en temps réel. C'est votre meilleur ami pour déboguer les fonctionnalités IA.

## Déploiement sur Vercel

Le projet est optimisé pour Vercel.

1.  Connectez votre dépôt GitHub à Vercel.
2.  Dans les paramètres de votre projet Vercel, ajoutez une variable d'environnement nommée `GOOGLE_API_KEY` avec la valeur de votre clé Gemini.
3.  Chaque `push` sur la branche principale déclenchera un déploiement automatique.

## Structure du Projet

-   `/src/app/` : Pages et routes de l'application (Next.js App Router).
-   `/src/components/` : Composants React réutilisables.
-   `/src/ai/` : Toute la logique liée à l'intelligence artificielle.
    -   `/src/ai/flows/` : Les "flux" Genkit. Un flux est une fonction qui orchestre un ou plusieurs appels à une IA pour accomplir une tâche (ex: générer une image, créer un plan de projet).
    -   `/src/ai/genkit.ts` : Configuration centrale de Genkit.
-   `/src/lib/` : Fonctions utilitaires, données statiques, etc.
-   `/src/hooks/` : Hooks React personnalisés.
