
import type { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Pulse - Gestion de Projet IA',
  description: "Pilotez vos projets créatifs, de l'idée à la réalisation. Suivez vos tâches, gérez vos fichiers et collaborez avec votre assistant IA.",
};

export default function PulseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 md:px-6 py-24 md:py-32">
        {children}
      </main>
      <Footer />
    </div>
  );
}
