
import ImageGenerator from '@/components/image-generator';
import { Image as ImageIcon } from 'lucide-react';
import { Suspense } from 'react';

const ImagePage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-3 rounded-full w-fit animate-gradient-x">
                        <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                (X)image
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre studio de création visuelle. Transformez vos mots en images spectaculaires avec la puissance de l'IA.
                </p>
            </section>
            
            <Suspense>
                <ImageGenerator />
            </Suspense>
        </>
    );
}

export default ImagePage;
