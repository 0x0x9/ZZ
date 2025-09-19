
import RealityClient from "./client";
import { View, Upload, Zap } from "lucide-react";
import { Suspense } from 'react';

const features = [
    {
        icon: Upload,
        title: "Import Facile",
        description: "Chargez vos modèles 3D (formats .gltf, .glb) directement dans le navigateur pour une prévisualisation instantanée."
    },
    {
        icon: View,
        title: "Visualisation 360°",
        description: "Manipulez, zoomez et faites pivoter votre modèle sous tous les angles avec des contrôles intuitifs pour inspecter chaque détail."
    },
    {
        icon: Zap,
        title: "Prévisualisation AR",
        description: "Projetez votre création dans votre environnement réel grâce à la réalité augmentée, directement depuis votre smartphone compatible."
    }
];

const RealityPage = () => {
  return (
    <div className="w-full space-y-24">
      <section className="text-center mb-12">
         <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-fuchsia-500 via-red-500 to-orange-500 p-3 rounded-full w-fit animate-gradient-x">
              <View className="h-8 w-8 text-white" />
            </div>
         </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-red-500 to-orange-500 animate-gradient-x">
          (X)reality
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          Plongez vos créations dans le monde réel. Prévisualisez vos modèles 3D en réalité augmentée, directement depuis votre navigateur.
        </p>
      </section>
      <Suspense>
        <RealityClient />
      </Suspense>

       <section className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {features.map((feature, index) => (
                    <div key={feature.title}>
                        <div className="inline-block bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-6">
                            <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground mt-3">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
}
export default RealityPage;
