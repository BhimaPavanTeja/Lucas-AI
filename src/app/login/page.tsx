'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.522,0-10.218-3.818-11.522-8.994l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.153,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect logged-in users to appropriate page
  useEffect(() => {
    if (!authLoading && user) {
      if (user.isProfileComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, authLoading, router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect logic is handled by useEffect hook above
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google.',
      });
    } catch (error: any) {
      let errorMessage = 'An error occurred during Google sign in.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up was blocked. Please enable pop-ups and try again.';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  // Don't render login form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-2xl font-bold text-foreground">
        <Image 
          src="/lucas-logo.png" 
          alt="Lucas AI Logo" 
          width={32} 
          height={32} 
          className="h-8 w-8"
        />
        <span>Lucas</span>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Lucas</CardTitle>
          <CardDescription>Sign in with Google to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            className="w-full" 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2" />
            )}
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
