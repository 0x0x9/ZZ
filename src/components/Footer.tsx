
"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export function Footer() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="py-8 border-t border-border/20 relative bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {currentYear} (X)yzz. Tous droits réservés.</p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
                  <Link href="/about" className="hover:text-foreground transition-colors">À Propos</Link>
                  <Link href="/community" className="hover:text-foreground transition-colors">Communauté</Link>
                  <Link href="/careers" className="hover:text-foreground transition-colors">Carrières</Link>
                  <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
                  <Link href="/terms" className="hover:text-foreground transition-colors">Conditions</Link>
                </div>
            </div>
        </footer>
    )
}
