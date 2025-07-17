
"use client";

import type { ReactNode } from 'react';
import React, from 'react';
import { 
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
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase'; // We'll create this file

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
    const db = getFirestore(firebaseApp);
    const usersCollectionRef = collection(db, 'users');
    
    // Query for the user document where the email matches.
    // This is more robust than relying on the document ID matching the UID.
    const q = query(usersCollectionRef, where("email", "==", firebaseUser.email), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocSnap = querySnapshot.docs[0];
      const userData = userDocSnap.data();
      const userProfile: UserProfile = {
        displayName: userData.displayName || firebaseUser.displayName || 'User',
        email: userData.email || firebaseUser.email || '',
        role: userData.role || null,
      };
      
      // Update last login timestamp on the found document
      await setDoc(userDocSnap.ref, { lastLogin: new Date() }, { merge: true });
      return userProfile;
    } else {
      console.warn(`No user profile found in Firestore for email: ${firebaseUser.email}. This user will have no role.`);
      // Also check if a document with UID exists, as a fallback
      const userDocRefByUid = doc(db, 'users', firebaseUser.uid);
      const userDocSnapByUid = await getDoc(userDocRefByUid);
       if (userDocSnapByUid.exists()) {
          const userData = userDocSnapByUid.data();
          const userProfile: UserProfile = {
            displayName: userData.displayName || firebaseUser.displayName || 'User',
            email: userData.email || firebaseUser.email || '',
            role: userData.role || null,
          };
          await setDoc(userDocRefByUid, { lastLogin: new Date() }, { merge: true });
          return userProfile;
       }
      
      return {
        displayName: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: null, // No profile, no role
      };
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

    // Redirect after login
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
