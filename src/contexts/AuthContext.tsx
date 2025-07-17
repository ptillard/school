
"use client";

import type { ReactNode } from 'react';
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback 
} from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase';

export type UserRole = 'systemAdmin' | 'schoolAdmin' | 'teacher' | 'parent' | null;

interface UserProfile {
  displayName: string;
  email: string;
  role: UserRole;
  lastLogin?: Date;
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
    if (!firebaseUser.uid) return null;
    
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    
    try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userProfile: UserProfile = {
          displayName: userData.displayName || firebaseUser.displayName || 'User',
          email: userData.email || firebaseUser.email || '',
          role: userData.role || null,
        };
        
        // Update last login timestamp without waiting
        await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });

        return userProfile;
      } else {
        console.warn(`No Firestore user document found for UID: ${firebaseUser.uid}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // This will happen if security rules block the read
      return null;
    }
  }, []);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userProfile = await fetchUserProfile(firebaseUser);
        if (userProfile && userProfile.role) {
          setUser(userProfile);
          setRole(userProfile.role);
        } else {
          // If no profile or role, treat as logged out for security
          await signOut(auth);
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getAuth(firebaseApp);
    // The onAuthStateChanged listener will handle fetching the profile and redirecting
    await signInWithEmailAndPassword(auth, email, password);
    // After sign-in, the useEffect listener will fire, fetching the user profile
    // and setting the user/role state, which triggers the correct redirect.
  }, []);

  const logout = useCallback(async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    setUser(null);
    setRole(null);
    router.push('/');
  }, [router]);
  
  // This effect handles redirection after the user state is updated
  useEffect(() => {
    if (!isLoading && user && role) {
      switch (role) {
        case 'systemAdmin': router.push('/system-admin'); break;
        case 'schoolAdmin': router.push('/school-admin'); break;
        case 'teacher': router.push('/teacher'); break;
        case 'parent': router.push('/parent'); break;
        default: router.push('/');
      }
    }
  }, [user, role, isLoading, router]);


  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
