

import ConvertClient from "./client";
import { FileKey, ArrowRight } from "lucide-react";
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ConvertPage = () => {
  return (
    <div className="w-full space-y-16">
      <section className="text-center mb-12">
        <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 p-3 rounded-full w-fit animate-gradient-x">
              <FileKey className="h-8 w-8 text-white" />
            </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 animate-gradient-x">
          (X)change
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          L'outil de conversion universel pour les créatifs. Simplifiez vos workflows en convertissant facilement vos fichiers.
        </p>
         <div className="mt-8">
            <Button size="lg" className="rounded-full" asChild>
                <Link href="/xos?open=convert">
                    Ouvrir dans (X)OS
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </section>
      <Suspense>
        <ConvertClient />
      </Suspense>
    </div>
  );
}
export default ConvertPage;
