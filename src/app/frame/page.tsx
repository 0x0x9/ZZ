
import FrameGenerator from '@/components/frame-generator';
import { LayoutTemplate } from 'lucide-react';

const FramePage = () => {
    return (
        <>
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-3 rounded-full w-fit animate-gradient-x">
                        <LayoutTemplate className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 animate-gradient-x">
                (X)frame
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Le designer d'interface qui code. Décrivez une maquette ou fournissez une image, (X)frame la transforme en code React fonctionnel.
                </p>
            </section>
            
            <FrameGenerator />
        </>
    );
}

export default FramePage;
