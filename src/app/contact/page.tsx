
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ContactClient from "./client";

const ContactPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <section className="container mx-auto px-4 md:px-6 py-28 md:py-36">
              <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                  Contactez-nous
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Une question, un projet ? Notre équipe est à votre écoute pour vous accompagner.
                </p>
              </div>
                <ContactClient />
            </section>
          </main>
          <Footer />
        </div>
    )
}
export default ContactPage;
