
import FormatClient from "./client";
import { FilePenLine, Replace, Sparkles, Languages } from "lucide-react";
import { Suspense } from 'react';

const features = [
    {
        icon: Replace,
        title: "Transformation sur Mesure",
        description: "Convertissez un bloc de texte en liste à puces, un e-mail informel en courrier professionnel, ou changez le ton de votre message en un clic."
    },
    {
        icon: Sparkles,
        title: "Synthèse Intelligente",
        description: "Demandez un résumé en 3 points clés, extrayez les informations importantes d'un long document ou générez un titre accrocheur à partir de votre texte."
    },
    {
        icon: Languages,
        title: "Traduction Instantanée",
        description: "Utilisez la puissance de l'IA pour traduire vos textes dans des dizaines de langues, tout en conservant le contexte et les nuances."
    }
];


const FormatPage = () => {
  return (
    <div className="w-full space-y-24">
      <section className="text-center mb-12">
        <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 p-3 rounded-full w-fit animate-gradient-x">
              <FilePenLine className="h-8 w-8 text-white" />
            </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-gradient-x">
          (X)format
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          L'outil IA pour reformater et réinventer vos textes. Donnez votre contenu, décrivez la transformation, et laissez la magie opérer.
        </p>
      </section>
      <Suspense>
        <FormatClient />
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
export default FormatPage;
