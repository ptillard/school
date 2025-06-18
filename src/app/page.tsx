
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Building, Briefcase, Users, UserCheck, ShieldCheck, LogIn, UserCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  const roles: { name: UserRole; label: string; icon: React.ElementType, description: string }[] = [
    { name: 'systemAdmin', label: 'System Admin', icon: ShieldCheck, description: "Manage schools and platform settings." },
    { name: 'schoolAdmin', label: 'School Admin', icon: Building, description: "Manage your school, users, and courses." },
    { name: 'teacher', label: 'Teacher', icon: Briefcase, description: "Manage courses, notifications & events."},
    { name: 'parent', label: 'Parent', icon: Users, description: "View your child's updates, notifications, and calendar." },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <SchoolComLogo size={48} className="mb-4" />
          <CardTitle className="font-headline text-3xl">Welcome to SchoolCom</CardTitle>
          <CardDescription className="text-md">
            Your integrated school communication platform. Please select your role to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((roleItem) => (
            <Button
              key={roleItem.name}
              onClick={() => handleLogin(roleItem.name)}
              className="w-full justify-start text-base py-6 group hover:shadow-lg transition-shadow"
              variant="outline"
            >
              <roleItem.icon className="mr-3 h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              <div className="text-left">
                <span className="font-semibold">{roleItem.label}</span>
                <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">{roleItem.description}</p>
              </div>
              <LogIn className="ml-auto h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SchoolCom. All rights reserved.</p>
        <p>Streamlining communication for a brighter future in education.</p>
      </footer>
    </div>
  );
}
