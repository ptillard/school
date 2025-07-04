
"use client";

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/navigation/UserNav';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarNavItems: ReactNode; // To be passed from role-specific layouts
}

export function DashboardLayout({ children, sidebarNavItems }: DashboardLayoutProps) {
  const { role, logout } = useAuth();
  const { t } = useTranslation();
  
  const defaultOpen = typeof window !== 'undefined' ? localStorage.getItem('sidebar_state') !== 'false' : true;

  const roleName = role ? t(`roles.${role}`) : t('roles.guest');

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <SchoolComLogo className="text-sidebar-primary" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          {sidebarNavItems}
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Home className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">{t('dashboard.logoutAndHome')}</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block ml-2">
              <Link href={`/${role}`} passHref>
                <Button variant="ghost" className="text-lg font-semibold font-headline">
                  {t('dashboard.title', { role: roleName })}
                </Button>
              </Link>
            </div>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
         <footer className="border-t bg-background/80 px-4 py-3 text-center text-xs text-muted-foreground backdrop-blur-md sm:px-6">
          &copy; {new Date().getFullYear()} SchoolCom. {t('dashboard.allRightsReserved')}
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
