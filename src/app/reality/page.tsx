import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import RealityClient from "./client";
import { View } from "lucide-react";

const RealityPage = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-28 md:py-36">
           <div className="text-center space-y-4 mb-16">
             <div className="inline-block bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <View className="h-8 w-8 text-primary" />
             </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              (X)reality
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Plongez vos créations dans le monde réel. Prévisualisez vos designs en réalité augmentée et virtuelle, directement depuis votre navigateur.
            </p>
          </div>
          <RealityClient />
        </section>
      </main>
      <Footer />
    </>
  );
}
export default RealityPage;
