
import TextGenerator from '@/components/text-generator';
import { FileText } from 'lucide-react';
import { Suspense } from 'react';

const TextPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 p-3 rounded-full w-fit animate-gradient-x">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 animate-gradient-x">
                (X)texte
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre rédacteur IA personnel. Générez des articles, des scripts, des poèmes ou tout autre contenu textuel en quelques secondes.
                </p>
            </section>
            
            <Suspense>
                <TextGenerator />
            </Suspense>
        </>
    );
}

export default TextPage;
