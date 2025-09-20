'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireProfileComplete = false,
  redirectTo 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(redirectTo || '/login');
        return;
      }

      if (requireProfileComplete && !user.isProfileComplete) {
        router.replace('/onboarding');
        return;
      }

      if (!requireProfileComplete && user.isProfileComplete && redirectTo === '/onboarding') {
        router.replace('/dashboard');
        return;
      }
    }
  }, [user, loading, router, requireProfileComplete, redirectTo]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireProfileComplete && !user.isProfileComplete) {
    return null;
  }

  return <>{children}</>;
}