import InspireClient from './client';

export const metadata = {
    title: '(X)Inspire - Votre Oasis Créative',
    description: 'Un espace immersif pour faire une pause, vous ressourcer et recevoir une dose quotidienne d’inspiration visuelle et sonore.',
};

export default function InspirePage() {
    return <InspireClient />;
}
