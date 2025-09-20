'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useFirebaseConnection } from '@/hooks/use-firebase-connection';

export function FirebaseStatus() {
  const { connectionStatus, error } = useFirebaseConnection();

  if (connectionStatus === 'testing') {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Testing Firebase Connection</AlertTitle>
        <AlertDescription>Checking Firebase configuration...</AlertDescription>
      </Alert>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Firebase Connection Error</AlertTitle>
        <AlertDescription>
          {error || 'Unable to connect to Firebase. Please check your configuration.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>Firebase Connected</AlertTitle>
      <AlertDescription>Successfully connected to Firebase services.</AlertDescription>
    </Alert>
  );
}