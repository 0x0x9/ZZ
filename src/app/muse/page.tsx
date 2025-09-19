

import MuseClient from './client';
import { Guitar, Music, User, FilePenLine, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import MuseLayout from './layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: '(X)muse - Votre Parolier & Producteur IA',
  description: "Trouvez l'inspiration pour vos prochains morceaux. (X)muse analyse vos idées et vous propose un univers sonore complet, des styles aux artistes similaires, en passant par de premières paroles.",
};

const features = [
    {
        icon: Music,
        title: "Définition de Style",
        description: "(X)muse analyse votre thème et votre ambiance pour vous proposer un style musical principal précis et des sous-genres uniques à combiner."
    },
    {
        icon: User,
        title: "Références Pertinentes",
        description: "Découvrez des artistes et des morceaux similaires à votre vision, avec des justifications claires pour nourrir votre inspiration."
    },
    {
        icon: FilePenLine,
        title: "Démarrage Créatif",
        description: "Ne partez plus d'une page blanche. (X)muse vous fournit un premier jet de paroles (couplet et refrain) pour lancer votre processus d'écriture."
    }
];

const MusePage = () => {
    return (
        <MuseLayout>
            <div className="w-full space-y-24">
                <section className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 p-3 rounded-full w-fit animate-gradient-x">
                            <Guitar className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 animate-gradient-x">
                    (X)muse
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Votre parolier et producteur IA. Trouvez votre style, découvrez des artistes inspirants et commencez à écrire votre prochain tube.
                    </p>
                     <div className="mt-8">
                        <Button size="lg" className="rounded-full" asChild>
                            <Link href="/xos?open=muse">
                                Ouvrir dans (X)OS
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
                
                <Suspense>
                    <MuseClient />
                </Suspense>

                <section className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {features.map((feature, index) => (
                            <div key={feature.title}>
                                <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground mt-3">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MuseLayout>
    );
}

export default MusePage;
