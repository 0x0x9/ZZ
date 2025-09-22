import LightClient from './client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
    title: 'LIGHT - La lumière de vos projets',
    description: "Un lieu simple et puissant où l’inspiration devient œuvre, et l’œuvre devient valeur. De l'étincelle à l'impact.",
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
