import { Suspense } from 'react';
import FluxClient from './client';

export const metadata = {
  title: '(X)flux - Orchestrateur de Projets IA',
  description: "L'assistant IA qui transforme une pensée en projet complet. Décrivez votre objectif, (X)flux s'occupe du reste.",
};

const FluxPage = () => {
    return (
        <Suspense>
            <FluxClient />
        </Suspense>
    );
}

export default FluxPage;
