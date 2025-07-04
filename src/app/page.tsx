"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Loader2, Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { language, toggleLanguage } = useLanguage();


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error: any) {
      toast({
        title: t('loginPage.loginFailedTitle'),
        description: error.message || t('loginPage.loginFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="items-center text-center">
          <SchoolComLogo size={48} className="mb-4 text-primary" />
          <CardTitle className="font-headline text-3xl">{t('loginPage.welcomeTitle')}</CardTitle>
          <CardDescription className="text-md">
            {t('loginPage.signInDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loginPage.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('loginPage.passwordLabel')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('loginPage.signInButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-6 w-full max-w-sm rounded-lg border bg-card p-4 text-center text-sm shadow-sm">
        <h4 className="font-semibold text-card-foreground">{t('loginPage.demoInfo.title')}</h4>
        <p className="text-muted-foreground">{t('loginPage.demoInfo.subtitle')}</p>
        <ul className="mt-2 space-y-1 text-left text-xs text-muted-foreground">
          <li><strong>{t('roles.parent')}:</strong> parent@example.com</li>
          <li><strong>{t('roles.teacher')}:</strong> teacher@example.com</li>
          <li><strong>{t('roles.schoolAdmin')}:</strong> school.admin@example.com</li>
          <li><strong>{t('roles.systemAdmin')}:</strong> system.admin@example.com</li>
        </ul>
      </div>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        <Button variant="ghost" onClick={toggleLanguage} className="mb-4">
            <Languages className="mr-2 h-4 w-4" />
            {language === 'en' ? t('userNav.switchToSpanish') : t('userNav.switchToEnglish')}
        </Button>
        <p dangerouslySetInnerHTML={{ __html: t('loginPage.footer.copyright', { year: currentYear }) }} />
        <p>{t('loginPage.footer.tagline')}</p>
      </footer>
    </div>
  );
}
