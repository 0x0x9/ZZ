

import ConvertClient from "./client";
import { FileKey } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ConvertPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-28 md:py-36">
           <div className="text-center space-y-4 mb-16">
             <div className="inline-block bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <FileKey className="h-8 w-8 text-primary" />
             </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              (X)change
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              L'outil de conversion universel pour les créatifs. Simplifiez vos workflows multi-OS en convertissant facilement vos fichiers.
            </p>
          </div>
          <ConvertClient />
        </section>
      </main>
      <Footer />
    </div>
  );
}
export default ConvertPage;
