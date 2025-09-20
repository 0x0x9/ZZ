
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Trash2,
  Layers,
  BrainCircuit,
  Lightbulb,
  Film,
  AudioLines,
  FileText,
  Image as ImageIconLucide,
  SquareTerminal,
  LayoutTemplate,
  Music,
  CodeXml,
  ArrowRight,
  View,
  Cpu,
  Sparkles,
  BookOpen,
  Paintbrush,
  Users,
  Check,
  Plus,
  Minus,
  Download,
  MessageSquare,
  FilePenLine,
  FileKey,
  Briefcase,
  Phone,
  Zap,
  User as UserIcon,
  LogOut,
  Heart,
  Home,
  ShoppingBag,
  Info,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useCallback } from "react";
import HeaderLogo from "./layout/header-logo";
import { useCart } from "@/hooks/use-cart-store";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { ThemeToggle } from "./theme-toggle";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "./ui/separator";
import { useAuth } from './auth-component';
import { useIsClient } from '@/hooks/use-is-client';
import imageData from '@/lib/placeholder-images.json';
import { usePathname } from "next/navigation";
import { products, type Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { getDefaultConfig } from "./ui/pc-configurator";
import { usePageTransition } from "@/hooks/use-page-transition";

const discoverLinks = [
    { href: "/about", label: "Notre Vision", icon: Info, description: "Découvrez la mission et l'équipe (X)yzz." },
    { href: "/avantages", label: "Avantages (X)core", icon: Zap, description: "Explorez ce qui nous rend uniques." },
    { href: "/features", label: "Écosystème (X)OS", icon: Layers, description: "Découvrez notre système d'exploitation." },
    { href: "/hardware", label: "Matériel", icon: Cpu, description: "Les machines conçues pour la performance." },
    { href: "/download", label: "Téléchargement", icon: Download, description: "Installez (X)OS sur votre machine." },
];

const communityLinks = [
    { href: "/forum", label: "Forum d'entraide", icon: MessageSquare, description: "Discutez avec la communauté et partagez vos idées." },
    { href: "/collaborations", label: "Collaborations", icon: Users, description: "Trouvez des partenaires et des projets." },
    { href: "/gallery", label: "Galerie (X)hibit", icon: Paintbrush, description: "Explorez les créations de la communauté." },
    { href: "/blog", label: "Blog (X)press", icon: BookOpen, description: "Tutoriels, analyses et inspiration." },
]

function CartSheet() {
  const { items, removeItem, total, itemCount, addItem, decreaseItem } =
    useCart();
  const isClient = useIsClient();

  if (!isClient) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full"
            disabled
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Ouvrir le panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent overlayClassName="bg-black/20" className="w-full sm:max-w-md glass-card flex flex-col p-0 border-l border-white/10">
        <header className="p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Votre Panier</h2>
        </header>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Votre panier est vide.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)}€
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => decreaseItem(item.cartItemId)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-sm w-4 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => addItem(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.cartItemId)}
                      className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <footer className="p-6 border-t border-border space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <SheetClose asChild>
                <Button
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href="/checkout">Passer la commande</Link>
                </Button>
              </SheetClose>
            </footer>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

const DropdownMenuLinkItem = ({ href, label, description, icon: Icon }: { href: string; label: string; description?: string; icon: React.ElementType }) => {
    const { performTransition } = usePageTransition();

    return (
        <DropdownMenuPrimitive.Item asChild onSelect={(e) => { e.preventDefault(); performTransition(href); }}>
            <Link
                href={href}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/10 transition-all duration-200 focus:bg-foreground/10 focus:outline-none cursor-pointer"
            >
                <div className="p-1.5 rounded-md border bg-accent/10 border-accent/20">
                    <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                    <p className="font-semibold text-foreground text-sm">{label}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </Link>
        </DropdownMenuPrimitive.Item>
    );
}

const MainNav = () => {
    const { performTransition } = usePageTransition();

    return (
        <motion.nav
            key="main-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex items-center gap-1 bg-background/50 dark:bg-black/20 border border-border rounded-full p-1"
        >
            <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                    <Button
                        variant="ghost"
                        className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full h-9 px-4"
                    >
                        Découvrir <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                    <DropdownMenuPrimitive.Content
                        align="center"
                        sideOffset={10}
                        className="w-80 glass-card p-2 z-50 outline-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex flex-col gap-1"
                        >
                            {discoverLinks.map((link) => (
                                <DropdownMenuLinkItem key={link.href} {...link} />
                            ))}
                        </motion.div>
                    </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>

            <Button
                variant="ghost"
                className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full h-9 px-4"
                onClick={() => performTransition('/store')}
            >
                Boutique
            </Button>
            
            <Button
                variant="ghost"
                className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full h-9 px-4"
                onClick={() => performTransition('/tools')}
            >
                Écosystème
            </Button>
            
            <Button
                variant="ghost"
                className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full h-9 px-4"
                onClick={() => performTransition('/community')}
            >
                Communauté
            </Button>
        </motion.nav>
    );
};

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, handleSignOut } = useAuth();
  const isClient = useIsClient();
  const pathname = usePathname();
  const { performTransition } = usePageTransition();

  const isProductPage = pathname.startsWith('/store/');
  const productId = isProductPage ? pathname.split('/store/')[1] : null;
  const product = productId ? products.find(p => p.id.toString() === productId) : null;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto px-4 md:px-6 h-16 grid grid-cols-3 items-center rounded-full glass-card">
        <div className="flex items-center gap-2 justify-self-start">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-xl text-foreground"
          >
            <HeaderLogo />
            <span className="hidden sm:inline">(X)yzz.</span>
          </Link>
        </div>

        <div className="justify-self-center">
            <AnimatePresence mode="wait">
                <MainNav />
            </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
            {isClient && (
                <div className="hidden lg:flex items-center gap-2">
                    <ThemeToggle />
                    <CartSheet />
                    {user ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full flex items-center gap-2">
                                <Image src={user.photoURL || imageData.general.user_avatar.src} alt={user.displayName || "Avatar"} width={28} height={28} className="rounded-full" data-ai-hint="person portrait" sizes="28px" />
                                {user.displayName}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 glass-card" align="end">
                            <DropdownMenuLabel>Mon Espace</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/account" className="flex items-center w-full cursor-pointer"><UserIcon className="mr-2 h-4 w-4"/>Mon Compte</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/cloud" className="flex items-center w-full cursor-pointer"><Cloud className="mr-2 h-4 w-4"/>(X)cloud</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/chat" className="flex items-center w-full cursor-pointer"><Heart className="mr-2 h-4 w-4"/>Pulse</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleSignOut} className="w-full cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4"/>
                                Déconnexion
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button className="rounded-full" asChild>
                            <Link href="/login">Accéder à mon espace</Link>
                        </Button>
                    )}
                </div>
            )}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full glass-card flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <Link
                  href="/"
                  className="flex items-center gap-3 font-bold text-xl text-foreground"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <HeaderLogo />
                  <span>(X)yzz.</span>
                </Link>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-full"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer le menu</span>
                  </Button>
                </SheetClose>
              </div>
              <ScrollArea className="flex-1">
                <nav className="flex flex-col gap-2 p-6 text-left">
                    <Accordion type="multiple" className="w-full">
                         <AccordionItem value="discover" className="border-b-0">
                            <AccordionTrigger className="text-2xl font-medium hover:text-accent transition-colors py-2 hover:no-underline">
                                Découvrir
                            </AccordionTrigger>
                            <AccordionContent className="pl-4">
                                <div className="flex flex-col gap-1">
                                    {discoverLinks.map((link) => (
                                        <Link key={link.href} href={link.href} onClick={() => setIsSheetOpen(false)} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/10 transition-colors">
                                            <div className="p-1.5 bg-accent/10 rounded-md border border-accent/20">
                                                <link.icon className="h-5 w-5 text-accent" />
                                            </div>
                                            <span className="text-lg font-medium">{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <Link
                          href="/store"
                          onClick={() => setIsSheetOpen(false)}
                          className="text-2xl font-medium hover:text-accent transition-colors py-4 flex items-center"
                        >
                          Boutique
                        </Link>
                        <Link
                          href="/tools"
                          onClick={() => setIsSheetOpen(false)}
                          className="text-2xl font-medium hover:text-accent transition-colors py-4 flex items-center"
                        >
                          Écosystème
                        </Link>
                        <Link
                          href="/community"
                          onClick={() => setIsSheetOpen(false)}
                          className="text-2xl font-medium hover:text-accent transition-colors py-4 flex items-center"
                        >
                          Communauté
                        </Link>
                  </Accordion>
                </nav>
              </ScrollArea>
              <div className="p-6 mt-auto border-t border-border flex flex-col gap-4">
                {isClient && (
                    <>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Thème</span>
                          <ThemeToggle />
                        </div>
                        <CartSheet />
                        {user ? (
                            <div className='flex flex-col gap-4'>
                                <Button asChild variant="outline" className="text-lg h-12 rounded-full">
                                    <Link href="/account">Mon Compte</Link>
                                </Button>
                                <Button onClick={handleSignOut} className="text-lg h-12 rounded-full">Déconnexion</Button>
                            </div>
                        ) : (
                            <Button className="text-lg h-12 rounded-full" asChild>
                                <Link href="/login">Accéder à mon espace</Link>
                            </Button>
                        )}
                    </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
