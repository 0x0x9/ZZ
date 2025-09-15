
'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Product } from '@/lib/products';

// Données simulées (remplacer par API Genkit pour descriptions dynamiques)
const productData = {
  name: "FI Station Pro",
  basePrice: 2999,
  options: {
    cpu: [
      { name: "Intel Xeon 16-core", price: 0 },
      { name: "Intel Xeon 64-core", price: 1500 },
    ],
    gpu: [
      { name: "1x NVIDIA RTX 5090", price: 0 },
      { name: "4x NVIDIA RTX 5090", price: 3000 },
    ],
  },
};

export default function ProductClient({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const [config, setConfig] = useState({
    cpu: productData.options.cpu[0],
    gpu: productData.options.gpu[0],
  });
  const totalPrice = productData.basePrice + config.cpu.price + config.gpu.price;

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center bg-[url('https://picsum.photos/seed/fi-station-hero/1920/1080')] bg-cover bg-center"
      >
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold">FI Station Pro: Create Without Walls</h1>
          <p className="text-xl md:text-2xl mt-4">Intel power, multi-GPU, and Oria AI.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Configure Now</Button>
            <Button variant="outline" className="border-white text-white">Join Community</Button>
          </div>
        </div>
      </motion.section>

      {/* Configurator Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-80 bg-white/95 p-6 shadow-lg md:block hidden backdrop-blur-sm border-l border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-black">Build Your FI Station Pro</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Processor</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-black">{config.cpu.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productData.options.cpu.map((option) => (
                  <DropdownMenuItem key={option.name} onClick={() => setConfig({ ...config, cpu: option })}>
                    {option.name} (+${option.price})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Graphics</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-black">{config.gpu.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productData.options.gpu.map((option) => (
                  <DropdownMenuItem key={option.name} onClick={() => setConfig({ ...config, gpu: option })}>
                    {option.name} (+${option.price})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-lg font-semibold text-black">Price: ${totalPrice}</p>
          <Button className="w-full bg-blue-600">Add to Cart</Button>
        </div>
      </aside>

      {/* Performance Section */}
      <section className="py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Intel Xeon 64-core</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tackle massive datasets and 3D rendering.</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Up to 4x RTX 5090</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Blazing-fast AI and video rendering.</p>
          </CardContent>
        </Card>
         <Card className="glass-card">
          <CardHeader>
            <CardTitle>Up to 2TB DDR5</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Seamless multitasking for creators.</p>
          </CardContent>
        </Card>
         <Card className="glass-card">
          <CardHeader>
            <CardTitle>Up to 16TB NVMe</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Instant access to all your project files.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
