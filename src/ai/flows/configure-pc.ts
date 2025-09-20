
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
  - GPU: ['NVIDIA RTX 5080 (16Go VRAM)', 'NVIDIA RTX 5090 (24Go VRAM)', 'Technologie (X)bridge (AMD) 24Go VRAM', 'Technologie (X)bridge (AMD) 32Go VRAM']
  - RAM: ['96GB DDR5', '128GB DDR5', '192GB DDR5']
  - Stockage: ['8TB SSD + 12TB HDD', '16TB SSD + 24TB HDD']
- Modèle (X)-alpha:
  - CPU: ['AMD Ryzen 9 7950X3D', 'Intel Core i9-14900K']
  - GPU: ['NVIDIA RTX 5080 (16Go VRAM)', 'Technologie (X)bridge (AMD) 32Go VRAM']
  - RAM: ['64GB DDR5', '128GB DDR5']
  - Stockage: ['2TB NVMe SSD', '4TB NVMe SSD']
- Modèle (X)-oméga:
  - CPU: ['Intel Core i7-14700K', 'AMD Ryzen 7 7800X3D']
  - GPU: ['NVIDIA RTX 5070 (12Go VRAM)', 'Technologie (X)bridge (AMD) 24Go VRAM']
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
    prompt: `Vous êtes un expert en configuration de matériel informatique pour créatifs. Votre rôle est de recommander la meilleure configuration pour un utilisateur en fonction de ses besoins. Votre réponse DOIT être en français.

Voici les besoins de l'utilisateur :
- Métier / Rôle : {{{job}}}
- Logiciels utilisés : {{{software}}}
- Priorité : {{{priority}}}
- Modèle de base suggéré (non obligatoire) : {{{product}}}

Voici les options de composants disponibles pour chaque modèle :
${componentOptions}

Votre tâche est de :
1.  Choisir le **meilleur modèle de base** (fi, alpha, oméga) pour l'utilisateur.
2.  Pour ce modèle, choisir la meilleure option pour chaque catégorie de composant (CPU, GPU, RAM, Stockage). Si l'utilisateur a des besoins très élevés en rendu 3D ou en IA qui peuvent bénéficier du multi-GPU, recommandez la technologie (X)bridge.
3.  Justifier vos choix en expliquant pourquoi le modèle et les composants sont adaptés (métier, logiciels, priorité). Par exemple, "Pour le montage vidéo 8K, une RTX 5090 est recommandée pour sa puissance de calcul CUDA." ou "La technologie (X)bridge est idéale car vos logiciels tirent parti du multi-GPU, doublant ainsi les performances de rendu."
4.  Retourner le modèle et la configuration complète avec la justification au format JSON. Le nom du modèle retourné doit être celui que vous avez choisi.
`,
});

const configurePcFlow = ai.defineFlow(
  {
    name: 'configurePcFlow',
    inputSchema: ConfigurePcInputSchema,
    outputSchema: ConfigurePcOutputSchema,
  },
  async (input) => {
    if (input.product.toLowerCase().includes('pi')) {
        return {
            modelName: '(X)-pi',
            configuration: {
                cpu: 'Puce (X)OS Fusion A1',
                gpu: 'GPU intégré 32 cœurs',
                ram: '32 Go de mémoire unifiée',
                storage: '1 To SSD',
            },
            justification: "Le (X)-pi est une machine portable avec une configuration unifiée et optimisée. Pour le moment, il n'est pas personnalisable. Cette configuration est parfaitement équilibrée pour la création en mobilité."
        }
    }

    const { output } = await configurePcPrompt(input);
    if (!output) {
      throw new Error("L'IA n'a pas pu générer de configuration. Veuillez réessayer.");
    }
    return output;
  }
);
