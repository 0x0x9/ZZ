
'use server';

/**
 * @fileOverview Un agent IA qui recommande une configuration matérielle.
 *
 * - configurePc - Une fonction qui prend les besoins d'un utilisateur et recommande une configuration PC.
 */

import { ai } from '@/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { ConfigurePcInputSchema, ConfigurePcOutputSchema, type ConfigurePcInput, type ConfigurePcOutput } from '@/ai/types';

// This data should ideally come from a database or a config file,
// but for this prototype, we'll define it here.
const componentOptions = `
- Modèle (X)-fi:
  - CPU: ['Intel Core i9-14900K', 'AMD Ryzen 9 7950X3D']
  - GPU: ['NVIDIA RTX 4080 Super', 'NVIDIA RTX 4090', 'AMD Radeon RX 7900 XTX']
  - RAM: ['96GB DDR5', '128GB DDR5', '192GB DDR5']
  - Stockage: ['8TB SSD + 12TB HDD', '16TB SSD + 24TB HDD']
- Modèle (X)-alpha:
  - CPU: ['AMD Ryzen 9 7950X3D', 'Intel Core i9-14900K']
  - GPU: ['NVIDIA RTX 4080 Super FE', 'AMD Radeon RX 7900 XT']
  - RAM: ['64GB DDR5', '128GB DDR5']
  - Stockage: ['2TB NVMe SSD', '4TB NVMe SSD']
- Modèle (X)-oméga:
  - CPU: ['Intel Core i7-14700K', 'AMD Ryzen 7 7800X3D']
  - GPU: ['NVIDIA RTX 4070 Ti Super', 'AMD Radeon RX 7800 XT']
  - RAM: ['32GB DDR5', '64GB DDR5']
  - Stockage: ['2TB SSD + 8TB HDD', '4TB SSD + 12TB HDD']
`;


export async function configurePc(input: ConfigurePcInput): Promise<ConfigurePcOutput> {
  return configurePcFlow(input);
}

const configurePcPrompt = ai.definePrompt({
    name: 'configurePcPrompt',
    input: { schema: ConfigurePcInputSchema },
    output: { schema: ConfigurePcOutputSchema, format: 'json' },
    model: googleAI.model('gemini-1.5-pro-latest'),
    prompt: `Vous êtes un expert en configuration de matériel informatique pour créatifs. Votre rôle est de recommander la meilleure configuration pour un utilisateur en fonction de ses besoins.

Voici les besoins de l'utilisateur :
- Modèle de base souhaité : {{{product}}}
- Métier / Rôle : {{{job}}}
- Logiciels utilisés : {{{software}}}
- Priorité : {{{priority}}}

Voici les options de composants disponibles pour chaque modèle :
${componentOptions}

Votre tâche est de :
1.  Choisir la meilleure option pour chaque catégorie de composant (CPU, GPU, RAM, Stockage) pour le modèle de base demandé.
2.  Justifier vos choix en expliquant pourquoi ils sont adaptés aux besoins de l'utilisateur (métier, logiciels, priorité). Par exemple, "Pour le montage vidéo 8K, une RTX 4090 est recommandée pour sa puissance de calcul CUDA." ou "Pour stocker de gros projets vidéo, le stockage de 16TB est plus adapté."
3.  Retourner la configuration complète et la justification au format JSON. Le nom du modèle retourné doit être le même que celui fourni en entrée.
`,
});

const configurePcFlow = ai.defineFlow(
  {
    name: 'configurePcFlow',
    inputSchema: ConfigurePcInputSchema,
    outputSchema: ConfigurePcOutputSchema,
  },
  async (input) => {
    if (input.product.toLowerCase().includes('book')) {
        return {
            modelName: '(X)-book',
            configuration: {
                cpu: 'Puce (X)OS Fusion A1',
                gpu: 'GPU intégré 32 cœurs',
                ram: '32 Go de mémoire unifiée',
                storage: '1 To SSD',
            },
            justification: "Le (X)-book est une machine portable avec une configuration unifiée et optimisée. Pour le moment, il n'est pas personnalisable. Cette configuration est parfaitement équilibrée pour la création en mobilité."
        }
    }

    const { output } = await configurePcPrompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu générer de configuration. Veuillez réessayer.");
    }
    return output;
  }
);
