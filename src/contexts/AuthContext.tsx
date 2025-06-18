
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'systemAdmin' | 'schoolAdmin' | 'teacher' | 'parent' | null;

interface AuthContextType {
  role: UserRole;
  user: { displayName: string; email: string } | null;
  isLoading: boolean;
  login: (role: UserRole, user?: { displayName: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<{ displayName: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth status from localStorage or an API
    try {
      const storedRole = localStorage.getItem('schoolcom-role') as UserRole;
      const storedUser = localStorage.getItem('schoolcom-user');
      if (storedRole) {
        setRole(storedRole);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
           setUser({ displayName: `${storedRole.charAt(0).toUpperCase() + storedRole.slice(1)} User`, email: `${storedRole}@example.com` });
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
      // Handle potential SSR or secure environment issues
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newRole: UserRole, newUser?: { displayName: string; email: string }) => {
    const resolvedUser = newUser || { displayName: `${newRole!.charAt(0).toUpperCase() + newRole!.slice(1)} User`, email: `${newRole}@example.com` };
    setRole(newRole);
    setUser(resolvedUser);
    try {
      localStorage.setItem('schoolcom-role', newRole!);
      localStorage.setItem('schoolcom-user', JSON.stringify(resolvedUser));
    } catch (error) {
       console.error("Error writing to localStorage", error);
    }

    switch (newRole) {
      case 'systemAdmin':
        router.push('/system-admin');
        break;
      case 'schoolAdmin':
        router.push('/school-admin');
        break;
      case 'teacher':
        router.push('/teacher');
        break;
      case 'parent':
        router.push('/parent');
        break;
      default:
        router.push('/');
    }
  }, [router]);

  const logout = useCallback(() => {
    setRole(null);
    setUser(null);
    try {
      localStorage.removeItem('schoolcom-role');
      localStorage.removeItem('schoolcom-user');
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (!isLoading && !role && !pathname.startsWith('/auth') && pathname !== '/') {
        // router.push('/'); // Uncomment this to redirect to login if not authenticated
    }
  }, [isLoading, role, pathname, router]);


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
