import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PersonaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
