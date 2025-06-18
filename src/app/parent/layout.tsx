
"use client";
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/navigation/UserNav';
import Link from 'next/link';
import { Bell, CalendarDays, UserCircle, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


export default function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/parent', label: 'Home', icon: Home },
    { href: '/parent/notifications', label: 'Notifications', icon: Bell },
    { href: '/parent/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/parent/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <AuthGuard allowedRoles={['parent']}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <SchoolComLogo />
            <div className="flex items-center space-x-2">
              <UserNav />
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-6">{children}</main>

        <footer className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <nav className="container grid grid-cols-4 items-center justify-items-center gap-1 p-2">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} asChild>
                <Button
                  variant="ghost" // Base variant
                  className={cn(
                    "flex flex-col items-center justify-center h-16 w-full rounded-md", // Layout styles
                    (pathname === item.href || (item.href !== '/parent' && pathname.startsWith(item.href))) ?
                      "text-primary bg-primary/10" : // Active state styles
                      "text-muted-foreground hover:text-primary hover:bg-primary/5" // Default state styles
                  )}
                >
                  {/* Button children are directly rendered; Link + Button handles the <a> tag */}
                  <item.icon className="h-6 w-6 mb-0.5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </footer>

        <footer className="hidden md:block border-t bg-background/95 py-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SchoolCom. All rights reserved.
        </footer>
      </div>
    </AuthGuard>
  );
}
