
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Building, Mail, Phone, MessageSquarePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactClient() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    toast({
        title: "Message envoyé !",
        description: "Merci ! Nous reviendrons vers vous très prochainement.",
    });
    setIsFormOpen(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4">
                <Building className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="text-xl font-semibold">Nos Bureaux</h3>
                    <p className="text-muted-foreground">123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                </div>
            </div>
                <div className="flex items-start gap-4">
                <Mail className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-muted-foreground">contact@xyzz.ai</p>
                </div>
            </div>
                <div className="flex items-start gap-4">
                <Phone className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="text-xl font-semibold">Téléphone</h3>
                    <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                </div>
            </div>
        </div>
        <div className="lg:col-span-2">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Card className="glass-card flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[300px]">
                    <MessageSquarePlus className="h-16 w-16 text-primary mb-6" />
                    <h3 className="text-2xl font-bold">Vous avez un projet en tête ?</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Laissez-nous un message et commençons la discussion.</p>
                    <DialogTrigger asChild>
                        <Button size="lg" className="rounded-full">
                            Envoyer un message
                        </Button>
                    </DialogTrigger>
                </Card>

                <DialogContent className="glass-card">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Envoyez-nous un message</DialogTitle>
                            <DialogDescription>Nous vous répondrons dans les plus brefs délais.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input id="name" placeholder="Jean Dupont" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="email@exemple.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Sujet</Label>
                                <Input id="subject" placeholder="Demande de partenariat" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Votre message..." rows={6} required />
                            </div>
                        </div>
                        <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                        <Button type="submit">
                            <Send className="mr-2 h-5 w-5"/>
                            Envoyer
                        </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}
