
import CodeGenerator from '@/components/code-generator';
import { CodeXml } from 'lucide-react';
import { Suspense } from 'react';

const CodePage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-400 via-cyan-500 to-green-400 p-3 rounded-full w-fit animate-gradient-x">
                        <CodeXml className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-500 to-green-400 animate-gradient-x">
                (X)code
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre partenaire de code IA. Générez des snippets, des fonctions ou des composants dans n'importe quel langage, à partir d'une simple description.
                </p>
            </section>
            
            <Suspense>
                <CodeGenerator />
            </Suspense>
        </>
    );
}

export default CodePage;
