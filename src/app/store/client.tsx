
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Sparkles } from "lucide-react";
import { products } from '@/lib/products';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product-card';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';

export default function StoreClient() {
    const hardwareProducts = products.filter(p => p.category === 'Matériel');
    const softwareProducts = products.filter(p => p.category === 'Logiciel');
    const accessoryProducts = products.filter(p => p.category === 'Accessoire');

  return (
    <>
      <section className="container mx-auto px-4 md:px-6 py-28 md:py-36 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
              <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
              >
                  La Boutique (X)yzz
              </motion.h1>
              <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                  Le meilleur matériel et les logiciels les plus innovants, conçus pour fonctionner en parfaite harmonie.
              </motion.p>
          </div>
      </section>
      
      <section className="container mx-auto px-4 md:px-6">
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Link href="/store/1">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-card group">
                     <Image 
                        src={imageData.store.workstation.src}
                        alt="(X)-fi Workstation"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={imageData.store.workstation.hint}
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Workstations</h2>
                        <p className="mt-2 text-md md:text-lg text-white/80 max-w-lg">La puissance n'est que le début. Découvrez notre station de travail phare.</p>
                        <Button variant="outline" className="mt-6 rounded-full bg-white/10 border-white/20 backdrop-blur-md text-white hover:bg-white/20">
                            Explorer le modèle <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 mt-16 md:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.3 }}
              >
                  <Link href="/features" className="block h-full">
                      <div className="glass-card h-full p-8 md:p-12 flex flex-col justify-center text-center relative overflow-hidden group transition-all duration-300 hover:border-primary/30 hover:-translate-y-2">
                          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
                          <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
                          <h3 className="text-2xl md:text-3xl font-bold">L'Écosystème Logiciel</h3>
                          <p className="p-0 mt-4 text-muted-foreground text-md md:text-lg">Découvrez (X)OS, l'environnement qui connecte tous vos outils et idées.</p>
                      </div>
                  </Link>
              </motion.div>
              <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.4 }}
              >
                   <Link href="/hardware" className="block h-full">
                      <div className="glass-card h-full p-8 md:p-12 flex flex-col justify-center text-center relative overflow-hidden group transition-all duration-300 hover:border-primary/30 hover:-translate-y-2">
                          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />
                          <Cpu className="h-10 w-10 md:h-12 md:w-12 text-blue-400 mx-auto mb-4" />
                          <h3 className="text-2xl md:text-3xl font-bold">La Puissance Matérielle</h3>
                          <p className="p-0 mt-4 text-muted-foreground text-md md:text-lg">Explorez notre gamme de matériel, conçue pour exceller avec (X)OS.</p>
                      </div>
                  </Link>
              </motion.div>
          </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 space-y-16 py-24 md:py-32">
           <div className="space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Matériel</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hardwareProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Logiciels & Abonnements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {softwareProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

             <div className="space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center">Accessoires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {accessoryProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
      </section>
    </>
  );
}
