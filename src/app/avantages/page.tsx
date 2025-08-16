
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AvantegesClient from "./client";

export const metadata = {
  title: '(X)core - Avantages Uniques de (X)yzz.ai',
  description: 'Découvrez pourquoi notre écosystème unifié est la plateforme créative ultime, dépassant les solutions traditionnelles.',
};

const AvantegesPage = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AvantegesClient />
      </main>
      <Footer />
    </>
  );
}

export default AvantegesPage;
