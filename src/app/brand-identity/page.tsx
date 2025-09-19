
import BrandIdentityClient from './client';
import { Layers } from 'lucide-react';
import { Suspense } from 'react';

const BrandIdentityPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Layers className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
                (X)brand
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre studio de branding IA. Définissez l'identité visuelle et vocale de votre marque en quelques clics.
                </p>
            </section>
            
            <Suspense>
                <BrandIdentityClient />
            </Suspense>
        </>
    );
}

export default BrandIdentityPage;
