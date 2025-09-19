
import FormatClient from "./client";
import { FilePenLine } from "lucide-react";
import { Suspense } from 'react';

const FormatPage = () => {
  return (
    <>
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
    </>
  );
}
export default FormatPage;
