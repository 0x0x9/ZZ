/**
 * @fileoverview Ce script est UNIQUEMENT pour le développement local.
 * Il lance le serveur de développement de Genkit, qui fournit une interface
 * web pour inspecter les traces, les flux et les appels à l'IA.
 *
 * Pour lancer, exécutez `npm run genkit:watch` ou `npm run dev` (qui lance tout).
 * L'inspecteur sera disponible sur http://localhost:4000.
 */

import { start } from '@genkit-ai/tools-common/dev';

// Démarre le serveur de flux de Genkit
start();
