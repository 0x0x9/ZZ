
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from "next/image";
import type { Product } from '@/lib/products';
import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart-store';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Check, ArrowRight, Layers } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    const productToAdd = { ...product, image: product.images[0] };
    addItem(productToAdd);
    toast({
      title: "Ajouté au panier !",
      description: `"${product.name}" est maintenant dans votre panier.`,
    });
  };

  if (product.category === 'Logiciel') {
    return (
      <Link href={`/store/${product.id}`} className="block h-full group/link">
         <motion.div
          className="h-full"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
           <Card className={cn(
            "group/card flex h-full flex-col overflow-hidden transition-all duration-300 text-center items-center p-8",
            "glass-card hover:bg-white/5 dark:hover:bg-black/10 hover:border-primary/30"
          )}>
            <div className="flex-grow flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                  <Layers className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-grow">{product.tagline}</p>
              
            </div>
            <div className="mt-8 text-center w-full">
               <p className="text-xl font-medium text-foreground mb-4">{product.price.toFixed(2)}€</p>
               <Button variant="secondary" className="w-full rounded-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ajouter au panier
                </Button>
            </div>
           </Card>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/store/${product.id}`} className="block h-full group/link">
      <motion.div
        className="h-full"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card className={cn(
          "group/card flex h-full flex-col overflow-hidden transition-all duration-300",
          "glass-card hover:bg-white/5 dark:hover:bg-black/10 hover:border-primary/30"
        )}>
          <div className="relative aspect-square w-full p-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover/link:scale-105"
              data-ai-hint={product.hint}
            />
          </div>
          <CardContent className="p-6 pt-2 flex flex-col flex-grow text-center">
            <h3 className="text-lg font-semibold text-foreground flex-grow">{product.name}</h3>
            <p className="mt-4 text-xl font-medium text-foreground">{product.price.toFixed(2)}€</p>
            <div className="mt-4">
                <Button variant="outline" className="rounded-full w-full">
                  Découvrir <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
