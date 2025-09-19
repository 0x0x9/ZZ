import MuseClient from './client';
import { Guitar } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: '(X)muse - Votre Parolier & Producteur IA',
  description: "Trouvez l'inspiration pour vos prochains morceaux. (X)muse analyse vos idées et vous propose un univers sonore complet, des styles aux artistes similaires, en passant par de premières paroles.",
};

const MusePage = () => {
    return (
        <>
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
            </section>
            
            <Suspense>
                <MuseClient />
            </Suspense>
        </>
    );
}

export default MusePage;
