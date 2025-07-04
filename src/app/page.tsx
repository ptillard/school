
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Building, Briefcase, Users, ShieldCheck, LogIn } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleLogin = (role: UserRole) => {
    login(role);
  };

  type RoleConfig = { name: UserRole; translationKey: string; icon: React.ElementType };

  const roles: RoleConfig[] = [
    { name: 'systemAdmin', translationKey: 'systemAdmin', icon: ShieldCheck },
    { name: 'schoolAdmin', translationKey: 'schoolAdmin', icon: Building },
    { name: 'teacher', translationKey: 'teacher', icon: Briefcase },
    { name: 'parent', translationKey: 'parent', icon: Users },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <SchoolComLogo size={48} className="mb-4" />
          <CardTitle className="font-headline text-3xl">{t('loginPage.welcomeTitle')}</CardTitle>
          <CardDescription className="text-md">
            {t('loginPage.welcomeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((roleItem) => (
            <Button
              key={roleItem.name}
              onClick={() => handleLogin(roleItem.name)}
              className="w-full justify-start text-base py-5 group hover:shadow-lg transition-shadow rounded-lg border border-input bg-background hover:bg-primary hover:text-primary-foreground"
            >
              <roleItem.icon className="mr-3 h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              <div className="text-left">
                <span className="font-semibold">{t(`loginPage.roles.${roleItem.translationKey}.label`)}</span>
                <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                  {t(`loginPage.roles.${roleItem.translationKey}.description`)}
                </p>
              </div>
              <LogIn className="ml-auto h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p dangerouslySetInnerHTML={{ __html: t('loginPage.footer.copyright', { year: currentYear }) }} />
        <p>{t('loginPage.footer.tagline')}</p>
      </footer>
    </div>
  );
}
