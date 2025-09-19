import MotionClient from './client';
import { Film } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: '(X)motion - Votre Réalisateur IA',
  description: "Transformez vos idées en scripts vidéo complets, avec scènes et narrations, prêts pour la production.",
};

const MotionPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Film className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 animate-gradient-x">
                (X)motion
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre réalisateur IA. D'une simple idée, générez un script vidéo complet, scène par scène, avec une voix off inspirante.
                </p>
            </section>
            
            <Suspense>
                <MotionClient />
            </Suspense>
        </>
    );
}

export default MotionPage;
