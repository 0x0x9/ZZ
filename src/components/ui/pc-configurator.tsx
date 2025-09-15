
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Cpu, HardDrive, MemoryStick, CircuitBoard, CheckCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { Button } from './button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';


type Option = {
    name: string;
    priceModifier: number;
};

type ComponentType = 'cpu' | 'gpu' | 'ram' | 'storage';

const optionsMap: Record<string, Record<ComponentType, Option[]>> = {
  'x-alpha': {
    cpu: [
        { name: 'AMD Ryzen 9 7950X3D', priceModifier: 0 },
        { name: 'Intel Core i9-14900K', priceModifier: -100 },
    ],
    gpu: [
        { name: 'NVIDIA RTX 4080 Super FE', priceModifier: 0 },
        { name: 'AMD Radeon RX 7900 XT', priceModifier: -200 },
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
        { name: 'NVIDIA RTX 4070 Ti Super', priceModifier: 0 },
        { name: 'AMD Radeon RX 7800 XT', priceModifier: -150 },
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
        { name: 'NVIDIA RTX 4080 Super', priceModifier: 0 },
        { name: 'NVIDIA RTX 4090', priceModifier: 600 },
        { name: 'AMD Radeon RX 7900 XTX', priceModifier: -100 },
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

interface PCConfiguratorProps {
    product: Product;
    basePrice: number;
    onConfigChange: (config: Configuration, newPrice: number) => void;
}

const ConfiguratorSection = ({ type, title, icon: Icon, options, selected, onSelect }: {
    type: ComponentType,
    title: string,
    icon: React.ElementType,
    options: Option[],
    selected: string,
    onSelect: (type: ComponentType, value: string) => void
}) => {
    const selectedOption = options.find(o => o.name === selected) || options[0];
    return (
        <div className="flex items-center justify-between p-4 glass-card bg-background/50 rounded-xl">
             <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{selected}</p>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-auto">
                       Changer
                       <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 glass-card">
                    {options.map(option => (
                        <DropdownMenuItem key={option.name} onSelect={() => onSelect(type, option.name)}>
                             <div className="flex justify-between items-center w-full">
                                <span>{option.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {option.priceModifier > 0 ? `+${option.priceModifier.toFixed(2)}€` : option.priceModifier < 0 ? `${option.priceModifier.toFixed(2)}€` : 'Inclus'}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export function PCConfigurator({ product, basePrice, onConfigChange }: PCConfiguratorProps) {
    const productKey = product.name.split(' ')[0].toLowerCase().replace(/\(x\)\-/, 'x-').replace('oméga', 'omega').replace('φ','fi');
    const options = optionsMap[productKey];

    // If no options are found for the product, don't render the configurator
    if (!options) {
        return null;
    }

    const [config, setConfig] = useState<Configuration>({
        cpu: options.cpu[0].name,
        gpu: options.gpu[0].name,
        ram: options.ram[0].name,
        storage: options.storage[0].name,
    });

    useEffect(() => {
        const cpuPrice = options.cpu.find(o => o.name === config.cpu)?.priceModifier ?? 0;
        const gpuPrice = options.gpu.find(o => o.name === config.gpu)?.priceModifier ?? 0;
        const ramPrice = options.ram.find(o => o.name === config.ram)?.priceModifier ?? 0;
        const storagePrice = options.storage.find(o => o.name === config.storage)?.priceModifier ?? 0;

        const newPrice = basePrice + cpuPrice + gpuPrice + ramPrice + storagePrice;
        onConfigChange(config, newPrice);
    }, [config, basePrice, onConfigChange, options]);

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
             <div className="space-y-4">
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
             </div>
        </div>
    );
}
