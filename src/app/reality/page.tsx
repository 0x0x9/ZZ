
import RealityClient from "./client";
import { View } from "lucide-react";
import { Suspense } from 'react';

const RealityPage = () => {
  return (
    <>
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
    </>
  );
}
export default RealityPage;
