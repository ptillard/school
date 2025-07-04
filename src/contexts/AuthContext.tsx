"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'systemAdmin' | 'schoolAdmin' | 'teacher' | 'parent' | null;

interface AuthContextType {
  role: UserRole;
  user: { displayName: string; email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      if (storedRole && storedUser) {
        setRole(storedRole);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // In a real app, you'd call Firebase Auth here.
    // For now, we simulate it based on email. The password is ignored.
    let newRole: UserRole = null;
    let displayName: string = 'User';

    if (email.toLowerCase().startsWith('parent')) {
        newRole = 'parent';
        displayName = 'Parent User';
    } else if (email.toLowerCase().startsWith('teacher')) {
        newRole = 'teacher';
        displayName = 'Teacher User';
    } else if (email.toLowerCase().startsWith('school.admin')) {
        newRole = 'schoolAdmin';
        displayName = 'School Admin';
    } else if (email.toLowerCase().startsWith('system.admin')) {
        newRole = 'systemAdmin';
        displayName = 'System Admin';
    }

    if (!newRole) {
        // This error will be caught by the form's onSubmit handler
        throw new Error("Invalid credentials. Please use one of the demo emails.");
    }
    
    const newUser = { displayName, email };
    setRole(newRole);
    setUser(newUser);
    try {
      localStorage.setItem('schoolcom-role', newRole);
      localStorage.setItem('schoolcom-user', JSON.stringify(newUser));
    } catch (error) {
       console.error("Error writing to localStorage", error);
    }

    switch (newRole) {
      case 'systemAdmin': router.push('/system-admin'); break;
      case 'schoolAdmin': router.push('/school-admin'); break;
      case 'teacher': router.push('/teacher'); break;
      case 'parent': router.push('/parent'); break;
      default: router.push('/');
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
