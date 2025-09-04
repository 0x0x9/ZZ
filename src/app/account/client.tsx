
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Settings, Shield, Edit, ChevronRight, Sun, Moon, Bell, MonitorSmartphone, LogOut, Image as ImageIcon, KeyRound, Sparkles, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-component';
import { useIsClient } from '@/hooks/use-is-client';

const initialUser = {
  name: 'John Doe',
  email: 'john.doe@xyzz.ai',
  avatar: 'https://placehold.co/100x100.png',
  plan: 'XOS Pro',
  renewalDate: '24 Août 2024',
};

// Mock Server Actions - In a real app, these would be in `app/actions.ts`
const updateProfileAction = async (data: { name: string; email: string }) => {
    console.log('Updating profile:', data);
    await new Promise(res => setTimeout(res, 500));
    // Simulate success
    return { success: true };
};

const disconnectDeviceAction = async (data: { deviceId: number }) => {
    console.log('Disconnecting device:', data);
    await new Promise(res => setTimeout(res, 500));
    // Simulate success
    return { success: true };
};


const mockProjects = [
    { id: 1, title: 'Projet Nébuleuse (Court-métrage)', imageUrl: 'https://picsum.photos/seed/nebula/300/200', hint: 'nebula space stars' },
    { id: 2, title: 'Lancement Marque de Vêtements', imageUrl: 'https://picsum.photos/seed/clothing/300/200', hint: 'clothing brand fashion' },
    { id: 3, title: 'Identité Visuelle - Nova', imageUrl: 'https://picsum.photos/seed/nova/300/200', hint: 'abstract gradient design' },
];

const initialDevices = [
    { id: 1, name: 'Station X-1 (Actuel)', icon: MonitorSmartphone, location: 'Paris, FR', lastSeen: 'il y a 5 minutes' },
    { id: 2, name: 'MacBook Pro 16"', icon: MonitorSmartphone, location: 'Lyon, FR', lastSeen: 'il y a 2 jours' },
];

const SectionCard = ({ icon, title, description, children, className }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, className?: string }) => {
    return (
        <Card className={`glass-card h-full ${className}`}>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    {icon}
                </div>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

const InfoRow = ({ label, value, action }: { label: string, value: string, action?: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
        {action}
    </div>
);

function EditProfileModal({ open, onOpenChange, user, onUserUpdate }: { open: boolean, onOpenChange: (open: boolean) => void, user: typeof initialUser, onUserUpdate: (data: Partial<typeof initialUser>) => void }) {
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        
        const result = await updateProfileAction({ name, email });

        if (result.success) {
            onUserUpdate({ name, email });
            toast({ title: "Profil mis à jour", description: "Vos modifications ont été enregistrées."});
            onOpenChange(false);
        } else {
            toast({ variant: 'destructive', title: "Erreur", description: "La mise à jour du profil a échoué." });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card p-0 max-w-2xl">
                <Tabs defaultValue="profile" className="w-full">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Modifier le profil</DialogTitle>
                        <DialogDescription>
                            Gérez vos informations personnelles et vos paramètres de sécurité.
                        </DialogDescription>
                        <TabsList className="grid w-full grid-cols-3 mt-4">
                            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profil</TabsTrigger>
                            <TabsTrigger value="password"><KeyRound className="mr-2 h-4 w-4"/>Mot de passe</TabsTrigger>
                            <TabsTrigger value="avatar"><ImageIcon className="mr-2 h-4 w-4"/>Avatar</TabsTrigger>
                        </TabsList>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit}>
                        <TabsContent value="profile" className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input id="name" name="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse e-mail</Label>
                                <Input id="email" name="email" type="email" defaultValue={user.email} />
                            </div>
                        </TabsContent>
                        <TabsContent value="password" className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Mot de passe actuel</Label>
                                <Input id="current_password" type="password" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                                <Input id="new_password" type="password" />
                            </div>
                        </TabsContent>
                        <TabsContent value="avatar" className="p-6 space-y-4 text-center">
                            <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20">
                                <AvatarImage src={user.avatar} data-ai-hint="person portrait" />
                                <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline">Changer l'avatar</Button>
                        </TabsContent>
                        <DialogFooter className="p-6 bg-black/10">
                            <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default function AccountClient() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(initialUser);
    const [devices, setDevices] = useState(initialDevices);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const isClient = useIsClient();
    
    const handleUserUpdate = (data: Partial<typeof initialUser>) => {
        setUser(prev => ({...prev, ...data}));
    }

    const handleDisconnectDevice = async (deviceId: number) => {
        const result = await disconnectDeviceAction({ deviceId });
        if (result.success) {
            setDevices(prev => prev.filter(device => device.id !== deviceId));
            toast({ title: "Appareil déconnecté", description: "L'accès depuis cet appareil a été révoqué." });
        } else {
            toast({ variant: 'destructive', title: "Erreur", description: "La déconnexion a échoué." });
        }
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-7xl mx-auto space-y-8"
        >
             <h1 className="text-3xl md:text-4xl font-bold">
                Bienvenue, {authUser?.displayName || user.name.split(' ')[0]} !
             </h1>
            {/* Profile Section */}
            <Card className="glass-card">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-primary/30 blur-xl animate-pulse" />
                        <Avatar className="w-24 h-24 border-4 border-primary/20 relative z-10">
                            <AvatarImage src={authUser?.photoURL || user.avatar} data-ai-hint="person portrait" />
                            <AvatarFallback>{(authUser?.displayName || user.name).substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{authUser?.displayName || user.name}</h2>
                        <p className="text-muted-foreground">{authUser?.email || user.email}</p>
                    </div>
                    <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier le profil
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan & Billing */}
                <SectionCard
                    icon={<CreditCard className="h-6 w-6 text-primary" />}
                    title="Abonnement & Facturation"
                    description="Gérez votre abonnement et vos factures."
                    className="lg:col-span-1"
                >
                    <InfoRow 
                        label="Plan Actuel" 
                        value={user.plan} 
                        action={<Button variant="ghost" size="sm">Changer <ChevronRight className="ml-1 h-4 w-4"/></Button>}
                    />
                    <Separator />
                    <InfoRow 
                        label="Prochain renouvellement" 
                        value={user.renewalDate} 
                        action={<Button variant="ghost" size="sm">Historique <ChevronRight className="ml-1 h-4 w-4"/></Button>}
                    />
                </SectionCard>

                {/* Preferences */}
                 <SectionCard
                    icon={<Settings className="h-6 w-6 text-primary" />}
                    title="Préférences"
                    description="Personnalisez votre expérience."
                    className="lg:col-span-2"
                >
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between py-2">
                             <div>
                                <p className="font-medium flex items-center gap-2">
                                    {isClient && (theme === 'dark' ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>)}
                                    Thème
                                </p>
                            </div>
                            {isClient && (
                                <Switch
                                    checked={theme === 'dark'}
                                    onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    aria-label="Changer de thème"
                                />
                            )}
                        </div>
                        <InfoRow 
                            label="Langue" 
                            value="Français" 
                            action={<Button variant="ghost" size="sm">Modifier <ChevronRight className="ml-1 h-4 w-4"/></Button>}
                        />
                         <div className="flex items-center justify-between py-2">
                            <div><p className="font-medium flex items-center gap-2"><Bell className="h-4 w-4"/>Notifications</p></div>
                            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                        </div>
                    </div>
                </SectionCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Creative History */}
                <SectionCard
                    icon={<Sparkles className="h-6 w-6 text-primary" />}
                    title="Historique Créatif"
                    description="Vos dernières créations avec les outils (X)yzz."
                >
                    <div className="space-y-4">
                        {mockProjects.map(project => (
                             <motion.div whileHover={{ scale: 1.03 }} key={project.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-background transition-all duration-300">
                                <div className="relative w-20 h-14 rounded-md overflow-hidden shrink-0">
                                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" data-ai-hint={project.hint}/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{project.title}</p>
                                </div>
                                <Button size="sm" variant="ghost">Reprendre <Sparkles className="ml-2 h-4 w-4 text-primary"/></Button>
                            </motion.div>
                        ))}
                    </div>
                </SectionCard>
                 {/* Security & Devices */}
                 <SectionCard
                    icon={<Shield className="h-6 w-6 text-primary" />}
                    title="Appareils Connectés"
                    description="Gérez les appareils ayant accès à votre compte."
                >
                    <div className="space-y-4">
                        {devices.map(device => {
                             const Icon = device.icon;
                             return (
                                 <div key={device.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                                    <Icon className="h-8 w-8 text-muted-foreground shrink-0"/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{device.name}</p>
                                        <p className="text-xs text-muted-foreground">{device.location} • {device.lastSeen}</p>
                                    </div>
                                    <Button onClick={() => handleDisconnectDevice(device.id)} size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10"><LogOut className="mr-2 h-4 w-4"/>Déconnecter</Button>
                                </div>
                             )
                        })}
                    </div>
                </SectionCard>
            </div>
        </motion.div>

        <EditProfileModal open={isEditModalOpen} onOpenChange={setEditModalOpen} user={user} onUserUpdate={handleUserUpdate} />
        </>
    );
}
