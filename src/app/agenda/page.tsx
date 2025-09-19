
import AgendaClient from './client';
import { Calendar } from 'lucide-react';
import { Suspense } from 'react';

const AgendaPage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 p-3 rounded-full w-fit animate-gradient-x">
                        <Calendar className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 animate-gradient-x">
                (X)agenda
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Votre agenda intelligent. Décrivez vos événements en langage naturel et laissez l'IA les organiser pour vous.
                </p>
            </section>
            
            <Suspense>
                <AgendaClient />
            </Suspense>
        </>
    );
}
export default AgendaPage;
