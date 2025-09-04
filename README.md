# (X)yzz.ai

Plateforme créative IA Next.js 14+ (App Router, TypeScript, Tailwind, ShadCN UI, Genkit, Vercel ready). Ce projet est conçu pour être une base solide et performante pour des applications web modernes intégrant des fonctionnalités d'intelligence artificielle.

## Démarrage en Local

Suivez ces étapes pour lancer le projet sur votre machine.

### 1. Pré-requis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### 2. Installation

Clonez le projet, puis installez les dépendances :
```bash
npm install
```

### 3. Configuration de l'Environnement

L'écosystème IA de ce projet utilise Google Gemini, qui nécessite une clé d'API.

1.  Copiez le fichier d'exemple `.env.local.example` en un nouveau fichier nommé `.env.local` :
    ```bash
    cp .env.local.example .env.local
    ```
2.  Ouvrez le fichier `.env.local` et remplacez `VOTRE_CLE_API_GOOGLE_GEMINI` par votre propre clé d'API Google. Vous pouvez en obtenir une sur [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Lancer le Serveur de Développement

Lancez la commande suivante pour démarrer le serveur de développement Next.js ainsi que les outils de débogage de Genkit (l'IA) :

```bash
npm run dev
```

- Votre site sera accessible sur [http://localhost:9002](http://localhost:9002).
- L'inspecteur de Genkit sera sur [http://localhost:4000](http://localhost:4000). Cet outil vous permet de voir les traces, les flux et les appels à l'IA en temps réel.

## Déploiement sur Vercel

1.  **Connectez votre repo GitHub à Vercel.**
2.  **Ajoutez les variables d'environnement dans Vercel :**
    - Dans les paramètres de votre projet Vercel, ajoutez une variable d'environnement nommée `GOOGLE_API_KEY` avec la valeur de votre clé Gemini.
3.  Chaque `push` sur la branche principale déclenchera un déploiement automatique.

## Structure du Projet

-   `/src/app/` : Pages et routes de l'application (Next.js App Router).
-   `/src/components/` : Composants React réutilisables.
-   `/src/ai/` : Logique liée à l'intelligence artificielle.
    -   `/src/ai/flows/` : Tous les flows Genkit. Un flow est une fonction qui orchestre un ou plusieurs appels à une IA.
    -   `/src/ai/genkit.ts` : Point d'entrée de la configuration de Genkit.
    -   `/src/ai/dev.ts` : Script pour le serveur de développement de Genkit.
-   `/public/` : Fichiers statiques (images, polices, etc.).
-   `/src/lib/` : Fonctions utilitaires et données statiques.
-   `/src/hooks/` : Hooks React personnalisés.

## Stack Technologique

-   **Framework :** Next.js 14+ (App Router)
-   **Langage :** TypeScript
-   **Style :** Tailwind CSS & ShadCN UI
-   **IA :** Genkit (Google Gemini)
-   **Animation :** Framer Motion
-   **Gestion d'état :** Zustand

## Bonnes Pratiques

-   **Sécurité :** Ne jamais exposer de clé d'API côté client. Tous les appels à Genkit se font côté serveur.
-   **Organisation :** La logique IA est isolée dans le dossier `/src/ai`. Les composants React restent focalisés sur la présentation.
-   **Compatibilité :** Le projet est configuré pour un déploiement "serverless" sur des plateformes comme Vercel.

---

Pour toute question, contactez l'équipe sur `/contact`.
