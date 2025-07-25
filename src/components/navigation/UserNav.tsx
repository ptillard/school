
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, Sun, Moon, Languages, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

// Dummy useTheme for now
const useTheme = () => {
  const [theme, setThemeState] = useState('light');
  useEffect(() => {
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") || 'light' : 'light';
    setThemeState(storedTheme);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const effectiveTheme = newTheme === 'system' ? 'light' : newTheme; // simplify system for now
    setThemeState(effectiveTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", effectiveTheme);
      document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    }
  };
  return { theme, setTheme };
};


export function UserNav() {
  const { user, role, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleToggleLanguage = () => {
    toggleLanguage();
  };
  
  const profilePath = role === 'parent' || role === 'teacher' ? `/${role}/profile` : `/${role}/settings`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.displayName)}`} alt={user.displayName} data-ai-hint="user avatar" />
            <AvatarFallback className="bg-accent text-accent-foreground">{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-headline">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
              {t('userNav.roleLabel')} {role ? t(`roles.${role}` as any) : t('roles.guest' as any)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={profilePath}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>{t('userNav.profile')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          <span>{t('userNav.toggleTheme')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleLanguage}>
          <Languages className="mr-2 h-4 w-4" />
          <span>{language === 'en' ? t('userNav.switchToSpanish') : t('userNav.switchToEnglish')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <a href="/USER_GUIDE.md" target="_blank" rel="noopener noreferrer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>{t('userNav.userGuide')}</span>
            </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('userNav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
