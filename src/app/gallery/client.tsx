

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type GalleryItem } from '@/lib/gallery-data';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

function MasonryLayout({ items, onImageClick }: { items: GalleryItem[], onImageClick: (item: GalleryItem) => void }) {
  // This is a simplified masonry layout for demonstration.
  // In a real app, you might use a library like 'react-masonry-css'.
  const columns = [[], [], []] as GalleryItem[][];
  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {columns.map((column, i) => (
        <div key={i} className="flex flex-col gap-4">
          {column.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => onImageClick(item)}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={500}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={item.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm">par {item.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div>
      <MasonryLayout items={items} onImageClick={setSelectedItem} />

      <AnimatePresence>
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 glass-card flex flex-col md:flex-row">
              <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-black">
                 <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  data-ai-hint={selectedItem.imageHint}
                  sizes="(max-width: 768px) 100vw, 67vw"
                />
              </div>
              <div className="w-full md:w-1/3 p-6 flex flex-col">
                 <div className="flex-grow space-y-4">
                    <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                    <p className="text-muted-foreground">par {selectedItem.author}</p>
                    <Badge variant="secondary">{selectedItem.tool}</Badge>
                    <Card className="glass-card bg-background/50">
                        <CardContent className="p-4">
                            <p className="text-sm font-semibold flex items-center gap-2 mb-2"><Wand2 className="h-4 w-4 text-primary"/>Prompt utilisé</p>
                            <p className="text-sm text-muted-foreground italic">"{selectedItem.prompt}"</p>
                        </CardContent>
                    </Card>
                 </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
