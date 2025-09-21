// This layout ensures the content takes up the full screen height
// without the standard Header and Footer, as the component is self-contained.
export default function InspireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-screen">
      {children}
    </main>
  );
}
