import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}
