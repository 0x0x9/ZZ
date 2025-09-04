import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import FormatClient from "./client";
import { FileText } from "lucide-react";

const FormatPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-28 md:py-36">
           <div className="text-center space-y-4 mb-16">
             <div className="inline-block bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <FileText className="h-8 w-8 text-primary" />
             </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              (X)format
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              L'outil IA pour reformater et réinventer vos textes. Donnez votre contenu, décrivez la transformation, et laissez la magie opérer.
            </p>
          </div>
          <FormatClient />
        </section>
      </main>
      <Footer />
    </div>
  );
}
export default FormatPage;
