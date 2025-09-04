
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AvantegesClient from "./client";

export const metadata = {
  title: '(X)core - Avantages Uniques de (X)yzz.ai',
  description: 'Découvrez pourquoi notre écosystème unifié est la plateforme créative ultime, dépassant les solutions traditionnelles.',
};

const AvantegesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AvantegesClient />
      </main>
      <Footer />
    </div>
  );
}

export default AvantegesPage;
