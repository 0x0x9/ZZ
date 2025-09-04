
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-accent" />,
    title: "Forum d'entraide",
    description: "Participez à des conversations, posez des questions et partagez vos connaissances avec des créatifs du monde entier.",
    href: "/forum"
  },
  {
    icon: <Users className="h-8 w-8 text-accent" />,
    title: "Collaborations",
    description: "Trouvez des partenaires pour vos projets, partagez vos offres de services ou découvrez de nouvelles missions.",
    href: "/collaborations"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-accent" />,
    title: "Blog (X)press",
    description: "Plongez au coeur de l'écosystème avec nos tutoriels, analyses et interviews d'artistes.",
    href: "/blog"
  },
];

const CommunityPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-28 md:py-36 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Rejoignez la Communauté (X)yzz.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Un espace d'échange, de collaboration et d'inspiration pour les créatifs qui repoussent les limites.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 pb-28 md:pb-36">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <Card key={feature.title} className="glass-card text-center flex flex-col">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 mb-4">
                                {feature.icon}
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button asChild variant="outline">
                                <Link href={feature.href}>
                                    Explorer <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CommunityPage;
