
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

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarNavItems: ReactNode; // To be passed from role-specific layouts
}

export function DashboardLayout({ children, sidebarNavItems }: DashboardLayoutProps) {
  const { role, logout } = useAuth();
  
  // Determine defaultOpen state based on role or localStorage preference
  const defaultOpen = typeof window !== 'undefined' ? localStorage.getItem('sidebar_state') !== 'false' : true;


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
           <div className="flex items-center"> {/* Ensure items are left-aligned */}
             {/* Icon-only logo: shown only when sidebar is collapsed to icon state */}
             <div className="group-data-[collapsible=icon]:block hidden">
               <SchoolComLogo showText={false} size={28} />
             </div>
             {/* Full logo: shown only when sidebar is expanded */}
             <div className="group-data-[collapsible=icon]:hidden">
                <SchoolComLogo showText={true} className="ml-1" size={28} />
             </div>
           </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {sidebarNavItems}
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
          <Button variant="ghost" onClick={logout} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <Home className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Logout & Home</span>
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
                  {role?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Dashboard
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
          &copy; {new Date().getFullYear()} SchoolCom. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
