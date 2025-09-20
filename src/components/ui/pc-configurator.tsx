
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Cpu, HardDrive, MemoryStick, CircuitBoard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Option = {
    name: string;
    priceModifier: number;
};

type ComponentType = 'cpu' | 'gpu' | 'ram' | 'storage';

export const optionsMap: Record<string, Record<ComponentType, Option[]>> = {
  'x-alpha': {
    cpu: [
        { name: 'AMD Ryzen 9 7950X3D', priceModifier: 0 },
        { name: 'Intel Core i9-14900K', priceModifier: -100 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5080 (16Go VRAM)', priceModifier: 0 },
        { name: 'Technologie (X)bridge (AMD) 32Go VRAM', priceModifier: 400 },
    ],
    ram: [
        { name: '64GB DDR5', priceModifier: 0 },
        { name: '128GB DDR5', priceModifier: 350 },
    ],
    storage: [
        { name: '2TB NVMe SSD', priceModifier: 0 },
        { name: '4TB NVMe SSD', priceModifier: 200 },
    ],
  },
  'x-omega': {
     cpu: [
        { name: 'Intel Core i7-14700K', priceModifier: 0 },
        { name: 'AMD Ryzen 7 7800X3D', priceModifier: 50 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5070 (12Go VRAM)', priceModifier: 0 },
        { name: 'Technologie (X)bridge (AMD) 24Go VRAM', priceModifier: 250 },
    ],
    ram: [
        { name: '32GB DDR5', priceModifier: 0 },
        { name: '64GB DDR5', priceModifier: 200 },
    ],
    storage: [
        { name: '2TB SSD + 8TB HDD', priceModifier: 0 },
        { name: '4TB SSD + 12TB HDD', priceModifier: 250 },
    ],
  },
   'x-fi': {
    cpu: [
        { name: 'Intel Core i9-14900K', priceModifier: 0 },
        { name: 'AMD Ryzen 9 7950X3D', priceModifier: 150 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 5080 (16Go VRAM)', priceModifier: 0 },
        { name: 'NVIDIA RTX 5090 (24Go VRAM)', priceModifier: 700 },
        { name: 'Technologie (X)bridge (AMD) 24Go VRAM', priceModifier: 900 },
        { name: 'Technologie (X)bridge (AMD) 32Go VRAM', priceModifier: 1200 },
    ],
    ram: [
        { name: '96GB DDR5', priceModifier: 0 },
        { name: '128GB DDR5', priceModifier: 250 },
        { name: '192GB DDR5', priceModifier: 600 },
    ],
    storage: [
        { name: '8TB SSD + 12TB HDD', priceModifier: 0 },
        { name: '16TB SSD + 24TB HDD', priceModifier: 800 },
    ],
  },
};

const componentInfo: Record<ComponentType, { title: string; icon: React.ElementType }> = {
    cpu: { title: "Processeur", icon: Cpu },
    gpu: { title: "Carte Graphique", icon: CircuitBoard },
    ram: { title: "Mémoire", icon: MemoryStick },
    storage: { title: "Stockage", icon: HardDrive },
}

export type Configuration = {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
};

export const getDefaultConfig = (product: Product): Configuration | null => {
    const productKey = product.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ','fi').replace('α','alpha');
    const options = optionsMap[productKey];
    if (!options) return null;
    
    return {
        cpu: options.cpu[0].name,
        gpu: options.gpu[0].name,
        ram: options.ram[0].name,
        storage: options.storage[0].name,
    };
};

interface PCConfiguratorProps {
    product: Product;
    onConfigChange: (config: Configuration, newPrice: number) => void;
    initialConfig?: Configuration | null;
}

const ConfiguratorSection = ({ type, title, icon: Icon, options, selected, onSelect }: {
    type: ComponentType,
    title: string,
    icon: React.ElementType,
    options: Option[],
    selected: string,
    onSelect: (type: ComponentType, value: string) => void
}) => {
    return (
        <AccordionItem value={type} className="glass-card mb-4 rounded-2xl border-border/50">
            <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-left">{title}</h3>
                        <p className="text-xs text-muted-foreground text-left">{selected}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
                <div className="grid grid-cols-1 gap-2 border-t border-border pt-4">
                    {options.map(option => {
                        const isSelected = option.name === selected;
                        return (
                            <button
                                key={option.name}
                                type="button"
                                onClick={() => onSelect(type, option.name)}
                                className={cn(
                                    "relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                                    isSelected
                                        ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                                        : "border-transparent bg-background/50 hover:border-primary/50"
                                )}
                            >
                                {isSelected && (
                                    <CheckCircle className="h-5 w-5 text-primary absolute top-2 right-2" />
                                )}
                                <p className="font-medium text-sm">{option.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {option.priceModifier > 0 ? `+${option.priceModifier.toFixed(2)}€` : option.priceModifier < 0 ? `${option.priceModifier.toFixed(2)}€` : 'Inclus'}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export function PCConfigurator({ product, onConfigChange, initialConfig }: PCConfiguratorProps) {
    const productKey = product.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ', 'fi').replace('α', 'alpha');
    const options = optionsMap[productKey];
    
    if (!options) {
        return null;
    }

    const [config, setConfig] = useState<Configuration>(initialConfig || getDefaultConfig(product)!);
    
    useEffect(() => {
        if(initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    useEffect(() => {
        const cpuPrice = options.cpu.find(o => o.name === config.cpu)?.priceModifier ?? 0;
        const gpuPrice = options.gpu.find(o => o.name === config.gpu)?.priceModifier ?? 0;
        const ramPrice = options.ram.find(o => o.name === config.ram)?.priceModifier ?? 0;
        const storagePrice = options.storage.find(o => o.name === config.storage)?.priceModifier ?? 0;

        const newPrice = product.price + cpuPrice + gpuPrice + ramPrice + storagePrice;
        onConfigChange(config, newPrice);
    }, [config, product.price, onConfigChange, options]);

    const handleSelection = (type: ComponentType, value: string) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [type]: value,
        }));
    };

    return (
        <div className="space-y-8">
            <motion.div
                className="text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold tracking-tight">Configurez votre Workstation</h2>
                <p className="text-muted-foreground mt-2 text-md">Personnalisez chaque composant pour créer la machine qui correspond parfaitement à vos ambitions.</p>
            </motion.div>
             <Accordion type="single" collapsible defaultValue="cpu" className="w-full space-y-4">
                {(Object.keys(options) as ComponentType[]).map((type) => (
                    <ConfiguratorSection
                        key={type}
                        type={type}
                        title={componentInfo[type].title}
                        icon={componentInfo[type].icon}
                        options={options[type]}
                        selected={config[type]}
                        onSelect={handleSelection}
                    />
                ))}
            </Accordion>
        </div>
    );
}
