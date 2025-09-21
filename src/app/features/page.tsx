
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import FeaturesClient from "./client";

export const metadata = {
  title: 'Fonctionnalités & Avantages - (X)yzz.ai',
  description: "Découvrez en détail l'écosystème (X)yzz : (X)OS, nos workstations, et pourquoi notre approche unifiée est supérieure.",
};

const FeaturesPage = () => {
  return (
    <>
      <Header />
      <main>
        <FeaturesClient />
      </main>
      <Footer />
    </>
  );
}

export default FeaturesPage;

    