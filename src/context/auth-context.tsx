'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          
          // Ensure backwards compatibility for existing users without isProfileComplete
          const completeUserData = {
            uid: currentUser.uid,
            ...userData,
            isProfileComplete: userData.isProfileComplete ?? (userData.career && userData.career !== '' && userData.skills && userData.skills.length > 0)
          };
          
          setUser(completeUserData as User);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // Ensure backwards compatibility for existing users without isProfileComplete
            const completeUserData = {
              uid: firebaseUser.uid,
              ...userData,
              isProfileComplete: userData.isProfileComplete ?? (userData.career && userData.career !== '' && userData.skills && userData.skills.length > 0)
            };
            
            setUser(completeUserData as User);
          } else {
            // Create a new user document with minimal data - user will complete onboarding
            const newUserData = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email,
              career: '',
              skills: [],
              xp: 0,
              level: 0,
              isProfileComplete: false,
            };
            
            await setDoc(userDocRef, newUserData);
            setUser({ uid: firebaseUser.uid, ...newUserData } as User);
          }
        } catch (error) {
          console.error('Error fetching or creating user document:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
