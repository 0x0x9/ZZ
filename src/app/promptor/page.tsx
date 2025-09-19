import PromptorClient from './client';
import { Lightbulb } from 'lucide-react';
import { Suspense } from 'react';

const PromptorPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-3 rounded-full w-fit animate-gradient-x">
                        <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x">
                (X)promptor
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre muse créative. Transformez une idée vague en un univers de possibilités : titres, styles, et prompts visuels.
                </p>
            </section>
            
            <Suspense>
                <PromptorClient />
            </Suspense>
        </>
    );
}

export default PromptorPage;
