

'use client';

import { useCart } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, ArrowLeft, Lock, CreditCard, Plus, Minus, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useIsClient } from "@/hooks/use-is-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-4.82 2.25-3.44 0-6.5-2.85-6.5-6.5s3.06-6.5 6.5-6.5c1.95 0 3.25.75 4.13 1.63l2.89-2.88A12.23 12.23 0 0 0 12.48 0C5.88 0 .01 5.88.01 12.5s5.87 12.5 12.47 12.5c7.05 0 11.9-4.88 11.9-12.02 0-.82-.07-1.55-.2-2.32H12.48z" fill="currentColor"/></svg>
)
const AppleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1"><title>Apple</title><path d="M12.016 6.944c-.77 0-1.54.482-1.924 1.233-.383.751-.383 1.62.006 2.371.388.751 1.16 1.238 1.922 1.238.769 0 1.545-.487 1.928-1.238.384-.75.389-1.62.001-2.371-.387-.751-1.16-1.233-1.923-1.233M16.484 2.182c-1.787-.126-3.553.757-4.475 2.12-.922 1.363-1.484 3.13-1.238 4.887.619.066 1.237.165 1.84.346.548.182 1.096.425 1.688.718 1.238.608 2.222 1.231 2.972 1.231.75 0 1.689-.597 2.977-1.244.603-.298 1.144-.536 1.688-.718.608-.182 1.22-.28 1.84-.346.246-2.073-.487-4.103-1.845-5.596-1.357-1.493-3.237-2.45-5.437-2.45Z" fill="currentColor"/></svg>
)
const PaypalIcon = () => (
     <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor"><title>PayPal</title><path d="M7.429 6.436H12.11a2.183 2.183 0 0 1 2.155 2.24l-.107 1.026a.434.434 0 0 0 .432.483h.133c.243 0 .432.19.432.426l-.01.033c-.085.43-.312.83-.625 1.155a2.535 2.535 0 0 1-1.84 1.03c-1.332.26-2.225.042-3.333-.69a.434.434 0 0 0-.58.073l-.687.697a.434.434 0 0 0 .06.602c.96.823 2.225 1.244 3.766 1.244 2.802 0 4.536-1.63 4.536-4.137 0-2.885-2.003-4.145-4.493-4.145h-2.14a.434.434 0 0 0-.432.426v.006c0 .237.19.427.432.427h2.803c.89 0 1.48.332 1.548 1.147l.106 1.026a.434.434 0 0 1-.432.483H9.49a2.183 2.183 0 0 1-2.155-2.24l.107-1.026a.434.434 0 0 0-.432-.483H6.878c-.243 0-.432-.19-.432-.426l.01-.034c.085-.43.312-.83.624-1.155C7.428 6.436 7.428 6.436 7.429 6.436zm.432 12.42a.434.434 0 0 0 .432-.426v-.007a.434.434 0 0 0-.432-.426h-2.14a.434.434 0 0 0-.432.426v.006c0 .237.19.427.432.427h2.14zm-3.34-5.543c-.244 0-.433-.19-.433-.426v-.007c0-.236.19-.426.433-.426h12.355c.243 0 .432.19.432.426v.007a.434.434 0 0 1-.432.426H4.52z"/></svg>
)


export default function CheckoutClient() {
    const { items, total, itemCount, removeItem, addItem, decreaseItem } = useCart();
    const { toast } = useToast();
    const isClient = useIsClient();

    const shippingCost = 0; // Livraison gratuite
    const finalTotal = total + shippingCost;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Paiement réussi !",
            description: "Votre commande a été validée. Merci pour votre confiance.",
        });
        useCart.getState().clearCart();
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-8">
                <form onSubmit={handlePayment} className="space-y-8">
                     {/* Contact & Shipping */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-2xl">Informations de livraison</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse e-mail</Label>
                                <Input id="email" type="email" placeholder="email@exemple.com" required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">Prénom</Label>
                                    <Input id="firstname" placeholder="Jean" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Nom</Label>
                                    <Input id="lastname" placeholder="Dupont" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input id="address" placeholder="123 rue de la République" required />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                     <Input placeholder="Ville" required />
                                     <Input placeholder="Code Postal" required />
                                     <Input placeholder="Pays" value="France" readOnly />
                                </div>
                            </div>
                             <div className="space-y-4 pt-4">
                                <Label>Vérifiez sur la carte</Label>
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-card p-1">
                                    <iframe
                                        className="w-full h-full border-0 rounded-xl"
                                        loading="lazy"
                                        allowFullScreen
                                        src="https://maps.google.com/maps?q=123%20rue%20de%20la%20R%C3%A9publique%2C%20Paris%2C%20France&t=&z=13&ie=UTF8&iwloc=&output=embed">
                                    </iframe>
                                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                        <MapPin className="h-10 w-10 text-primary drop-shadow-lg" />
                                    </div>
                                    <div className="absolute top-3 left-3 right-3">
                                        <Input placeholder="Rechercher une adresse..." className="bg-background/80 backdrop-blur-md" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card className="glass-card">
                         <CardHeader>
                            <CardTitle className="text-2xl">Paiement</CardTitle>
                            <CardDescription>Toutes les transactions sont sécurisées et chiffrées.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <Tabs defaultValue="card" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="card">Carte de crédit</TabsTrigger>
                                    <TabsTrigger value="other">Autres méthodes</TabsTrigger>
                                </TabsList>
                                <TabsContent value="card" className="pt-6">
                                     <div className="p-6 rounded-2xl bg-black/20 border border-white/10 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="number">Numéro de carte</Label>
                                            <div className="relative">
                                                <Input id="number" name="number" placeholder="0000 0000 0000 0000" required className="pl-12" />
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom sur la carte</Label>
                                            <Input id="name" name="name" placeholder="Jean Dupont" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiration (MM/AA)</Label>
                                                <Input id="expiry" name="expiry" placeholder="MM/AA" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input id="cvc" name="cvc" placeholder="123" required />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="other" className="pt-6 space-y-3">
                                    <Button variant="outline" className="w-full h-14 bg-black text-white hover:bg-neutral-800 hover:text-white"><AppleIcon /> Payer</Button>
                                    <Button variant="outline" className="w-full h-14"><GoogleIcon /> Payer</Button>
                                    <Button variant="outline" className="w-full h-14"><PaypalIcon /> Payer</Button>
                                </TabsContent>
                            </Tabs>
                         </CardContent>
                    </Card>
                    <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl" disabled={itemCount === 0 || !isClient}>
                        <Lock className="mr-2 h-5 w-5" />
                        Payer {isClient ? finalTotal.toFixed(2) : '...'}€
                    </Button>
                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
                 <div className="glass-card sticky top-28 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Récapitulatif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!isClient ? (
                            <div className="space-y-4">
                                <div className="flex gap-4"><Skeleton className="h-16 w-16 rounded-md" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>
                                <Separator className="bg-white/10" />
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /></div>
                                    <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="flex justify-between"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /></div>
                            </div>
                        ) : items.length > 0 ? (
                            <div className="space-y-4">
                                <ScrollArea className="h-64 pr-4 -mr-4">
                                    <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.cartItemId} className="flex items-start gap-4">
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/10">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground">{item.configuration ? 'Configuré' : 'Standard'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                     <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => decreaseItem(item.cartItemId)}><Minus className="h-3 w-3" /></Button>
                                                     <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                     <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => addItem(item)}><Plus className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">{(item.price * item.quantity).toFixed(2)}€</p>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive mt-1" onClick={() => removeItem(item.cartItemId)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                                <Separator className="bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <Input placeholder="Code promo" className="flex-1" />
                                    <Button variant="outline">Appliquer</Button>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sous-total</span>
                                        <span>{total.toFixed(2)}€</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="text-muted-foreground">Livraison</span>
                                        <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)}€` : 'Gratuite'}</span>
                                    </div>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{finalTotal.toFixed(2)}€</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                <p className="text-lg font-medium">Votre panier est vide.</p>
                                <Button asChild variant="glass" className="mt-4">
                                    <Link href="/store">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Retour à la boutique
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>
        </div>
    );
}
