# (X)yzz.ai - Plateforme Créative IA

Ce projet est une application web Next.js 14+ conçue comme un écosystème créatif complet, intégrant une suite d'outils d'intelligence artificielle avec Genkit.

## Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript
- **Style**: Tailwind CSS & shadcn/ui
- **IA**: Google Genkit (avec Gemini)
- **Déploiement**: Firebase App Hosting

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
2.  Créez un fichier `.env` à la racine du projet.
3.  Ajoutez votre clé dans ce fichier :
    ```
    GOOGLE_API_KEY=VOTRE_CLE_API_GOOGLE_GEMINI
    ```

### 4. Lancer le Projet

Exécutez la commande suivante pour démarrer le serveur de développement Next.js et l'inspecteur de Genkit :
```bash
npm run dev
```

-   Votre site sera accessible sur [http://localhost:9002](http://localhost:9002).
-   L'**inspecteur de Genkit** sera sur [http://localhost:4000](http://localhost:4000). **Cet outil est essentiel** pour voir les traces, les flux et les appels à l'IA en temps réel. C'est votre meilleur ami pour déboguer les fonctionnalités IA.

## Déploiement sur Firebase App Hosting

Le projet est optimisé pour Firebase App Hosting.

1.  Assurez-vous d'avoir la [Firebase CLI](https://firebase.google.com/docs/cli) installée et d'être connecté à votre compte Google.
2.  Connectez votre projet local à un projet Firebase : `firebase projects:add`.
3.  Déployez votre backend avec la commande :
    ```bash
    firebase apphosting:backends:create
    ```
4.  Dans le processus de création, n'oubliez pas de configurer le secret `GOOGLE_API_KEY` avec la valeur de votre clé API Gemini.

## Structure du Projet

-   `/src/app/` : Pages et routes de l'application (Next.js App Router).
-   `/src/components/` : Composants React réutilisables.
-   `/src/ai/` : Toute la logique liée à l'intelligence artificielle.
    -   `/src/ai/flows/` : Les "flux" Genkit. Un flux est une fonction qui orchestre un ou plusieurs appels à une IA pour accomplir une tâche (ex: générer une image, créer un plan de projet).
    -   `/src/ai/genkit.ts` : Configuration centrale de Genkit.
-   `/src/lib/` : Fonctions utilitaires, données statiques, etc.
-   `/src/hooks/` : Hooks React personnalisés.
