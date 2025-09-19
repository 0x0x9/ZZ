import type { Metadata } from 'next';

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
    <div className="h-screen w-screen flex items-center justify-center p-4 md:p-6 bg-transparent">
        {children}
    </div>
  );
}
