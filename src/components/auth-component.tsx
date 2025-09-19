

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';

// Mock User type, equivalent to Firebase User but simplified
type MockUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  handleSignIn: (email: string, pass: string) => Promise<void>;
  handleSignUp: (name: string, email: string, pass: string) => Promise<void>;
  handlePasswordReset: (email: string) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: MockUser = {
  uid: 'mock-user-uid',
  displayName: 'Utilisateur Simulé',
  email: 'user@example.com',
  photoURL: imageData.auth.mock_user.src,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if a mock session exists in localStorage
    const savedUser = localStorage.getItem('mockUserSession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleSignIn = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    console.log(`Simulating sign in for ${email}`);
    setUser(mockUser);
    localStorage.setItem('mockUserSession', JSON.stringify(mockUser));
    toast({ description: "Connexion simulée réussie ! Bienvenue." });
    router.push('/account');
    setLoading(false);
  };

  const handleSignUp = async (name: string, email: string, pass: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    console.log(`Simulating sign up for ${name} (${email})`);
    const newUser = { ...mockUser, displayName: name, email };
    setUser(newUser);
    localStorage.setItem('mockUserSession', JSON.stringify(newUser));
    toast({ description: "Inscription simulée réussie ! Bienvenue." });
    router.push('/account');
    setLoading(false);
  };

  const handlePasswordReset = async (email: string) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    console.log(`Simulating password reset for ${email}`);
    toast({ description: "Un e-mail de réinitialisation (simulé) a été envoyé." });
    router.push('/login');
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    await handleSignIn('google-user@example.com', 'fakepass');
  };

  const handleAppleSignIn = async () => {
    await handleSignIn('apple-user@example.com', 'fakepass');
  };

  const handleSignOut = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 300));
    setUser(null);
    localStorage.removeItem('mockUserSession');
    toast({ description: "Vous avez été déconnecté." });
    router.push('/');
    setLoading(false);
  };

  if (loading && typeof window !== 'undefined' && !localStorage.getItem('mockUserSession')) {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, handleSignIn, handleSignUp, handlePasswordReset, handleGoogleSignIn, handleAppleSignIn, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
