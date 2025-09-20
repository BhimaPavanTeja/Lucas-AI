'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

export function useFirebaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('testing');
        
        // Test Firebase Auth
        if (!auth) {
          throw new Error('Firebase auth not initialized');
        }

        // Test Firestore connection
        if (!db) {
          throw new Error('Firestore not initialized');
        }

        // If user is authenticated, test reading a document
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          await getDoc(userDocRef);
        }

        setConnectionStatus('connected');
        setError(null);
      } catch (err: any) {
        console.error('Firebase connection test failed:', err);
        setConnectionStatus('error');
        setError(err.message);
      }
    };

    testConnection();
  }, [user]);

  return { connectionStatus, error };
}