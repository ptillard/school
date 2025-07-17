
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
  setDoc,
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
  login: (email: string, password:string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const userProfile: UserProfile = {
        displayName: userData.displayName || firebaseUser.displayName || 'User',
        email: userData.email || firebaseUser.email || '',
        role: userData.role || null,
      };
      
      // Update last login timestamp, but don't wait for it to complete
      setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });

      return userProfile;
    } else {
      console.warn(`No Firestore user document found for UID: ${firebaseUser.uid}`);
      return null;
    }
  }, []);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userProfile = await fetchUserProfile(firebaseUser);
        if (userProfile) {
          setUser(userProfile);
          setRole(userProfile.role);
        } else {
          // If no profile, treat as logged out
          setUser(null);
          setRole(null);
          await signOut(auth);
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userProfile = await fetchUserProfile(firebaseUser);
    if (!userProfile || !userProfile.role) {
      await signOut(auth); // Sign out user if they don't have a valid profile/role
      throw new Error("Login failed: User profile or role not found.");
    }

    setUser(userProfile);
    setRole(userProfile.role);

    // Redirect after login based on role
    switch (userProfile.role) {
      case 'systemAdmin': router.push('/system-admin'); break;
      case 'schoolAdmin': router.push('/school-admin'); break;
      case 'teacher': router.push('/teacher'); break;
      case 'parent': router.push('/parent'); break;
      default: router.push('/');
    }
  }, [router, fetchUserProfile]);

  const logout = useCallback(async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    setUser(null);
    setRole(null);
    router.push('/');
  }, [router]);

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
