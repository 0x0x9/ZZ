/**
 * @fileoverview Ce script est UNIQUEMENT pour le développement local.
 * Il lance le serveur de développement de Genkit, qui fournit une interface
 * web pour inspecter les traces, les flux et les appels à l'IA.
 *
 * Pour lancer, exécutez `npm run genkit:watch` ou `npm run dev` (qui lance tout).
 * L'inspecteur sera disponible sur http://localhost:4000.
 */

import { startFlowsServer } from '@genkit-ai/flow';
import * as path from 'path';

// Démarre le serveur de flux de Genkit
startFlowsServer({
  // Spécifie le chemin vers le répertoire contenant les flows
  // pour que Genkit puisse les découvrir et les servir.
  flows: [path.resolve(__dirname, 'flows')],
});
