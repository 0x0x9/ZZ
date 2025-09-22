
import LightClient from './client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
    title: '(X)yzz.ai - La Création, Unifiée.',
    description: "Découvrez comment l'écosystème (X)yzz.ai, orchestré par l'IA Oria, élimine la friction créative et unifie vos outils.",
};

export default function LightPage() {
    return (
      <>
        <Header />
        <main>
          <LightClient />
        </main>
        <Footer />
      </>
    );
}
